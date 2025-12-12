"""
CHE·NU - Space Logic Engine
═══════════════════════════════════════════════════════════════════════════════
Logique métier profonde pour chaque espace CHE·NU.

Chaque espace a:
- Des règles métier spécifiques
- Des workflows prédéfinis
- Des validations
- Des automatisations
- Des intégrations natives

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any, Callable
from uuid import UUID
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import json


# ═══════════════════════════════════════════════════════════════════════════════
# BASE SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class SpaceLogic(ABC):
    """Classe de base pour la logique d'un espace"""
    
    scope: str
    label: str
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self._rules: List[Dict] = []
        self._workflows: Dict[str, Callable] = {}
        self._automations: List[Dict] = []
    
    @abstractmethod
    async def initialize(self) -> None:
        """Initialise la logique de l'espace"""
        pass
    
    @abstractmethod
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        """Valide une action avant exécution"""
        pass
    
    @abstractmethod
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Exécute un workflow prédéfini"""
        pass
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Vérifie les règles métier"""
        violations = []
        for rule in self._rules:
            if rule["event"] == event:
                if not await self._evaluate_rule(rule, data):
                    violations.append({
                        "rule": rule["name"],
                        "message": rule["message"]
                    })
        return violations


# ═══════════════════════════════════════════════════════════════════════════════
# PERSONAL SPACE
# ═══════════════════════════════════════════════════════════════════════════════

