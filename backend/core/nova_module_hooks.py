"""
CHE·NU - Nova Integration Hooks
═══════════════════════════════════════════════════════════════════════════════
Hooks pour intégrer Nova (l'agent principal) avec le système de modules dynamiques.

Ces hooks permettent à Nova de:
- Proposer des modules basés sur le contexte de conversation
- Exécuter des actions sur les modules dynamiques
- Apprendre des patterns d'utilisation
- Suggérer des améliorations

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any, Callable
from uuid import UUID
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import re
import json
import asyncio
import logging

logger = logging.getLogger("CHENU.Nova.Hooks")


# ═══════════════════════════════════════════════════════════════════════════════
# TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class SuggestionType(str, Enum):
    """Types de suggestions que Nova peut faire"""
    NEW_MODULE = "new_module"
    NEW_ACTION = "new_action"
    WORKFLOW = "workflow"
    OPTIMIZATION = "optimization"
    INTEGRATION = "integration"


@dataclass
class ConversationContext:
    """Contexte de conversation pour l'analyse"""
    user_id: UUID
    messages: List[Dict[str, str]]
    current_scope: str
    mentioned_topics: List[str] = field(default_factory=list)
    user_intent: Optional[str] = None
    sentiment: str = "neutral"
    urgency: float = 0.5


@dataclass
class ModuleSuggestion:
    """Suggestion de module par Nova"""
    type: SuggestionType
    scope: str
    category: str
    key: str
    label: str
    description: str
    reason: str
    confidence: float
    actions: List[Dict[str, str]] = field(default_factory=list)
    context: Dict[str, Any] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════════════
# PATTERN DETECTION
# ═══════════════════════════════════════════════════════════════════════════════

