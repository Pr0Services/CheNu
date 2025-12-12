"""
CHE·NU - Automation Engine (Complet)
═══════════════════════════════════════════════════════════════════════════════
Système d'automatisations et de triggers pour CHE·NU.

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any, Callable, Union
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import json
import re
import logging

logger = logging.getLogger("CHENU.Automation")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class TriggerType(str, Enum):
    EVENT = "event"
    SCHEDULE = "schedule"
    WEBHOOK = "webhook"
    CONDITION = "condition"
    MANUAL = "manual"


class ActionType(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    NOTIFY = "notify"
    EMAIL = "email"
    WEBHOOK = "webhook"
    AGENT_TASK = "agent_task"
    WORKFLOW = "workflow"
    CUSTOM = "custom"


class AutomationStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    DISABLED = "disabled"
    ERROR = "error"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Trigger:
    id: str
    type: TriggerType
    config: Dict[str, Any]
    event_name: Optional[str] = None
    event_filter: Optional[Dict[str, Any]] = None
    cron_expression: Optional[str] = None
    timezone: str = "UTC"
    condition_expression: Optional[str] = None
    check_interval_seconds: int = 60


@dataclass
class Action:
    id: str
    type: ActionType
    config: Dict[str, Any]
    target_scope: Optional[str] = None
    target_module: Optional[str] = None
    data_template: Optional[Dict[str, Any]] = None
    run_if: Optional[str] = None
    max_retries: int = 3
    retry_delay_seconds: int = 60


@dataclass
class Automation:
    id: UUID
    name: str
    description: Optional[str]
    owner_id: UUID
    scope: str
    trigger: Trigger
    actions: List[Action]
    status: AutomationStatus = AutomationStatus.ACTIVE
    run_count: int = 0
    last_run_at: Optional[datetime] = None
    last_error: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class AutomationRun:
    id: UUID
    automation_id: UUID
    trigger_data: Dict[str, Any]
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    action_results: List[Dict[str, Any]] = field(default_factory=list)
    success: bool = False
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════════
# EXPRESSION EVALUATOR
# ═══════════════════════════════════════════════════════════════════════════════

class ExpressionEvaluator:
    """Évalue les expressions conditionnelles de manière sécurisée"""
    
    SAFE_OPERATORS = {
        '==', '!=', '>', '<', '>=', '<=',
        'and', 'or', 'not', 'in', 'contains',
        '+', '-', '*', '/'
    }
    
    def evaluate(self, expression: str, context: Dict[str, Any]) -> bool:
        if not expression:
            return True
        
        try:
            # Parser sécurisé
            result = self._safe_eval(expression, context)
            return bool(result)
        except Exception as e:
            logger.warning(f"Expression evaluation failed: {e}")
            return False
    
    def _safe_eval(self, expr: str, context: Dict[str, Any]) -> Any:
        """Évaluation sécurisée sans eval()"""
        expr = expr.strip()
        
        # Comparaisons simples
        for op in ['>=', '<=', '==', '!=', '>', '<']:
            if op in expr:
                left, right = expr.split(op, 1)
                left_val = self._get_value(left.strip(), context)
                right_val = self._get_value(right.strip(), context)
                
                if op == '>=': return left_val >= right_val
                if op == '<=': return left_val <= right_val
                if op == '==': return left_val == right_val
                if op == '!=': return left_val != right_val
                if op == '>': return left_val > right_val
                if op == '<': return left_val < right_val
        
        # Opérateurs logiques
        if ' and ' in expr:
            parts = expr.split(' and ')
            return all(self._safe_eval(p, context) for p in parts)
        
        if ' or ' in expr:
            parts = expr.split(' or ')
            return any(self._safe_eval(p, context) for p in parts)
        
        if expr.startswith('not '):
            return not self._safe_eval(expr[4:], context)
        
        # Contains
        if ' contains ' in expr:
            left, right = expr.split(' contains ', 1)
            left_val = self._get_value(left.strip(), context)
            right_val = self._get_value(right.strip(), context)
            return right_val in left_val
        
        # Valeur directe
        return self._get_value(expr, context)
    
    def _get_value(self, expr: str, context: Dict[str, Any]) -> Any:
        """Récupère une valeur depuis le contexte ou parse un littéral"""
        expr = expr.strip()
        
        # String littéral
        if (expr.startswith('"') and expr.endswith('"')) or \
           (expr.startswith("'") and expr.endswith("'")):
            return expr[1:-1]
        
        # Nombre
        try:
            if '.' in expr:
                return float(expr)
            return int(expr)
        except ValueError:
            pass
        
        # Boolean
        if expr.lower() == 'true':
            return True
        if expr.lower() == 'false':
            return False
        
        # Variable du contexte (accès imbriqué)
        value = context
        for part in expr.split('.'):
            if isinstance(value, dict):
                value = value.get(part)
            else:
                value = getattr(value, part, None)
            if value is None:
                return None
        
        return value


# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATE ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class TemplateEngine:
    """Moteur de templates pour les données d'action"""
    
    def render(self, template: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        result = {}
        for key, value in template.items():
            if isinstance(value, str):
                result[key] = self._render_string(value, context)
            elif isinstance(value, dict):
                result[key] = self.render(value, context)
            elif isinstance(value, list):
                result[key] = [
                    self._render_string(v, context) if isinstance(v, str) 
                    else (self.render(v, context) if isinstance(v, dict) else v)
                    for v in value
                ]
            else:
                result[key] = value
        return result
    
    def _render_string(self, template: str, context: Dict[str, Any]) -> Any:
        pattern = r'\{\{([^}]+)\}\}'
        
        def replace(match):
            expr = match.group(1).strip()
            try:
                value = context
                for part in expr.split('.'):
                    if isinstance(value, dict):
                        value = value.get(part, '')
                    else:
                        value = getattr(value, part, '')
                return str(value) if value is not None else ''
            except:
                return ''
        
        return re.sub(pattern, replace, template)


# ═══════════════════════════════════════════════════════════════════════════════
# ACTION HANDLERS
# ═══════════════════════════════════════════════════════════════════════════════

class ActionHandler(ABC):
    @abstractmethod
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        pass


class CreateActionHandler(ActionHandler):
    def __init__(self, db_pool=None):
        self.db = db_pool
        self.template = TemplateEngine()
    
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        data = self.template.render(action.data_template or {}, context)
        logger.info(f"CREATE: {action.target_scope}/{action.target_module} -> {data}")
        return {"action": "create", "data": data, "success": True}


class UpdateActionHandler(ActionHandler):
    def __init__(self, db_pool=None):
        self.db = db_pool
        self.template = TemplateEngine()
    
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        data = self.template.render(action.data_template or {}, context)
        target_id = action.config.get("target_id") or context.get("entity_id")
        logger.info(f"UPDATE: {target_id} -> {data}")
        return {"action": "update", "target_id": target_id, "data": data, "success": True}


class NotifyActionHandler(ActionHandler):
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        template = TemplateEngine()
        notification = {
            "type": action.config.get("notification_type", "info"),
            "title": template._render_string(action.config.get("title", ""), context),
            "message": template._render_string(action.config.get("message", ""), context),
            "user_id": str(context.get("user_id", ""))
        }
        logger.info(f"NOTIFY: {notification}")
        # TODO: WebSocket push
        return {"action": "notify", "notification": notification, "success": True}


class EmailActionHandler(ActionHandler):
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        template = TemplateEngine()
        email = {
            "to": template._render_string(action.config.get("to", ""), context),
            "subject": template._render_string(action.config.get("subject", ""), context),
            "body": template._render_string(action.config.get("body", ""), context),
            "template_id": action.config.get("template_id")
        }
        logger.info(f"EMAIL: {email['to']} - {email['subject']}")
        # TODO: Envoyer via service email
        return {"action": "email", "email": email, "success": True}


class WebhookActionHandler(ActionHandler):
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        import aiohttp
        
        template = TemplateEngine()
        url = template._render_string(action.config.get("url", ""), context)
        method = action.config.get("method", "POST").upper()
        headers = action.config.get("headers", {})
        body = template.render(action.config.get("body", {}), context)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.request(method, url, json=body, headers=headers) as resp:
                    response_data = await resp.json()
                    return {
                        "action": "webhook",
                        "url": url,
                        "status": resp.status,
                        "response": response_data,
                        "success": resp.status < 400
                    }
        except Exception as e:
            return {"action": "webhook", "url": url, "error": str(e), "success": False}


class AgentTaskActionHandler(ActionHandler):
    def __init__(self, team_service=None):
        self.team_service = team_service
        self.template = TemplateEngine()
    
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        agent_id = action.config.get("agent_id")
        task_type = action.config.get("task_type", "general")
        task_data = self.template.render(action.config.get("task_data", {}), context)
        priority = action.config.get("priority", 3)
        
        if self.team_service:
            from .services.my_team_service import TaskAssignment
            assignment = TaskAssignment(
                agent_id=UUID(agent_id),
                task_type=task_type,
                task_data=task_data,
                priority=priority
            )
            result = await self.team_service.assign_task(assignment)
            return {"action": "agent_task", "task": result, "success": True}
        
        return {
            "action": "agent_task",
            "agent_id": agent_id,
            "task_type": task_type,
            "task_data": task_data,
            "success": True
        }


class WorkflowActionHandler(ActionHandler):
    def __init__(self, space_registry=None):
        self.space_registry = space_registry
    
    async def execute(self, action: Action, context: Dict[str, Any]) -> Dict[str, Any]:
        scope = action.target_scope or context.get("scope", "personal")
        workflow_id = action.config.get("workflow_id")
        
        if self.space_registry:
            result = await self.space_registry.execute_workflow(
                scope, workflow_id, context
            )
            return {"action": "workflow", "result": result, "success": True}
        
        return {"action": "workflow", "workflow_id": workflow_id, "success": True}


# ═══════════════════════════════════════════════════════════════════════════════
# AUTOMATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class AutomationEngine:
    """
    Moteur principal d'automatisation CHE·NU.
    
    Gère:
    - L'enregistrement des automations
    - L'écoute des événements
    - L'exécution des triggers
    - L'orchestration des actions
    """
    
    def __init__(self, db_pool=None):
        self.db = db_pool
        self.evaluator = ExpressionEvaluator()
        self.template = TemplateEngine()
        
        # Handlers par type d'action
        self._action_handlers: Dict[ActionType, ActionHandler] = {
            ActionType.CREATE: CreateActionHandler(db_pool),
            ActionType.UPDATE: UpdateActionHandler(db_pool),
            ActionType.NOTIFY: NotifyActionHandler(),
            ActionType.EMAIL: EmailActionHandler(),
            ActionType.WEBHOOK: WebhookActionHandler(),
            ActionType.AGENT_TASK: AgentTaskActionHandler(),
            ActionType.WORKFLOW: WorkflowActionHandler(),
        }
        
        # Automations en mémoire (cache)
        self._automations: Dict[UUID, Automation] = {}
        
        # Event listeners
        self._event_listeners: Dict[str, List[UUID]] = {}
        
        # Scheduler pour les automations planifiées
        self._scheduler_running = False
        self._scheduler_task: Optional[asyncio.Task] = None
    
    # ═══════════════════════════════════════════════════════════════════════════
    # GESTION DES AUTOMATIONS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def register_automation(self, automation: Automation) -> None:
        """Enregistre une automation"""
        self._automations[automation.id] = automation
        
        # Enregistrer le listener si c'est un trigger EVENT
        if automation.trigger.type == TriggerType.EVENT:
            event_name = automation.trigger.event_name
            if event_name:
                if event_name not in self._event_listeners:
                    self._event_listeners[event_name] = []
                self._event_listeners[event_name].append(automation.id)
        
        logger.info(f"Automation registered: {automation.name} ({automation.id})")
    
    async def unregister_automation(self, automation_id: UUID) -> None:
        """Supprime une automation"""
        if automation_id in self._automations:
            automation = self._automations[automation_id]
            
            # Supprimer le listener
            if automation.trigger.type == TriggerType.EVENT:
                event_name = automation.trigger.event_name
                if event_name and event_name in self._event_listeners:
                    self._event_listeners[event_name].remove(automation_id)
            
            del self._automations[automation_id]
            logger.info(f"Automation unregistered: {automation_id}")
    
    async def load_automations_from_db(self, user_id: Optional[UUID] = None) -> None:
        """Charge les automations depuis la base de données"""
        if not self.db:
            return
        
        query = """
            SELECT * FROM automations
            WHERE status = 'active'
        """
        params = []
        
        if user_id:
            query += " AND owner_id = $1"
            params.append(user_id)
        
        rows = await self.db.fetch(query, *params)
        
        for row in rows:
            automation = self._row_to_automation(row)
            await self.register_automation(automation)
        
        logger.info(f"Loaded {len(rows)} automations from database")
    
    def _row_to_automation(self, row: Dict) -> Automation:
        """Convertit une row DB en Automation"""
        trigger_data = json.loads(row['trigger_config'])
        trigger = Trigger(
            id=trigger_data.get('id', str(uuid4())),
            type=TriggerType(trigger_data['type']),
            config=trigger_data.get('config', {}),
            event_name=trigger_data.get('event_name'),
            event_filter=trigger_data.get('event_filter'),
            cron_expression=trigger_data.get('cron_expression'),
            condition_expression=trigger_data.get('condition_expression')
        )
        
        actions_data = json.loads(row['actions_config'])
        actions = [
            Action(
                id=a.get('id', str(uuid4())),
                type=ActionType(a['type']),
                config=a.get('config', {}),
                target_scope=a.get('target_scope'),
                target_module=a.get('target_module'),
                data_template=a.get('data_template'),
                run_if=a.get('run_if')
            )
            for a in actions_data
        ]
        
        return Automation(
            id=row['id'],
            name=row['name'],
            description=row.get('description'),
            owner_id=row['owner_id'],
            scope=row['scope'],
            trigger=trigger,
            actions=actions,
            status=AutomationStatus(row['status']),
            run_count=row.get('run_count', 0),
            last_run_at=row.get('last_run_at'),
            created_at=row['created_at']
        )
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ÉVÉNEMENTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def emit_event(
        self,
        event_name: str,
        data: Dict[str, Any],
        user_id: Optional[UUID] = None
    ) -> List[AutomationRun]:
        """
        Émet un événement et déclenche les automations correspondantes.
        
        Args:
            event_name: Nom de l'événement (ex: "task.created", "expense.approved")
            data: Données de l'événement
            user_id: ID de l'utilisateur (optionnel, pour filtrer)
        
        Returns:
            Liste des runs d'automation déclenchés
        """
        runs = []
        
        # Trouver les automations qui écoutent cet événement
        automation_ids = self._event_listeners.get(event_name, [])
        
        for automation_id in automation_ids:
            automation = self._automations.get(automation_id)
            if not automation:
                continue
            
            # Vérifier le filtre utilisateur
            if user_id and automation.owner_id != user_id:
                continue
            
            # Vérifier le filtre d'événement
            if automation.trigger.event_filter:
                if not self._matches_filter(data, automation.trigger.event_filter):
                    continue
            
            # Exécuter l'automation
            run = await self._execute_automation(automation, {
                "event": event_name,
                "data": data,
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            })
            runs.append(run)
        
        return runs
    
    def _matches_filter(self, data: Dict, filter_config: Dict) -> bool:
        """Vérifie si les données correspondent au filtre"""
        for key, expected in filter_config.items():
            actual = data.get(key)
            
            if isinstance(expected, dict):
                # Opérateurs avancés
                if "$eq" in expected and actual != expected["$eq"]:
                    return False
                if "$ne" in expected and actual == expected["$ne"]:
                    return False
                if "$gt" in expected and not (actual > expected["$gt"]):
                    return False
                if "$gte" in expected and not (actual >= expected["$gte"]):
                    return False
                if "$lt" in expected and not (actual < expected["$lt"]):
                    return False
                if "$lte" in expected and not (actual <= expected["$lte"]):
                    return False
                if "$in" in expected and actual not in expected["$in"]:
                    return False
                if "$contains" in expected and expected["$contains"] not in actual:
                    return False
            else:
                # Égalité simple
                if actual != expected:
                    return False
        
        return True
    
    # ═══════════════════════════════════════════════════════════════════════════
    # EXÉCUTION
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def _execute_automation(
        self,
        automation: Automation,
        trigger_data: Dict[str, Any]
    ) -> AutomationRun:
        """Exécute une automation"""
        run = AutomationRun(
            id=uuid4(),
            automation_id=automation.id,
            trigger_data=trigger_data
        )
        
        try:
            # Contexte d'exécution
            context = {
                **trigger_data,
                "automation": {
                    "id": str(automation.id),
                    "name": automation.name,
                    "scope": automation.scope
                }
            }
            
            # Exécuter chaque action
            for action in automation.actions:
                # Vérifier la condition run_if
                if action.run_if:
                    if not self.evaluator.evaluate(action.run_if, context):
                        run.action_results.append({
                            "action_id": action.id,
                            "skipped": True,
                            "reason": "Condition not met"
                        })
                        continue
                
                # Exécuter l'action
                handler = self._action_handlers.get(action.type)
                if handler:
                    result = await self._execute_action_with_retry(
                        handler, action, context
                    )
                    run.action_results.append({
                        "action_id": action.id,
                        **result
                    })
                    
                    # Ajouter le résultat au contexte pour les actions suivantes
                    context[f"action_{action.id}"] = result
                else:
                    run.action_results.append({
                        "action_id": action.id,
                        "error": f"No handler for action type: {action.type}"
                    })
            
            run.success = all(
                r.get("success", False) or r.get("skipped", False)
                for r in run.action_results
            )
            
        except Exception as e:
            run.error = str(e)
            run.success = False
            logger.error(f"Automation {automation.id} failed: {e}")
        
        run.completed_at = datetime.utcnow()
        
        # Mettre à jour les stats
        automation.run_count += 1
        automation.last_run_at = run.completed_at
        if not run.success:
            automation.last_error = run.error
        
        # Sauvegarder le run
        await self._save_run(run)
        
        return run
    
    async def _execute_action_with_retry(
        self,
        handler: ActionHandler,
        action: Action,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Exécute une action avec retry"""
        last_error = None
        
        for attempt in range(action.max_retries):
            try:
                result = await handler.execute(action, context)
                if result.get("success"):
                    return result
                last_error = result.get("error")
            except Exception as e:
                last_error = str(e)
            
            if attempt < action.max_retries - 1:
                await asyncio.sleep(action.retry_delay_seconds)
        
        return {"success": False, "error": last_error, "attempts": action.max_retries}
    
    async def _save_run(self, run: AutomationRun) -> None:
        """Sauvegarde un run en base"""
        if not self.db:
            return
        
        await self.db.execute("""
            INSERT INTO automation_runs (
                id, automation_id, trigger_data, started_at, completed_at,
                action_results, success, error
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """,
            run.id,
            run.automation_id,
            json.dumps(run.trigger_data),
            run.started_at,
            run.completed_at,
            json.dumps(run.action_results),
            run.success,
            run.error
        )
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SCHEDULER
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def start_scheduler(self) -> None:
        """Démarre le scheduler pour les automations planifiées"""
        if self._scheduler_running:
            return
        
        self._scheduler_running = True
        self._scheduler_task = asyncio.create_task(self._scheduler_loop())
        logger.info("Automation scheduler started")
    
    async def stop_scheduler(self) -> None:
        """Arrête le scheduler"""
        self._scheduler_running = False
        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass
        logger.info("Automation scheduler stopped")
    
    async def _scheduler_loop(self) -> None:
        """Boucle principale du scheduler"""
        while self._scheduler_running:
            try:
                now = datetime.utcnow()
                
                for automation in self._automations.values():
                    if automation.trigger.type != TriggerType.SCHEDULE:
                        continue
                    
                    if automation.status != AutomationStatus.ACTIVE:
                        continue
                    
                    # Vérifier si c'est le moment d'exécuter
                    if self._should_run_now(automation.trigger, now):
                        await self._execute_automation(automation, {
                            "scheduled_at": now.isoformat(),
                            "cron": automation.trigger.cron_expression
                        })
                
                # Attendre 60 secondes avant la prochaine vérification
                await asyncio.sleep(60)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                await asyncio.sleep(60)
    
    def _should_run_now(self, trigger: Trigger, now: datetime) -> bool:
        """Vérifie si un trigger planifié doit s'exécuter maintenant"""
        if not trigger.cron_expression:
            return False
        
        # Parser le cron (format simplifié: minute hour day month weekday)
        # TODO: Utiliser une vraie lib cron comme croniter
        try:
            parts = trigger.cron_expression.split()
            if len(parts) != 5:
                return False
            
            minute, hour, day, month, weekday = parts
            
            # Vérifier minute
            if minute != '*' and int(minute) != now.minute:
                return False
            
            # Vérifier heure
            if hour != '*' and int(hour) != now.hour:
                return False
            
            # Vérifier jour du mois
            if day != '*' and int(day) != now.day:
                return False
            
            # Vérifier mois
            if month != '*' and int(month) != now.month:
                return False
            
            # Vérifier jour de la semaine (0=lundi)
            if weekday != '*' and int(weekday) != now.weekday():
                return False
            
            return True
            
        except Exception:
            return False


# ═══════════════════════════════════════════════════════════════════════════════
# AUTOMATION TEMPLATES (Prédéfinis)
# ═══════════════════════════════════════════════════════════════════════════════

AUTOMATION_TEMPLATES = {
    "daily_standup_reminder": {
        "name": "Rappel Standup Quotidien",
        "description": "Envoie un rappel chaque matin pour le standup",
        "scope": "enterprise",
        "trigger": {
            "type": "schedule",
            "cron_expression": "0 9 * * 1-5"  # 9h du lundi au vendredi
        },
        "actions": [
            {
                "type": "notify",
                "config": {
                    "title": "⏰ Standup dans 30 minutes",
                    "message": "N'oubliez pas de préparer vos updates!"
                }
            }
        ]
    },
    "expense_approval_notification": {
        "name": "Notification Approbation Dépense",
        "description": "Notifie quand une dépense est approuvée",
        "scope": "enterprise",
        "trigger": {
            "type": "event",
            "event_name": "expense.approved"
        },
        "actions": [
            {
                "type": "notify",
                "config": {
                    "title": "✅ Dépense approuvée",
                    "message": "Votre dépense de {{data.amount}}$ a été approuvée"
                }
            },
            {
                "type": "email",
                "config": {
                    "to": "{{data.submitter_email}}",
                    "subject": "Dépense approuvée",
                    "body": "Votre dépense de {{data.amount}}$ a été approuvée par {{data.approver_name}}."
                }
            }
        ]
    },
    "task_deadline_reminder": {
        "name": "Rappel Échéance Tâche",
        "description": "Rappelle les tâches dont l'échéance approche",
        "scope": "projects",
        "trigger": {
            "type": "event",
            "event_name": "task.deadline_approaching",
            "event_filter": {
                "days_remaining": {"$lte": 2}
            }
        },
        "actions": [
            {
                "type": "notify",
                "config": {
                    "notification_type": "warning",
                    "title": "⚠️ Échéance proche",
                    "message": "La tâche '{{data.task_title}}' expire dans {{data.days_remaining}} jour(s)"
                }
            }
        ]
    },
    "welcome_new_team_member": {
        "name": "Accueil Nouveau Membre",
        "description": "Envoie un message de bienvenue aux nouveaux membres",
        "scope": "enterprise",
        "trigger": {
            "type": "event",
            "event_name": "team.member_joined"
        },
        "actions": [
            {
                "type": "email",
                "config": {
                    "to": "{{data.member_email}}",
                    "subject": "Bienvenue dans l'équipe! 🎉",
                    "body": "Bonjour {{data.member_name}},\n\nBienvenue dans l'équipe {{data.team_name}}!\n\nVotre manager {{data.manager_name}} vous contactera bientôt pour votre onboarding."
                }
            },
            {
                "type": "agent_task",
                "config": {
                    "agent_id": "sophie_hr",
                    "task_type": "onboarding",
                    "task_data": {
                        "new_member_id": "{{data.member_id}}",
                        "team": "{{data.team_name}}"
                    }
                }
            }
        ]
    },
    "study_streak_reminder": {
        "name": "Rappel Série d'Étude",
        "description": "Rappelle de maintenir la série d'étude",
        "scope": "scholar",
        "trigger": {
            "type": "schedule",
            "cron_expression": "0 20 * * *"  # 20h chaque jour
        },
        "actions": [
            {
                "type": "notify",
                "config": {
                    "title": "📚 N'oubliez pas d'étudier!",
                    "message": "Maintenez votre série de {{data.streak_days}} jours!"
                }
            }
        ]
    }
}


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_engine_instance: Optional[AutomationEngine] = None

async def get_automation_engine(db_pool=None) -> AutomationEngine:
    """Factory pour le moteur d'automation"""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = AutomationEngine(db_pool)
        await _engine_instance.load_automations_from_db()
        await _engine_instance.start_scheduler()
    return _engine_instance
