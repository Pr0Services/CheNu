"""
CHE·NU Backend - User Preferences Routes
========================================

Complete user preferences management.
"""

from typing import Dict, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMAS
# ═══════════════════════════════════════════════════════════════════════════════

class ProfilePreferences(BaseModel):
    firstName: str = ""
    lastName: str = ""
    email: str = ""
    phone: str = ""
    avatar: str = ""
    company: str = ""
    role: str = ""
    rbqLicense: str = ""
    ccqCard: str = ""
    cnesstNumber: str = ""


class AppearancePreferences(BaseModel):
    theme: str = "cosmic"  # cosmic, ancient, futurist, realistic, auto
    density: str = "balanced"  # compact, balanced, comfortable
    fontSize: str = "medium"  # small, medium, large
    colorMode: str = "dark"  # dark, light, system
    animations: bool = True
    reducedMotion: bool = False


class NotificationPreferences(BaseModel):
    email: bool = True
    push: bool = True
    sms: bool = False
    desktop: bool = True
    projectUpdates: bool = True
    taskReminders: bool = True
    teamMessages: bool = True
    systemAlerts: bool = True
    marketingEmails: bool = False
    weeklyDigest: bool = True
    quietHoursEnabled: bool = False
    quietHoursStart: str = "22:00"
    quietHoursEnd: str = "07:00"


class SecurityPreferences(BaseModel):
    twoFactorEnabled: bool = False
    twoFactorMethod: str = "app"  # app, sms, email
    sessionTimeout: int = 60  # minutes
    loginNotifications: bool = True
    activityLogging: bool = True
    dataSharing: bool = False
    analyticsEnabled: bool = True


class NovaPreferences(BaseModel):
    enabled: bool = True
    voiceEnabled: bool = False
    autoSuggestions: bool = True
    contextAwareness: bool = True
    learningEnabled: bool = True
    personalityStyle: str = "professional"  # professional, friendly, concise
    language: str = "fr"  # fr, en, auto
    responseSpeed: str = "balanced"  # fast, balanced, detailed


class WorkspacePreferences(BaseModel):
    defaultSphere: str = "entreprise"
    sidebarCollapsed: bool = False
    showQuickActions: bool = True
    dashboardLayout: str = "grid"  # grid, list, kanban
    calendarFirstDay: int = 1  # 0=Sunday, 1=Monday
    dateFormat: str = "DD/MM/YYYY"
    timeFormat: str = "24h"
    timezone: str = "America/Montreal"
    currency: str = "CAD"


class IntegrationPreferences(BaseModel):
    googleCalendar: bool = False
    microsoftOutlook: bool = False
    slack: bool = False
    quickbooks: bool = False
    dropbox: bool = False
    googleDrive: bool = False


class AccessibilityPreferences(BaseModel):
    highContrast: bool = False
    screenReaderOptimized: bool = False
    keyboardNavigation: bool = True
    focusIndicators: bool = True
    textToSpeech: bool = False
    autoPlayMedia: bool = True


class UserPreferences(BaseModel):
    """Complete user preferences."""
    profile: ProfilePreferences = ProfilePreferences()
    appearance: AppearancePreferences = AppearancePreferences()
    notifications: NotificationPreferences = NotificationPreferences()
    security: SecurityPreferences = SecurityPreferences()
    nova: NovaPreferences = NovaPreferences()
    workspace: WorkspacePreferences = WorkspacePreferences()
    integrations: IntegrationPreferences = IntegrationPreferences()
    accessibility: AccessibilityPreferences = AccessibilityPreferences()
    
    class Config:
        from_attributes = True


class PreferencesUpdate(BaseModel):
    """Partial preferences update."""
    profile: Optional[Dict[str, Any]] = None
    appearance: Optional[Dict[str, Any]] = None
    notifications: Optional[Dict[str, Any]] = None
    security: Optional[Dict[str, Any]] = None
    nova: Optional[Dict[str, Any]] = None
    workspace: Optional[Dict[str, Any]] = None
    integrations: Optional[Dict[str, Any]] = None
    accessibility: Optional[Dict[str, Any]] = None


# ═══════════════════════════════════════════════════════════════════════════════
# IN-MEMORY STORE (Replace with database in production)
# ═══════════════════════════════════════════════════════════════════════════════

_preferences_store: Dict[str, UserPreferences] = {}