class PatternDetector:
    """
    Détecte des patterns dans les conversations pour suggérer des modules.
    """
    
    # Patterns par domaine
    PATTERNS = {
        "personal": {
            "budget|dépenses|argent|finances": {
                "category": "finance",
                "key": "budget_tracker",
                "label": "Suivi de Budget",
                "description": "Suivez vos dépenses et gérez votre budget personnel"
            },
            "méditation|stress|relaxation|bien-être": {
                "category": "health",
                "key": "wellness_tracker",
                "label": "Bien-être",
                "description": "Suivez vos séances de méditation et votre bien-être"
            },
            "habitude|routine|quotidien": {
                "category": "custom",
                "key": "habit_tracker",
                "label": "Suivi d'Habitudes",
                "description": "Créez et suivez vos habitudes quotidiennes"
            },
            "objectif|goal|résolution": {
                "category": "custom",
                "key": "goal_tracker",
                "label": "Objectifs",
                "description": "Définissez et suivez vos objectifs personnels"
            }
        },
        "enterprise": {
            "kpi|indicateur|performance": {
                "category": "dashboard",
                "key": "kpi_dashboard",
                "label": "Dashboard KPIs",
                "description": "Tableau de bord des indicateurs de performance"
            },
            "réunion|meeting|standup": {
                "category": "operations",
                "key": "meeting_manager",
                "label": "Gestion Réunions",
                "description": "Planifiez et gérez vos réunions d'équipe"
            },
            "onboarding|intégration|nouveau": {
                "category": "hr",
                "key": "onboarding_flow",
                "label": "Onboarding",
                "description": "Flux d'intégration des nouveaux employés"
            }
        },
        "projects": {
            "sprint|agile|scrum": {
                "category": "tasks",
                "key": "sprint_board",
                "label": "Sprint Board",
                "description": "Gérez vos sprints agile"
            },
            "risque|problème|blocker": {
                "category": "management",
                "key": "risk_register",
                "label": "Registre des Risques",
                "description": "Identifiez et gérez les risques du projet"
            },
            "roadmap|planning|milestone": {
                "category": "management",
                "key": "roadmap_view",
                "label": "Roadmap",
                "description": "Visualisez la roadmap du projet"
            }
        },
        "creative_studio": {
            "moodboard|inspiration|visuel": {
                "category": "design",
                "key": "moodboard",
                "label": "Moodboard",
                "description": "Créez des moodboards pour vos projets"
            },
            "brand|marque|identité": {
                "category": "design",
                "key": "brand_kit",
                "label": "Brand Kit",
                "description": "Gérez votre identité de marque"
            },
            "prompt|génération|ia": {
                "category": "ai_tools",
                "key": "prompt_library",
                "label": "Bibliothèque de Prompts",
                "description": "Stockez et organisez vos prompts IA"
            }
        },
        "scholar": {
            "examen|révision|quiz": {
                "category": "courses",
                "key": "exam_prep",
                "label": "Préparation Examens",
                "description": "Préparez vos examens avec des quiz"
            },
            "citation|référence|bibliographie": {
                "category": "research",
                "key": "citation_manager",
                "label": "Gestionnaire de Citations",
                "description": "Gérez vos citations et références"
            },
            "lecture|résumé|notes": {
                "category": "library",
                "key": "reading_list",
                "label": "Liste de Lecture",
                "description": "Organisez vos lectures et prenez des notes"
            }
        }
    }
    
    def detect_patterns(
        self,
        context: ConversationContext
    ) -> List[ModuleSuggestion]:
        """
        Analyse le contexte et retourne des suggestions de modules.
        """
        suggestions = []
        
        # Combiner tous les messages en texte
        full_text = " ".join([
            m.get("content", "") for m in context.messages
        ]).lower()
        
        # Chercher les patterns dans le scope actuel
        scope = context.current_scope
        if scope in self.PATTERNS:
            for pattern, module_info in self.PATTERNS[scope].items():
                if re.search(pattern, full_text):
                    suggestion = ModuleSuggestion(
                        type=SuggestionType.NEW_MODULE,
                        scope=scope,
                        category=module_info["category"],
                        key=module_info["key"],
                        label=module_info["label"],
                        description=module_info["description"],
                        reason=f"J'ai détecté que vous mentionnez souvent des sujets liés à '{pattern.split('|')[0]}'. Ce module pourrait vous aider.",
                        confidence=0.7,
                        actions=[
                            {"key": "create", "label": "Créer"},
                            {"key": "view", "label": "Voir"},
                            {"key": "edit", "label": "Modifier"}
                        ],
                        context={"pattern": pattern, "matches": re.findall(pattern, full_text)}
                    )
                    suggestions.append(suggestion)
        
        # Trier par confiance
        suggestions.sort(key=lambda x: x.confidence, reverse=True)
        
        return suggestions[:3]  # Max 3 suggestions
    
    def extract_topics(self, text: str) -> List[str]:
        """Extrait les sujets principaux d'un texte"""
        # Mots clés importants à détecter
        topics = []
        
        keywords = {
            "project": ["projet", "project", "développement", "création"],
            "finance": ["budget", "argent", "dépense", "revenu", "facture"],
            "team": ["équipe", "team", "collaborateur", "employé"],
            "learning": ["cours", "formation", "apprendre", "étude"],
            "health": ["santé", "sport", "méditation", "sommeil"],
            "creative": ["design", "créatif", "art", "visuel"]
        }
        
        text_lower = text.lower()
        for topic, words in keywords.items():
            if any(word in text_lower for word in words):
                topics.append(topic)
        
        return topics


# ═══════════════════════════════════════════════════════════════════════════════
# NOVA HOOKS
# ═══════════════════════════════════════════════════════════════════════════════

