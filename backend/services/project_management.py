"""
CHE·NU Unified - Project Management Integrations
═══════════════════════════════════════════════════════════════════════════════
Clients pour Asana, Monday.com, Jira, ClickUp.

Author: CHE·NU Team
Version: 8.0 Unified
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
import logging
import aiohttp

logger = logging.getLogger("CHE·NU.Integrations.ProjectManagement")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class PMTaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    BLOCKED = "blocked"
    DONE = "done"
    CANCELLED = "cancelled"


class PMTaskPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class PMProjectStatus(str, Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class PMTask:
    """Tâche de gestion de projet unifiée."""
    id: str
    name: str
    
    # Status
    status: PMTaskStatus = PMTaskStatus.TODO
    priority: PMTaskPriority = PMTaskPriority.NORMAL
    
    # Relations
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    parent_task_id: Optional[str] = None
    assignee_id: Optional[str] = None
    assignee_name: Optional[str] = None
    
    # Content
    description: Optional[str] = None
    
    # Dates
    due_date: Optional[date] = None
    start_date: Optional[date] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    
    # Progress
    progress_percent: int = 0
    
    # Metadata
    tags: List[str] = field(default_factory=list)
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    
    # Subtasks
    subtasks: List["PMTask"] = field(default_factory=list)
    subtask_count: int = 0


@dataclass
class PMProject:
    """Projet de gestion de projet unifié."""
    id: str
    name: str
    
    # Status
    status: PMProjectStatus = PMProjectStatus.ACTIVE
    
    # Details
    description: Optional[str] = None
    
    # Relations
    workspace_id: Optional[str] = None
    team_id: Optional[str] = None
    owner_id: Optional[str] = None
    
    # Dates
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    created_at: Optional[datetime] = None
    
    # Progress
    progress_percent: int = 0
    tasks_count: int = 0
    completed_tasks: int = 0
    
    # Metadata
    color: Optional[str] = None
    tags: List[str] = field(default_factory=list)


@dataclass
class PMUser:
    """Utilisateur/Membre d'équipe."""
    id: str
    name: str
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None


@dataclass
class PMComment:
    """Commentaire sur une tâche."""
    id: str
    task_id: str
    author_id: str
    author_name: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════════
