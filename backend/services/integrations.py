"""
CHE·NU Construction - Intégrations Externes
==========================================
GitHub, Google Drive, et autres intégrations pour la construction
"""

import asyncio
import aiohttp
import base64
import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger("CHE·NU.Construction.Integrations")

# ============================================
# BASE INTEGRATION
# ============================================

@dataclass
class IntegrationConfig:
    """Configuration d'une intégration."""
    name: str
    api_key: str
    base_url: str
    extra: Dict[str, Any] = field(default_factory=dict)

class BaseIntegration(ABC):
    """Classe de base pour les intégrations."""
    
    def __init__(self, config: IntegrationConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def connect(self):
        self.session = aiohttp.ClientSession(headers=self._get_headers())
        logger.info(f"🔗 Connected to {self.config.name}")
    
    async def disconnect(self):
        if self.session:
            await self.session.close()
    
    @abstractmethod
    def _get_headers(self) -> Dict[str, str]:
        pass
    
    async def _request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> Dict:
        url = f"{self.config.base_url}{endpoint}"
        async with self.session.request(method, url, json=data, params=params) as resp:
            if resp.status >= 400:
                error = await resp.text()
                logger.error(f"API Error: {resp.status} - {error}")
                raise Exception(f"API Error: {resp.status}")
            return await resp.json()

# ============================================
# GITHUB INTEGRATION
# ============================================

class GitHubIntegration(BaseIntegration):
    """
    Intégration GitHub pour:
    - Versioning des configurations CHE·NU
    - Gestion des templates d'agents
    - Documentation technique
    - Scripts d'automatisation
    """
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.api_key}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    
    # === REPOSITORIES ===
    async def list_repos(self, org: str = None) -> List[Dict]:
        """Liste les repositories."""
        endpoint = f"/orgs/{org}/repos" if org else "/user/repos"
        return await self._request("GET", endpoint)
    
    async def get_repo(self, owner: str, repo: str) -> Dict:
        """Récupère les infos d'un repo."""
        return await self._request("GET", f"/repos/{owner}/{repo}")
    
    async def create_repo(self, name: str, description: str = "", private: bool = True) -> Dict:
        """Crée un nouveau repository."""
        return await self._request("POST", "/user/repos", {
            "name": name,
            "description": description,
            "private": private,
            "auto_init": True
        })
    
    # === FILES ===
    async def get_file_content(self, owner: str, repo: str, path: str, branch: str = "main") -> Dict:
        """Récupère le contenu d'un fichier."""
        result = await self._request(
            "GET", 
            f"/repos/{owner}/{repo}/contents/{path}",
            params={"ref": branch}
        )
        if result.get("content"):
            result["decoded_content"] = base64.b64decode(result["content"]).decode("utf-8")
        return result
    
    async def create_or_update_file(
        self, 
        owner: str, 
        repo: str, 
        path: str, 
        content: str, 
        message: str,
        branch: str = "main",
        sha: str = None  # Required for update
    ) -> Dict:
        """Crée ou met à jour un fichier."""
        payload = {
            "message": message,
            "content": base64.b64encode(content.encode()).decode(),
            "branch": branch
        }
        if sha:
            payload["sha"] = sha
        
        return await self._request(
            "PUT",
            f"/repos/{owner}/{repo}/contents/{path}",
            payload
        )
    
    async def delete_file(self, owner: str, repo: str, path: str, message: str, sha: str) -> Dict:
        """Supprime un fichier."""
        return await self._request(
            "DELETE",
            f"/repos/{owner}/{repo}/contents/{path}",
            {"message": message, "sha": sha}
        )
    
    # === BRANCHES ===
    async def list_branches(self, owner: str, repo: str) -> List[Dict]:
        """Liste les branches."""
        return await self._request("GET", f"/repos/{owner}/{repo}/branches")
    
    async def create_branch(self, owner: str, repo: str, branch_name: str, from_branch: str = "main") -> Dict:
        """Crée une nouvelle branche."""
        # Get SHA of source branch
        ref = await self._request("GET", f"/repos/{owner}/{repo}/git/ref/heads/{from_branch}")
        sha = ref["object"]["sha"]
        
        return await self._request("POST", f"/repos/{owner}/{repo}/git/refs", {
            "ref": f"refs/heads/{branch_name}",
            "sha": sha
        })
    
    # === ISSUES ===
    async def create_issue(
        self, 
        owner: str, 
        repo: str, 
        title: str, 
        body: str = "",
        labels: List[str] = None,
        assignees: List[str] = None
    ) -> Dict:
        """Crée une issue."""
        payload = {"title": title, "body": body}
        if labels:
            payload["labels"] = labels
        if assignees:
            payload["assignees"] = assignees
        
        return await self._request("POST", f"/repos/{owner}/{repo}/issues", payload)
    
    async def list_issues(self, owner: str, repo: str, state: str = "open") -> List[Dict]:
        """Liste les issues."""
        return await self._request(
            "GET", 
            f"/repos/{owner}/{repo}/issues",
            params={"state": state}
        )
    
    # === PULL REQUESTS ===
    async def create_pull_request(
        self,
        owner: str,
        repo: str,
        title: str,
        head: str,
        base: str = "main",
        body: str = ""
    ) -> Dict:
        """Crée une pull request."""
        return await self._request("POST", f"/repos/{owner}/{repo}/pulls", {
            "title": title,
            "head": head,
            "base": base,
            "body": body
        })
    
    # === RELEASES ===
    async def create_release(
        self,
        owner: str,
        repo: str,
        tag_name: str,
        name: str,
        body: str = "",
        draft: bool = False
    ) -> Dict:
        """Crée une release."""
        return await self._request("POST", f"/repos/{owner}/{repo}/releases", {
            "tag_name": tag_name,
            "name": name,
            "body": body,
            "draft": draft
        })
    
    # === CHE·NU CONSTRUCTION SPECIFIC ===
    async def save_agent_config(self, agent_id: str, config: Dict) -> Dict:
        """Sauvegarde la configuration d'un agent sur GitHub."""
        owner = self.config.extra.get("owner", "chenu-construction")
        repo = self.config.extra.get("repo", "agent-configs")
        path = f"agents/{agent_id}.json"
        message = f"Update agent config: {agent_id}"
        
        # Check if file exists
        try:
            existing = await self.get_file_content(owner, repo, path)
            sha = existing["sha"]
        except:
            sha = None
        
        return await self.create_or_update_file(
            owner, repo, path,
            content=json.dumps(config, indent=2, ensure_ascii=False),
            message=message,
            sha=sha
        )
    
    async def save_estimation_template(self, template_id: str, template: Dict) -> Dict:
        """Sauvegarde un template d'estimation."""
        owner = self.config.extra.get("owner")
        repo = self.config.extra.get("repo")
        path = f"templates/estimation/{template_id}.json"
        
        try:
            existing = await self.get_file_content(owner, repo, path)
            sha = existing["sha"]
        except:
            sha = None
        
        return await self.create_or_update_file(
            owner, repo, path,
            content=json.dumps(template, indent=2),
            message=f"Update estimation template: {template_id}",
            sha=sha
        )
    
    async def track_project_version(self, project_id: str, version_info: Dict) -> Dict:
        """Crée un tag de version pour un projet."""
        owner = self.config.extra.get("owner")
        repo = f"project-{project_id}"
        
        return await self.create_release(
            owner, repo,
            tag_name=version_info["version"],
            name=f"Version {version_info['version']}",
            body=version_info.get("changelog", "")
        )

