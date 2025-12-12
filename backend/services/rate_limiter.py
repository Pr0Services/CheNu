"""
CHE·NU Unified - Rate Limiter
═══════════════════════════════════════════════════════════════════════════════
Rate limiting pour les appels API avec support:
- Token Bucket
- Sliding Window
- Fixed Window
- Per-provider limits

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import defaultdict
from enum import Enum
import asyncio
import time
import logging
import functools

logger = logging.getLogger("CHE·NU.Utils.RateLimiter")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class RateLimitAlgorithm(str, Enum):
    TOKEN_BUCKET = "token_bucket"
    SLIDING_WINDOW = "sliding_window"
    FIXED_WINDOW = "fixed_window"


class RateLimitScope(str, Enum):
    GLOBAL = "global"
    PER_USER = "per_user"
    PER_KEY = "per_key"
    PER_PROVIDER = "per_provider"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class RateLimitConfig:
    """Configuration de rate limiting."""
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    requests_per_day: int = 10000
    
    burst_size: int = 10
    
    algorithm: RateLimitAlgorithm = RateLimitAlgorithm.TOKEN_BUCKET
    scope: RateLimitScope = RateLimitScope.GLOBAL


@dataclass
class RateLimitState:
    """État du rate limiter."""
    tokens: float = 0
    last_update: float = field(default_factory=time.time)
    
    # Sliding window
    request_times: list = field(default_factory=list)
    
    # Fixed window
    window_start: float = field(default_factory=time.time)
    window_count: int = 0


@dataclass
class RateLimitResult:
    """Résultat d'une vérification de rate limit."""
    allowed: bool
    remaining: int
    reset_at: datetime
    retry_after_seconds: Optional[int] = None
    
    limit: int = 0
    used: int = 0


# ═══════════════════════════════════════════════════════════════════════════════
# TOKEN BUCKET LIMITER
# ═══════════════════════════════════════════════════════════════════════════════

class TokenBucketLimiter:
    """
    Token Bucket Rate Limiter
    
    - Tokens are added at a constant rate
    - Allows bursting up to bucket capacity
    - Smooth rate limiting
    """
    
    def __init__(
        self,
        rate: float,  # tokens per second
        capacity: int  # max tokens
    ):
        self.rate = rate
        self.capacity = capacity
        self._states: Dict[str, RateLimitState] = {}
        self._lock = asyncio.Lock()
    
    def _get_state(self, key: str) -> RateLimitState:
        if key not in self._states:
            self._states[key] = RateLimitState(tokens=self.capacity)
        return self._states[key]
    
    def _refill(self, state: RateLimitState) -> None:
        """Refill tokens based on time elapsed."""
        now = time.time()
        elapsed = now - state.last_update
        
        # Add tokens
        state.tokens = min(
            self.capacity,
            state.tokens + elapsed * self.rate
        )
        state.last_update = now
    
    async def acquire(self, key: str = "default", tokens: int = 1) -> RateLimitResult:
        """Try to acquire tokens."""
        async with self._lock:
            state = self._get_state(key)
            self._refill(state)
            
            if state.tokens >= tokens:
                state.tokens -= tokens
                return RateLimitResult(
                    allowed=True,
                    remaining=int(state.tokens),
                    reset_at=datetime.now() + timedelta(seconds=self.capacity / self.rate),
                    limit=self.capacity,
                    used=self.capacity - int(state.tokens)
                )
            else:
                # Calculate wait time
                needed = tokens - state.tokens
                wait_seconds = int(needed / self.rate) + 1
                
                return RateLimitResult(
                    allowed=False,
                    remaining=0,
                    reset_at=datetime.now() + timedelta(seconds=wait_seconds),
                    retry_after_seconds=wait_seconds,
                    limit=self.capacity,
                    used=self.capacity
                )
    
    async def wait_and_acquire(self, key: str = "default", tokens: int = 1) -> None:
        """Wait until tokens are available, then acquire."""
        while True:
            result = await self.acquire(key, tokens)
            if result.allowed:
                return
            await asyncio.sleep(result.retry_after_seconds or 1)


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDING WINDOW LIMITER
# ═══════════════════════════════════════════════════════════════════════════════

