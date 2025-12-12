"""
CHE·NU v7.0 - Routing Engine
═══════════════════════════════════════════════════════════════════════════════
Moteur de routage intelligent pour diriger les requêtes vers les bons agents.
Supporte le routage par mots-clés et par LLM multi-provider.

Author: CHE·NU Team
Version: 7.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Callable, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime
import logging
import json
import re
from enum import Enum

if TYPE_CHECKING:
    from ..schemas.task_schema import Task, TaskInput, RoutingDecision, Department

logger = logging.getLogger("CHE·NU.Core.RoutingEngine")


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTING CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

DEPARTMENT_KEYWORDS: Dict[str, List[str]] = {
    "construction": [
        "construction", "chantier", "bâtiment", "rénovation", "travaux",
        "estimation", "devis", "soumission", "béton", "bois", "toiture",
        "plomberie", "électricité", "fondation", "mur", "plancher",
        "cuisine", "salle de bain", "agrandissement", "maison", "condo",
        "entrepreneur", "sous-traitant", "permis", "inspection", "rbq",
        "excavation", "isolation", "fenêtre", "porte", "revêtement",
        "structure", "charpente", "dalle", "drain", "gypse"
    ],
    "finance": [
        "finance", "comptabilité", "facturation", "budget", "paiement",
        "facture", "taxe", "tps", "tvq", "impôt", "trésorerie",
        "profit", "perte", "bilan", "cash flow", "crédit", "débit",
        "revenu", "dépense", "rapport financier", "quickbooks", "xero",
        "stripe", "wave", "comptable", "fiscal"
    ],
    "hr": [
        "rh", "ressources humaines", "employé", "recrutement", "embauche",
        "paie", "salaire", "formation", "congé", "vacances", "horaire",
        "équipe", "personnel", "contrat", "démission", "licenciement",
        "bamboohr", "gusto", "deputy", "ccq", "cnesst"
    ],
    "marketing": [
        "marketing", "publicité", "promotion", "campagne", "pub",
        "seo", "réseaux sociaux", "facebook", "instagram", "linkedin",
        "contenu", "blog", "newsletter", "email", "lead", "prospect",
        "hubspot", "mailchimp", "google ads", "meta ads"
    ],
    "creative": [
        "design", "graphisme", "logo", "vidéo", "photo", "image",
        "animation", "3d", "bim", "rendu", "visualisation", "maquette",
        "branding", "identité visuelle", "charte graphique", "autodesk"
    ],
    "sales": [
        "vente", "ventes", "commercial", "client", "prospect",
        "négociation", "contrat", "offre", "devis commercial", "crm",
        "pipeline", "opportunité", "closing", "salesforce", "pipedrive"
    ],
    "operations": [
        "opérations", "logistique", "inventaire", "stock", "livraison",
        "processus", "workflow", "optimisation", "planification",
        "procore", "calendrier", "scheduling"
    ],
    "admin": [
        "admin", "administration", "document", "contrat", "juridique",
        "légal", "conformité", "licence", "permis", "secrétariat",
        "docusign", "notion", "airtable", "trello"
    ],
    "technology": [
        "tech", "technologie", "it", "informatique", "logiciel",
        "système", "réseau", "sécurité", "données", "cloud",
        "api", "intégration", "développement"
    ],
    "communication": [
        "communication", "slack", "discord", "teams", "zoom",
        "réunion", "meeting", "appel", "vidéoconférence", "chat",
        "message", "notification", "email", "twilio"
    ]
}

AGENT_HIERARCHY: Dict[str, Dict[str, Any]] = {
    "construction": {
        "director": {"id": "CONST_DIR_001", "name": "Pierre Bâtisseur", "level": "L1"},
        "specialists": {
            "estimation": {"id": "CONST_EST_001", "name": "Estimateur Pro", "level": "L2"},
            "chantier": {"id": "CONST_SITE_001", "name": "Chef de Chantier", "level": "L2"},
            "approvisionnement": {"id": "CONST_PROC_001", "name": "Approvisionneur", "level": "L2"},
            "qualite": {"id": "CONST_QC_001", "name": "Contrôle Qualité", "level": "L2"},
            "securite": {"id": "CONST_SEC_001", "name": "Sécurité Chantier", "level": "L2"}
        }
    },
    "finance": {
        "director": {"id": "FIN_DIR_001", "name": "Victoria Finances", "level": "L1"},
        "specialists": {
            "comptabilite": {"id": "FIN_ACCT_001", "name": "Comptable", "level": "L2"},
            "fiscalite": {"id": "FIN_TAX_001", "name": "Fiscaliste", "level": "L2"},
            "tresorerie": {"id": "FIN_CASH_001", "name": "Trésorier", "level": "L2"}
        }
    },
    "hr": {
        "director": {"id": "HR_DIR_001", "name": "Clara RH", "level": "L1"},
        "specialists": {
            "recrutement": {"id": "HR_REC_001", "name": "Recruteur", "level": "L2"},
            "paie": {"id": "HR_PAY_001", "name": "Gestionnaire Paie", "level": "L2"},
            "formation": {"id": "HR_TRAIN_001", "name": "Formateur", "level": "L2"}
        }
    },
    "marketing": {
        "director": {"id": "MKT_DIR_001", "name": "Sophie Marketing", "level": "L1"},
        "specialists": {
            "digital": {"id": "MKT_DIG_001", "name": "Marketing Digital", "level": "L2"},
            "contenu": {"id": "MKT_CONT_001", "name": "Content Manager", "level": "L2"},
            "social": {"id": "MKT_SOC_001", "name": "Social Media", "level": "L2"}
        }
    },
    "creative": {
        "director": {"id": "CREAT_DIR_001", "name": "Alex Créatif", "level": "L1"},
        "specialists": {
            "design": {"id": "CREAT_DES_001", "name": "Designer", "level": "L2"},
            "video": {"id": "CREAT_VID_001", "name": "Vidéaste", "level": "L2"},
            "3d": {"id": "CREAT_3D_001", "name": "Artiste 3D", "level": "L2"}
        }
    },
    "sales": {
        "director": {"id": "SALES_DIR_001", "name": "Marc Ventes", "level": "L1"},
        "specialists": {
            "prospection": {"id": "SALES_PROS_001", "name": "Prospecteur", "level": "L2"},
            "negociation": {"id": "SALES_NEG_001", "name": "Négociateur", "level": "L2"}
        }
    },
    "operations": {
        "director": {"id": "OPS_DIR_001", "name": "Emma Opérations", "level": "L1"},
        "specialists": {
            "logistique": {"id": "OPS_LOG_001", "name": "Logisticien", "level": "L2"},
            "planning": {"id": "OPS_PLAN_001", "name": "Planificateur", "level": "L2"}
        }
    },
    "admin": {
        "director": {"id": "ADMIN_DIR_001", "name": "Louis Admin", "level": "L1"},
        "specialists": {
            "documents": {"id": "ADMIN_DOC_001", "name": "Gestionnaire Docs", "level": "L2"},
            "legal": {"id": "ADMIN_LEG_001", "name": "Conseiller Légal", "level": "L2"}
        }
    },
    "technology": {
        "director": {"id": "TECH_DIR_001", "name": "Thomas Tech", "level": "L1"},
        "specialists": {
            "integration": {"id": "TECH_INT_001", "name": "Intégrateur", "level": "L2"},
            "support": {"id": "TECH_SUP_001", "name": "Support Tech", "level": "L2"}
        }
    },
    "communication": {
        "director": {"id": "COMM_DIR_001", "name": "Julie Communication", "level": "L1"},
        "specialists": {
            "interne": {"id": "COMM_INT_001", "name": "Com Interne", "level": "L2"},
            "externe": {"id": "COMM_EXT_001", "name": "Com Externe", "level": "L2"}
        }
    }
}


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTING RESULT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class RoutingResult:
    """Résultat du routage."""
    department: str
    agent_id: str
    agent_name: str
    agent_level: str
    confidence: float
    matched_keywords: List[str] = field(default_factory=list)
    
    # Multi-département
    is_multi_department: bool = False
    secondary_departments: List[str] = field(default_factory=list)
    
    # Spécialiste optionnel
    specialist_id: Optional[str] = None
    specialist_name: Optional[str] = None
    
    # Metadata
    reasoning: str = ""
    method: str = "keywords"  # keywords, llm, forced
    routing_time_ms: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "department": self.department,
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "agent_level": self.agent_level,
            "confidence": self.confidence,
            "matched_keywords": self.matched_keywords,
            "is_multi_department": self.is_multi_department,
            "secondary_departments": self.secondary_departments,
            "specialist_id": self.specialist_id,
            "specialist_name": self.specialist_name,
            "reasoning": self.reasoning,
            "method": self.method
        }


# ═══════════════════════════════════════════════════════════════════════════════
# LLM ROUTER INTERFACE
# ═══════════════════════════════════════════════════════════════════════════════

class LLMRouterInterface:
    """Interface pour le routage LLM multi-provider."""
    
    async def route(
        self,
        text: str,
        departments: List[str],
        model: str = "claude-sonnet-4-20250514"
    ) -> Dict[str, Any]:
        """Route via LLM."""
        raise NotImplementedError


class AnthropicRouter(LLMRouterInterface):
    """Router utilisant Claude."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.anthropic.com/v1"
    
    async def route(
        self,
        text: str,
        departments: List[str],
        model: str = "claude-sonnet-4-20250514"
    ) -> Dict[str, Any]:
        import aiohttp
        
        prompt = f"""Analyse cette requête et détermine le département approprié.

REQUÊTE: {text[:500]}

DÉPARTEMENTS DISPONIBLES: {', '.join(departments)}

Réponds UNIQUEMENT en JSON valide:
{{"department": "nom_du_département", "confidence": 0.0-1.0, "reasoning": "explication courte"}}"""

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2024-01-01",
                    "content-type": "application/json"
                },
                json={
                    "model": model,
                    "max_tokens": 200,
                    "messages": [{"role": "user", "content": prompt}]
                }
            ) as resp:
                data = await resp.json()
                content = data.get("content", [{}])[0].get("text", "{}")
                
                # Nettoyer le JSON
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0]
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0]
                
                return json.loads(content.strip())