# ============================================
# GOOGLE DRIVE INTEGRATION - CONSTRUCTION
# ============================================

class GoogleDriveConstructionIntegration(BaseIntegration):
    """
    Intégration Google Drive spécialisée pour la construction:
    - Gestion des plans (PDF, DWG)
    - Documents de projet
    - Photos de chantier
    - Rapports et soumissions
    """
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }
    
    # === STRUCTURE DE DOSSIERS PROJET ===
    PROJECT_FOLDER_STRUCTURE = {
        "00_ADMINISTRATION": ["Contrats", "Correspondance", "Réunions", "Permis"],
        "01_DESIGN": ["Architecture", "Structure", "MEP", "Civil", "BIM"],
        "02_ESTIMATION": ["Quantités", "Soumissions", "Comparatifs"],
        "03_PLANIFICATION": ["Échéanciers", "Ressources", "Budgets"],
        "04_CONSTRUCTION": ["Journaux", "Photos", "Rapports_Qualité", "SST"],
        "05_FERMETURE": ["As-Built", "Manuels", "Garanties", "Déficiences"]
    }
    
    async def create_project_structure(self, project_name: str, parent_id: str = None) -> Dict:
        """Crée la structure de dossiers complète pour un projet."""
        # Créer dossier racine du projet
        root = await self._create_folder(project_name, parent_id)
        root_id = root["id"]
        
        created_folders = {"root": root}
        
        # Créer les dossiers principaux et sous-dossiers
        for main_folder, subfolders in self.PROJECT_FOLDER_STRUCTURE.items():
            main = await self._create_folder(main_folder, root_id)
            created_folders[main_folder] = main
            
            for subfolder in subfolders:
                sub = await self._create_folder(subfolder, main["id"])
                created_folders[f"{main_folder}/{subfolder}"] = sub
        
        logger.info(f"📁 Created project structure for: {project_name}")
        return created_folders
    
    async def _create_folder(self, name: str, parent_id: str = None) -> Dict:
        """Crée un dossier."""
        metadata = {
            "name": name,
            "mimeType": "application/vnd.google-apps.folder"
        }
        if parent_id:
            metadata["parents"] = [parent_id]
        
        return await self._request("POST", "/files", metadata)
    
    # === GESTION DES PLANS ===
    async def upload_plan(
        self,
        project_id: str,
        discipline: str,  # "Architecture", "Structure", "MEP", "Civil"
        file_name: str,
        file_content: bytes,
        version: str = "01"
    ) -> Dict:
        """Upload un plan dans le bon dossier."""
        # Trouver le dossier de destination
        folder_path = f"01_DESIGN/{discipline}"
        folder_id = await self._get_folder_id(project_id, folder_path)
        
        # Nommer avec version
        versioned_name = f"{Path(file_name).stem}_v{version}{Path(file_name).suffix}"
        
        # Upload
        return await self._upload_file(versioned_name, file_content, folder_id)
    
    async def get_latest_plans(self, project_id: str, discipline: str = None) -> List[Dict]:
        """Récupère les derniers plans d'un projet."""
        if discipline:
            folder_path = f"01_DESIGN/{discipline}"
        else:
            folder_path = "01_DESIGN"
        
        folder_id = await self._get_folder_id(project_id, folder_path)
        
        query = f"'{folder_id}' in parents and trashed = false"
        result = await self._request(
            "GET",
            "/files",
            params={
                "q": query,
                "orderBy": "modifiedTime desc",
                "fields": "files(id,name,mimeType,modifiedTime,version)"
            }
        )
        return result.get("files", [])
    
    # === PHOTOS DE CHANTIER ===
    async def upload_site_photo(
        self,
        project_id: str,
        photo_content: bytes,
        date: str,  # Format: YYYY-MM-DD
        description: str = ""
    ) -> Dict:
        """Upload une photo de chantier avec métadonnées."""
        folder_id = await self._get_folder_id(project_id, "04_CONSTRUCTION/Photos")
        
        # Créer sous-dossier par date si nécessaire
        date_folder = await self._get_or_create_folder(date, folder_id)
        
        # Générer nom unique
        timestamp = datetime.now().strftime("%H%M%S")
        file_name = f"photo_{date}_{timestamp}.jpg"
        
        # Upload avec description dans les propriétés
        return await self._upload_file(
            file_name, 
            photo_content, 
            date_folder["id"],
            properties={"description": description}
        )
    
    # === RAPPORTS ET DOCUMENTS ===
    async def save_daily_report(self, project_id: str, date: str, report_content: str) -> Dict:
        """Sauvegarde un rapport journalier."""
        folder_id = await self._get_folder_id(project_id, "04_CONSTRUCTION/Journaux")
        
        # Créer comme Google Doc
        doc = await self._request("POST", "/files", {
            "name": f"Journal_{date}",
            "mimeType": "application/vnd.google-apps.document",
            "parents": [folder_id]
        })
        
        # Note: Le contenu serait ajouté via l'API Google Docs
        return doc
    
    async def save_estimation(self, project_id: str, estimation_name: str, content: bytes) -> Dict:
        """Sauvegarde une estimation."""
        folder_id = await self._get_folder_id(project_id, "02_ESTIMATION/Soumissions")
        return await self._upload_file(estimation_name, content, folder_id)
    
    # === HELPERS ===
    async def _get_folder_id(self, project_id: str, path: str) -> str:
        """Récupère l'ID d'un dossier par son chemin."""
        # Simplified - would need to navigate folder structure
        query = f"name = '{path.split('/')[-1]}' and mimeType = 'application/vnd.google-apps.folder'"
        result = await self._request("GET", "/files", params={"q": query})
        files = result.get("files", [])
        return files[0]["id"] if files else None
    
    async def _get_or_create_folder(self, name: str, parent_id: str) -> Dict:
        """Récupère ou crée un dossier."""
        query = f"name = '{name}' and '{parent_id}' in parents and mimeType = 'application/vnd.google-apps.folder'"
        result = await self._request("GET", "/files", params={"q": query})
        files = result.get("files", [])
        
        if files:
            return files[0]
        return await self._create_folder(name, parent_id)
    
    async def _upload_file(
        self, 
        name: str, 
        content: bytes, 
        folder_id: str,
        properties: Dict = None
    ) -> Dict:
        """Upload un fichier (simplifié - réel nécessite multipart)."""
        metadata = {
            "name": name,
            "parents": [folder_id]
        }
        if properties:
            metadata["properties"] = properties
        
        return await self._request("POST", "/files", metadata)