class SlidingWindowLimiter:
    """
    Sliding Window Rate Limiter
    
    - Counts requests in a rolling time window
    - More accurate than fixed window
    - Higher memory usage
    """
    
    def __init__(
        self,
        max_requests: int,
        window_seconds: int
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._states: Dict[str, RateLimitState] = {}
        self._lock = asyncio.Lock()
    
    def _get_state(self, key: str) -> RateLimitState:
        if key not in self._states:
            self._states[key] = RateLimitState()
        return self._states[key]
    
    def _clean_old_requests(self, state: RateLimitState) -> None:
        """Remove requests outside the window."""
        cutoff = time.time() - self.window_seconds
        state.request_times = [t for t in state.request_times if t > cutoff]
    
    async def acquire(self, key: str = "default") -> RateLimitResult:
        """Try to make a request."""
        async with self._lock:
            state = self._get_state(key)
            self._clean_old_requests(state)
            
            current_count = len(state.request_times)
            
            if current_count < self.max_requests:
                state.request_times.append(time.time())
                return RateLimitResult(
                    allowed=True,
                    remaining=self.max_requests - current_count - 1,
                    reset_at=datetime.now() + timedelta(seconds=self.window_seconds),
                    limit=self.max_requests,
                    used=current_count + 1
                )
            else:
                # Find when oldest request expires
                oldest = min(state.request_times)
                retry_after = int(oldest + self.window_seconds - time.time()) + 1
                
                return RateLimitResult(
                    allowed=False,
                    remaining=0,
                    reset_at=datetime.fromtimestamp(oldest + self.window_seconds),
                    retry_after_seconds=max(1, retry_after),
                    limit=self.max_requests,
                    used=current_count
                )


# ═══════════════════════════════════════════════════════════════════════════════
# FIXED WINDOW LIMITER
# ═══════════════════════════════════════════════════════════════════════════════

class FixedWindowLimiter:
    """
    Fixed Window Rate Limiter
    
    - Simple time-based windows
    - Can have edge-case bursting at window boundaries
    - Low memory usage
    """
    
    def __init__(
        self,
        max_requests: int,
        window_seconds: int
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._states: Dict[str, RateLimitState] = {}
        self._lock = asyncio.Lock()
    
    def _get_state(self, key: str) -> RateLimitState:
        if key not in self._states:
            self._states[key] = RateLimitState()
        return self._states[key]
    
    def _check_window(self, state: RateLimitState) -> None:
        """Reset window if expired."""
        now = time.time()
        if now - state.window_start >= self.window_seconds:
            state.window_start = now
            state.window_count = 0
    
    async def acquire(self, key: str = "default") -> RateLimitResult:
        """Try to make a request."""
        async with self._lock:
            state = self._get_state(key)
            self._check_window(state)
            
            if state.window_count < self.max_requests:
                state.window_count += 1
                remaining = self.max_requests - state.window_count
                reset_at = datetime.fromtimestamp(state.window_start + self.window_seconds)
                
                return RateLimitResult(
                    allowed=True,
                    remaining=remaining,
                    reset_at=reset_at,
                    limit=self.max_requests,
                    used=state.window_count
                )
            else:
                reset_at = datetime.fromtimestamp(state.window_start + self.window_seconds)
                retry_after = int(state.window_start + self.window_seconds - time.time()) + 1
                
                return RateLimitResult(
                    allowed=False,
                    remaining=0,
                    reset_at=reset_at,
                    retry_after_seconds=max(1, retry_after),
                    limit=self.max_requests,
                    used=state.window_count
                )


# ═══════════════════════════════════════════════════════════════════════════════
# PROVIDER RATE LIMITS
# ═══════════════════════════════════════════════════════════════════════════════

# Known API rate limits
PROVIDER_LIMITS: Dict[str, Dict[str, int]] = {
    "stripe": {"requests_per_second": 100, "burst": 200},
    "shopify": {"requests_per_second": 2, "burst": 40},  # 2/sec with leaky bucket
    "hubspot": {"requests_per_second": 10, "daily": 250000},
    "quickbooks": {"requests_per_minute": 500, "concurrent": 10},
    "xero": {"requests_per_minute": 60, "daily": 5000},
    "mailchimp": {"requests_per_second": 10, "concurrent": 10},
    "sendgrid": {"requests_per_second": 100},
    "slack": {"requests_per_minute": 50, "burst": 20},
    "salesforce": {"requests_per_day": 15000, "concurrent": 25},
    "asana": {"requests_per_minute": 150, "burst": 50},
    "jira": {"requests_per_second": 10},
    "zendesk": {"requests_per_minute": 700, "burst": 100},
}


class ProviderRateLimiter:
    """
    Rate limiter spécifique par provider API.
    """
    
    def __init__(self):
        self._limiters: Dict[str, TokenBucketLimiter] = {}
        self._init_limiters()
    
    def _init_limiters(self) -> None:
        """Initialize limiters for known providers."""
        for provider, limits in PROVIDER_LIMITS.items():
            if "requests_per_second" in limits:
                rate = limits["requests_per_second"]
                capacity = limits.get("burst", rate * 2)
            elif "requests_per_minute" in limits:
                rate = limits["requests_per_minute"] / 60
                capacity = limits.get("burst", int(rate * 10))
            else:
                rate = 1
                capacity = 10
            
            self._limiters[provider] = TokenBucketLimiter(rate, capacity)
    
    async def acquire(self, provider: str, key: str = "default") -> RateLimitResult:
        """Acquire permission to call a provider."""
        if provider not in self._limiters:
            # Unknown provider - create permissive limiter
            self._limiters[provider] = TokenBucketLimiter(rate=10, capacity=100)
        
        return await self._limiters[provider].acquire(f"{provider}:{key}")
    
    async def wait_and_call(
        self,
        provider: str,
        func: Callable,
        *args,
        key: str = "default",
        **kwargs
    ) -> Any:
        """Wait for rate limit, then call function."""
        while True:
            result = await self.acquire(provider, key)
            if result.allowed:
                return await func(*args, **kwargs)
            
            logger.warning(f"Rate limited for {provider}, waiting {result.retry_after_seconds}s")
            await asyncio.sleep(result.retry_after_seconds or 1)


# Singleton
_provider_limiter: Optional[ProviderRateLimiter] = None


def get_provider_limiter() -> ProviderRateLimiter:
    global _provider_limiter
    if _provider_limiter is None:
        _provider_limiter = ProviderRateLimiter()
    return _provider_limiter


# ═══════════════════════════════════════════════════════════════════════════════
# DECORATORS
# ═══════════════════════════════════════════════════════════════════════════════

def rate_limit(
    max_requests: int = 60,
    window_seconds: int = 60,
    algorithm: RateLimitAlgorithm = RateLimitAlgorithm.SLIDING_WINDOW,
    key_func: Optional[Callable] = None
):
    """
    Decorator for rate limiting async functions.
    
    Usage:
        @rate_limit(max_requests=10, window_seconds=60)
        async def my_api_call():
            ...
    """
    if algorithm == RateLimitAlgorithm.SLIDING_WINDOW:
        limiter = SlidingWindowLimiter(max_requests, window_seconds)
    elif algorithm == RateLimitAlgorithm.FIXED_WINDOW:
        limiter = FixedWindowLimiter(max_requests, window_seconds)
    else:
        limiter = TokenBucketLimiter(max_requests / window_seconds, max_requests)
    
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Determine key
            if key_func:
                key = key_func(*args, **kwargs)
            else:
                key = "default"
            
            # Check rate limit
            result = await limiter.acquire(key)
            
            if not result.allowed:
                raise RateLimitExceeded(
                    f"Rate limit exceeded. Retry after {result.retry_after_seconds}s",
                    result
                )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


def rate_limit_provider(provider: str):
    """
    Decorator for provider-specific rate limiting.
    
    Usage:
        @rate_limit_provider("shopify")
        async def call_shopify_api():
            ...
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            limiter = get_provider_limiter()
            
            result = await limiter.acquire(provider)
            
            if not result.allowed:
                logger.warning(f"Rate limited for {provider}, waiting...")
                await asyncio.sleep(result.retry_after_seconds or 1)
                # Retry once
                result = await limiter.acquire(provider)
                if not result.allowed:
                    raise RateLimitExceeded(
                        f"Rate limit exceeded for {provider}",
                        result
                    )
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


# ═══════════════════════════════════════════════════════════════════════════════
# EXCEPTIONS
# ═══════════════════════════════════════════════════════════════════════════════

class RateLimitExceeded(Exception):
    """Exception raised when rate limit is exceeded."""
    
    def __init__(self, message: str, result: RateLimitResult):
        super().__init__(message)
        self.result = result
        self.retry_after = result.retry_after_seconds


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "RateLimitAlgorithm",
    "RateLimitScope",
    
    # Data Classes
    "RateLimitConfig",
    "RateLimitState",
    "RateLimitResult",
    
    # Limiters
    "TokenBucketLimiter",
    "SlidingWindowLimiter",
    "FixedWindowLimiter",
    "ProviderRateLimiter",
    
    # Functions
    "get_provider_limiter",
    
    # Decorators
    "rate_limit",
    "rate_limit_provider",
    
    # Constants
    "PROVIDER_LIMITS",
    
    # Exceptions
    "RateLimitExceeded"
]