class NovaModuleHooks:
    """
    Hooks pour connecter Nova au système de modules dynamiques.
    """
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self.pattern_detector = PatternDetector()
        self._suggestion_cache: Dict[str, List[ModuleSuggestion]] = {}
    
    async def on_conversation_message(
        self,
        user_id: UUID,
        message: str,
        scope: str,
        conversation_history: List[Dict[str, str]]
    ) -> Optional[Dict[str, Any]]:
        """
        Hook appelé à chaque message de conversation.
        Analyse et suggère des modules si pertinent.
        """
        context = ConversationContext(
            user_id=user_id,
            messages=conversation_history + [{"role": "user", "content": message}],
            current_scope=scope,
            mentioned_topics=self.pattern_detector.extract_topics(message)
        )
        
        # Détecter les patterns
        suggestions = self.pattern_detector.detect_patterns(context)
        
        if suggestions:
            # Vérifier si le module existe déjà
            filtered = []
            for suggestion in suggestions:
                exists = await self._module_exists(user_id, suggestion.scope, suggestion.key)
                if not exists:
                    filtered.append(suggestion)
            
            if filtered:
                return {
                    "type": "module_suggestions",
                    "suggestions": [
                        {
                            "type": s.type.value,
                            "scope": s.scope,
                            "category": s.category,
                            "key": s.key,
                            "label": s.label,
                            "description": s.description,
                            "reason": s.reason,
                            "confidence": s.confidence
                        }
                        for s in filtered
                    ]
                }
        
        return None
    
    async def on_intent_detected(
        self,
        user_id: UUID,
        intent: str,
        entities: Dict[str, Any],
        scope: str
    ) -> Optional[Dict[str, Any]]:
        """
        Hook appelé quand une intention utilisateur est détectée.
        """
        # Intentions qui peuvent déclencher des suggestions
        intent_to_module = {
            "track_expenses": ("personal", "finance", "expense_tracker"),
            "manage_tasks": ("projects", "tasks", "task_board"),
            "take_notes": ("personal", "notes", "quick_notes"),
            "schedule_meeting": ("enterprise", "operations", "meeting_scheduler"),
            "create_design": ("creative_studio", "design", "design_workspace"),
            "study_topic": ("scholar", "courses", "study_planner")
        }
        
        if intent in intent_to_module:
            scope_target, category, key = intent_to_module[intent]
            
            # Vérifier si on est dans le bon scope
            if scope_target == scope or scope == "personal":
                exists = await self._module_exists(user_id, scope_target, key)
                if not exists:
                    return {
                        "type": "intent_suggestion",
                        "intent": intent,
                        "suggested_module": {
                            "scope": scope_target,
                            "category": category,
                            "key": key
                        }
                    }
        
        return None
    
    async def on_module_created(
        self,
        user_id: UUID,
        module_id: UUID,
        module_data: Dict[str, Any]
    ) -> None:
        """
        Hook appelé quand un module dynamique est créé.
        """
        logger.info(f"Module created: {module_data.get('key')} for user {user_id}")
        
        # Apprendre du pattern pour améliorer les suggestions futures
        await self._learn_pattern(user_id, module_data)
    
    async def on_module_used(
        self,
        user_id: UUID,
        module_id: UUID,
        action: str,
        context: Dict[str, Any]
    ) -> None:
        """
        Hook appelé quand un module est utilisé.
        """
        # Tracker l'usage pour les analytics
        pass
    
    async def suggest_workflow(
        self,
        user_id: UUID,
        modules: List[Dict[str, Any]],
        goal: str
    ) -> Optional[Dict[str, Any]]:
        """
        Suggère un workflow combinant plusieurs modules.
        """
        if len(modules) < 2:
            return None
        
        # Analyser les modules et suggérer des connexions
        workflow = {
            "name": f"Workflow: {goal}",
            "steps": [],
            "connections": []
        }
        
        for i, module in enumerate(modules):
            workflow["steps"].append({
                "order": i + 1,
                "module": module["key"],
                "action": "process"
            })
            
            if i > 0:
                workflow["connections"].append({
                    "from": modules[i-1]["key"],
                    "to": module["key"],
                    "type": "sequential"
                })
        
        return workflow
    
    async def _module_exists(self, user_id: UUID, scope: str, key: str) -> bool:
        """Vérifie si un module existe déjà"""
        if not self.db:
            return False
        
        query = """
            SELECT EXISTS(
                SELECT 1 FROM dynamic_modules
                WHERE (created_by_user = $1 OR is_approved = true)
                AND scope = $2 AND key = $3
            )
        """
        return await self.db.fetchval(query, user_id, scope, key)
    
    async def _learn_pattern(self, user_id: UUID, module_data: Dict[str, Any]) -> None:
        """Apprend des patterns de création de modules"""
        # TODO: Implémenter l'apprentissage ML pour améliorer les suggestions
        pass


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION AVEC MASTERMIND
# ═══════════════════════════════════════════════════════════════════════════════

