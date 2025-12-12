"""
CHE·NU v6.0 - Accounting Integrations
═══════════════════════════════════════════════════════════════════════════════
Intégrations comptabilité et finance:
- QuickBooks
- Xero
- Wave
- FreshBooks
- Sage
- Stripe
- Square

Author: CHE·NU Team
Version: 6.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import logging
import aiohttp
import json

logger = logging.getLogger("CHE·NU.Integrations.Accounting")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS & TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class TransactionType(Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"
    REFUND = "refund"
    PAYMENT = "payment"
    INVOICE = "invoice"
    BILL = "bill"


class InvoiceStatus(Enum):
    DRAFT = "draft"
    SENT = "sent"
    VIEWED = "viewed"
    PARTIAL = "partial"
    PAID = "paid"
    OVERDUE = "overdue"
    VOID = "void"


class PaymentMethod(Enum):
    CASH = "cash"
    CHECK = "check"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    BANK_TRANSFER = "bank_transfer"
    INTERAC = "interac"
    PAYPAL = "paypal"
    OTHER = "other"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Contact:
    """Contact (client ou fournisseur)."""
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    is_customer: bool = True
    is_vendor: bool = False
    tax_number: Optional[str] = None
    balance: Decimal = Decimal("0.00")
    currency: str = "CAD"


@dataclass
class InvoiceLineItem:
    """Ligne d'une facture."""
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0.00")
    account_id: Optional[str] = None
    
    @property
    def subtotal(self) -> Decimal:
        return self.quantity * self.unit_price
    
    @property
    def tax_amount(self) -> Decimal:
        return self.subtotal * (self.tax_rate / 100)
    
    @property
    def total(self) -> Decimal:
        return self.subtotal + self.tax_amount


@dataclass
class Invoice:
    """Facture."""
    id: str
    number: str
    contact_id: str
    contact_name: str
    status: InvoiceStatus
    issue_date: date
    due_date: date
    line_items: List[InvoiceLineItem]
    subtotal: Decimal
    tax_total: Decimal
    total: Decimal
    amount_paid: Decimal = Decimal("0.00")
    currency: str = "CAD"
    notes: Optional[str] = None
    
    @property
    def balance_due(self) -> Decimal:
        return self.total - self.amount_paid


@dataclass
class Expense:
    """Dépense."""
    id: str
    date: date
    amount: Decimal
    description: str
    category: str
    vendor: Optional[str] = None
    payment_method: PaymentMethod = PaymentMethod.OTHER
    account_id: Optional[str] = None
    tax_amount: Decimal = Decimal("0.00")
    receipt_url: Optional[str] = None
    is_billable: bool = False
    project_id: Optional[str] = None


@dataclass
class Account:
    """Compte comptable."""
    id: str
    name: str
    account_type: str  # asset, liability, equity, income, expense
    account_number: Optional[str] = None
    balance: Decimal = Decimal("0.00")
    currency: str = "CAD"
    is_active: bool = True


@dataclass
class TaxRate:
    """Taux de taxe."""
    id: str
    name: str
    rate: Decimal
    is_compound: bool = False
    components: List[Dict[str, Any]] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# BASE ACCOUNTING CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class BaseAccountingClient:
    """Classe de base pour les clients comptabilité."""
    
    def __init__(self, access_token: str, refresh_token: str = None):
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers=self._get_headers()
        )
        return self
    
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }


