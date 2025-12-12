"""
CHE·NU — FOUNDATION FREEZE v1.0.0
Les lois fondamentales sont IMMUABLES.
Gelé pour l'humanité.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List

class LawStatus(str, Enum):
    FROZEN = "FROZEN"
    ACTIVE = "ACTIVE"

class SphereStatus(str, Enum):
    FROZEN = "FROZEN"

@dataclass(frozen=True)
class FundamentalLaw:
    id: int
    name: str
    principle: str
    description: str
    status: LawStatus = LawStatus.FROZEN

@dataclass(frozen=True)
class Sphere:
    id: str
    name: str
    emoji: str
    role: str
    status: SphereStatus = SphereStatus.FROZEN

class FoundationFreeze:
    VERSION = "1.0.0"
    STATUS = "ACTIVE"
    
    LAWS: List[FundamentalLaw] = [
        FundamentalLaw(1, "Souveraineté des données", "L'humain possède ses données",
            "Les données appartiennent à l'utilisateur. Export/suppression sans justification."),
        FundamentalLaw(2, "Pas d'évaluation implicite", "Aucun jugement caché",
            "Aucun scoring, inférence psychologique, catégorisation ou classement."),
        FundamentalLaw(3, "Pas de manipulation comportementale", "Aucune influence comportementale",
            "Pas de dark patterns, notifications addictives, gamification manipulatrice."),
        FundamentalLaw(4, "Consentement explicite", "Accord requis pour cross-contexte",
            "Sphères isolées par défaut. Partage requiert action utilisateur."),
        FundamentalLaw(5, "Clarté et calme", "Interface sans pression",
            "Design épuré. Pas de scroll infini, compteurs de likes, notifications intrusives."),
        FundamentalLaw(6, "Réversibilité par défaut", "Toute action peut être annulée",
            "Actions réversibles. Historique conservé. Restauration possible.")
    ]
    
    SPHERES: List[Sphere] = [
        Sphere("personal", "Personnel", "🔐", "Sanctuaire privé — Isolation absolue"),
        Sphere("methodology", "Methodology", "📊", "Analyse sans décision"),
        Sphere("business", "Business", "💼", "Structure économique sans surveillance"),
        Sphere("scholar", "Scholar", "📚", "Savoir sans pression ni notation"),
        Sphere("creative_studio", "Creative Studio", "🎨", "Création libre sans jugement"),
        Sphere("xr_meeting", "XR / Meeting", "🥽", "Présence immersive sans analyse"),
        Sphere("social_media", "Social & Media", "📱", "Échange sans manipulation"),
        Sphere("institutions", "Institutions", "🏛️", "Gouvernance transparente")
    ]
    
    SPHERE_INTERACTIONS: Dict[str, List[str]] = {
        "personal": [],
        "methodology": ["business", "scholar", "creative_studio", "institutions"],
        "business": ["methodology", "scholar", "creative_studio", "xr_meeting", "social_media", "institutions"],
        "scholar": ["methodology", "business", "creative_studio", "xr_meeting", "social_media", "institutions"],
        "creative_studio": ["methodology", "business", "scholar", "xr_meeting", "social_media"],
        "xr_meeting": ["methodology", "business", "scholar", "creative_studio"],
        "social_media": ["business", "scholar", "creative_studio"],
        "institutions": ["methodology", "business", "scholar"]
    }
    
    def verify(self) -> bool:
        if len(self.LAWS) != 6 or len(self.SPHERES) != 8:
            return False
        if self.SPHERE_INTERACTIONS.get("personal") != []:
            return False
        return all(l.status == LawStatus.FROZEN for l in self.LAWS)
    
    def get_laws(self) -> List[Dict]:
        return [{"id": l.id, "name": l.name, "principle": l.principle, 
                 "description": l.description, "status": l.status.value} for l in self.LAWS]
    
    def get_spheres(self) -> List[Dict]:
        return [{"id": s.id, "name": s.name, "emoji": s.emoji, "role": s.role,
                 "status": s.status.value, "can_interact_with": self.SPHERE_INTERACTIONS.get(s.id, [])} 
                for s in self.SPHERES]
    
    def can_spheres_interact(self, a: str, b: str) -> bool:
        if a == "personal" or b == "personal":
            return False
        return b in self.SPHERE_INTERACTIONS.get(a, [])
    
    def get_law(self, law_id: int):
        return next((l for l in self.LAWS if l.id == law_id), None)
    
    def get_sphere(self, sphere_id: str):
        return next((s for s in self.SPHERES if s.id == sphere_id), None)