# ASANA CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class AsanaClient:
    """
    🟣 Client Asana
    
    Fonctionnalités:
    - Workspaces, Projects, Sections
    - Tasks, Subtasks
    - Assignees, Due dates
    - Comments, Attachments
    """
    
    BASE_URL = "https://app.asana.com/api/1.0"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    # --- Workspaces ---
    async def list_workspaces(self) -> List[Dict[str, Any]]:
        """Liste les workspaces."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/workspaces",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return data.get("data", [])
    
    # --- Projects ---
    async def list_projects(
        self,
        workspace_id: str,
        archived: bool = False
    ) -> List[PMProject]:
        """Liste les projets d'un workspace."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/workspaces/{workspace_id}/projects",
                headers=self._get_headers(),
                params={"archived": str(archived).lower()}
            ) as resp:
                data = await resp.json()
                return [self._parse_project(p) for p in data.get("data", [])]
    
    async def get_project(self, project_id: str) -> PMProject:
        """Récupère un projet par ID."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/projects/{project_id}",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_project(data.get("data", {}))
    
    async def create_project(
        self,
        name: str,
        workspace_id: str,
        team_id: Optional[str] = None,
        **kwargs
    ) -> PMProject:
        """Crée un nouveau projet."""
        payload = {
            "data": {
                "name": name,
                "workspace": workspace_id,
                "team": team_id,
                "notes": kwargs.get("description"),
                "color": kwargs.get("color"),
                "due_date": kwargs.get("due_date").isoformat() if kwargs.get("due_date") else None
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/projects",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_project(data.get("data", {}))
    
    # --- Tasks ---
    async def list_tasks(
        self,
        project_id: str,
        completed: Optional[bool] = None,
        limit: int = 100
    ) -> List[PMTask]:
        """Liste les tâches d'un projet."""
        params = {"limit": limit, "opt_fields": "name,completed,due_on,assignee,notes,tags"}
        if completed is not None:
            params["completed_since"] = "now" if not completed else None
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/projects/{project_id}/tasks",
                headers=self._get_headers(),
                params=params
            ) as resp:
                data = await resp.json()
                return [self._parse_task(t) for t in data.get("data", [])]
    
    async def get_task(self, task_id: str) -> PMTask:
        """Récupère une tâche par ID."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/tasks/{task_id}",
                headers=self._get_headers(),
                params={"opt_fields": "name,completed,due_on,assignee,notes,tags,subtasks,num_subtasks"}
            ) as resp:
                data = await resp.json()
                return self._parse_task(data.get("data", {}))
    
    async def create_task(
        self,
        name: str,
        project_id: str,
        **kwargs
    ) -> PMTask:
        """Crée une nouvelle tâche."""
        payload = {
            "data": {
                "name": name,
                "projects": [project_id],
                "notes": kwargs.get("description"),
                "due_on": kwargs.get("due_date").isoformat() if kwargs.get("due_date") else None,
                "assignee": kwargs.get("assignee_id")
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/tasks",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_task(data.get("data", {}))
    
    async def update_task(
        self,
        task_id: str,
        **updates
    ) -> PMTask:
        """Met à jour une tâche."""
        payload = {"data": {}}
        
        if "name" in updates:
            payload["data"]["name"] = updates["name"]
        if "completed" in updates:
            payload["data"]["completed"] = updates["completed"]
        if "due_date" in updates:
            payload["data"]["due_on"] = updates["due_date"].isoformat() if updates["due_date"] else None
        if "assignee_id" in updates:
            payload["data"]["assignee"] = updates["assignee_id"]
        if "description" in updates:
            payload["data"]["notes"] = updates["description"]
        
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.BASE_URL}/tasks/{task_id}",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_task(data.get("data", {}))
    
    async def complete_task(self, task_id: str) -> PMTask:
        """Marque une tâche comme complétée."""
        return await self.update_task(task_id, completed=True)
    
    # --- Comments ---
    async def add_comment(
        self,
        task_id: str,
        text: str
    ) -> PMComment:
        """Ajoute un commentaire à une tâche."""
        payload = {"data": {"text": text}}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/tasks/{task_id}/stories",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                story = data.get("data", {})
                return PMComment(
                    id=story.get("gid", ""),
                    task_id=task_id,
                    author_id=story.get("created_by", {}).get("gid", ""),
                    author_name=story.get("created_by", {}).get("name", ""),
                    content=story.get("text", ""),
                    created_at=datetime.now()
                )
    
    # --- Parse helpers ---
    def _parse_project(self, data: Dict) -> PMProject:
        return PMProject(
            id=data.get("gid", ""),
            name=data.get("name", ""),
            description=data.get("notes"),
            workspace_id=data.get("workspace", {}).get("gid") if isinstance(data.get("workspace"), dict) else None,
            team_id=data.get("team", {}).get("gid") if isinstance(data.get("team"), dict) else None,
            color=data.get("color"),
            due_date=date.fromisoformat(data["due_date"]) if data.get("due_date") else None,
            status=PMProjectStatus.ARCHIVED if data.get("archived") else PMProjectStatus.ACTIVE
        )
    
    def _parse_task(self, data: Dict) -> PMTask:
        assignee = data.get("assignee") or {}
        
        return PMTask(
            id=data.get("gid", ""),
            name=data.get("name", ""),
            description=data.get("notes"),
            status=PMTaskStatus.DONE if data.get("completed") else PMTaskStatus.TODO,
            due_date=date.fromisoformat(data["due_on"]) if data.get("due_on") else None,
            assignee_id=assignee.get("gid") if isinstance(assignee, dict) else None,
            assignee_name=assignee.get("name") if isinstance(assignee, dict) else None,
            subtask_count=data.get("num_subtasks", 0),
            tags=[t.get("name", "") for t in data.get("tags", [])]
        )


# ═══════════════════════════════════════════════════════════════════════════════
# MONDAY.COM CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class MondayClient:
    """
    🟡 Client Monday.com
    
    Fonctionnalités:
    - Boards, Groups
    - Items (Tasks)
    - Updates (Comments)
    - Column values
    """
    
    BASE_URL = "https://api.monday.com/v2"
    
    def __init__(self, api_token: str):
        self.api_token = api_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": self.api_token,
            "Content-Type": "application/json"
        }
    
    async def _graphql(self, query: str, variables: Dict = None) -> Dict[str, Any]:
        """Exécute une requête GraphQL."""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.BASE_URL,
                headers=self._get_headers(),
                json=payload
            ) as resp:
                return await resp.json()
    
    # --- Boards ---
    async def list_boards(self, limit: int = 50) -> List[PMProject]:
        """Liste les boards."""
        query = f"""
            query {{
                boards(limit: {limit}) {{
                    id
                    name
                    description
                    state
                    board_folder_id
                    items_count
                }}
            }}
        """
        
        data = await self._graphql(query)
        boards = data.get("data", {}).get("boards", [])
        return [self._parse_board(b) for b in boards]
    
    async def get_board(self, board_id: str) -> PMProject:
        """Récupère un board."""
        query = f"""
            query {{
                boards(ids: [{board_id}]) {{
                    id
                    name
                    description
                    state
                    items_count
                    columns {{
                        id
                        title
                        type
                    }}
                }}
            }}
        """
        
        data = await self._graphql(query)
        boards = data.get("data", {}).get("boards", [])
        return self._parse_board(boards[0]) if boards else None
    
    # --- Items (Tasks) ---
    async def list_items(
        self,
        board_id: str,
        limit: int = 100
    ) -> List[PMTask]:
        """Liste les items d'un board."""
        query = f"""
            query {{
                boards(ids: [{board_id}]) {{
                    items_page(limit: {limit}) {{
                        items {{
                            id
                            name
                            state
                            column_values {{
                                id
                                text
                                value
                            }}
                            created_at
                            updated_at
                        }}
                    }}
                }}
            }}
        """
        
        data = await self._graphql(query)
        boards = data.get("data", {}).get("boards", [])
        if not boards:
            return []
        
        items = boards[0].get("items_page", {}).get("items", [])
        return [self._parse_item(i, board_id) for i in items]
    
    async def create_item(
        self,
        board_id: str,
        name: str,
        group_id: Optional[str] = None,
        column_values: Optional[Dict[str, Any]] = None
    ) -> PMTask:
        """Crée un nouvel item."""
        col_values = str(column_values).replace("'", '"') if column_values else "{}"
        
        query = f"""
            mutation {{
                create_item(
                    board_id: {board_id},
                    item_name: "{name}",
                    {"group_id: \"" + group_id + "\"," if group_id else ""}
                    column_values: '{col_values}'
                ) {{
                    id
                    name
                    state
                }}
            }}
        """
        
        data = await self._graphql(query)
        item = data.get("data", {}).get("create_item", {})
        return self._parse_item(item, board_id)
    
    async def update_item(
        self,
        item_id: str,
        board_id: str,
        column_values: Dict[str, Any]
    ) -> PMTask:
        """Met à jour un item."""
        col_values = str(column_values).replace("'", '"')
        
        query = f"""
            mutation {{
                change_multiple_column_values(
                    board_id: {board_id},
                    item_id: {item_id},
                    column_values: '{col_values}'
                ) {{
                    id
                    name
                    state
                }}
            }}
        """
        
        data = await self._graphql(query)
        item = data.get("data", {}).get("change_multiple_column_values", {})
        return self._parse_item(item, board_id)
    
    # --- Updates (Comments) ---
    async def add_update(self, item_id: str, body: str) -> Dict[str, Any]:
        """Ajoute un update (commentaire) à un item."""
        query = f"""
            mutation {{
                create_update(
                    item_id: {item_id},
                    body: "{body}"
                ) {{
                    id
                    body
                    created_at
                }}
            }}
        """
        
        data = await self._graphql(query)
        return data.get("data", {}).get("create_update", {})
    
    # --- Parse helpers ---
    def _parse_board(self, data: Dict) -> PMProject:
        status_map = {
            "active": PMProjectStatus.ACTIVE,
            "archived": PMProjectStatus.ARCHIVED,
            "deleted": PMProjectStatus.ARCHIVED
        }
        
        return PMProject(
            id=str(data.get("id", "")),
            name=data.get("name", ""),
            description=data.get("description"),
            status=status_map.get(data.get("state", "active"), PMProjectStatus.ACTIVE),
            tasks_count=data.get("items_count", 0)
        )
    
    def _parse_item(self, data: Dict, board_id: str) -> PMTask:
        status = PMTaskStatus.DONE if data.get("state") == "done" else PMTaskStatus.TODO
        
        # Extraire les valeurs de colonnes
        due_date = None
        assignee_name = None
        
        for col in data.get("column_values", []):
            col_id = col.get("id", "")
            if "date" in col_id.lower() and col.get("text"):
                try:
                    due_date = date.fromisoformat(col["text"][:10])
                except:
                    pass
            if "person" in col_id.lower() and col.get("text"):
                assignee_name = col["text"]
        
        return PMTask(
            id=str(data.get("id", "")),
            name=data.get("name", ""),
            project_id=board_id,
            status=status,
            due_date=due_date,
            assignee_name=assignee_name,
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")) if data.get("created_at") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# JIRA CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class JiraClient:
    """
    🔵 Client Jira (Atlassian)
    
    Fonctionnalités:
    - Projects
    - Issues (Tasks, Bugs, Stories)
    - Sprints
    - Comments
    """
    
    def __init__(
        self,
        domain: str,
        email: str,
        api_token: str
    ):
        self.domain = domain
        self.email = email
        self.api_token = api_token
        self.base_url = f"https://{domain}.atlassian.net/rest/api/3"
    
    def _get_auth(self) -> aiohttp.BasicAuth:
        return aiohttp.BasicAuth(self.email, self.api_token)
    
    def _get_headers(self) -> Dict[str, str]:
        return {"Content-Type": "application/json"}
    
    # --- Projects ---
    async def list_projects(self) -> List[PMProject]:
        """Liste les projets Jira."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/project",
                auth=self._get_auth(),
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return [self._parse_project(p) for p in data]
    
    async def get_project(self, project_key: str) -> PMProject:
        """Récupère un projet par clé."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/project/{project_key}",
                auth=self._get_auth(),
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return self._parse_project(data)
    
    # --- Issues ---
    async def search_issues(
        self,
        jql: str,
        max_results: int = 50
    ) -> List[PMTask]:
        """Recherche des issues avec JQL."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/search",
                auth=self._get_auth(),
                headers=self._get_headers(),
                params={
                    "jql": jql,
                    "maxResults": max_results,
                    "fields": "summary,description,status,priority,assignee,duedate,created,updated"
                }
            ) as resp:
                data = await resp.json()
                return [self._parse_issue(i) for i in data.get("issues", [])]
    
    async def list_project_issues(
        self,
        project_key: str,
        status: Optional[str] = None,
        max_results: int = 50
    ) -> List[PMTask]:
        """Liste les issues d'un projet."""
        jql = f"project = {project_key}"
        if status:
            jql += f" AND status = \"{status}\""
        jql += " ORDER BY created DESC"
        
        return await self.search_issues(jql, max_results)
    
    async def create_issue(
        self,
        project_key: str,
        summary: str,
        issue_type: str = "Task",
        **kwargs
    ) -> PMTask:
        """Crée une nouvelle issue."""
        payload = {
            "fields": {
                "project": {"key": project_key},
                "summary": summary,
                "issuetype": {"name": issue_type},
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {"type": "text", "text": kwargs.get("description", "")}
                            ]
                        }
                    ]
                } if kwargs.get("description") else None,
                "priority": {"name": kwargs.get("priority", "Medium")},
                "assignee": {"accountId": kwargs["assignee_id"]} if kwargs.get("assignee_id") else None,
                "duedate": kwargs.get("due_date").isoformat() if kwargs.get("due_date") else None
            }
        }
        
        # Nettoyer les None
        payload["fields"] = {k: v for k, v in payload["fields"].items() if v is not None}
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/issue",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return PMTask(
                    id=data.get("key", ""),
                    name=summary,
                    project_id=project_key
                )
    
    async def update_issue(
        self,
        issue_key: str,
        **updates
    ) -> PMTask:
        """Met à jour une issue."""
        fields = {}
        
        if "summary" in updates:
            fields["summary"] = updates["summary"]
        if "description" in updates:
            fields["description"] = {
                "type": "doc",
                "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": updates["description"]}]}]
            }
        if "assignee_id" in updates:
            fields["assignee"] = {"accountId": updates["assignee_id"]}
        if "due_date" in updates:
            fields["duedate"] = updates["due_date"].isoformat() if updates["due_date"] else None
        
        if fields:
            async with aiohttp.ClientSession() as session:
                async with session.put(
                    f"{self.base_url}/issue/{issue_key}",
                    auth=self._get_auth(),
                    headers=self._get_headers(),
                    json={"fields": fields}
                ) as resp:
                    pass  # Jira returns 204 No Content on success
        
        return PMTask(id=issue_key, name=updates.get("summary", ""))
    
    async def transition_issue(
        self,
        issue_key: str,
        transition_id: str
    ) -> bool:
        """Change le statut d'une issue."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/issue/{issue_key}/transitions",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json={"transition": {"id": transition_id}}
            ) as resp:
                return resp.status == 204
    
    # --- Comments ---
    async def add_comment(
        self,
        issue_key: str,
        body: str
    ) -> PMComment:
        """Ajoute un commentaire à une issue."""
        payload = {
            "body": {
                "type": "doc",
                "version": 1,
                "content": [
                    {"type": "paragraph", "content": [{"type": "text", "text": body}]}
                ]
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/issue/{issue_key}/comment",
                auth=self._get_auth(),
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return PMComment(
                    id=data.get("id", ""),
                    task_id=issue_key,
                    author_id=data.get("author", {}).get("accountId", ""),
                    author_name=data.get("author", {}).get("displayName", ""),
                    content=body,
                    created_at=datetime.now()
                )
    
    # --- Parse helpers ---
    def _parse_project(self, data: Dict) -> PMProject:
        return PMProject(
            id=data.get("key", ""),
            name=data.get("name", ""),
            description=data.get("description")
        )
    
    def _parse_issue(self, data: Dict) -> PMTask:
        fields = data.get("fields", {})
        assignee = fields.get("assignee") or {}
        status = fields.get("status", {})
        priority = fields.get("priority", {})
        
        status_map = {
            "To Do": PMTaskStatus.TODO,
            "In Progress": PMTaskStatus.IN_PROGRESS,
            "In Review": PMTaskStatus.IN_REVIEW,
            "Done": PMTaskStatus.DONE
        }
        
        priority_map = {
            "Highest": PMTaskPriority.URGENT,
            "High": PMTaskPriority.HIGH,
            "Medium": PMTaskPriority.NORMAL,
            "Low": PMTaskPriority.LOW,
            "Lowest": PMTaskPriority.LOW
        }
        
        return PMTask(
            id=data.get("key", ""),
            name=fields.get("summary", ""),
            description=self._extract_text(fields.get("description")),
            status=status_map.get(status.get("name", ""), PMTaskStatus.TODO),
            priority=priority_map.get(priority.get("name", ""), PMTaskPriority.NORMAL),
            assignee_id=assignee.get("accountId"),
            assignee_name=assignee.get("displayName"),
            due_date=date.fromisoformat(fields["duedate"]) if fields.get("duedate") else None,
            created_at=datetime.fromisoformat(fields["created"].replace("Z", "+00:00")) if fields.get("created") else None
        )
    
    def _extract_text(self, adf_content: Optional[Dict]) -> Optional[str]:
        """Extrait le texte d'un document ADF Jira."""
        if not adf_content:
            return None
        
        texts = []
        for content in adf_content.get("content", []):
            for item in content.get("content", []):
                if item.get("type") == "text":
                    texts.append(item.get("text", ""))
        
        return " ".join(texts) if texts else None