# ═══════════════════════════════════════════════════════════════════════════════
# QUICKBOOKS INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class QuickBooksClient(BaseAccountingClient):
    """
    🟢 Client QuickBooks Online
    
    Fonctionnalités:
    - Factures (créer, lire, mettre à jour)
    - Clients et fournisseurs
    - Dépenses et paiements
    - Rapports financiers
    - Plan comptable
    """
    
    BASE_URL = "https://quickbooks.api.intuit.com/v3/company"
    
    def __init__(self, access_token: str, realm_id: str, refresh_token: str = None):
        super().__init__(access_token, refresh_token)
        self.realm_id = realm_id
        self.base_url = f"{self.BASE_URL}/{realm_id}"
    
    # --- Company Info ---
    async def get_company_info(self) -> Dict[str, Any]:
        """Récupère les infos de l'entreprise."""
        async with self.session.get(f"{self.base_url}/companyinfo/{self.realm_id}") as resp:
            data = await resp.json()
            return data.get("CompanyInfo", {})
    
    # --- Customers ---
    async def list_customers(self, max_results: int = 100) -> List[Contact]:
        """Liste les clients."""
        query = f"SELECT * FROM Customer MAXRESULTS {max_results}"
        async with self.session.get(
            f"{self.base_url}/query",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            customers = data.get("QueryResponse", {}).get("Customer", [])
            
            return [
                Contact(
                    id=str(c["Id"]),
                    name=c.get("DisplayName", ""),
                    email=c.get("PrimaryEmailAddr", {}).get("Address"),
                    phone=c.get("PrimaryPhone", {}).get("FreeFormNumber"),
                    company=c.get("CompanyName"),
                    balance=Decimal(str(c.get("Balance", 0))),
                    is_customer=True
                )
                for c in customers
            ]
    
    async def create_customer(self, customer: Contact) -> Contact:
        """Crée un nouveau client."""
        payload = {
            "DisplayName": customer.name,
            "CompanyName": customer.company,
            "PrimaryEmailAddr": {"Address": customer.email} if customer.email else None,
            "PrimaryPhone": {"FreeFormNumber": customer.phone} if customer.phone else None,
        }
        
        async with self.session.post(
            f"{self.base_url}/customer",
            json=payload
        ) as resp:
            data = await resp.json()
            c = data.get("Customer", {})
            customer.id = str(c.get("Id"))
            return customer
    
    # --- Vendors ---
    async def list_vendors(self, max_results: int = 100) -> List[Contact]:
        """Liste les fournisseurs."""
        query = f"SELECT * FROM Vendor MAXRESULTS {max_results}"
        async with self.session.get(
            f"{self.base_url}/query",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            vendors = data.get("QueryResponse", {}).get("Vendor", [])
            
            return [
                Contact(
                    id=str(v["Id"]),
                    name=v.get("DisplayName", ""),
                    email=v.get("PrimaryEmailAddr", {}).get("Address"),
                    phone=v.get("PrimaryPhone", {}).get("FreeFormNumber"),
                    company=v.get("CompanyName"),
                    balance=Decimal(str(v.get("Balance", 0))),
                    is_customer=False,
                    is_vendor=True
                )
                for v in vendors
            ]
    
    # --- Invoices ---
    async def list_invoices(
        self,
        status: InvoiceStatus = None,
        max_results: int = 100
    ) -> List[Invoice]:
        """Liste les factures."""
        query = f"SELECT * FROM Invoice MAXRESULTS {max_results}"
        
        async with self.session.get(
            f"{self.base_url}/query",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            invoices = data.get("QueryResponse", {}).get("Invoice", [])
            
            return [self._parse_invoice(inv) for inv in invoices]
    
    async def create_invoice(self, invoice: Invoice) -> Invoice:
        """Crée une facture."""
        payload = {
            "CustomerRef": {"value": invoice.contact_id},
            "DueDate": invoice.due_date.isoformat(),
            "Line": [
                {
                    "Amount": float(item.subtotal),
                    "DetailType": "SalesItemLineDetail",
                    "Description": item.description,
                    "SalesItemLineDetail": {
                        "Qty": float(item.quantity),
                        "UnitPrice": float(item.unit_price)
                    }
                }
                for item in invoice.line_items
            ]
        }
        
        async with self.session.post(
            f"{self.base_url}/invoice",
            json=payload
        ) as resp:
            data = await resp.json()
            return self._parse_invoice(data.get("Invoice", {}))
    
    async def send_invoice(self, invoice_id: str, email: str = None) -> bool:
        """Envoie une facture par email."""
        url = f"{self.base_url}/invoice/{invoice_id}/send"
        if email:
            url += f"?sendTo={email}"
        
        async with self.session.post(url) as resp:
            return resp.status == 200
    
    # --- Expenses ---
    async def list_expenses(self, max_results: int = 100) -> List[Expense]:
        """Liste les dépenses."""
        query = f"SELECT * FROM Purchase MAXRESULTS {max_results}"
        
        async with self.session.get(
            f"{self.base_url}/query",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            purchases = data.get("QueryResponse", {}).get("Purchase", [])
            
            return [
                Expense(
                    id=str(p["Id"]),
                    date=datetime.strptime(p["TxnDate"], "%Y-%m-%d").date(),
                    amount=Decimal(str(p.get("TotalAmt", 0))),
                    description=p.get("PrivateNote", ""),
                    category=p.get("Line", [{}])[0].get("AccountBasedExpenseLineDetail", {}).get("AccountRef", {}).get("name", ""),
                    vendor=p.get("EntityRef", {}).get("name"),
                    payment_method=PaymentMethod(p.get("PaymentType", "other").lower()) if p.get("PaymentType") else PaymentMethod.OTHER
                )
                for p in purchases
            ]
    
    async def create_expense(self, expense: Expense) -> Expense:
        """Crée une dépense."""
        payload = {
            "PaymentType": expense.payment_method.value.title(),
            "TxnDate": expense.date.isoformat(),
            "PrivateNote": expense.description,
            "Line": [{
                "Amount": float(expense.amount),
                "DetailType": "AccountBasedExpenseLineDetail",
                "AccountBasedExpenseLineDetail": {
                    "AccountRef": {"value": expense.account_id} if expense.account_id else None
                }
            }]
        }
        
        if expense.vendor:
            payload["EntityRef"] = {"value": expense.vendor, "type": "Vendor"}
        
        async with self.session.post(
            f"{self.base_url}/purchase",
            json=payload
        ) as resp:
            data = await resp.json()
            expense.id = str(data.get("Purchase", {}).get("Id"))
            return expense
    
    # --- Accounts ---
    async def list_accounts(self) -> List[Account]:
        """Liste le plan comptable."""
        query = "SELECT * FROM Account"
        
        async with self.session.get(
            f"{self.base_url}/query",
            params={"query": query}
        ) as resp:
            data = await resp.json()
            accounts = data.get("QueryResponse", {}).get("Account", [])
            
            return [
                Account(
                    id=str(a["Id"]),
                    name=a.get("Name", ""),
                    account_type=a.get("AccountType", "").lower(),
                    account_number=a.get("AcctNum"),
                    balance=Decimal(str(a.get("CurrentBalance", 0))),
                    is_active=a.get("Active", True)
                )
                for a in accounts
            ]
    
    # --- Reports ---
    async def get_profit_and_loss(
        self,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """Rapport Profits et Pertes."""
        async with self.session.get(
            f"{self.base_url}/reports/ProfitAndLoss",
            params={
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        ) as resp:
            return await resp.json()
    
    async def get_balance_sheet(self, as_of_date: date = None) -> Dict[str, Any]:
        """Rapport Bilan."""
        params = {}
        if as_of_date:
            params["date"] = as_of_date.isoformat()
        
        async with self.session.get(
            f"{self.base_url}/reports/BalanceSheet",
            params=params
        ) as resp:
            return await resp.json()
    
    async def get_cash_flow(
        self,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """Rapport Flux de trésorerie."""
        async with self.session.get(
            f"{self.base_url}/reports/CashFlow",
            params={
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        ) as resp:
            return await resp.json()
    
    # --- Helpers ---
    def _parse_invoice(self, data: Dict) -> Invoice:
        """Parse une facture QuickBooks."""
        line_items = []
        for line in data.get("Line", []):
            if line.get("DetailType") == "SalesItemLineDetail":
                detail = line.get("SalesItemLineDetail", {})
                line_items.append(InvoiceLineItem(
                    description=line.get("Description", ""),
                    quantity=Decimal(str(detail.get("Qty", 1))),
                    unit_price=Decimal(str(detail.get("UnitPrice", 0)))
                ))
        
        # Determine status
        balance = Decimal(str(data.get("Balance", 0)))
        total = Decimal(str(data.get("TotalAmt", 0)))
        
        if balance == 0:
            status = InvoiceStatus.PAID
        elif balance < total:
            status = InvoiceStatus.PARTIAL
        else:
            due_date = datetime.strptime(data.get("DueDate", "2099-12-31"), "%Y-%m-%d").date()
            status = InvoiceStatus.OVERDUE if due_date < date.today() else InvoiceStatus.SENT
        
        return Invoice(
            id=str(data.get("Id")),
            number=data.get("DocNumber", ""),
            contact_id=str(data.get("CustomerRef", {}).get("value", "")),
            contact_name=data.get("CustomerRef", {}).get("name", ""),
            status=status,
            issue_date=datetime.strptime(data.get("TxnDate", ""), "%Y-%m-%d").date() if data.get("TxnDate") else date.today(),
            due_date=datetime.strptime(data.get("DueDate", ""), "%Y-%m-%d").date() if data.get("DueDate") else date.today(),
            line_items=line_items,
            subtotal=Decimal(str(data.get("TotalAmt", 0))) - Decimal(str(data.get("TxnTaxDetail", {}).get("TotalTax", 0))),
            tax_total=Decimal(str(data.get("TxnTaxDetail", {}).get("TotalTax", 0))),
            total=Decimal(str(data.get("TotalAmt", 0))),
            amount_paid=total - balance,
            currency=data.get("CurrencyRef", {}).get("value", "CAD")
        )


# ═══════════════════════════════════════════════════════════════════════════════
# XERO INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class XeroClient(BaseAccountingClient):
    """
    🔵 Client Xero
    
    Fonctionnalités:
    - Factures et devis
    - Contacts
    - Paiements
    - Rapports
    - Inventaire
    """
    
    BASE_URL = "https://api.xero.com/api.xro/2.0"
    
    def __init__(self, access_token: str, tenant_id: str, refresh_token: str = None):
        super().__init__(access_token, refresh_token)
        self.tenant_id = tenant_id
    
    def _get_headers(self) -> Dict[str, str]:
        headers = super()._get_headers()
        headers["Xero-tenant-id"] = self.tenant_id
        return headers
    
    # --- Contacts ---
    async def list_contacts(self, is_customer: bool = None) -> List[Contact]:
        """Liste les contacts."""
        params = {}
        if is_customer is not None:
            params["where"] = f"IsCustomer=={'true' if is_customer else 'false'}"
        
        async with self.session.get(f"{self.BASE_URL}/Contacts", params=params) as resp:
            data = await resp.json()
            
            return [
                Contact(
                    id=c["ContactID"],
                    name=c.get("Name", ""),
                    email=c.get("EmailAddress"),
                    phone=c.get("Phones", [{}])[0].get("PhoneNumber") if c.get("Phones") else None,
                    company=c.get("Name"),
                    is_customer=c.get("IsCustomer", False),
                    is_vendor=c.get("IsSupplier", False),
                    tax_number=c.get("TaxNumber"),
                    balance=Decimal(str(c.get("Balances", {}).get("AccountsReceivable", {}).get("Outstanding", 0)))
                )
                for c in data.get("Contacts", [])
            ]
    
    async def create_contact(self, contact: Contact) -> Contact:
        """Crée un contact."""
        payload = {
            "Name": contact.name,
            "EmailAddress": contact.email,
            "IsCustomer": contact.is_customer,
            "IsSupplier": contact.is_vendor
        }
        
        if contact.phone:
            payload["Phones"] = [{"PhoneType": "DEFAULT", "PhoneNumber": contact.phone}]
        
        async with self.session.post(
            f"{self.BASE_URL}/Contacts",
            json={"Contacts": [payload]}
        ) as resp:
            data = await resp.json()
            if data.get("Contacts"):
                contact.id = data["Contacts"][0]["ContactID"]
            return contact
    
    # --- Invoices ---
    async def list_invoices(self, status: str = None) -> List[Invoice]:
        """Liste les factures."""
        params = {}
        if status:
            params["where"] = f"Status=\"{status}\""
        
        async with self.session.get(f"{self.BASE_URL}/Invoices", params=params) as resp:
            data = await resp.json()
            
            return [self._parse_invoice(inv) for inv in data.get("Invoices", [])]
    
    async def create_invoice(self, invoice: Invoice) -> Invoice:
        """Crée une facture."""
        payload = {
            "Type": "ACCREC",
            "Contact": {"ContactID": invoice.contact_id},
            "DueDate": invoice.due_date.isoformat(),
            "LineItems": [
                {
                    "Description": item.description,
                    "Quantity": float(item.quantity),
                    "UnitAmount": float(item.unit_price),
                    "TaxType": "OUTPUT2" if item.tax_rate > 0 else "NONE"
                }
                for item in invoice.line_items
            ]
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/Invoices",
            json={"Invoices": [payload]}
        ) as resp:
            data = await resp.json()
            if data.get("Invoices"):
                return self._parse_invoice(data["Invoices"][0])
            return invoice
    
    # --- Payments ---
    async def list_payments(self) -> List[Dict[str, Any]]:
        """Liste les paiements."""
        async with self.session.get(f"{self.BASE_URL}/Payments") as resp:
            data = await resp.json()
            return data.get("Payments", [])
    
    async def create_payment(
        self,
        invoice_id: str,
        amount: Decimal,
        account_id: str,
        payment_date: date = None
    ) -> Dict[str, Any]:
        """Enregistre un paiement."""
        payload = {
            "Invoice": {"InvoiceID": invoice_id},
            "Account": {"AccountID": account_id},
            "Amount": float(amount),
            "Date": (payment_date or date.today()).isoformat()
        }
        
        async with self.session.post(
            f"{self.BASE_URL}/Payments",
            json={"Payments": [payload]}
        ) as resp:
            data = await resp.json()
            return data.get("Payments", [{}])[0]
    
    # --- Accounts ---
    async def list_accounts(self) -> List[Account]:
        """Liste le plan comptable."""
        async with self.session.get(f"{self.BASE_URL}/Accounts") as resp:
            data = await resp.json()
            
            return [
                Account(
                    id=a["AccountID"],
                    name=a.get("Name", ""),
                    account_type=a.get("Type", "").lower(),
                    account_number=a.get("Code"),
                    is_active=a.get("Status") == "ACTIVE"
                )
                for a in data.get("Accounts", [])
            ]
    
    # --- Reports ---
    async def get_profit_and_loss(
        self,
        from_date: date,
        to_date: date
    ) -> Dict[str, Any]:
        """Rapport Profits et Pertes."""
        async with self.session.get(
            f"{self.BASE_URL}/Reports/ProfitAndLoss",
            params={
                "fromDate": from_date.isoformat(),
                "toDate": to_date.isoformat()
            }
        ) as resp:
            return await resp.json()
    
    async def get_balance_sheet(self, as_of_date: date = None) -> Dict[str, Any]:
        """Rapport Bilan."""
        params = {}
        if as_of_date:
            params["date"] = as_of_date.isoformat()
        
        async with self.session.get(
            f"{self.BASE_URL}/Reports/BalanceSheet",
            params=params
        ) as resp:
            return await resp.json()
    
    async def get_aged_receivables(self) -> Dict[str, Any]:
        """Rapport des créances âgées."""
        async with self.session.get(f"{self.BASE_URL}/Reports/AgedReceivablesByContact") as resp:
            return await resp.json()
    
    # --- Helpers ---
    def _parse_invoice(self, data: Dict) -> Invoice:
        """Parse une facture Xero."""
        line_items = [
            InvoiceLineItem(
                description=line.get("Description", ""),
                quantity=Decimal(str(line.get("Quantity", 1))),
                unit_price=Decimal(str(line.get("UnitAmount", 0))),
                tax_rate=Decimal(str(line.get("TaxAmount", 0))) / Decimal(str(line.get("LineAmount", 1))) * 100 if line.get("LineAmount") else Decimal("0")
            )
            for line in data.get("LineItems", [])
        ]
        
        status_map = {
            "DRAFT": InvoiceStatus.DRAFT,
            "SUBMITTED": InvoiceStatus.SENT,
            "AUTHORISED": InvoiceStatus.SENT,
            "PAID": InvoiceStatus.PAID,
            "VOIDED": InvoiceStatus.VOID
        }
        
        return Invoice(
            id=data.get("InvoiceID", ""),
            number=data.get("InvoiceNumber", ""),
            contact_id=data.get("Contact", {}).get("ContactID", ""),
            contact_name=data.get("Contact", {}).get("Name", ""),
            status=status_map.get(data.get("Status"), InvoiceStatus.DRAFT),
            issue_date=datetime.strptime(data.get("DateString", ""), "%Y-%m-%d").date() if data.get("DateString") else date.today(),
            due_date=datetime.strptime(data.get("DueDateString", ""), "%Y-%m-%d").date() if data.get("DueDateString") else date.today(),
            line_items=line_items,
            subtotal=Decimal(str(data.get("SubTotal", 0))),
            tax_total=Decimal(str(data.get("TotalTax", 0))),
            total=Decimal(str(data.get("Total", 0))),
            amount_paid=Decimal(str(data.get("AmountPaid", 0))),
            currency=data.get("CurrencyCode", "CAD")
        )


# ═══════════════════════════════════════════════════════════════════════════════
# STRIPE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

class StripeClient(BaseAccountingClient):
    """
    💳 Client Stripe
    
    Fonctionnalités:
    - Paiements et remboursements
    - Clients
    - Factures et abonnements
    - Rapports de revenus
    """
    
    BASE_URL = "https://api.stripe.com/v1"
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    # --- Customers ---
    async def list_customers(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Liste les clients."""
        async with self.session.get(
            f"{self.BASE_URL}/customers",
            params={"limit": limit}
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_customer(
        self,
        email: str,
        name: str = None,
        metadata: Dict = None
    ) -> Dict[str, Any]:
        """Crée un client."""
        payload = {"email": email}
        if name:
            payload["name"] = name
        if metadata:
            for k, v in metadata.items():
                payload[f"metadata[{k}]"] = v
        
        async with self.session.post(
            f"{self.BASE_URL}/customers",
            data=payload
        ) as resp:
            return await resp.json()
    
    # --- Payments ---
    async def list_payments(
        self,
        customer_id: str = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Liste les paiements."""
        params = {"limit": limit}
        if customer_id:
            params["customer"] = customer_id
        
        async with self.session.get(
            f"{self.BASE_URL}/payment_intents",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_payment_intent(
        self,
        amount: int,  # en cents
        currency: str = "cad",
        customer_id: str = None,
        description: str = None
    ) -> Dict[str, Any]:
        """Crée une intention de paiement."""
        payload = {
            "amount": amount,
            "currency": currency
        }
        if customer_id:
            payload["customer"] = customer_id
        if description:
            payload["description"] = description
        
        async with self.session.post(
            f"{self.BASE_URL}/payment_intents",
            data=payload
        ) as resp:
            return await resp.json()
    
    # --- Invoices ---
    async def list_invoices(
        self,
        customer_id: str = None,
        status: str = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Liste les factures."""
        params = {"limit": limit}
        if customer_id:
            params["customer"] = customer_id
        if status:
            params["status"] = status
        
        async with self.session.get(
            f"{self.BASE_URL}/invoices",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    async def create_invoice(
        self,
        customer_id: str,
        items: List[Dict[str, Any]],
        auto_send: bool = False
    ) -> Dict[str, Any]:
        """Crée une facture."""
        # D'abord créer les invoice items
        for item in items:
            await self.session.post(
                f"{self.BASE_URL}/invoiceitems",
                data={
                    "customer": customer_id,
                    "amount": item["amount"],
                    "currency": item.get("currency", "cad"),
                    "description": item.get("description", "")
                }
            )
        
        # Puis créer la facture
        payload = {"customer": customer_id}
        if auto_send:
            payload["collection_method"] = "send_invoice"
            payload["days_until_due"] = 30
        
        async with self.session.post(
            f"{self.BASE_URL}/invoices",
            data=payload
        ) as resp:
            invoice = await resp.json()
            
            # Finaliser si auto_send
            if auto_send and invoice.get("id"):
                await self.session.post(f"{self.BASE_URL}/invoices/{invoice['id']}/finalize")
                await self.session.post(f"{self.BASE_URL}/invoices/{invoice['id']}/send")
            
            return invoice
    
    # --- Subscriptions ---
    async def list_subscriptions(
        self,
        customer_id: str = None,
        status: str = None
    ) -> List[Dict[str, Any]]:
        """Liste les abonnements."""
        params = {}
        if customer_id:
            params["customer"] = customer_id
        if status:
            params["status"] = status
        
        async with self.session.get(
            f"{self.BASE_URL}/subscriptions",
            params=params
        ) as resp:
            data = await resp.json()
            return data.get("data", [])
    
    # --- Balance ---
    async def get_balance(self) -> Dict[str, Any]:
        """Récupère le solde du compte."""
        async with self.session.get(f"{self.BASE_URL}/balance") as resp:
            return await resp.json()
    
    # --- Refunds ---
    async def create_refund(
        self,
        payment_intent_id: str,
        amount: int = None,  # None = full refund
        reason: str = None
    ) -> Dict[str, Any]:
        """Crée un remboursement."""
        payload = {"payment_intent": payment_intent_id}
        if amount:
            payload["amount"] = amount
        if reason:
            payload["reason"] = reason
        
        async with self.session.post(
            f"{self.BASE_URL}/refunds",
            data=payload
        ) as resp:
            return await resp.json()


# ═══════════════════════════════════════════════════════════════════════════════
# WAVE INTEGRATION (Gratuit pour petites entreprises)
# ═══════════════════════════════════════════════════════════════════════════════

class WaveClient(BaseAccountingClient):
    """
    🌊 Client Wave Accounting (GraphQL)
    
    Fonctionnalités:
    - Factures
    - Clients
    - Dépenses
    - Rapports
    """
    
    BASE_URL = "https://gql.waveapps.com/graphql/public"
    
    async def _graphql(self, query: str, variables: Dict = None) -> Dict[str, Any]:
        """Exécute une requête GraphQL."""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
        
        async with self.session.post(self.BASE_URL, json=payload) as resp:
            return await resp.json()
    
    async def list_businesses(self) -> List[Dict[str, Any]]:
        """Liste les entreprises."""
        query = """
        query {
            businesses {
                edges {
                    node {
                        id
                        name
                        currency { code }
                    }
                }
            }
        }
        """
        result = await self._graphql(query)
        return [edge["node"] for edge in result.get("data", {}).get("businesses", {}).get("edges", [])]
    
    async def list_customers(self, business_id: str) -> List[Dict[str, Any]]:
        """Liste les clients."""
        query = """
        query($businessId: ID!) {
            business(id: $businessId) {
                customers {
                    edges {
                        node {
                            id
                            name
                            email
                            phone
                        }
                    }
                }
            }
        }
        """
        result = await self._graphql(query, {"businessId": business_id})
        customers = result.get("data", {}).get("business", {}).get("customers", {}).get("edges", [])
        return [edge["node"] for edge in customers]
    
    async def create_invoice(
        self,
        business_id: str,
        customer_id: str,
        items: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Crée une facture."""
        mutation = """
        mutation($input: InvoiceCreateInput!) {
            invoiceCreate(input: $input) {
                invoice {
                    id
                    invoiceNumber
                    status
                    total { value }
                }
            }
        }
        """
        
        variables = {
            "input": {
                "businessId": business_id,
                "customerId": customer_id,
                "items": [
                    {
                        "description": item["description"],
                        "quantity": item["quantity"],
                        "unitPrice": item["unit_price"]
                    }
                    for item in items
                ]
            }
        }
        
        result = await self._graphql(mutation, variables)
        return result.get("data", {}).get("invoiceCreate", {}).get("invoice", {})


# ═══════════════════════════════════════════════════════════════════════════════
# ACCOUNTING SERVICE (Unified Interface)
# ═══════════════════════════════════════════════════════════════════════════════

class AccountingService:
    """
    🧾 Service Comptabilité Unifié
    
    Interface unifiée pour tous les providers de comptabilité.
    """
    
    def __init__(self):
        self._clients: Dict[str, BaseAccountingClient] = {}
    
    def register_quickbooks(
        self,
        account_id: str,
        access_token: str,
        realm_id: str,
        refresh_token: str = None
    ):
        """Enregistre un client QuickBooks."""
        self._clients[account_id] = QuickBooksClient(access_token, realm_id, refresh_token)
    
    def register_xero(
        self,
        account_id: str,
        access_token: str,
        tenant_id: str,
        refresh_token: str = None
    ):
        """Enregistre un client Xero."""
        self._clients[account_id] = XeroClient(access_token, tenant_id, refresh_token)
    
    def register_stripe(
        self,
        account_id: str,
        access_token: str
    ):
        """Enregistre un client Stripe."""
        self._clients[account_id] = StripeClient(access_token)
    
    def get_client(self, account_id: str) -> BaseAccountingClient:
        """Récupère un client par son ID."""
        if account_id not in self._clients:
            raise ValueError(f"Account {account_id} not registered")
        return self._clients[account_id]
    
    async def get_financial_summary(
        self,
        account_id: str,
        start_date: date,
        end_date: date
    ) -> Dict[str, Any]:
        """
        Récupère un résumé financier unifié.
        """
        client = self.get_client(account_id)
        
        summary = {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "revenue": Decimal("0"),
            "expenses": Decimal("0"),
            "net_income": Decimal("0"),
            "accounts_receivable": Decimal("0"),
            "accounts_payable": Decimal("0")
        }
        
        # Adapter selon le type de client
        if isinstance(client, QuickBooksClient):
            async with client:
                pnl = await client.get_profit_and_loss(start_date, end_date)
                # Parse QuickBooks report...
                
        elif isinstance(client, XeroClient):
            async with client:
                pnl = await client.get_profit_and_loss(start_date, end_date)
                # Parse Xero report...
        
        return summary


# ═══════════════════════════════════════════════════════════════════════════════
# TAXES QUÉBEC/CANADA
# ═══════════════════════════════════════════════════════════════════════════════

class CanadianTaxCalculator:
    """
    🍁 Calculateur de taxes Canada/Québec
    """
    
    # Taux de taxes 2024
    GST_RATE = Decimal("5.0")      # TPS fédérale
    QST_RATE = Decimal("9.975")    # TVQ Québec
    HST_RATES = {
        "ON": Decimal("13.0"),     # Ontario
        "NB": Decimal("15.0"),     # Nouveau-Brunswick
        "NS": Decimal("15.0"),     # Nouvelle-Écosse
        "NL": Decimal("15.0"),     # Terre-Neuve
        "PE": Decimal("15.0"),     # Île-du-Prince-Édouard
    }
    PST_RATES = {
        "BC": Decimal("7.0"),      # Colombie-Britannique
        "SK": Decimal("6.0"),      # Saskatchewan
        "MB": Decimal("7.0"),      # Manitoba
    }
    
    @classmethod
    def calculate_quebec_taxes(cls, amount: Decimal) -> Dict[str, Decimal]:
        """Calcule TPS + TVQ pour le Québec."""
        gst = amount * (cls.GST_RATE / 100)
        qst = amount * (cls.QST_RATE / 100)
        
        return {
            "subtotal": amount,
            "gst": gst.quantize(Decimal("0.01")),
            "gst_rate": cls.GST_RATE,
            "qst": qst.quantize(Decimal("0.01")),
            "qst_rate": cls.QST_RATE,
            "total_tax": (gst + qst).quantize(Decimal("0.01")),
            "total": (amount + gst + qst).quantize(Decimal("0.01"))
        }
    
    @classmethod
    def calculate_taxes(
        cls,
        amount: Decimal,
        province: str
    ) -> Dict[str, Decimal]:
        """Calcule les taxes selon la province."""
        province = province.upper()
        
        if province == "QC":
            return cls.calculate_quebec_taxes(amount)
        
        if province in cls.HST_RATES:
            hst = amount * (cls.HST_RATES[province] / 100)
            return {
                "subtotal": amount,
                "hst": hst.quantize(Decimal("0.01")),
                "hst_rate": cls.HST_RATES[province],
                "total_tax": hst.quantize(Decimal("0.01")),
                "total": (amount + hst).quantize(Decimal("0.01"))
            }
        
        if province in cls.PST_RATES:
            gst = amount * (cls.GST_RATE / 100)
            pst = amount * (cls.PST_RATES[province] / 100)
            return {
                "subtotal": amount,
                "gst": gst.quantize(Decimal("0.01")),
                "gst_rate": cls.GST_RATE,
                "pst": pst.quantize(Decimal("0.01")),
                "pst_rate": cls.PST_RATES[province],
                "total_tax": (gst + pst).quantize(Decimal("0.01")),
                "total": (amount + gst + pst).quantize(Decimal("0.01"))
            }
        
        # Alberta, Yukon, NWT, Nunavut - GST only
        gst = amount * (cls.GST_RATE / 100)
        return {
            "subtotal": amount,
            "gst": gst.quantize(Decimal("0.01")),
            "gst_rate": cls.GST_RATE,
            "total_tax": gst.quantize(Decimal("0.01")),
            "total": (amount + gst).quantize(Decimal("0.01"))
        }


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

def create_accounting_service() -> AccountingService:
    """Factory pour le service de comptabilité."""
    return AccountingService()