class PersonalSpaceLogic(SpaceLogic):
    """Logique pour l'espace Personnel"""
    
    scope = "personal"
    label = "Personnel"
    
    async def initialize(self) -> None:
        # Règles métier
        self._rules = [
            {
                "name": "budget_limit",
                "event": "expense_created",
                "condition": "amount > monthly_budget * 0.3",
                "message": "Cette dépense dépasse 30% de votre budget mensuel"
            },
            {
                "name": "habit_streak",
                "event": "habit_checked",
                "condition": "streak > 0",
                "message": "Continuez votre série !"
            }
        ]
        
        # Workflows
        self._workflows = {
            "morning_routine": self._morning_routine_workflow,
            "weekly_review": self._weekly_review_workflow,
            "goal_tracking": self._goal_tracking_workflow
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        validations = {
            "create_task": self._validate_task,
            "add_expense": self._validate_expense,
            "set_goal": self._validate_goal
        }
        
        validator = validations.get(action)
        if validator:
            return await validator(data, user_id)
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        workflow = self._workflows.get(workflow_id)
        if workflow:
            return await workflow(context)
        return {"error": f"Workflow {workflow_id} not found"}
    
    async def _validate_task(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        if not data.get("title"):
            errors.append("Le titre est requis")
        if data.get("due_date"):
            due = datetime.fromisoformat(data["due_date"])
            if due < datetime.now():
                errors.append("La date d'échéance ne peut pas être dans le passé")
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _validate_expense(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        if not data.get("amount") or data["amount"] <= 0:
            errors.append("Le montant doit être positif")
        if not data.get("category"):
            errors.append("La catégorie est requise")
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _validate_goal(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        if not data.get("title"):
            errors.append("L'objectif doit avoir un titre")
        if not data.get("target_date"):
            errors.append("Une date cible est requise")
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _morning_routine_workflow(self, context: Dict) -> Dict:
        """Workflow de routine matinale"""
        user_id = context["user_id"]
        
        steps = [
            {"action": "check_calendar", "status": "pending"},
            {"action": "review_tasks", "status": "pending"},
            {"action": "check_habits", "status": "pending"},
            {"action": "set_priorities", "status": "pending"}
        ]
        
        # Exécuter chaque étape
        results = []
        for step in steps:
            result = await self._execute_step(step["action"], user_id)
            results.append({**step, "result": result, "status": "completed"})
        
        return {"workflow": "morning_routine", "steps": results}
    
    async def _weekly_review_workflow(self, context: Dict) -> Dict:
        """Workflow de revue hebdomadaire"""
        return {
            "workflow": "weekly_review",
            "sections": [
                {"name": "Accomplissements", "items": []},
                {"name": "Défis", "items": []},
                {"name": "Leçons", "items": []},
                {"name": "Objectifs semaine prochaine", "items": []}
            ]
        }
    
    async def _goal_tracking_workflow(self, context: Dict) -> Dict:
        """Workflow de suivi d'objectifs"""
        return {"workflow": "goal_tracking", "status": "active"}
    
    async def _execute_step(self, action: str, user_id: UUID) -> Dict:
        return {"executed": True, "action": action}


# ═══════════════════════════════════════════════════════════════════════════════
# ENTERPRISE SPACE
# ═══════════════════════════════════════════════════════════════════════════════

class EnterpriseSpaceLogic(SpaceLogic):
    """Logique pour l'espace Entreprise"""
    
    scope = "enterprise"
    label = "Entreprise"
    
    async def initialize(self) -> None:
        self._rules = [
            {
                "name": "expense_approval",
                "event": "expense_submitted",
                "condition": "amount > 1000",
                "message": "Les dépenses > 1000$ nécessitent une approbation"
            },
            {
                "name": "overtime_alert",
                "event": "timesheet_submitted",
                "condition": "hours > 40",
                "message": "Heures supplémentaires détectées"
            },
            {
                "name": "budget_warning",
                "event": "project_expense",
                "condition": "total_spent > budget * 0.8",
                "message": "80% du budget projet utilisé"
            }
        ]
        
        self._workflows = {
            "employee_onboarding": self._onboarding_workflow,
            "expense_approval": self._expense_approval_workflow,
            "performance_review": self._performance_review_workflow,
            "project_kickoff": self._project_kickoff_workflow
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        validations = {
            "submit_expense": self._validate_expense,
            "create_invoice": self._validate_invoice,
            "hire_employee": self._validate_hire
        }
        
        validator = validations.get(action)
        if validator:
            return await validator(data, user_id)
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        workflow = self._workflows.get(workflow_id)
        if workflow:
            return await workflow(context)
        return {"error": f"Workflow {workflow_id} not found"}
    
    async def _validate_expense(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        warnings = []
        
        if not data.get("amount"):
            errors.append("Le montant est requis")
        elif data["amount"] > 10000:
            errors.append("Les dépenses > 10000$ nécessitent le CFO")
        elif data["amount"] > 1000:
            warnings.append("Approbation manager requise")
        
        if not data.get("receipt_url"):
            warnings.append("Ajoutez un justificatif")
        
        return {"valid": len(errors) == 0, "errors": errors, "warnings": warnings}
    
    async def _validate_invoice(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        
        required = ["client_id", "amount", "items", "due_date"]
        for field in required:
            if not data.get(field):
                errors.append(f"Le champ {field} est requis")
        
        if data.get("amount", 0) <= 0:
            errors.append("Le montant doit être positif")
        
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _validate_hire(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        
        if not data.get("position"):
            errors.append("Le poste est requis")
        if not data.get("department"):
            errors.append("Le département est requis")
        if not data.get("salary_range"):
            errors.append("La fourchette salariale est requise")
        
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _onboarding_workflow(self, context: Dict) -> Dict:
        """Workflow d'intégration employé"""
        employee_id = context.get("employee_id")
        
        steps = [
            {"day": 1, "tasks": ["Accueil", "Paperasse RH", "Setup IT", "Tour des locaux"]},
            {"day": 2, "tasks": ["Formation outils", "Rencontre équipe", "Premier projet"]},
            {"day": 7, "tasks": ["Point manager", "Feedback", "Objectifs"]},
            {"day": 30, "tasks": ["Évaluation période essai", "Ajustements"]}
        ]
        
        return {
            "workflow": "employee_onboarding",
            "employee_id": employee_id,
            "steps": steps,
            "status": "in_progress"
        }
    
    async def _expense_approval_workflow(self, context: Dict) -> Dict:
        """Workflow d'approbation de dépense"""
        amount = context.get("amount", 0)
        
        if amount < 100:
            approval_chain = ["auto"]
        elif amount < 1000:
            approval_chain = ["manager"]
        elif amount < 10000:
            approval_chain = ["manager", "director"]
        else:
            approval_chain = ["manager", "director", "cfo"]
        
        return {
            "workflow": "expense_approval",
            "amount": amount,
            "approval_chain": approval_chain,
            "current_step": 0,
            "status": "pending"
        }
    
    async def _performance_review_workflow(self, context: Dict) -> Dict:
        """Workflow de revue de performance"""
        return {
            "workflow": "performance_review",
            "phases": [
                {"name": "Auto-évaluation", "duration_days": 7},
                {"name": "Évaluation manager", "duration_days": 7},
                {"name": "Calibration", "duration_days": 3},
                {"name": "Feedback", "duration_days": 1}
            ]
        }
    
    async def _project_kickoff_workflow(self, context: Dict) -> Dict:
        """Workflow de lancement de projet"""
        return {
            "workflow": "project_kickoff",
            "checklist": [
                {"item": "Définir les objectifs", "required": True},
                {"item": "Identifier les parties prenantes", "required": True},
                {"item": "Établir le budget", "required": True},
                {"item": "Créer le planning", "required": True},
                {"item": "Assigner l'équipe", "required": True},
                {"item": "Kickoff meeting", "required": False}
            ]
        }


# ═══════════════════════════════════════════════════════════════════════════════
# PROJECTS SPACE
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectsSpaceLogic(SpaceLogic):
    """Logique pour l'espace Projets"""
    
    scope = "projects"
    label = "Projets"
    
    async def initialize(self) -> None:
        self._rules = [
            {
                "name": "deadline_warning",
                "event": "task_updated",
                "condition": "days_until_deadline < 3",
                "message": "Échéance dans moins de 3 jours"
            },
            {
                "name": "blocker_alert",
                "event": "task_blocked",
                "condition": "blocked_duration > 24",
                "message": "Tâche bloquée depuis plus de 24h"
            },
            {
                "name": "scope_creep",
                "event": "task_added",
                "condition": "total_tasks > initial_scope * 1.2",
                "message": "Attention: extension du périmètre détectée"
            }
        ]
        
        self._workflows = {
            "sprint_planning": self._sprint_planning_workflow,
            "retrospective": self._retrospective_workflow,
            "release": self._release_workflow,
            "risk_assessment": self._risk_assessment_workflow
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        validations = {
            "create_task": self._validate_task,
            "close_sprint": self._validate_sprint_close,
            "deploy": self._validate_deployment
        }
        
        validator = validations.get(action)
        if validator:
            return await validator(data, user_id)
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        workflow = self._workflows.get(workflow_id)
        if workflow:
            return await workflow(context)
        return {"error": f"Workflow {workflow_id} not found"}
    
    async def _validate_task(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        
        if not data.get("title"):
            errors.append("Le titre est requis")
        if not data.get("project_id"):
            errors.append("Le projet est requis")
        if data.get("estimated_hours", 0) > 40:
            errors.append("Décomposez les tâches > 40h")
        
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _validate_sprint_close(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        warnings = []
        
        incomplete_tasks = data.get("incomplete_tasks", 0)
        if incomplete_tasks > 0:
            warnings.append(f"{incomplete_tasks} tâche(s) incomplète(s) seront reportées")
        
        return {"valid": True, "errors": errors, "warnings": warnings}
    
    async def _validate_deployment(self, data: Dict, user_id: UUID) -> Dict:
        errors = []
        
        if not data.get("version"):
            errors.append("Le numéro de version est requis")
        if not data.get("changelog"):
            errors.append("Le changelog est requis")
        if not data.get("tests_passed"):
            errors.append("Les tests doivent passer avant déploiement")
        
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _sprint_planning_workflow(self, context: Dict) -> Dict:
        """Workflow de planification de sprint"""
        return {
            "workflow": "sprint_planning",
            "steps": [
                {"name": "Revue du backlog", "duration_min": 30},
                {"name": "Estimation", "duration_min": 60},
                {"name": "Sélection des tâches", "duration_min": 30},
                {"name": "Découpage", "duration_min": 30},
                {"name": "Assignation", "duration_min": 15}
            ],
            "velocity_suggested": context.get("avg_velocity", 20)
        }
    
    async def _retrospective_workflow(self, context: Dict) -> Dict:
        """Workflow de rétrospective"""
        return {
            "workflow": "retrospective",
            "format": "start_stop_continue",
            "sections": [
                {"name": "Start", "prompt": "Que devrions-nous commencer à faire?"},
                {"name": "Stop", "prompt": "Que devrions-nous arrêter?"},
                {"name": "Continue", "prompt": "Que devrions-nous continuer?"}
            ],
            "action_items": []
        }
    
    async def _release_workflow(self, context: Dict) -> Dict:
        """Workflow de release"""
        return {
            "workflow": "release",
            "checklist": [
                {"item": "Code review complété", "checked": False},
                {"item": "Tests passés", "checked": False},
                {"item": "Documentation à jour", "checked": False},
                {"item": "Changelog rédigé", "checked": False},
                {"item": "Backup effectué", "checked": False},
                {"item": "Rollback plan prêt", "checked": False}
            ]
        }
    
    async def _risk_assessment_workflow(self, context: Dict) -> Dict:
        """Workflow d'évaluation des risques"""
        return {
            "workflow": "risk_assessment",
            "matrix": {
                "impact_levels": ["Low", "Medium", "High", "Critical"],
                "probability_levels": ["Rare", "Unlikely", "Possible", "Likely"]
            },
            "categories": ["Technical", "Schedule", "Budget", "Resource", "External"]
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SCHOLAR SPACE
# ═══════════════════════════════════════════════════════════════════════════════

class ScholarSpaceLogic(SpaceLogic):
    """Logique pour l'espace Scholar"""
    
    scope = "scholar"
    label = "Scholar"
    
    async def initialize(self) -> None:
        self._rules = [
            {
                "name": "study_reminder",
                "event": "day_start",
                "condition": "cards_due > 0",
                "message": "Vous avez des cartes à réviser"
            },
            {
                "name": "streak_at_risk",
                "event": "day_end",
                "condition": "no_study_today and streak > 0",
                "message": "Étudiez pour maintenir votre série!"
            }
        ]
        
        self._workflows = {
            "study_session": self._study_session_workflow,
            "research_project": self._research_project_workflow,
            "course_completion": self._course_completion_workflow
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        workflow = self._workflows.get(workflow_id)
        if workflow:
            return await workflow(context)
        return {"error": f"Workflow {workflow_id} not found"}
    
    async def _study_session_workflow(self, context: Dict) -> Dict:
        """Workflow de session d'étude"""
        duration = context.get("duration_minutes", 25)
        
        return {
            "workflow": "study_session",
            "technique": "pomodoro",
            "phases": [
                {"name": "Focus", "duration": duration, "type": "study"},
                {"name": "Pause", "duration": 5, "type": "break"},
                {"name": "Focus", "duration": duration, "type": "study"},
                {"name": "Pause longue", "duration": 15, "type": "break"}
            ]
        }
    
    async def _research_project_workflow(self, context: Dict) -> Dict:
        """Workflow de projet de recherche"""
        return {
            "workflow": "research_project",
            "phases": [
                {"name": "Revue de littérature", "weight": 20},
                {"name": "Méthodologie", "weight": 15},
                {"name": "Collecte de données", "weight": 25},
                {"name": "Analyse", "weight": 20},
                {"name": "Rédaction", "weight": 15},
                {"name": "Révision", "weight": 5}
            ]
        }
    
    async def _course_completion_workflow(self, context: Dict) -> Dict:
        """Workflow de complétion de cours"""
        return {
            "workflow": "course_completion",
            "milestones": [
                {"percent": 25, "reward": "badge_started"},
                {"percent": 50, "reward": "badge_halfway"},
                {"percent": 75, "reward": "badge_almost"},
                {"percent": 100, "reward": "certificate"}
            ]
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SPACE LOGIC REGISTRY
# ═══════════════════════════════════════════════════════════════════════════════

class SpaceLogicRegistry:
    """Registre de toutes les logiques d'espace"""
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self._spaces: Dict[str, SpaceLogic] = {}
    
    async def initialize(self) -> None:
        """Initialise toutes les logiques d'espace"""
        space_classes = [
            PersonalSpaceLogic,
            EnterpriseSpaceLogic,
            ProjectsSpaceLogic,
            ScholarSpaceLogic,
            # Ajouter les autres espaces ici
        ]
        
        for space_class in space_classes:
            space = space_class(self.db)
            await space.initialize()
            self._spaces[space.scope] = space
    
    def get_space(self, scope: str) -> Optional[SpaceLogic]:
        """Récupère la logique d'un espace"""
        return self._spaces.get(scope)
    
    async def validate_action(
        self,
        scope: str,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        """Valide une action dans un espace"""
        space = self.get_space(scope)
        if space:
            return await space.validate_action(action, data, user_id)
        return {"valid": True}
    
    async def execute_workflow(
        self,
        scope: str,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Exécute un workflow dans un espace"""
        space = self.get_space(scope)
        if space:
            return await space.execute_workflow(workflow_id, context)
        return {"error": f"Space {scope} not found"}
    
    def list_workflows(self, scope: str) -> List[str]:
        """Liste les workflows disponibles pour un espace"""
        space = self.get_space(scope)
        if space:
            return list(space._workflows.keys())
        return []


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_registry_instance: Optional[SpaceLogicRegistry] = None

async def get_space_logic_registry(db_pool=None) -> SpaceLogicRegistry:
    """Factory pour le registre de logiques d'espace"""
    global _registry_instance
    if _registry_instance is None:
        _registry_instance = SpaceLogicRegistry(db_pool)
        await _registry_instance.initialize()
    return _registry_instance