# ============================================
# AUTODESK INTEGRATION (BIM 360 / ACC)
# ============================================

class AutodeskIntegration(BaseIntegration):
    """
    Intégration Autodesk Construction Cloud / BIM 360:
    - Gestion des modèles BIM
    - Coordination des disciplines
    - Issues et RFI
    """
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }
    
    async def list_projects(self, hub_id: str) -> List[Dict]:
        """Liste les projets d'un hub."""
        return await self._request("GET", f"/project/v1/hubs/{hub_id}/projects")
    
    async def get_model_versions(self, project_id: str, folder_id: str) -> List[Dict]:
        """Récupère les versions d'un modèle."""
        return await self._request(
            "GET",
            f"/data/v1/projects/{project_id}/folders/{folder_id}/contents"
        )
    
    async def create_issue(
        self,
        project_id: str,
        title: str,
        description: str,
        location: Dict = None,
        assignee: str = None
    ) -> Dict:
        """Crée une issue/RFI dans BIM 360."""
        payload = {
            "title": title,
            "description": description,
            "issueType": "rfi"
        }
        if location:
            payload["location"] = location
        if assignee:
            payload["assignedTo"] = assignee
        
        return await self._request(
            "POST",
            f"/issues/v1/containers/{project_id}/quality-issues",
            payload
        )
    
    async def run_clash_detection(self, project_id: str, model_set_id: str) -> Dict:
        """Lance une détection de conflits."""
        return await self._request(
            "POST",
            f"/modelcoordination/v3/containers/{project_id}/clash-tests",
            {"modelSetId": model_set_id}
        )