# ═══════════════════════════════════════════════════════════════════════════════
# CLICKUP CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class ClickUpClient:
    """
    🟣 Client ClickUp
    
    Fonctionnalités:
    - Workspaces, Spaces, Folders, Lists
    - Tasks
    - Comments
    - Time tracking
    """
    
    BASE_URL = "https://api.clickup.com/api/v2"
    
    def __init__(self, api_token: str):
        self.api_token = api_token
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": self.api_token,
            "Content-Type": "application/json"
        }
    
    # --- Teams/Workspaces ---
    async def list_teams(self) -> List[Dict[str, Any]]:
        """Liste les équipes (workspaces)."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/team",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return data.get("teams", [])
    
    # --- Spaces ---
    async def list_spaces(self, team_id: str) -> List[Dict[str, Any]]:
        """Liste les spaces d'une équipe."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/team/{team_id}/space",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return data.get("spaces", [])
    
    # --- Lists ---
    async def list_lists(self, folder_id: str) -> List[PMProject]:
        """Liste les listes d'un folder."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/folder/{folder_id}/list",
                headers=self._get_headers()
            ) as resp:
                data = await resp.json()
                return [self._parse_list(l) for l in data.get("lists", [])]
    
    # --- Tasks ---
    async def list_tasks(
        self,
        list_id: str,
        include_closed: bool = False
    ) -> List[PMTask]:
        """Liste les tâches d'une liste."""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.BASE_URL}/list/{list_id}/task",
                headers=self._get_headers(),
                params={"include_closed": str(include_closed).lower()}
            ) as resp:
                data = await resp.json()
                return [self._parse_task(t) for t in data.get("tasks", [])]
    
    async def create_task(
        self,
        list_id: str,
        name: str,
        **kwargs
    ) -> PMTask:
        """Crée une nouvelle tâche."""
        payload = {
            "name": name,
            "description": kwargs.get("description"),
            "assignees": kwargs.get("assignee_ids", []),
            "priority": kwargs.get("priority"),
            "due_date": int(kwargs["due_date"].timestamp() * 1000) if kwargs.get("due_date") else None
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.BASE_URL}/list/{list_id}/task",
                headers=self._get_headers(),
                json={k: v for k, v in payload.items() if v is not None}
            ) as resp:
                data = await resp.json()
                return self._parse_task(data)
    
    async def update_task(
        self,
        task_id: str,
        **updates
    ) -> PMTask:
        """Met à jour une tâche."""
        payload = {}
        
        if "name" in updates:
            payload["name"] = updates["name"]
        if "description" in updates:
            payload["description"] = updates["description"]
        if "status" in updates:
            payload["status"] = updates["status"]
        if "due_date" in updates:
            payload["due_date"] = int(updates["due_date"].timestamp() * 1000) if updates["due_date"] else None
        
        async with aiohttp.ClientSession() as session:
            async with session.put(
                f"{self.BASE_URL}/task/{task_id}",
                headers=self._get_headers(),
                json=payload
            ) as resp:
                data = await resp.json()
                return self._parse_task(data)
    
    # --- Parse helpers ---
    def _parse_list(self, data: Dict) -> PMProject:
        return PMProject(
            id=data.get("id", ""),
            name=data.get("name", ""),
            tasks_count=data.get("task_count", 0)
        )
    
    def _parse_task(self, data: Dict) -> PMTask:
        status = data.get("status", {})
        priority = data.get("priority", {})
        assignees = data.get("assignees", [])
        
        priority_map = {
            1: PMTaskPriority.URGENT,
            2: PMTaskPriority.HIGH,
            3: PMTaskPriority.NORMAL,
            4: PMTaskPriority.LOW
        }
        
        return PMTask(
            id=data.get("id", ""),
            name=data.get("name", ""),
            description=data.get("description"),
            status=PMTaskStatus.DONE if status.get("type") == "closed" else PMTaskStatus.TODO,
            priority=priority_map.get(priority.get("id"), PMTaskPriority.NORMAL) if priority else PMTaskPriority.NORMAL,
            project_id=data.get("list", {}).get("id"),
            project_name=data.get("list", {}).get("name"),
            assignee_id=assignees[0].get("id") if assignees else None,
            assignee_name=assignees[0].get("username") if assignees else None,
            due_date=date.fromtimestamp(data["due_date"] / 1000) if data.get("due_date") else None,
            created_at=datetime.fromtimestamp(int(data["date_created"]) / 1000) if data.get("date_created") else None
        )