def get_default_preferences() -> UserPreferences:
    """Get default preferences."""
    return UserPreferences()


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("", response_model=UserPreferences)
async def get_preferences(user_id: str = "default"):
    """
    Get user preferences.
    
    Returns complete preferences object with all categories.
    """
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    return _preferences_store[user_id]


@router.put("", response_model=UserPreferences)
async def update_preferences(
    preferences: PreferencesUpdate,
    user_id: str = "default"
):
    """
    Update user preferences.
    
    Accepts partial updates - only provided fields are changed.
    """
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    current = _preferences_store[user_id]
    
    # Update each category if provided
    if preferences.profile:
        for k, v in preferences.profile.items():
            if hasattr(current.profile, k):
                setattr(current.profile, k, v)
    
    if preferences.appearance:
        for k, v in preferences.appearance.items():
            if hasattr(current.appearance, k):
                setattr(current.appearance, k, v)
    
    if preferences.notifications:
        for k, v in preferences.notifications.items():
            if hasattr(current.notifications, k):
                setattr(current.notifications, k, v)
    
    if preferences.security:
        for k, v in preferences.security.items():
            if hasattr(current.security, k):
                setattr(current.security, k, v)
    
    if preferences.nova:
        for k, v in preferences.nova.items():
            if hasattr(current.nova, k):
                setattr(current.nova, k, v)
    
    if preferences.workspace:
        for k, v in preferences.workspace.items():
            if hasattr(current.workspace, k):
                setattr(current.workspace, k, v)
    
    if preferences.integrations:
        for k, v in preferences.integrations.items():
            if hasattr(current.integrations, k):
                setattr(current.integrations, k, v)
    
    if preferences.accessibility:
        for k, v in preferences.accessibility.items():
            if hasattr(current.accessibility, k):
                setattr(current.accessibility, k, v)
    
    _preferences_store[user_id] = current
    return current


@router.post("/reset", response_model=UserPreferences)
async def reset_preferences(user_id: str = "default"):
    """Reset preferences to defaults."""
    _preferences_store[user_id] = get_default_preferences()
    return _preferences_store[user_id]


@router.get("/export")
async def export_preferences(user_id: str = "default"):
    """Export all user preferences as JSON."""
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    prefs = _preferences_store[user_id]
    return {
        "exported_at": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "preferences": prefs.model_dump(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# CATEGORY-SPECIFIC ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/appearance", response_model=AppearancePreferences)
async def get_appearance_preferences(user_id: str = "default"):
    """Get appearance preferences only."""
    prefs = await get_preferences(user_id)
    return prefs.appearance


@router.put("/appearance", response_model=AppearancePreferences)
async def update_appearance_preferences(
    appearance: AppearancePreferences,
    user_id: str = "default"
):
    """Update appearance preferences."""
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    _preferences_store[user_id].appearance = appearance
    return appearance


@router.get("/notifications", response_model=NotificationPreferences)
async def get_notification_preferences(user_id: str = "default"):
    """Get notification preferences only."""
    prefs = await get_preferences(user_id)
    return prefs.notifications


@router.put("/notifications", response_model=NotificationPreferences)
async def update_notification_preferences(
    notifications: NotificationPreferences,
    user_id: str = "default"
):
    """Update notification preferences."""
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    _preferences_store[user_id].notifications = notifications
    return notifications


@router.get("/nova", response_model=NovaPreferences)
async def get_nova_preferences(user_id: str = "default"):
    """Get Nova AI preferences only."""
    prefs = await get_preferences(user_id)
    return prefs.nova


@router.put("/nova", response_model=NovaPreferences)
async def update_nova_preferences(
    nova: NovaPreferences,
    user_id: str = "default"
):
    """Update Nova AI preferences."""
    if user_id not in _preferences_store:
        _preferences_store[user_id] = get_default_preferences()
    
    _preferences_store[user_id].nova = nova
    return nova


@router.get("/security", response_model=SecurityPreferences)
async def get_security_preferences(user_id: str = "default"):
    """Get security preferences only."""
    prefs = await get_preferences(user_id)
    return prefs.security


@router.get("/workspace", response_model=WorkspacePreferences)
async def get_workspace_preferences(user_id: str = "default"):
    """Get workspace preferences only."""
    prefs = await get_preferences(user_id)
    return prefs.workspace