# ============================================
# PROCORE INTEGRATION
# ============================================

class ProcoreIntegration(BaseIntegration):
    """
    Intégration Procore pour la gestion de projet construction:
    - Projets et budgets
    - RFI et Submittals
    - Daily Logs
    """
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }
    
    async def list_projects(self, company_id: int) -> List[Dict]:
        """Liste les projets."""
        return await self._request("GET", f"/rest/v1.0/projects", params={"company_id": company_id})
    
    async def create_rfi(
        self,
        project_id: int,
        subject: str,
        question: str,
        assignee_id: int = None
    ) -> Dict:
        """Crée une RFI."""
        return await self._request("POST", f"/rest/v1.0/projects/{project_id}/rfis", {
            "rfi": {
                "subject": subject,
                "question": question,
                "assignee_id": assignee_id
            }
        })
    
    async def create_daily_log(
        self,
        project_id: int,
        date: str,
        notes: str,
        weather: Dict = None,
        manpower: List[Dict] = None
    ) -> Dict:
        """Crée un journal quotidien."""
        payload = {
            "daily_log": {
                "log_date": date,
                "notes": notes
            }
        }
        if weather:
            payload["daily_log"]["weather"] = weather
        if manpower:
            payload["daily_log"]["manpower_logs"] = manpower
        
        return await self._request(
            "POST",
            f"/rest/v1.0/projects/{project_id}/daily_logs",
            payload
        )
    
    async def submit_change_order(
        self,
        project_id: int,
        title: str,
        description: str,
        amount: float
    ) -> Dict:
        """Soumet un ordre de changement."""
        return await self._request(
            "POST",
            f"/rest/v1.0/projects/{project_id}/change_order_requests",
            {
                "change_order_request": {
                    "title": title,
                    "description": description,
                    "amount": amount
                }
            }
        )