# ═══════════════════════════════════════════════════════════════════════════════
# PROJECT MANAGEMENT SERVICE UNIFIÉ
# ═══════════════════════════════════════════════════════════════════════════════

class ProjectManagementService:
    """
    🎯 Service de Gestion de Projet Unifié
    
    Gère tous les clients PM avec une interface commune.
    """
    
    def __init__(self):
        self._asana_clients: Dict[str, AsanaClient] = {}
        self._monday_clients: Dict[str, MondayClient] = {}
        self._jira_clients: Dict[str, JiraClient] = {}
        self._clickup_clients: Dict[str, ClickUpClient] = {}
    
    # --- Registration ---
    def register_asana(self, account_id: str, access_token: str) -> None:
        self._asana_clients[account_id] = AsanaClient(access_token)
        logger.info(f"✅ Asana registered: {account_id}")
    
    def register_monday(self, account_id: str, api_token: str) -> None:
        self._monday_clients[account_id] = MondayClient(api_token)
        logger.info(f"✅ Monday.com registered: {account_id}")
    
    def register_jira(
        self,
        account_id: str,
        domain: str,
        email: str,
        api_token: str
    ) -> None:
        self._jira_clients[account_id] = JiraClient(domain, email, api_token)
        logger.info(f"✅ Jira registered: {account_id}")
    
    def register_clickup(self, account_id: str, api_token: str) -> None:
        self._clickup_clients[account_id] = ClickUpClient(api_token)
        logger.info(f"✅ ClickUp registered: {account_id}")
    
    # --- Unified Methods ---
    async def get_all_tasks(
        self,
        account_ids: List[str],
        include_completed: bool = False
    ) -> List[PMTask]:
        """Récupère toutes les tâches de tous les outils configurés."""
        all_tasks = []
        
        # Note: Cette méthode nécessiterait les IDs des projets/boards
        # Simplifié ici pour l'exemple
        
        return all_tasks
    
    async def get_task_dashboard(
        self,
        account_ids: List[str]
    ) -> Dict[str, Any]:
        """Dashboard unifié des tâches."""
        # Agréger les stats de tous les outils
        return {
            "total_tasks": 0,
            "by_status": {},
            "by_priority": {},
            "overdue": 0,
            "due_today": 0,
            "sources": list(account_ids)
        }


def create_project_management_service() -> ProjectManagementService:
    """Factory pour créer le service PM."""
    return ProjectManagementService()


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    # Enums
    "PMTaskStatus",
    "PMTaskPriority",
    "PMProjectStatus",
    
    # Data Classes
    "PMTask",
    "PMProject",
    "PMUser",
    "PMComment",
    
    # Clients
    "AsanaClient",
    "MondayClient",
    "JiraClient",
    "ClickUpClient",
    
    # Service
    "ProjectManagementService",
    "create_project_management_service"
]
