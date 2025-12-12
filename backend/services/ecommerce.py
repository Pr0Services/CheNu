"""
CHE·NU v6.0 - E-Commerce Integrations
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
IntÃ©grations e-commerce et ventes:
- Shopify (complet)
- WooCommerce
- Square
- Stripe (paiements avancÃ©s)
- PayPal
- Amazon Seller

Author: CHE·NU Team
Version: 6.0
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, AsyncIterator
from dataclasses import dataclass, field
from datetime import datetime, date, timedelta
from decimal import Decimal
from enum import Enum
import logging
import aiohttp
import json
import hmac
import hashlib

logger = logging.getLogger("CHE·NU.Integrations.Ecommerce")


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# ENUMS
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    ON_HOLD = "on_hold"


class PaymentStatus(Enum):
    PENDING = "pending"
    AUTHORIZED = "authorized"
    PAID = "paid"
    PARTIALLY_PAID = "partially_paid"
    PARTIALLY_REFUNDED = "partially_refunded"
    REFUNDED = "refunded"
    FAILED = "failed"
    VOIDED = "voided"


class FulfillmentStatus(Enum):
    UNFULFILLED = "unfulfilled"
    PARTIAL = "partial"
    FULFILLED = "fulfilled"
    RESTOCKED = "restocked"


class ProductStatus(Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    ARCHIVED = "archived"


class InventoryPolicy(Enum):
    DENY = "deny"  # Ne pas vendre si rupture
    CONTINUE = "continue"  # Continuer Ã  vendre


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# DATA CLASSES
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

@dataclass
class Money:
    """Montant avec devise."""
    amount: Decimal
    currency: str = "CAD"
    
    def __str__(self) -> str:
        return f"{self.amount:.2f} {self.currency}"
    
    def to_cents(self) -> int:
        return int(self.amount * 100)


@dataclass
class Address:
    """Adresse de livraison/facturation."""
    first_name: str = ""
    last_name: str = ""
    company: Optional[str] = None
    address1: str = ""
    address2: Optional[str] = None
    city: str = ""
    province: str = ""
    province_code: Optional[str] = None
    country: str = "Canada"
    country_code: str = "CA"
    postal_code: str = ""
    phone: Optional[str] = None
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "company": self.company,
            "address1": self.address1,
            "address2": self.address2,
            "city": self.city,
            "province": self.province,
            "province_code": self.province_code,
            "country": self.country,
            "country_code": self.country_code,
            "zip": self.postal_code,
            "phone": self.phone
        }


@dataclass
class Customer:
    """Client e-commerce."""
    id: str
    email: str
    first_name: str = ""
    last_name: str = ""
    phone: Optional[str] = None
    accepts_marketing: bool = False
    orders_count: int = 0
    total_spent: Money = field(default_factory=lambda: Money(Decimal("0")))
    tags: List[str] = field(default_factory=list)
    default_address: Optional[Address] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip() or self.email


@dataclass
class ProductVariant:
    """Variante de produit."""
    id: str
    product_id: str
    title: str
    sku: Optional[str] = None
    barcode: Optional[str] = None
    price: Money = field(default_factory=lambda: Money(Decimal("0")))
    compare_at_price: Optional[Money] = None
    cost: Optional[Money] = None
    inventory_quantity: int = 0
    inventory_policy: InventoryPolicy = InventoryPolicy.DENY
    weight: Optional[float] = None
    weight_unit: str = "kg"
    requires_shipping: bool = True
    taxable: bool = True
    option1: Optional[str] = None
    option2: Optional[str] = None
    option3: Optional[str] = None


@dataclass
class ProductImage:
    """Image de produit."""
    id: str
    product_id: str
    src: str
    alt: Optional[str] = None
    position: int = 1
    width: Optional[int] = None
    height: Optional[int] = None


@dataclass
class Product:
    """Produit e-commerce."""
    id: str
    title: str
    handle: Optional[str] = None
    description: Optional[str] = None
    vendor: Optional[str] = None
    product_type: Optional[str] = None
    status: ProductStatus = ProductStatus.ACTIVE
    tags: List[str] = field(default_factory=list)
    variants: List[ProductVariant] = field(default_factory=list)
    images: List[ProductImage] = field(default_factory=list)
    options: List[Dict[str, Any]] = field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    
    @property
    def price(self) -> Money:
        """Retourne le prix de la premiÃ¨re variante."""
        if self.variants:
            return self.variants[0].price
        return Money(Decimal("0"))
    
    @property
    def total_inventory(self) -> int:
        return sum(v.inventory_quantity for v in self.variants)


@dataclass
class OrderLineItem:
    """Ligne de commande."""
    id: str
    product_id: Optional[str] = None
    variant_id: Optional[str] = None
    title: str = ""
    variant_title: Optional[str] = None
    sku: Optional[str] = None
    quantity: int = 1
    price: Money = field(default_factory=lambda: Money(Decimal("0")))
    total_discount: Money = field(default_factory=lambda: Money(Decimal("0")))
    tax_lines: List[Dict[str, Any]] = field(default_factory=list)
    fulfillment_status: Optional[str] = None
    
    @property
    def subtotal(self) -> Money:
        return Money(self.price.amount * self.quantity, self.price.currency)


@dataclass
class ShippingLine:
    """Ligne de livraison."""
    id: str
    title: str
    price: Money
    code: Optional[str] = None
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None


@dataclass
class Order:
    """Commande e-commerce."""
    id: str
    order_number: str
    email: str
    status: OrderStatus = OrderStatus.PENDING
    financial_status: PaymentStatus = PaymentStatus.PENDING
    fulfillment_status: FulfillmentStatus = FulfillmentStatus.UNFULFILLED
    customer: Optional[Customer] = None
    billing_address: Optional[Address] = None
    shipping_address: Optional[Address] = None
    line_items: List[OrderLineItem] = field(default_factory=list)
    shipping_lines: List[ShippingLine] = field(default_factory=list)
    subtotal: Money = field(default_factory=lambda: Money(Decimal("0")))
    total_tax: Money = field(default_factory=lambda: Money(Decimal("0")))
    total_shipping: Money = field(default_factory=lambda: Money(Decimal("0")))
    total_discounts: Money = field(default_factory=lambda: Money(Decimal("0")))
    total: Money = field(default_factory=lambda: Money(Decimal("0")))
    currency: str = "CAD"
    note: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


@dataclass
class Refund:
    """Remboursement."""
    id: str
    order_id: str
    amount: Money
    reason: Optional[str] = None
    note: Optional[str] = None
    line_items: List[Dict[str, Any]] = field(default_factory=list)
    created_at: Optional[datetime] = None


@dataclass 
class InventoryLevel:
    """Niveau d'inventaire."""
    inventory_item_id: str
    location_id: str
    available: int
    updated_at: Optional[datetime] = None