# ============================================
# CONSTRUCTION INTEGRATION MANAGER
# ============================================

class ConstructionIntegrationManager:
    """Gestionnaire central des intégrations construction."""
    
    def __init__(self):
        self.github: Optional[GitHubIntegration] = None
        self.drive: Optional[GoogleDriveConstructionIntegration] = None
        self.autodesk: Optional[AutodeskIntegration] = None
        self.procore: Optional[ProcoreIntegration] = None
    
    async def initialize(self, configs: Dict[str, IntegrationConfig]):
        """Initialise toutes les intégrations."""
        if "github" in configs:
            self.github = GitHubIntegration(configs["github"])
            await self.github.connect()
        
        if "drive" in configs:
            self.drive = GoogleDriveConstructionIntegration(configs["drive"])
            await self.drive.connect()
        
        if "autodesk" in configs:
            self.autodesk = AutodeskIntegration(configs["autodesk"])
            await self.autodesk.connect()
        
        if "procore" in configs:
            self.procore = ProcoreIntegration(configs["procore"])
            await self.procore.connect()
        
        logger.info("🏗️ Construction integrations initialized")
    
    async def setup_new_project(self, project_info: Dict) -> Dict:
        """Configure un nouveau projet sur toutes les plateformes."""
        results = {}
        
        # GitHub: Créer repo pour configs
        if self.github:
            results["github"] = await self.github.create_repo(
                name=f"project-{project_info['id']}",
                description=f"CHE·NU Project: {project_info['name']}"
            )
        
        # Google Drive: Créer structure de dossiers
        if self.drive:
            results["drive"] = await self.drive.create_project_structure(
                project_info['name']
            )
        
        return results
    
    async def sync_daily_report(self, project_id: str, report: Dict):
        """Synchronise un rapport journalier sur toutes les plateformes."""
        date = report["date"]
        
        # Drive: Sauvegarder le rapport
        if self.drive:
            await self.drive.save_daily_report(project_id, date, report["content"])
        
        # Procore: Créer daily log
        if self.procore:
            await self.procore.create_daily_log(
                project_id=int(project_id),
                date=date,
                notes=report["content"],
                weather=report.get("weather"),
                manpower=report.get("manpower")
            )
        
        # GitHub: Commit le rapport
        if self.github:
            await self.github.create_or_update_file(
                owner=self.github.config.extra.get("owner"),
                repo=f"project-{project_id}",
                path=f"daily-reports/{date}.json",
                content=json.dumps(report, indent=2),
                message=f"Daily report: {date}"
            )
    
    async def disconnect_all(self):
        """Déconnecte toutes les intégrations."""
        for integration in [self.github, self.drive, self.autodesk, self.procore]:
            if integration:
                await integration.disconnect()

# ============================================
# USAGE EXAMPLE
# ============================================

async def main():
    manager = ConstructionIntegrationManager()
    
    await manager.initialize({
        "github": IntegrationConfig(
            name="GitHub",
            api_key="ghp_xxx",
            base_url="https://api.github.com",
            extra={"owner": "my-construction-company", "repo": "chenu-configs"}
        ),
        "drive": IntegrationConfig(
            name="Google Drive",
            api_key="access_token",
            base_url="https://www.googleapis.com/drive/v3"
        )
    })
    
    # Setup new project
    await manager.setup_new_project({
        "id": "PRJ-2024-001",
        "name": "Centre Commercial Phase 2"
    })
    
    # Sync daily report
    await manager.sync_daily_report("PRJ-2024-001", {
        "date": "2024-12-15",
        "content": "Coulage béton niveau 3 complété...",
        "weather": {"temp": -5, "conditions": "neige légère"},
        "manpower": [{"trade": "Béton", "count": 12}]
    })
    
    await manager.disconnect_all()

if __name__ == "__main__":
    asyncio.run(main())
