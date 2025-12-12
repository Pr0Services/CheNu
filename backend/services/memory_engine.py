# chenu_v8/core/memory_engine.py

from typing import Dict, Any, List, Optional
from datetime import datetime

from ..db.session import get_session
from ..db import User, Task as DbTask
from ..schemas import TaskContext  # TODO: adapter import (message/task_schema.__init__)
# ex: from message_schema import TaskContext  si tu as un __init__

class MemoryEngine:
    """
    MÃ©moire CHE·NU v8 :
    - contexte utilisateur (prÃ©fÃ©rences)
    - dernier projet/entreprise
    - derniÃ¨res tÃ¢ches
    """

    def get_user_context(self, user_id: str) -> TaskContext:
        with get_session() as session:
            user: Optional[User] = session.get(User, user_id)
            prefs = user.preferences or {} if user else {}

        return TaskContext(
            user_id=user_id,
            project_id=prefs.get("last_project_id"),
            company_id=prefs.get("last_company_id"),
            workspace=prefs.get("workspace", "bureau"),
            locale=prefs.get("locale", "fr-CA"),
            timezone=prefs.get("timezone", "America/Toronto"),
            preferences=prefs,
        )

    def update_user_preferences(self, user_id: str, updates: Dict[str, Any]) -> None:
        with get_session() as session:
            user: Optional[User] = session.get(User, user_id)
            if not user:
                return
            prefs = user.preferences or {}
            prefs.update(updates)
            user.preferences = prefs
            session.add(user)

    def get_recent_tasks(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        with get_session() as session:
            q = (
                session.query(DbTask)
                .filter(DbTask.submitted_by_user_id == user_id)
                .order_by(DbTask.created_at.desc())
                .limit(limit)
            )
            results: List[DbTask] = q.all()

        return [
            {
                "task_id": t.task_id,
                "name": t.task_name,
                "status": t.status,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in results
        ]


memory_engine = MemoryEngine()