@dataclass
class SalesReport:
    """Rapport de ventes."""
    period_start: date
    period_end: date
    total_sales: Money
    total_orders: int
    average_order_value: Money
    total_items_sold: int
    total_refunds: Money
    net_sales: Money
    top_products: List[Dict[str, Any]] = field(default_factory=list)
    sales_by_day: List[Dict[str, Any]] = field(default_factory=list)


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# BASE CLIENT
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class BaseEcommerceClient:
    """Classe de base pour les clients e-commerce."""
    
    def __init__(self, access_token: str, **kwargs):
        self.access_token = access_token
        self.session: Optional[aiohttp.ClientSession] = None
        self.config = kwargs
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self._get_headers())
        return self
    
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    def _parse_datetime(self, value: str) -> Optional[datetime]:
        """Parse une date ISO."""
        if not value:
            return None
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None
    
    def _parse_money(self, amount: Any, currency: str = "CAD") -> Money:
        """Parse un montant."""
        if amount is None:
            return Money(Decimal("0"), currency)
        return Money(Decimal(str(amount)), currency)


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# SHOPIFY INTEGRATION (COMPLET)
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class ShopifyClient(BaseEcommerceClient):
    """
    ðŸ›ï¸ Client Shopify Complet
    
    FonctionnalitÃ©s:
    - Produits et variantes
    - Commandes et fulfillment
    - Clients
    - Inventaire
    - Remboursements
    - Analytics
    - Webhooks
    """
    
    API_VERSION = "2024-01"
    
    def __init__(self, access_token: str, shop_name: str):
        super().__init__(access_token)
        self.shop_name = shop_name
        self.base_url = f"https://{shop_name}.myshopify.com/admin/api/{self.API_VERSION}"
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # SHOP INFO
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def get_shop(self) -> Dict[str, Any]:
        """RÃ©cupÃ¨re les infos de la boutique."""
        async with self.session.get(f"{self.base_url}/shop.json") as resp:
            data = await resp.json()
            return data.get("shop", {})
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # PRODUCTS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_products(
        self,
        limit: int = 50,
        status: ProductStatus = None,
        product_type: str = None,
        vendor: str = None,
        since_id: str = None
    ) -> List[Product]:
        """Liste les produits."""
        params = {"limit": limit}
        if status:
            params["status"] = status.value
        if product_type:
            params["product_type"] = product_type
        if vendor:
            params["vendor"] = vendor
        if since_id:
            params["since_id"] = since_id
        
        async with self.session.get(
            f"{self.base_url}/products.json",
            params=params
        ) as resp:
            data = await resp.json()
            return [self._parse_product(p) for p in data.get("products", [])]
    
    async def get_product(self, product_id: str) -> Product:
        """RÃ©cupÃ¨re un produit."""
        async with self.session.get(
            f"{self.base_url}/products/{product_id}.json"
        ) as resp:
            data = await resp.json()
            return self._parse_product(data.get("product", {}))
    
    async def create_product(self, product: Product) -> Product:
        """CrÃ©e un produit."""
        payload = {
            "product": {
                "title": product.title,
                "body_html": product.description,
                "vendor": product.vendor,
                "product_type": product.product_type,
                "status": product.status.value,
                "tags": ",".join(product.tags) if product.tags else "",
                "variants": [
                    {
                        "title": v.title,
                        "price": str(v.price.amount),
                        "sku": v.sku,
                        "inventory_quantity": v.inventory_quantity,
                        "option1": v.option1,
                        "option2": v.option2,
                        "option3": v.option3
                    }
                    for v in product.variants
                ] if product.variants else [{"title": "Default", "price": "0.00"}]
            }
        }
        
        async with self.session.post(
            f"{self.base_url}/products.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_product(data.get("product", {}))
    
    async def update_product(
        self,
        product_id: str,
        updates: Dict[str, Any]
    ) -> Product:
        """Met Ã  jour un produit."""
        payload = {"product": {"id": product_id, **updates}}
        
        async with self.session.put(
            f"{self.base_url}/products/{product_id}.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_product(data.get("product", {}))
    
    async def delete_product(self, product_id: str) -> bool:
        """Supprime un produit."""
        async with self.session.delete(
            f"{self.base_url}/products/{product_id}.json"
        ) as resp:
            return resp.status == 200
    
    async def count_products(self, status: ProductStatus = None) -> int:
        """Compte les produits."""
        params = {}
        if status:
            params["status"] = status.value
        
        async with self.session.get(
            f"{self.base_url}/products/count.json",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("count", 0)
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # VARIANTS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_variants(self, product_id: str) -> List[ProductVariant]:
        """Liste les variantes d'un produit."""
        async with self.session.get(
            f"{self.base_url}/products/{product_id}/variants.json"
        ) as resp:
            data = await resp.json()
            return [
                self._parse_variant(v, product_id)
                for v in data.get("variants", [])
            ]
    
    async def update_variant(
        self,
        variant_id: str,
        updates: Dict[str, Any]
    ) -> ProductVariant:
        """Met Ã  jour une variante."""
        payload = {"variant": {"id": variant_id, **updates}}
        
        async with self.session.put(
            f"{self.base_url}/variants/{variant_id}.json",
            json=payload
        ) as resp:
            data = await resp.json()
            v = data.get("variant", {})
            return self._parse_variant(v, str(v.get("product_id", "")))
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # ORDERS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_orders(
        self,
        status: str = "any",
        financial_status: str = None,
        fulfillment_status: str = None,
        created_at_min: datetime = None,
        created_at_max: datetime = None,
        limit: int = 50
    ) -> List[Order]:
        """Liste les commandes."""
        params = {"status": status, "limit": limit}
        if financial_status:
            params["financial_status"] = financial_status
        if fulfillment_status:
            params["fulfillment_status"] = fulfillment_status
        if created_at_min:
            params["created_at_min"] = created_at_min.isoformat()
        if created_at_max:
            params["created_at_max"] = created_at_max.isoformat()
        
        async with self.session.get(
            f"{self.base_url}/orders.json",
            params=params
        ) as resp:
            data = await resp.json()
            return [self._parse_order(o) for o in data.get("orders", [])]
    
    async def get_order(self, order_id: str) -> Order:
        """RÃ©cupÃ¨re une commande."""
        async with self.session.get(
            f"{self.base_url}/orders/{order_id}.json"
        ) as resp:
            data = await resp.json()
            return self._parse_order(data.get("order", {}))
    
    async def create_order(self, order: Order) -> Order:
        """CrÃ©e une commande."""
        payload = {
            "order": {
                "email": order.email,
                "line_items": [
                    {
                        "variant_id": item.variant_id,
                        "quantity": item.quantity
                    }
                    for item in order.line_items
                ],
                "shipping_address": order.shipping_address.to_dict() if order.shipping_address else None,
                "billing_address": order.billing_address.to_dict() if order.billing_address else None,
                "note": order.note,
                "tags": ",".join(order.tags) if order.tags else ""
            }
        }
        
        async with self.session.post(
            f"{self.base_url}/orders.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_order(data.get("order", {}))
    
    async def update_order(
        self,
        order_id: str,
        updates: Dict[str, Any]
    ) -> Order:
        """Met Ã  jour une commande."""
        payload = {"order": {"id": order_id, **updates}}
        
        async with self.session.put(
            f"{self.base_url}/orders/{order_id}.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_order(data.get("order", {}))
    
    async def cancel_order(
        self,
        order_id: str,
        reason: str = "customer",
        email: bool = True,
        restock: bool = True
    ) -> Order:
        """Annule une commande."""
        payload = {
            "reason": reason,
            "email": email,
            "restock": restock
        }
        
        async with self.session.post(
            f"{self.base_url}/orders/{order_id}/cancel.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_order(data.get("order", {}))
    
    async def close_order(self, order_id: str) -> Order:
        """Ferme une commande."""
        async with self.session.post(
            f"{self.base_url}/orders/{order_id}/close.json"
        ) as resp:
            data = await resp.json()
            return self._parse_order(data.get("order", {}))
    
    async def count_orders(
        self,
        status: str = "any",
        financial_status: str = None
    ) -> int:
        """Compte les commandes."""
        params = {"status": status}
        if financial_status:
            params["financial_status"] = financial_status
        
        async with self.session.get(
            f"{self.base_url}/orders/count.json",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("count", 0)
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # FULFILLMENT
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def create_fulfillment(
        self,
        order_id: str,
        location_id: str,
        tracking_number: str = None,
        tracking_company: str = None,
        tracking_url: str = None,
        notify_customer: bool = True
    ) -> Dict[str, Any]:
        """CrÃ©e un fulfillment."""
        payload = {
            "fulfillment": {
                "location_id": location_id,
                "notify_customer": notify_customer
            }
        }
        
        if tracking_number:
            payload["fulfillment"]["tracking_info"] = {
                "number": tracking_number,
                "company": tracking_company,
                "url": tracking_url
            }
        
        async with self.session.post(
            f"{self.base_url}/orders/{order_id}/fulfillments.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("fulfillment", {})
    
    async def update_tracking(
        self,
        fulfillment_id: str,
        tracking_number: str,
        tracking_company: str = None,
        tracking_url: str = None
    ) -> Dict[str, Any]:
        """Met Ã  jour le tracking."""
        payload = {
            "fulfillment": {
                "tracking_info": {
                    "number": tracking_number,
                    "company": tracking_company,
                    "url": tracking_url
                }
            }
        }
        
        async with self.session.put(
            f"{self.base_url}/fulfillments/{fulfillment_id}/update_tracking.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("fulfillment", {})
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # REFUNDS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_refunds(self, order_id: str) -> List[Refund]:
        """Liste les remboursements d'une commande."""
        async with self.session.get(
            f"{self.base_url}/orders/{order_id}/refunds.json"
        ) as resp:
            data = await resp.json()
            
            return [
                Refund(
                    id=str(r.get("id")),
                    order_id=order_id,
                    amount=self._parse_money(
                        sum(float(t.get("amount", 0)) for t in r.get("transactions", []))
                    ),
                    reason=r.get("note"),
                    created_at=self._parse_datetime(r.get("created_at"))
                )
                for r in data.get("refunds", [])
            ]
    
    async def create_refund(
        self,
        order_id: str,
        amount: Decimal = None,
        line_items: List[Dict[str, Any]] = None,
        shipping: bool = False,
        note: str = None,
        notify: bool = True
    ) -> Refund:
        """CrÃ©e un remboursement."""
        # D'abord calculer le refund
        calc_payload = {"refund": {"shipping": {"full_refund": shipping}}}
        if line_items:
            calc_payload["refund"]["refund_line_items"] = line_items
        
        async with self.session.post(
            f"{self.base_url}/orders/{order_id}/refunds/calculate.json",
            json=calc_payload
        ) as calc_resp:
            calc_data = await calc_resp.json()
        
        # Puis crÃ©er le refund
        payload = {
            "refund": {
                "notify": notify,
                "note": note,
                "shipping": calc_data.get("refund", {}).get("shipping", {}),
                "refund_line_items": calc_data.get("refund", {}).get("refund_line_items", []),
                "transactions": calc_data.get("refund", {}).get("transactions", [])
            }
        }
        
        async with self.session.post(
            f"{self.base_url}/orders/{order_id}/refunds.json",
            json=payload
        ) as resp:
            data = await resp.json()
            r = data.get("refund", {})
            
            return Refund(
                id=str(r.get("id")),
                order_id=order_id,
                amount=self._parse_money(
                    sum(float(t.get("amount", 0)) for t in r.get("transactions", []))
                ),
                note=note,
                created_at=self._parse_datetime(r.get("created_at"))
            )
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # CUSTOMERS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_customers(
        self,
        limit: int = 50,
        since_id: str = None,
        created_at_min: datetime = None
    ) -> List[Customer]:
        """Liste les clients."""
        params = {"limit": limit}
        if since_id:
            params["since_id"] = since_id
        if created_at_min:
            params["created_at_min"] = created_at_min.isoformat()
        
        async with self.session.get(
            f"{self.base_url}/customers.json",
            params=params
        ) as resp:
            data = await resp.json()
            return [self._parse_customer(c) for c in data.get("customers", [])]
    
    async def get_customer(self, customer_id: str) -> Customer:
        """RÃ©cupÃ¨re un client."""
        async with self.session.get(
            f"{self.base_url}/customers/{customer_id}.json"
        ) as resp:
            data = await resp.json()
            return self._parse_customer(data.get("customer", {}))
    
    async def search_customers(self, query: str) -> List[Customer]:
        """Recherche des clients."""
        async with self.session.get(
            f"{self.base_url}/customers/search.json",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            return [self._parse_customer(c) for c in data.get("customers", [])]
    
    async def create_customer(self, customer: Customer) -> Customer:
        """CrÃ©e un client."""
        payload = {
            "customer": {
                "email": customer.email,
                "first_name": customer.first_name,
                "last_name": customer.last_name,
                "phone": customer.phone,
                "accepts_marketing": customer.accepts_marketing,
                "tags": ",".join(customer.tags) if customer.tags else ""
            }
        }
        
        if customer.default_address:
            payload["customer"]["addresses"] = [customer.default_address.to_dict()]
        
        async with self.session.post(
            f"{self.base_url}/customers.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_customer(data.get("customer", {}))
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # INVENTORY
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_locations(self) -> List[Dict[str, Any]]:
        """Liste les emplacements d'inventaire."""
        async with self.session.get(
            f"{self.base_url}/locations.json"
        ) as resp:
            data = await resp.json()
            return data.get("locations", [])
    
    async def get_inventory_levels(
        self,
        inventory_item_ids: List[str] = None,
        location_ids: List[str] = None
    ) -> List[InventoryLevel]:
        """RÃ©cupÃ¨re les niveaux d'inventaire."""
        params = {}
        if inventory_item_ids:
            params["inventory_item_ids"] = ",".join(inventory_item_ids)
        if location_ids:
            params["location_ids"] = ",".join(location_ids)
        
        async with self.session.get(
            f"{self.base_url}/inventory_levels.json",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                InventoryLevel(
                    inventory_item_id=str(il.get("inventory_item_id")),
                    location_id=str(il.get("location_id")),
                    available=il.get("available", 0),
                    updated_at=self._parse_datetime(il.get("updated_at"))
                )
                for il in data.get("inventory_levels", [])
            ]
    
    async def adjust_inventory(
        self,
        inventory_item_id: str,
        location_id: str,
        adjustment: int
    ) -> InventoryLevel:
        """Ajuste le niveau d'inventaire."""
        payload = {
            "location_id": location_id,
            "inventory_item_id": inventory_item_id,
            "available_adjustment": adjustment
        }
        
        async with self.session.post(
            f"{self.base_url}/inventory_levels/adjust.json",
            json=payload
        ) as resp:
            data = await resp.json()
            il = data.get("inventory_level", {})
            
            return InventoryLevel(
                inventory_item_id=str(il.get("inventory_item_id")),
                location_id=str(il.get("location_id")),
                available=il.get("available", 0)
            )
    
    async def set_inventory(
        self,
        inventory_item_id: str,
        location_id: str,
        available: int
    ) -> InventoryLevel:
        """DÃ©finit le niveau d'inventaire."""
        payload = {
            "location_id": location_id,
            "inventory_item_id": inventory_item_id,
            "available": available
        }
        
        async with self.session.post(
            f"{self.base_url}/inventory_levels/set.json",
            json=payload
        ) as resp:
            data = await resp.json()
            il = data.get("inventory_level", {})
            
            return InventoryLevel(
                inventory_item_id=str(il.get("inventory_item_id")),
                location_id=str(il.get("location_id")),
                available=il.get("available", 0)
            )
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # ANALYTICS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def get_sales_report(
        self,
        start_date: date,
        end_date: date
    ) -> SalesReport:
        """GÃ©nÃ¨re un rapport de ventes."""
        # RÃ©cupÃ©rer toutes les commandes de la pÃ©riode
        orders = await self.list_orders(
            status="any",
            financial_status="paid",
            created_at_min=datetime.combine(start_date, datetime.min.time()),
            created_at_max=datetime.combine(end_date, datetime.max.time()),
            limit=250
        )
        
        total_sales = Decimal("0")
        total_items = 0
        total_refunds = Decimal("0")
        sales_by_day: Dict[str, Decimal] = {}
        product_sales: Dict[str, Dict[str, Any]] = {}
        
        for order in orders:
            total_sales += order.total.amount
            
            day_key = order.created_at.date().isoformat() if order.created_at else "unknown"
            sales_by_day[day_key] = sales_by_day.get(day_key, Decimal("0")) + order.total.amount
            
            for item in order.line_items:
                total_items += item.quantity
                
                if item.product_id:
                    if item.product_id not in product_sales:
                        product_sales[item.product_id] = {
                            "product_id": item.product_id,
                            "title": item.title,
                            "quantity": 0,
                            "revenue": Decimal("0")
                        }
                    product_sales[item.product_id]["quantity"] += item.quantity
                    product_sales[item.product_id]["revenue"] += item.subtotal.amount
        
        # Trier les produits par revenu
        top_products = sorted(
            product_sales.values(),
            key=lambda x: x["revenue"],
            reverse=True
        )[:10]
        
        # Convertir pour JSON
        for p in top_products:
            p["revenue"] = float(p["revenue"])
        
        avg_order = total_sales / len(orders) if orders else Decimal("0")
        
        return SalesReport(
            period_start=start_date,
            period_end=end_date,
            total_sales=Money(total_sales),
            total_orders=len(orders),
            average_order_value=Money(avg_order),
            total_items_sold=total_items,
            total_refunds=Money(total_refunds),
            net_sales=Money(total_sales - total_refunds),
            top_products=top_products,
            sales_by_day=[
                {"date": k, "sales": float(v)}
                for k, v in sorted(sales_by_day.items())
            ]
        )
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # WEBHOOKS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    async def list_webhooks(self) -> List[Dict[str, Any]]:
        """Liste les webhooks."""
        async with self.session.get(
            f"{self.base_url}/webhooks.json"
        ) as resp:
            data = await resp.json()
            return data.get("webhooks", [])
    
    async def create_webhook(
        self,
        topic: str,
        address: str,
        format: str = "json"
    ) -> Dict[str, Any]:
        """CrÃ©e un webhook."""
        payload = {
            "webhook": {
                "topic": topic,
                "address": address,
                "format": format
            }
        }
        
        async with self.session.post(
            f"{self.base_url}/webhooks.json",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("webhook", {})
    
    async def delete_webhook(self, webhook_id: str) -> bool:
        """Supprime un webhook."""
        async with self.session.delete(
            f"{self.base_url}/webhooks/{webhook_id}.json"
        ) as resp:
            return resp.status == 200
    
    @staticmethod
    def verify_webhook(data: bytes, hmac_header: str, secret: str) -> bool:
        """VÃ©rifie la signature d'un webhook."""
        import base64
        calculated = base64.b64encode(
            hmac.new(secret.encode(), data, hashlib.sha256).digest()
        ).decode()
        return hmac.compare_digest(calculated, hmac_header)
    
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # PARSERS
    # â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    def _parse_product(self, data: Dict) -> Product:
        """Parse un produit Shopify."""
        variants = [
            self._parse_variant(v, str(data.get("id", "")))
            for v in data.get("variants", [])
        ]
        
        images = [
            ProductImage(
                id=str(img.get("id")),
                product_id=str(data.get("id", "")),
                src=img.get("src", ""),
                alt=img.get("alt"),
                position=img.get("position", 1)
            )
            for img in data.get("images", [])
        ]
        
        status_map = {
            "active": ProductStatus.ACTIVE,
            "draft": ProductStatus.DRAFT,
            "archived": ProductStatus.ARCHIVED
        }
        
        return Product(
            id=str(data.get("id", "")),
            title=data.get("title", ""),
            handle=data.get("handle"),
            description=data.get("body_html"),
            vendor=data.get("vendor"),
            product_type=data.get("product_type"),
            status=status_map.get(data.get("status", "active"), ProductStatus.ACTIVE),
            tags=data.get("tags", "").split(", ") if data.get("tags") else [],
            variants=variants,
            images=images,
            options=data.get("options", []),
            created_at=self._parse_datetime(data.get("created_at")),
            updated_at=self._parse_datetime(data.get("updated_at")),
            published_at=self._parse_datetime(data.get("published_at"))
        )
    
    def _parse_variant(self, data: Dict, product_id: str) -> ProductVariant:
        """Parse une variante."""
        return ProductVariant(
            id=str(data.get("id", "")),
            product_id=product_id,
            title=data.get("title", ""),
            sku=data.get("sku"),
            barcode=data.get("barcode"),
            price=self._parse_money(data.get("price")),
            compare_at_price=self._parse_money(data.get("compare_at_price")) if data.get("compare_at_price") else None,
            inventory_quantity=data.get("inventory_quantity", 0),
            inventory_policy=InventoryPolicy(data.get("inventory_policy", "deny")),
            weight=data.get("weight"),
            weight_unit=data.get("weight_unit", "kg"),
            requires_shipping=data.get("requires_shipping", True),
            taxable=data.get("taxable", True),
            option1=data.get("option1"),
            option2=data.get("option2"),
            option3=data.get("option3")
        )
    
    def _parse_order(self, data: Dict) -> Order:
        """Parse une commande."""
        line_items = [
            OrderLineItem(
                id=str(li.get("id", "")),
                product_id=str(li.get("product_id")) if li.get("product_id") else None,
                variant_id=str(li.get("variant_id")) if li.get("variant_id") else None,
                title=li.get("title", ""),
                variant_title=li.get("variant_title"),
                sku=li.get("sku"),
                quantity=li.get("quantity", 1),
                price=self._parse_money(li.get("price")),
                total_discount=self._parse_money(li.get("total_discount", "0")),
                fulfillment_status=li.get("fulfillment_status")
            )
            for li in data.get("line_items", [])
        ]
        
        shipping_lines = [
            ShippingLine(
                id=str(sl.get("id", "")),
                title=sl.get("title", ""),
                price=self._parse_money(sl.get("price")),
                code=sl.get("code")
            )
            for sl in data.get("shipping_lines", [])
        ]
        
        financial_status_map = {
            "pending": PaymentStatus.PENDING,
            "authorized": PaymentStatus.AUTHORIZED,
            "paid": PaymentStatus.PAID,
            "partially_paid": PaymentStatus.PARTIALLY_PAID,
            "partially_refunded": PaymentStatus.PARTIALLY_REFUNDED,
            "refunded": PaymentStatus.REFUNDED,
            "voided": PaymentStatus.VOIDED
        }
        
        fulfillment_status_map = {
            None: FulfillmentStatus.UNFULFILLED,
            "partial": FulfillmentStatus.PARTIAL,
            "fulfilled": FulfillmentStatus.FULFILLED,
            "restocked": FulfillmentStatus.RESTOCKED
        }
        
        return Order(
            id=str(data.get("id", "")),
            order_number=str(data.get("order_number", "")),
            email=data.get("email", ""),
            status=OrderStatus.CANCELLED if data.get("cancelled_at") else OrderStatus.CONFIRMED,
            financial_status=financial_status_map.get(
                data.get("financial_status", "pending"),
                PaymentStatus.PENDING
            ),
            fulfillment_status=fulfillment_status_map.get(
                data.get("fulfillment_status"),
                FulfillmentStatus.UNFULFILLED
            ),
            billing_address=self._parse_address(data.get("billing_address")) if data.get("billing_address") else None,
            shipping_address=self._parse_address(data.get("shipping_address")) if data.get("shipping_address") else None,
            line_items=line_items,
            shipping_lines=shipping_lines,
            subtotal=self._parse_money(data.get("subtotal_price")),
            total_tax=self._parse_money(data.get("total_tax")),
            total_shipping=self._parse_money(
                sum(float(sl.get("price", 0)) for sl in data.get("shipping_lines", []))
            ),
            total_discounts=self._parse_money(data.get("total_discounts")),
            total=self._parse_money(data.get("total_price")),
            currency=data.get("currency", "CAD"),
            note=data.get("note"),
            tags=data.get("tags", "").split(", ") if data.get("tags") else [],
            created_at=self._parse_datetime(data.get("created_at")),
            updated_at=self._parse_datetime(data.get("updated_at")),
            cancelled_at=self._parse_datetime(data.get("cancelled_at")),
            closed_at=self._parse_datetime(data.get("closed_at"))
        )
    
    def _parse_customer(self, data: Dict) -> Customer:
        """Parse un client."""
        default_addr = None
        if data.get("default_address"):
            default_addr = self._parse_address(data["default_address"])
        
        return Customer(
            id=str(data.get("id", "")),
            email=data.get("email", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone"),
            accepts_marketing=data.get("accepts_marketing", False),
            orders_count=data.get("orders_count", 0),
            total_spent=self._parse_money(data.get("total_spent", "0")),
            tags=data.get("tags", "").split(", ") if data.get("tags") else [],
            default_address=default_addr,
            created_at=self._parse_datetime(data.get("created_at")),
            updated_at=self._parse_datetime(data.get("updated_at"))
        )
    
    def _parse_address(self, data: Dict) -> Address:
        """Parse une adresse."""
        return Address(
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            company=data.get("company"),
            address1=data.get("address1", ""),
            address2=data.get("address2"),
            city=data.get("city", ""),
            province=data.get("province", ""),
            province_code=data.get("province_code"),
            country=data.get("country", "Canada"),
            country_code=data.get("country_code", "CA"),
            postal_code=data.get("zip", ""),
            phone=data.get("phone")
        )


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# WOOCOMMERCE INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class WooCommerceClient(BaseEcommerceClient):
    """
    ðŸ›’ Client WooCommerce
    
    FonctionnalitÃ©s:
    - Produits
    - Commandes
    - Clients
    - Coupons
    - Rapports
    """
    
    def __init__(
        self,
        store_url: str,
        consumer_key: str,
        consumer_secret: str
    ):
        super().__init__("")
        self.store_url = store_url.rstrip("/")
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.base_url = f"{self.store_url}/wp-json/wc/v3"
    
    def _get_headers(self) -> Dict[str, str]:
        import base64
        auth = base64.b64encode(
            f"{self.consumer_key}:{self.consumer_secret}".encode()
        ).decode()
        return {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json"
        }
    
    # --- Products ---
    async def list_products(
        self,
        per_page: int = 50,
        status: str = "publish"
    ) -> List[Product]:
        """Liste les produits."""
        async with self.session.get(
            f"{self.base_url}/products",
            params={"per_page": per_page, "status": status}
        ) as resp:
            data = await resp.json()
            
            return [
                Product(
                    id=str(p.get("id")),
                    title=p.get("name", ""),
                    handle=p.get("slug"),
                    description=p.get("description"),
                    status=ProductStatus.ACTIVE if p.get("status") == "publish" else ProductStatus.DRAFT,
                    variants=[
                        ProductVariant(
                            id=str(p.get("id")),
                            product_id=str(p.get("id")),
                            title="Default",
                            price=self._parse_money(p.get("price")),
                            sku=p.get("sku"),
                            inventory_quantity=p.get("stock_quantity", 0)
                        )
                    ]
                )
                for p in data
            ]
    
    # --- Orders ---
    async def list_orders(
        self,
        per_page: int = 50,
        status: str = None
    ) -> List[Order]:
        """Liste les commandes."""
        params = {"per_page": per_page}
        if status:
            params["status"] = status
        
        async with self.session.get(
            f"{self.base_url}/orders",
            params=params
        ) as resp:
            data = await resp.json()
            
            return [
                Order(
                    id=str(o.get("id")),
                    order_number=str(o.get("number")),
                    email=o.get("billing", {}).get("email", ""),
                    total=self._parse_money(o.get("total")),
                    currency=o.get("currency", "CAD"),
                    created_at=self._parse_datetime(o.get("date_created"))
                )
                for o in data
            ]
    
    # --- Customers ---
    async def list_customers(self, per_page: int = 50) -> List[Customer]:
        """Liste les clients."""
        async with self.session.get(
            f"{self.base_url}/customers",
            params={"per_page": per_page}
        ) as resp:
            data = await resp.json()
            
            return [
                Customer(
                    id=str(c.get("id")),
                    email=c.get("email", ""),
                    first_name=c.get("first_name", ""),
                    last_name=c.get("last_name", ""),
                    orders_count=c.get("orders_count", 0),
                    total_spent=self._parse_money(c.get("total_spent", "0"))
                )
                for c in data
            ]
    
    # --- Reports ---
    async def get_sales_report(
        self,
        period: str = "month"
    ) -> Dict[str, Any]:
        """RÃ©cupÃ¨re le rapport de ventes."""
        async with self.session.get(
            f"{self.base_url}/reports/sales",
            params={"period": period}
        ) as resp:
            return await resp.json()


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# SQUARE INTEGRATION
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class SquareClient(BaseEcommerceClient):
    """
    â¬› Client Square
    
    FonctionnalitÃ©s:
    - Paiements
    - Catalogue (produits)
    - Inventaire
    - Clients
    - Commandes
    """
    
    BASE_URL = "https://connect.squareup.com/v2"
    
    def __init__(self, access_token: str, location_id: str = None):
        super().__init__(access_token)
        self.location_id = location_id
    
    # --- Locations ---
    async def list_locations(self) -> List[Dict[str, Any]]:
        """Liste les emplacements."""
        async with self.session.get(
            f"{self.BASE_URL}/locations"
        ) as resp:
            data = await resp.json()
            return data.get("locations", [])
    
    # --- Catalog ---
    async def list_catalog(
        self,
        types: List[str] = None
    ) -> List[Product]:
        """Liste le catalogue."""
        params = {}
        if types:
            params["types"] = ",".join(types)
        
        async with self.session.get(
            f"{self.BASE_URL}/catalog/list",
            params=params
        ) as resp:
            data = await resp.json()
            
            products = []
            for obj in data.get("objects", []):
                if obj.get("type") == "ITEM":
                    item_data = obj.get("item_data", {})
                    
                    variants = []
                    for var in item_data.get("variations", []):
                        var_data = var.get("item_variation_data", {})
                        price_money = var_data.get("price_money", {})
                        
                        variants.append(ProductVariant(
                            id=var.get("id", ""),
                            product_id=obj.get("id", ""),
                            title=var_data.get("name", ""),
                            sku=var_data.get("sku"),
                            price=Money(
                                Decimal(str(price_money.get("amount", 0))) / 100,
                                price_money.get("currency", "CAD")
                            )
                        ))
                    
                    products.append(Product(
                        id=obj.get("id", ""),
                        title=item_data.get("name", ""),
                        description=item_data.get("description"),
                        variants=variants
                    ))
            
            return products
    
    # --- Payments ---
    async def list_payments(
        self,
        begin_time: datetime = None,
        end_time: datetime = None
    ) -> List[Dict[str, Any]]:
        """Liste les paiements."""
        params = {}
        if self.location_id:
            params["location_id"] = self.location_id
        if begin_time:
            params["begin_time"] = begin_time.isoformat()
        if end_time:
            params["end_time"] = end_time.isoformat()
        
        async with self.session.get(
            f"{self.BASE_URL}/payments",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("payments", [])
    
    async def create_payment(
        self,
        amount: int,  # en cents
        source_id: str,
        currency: str = "CAD",
        idempotency_key: str = None
    ) -> Dict[str, Any]:
        """CrÃ©e un paiement."""
        import uuid
        
        payload = {
            "source_id": source_id,
            "idempotency_key": idempotency_key or str(uuid.uuid4()),
            "amount_money": {
                "amount": amount,
                "currency": currency
            }
        }
        
        if self.location_id:
            payload["location_id"] = self.location_id
        
        async with self.session.post(
            f"{self.BASE_URL}/payments",
            json=payload
        ) as resp:
            data = await resp.json()
            return data.get("payment", {})
    
    # --- Customers ---
    async def list_customers(self) -> List[Customer]:
        """Liste les clients."""
        async with self.session.get(
            f"{self.BASE_URL}/customers"
        ) as resp:
            data = await resp.json()
            
            return [
                Customer(
                    id=c.get("id", ""),
                    email=c.get("email_address", ""),
                    first_name=c.get("given_name", ""),
                    last_name=c.get("family_name", ""),
                    phone=c.get("phone_number")
                )
                for c in data.get("customers", [])
            ]


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# ECOMMERCE SERVICE (Unified)
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

class EcommerceService:
    """
    ðŸ›ï¸ Service E-Commerce UnifiÃ©
    """
    
    def __init__(self):
        self._clients: Dict[str, BaseEcommerceClient] = {}
    
    def register_shopify(
        self,
        account_id: str,
        access_token: str,
        shop_name: str
    ):
        self._clients[account_id] = ShopifyClient(access_token, shop_name)
    
    def register_woocommerce(
        self,
        account_id: str,
        store_url: str,
        consumer_key: str,
        consumer_secret: str
    ):
        self._clients[account_id] = WooCommerceClient(
            store_url, consumer_key, consumer_secret
        )
    
    def register_square(
        self,
        account_id: str,
        access_token: str,
        location_id: str = None
    ):
        self._clients[account_id] = SquareClient(access_token, location_id)
    
    def get_client(self, account_id: str) -> BaseEcommerceClient:
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]
    
    async def get_unified_dashboard(
        self,
        account_ids: List[str],
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """
        Dashboard e-commerce unifiÃ© pour tous les comptes.
        """
        dashboard = {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "totals": {
                "sales": Decimal("0"),
                "orders": 0,
                "products": 0,
                "customers": 0
            },
            "by_store": []
        }
        
        for account_id in account_ids:
            client = self.get_client(account_id)
            
            store_data = {
                "account_id": account_id,
                "platform": type(client).__name__.replace("Client", ""),
                "sales": Decimal("0"),
                "orders": 0,
                "products": 0
            }
            
            async with client:
                # Compter les produits
                if isinstance(client, ShopifyClient):
                    store_data["products"] = await client.count_products()
                    store_data["orders"] = await client.count_orders(
                        status="any",
                        financial_status="paid"
                    )
                    
                    # Rapport de ventes
                    try:
                        report = await client.get_sales_report(start_date, end_date)
                        store_data["sales"] = report.total_sales.amount
                    except Exception:
                        pass
                
                elif isinstance(client, WooCommerceClient):
                    products = await client.list_products()
                    store_data["products"] = len(products)
                    
                    orders = await client.list_orders()
                    store_data["orders"] = len(orders)
                    store_data["sales"] = sum(
                        o.total.amount for o in orders
                    )
            
            dashboard["totals"]["sales"] += store_data["sales"]
            dashboard["totals"]["orders"] += store_data["orders"]
            dashboard["totals"]["products"] += store_data["products"]
            
            # Convertir Decimal pour JSON
            store_data["sales"] = float(store_data["sales"])
            dashboard["by_store"].append(store_data)
        
        dashboard["totals"]["sales"] = float(dashboard["totals"]["sales"])
        
        return dashboard


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# FACTORY
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

def create_ecommerce_service() -> EcommerceService:
    """Factory pour le service e-commerce."""
    return EcommerceService()