class MasterMindModuleAdapter:
    """
    Adaptateur pour intégrer les modules dynamiques avec le MasterMind.
    """
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self.nova_hooks = NovaModuleHooks(db_pool)
    
    async def enhance_routing(
        self,
        routing_result: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        """
        Enrichit le résultat de routage avec les modules dynamiques disponibles.
        """
        scope = self._department_to_scope(routing_result.get("department", ""))
        
        if not scope:
            return routing_result
        
        # Récupérer les modules dynamiques pour ce scope
        if self.db:
            query = """
                SELECT key, label, actions FROM dynamic_modules
                WHERE scope = $1 AND is_enabled = true AND is_approved = true
                AND (created_by_user = $2 OR created_by_user IS NULL)
            """
            modules = await self.db.fetch(query, scope, user_id)
            
            routing_result["available_dynamic_modules"] = [
                {"key": m["key"], "label": m["label"], "actions": m["actions"]}
                for m in modules
            ]
        
        return routing_result
    
    async def enhance_task_decomposition(
        self,
        decomposition: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        """
        Enrichit la décomposition de tâches avec les modules dynamiques.
        """
        # Vérifier si des sous-tâches peuvent être gérées par des modules dynamiques
        for subtask in decomposition.get("subtasks", []):
            module_match = await self._find_matching_module(
                user_id,
                subtask.get("description", ""),
                subtask.get("department", "")
            )
            
            if module_match:
                subtask["dynamic_module"] = module_match
                subtask["can_automate"] = True
        
        return decomposition
    
    async def _find_matching_module(
        self,
        user_id: UUID,
        description: str,
        department: str
    ) -> Optional[Dict[str, Any]]:
        """Trouve un module dynamique correspondant à une description"""
        if not self.db:
            return None
        
        scope = self._department_to_scope(department)
        if not scope:
            return None
        
        # Recherche simple par mots-clés (à améliorer avec embedding)
        words = description.lower().split()
        
        query = """
            SELECT key, label, description FROM dynamic_modules
            WHERE scope = $1 AND is_enabled = true
            AND (created_by_user = $2 OR created_by_user IS NULL)
        """
        modules = await self.db.fetch(query, scope, user_id)
        
        for module in modules:
            module_words = (module["label"] + " " + (module["description"] or "")).lower().split()
            overlap = len(set(words) & set(module_words))
            if overlap >= 2:
                return {
                    "key": module["key"],
                    "label": module["label"],
                    "match_score": overlap / len(words)
                }
        
        return None
    
    def _department_to_scope(self, department: str) -> Optional[str]:
        """Convertit un département en scope CHE·NU"""
        mapping = {
            "finance": "enterprise",
            "hr": "enterprise",
            "marketing": "enterprise",
            "sales": "enterprise",
            "operations": "enterprise",
            "it": "enterprise",
            "construction": "projects",
            "estimation": "projects",
            "architecture": "creative_studio",
            "legal": "government",
            "research": "scholar"
        }
        return mapping.get(department.lower())


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

async def create_nova_hooks(db_pool) -> NovaModuleHooks:
    """Factory pour créer les hooks Nova"""
    return NovaModuleHooks(db_pool)


async def create_mastermind_adapter(db_pool) -> MasterMindModuleAdapter:
    """Factory pour créer l'adaptateur MasterMind"""
    return MasterMindModuleAdapter(db_pool)
