"""
CHE·NU v7.0 - Task Decomposer
═══════════════════════════════════════════════════════════════════════════════
Décompose les tâches complexes en sous-tâches exécutables par les agents.
Supporte les patterns prédéfinis et la décomposition intelligente par LLM.

Author: CHE·NU Team
Version: 7.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime
import logging
import json
import re
import uuid

if TYPE_CHECKING:
    from ..schemas.task_schema import Task, SubTask, ComplexityLevel

logger = logging.getLogger("CHE·NU.Core.TaskDecomposer")


# ═══════════════════════════════════════════════════════════════════════════════
# COMPLEXITY ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════

COMPLEXITY_INDICATORS = {
    "high": {
        "keywords": [
            "complet", "complète", "exhaustif", "détaillé", "analyse approfondie",
            "projet entier", "de a à z", "tout inclus", "multi", "plusieurs",
            "intégral", "global", "comprehensive", "full", "end-to-end"
        ],
        "weight": 0.3
    },
    "medium": {
        "keywords": [
            "estimation", "plan", "rapport", "comparaison", "évaluation",
            "analyse", "review", "audit", "assessment", "étude"
        ],
        "weight": 0.15
    },
    "low": {
        "keywords": [
            "simple", "rapide", "basique", "court", "résumé", "calculer",
            "quick", "brief", "basic", "simple", "fast"
        ],
        "weight": -0.1
    }
}

MULTI_TASK_INDICATORS = [
    " et ", " puis ", " ensuite ", " aussi ", " également ",
    " après ", " avant ", " finalement ", " premièrement ",
    " deuxièmement ", " troisièmement "
]


# ═══════════════════════════════════════════════════════════════════════════════
# DECOMPOSITION PATTERNS
# ═══════════════════════════════════════════════════════════════════════════════

DECOMPOSITION_PATTERNS: Dict[str, Dict[str, Any]] = {
    "estimation_construction": {
        "trigger_keywords": ["estimation", "devis", "soumission", "coût", "prix", "budget construction"],
        "min_matches": 2,
        "department": "construction",
        "execution_order": "sequential",
        "sub_tasks": [
            {
                "id": "analyze_scope",
                "description": "Analyser la portée et les exigences du projet",
                "agent_type": "director",
                "estimated_duration": 30
            },
            {
                "id": "measure_quantities",
                "description": "Mesurer et calculer les quantités de matériaux",
                "agent_type": "estimator",
                "estimated_duration": 60,
                "depends_on": ["analyze_scope"]
            },
            {
                "id": "estimate_labor",
                "description": "Estimer les heures de main d'œuvre par métier",
                "agent_type": "estimator",
                "estimated_duration": 45,
                "depends_on": ["measure_quantities"]
            },
            {
                "id": "price_materials",
                "description": "Obtenir les prix des matériaux auprès des fournisseurs",
                "agent_type": "procurement",
                "estimated_duration": 30,
                "depends_on": ["measure_quantities"]
            },
            {
                "id": "compile_estimate",
                "description": "Compiler et valider l'estimation finale",
                "agent_type": "estimator",
                "estimated_duration": 30,
                "depends_on": ["estimate_labor", "price_materials"]
            }
        ]
    },
    
    "marketing_campaign": {
        "trigger_keywords": ["campagne", "marketing", "promotion", "publicité", "lancement"],
        "min_matches": 2,
        "department": "marketing",
        "execution_order": "mixed",
        "sub_tasks": [
            {
                "id": "define_audience",
                "description": "Définir l'audience cible et les personas",
                "agent_type": "director",
                "estimated_duration": 30
            },
            {
                "id": "create_content",
                "description": "Créer le contenu créatif de la campagne",
                "agent_type": "creative",
                "estimated_duration": 120,
                "depends_on": ["define_audience"]
            },
            {
                "id": "plan_channels",
                "description": "Planifier les canaux de diffusion",
                "agent_type": "digital",
                "estimated_duration": 45,
                "depends_on": ["define_audience"]
            },
            {
                "id": "set_budget",
                "description": "Établir et valider le budget",
                "agent_type": "finance",
                "estimated_duration": 30,
                "depends_on": ["plan_channels"]
            },
            {
                "id": "schedule_launch",
                "description": "Planifier le calendrier de lancement",
                "agent_type": "director",
                "estimated_duration": 20,
                "depends_on": ["create_content", "set_budget"]
            }
        ]
    },
    
    "recruitment_process": {
        "trigger_keywords": ["recrutement", "embauche", "poste", "candidat", "hiring"],
        "min_matches": 2,
        "department": "hr",
        "execution_order": "sequential",
        "sub_tasks": [
            {
                "id": "define_position",
                "description": "Définir le profil du poste et les compétences requises",
                "agent_type": "director",
                "estimated_duration": 30
            },
            {
                "id": "create_posting",
                "description": "Rédiger et publier l'offre d'emploi",
                "agent_type": "recrutement",
                "estimated_duration": 45,
                "depends_on": ["define_position"]
            },
            {
                "id": "review_budget",
                "description": "Valider le budget salarial et les avantages",
                "agent_type": "finance",
                "estimated_duration": 20,
                "depends_on": ["define_position"]
            },
            {
                "id": "plan_interviews",
                "description": "Préparer le processus d'entrevue",
                "agent_type": "recrutement",
                "estimated_duration": 30,
                "depends_on": ["create_posting"]
            }
        ]
    },
    
    "project_planning": {
        "trigger_keywords": ["projet", "planification", "plan de projet", "planning", "échéancier"],
        "min_matches": 2,
        "department": "operations",
        "execution_order": "sequential",
        "sub_tasks": [
            {
                "id": "define_scope",
                "description": "Définir la portée et les objectifs du projet",
                "agent_type": "director",
                "estimated_duration": 45
            },
            {
                "id": "identify_tasks",
                "description": "Identifier et séquencer les tâches",
                "agent_type": "planning",
                "estimated_duration": 60,
                "depends_on": ["define_scope"]
            },
            {
                "id": "allocate_resources",
                "description": "Allouer les ressources humaines et matérielles",
                "agent_type": "operations",
                "estimated_duration": 45,
                "depends_on": ["identify_tasks"]
            },
            {
                "id": "estimate_costs",
                "description": "Estimer les coûts du projet",
                "agent_type": "finance",
                "estimated_duration": 30,
                "depends_on": ["identify_tasks", "allocate_resources"]
            },
            {
                "id": "create_timeline",
                "description": "Créer le calendrier et les jalons",
                "agent_type": "planning",
                "estimated_duration": 30,
                "depends_on": ["estimate_costs"]
            }
        ]
    },
    
    "financial_report": {
        "trigger_keywords": ["rapport financier", "bilan", "états financiers", "analyse financière"],
        "min_matches": 2,
        "department": "finance",
        "execution_order": "sequential",
        "sub_tasks": [
            {
                "id": "gather_data",
                "description": "Collecter les données financières",
                "agent_type": "comptabilite",
                "estimated_duration": 45
            },
            {
                "id": "reconcile_accounts",
                "description": "Réconcilier les comptes",
                "agent_type": "comptabilite",
                "estimated_duration": 60,
                "depends_on": ["gather_data"]
            },
            {
                "id": "analyze_trends",
                "description": "Analyser les tendances et variations",
                "agent_type": "director",
                "estimated_duration": 45,
                "depends_on": ["reconcile_accounts"]
            },
            {
                "id": "generate_report",
                "description": "Générer le rapport final",
                "agent_type": "director",
                "estimated_duration": 30,
                "depends_on": ["analyze_trends"]
            }
        ]
    },
    
    "client_onboarding": {
        "trigger_keywords": ["nouveau client", "onboarding", "intégration client", "accueil client"],
        "min_matches": 2,
        "department": "sales",
        "execution_order": "sequential",
        "sub_tasks": [
            {
                "id": "gather_info",
                "description": "Collecter les informations du client",
                "agent_type": "prospection",
                "estimated_duration": 30
            },
            {
                "id": "setup_account",
                "description": "Créer et configurer le compte client",
                "agent_type": "admin",
                "estimated_duration": 20,
                "depends_on": ["gather_info"]
            },
            {
                "id": "prepare_contracts",
                "description": "Préparer les contrats et documents légaux",
                "agent_type": "legal",
                "estimated_duration": 45,
                "depends_on": ["gather_info"]
            },
            {
                "id": "welcome_client",
                "description": "Envoyer la communication de bienvenue",
                "agent_type": "communication",
                "estimated_duration": 15,
                "depends_on": ["setup_account", "prepare_contracts"]
            }
        ]
    }
}


# ═══════════════════════════════════════════════════════════════════════════════
# COMPLEXITY RESULT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ComplexityAnalysis:
    """Résultat de l'analyse de complexité."""
    score: float
    level: str  # trivial, low, medium, high, critical
    factors: List[str]
    word_count: int
    should_decompose: bool
    multi_task_detected: bool
    estimated_subtasks: int
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "score": self.score,
            "level": self.level,
            "factors": self.factors,
            "word_count": self.word_count,
            "should_decompose": self.should_decompose,
            "multi_task_detected": self.multi_task_detected,
            "estimated_subtasks": self.estimated_subtasks
        }


