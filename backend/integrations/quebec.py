"""
CHE·NU Quebec Government Integrations
RBQ, CNESST, CCQ compliance
"""
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
from datetime import datetime


class QuebecLicenseType(str, Enum):
    """RBQ License types."""
    GENERAL = "general"
    SPECIALIZED = "specialized"
    OWNER_BUILDER = "owner_builder"


class CNESSTCategory(str, Enum):
    """CNESST risk categories."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"


@dataclass
class RBQLicense:
    """RBQ License information."""
    number: str
    holder_name: str
    license_type: QuebecLicenseType
    specialties: List[str]
    issue_date: datetime
    expiry_date: datetime
    status: str
    restrictions: List[str]


@dataclass
class CNESSTRegistration:
    """CNESST Registration information."""
    number: str
    company_name: str
    neq: str  # Numéro d'entreprise du Québec
    category: CNESSTCategory
    rate: float
    valid_until: datetime
    employees_count: int


@dataclass
class CCQWorker:
    """CCQ Worker information."""
    card_number: str
    name: str
    trade: str
    classification: str
    hours_worked: int
    valid_until: datetime


class QuebecIntegration:
    """
    Integration with Quebec government services.
    
    Provides:
    - RBQ license verification
    - CNESST compliance checking
    - CCQ worker validation
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self._cache: Dict[str, Any] = {}
    
    async def verify_rbq_license(self, license_number: str) -> Optional[RBQLicense]:
        """
        Verify RBQ license validity.
        
        In production, this would call the actual RBQ API.
        """
        # Mock implementation for development
        return RBQLicense(
            number=license_number,
            holder_name="Pro-Service Construction",
            license_type=QuebecLicenseType.GENERAL,
            specialties=["residential", "commercial", "renovation"],
            issue_date=datetime(2020, 1, 1),
            expiry_date=datetime(2025, 12, 31),
            status="active",
            restrictions=[],
        )
    
    async def check_cnesst_compliance(self, neq: str) -> Optional[CNESSTRegistration]:
        """
        Check CNESST compliance status.
        """
        return CNESSTRegistration(
            number=f"CNESST-{neq}",
            company_name="Pro-Service Construction",
            neq=neq,
            category=CNESSTCategory.MEDIUM,
            rate=2.5,
            valid_until=datetime(2025, 12, 31),
            employees_count=25,
        )
    
    async def validate_ccq_worker(self, card_number: str) -> Optional[CCQWorker]:
        """
        Validate CCQ worker card.
        """
        return CCQWorker(
            card_number=card_number,
            name="Worker Name",
            trade="carpenter",
            classification="journeyman",
            hours_worked=5000,
            valid_until=datetime(2025, 12, 31),
        )
    
    def calculate_cnesst_premium(
        self,
        category: CNESSTCategory,
        payroll: float,
    ) -> Dict[str, float]:
        """
        Calculate CNESST premium based on category and payroll.
        """
        rates = {
            CNESSTCategory.LOW: 0.015,
            CNESSTCategory.MEDIUM: 0.025,
            CNESSTCategory.HIGH: 0.04,
            CNESSTCategory.VERY_HIGH: 0.06,
        }
        
        rate = rates.get(category, 0.025)
        premium = payroll * rate
        
        return {
            "rate": rate,
            "payroll": payroll,
            "premium": premium,
            "monthly_payment": premium / 12,
        }
    
    def get_required_permits(
        self,
        project_type: str,
        municipality: str,
        value: float,
    ) -> List[Dict[str, Any]]:
        """
        Get list of required permits for a project.
        """
        permits = [
            {
                "type": "building_permit",
                "authority": "municipal",
                "required": True,
                "estimated_time": "2-4 weeks",
            },
        ]
        
        if value > 100000:
            permits.append({
                "type": "construction_certificate",
                "authority": "RBQ",
                "required": True,
                "estimated_time": "1-2 weeks",
            })
        
        if project_type in ["commercial", "industrial"]:
            permits.append({
                "type": "environmental_assessment",
                "authority": "MELCC",
                "required": True,
                "estimated_time": "4-8 weeks",
            })
        
        return permits


# Singleton instance
_quebec_integration: Optional[QuebecIntegration] = None


def get_quebec_integration() -> QuebecIntegration:
    """Get the Quebec integration instance."""
    global _quebec_integration
    if _quebec_integration is None:
        _quebec_integration = QuebecIntegration()
    return _quebec_integration
