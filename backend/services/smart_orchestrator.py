"""
CHE·NU - Smart Orchestrator
===========================
Intelligent routing of requests to the appropriate agents.
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import re

from .base_agent import AgentMessage, AgentResponse, AgentLevel
from .directors import DIRECTORS, Director
from .specialists import SPECIALISTS, Specialist


class IntentCategory(Enum):
    CONSTRUCTION = "construction"
    FINANCE = "finance"
    COMPLIANCE = "compliance"
    SAFETY = "safety"
    HR = "hr"
    SALES = "sales"
    OPERATIONS = "operations"
    TECHNICAL = "technical"
    GENERAL = "general"
    UNKNOWN = "unknown"


@dataclass
class RoutingDecision:
    """Result of routing analysis."""
    intent: IntentCategory
    confidence: float
    target_agent: str
    target_level: AgentLevel
    reasoning: str
    fallback_agent: Optional[str] = None


class SmartOrchestrator:
    """
    Intelligent request router for CHE·NU multi-agent system.
    
    Analyzes incoming requests and routes them to the most appropriate
    agent based on intent, context, and agent capabilities.
    """
    
    # Intent keywords mapping
    INTENT_PATTERNS = {
        IntentCategory.CONSTRUCTION: [
            r"projet", r"chantier", r"construction", r"travaux", r"bâtiment",
            r"site", r"équipe", r"délai", r"planning", r"gantt", r"schedule",
        ],
        IntentCategory.FINANCE: [
            r"budget", r"coût", r"prix", r"facture", r"paiement", r"devis",
            r"soumission", r"argent", r"finance", r"comptab", r"profit",
        ],
        IntentCategory.COMPLIANCE: [
            r"rbq", r"cnesst", r"ccq", r"permis", r"licence", r"conformité",
            r"réglementation", r"inspection", r"audit", r"norme",
        ],
        IntentCategory.SAFETY: [
            r"sécurité", r"accident", r"incident", r"danger", r"risque",
            r"epi", r"protection", r"urgence", r"blessure", r"safety",
        ],
        IntentCategory.HR: [
            r"employé", r"recrutement", r"embauche", r"salaire", r"paie",
            r"congé", r"vacance", r"formation", r"évaluation", r"rh",
        ],
        IntentCategory.SALES: [
            r"client", r"vente", r"prospect", r"contrat", r"négociation",
            r"offre", r"opportunité", r"lead", r"crm", r"commercial",
        ],
        IntentCategory.OPERATIONS: [
            r"logistique", r"livraison", r"matériau", r"équipement", r"flotte",
            r"véhicule", r"inventaire", r"stock", r"fournisseur",
        ],
        IntentCategory.TECHNICAL: [
            r"plan", r"dessin", r"cad", r"bim", r"ingénieur", r"structure",
            r"électrique", r"plomberie", r"hvac", r"mécanique",
        ],
    }
    
    # Agent routing map
    AGENT_ROUTING = {
        IntentCategory.CONSTRUCTION: ("construction_director", "project_manager"),
        IntentCategory.FINANCE: ("finance_director", "accountant"),
        IntentCategory.COMPLIANCE: ("compliance_director", "rbq_specialist"),
        IntentCategory.SAFETY: ("safety_director", "safety_inspector"),
        IntentCategory.HR: ("hr_director", "recruiter"),
        IntentCategory.SALES: ("sales_director", "estimator"),
        IntentCategory.OPERATIONS: ("operations_director", "scheduler"),
        IntentCategory.TECHNICAL: ("engineering_director", "structural_engineer"),
        IntentCategory.GENERAL: ("master_mind", None),
        IntentCategory.UNKNOWN: ("master_mind", None),
    }
    
    def __init__(self):
        self.routing_history: List[RoutingDecision] = []
        self._compile_patterns()
    
    def _compile_patterns(self):
        """Compile regex patterns for faster matching."""
        self._compiled_patterns = {
            intent: [re.compile(p, re.IGNORECASE) for p in patterns]
            for intent, patterns in self.INTENT_PATTERNS.items()
        }
    
    def analyze_intent(self, text: str) -> tuple[IntentCategory, float]:
        """
        Analyze text to determine the primary intent.
        
        Returns:
            Tuple of (IntentCategory, confidence score 0-1)
        """
        text_lower = text.lower()
        scores: Dict[IntentCategory, int] = {cat: 0 for cat in IntentCategory}
        
        for intent, patterns in self._compiled_patterns.items():
            for pattern in patterns:
                if pattern.search(text_lower):
                    scores[intent] += 1
        
        # Find best match
        best_intent = IntentCategory.UNKNOWN
        best_score = 0
        total_matches = sum(scores.values())
        
        for intent, score in scores.items():
            if score > best_score:
                best_score = score
                best_intent = intent
        
        # Calculate confidence
        confidence = best_score / max(total_matches, 1) if best_score > 0 else 0
        
        return best_intent, confidence
    
    def route(self, message: str, context: Optional[Dict] = None) -> RoutingDecision:
        """
        Route a message to the appropriate agent.
        
        Args:
            message: The user message to route
            context: Optional context (current project, user role, etc.)
            
        Returns:
            RoutingDecision with target agent and reasoning
        """
        # Analyze intent
        intent, confidence = self.analyze_intent(message)
        
        # Get routing
        primary, fallback = self.AGENT_ROUTING.get(
            intent, 
            self.AGENT_ROUTING[IntentCategory.UNKNOWN]
        )
        
        # Determine level based on confidence
        if confidence > 0.7:
            # High confidence - go directly to specialist
            target = fallback or primary
            level = AgentLevel.L2_MANAGER if fallback else AgentLevel.L1_DIRECTOR
        else:
            # Lower confidence - start with director
            target = primary
            level = AgentLevel.L1_DIRECTOR if primary != "master_mind" else AgentLevel.L0_MASTER
        
        # Apply context-based adjustments
        if context:
            target, level = self._apply_context(target, level, context)
        
        decision = RoutingDecision(
            intent=intent,
            confidence=confidence,
            target_agent=target,
            target_level=level,
            reasoning=self._generate_reasoning(intent, confidence, target),
            fallback_agent=fallback if fallback != target else primary,
        )
        
        # Log decision
        self.routing_history.append(decision)
        
        return decision
    
    def _apply_context(
        self, 
        target: str, 
        level: AgentLevel, 
        context: Dict
    ) -> tuple[str, AgentLevel]:
        """Apply context-based routing adjustments."""
        # If in a specific sphere, route to appropriate specialist
        if "sphere" in context:
            sphere = context["sphere"]
            sphere_routing = {
                "construction": ("project_manager", AgentLevel.L2_MANAGER),
                "finance": ("accountant", AgentLevel.L2_MANAGER),
                "compliance": ("compliance_director", AgentLevel.L1_DIRECTOR),
            }
            if sphere in sphere_routing:
                return sphere_routing[sphere]
        
        # If user has escalation flag
        if context.get("escalate"):
            return "master_mind", AgentLevel.L0_MASTER
        
        return target, level
    
    def _generate_reasoning(
        self, 
        intent: IntentCategory, 
        confidence: float, 
        target: str
    ) -> str:
        """Generate human-readable reasoning for the routing decision."""
        conf_text = "haute" if confidence > 0.7 else "moyenne" if confidence > 0.4 else "faible"
        
        agent_names = {
            "master_mind": "Nova (Intelligence Centrale)",
            "construction_director": "Directeur Construction",
            "finance_director": "Directeur Finances",
            "compliance_director": "Directeur Conformité",
            "safety_director": "Directeur Sécurité",
            "project_manager": "Gérant de Projet",
            "estimator": "Estimateur",
            "accountant": "Comptable",
        }
        
        agent_name = agent_names.get(target, target)
        
        return (
            f"Intent détecté: {intent.value} (confiance {conf_text}: {confidence:.0%}). "
            f"Routage vers {agent_name}."
        )
    
    def get_available_agents(self) -> Dict[str, List[str]]:
        """Get all available agents organized by level."""
        return {
            "L0_MASTER": ["master_mind", "nova"],
            "L1_DIRECTORS": list(DIRECTORS.keys()),
            "L2_L3_SPECIALISTS": list(SPECIALISTS.keys()),
        }
    
    def get_routing_stats(self) -> Dict:
        """Get routing statistics."""
        if not self.routing_history:
            return {"total_routes": 0}
        
        intent_counts = {}
        agent_counts = {}
        avg_confidence = 0
        
        for decision in self.routing_history:
            intent_counts[decision.intent.value] = intent_counts.get(decision.intent.value, 0) + 1
            agent_counts[decision.target_agent] = agent_counts.get(decision.target_agent, 0) + 1
            avg_confidence += decision.confidence
        
        return {
            "total_routes": len(self.routing_history),
            "intent_distribution": intent_counts,
            "agent_distribution": agent_counts,
            "average_confidence": avg_confidence / len(self.routing_history),
        }


# Global orchestrator instance
orchestrator = SmartOrchestrator()


def route_request(message: str, context: Optional[Dict] = None) -> RoutingDecision:
    """Convenience function to route a request."""
    return orchestrator.route(message, context)