class OpenAIRouter(LLMRouterInterface):
    """Router utilisant GPT-4."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.openai.com/v1"
    
    async def route(
        self,
        text: str,
        departments: List[str],
        model: str = "gpt-4-turbo-preview"
    ) -> Dict[str, Any]:
        import aiohttp
        
        prompt = f"""Analyse cette requête et détermine le département approprié.

REQUÊTE: {text[:500]}

DÉPARTEMENTS DISPONIBLES: {', '.join(departments)}

Réponds UNIQUEMENT en JSON valide:
{{"department": "nom_du_département", "confidence": 0.0-1.0, "reasoning": "explication courte"}}"""

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "max_tokens": 200,
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"}
                }
            ) as resp:
                data = await resp.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
                return json.loads(content.strip())


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTING ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class RoutingEngine:
    """
    🧭 Moteur de Routage Intelligent
    
    Analyse les requêtes et détermine:
    - Le département principal
    - L'agent approprié (Director ou Specialist)
    - Les départements secondaires si multi-département
    
    Méthodes de routage:
    1. Mots-clés (rapide, hors-ligne)
    2. LLM (intelligent, contextuel)
    3. Forcé (explicite par l'utilisateur)
    """
    
    def __init__(
        self,
        llm_router: Optional[LLMRouterInterface] = None,
        default_department: str = "construction",
        min_confidence_threshold: float = 0.4,
        use_llm_for_low_confidence: bool = True
    ):
        """
        Initialise le moteur de routage.
        
        Args:
            llm_router: Router LLM (Claude, GPT-4, etc.)
            default_department: Département par défaut
            min_confidence_threshold: Seuil minimum de confiance
            use_llm_for_low_confidence: Utiliser LLM si confiance faible
        """
        self.llm_router = llm_router
        self.default_department = default_department
        self.min_confidence = min_confidence_threshold
        self.use_llm_fallback = use_llm_for_low_confidence
        
        self.department_keywords = DEPARTMENT_KEYWORDS
        self.agent_hierarchy = AGENT_HIERARCHY
        
        # Cache pour les routages récents
        self._cache: Dict[str, RoutingResult] = {}
        self._cache_max_size = 1000
        
        logger.info("🧭 Routing Engine initialized")
    
    async def route(
        self,
        request: Dict[str, Any],
        force_department: Optional[str] = None,
        force_specialist: Optional[str] = None,
        use_cache: bool = True
    ) -> RoutingResult:
        """
        Route une requête vers le bon département/agent.
        
        Args:
            request: Requête à router
            force_department: Forcer un département
            force_specialist: Forcer un spécialiste
            use_cache: Utiliser le cache
            
        Returns:
            Résultat du routage
        """
        import time
        start_time = time.time()
        
        # Département forcé
        if force_department and force_department in self.agent_hierarchy:
            result = self._create_result_for_department(
                force_department,
                confidence=1.0,
                matched_keywords=["forced"],
                reasoning="Département forcé par l'utilisateur",
                method="forced"
            )
            if force_specialist:
                result = self._add_specialist(result, force_specialist)
            result.routing_time_ms = int((time.time() - start_time) * 1000)
            return result
        
        # Extraire le texte
        text = self._extract_text(request).lower()
        
        # Vérifier le cache
        cache_key = self._get_cache_key(text)
        if use_cache and cache_key in self._cache:
            cached = self._cache[cache_key]
            cached.routing_time_ms = int((time.time() - start_time) * 1000)
            return cached
        
        # Analyse par mots-clés
        keyword_result = self._analyze_keywords(text)
        
        # Si confiance suffisante, retourner
        if keyword_result.confidence >= 0.6:
            self._add_to_cache(cache_key, keyword_result)
            keyword_result.routing_time_ms = int((time.time() - start_time) * 1000)
            return keyword_result
        
        # Sinon, essayer LLM si disponible
        if self.use_llm_fallback and self.llm_router and keyword_result.confidence < self.min_confidence:
            try:
                llm_result = await self._route_with_llm(text)
                if llm_result.confidence > keyword_result.confidence:
                    self._add_to_cache(cache_key, llm_result)
                    llm_result.routing_time_ms = int((time.time() - start_time) * 1000)
                    return llm_result
            except Exception as e:
                logger.warning(f"LLM routing failed: {e}")
        
        # Retourner le résultat des mots-clés
        keyword_result.routing_time_ms = int((time.time() - start_time) * 1000)
        self._add_to_cache(cache_key, keyword_result)
        return keyword_result
    
    def route_sync(
        self,
        request: Dict[str, Any],
        force_department: Optional[str] = None
    ) -> RoutingResult:
        """Version synchrone du routage (mots-clés uniquement)."""
        if force_department and force_department in self.agent_hierarchy:
            return self._create_result_for_department(
                force_department,
                confidence=1.0,
                matched_keywords=["forced"],
                reasoning="Département forcé",
                method="forced"
            )
        
        text = self._extract_text(request).lower()
        return self._analyze_keywords(text)
    
    def _extract_text(self, request: Any) -> str:
        """Extrait le texte analysable de la requête."""
        if isinstance(request, str):
            return request
        
        if isinstance(request, dict):
            parts = []
            for field in ["description", "title", "content", "message", "query", "text"]:
                if field in request:
                    parts.append(str(request[field]))
            return " ".join(parts)
        
        return str(request)
    
    def _analyze_keywords(self, text: str) -> RoutingResult:
        """Analyse les mots-clés pour déterminer le département."""
        scores: Dict[str, int] = {}
        matches: Dict[str, List[str]] = {}
        
        for department, keywords in self.department_keywords.items():
            department_matches = []
            score = 0
            
            for keyword in keywords:
                if keyword in text:
                    score += 1
                    department_matches.append(keyword)
            
            if score > 0:
                scores[department] = score
                matches[department] = department_matches
        
        # Aucun match
        if not scores:
            return self._create_result_for_department(
                self.default_department,
                confidence=0.3,
                matched_keywords=[],
                reasoning=f"Aucun mot-clé détecté, défaut vers {self.default_department}",
                method="keywords"
            )
        
        # Trier par score
        sorted_depts = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        primary = sorted_depts[0][0]
        primary_score = sorted_depts[0][1]
        total_matches = sum(scores.values())
        
        # Calculer la confiance
        confidence = min((primary_score / max(total_matches, 1)) * 1.2, 1.0)
        
        # Détecter multi-département
        secondary = []
        if len(sorted_depts) > 1:
            for dept, score in sorted_depts[1:3]:
                if score >= primary_score * 0.5:
                    secondary.append(dept)
        
        result = self._create_result_for_department(
            primary,
            confidence=confidence,
            matched_keywords=matches.get(primary, []),
            reasoning=f"Mots-clés détectés: {matches.get(primary, [])}",
            method="keywords"
        )
        
        if secondary:
            result.is_multi_department = True
            result.secondary_departments = secondary
        
        return result
    
    async def _route_with_llm(self, text: str) -> RoutingResult:
        """Utilise le LLM pour un routage plus intelligent."""
        if not self.llm_router:
            return self._create_result_for_department(
                self.default_department,
                confidence=0.3,
                matched_keywords=[],
                reasoning="LLM non disponible",
                method="keywords"
            )
        
        departments = list(self.department_keywords.keys())
        
        try:
            llm_result = await self.llm_router.route(text, departments)
            
            dept = llm_result.get("department", self.default_department)
            if dept not in self.agent_hierarchy:
                dept = self.default_department
            
            return self._create_result_for_department(
                dept,
                confidence=llm_result.get("confidence", 0.7),
                matched_keywords=["llm_analysis"],
                reasoning=llm_result.get("reasoning", "Analyse LLM"),
                method="llm"
            )
            
        except Exception as e:
            logger.error(f"LLM routing error: {e}")
            return self._create_result_for_department(
                self.default_department,
                confidence=0.3,
                matched_keywords=[],
                reasoning=f"Erreur LLM: {e}",
                method="keywords"
            )
    
    def _create_result_for_department(
        self,
        department: str,
        confidence: float,
        matched_keywords: List[str],
        reasoning: str,
        method: str
    ) -> RoutingResult:
        """Crée un résultat de routage pour un département."""
        hierarchy = self.agent_hierarchy.get(department, {})
        director = hierarchy.get("director", {})
        
        return RoutingResult(
            department=department,
            agent_id=director.get("id", f"{department.upper()}_DIR_001"),
            agent_name=director.get("name", f"Director {department}"),
            agent_level=director.get("level", "L1"),
            confidence=round(confidence, 2),
            matched_keywords=matched_keywords,
            reasoning=reasoning,
            method=method
        )
    
    def _add_specialist(
        self,
        result: RoutingResult,
        specialty: str
    ) -> RoutingResult:
        """Ajoute un spécialiste au résultat."""
        hierarchy = self.agent_hierarchy.get(result.department, {})
        specialists = hierarchy.get("specialists", {})
        
        if specialty in specialists:
            spec = specialists[specialty]
            result.specialist_id = spec.get("id")
            result.specialist_name = spec.get("name")
        
        return result
    
    def get_agent_for_specialty(
        self,
        department: str,
        specialty: str
    ) -> Optional[Dict[str, str]]:
        """Obtient les infos d'un agent spécialiste."""
        hierarchy = self.agent_hierarchy.get(department, {})
        specialists = hierarchy.get("specialists", {})
        return specialists.get(specialty)
    
    def get_department_director(self, department: str) -> Optional[Dict[str, str]]:
        """Obtient les infos du directeur d'un département."""
        hierarchy = self.agent_hierarchy.get(department, {})
        return hierarchy.get("director")
    
    def list_departments(self) -> List[str]:
        """Liste tous les départements."""
        return list(self.agent_hierarchy.keys())
    
    def list_specialists(self, department: str) -> List[str]:
        """Liste les spécialités d'un département."""
        hierarchy = self.agent_hierarchy.get(department, {})
        return list(hierarchy.get("specialists", {}).keys())
    
    def _get_cache_key(self, text: str) -> str:
        """Génère une clé de cache."""
        # Simplifier le texte pour le cache
        words = text.split()[:20]  # Premiers 20 mots
        return " ".join(words)
    
    def _add_to_cache(self, key: str, result: RoutingResult) -> None:
        """Ajoute au cache."""
        if len(self._cache) >= self._cache_max_size:
            # Supprimer les plus anciens
            oldest = list(self._cache.keys())[:100]
            for k in oldest:
                del self._cache[k]
        self._cache[key] = result
    
    def clear_cache(self) -> None:
        """Vide le cache."""
        self._cache.clear()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "RoutingEngine",
    "RoutingResult",
    "LLMRouterInterface",
    "AnthropicRouter",
    "OpenAIRouter",
    "DEPARTMENT_KEYWORDS",
    "AGENT_HIERARCHY"
]