# ═══════════════════════════════════════════════════════════════════════════════
# DECOMPOSITION RESULT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class DecompositionResult:
    """Résultat de la décomposition."""
    task_id: str
    subtasks: List[Dict[str, Any]]
    execution_order: str  # sequential, parallel, mixed
    pattern_used: Optional[str]
    pattern_confidence: float
    total_estimated_duration: int
    departments_involved: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "task_id": self.task_id,
            "subtasks": self.subtasks,
            "execution_order": self.execution_order,
            "pattern_used": self.pattern_used,
            "pattern_confidence": self.pattern_confidence,
            "total_estimated_duration": self.total_estimated_duration,
            "departments_involved": self.departments_involved
        }


# ═══════════════════════════════════════════════════════════════════════════════
# TASK DECOMPOSER
# ═══════════════════════════════════════════════════════════════════════════════

class TaskDecomposer:
    """
    🧩 Décomposeur de Tâches
    
    Analyse la complexité des tâches et les décompose en sous-tâches:
    - Patterns prédéfinis pour les cas courants
    - Décomposition LLM pour les cas complexes
    - Détection des dépendances entre sous-tâches
    """
    
    def __init__(
        self,
        llm_client: Any = None,
        auto_decompose_threshold: float = 0.5,
        max_subtasks: int = 10,
        preferred_model: str = "claude-sonnet-4-20250514"
    ):
        """
        Initialise le décomposeur.
        
        Args:
            llm_client: Client LLM pour la décomposition intelligente
            auto_decompose_threshold: Seuil pour décomposer automatiquement
            max_subtasks: Nombre maximum de sous-tâches
            preferred_model: Modèle LLM préféré
        """
        self.llm_client = llm_client
        self.auto_decompose_threshold = auto_decompose_threshold
        self.max_subtasks = max_subtasks
        self.preferred_model = preferred_model
        
        self.patterns = DECOMPOSITION_PATTERNS
        self.complexity_indicators = COMPLEXITY_INDICATORS
        
        logger.info("🧩 Task Decomposer initialized")
    
    def analyze_complexity(self, request: Dict[str, Any]) -> ComplexityAnalysis:
        """
        Analyse la complexité d'une requête.
        
        Args:
            request: Requête à analyser
            
        Returns:
            Analyse de la complexité
        """
        text = self._extract_text(request).lower()
        word_count = len(text.split())
        
        # Compter les indicateurs
        score = 0.0
        factors = []
        
        for level, config in self.complexity_indicators.items():
            matches = sum(1 for kw in config["keywords"] if kw in text)
            if matches > 0:
                contribution = config["weight"] * matches
                score += contribution
                factors.append(f"{level}_keywords:{matches}")
        
        # Longueur du texte
        if word_count > 200:
            score += 0.25
            factors.append("very_long_description")
        elif word_count > 100:
            score += 0.15
            factors.append("long_description")
        elif word_count > 50:
            score += 0.08
            factors.append("medium_description")
        
        # Détecter les multi-tâches
        multi_count = sum(1 for ind in MULTI_TASK_INDICATORS if ind in text)
        multi_task_detected = multi_count > 1
        
        if multi_task_detected:
            score += 0.15 * multi_count
            factors.append(f"multi_task:{multi_count}")
        
        # Détecter les patterns connus
        pattern_match = self._find_matching_pattern(text)
        if pattern_match:
            score += 0.2
            factors.append(f"pattern:{pattern_match[0]}")
        
        # Normaliser entre 0 et 1
        score = max(0.0, min(1.0, score))
        
        # Déterminer le niveau
        if score < 0.2:
            level = "trivial"
            estimated_subtasks = 1
        elif score < 0.4:
            level = "low"
            estimated_subtasks = 2
        elif score < 0.6:
            level = "medium"
            estimated_subtasks = 3
        elif score < 0.8:
            level = "high"
            estimated_subtasks = 5
        else:
            level = "critical"
            estimated_subtasks = 7
        
        return ComplexityAnalysis(
            score=round(score, 2),
            level=level,
            factors=factors,
            word_count=word_count,
            should_decompose=score >= self.auto_decompose_threshold,
            multi_task_detected=multi_task_detected,
            estimated_subtasks=estimated_subtasks
        )
    
    async def decompose(
        self,
        request: Dict[str, Any],
        routing_result: Dict[str, Any],
        task_id: Optional[str] = None,
        force_decompose: bool = False
    ) -> DecompositionResult:
        """
        Décompose une requête en sous-tâches.
        
        Args:
            request: Requête à décomposer
            routing_result: Résultat du routage
            task_id: ID de la tâche
            force_decompose: Forcer la décomposition
            
        Returns:
            Résultat de la décomposition
        """
        task_id = task_id or f"task_{uuid.uuid4().hex[:12]}"
        text = self._extract_text(request).lower()
        department = routing_result.get("department", "construction")
        
        # Analyser la complexité
        complexity = self.analyze_complexity(request)
        
        # Vérifier si on doit décomposer
        if not force_decompose and not complexity.should_decompose:
            return self._create_single_task(task_id, request, routing_result, department)
        
        # Chercher un pattern prédéfini
        pattern_match = self._find_matching_pattern(text)
        
        if pattern_match:
            pattern_name, pattern = pattern_match
            return self._apply_pattern(
                task_id, pattern_name, pattern, request, routing_result
            )
        
        # Utiliser LLM si disponible
        if self.llm_client:
            try:
                return await self._decompose_with_llm(
                    task_id, request, routing_result, complexity
                )
            except Exception as e:
                logger.warning(f"LLM decomposition failed: {e}")
        
        # Décomposition basique
        return self._basic_decomposition(task_id, request, routing_result, complexity)
    
    def decompose_sync(
        self,
        request: Dict[str, Any],
        routing_result: Dict[str, Any],
        task_id: Optional[str] = None
    ) -> DecompositionResult:
        """Version synchrone (patterns uniquement)."""
        task_id = task_id or f"task_{uuid.uuid4().hex[:12]}"
        text = self._extract_text(request).lower()
        department = routing_result.get("department", "construction")
        
        # Chercher un pattern
        pattern_match = self._find_matching_pattern(text)
        
        if pattern_match:
            return self._apply_pattern(
                task_id, pattern_match[0], pattern_match[1], request, routing_result
            )
        
        # Tâche simple
        return self._create_single_task(task_id, request, routing_result, department)
    
    def _extract_text(self, request: Any) -> str:
        """Extrait le texte de la requête."""
        if isinstance(request, str):
            return request
        
        if isinstance(request, dict):
            parts = []
            for field in ["description", "title", "content", "message", "query"]:
                if field in request:
                    parts.append(str(request[field]))
            return " ".join(parts)
        
        return str(request)
    
    def _find_matching_pattern(self, text: str) -> Optional[tuple]:
        """Trouve un pattern de décomposition correspondant."""
        best_match = None
        best_score = 0
        
        for pattern_name, pattern in self.patterns.items():
            keywords = pattern.get("trigger_keywords", [])
            min_matches = pattern.get("min_matches", 2)
            
            matches = sum(1 for kw in keywords if kw in text)
            
            if matches >= min_matches and matches > best_score:
                best_score = matches
                best_match = (pattern_name, pattern)
        
        return best_match
    
    def _apply_pattern(
        self,
        task_id: str,
        pattern_name: str,
        pattern: Dict[str, Any],
        request: Dict[str, Any],
        routing_result: Dict[str, Any]
    ) -> DecompositionResult:
        """Applique un pattern de décomposition."""
        subtasks = []
        departments = set()
        total_duration = 0
        description = self._extract_text(request)
        
        for i, task_template in enumerate(pattern.get("sub_tasks", [])):
            subtask = {
                "id": task_template["id"],
                "sequence": i + 1,
                "description": task_template["description"],
                "original_context": description[:300],
                "department": pattern.get("department", routing_result.get("department")),
                "agent_type": task_template.get("agent_type", "director"),
                "estimated_duration_seconds": task_template.get("estimated_duration", 30),
                "priority": 1,
                "dependencies": task_template.get("depends_on", [])
            }
            
            subtasks.append(subtask)
            departments.add(subtask["department"])
            total_duration += subtask["estimated_duration_seconds"]
        
        logger.info(f"Applied pattern '{pattern_name}', created {len(subtasks)} sub-tasks")
        
        return DecompositionResult(
            task_id=task_id,
            subtasks=subtasks,
            execution_order=pattern.get("execution_order", "sequential"),
            pattern_used=pattern_name,
            pattern_confidence=0.85,
            total_estimated_duration=total_duration,
            departments_involved=list(departments)
        )
    
    async def _decompose_with_llm(
        self,
        task_id: str,
        request: Dict[str, Any],
        routing_result: Dict[str, Any],
        complexity: ComplexityAnalysis
    ) -> DecompositionResult:
        """Utilise le LLM pour décomposer."""
        description = self._extract_text(request)
        department = routing_result.get("department", "construction")
        
        prompt = f"""Tu es un expert en gestion de projet. Décompose cette tâche en sous-tâches exécutables.

TÂCHE: {description[:800]}
DÉPARTEMENT PRINCIPAL: {department}
COMPLEXITÉ ESTIMÉE: {complexity.level}

Règles:
- Maximum {min(complexity.estimated_subtasks + 2, self.max_subtasks)} sous-tâches
- Chaque sous-tâche doit être actionnable
- Identifie les dépendances entre sous-tâches

Réponds UNIQUEMENT en JSON valide:
[
    {{"id": "task_1", "description": "...", "agent_type": "director|specialist", "priority": 1, "estimated_duration_seconds": 30}},
    {{"id": "task_2", "description": "...", "agent_type": "...", "priority": 2, "depends_on": ["task_1"]}}
]"""

        try:
            # Appel LLM via le client
            response = await self._call_llm(prompt)
            
            # Parser la réponse
            content = response
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            tasks = json.loads(content.strip())
            
            # Enrichir les tâches
            subtasks = []
            total_duration = 0
            
            for i, task in enumerate(tasks[:self.max_subtasks]):
                subtask = {
                    "id": task.get("id", f"task_{i+1}"),
                    "sequence": i + 1,
                    "description": task.get("description", ""),
                    "department": department,
                    "agent_type": task.get("agent_type", "director"),
                    "priority": task.get("priority", i + 1),
                    "estimated_duration_seconds": task.get("estimated_duration_seconds", 30),
                    "dependencies": task.get("depends_on", []) if task.get("depends_on") else []
                }
                subtasks.append(subtask)
                total_duration += subtask["estimated_duration_seconds"]
            
            return DecompositionResult(
                task_id=task_id,
                subtasks=subtasks,
                execution_order="mixed",
                pattern_used=None,
                pattern_confidence=0.7,
                total_estimated_duration=total_duration,
                departments_involved=[department]
            )
            
        except Exception as e:
            logger.warning(f"LLM decomposition failed: {e}")
            return self._basic_decomposition(task_id, request, routing_result, complexity)
    
    async def _call_llm(self, prompt: str) -> str:
        """Appelle le LLM."""
        if hasattr(self.llm_client, 'messages'):
            # Anthropic client
            response = await self.llm_client.messages.create(
                model=self.preferred_model,
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        elif hasattr(self.llm_client, 'chat'):
            # OpenAI client
            response = await self.llm_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        else:
            raise ValueError("Unknown LLM client type")
    
    def _basic_decomposition(
        self,
        task_id: str,
        request: Dict[str, Any],
        routing_result: Dict[str, Any],
        complexity: ComplexityAnalysis
    ) -> DecompositionResult:
        """Décomposition basique sans LLM."""
        description = self._extract_text(request)
        department = routing_result.get("department", "construction")
        agent_id = routing_result.get("agent_id", "CONST_DIR_001")
        
        # Créer des sous-tâches basiques basées sur la complexité
        subtasks = []
        
        if complexity.level in ["high", "critical"]:
            # Ajouter des étapes de base
            subtasks = [
                {
                    "id": "analyze",
                    "sequence": 1,
                    "description": f"Analyser: {description[:200]}",
                    "department": department,
                    "agent_type": "director",
                    "priority": 1,
                    "estimated_duration_seconds": 30,
                    "dependencies": []
                },
                {
                    "id": "execute",
                    "sequence": 2,
                    "description": "Exécuter la tâche principale",
                    "department": department,
                    "agent_type": "specialist",
                    "priority": 2,
                    "estimated_duration_seconds": 60,
                    "dependencies": ["analyze"]
                },
                {
                    "id": "validate",
                    "sequence": 3,
                    "description": "Valider et finaliser",
                    "department": department,
                    "agent_type": "director",
                    "priority": 3,
                    "estimated_duration_seconds": 20,
                    "dependencies": ["execute"]
                }
            ]
        else:
            # Tâche simple
            subtasks = [{
                "id": "main_task",
                "sequence": 1,
                "description": description,
                "department": department,
                "agent_id": agent_id,
                "agent_type": "director",
                "priority": 1,
                "estimated_duration_seconds": 60,
                "dependencies": []
            }]
        
        total_duration = sum(t["estimated_duration_seconds"] for t in subtasks)
        
        return DecompositionResult(
            task_id=task_id,
            subtasks=subtasks,
            execution_order="sequential",
            pattern_used=None,
            pattern_confidence=0.5,
            total_estimated_duration=total_duration,
            departments_involved=[department]
        )
    
    def _create_single_task(
        self,
        task_id: str,
        request: Dict[str, Any],
        routing_result: Dict[str, Any],
        department: str
    ) -> DecompositionResult:
        """Crée une seule tâche (pas de décomposition)."""
        description = self._extract_text(request)
        agent_id = routing_result.get("agent_id", f"{department.upper()}_DIR_001")
        
        return DecompositionResult(
            task_id=task_id,
            subtasks=[{
                "id": "main_task",
                "sequence": 1,
                "description": description,
                "department": department,
                "agent_id": agent_id,
                "agent_type": "director",
                "priority": 1,
                "estimated_duration_seconds": 60,
                "dependencies": []
            }],
            execution_order="sequential",
            pattern_used=None,
            pattern_confidence=1.0,
            total_estimated_duration=60,
            departments_involved=[department]
        )
    
    def add_pattern(self, name: str, pattern: Dict[str, Any]) -> None:
        """Ajoute un nouveau pattern de décomposition."""
        self.patterns[name] = pattern
        logger.info(f"Added decomposition pattern: {name}")
    
    def list_patterns(self) -> List[str]:
        """Liste tous les patterns disponibles."""
        return list(self.patterns.keys())


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "TaskDecomposer",
    "ComplexityAnalysis",
    "DecompositionResult",
    "DECOMPOSITION_PATTERNS",
    "COMPLEXITY_INDICATORS"
]
