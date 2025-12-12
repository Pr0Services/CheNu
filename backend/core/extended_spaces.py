"""
CHE·NU - Extended Space Logic Engines
═══════════════════════════════════════════════════════════════════════════════
Logiques métier pour les 6 espaces additionnels:
- Home (Domotique)
- Creative Studio
- Government
- Immobilier
- Associations
- Social

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from uuid import UUID
import logging

from .space_logic_engine import SpaceLogic

logger = logging.getLogger("CHENU.SpaceLogic.Extended")


# ═══════════════════════════════════════════════════════════════════════════════
# HOME SPACE LOGIC (Domotique & Maison Intelligente)
# ═══════════════════════════════════════════════════════════════════════════════

class HomeSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Home.
    
    Gère:
    - Appareils IoT et domotique
    - Scènes et automatisations maison
    - Énergie et consommation
    - Sécurité domestique
    - Entretien et tâches ménagères
    """
    
    @property
    def scope_id(self) -> str:
        return "home"
    
    async def initialize(self) -> None:
        # Règles de sécurité
        self.rules["security_alert"] = {
            "name": "Alerte Sécurité",
            "description": "Notifie immédiatement en cas de détection intrusion",
            "condition": "device.type == 'security' and event.type == 'intrusion'",
            "severity": "critical"
        }
        
        # Règles d'énergie
        self.rules["energy_peak"] = {
            "name": "Pic de Consommation",
            "description": "Alerte si la consommation dépasse le seuil",
            "condition": "consumption.current > consumption.threshold * 1.5",
            "severity": "warning"
        }
        
        self.rules["temperature_anomaly"] = {
            "name": "Anomalie Température",
            "description": "Détecte les variations anormales de température",
            "condition": "abs(temp.current - temp.target) > 5",
            "severity": "info"
        }
        
        # Workflows
        self.workflows["morning_routine"] = {
            "name": "Routine du Matin",
            "steps": [
                {"action": "turn_on", "target": "coffee_maker", "delay": 0},
                {"action": "adjust_blinds", "target": "all_blinds", "value": 50, "delay": 5},
                {"action": "set_temperature", "target": "thermostat", "value": 21, "delay": 0},
                {"action": "turn_on", "target": "bathroom_lights", "delay": 10},
                {"action": "play", "target": "speakers", "content": "morning_news", "delay": 15}
            ]
        }
        
        self.workflows["leaving_home"] = {
            "name": "Quitter la Maison",
            "steps": [
                {"action": "turn_off", "target": "all_lights"},
                {"action": "adjust_blinds", "target": "all_blinds", "value": 0},
                {"action": "set_temperature", "target": "thermostat", "value": 18},
                {"action": "arm", "target": "security_system"},
                {"action": "turn_off", "target": "non_essential_devices"}
            ]
        }
        
        self.workflows["coming_home"] = {
            "name": "Arrivée à la Maison",
            "steps": [
                {"action": "disarm", "target": "security_system"},
                {"action": "turn_on", "target": "entrance_lights"},
                {"action": "set_temperature", "target": "thermostat", "value": 21},
                {"action": "adjust_blinds", "target": "all_blinds", "value": 75}
            ]
        }
        
        self.workflows["night_mode"] = {
            "name": "Mode Nuit",
            "steps": [
                {"action": "turn_off", "target": "all_lights"},
                {"action": "arm", "target": "security_system", "mode": "night"},
                {"action": "set_temperature", "target": "thermostat", "value": 19},
                {"action": "adjust_blinds", "target": "all_blinds", "value": 0},
                {"action": "set_volume", "target": "all_speakers", "value": 0}
            ]
        }
        
        self.workflows["maintenance_check"] = {
            "name": "Vérification Entretien",
            "frequency": "monthly",
            "checklist": [
                {"item": "filters", "description": "Vérifier filtres climatisation"},
                {"item": "batteries", "description": "Vérifier batteries détecteurs"},
                {"item": "water_heater", "description": "Vérifier chauffe-eau"},
                {"item": "gutters", "description": "Vérifier gouttières"},
                {"item": "appliances", "description": "Nettoyer appareils"}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "control_device":
            device_type = data.get("device_type")
            
            # Vérifier les permissions pour les appareils critiques
            if device_type in ["security_system", "door_lock", "camera"]:
                # Nécessite authentification supplémentaire
                return {
                    "valid": True,
                    "requires_confirmation": True,
                    "message": "Action sur appareil sensible - confirmation requise"
                }
            
            return {"valid": True}
        
        if action == "create_scene":
            # Vérifier que la scène ne contient pas d'actions dangereuses
            actions = data.get("actions", [])
            has_security_action = any(
                a.get("target") in ["security_system", "door_lock"]
                for a in actions
            )
            
            if has_security_action:
                return {
                    "valid": True,
                    "warning": "Cette scène contient des actions de sécurité"
                }
            
            return {"valid": True}
        
        if action == "set_temperature":
            temp = data.get("value", 20)
            if temp < 15 or temp > 28:
                return {
                    "valid": False,
                    "error": "Température hors limites (15-28°C)"
                }
            return {"valid": True}
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        results = []
        for step in workflow.get("steps", []):
            # Simuler l'exécution de chaque étape
            results.append({
                "action": step.get("action"),
                "target": step.get("target"),
                "status": "executed"
            })
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "steps_executed": len(results),
            "results": results,
            "success": True
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "device_event":
            device_type = data.get("device_type")
            event_type = data.get("event_type")
            
            # Règle sécurité
            if device_type == "security" and event_type == "intrusion":
                triggered.append({
                    "rule": "security_alert",
                    "severity": "critical",
                    "message": "🚨 Intrusion détectée!",
                    "action_required": True
                })
        
        if event == "energy_reading":
            current = data.get("current_consumption", 0)
            threshold = data.get("threshold", 5000)
            
            if current > threshold * 1.5:
                triggered.append({
                    "rule": "energy_peak",
                    "severity": "warning",
                    "message": f"⚡ Consommation élevée: {current}W (seuil: {threshold}W)"
                })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# CREATIVE STUDIO SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class CreativeStudioSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Creative Studio.
    
    Gère:
    - Projets créatifs (design, vidéo, audio, écriture)
    - Assets et bibliothèques
    - Collaboration créative
    - Versions et révisions
    - Publication et distribution
    """
    
    @property
    def scope_id(self) -> str:
        return "creative_studio"
    
    async def initialize(self) -> None:
        # Règles
        self.rules["asset_size_limit"] = {
            "name": "Limite Taille Asset",
            "description": "Les assets ne doivent pas dépasser 500MB",
            "max_size_mb": 500
        }
        
        self.rules["version_control"] = {
            "name": "Contrôle de Version",
            "description": "Créer une version à chaque modification majeure",
            "auto_version_threshold": 10  # Après 10 modifications
        }
        
        self.rules["approval_required"] = {
            "name": "Approbation Requise",
            "description": "Les publications externes nécessitent approbation",
            "applies_to": ["publish", "export_final"]
        }
        
        # Workflows
        self.workflows["design_review"] = {
            "name": "Revue Design",
            "phases": [
                {
                    "name": "Préparation",
                    "tasks": ["upload_design", "add_context", "select_reviewers"]
                },
                {
                    "name": "Feedback",
                    "tasks": ["collect_comments", "annotation_round"],
                    "duration_hours": 48
                },
                {
                    "name": "Révision",
                    "tasks": ["address_feedback", "update_design"]
                },
                {
                    "name": "Approbation",
                    "tasks": ["final_review", "approve_or_reject"]
                }
            ]
        }
        
        self.workflows["content_production"] = {
            "name": "Production de Contenu",
            "phases": [
                {"name": "Brief", "tasks": ["create_brief", "define_objectives", "assign_team"]},
                {"name": "Concept", "tasks": ["brainstorm", "create_moodboard", "present_concepts"]},
                {"name": "Production", "tasks": ["create_content", "internal_review", "revisions"]},
                {"name": "Post-Production", "tasks": ["finalize", "quality_check", "prepare_deliverables"]},
                {"name": "Livraison", "tasks": ["client_review", "final_adjustments", "deliver"]}
            ]
        }
        
        self.workflows["brand_guideline_check"] = {
            "name": "Vérification Brand Guidelines",
            "checklist": [
                {"item": "colors", "description": "Couleurs conformes à la charte"},
                {"item": "typography", "description": "Typographies approuvées utilisées"},
                {"item": "logo_usage", "description": "Logo utilisé correctement"},
                {"item": "tone_of_voice", "description": "Ton de voix respecté"},
                {"item": "imagery", "description": "Images conformes au style"}
            ]
        }
        
        self.workflows["asset_organization"] = {
            "name": "Organisation des Assets",
            "steps": [
                {"action": "categorize", "description": "Catégoriser par type"},
                {"action": "tag", "description": "Ajouter tags et métadonnées"},
                {"action": "version", "description": "Créer version si nécessaire"},
                {"action": "archive", "description": "Archiver les anciennes versions"}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "upload_asset":
            size_mb = data.get("size_bytes", 0) / (1024 * 1024)
            
            if size_mb > 500:
                return {
                    "valid": False,
                    "error": f"Asset trop volumineux ({size_mb:.1f}MB > 500MB)"
                }
            
            return {"valid": True}
        
        if action == "publish":
            # Vérifier que le contenu a été approuvé
            approval_status = data.get("approval_status")
            
            if approval_status != "approved":
                return {
                    "valid": False,
                    "error": "Le contenu doit être approuvé avant publication",
                    "requires": "approval"
                }
            
            return {"valid": True}
        
        if action == "delete_project":
            # Vérifier qu'il n'y a pas de dépendances
            dependencies = data.get("dependencies", [])
            
            if dependencies:
                return {
                    "valid": True,
                    "warning": f"Ce projet a {len(dependencies)} dépendances",
                    "requires_confirmation": True
                }
            
            return {"valid": True}
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        if workflow_id == "brand_guideline_check":
            # Exécuter le checklist
            results = []
            for item in workflow["checklist"]:
                results.append({
                    "item": item["item"],
                    "description": item["description"],
                    "status": "pending"
                })
            
            return {
                "workflow_id": workflow_id,
                "checklist": results,
                "completed": 0,
                "total": len(results)
            }
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "phases": workflow.get("phases", []),
            "current_phase": 0,
            "status": "started"
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "modification":
            modification_count = data.get("modification_count", 0)
            
            if modification_count >= 10:
                triggered.append({
                    "rule": "version_control",
                    "message": "💾 10 modifications - Créer une version?",
                    "suggestion": "create_version"
                })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# GOVERNMENT SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class GovernmentSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Government.
    
    Gère:
    - Procédures administratives
    - Documents officiels
    - Conformité réglementaire
    - Délais légaux
    - Interactions avec organismes publics
    """
    
    @property
    def scope_id(self) -> str:
        return "government"
    
    async def initialize(self) -> None:
        # Règles
        self.rules["deadline_tracking"] = {
            "name": "Suivi des Délais",
            "description": "Alerte avant expiration des délais administratifs",
            "warning_days": [30, 14, 7, 3, 1]
        }
        
        self.rules["document_retention"] = {
            "name": "Conservation Documents",
            "description": "Durée légale de conservation",
            "retention_years": {
                "fiscal": 7,
                "social": 5,
                "corporate": 10,
                "contracts": 10
            }
        }
        
        self.rules["signature_required"] = {
            "name": "Signature Requise",
            "description": "Documents nécessitant signature électronique ou manuscrite",
            "document_types": ["contract", "declaration", "official_form"]
        }
        
        # Workflows
        self.workflows["administrative_procedure"] = {
            "name": "Procédure Administrative",
            "steps": [
                {"name": "Préparation", "tasks": ["gather_documents", "verify_requirements"]},
                {"name": "Soumission", "tasks": ["submit_application", "get_receipt"]},
                {"name": "Suivi", "tasks": ["track_status", "respond_to_requests"]},
                {"name": "Résolution", "tasks": ["receive_decision", "archive_documents"]}
            ]
        }
        
        self.workflows["tax_declaration"] = {
            "name": "Déclaration Fiscale",
            "annual": True,
            "steps": [
                {"name": "Collecte", "deadline_offset_days": -60, "tasks": ["gather_income_docs", "gather_deductions"]},
                {"name": "Calcul", "deadline_offset_days": -30, "tasks": ["calculate_income", "apply_deductions"]},
                {"name": "Vérification", "deadline_offset_days": -14, "tasks": ["review_declaration", "verify_accuracy"]},
                {"name": "Soumission", "deadline_offset_days": -7, "tasks": ["submit_declaration", "confirm_receipt"]},
                {"name": "Paiement", "deadline_offset_days": 0, "tasks": ["pay_taxes", "archive_proof"]}
            ]
        }
        
        self.workflows["permit_application"] = {
            "name": "Demande de Permis",
            "steps": [
                {"name": "Recherche", "tasks": ["identify_requirements", "gather_forms"]},
                {"name": "Préparation", "tasks": ["complete_forms", "gather_supporting_docs"]},
                {"name": "Soumission", "tasks": ["submit_application", "pay_fees"]},
                {"name": "Suivi", "tasks": ["respond_to_queries", "provide_additional_info"]},
                {"name": "Décision", "tasks": ["receive_decision", "appeal_if_needed"]}
            ]
        }
        
        self.workflows["compliance_audit"] = {
            "name": "Audit de Conformité",
            "checklist": [
                {"area": "fiscal", "items": ["tva", "impots", "declarations"]},
                {"area": "social", "items": ["cotisations", "declarations_sociales", "registres"]},
                {"area": "corporate", "items": ["statuts", "ag", "registres_legaux"]},
                {"area": "rgpd", "items": ["consentements", "registre_traitements", "dpd"]}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "submit_declaration":
            deadline = data.get("deadline")
            if deadline:
                deadline_dt = datetime.fromisoformat(deadline)
                if deadline_dt < datetime.utcnow():
                    return {
                        "valid": False,
                        "error": "Le délai de soumission est dépassé",
                        "suggestion": "Contacter l'organisme pour régularisation"
                    }
            
            # Vérifier que tous les documents requis sont présents
            required_docs = data.get("required_documents", [])
            provided_docs = data.get("provided_documents", [])
            missing = set(required_docs) - set(provided_docs)
            
            if missing:
                return {
                    "valid": False,
                    "error": "Documents manquants",
                    "missing": list(missing)
                }
            
            return {"valid": True}
        
        if action == "archive_document":
            doc_type = data.get("document_type")
            retention = self.rules["document_retention"]["retention_years"].get(doc_type, 10)
            
            return {
                "valid": True,
                "info": f"Document à conserver {retention} ans"
            }
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "steps": workflow.get("steps", []),
            "current_step": 0,
            "status": "in_progress"
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "deadline_check":
            deadline = data.get("deadline")
            if deadline:
                deadline_dt = datetime.fromisoformat(deadline)
                days_remaining = (deadline_dt - datetime.utcnow()).days
                
                warning_days = self.rules["deadline_tracking"]["warning_days"]
                if days_remaining in warning_days:
                    triggered.append({
                        "rule": "deadline_tracking",
                        "severity": "warning" if days_remaining > 7 else "critical",
                        "message": f"📅 Délai dans {days_remaining} jour(s): {data.get('title')}"
                    })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# IMMOBILIER SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class ImmobilierSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Immobilier.
    
    Gère:
    - Gestion de biens
    - Locations et baux
    - Travaux et entretien
    - Finances immobilières
    - Documents et conformité
    """
    
    @property
    def scope_id(self) -> str:
        return "immobilier"
    
    async def initialize(self) -> None:
        # Règles
        self.rules["rent_payment"] = {
            "name": "Paiement Loyer",
            "description": "Suivi des paiements de loyer",
            "due_day": 5,  # Jour du mois
            "late_fee_percent": 3
        }
        
        self.rules["lease_renewal"] = {
            "name": "Renouvellement Bail",
            "description": "Alerte avant expiration du bail",
            "warning_months": [6, 3, 1]
        }
        
        self.rules["maintenance_schedule"] = {
            "name": "Calendrier Entretien",
            "description": "Entretiens obligatoires",
            "items": {
                "boiler": {"frequency_months": 12, "mandatory": True},
                "chimney": {"frequency_months": 12, "mandatory": True},
                "smoke_detectors": {"frequency_months": 6, "mandatory": True}
            }
        }
        
        self.rules["security_deposit"] = {
            "name": "Dépôt de Garantie",
            "description": "Maximum légal du dépôt",
            "max_months": 1  # Pour non-meublé
        }
        
        # Workflows
        self.workflows["new_tenant"] = {
            "name": "Nouveau Locataire",
            "steps": [
                {"name": "Candidature", "tasks": ["receive_application", "verify_documents", "credit_check"]},
                {"name": "Visite", "tasks": ["schedule_visit", "conduct_visit", "answer_questions"]},
                {"name": "Sélection", "tasks": ["evaluate_candidates", "select_tenant", "notify_decision"]},
                {"name": "Contrat", "tasks": ["prepare_lease", "review_with_tenant", "sign_lease"]},
                {"name": "Entrée", "tasks": ["inventory_entry", "key_handover", "welcome_packet"]}
            ]
        }
        
        self.workflows["tenant_departure"] = {
            "name": "Départ Locataire",
            "steps": [
                {"name": "Préavis", "tasks": ["receive_notice", "confirm_departure_date"]},
                {"name": "Préparation", "tasks": ["schedule_inventory", "prepare_deposit_calculation"]},
                {"name": "État des lieux", "tasks": ["conduct_inventory", "document_damages"]},
                {"name": "Restitution", "tasks": ["calculate_deductions", "return_deposit", "close_file"]}
            ]
        }
        
        self.workflows["renovation_project"] = {
            "name": "Projet Rénovation",
            "phases": [
                {"name": "Étude", "tasks": ["assess_needs", "get_quotes", "compare_contractors"]},
                {"name": "Planification", "tasks": ["select_contractor", "define_schedule", "notify_tenants"]},
                {"name": "Travaux", "tasks": ["supervise_work", "quality_checks", "handle_issues"]},
                {"name": "Réception", "tasks": ["final_inspection", "punch_list", "accept_work"]},
                {"name": "Clôture", "tasks": ["final_payment", "update_property_value", "archive_documents"]}
            ]
        }
        
        self.workflows["annual_review"] = {
            "name": "Bilan Annuel",
            "tasks": [
                {"task": "calculate_roi", "description": "Calculer le rendement"},
                {"task": "review_expenses", "description": "Analyser les dépenses"},
                {"task": "plan_maintenance", "description": "Planifier l'entretien"},
                {"task": "review_rents", "description": "Réviser les loyers"},
                {"task": "tax_preparation", "description": "Préparer déclaration fiscale"}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "set_deposit":
            rent = data.get("monthly_rent", 0)
            deposit = data.get("deposit_amount", 0)
            furnished = data.get("furnished", False)
            
            max_months = 2 if furnished else 1
            max_deposit = rent * max_months
            
            if deposit > max_deposit:
                return {
                    "valid": False,
                    "error": f"Dépôt trop élevé (max {max_months} mois = {max_deposit}€)"
                }
            
            return {"valid": True}
        
        if action == "increase_rent":
            current_rent = data.get("current_rent", 0)
            new_rent = data.get("new_rent", 0)
            irl_index = data.get("irl_index", 1.02)  # Indice de référence des loyers
            
            max_increase = current_rent * irl_index
            
            if new_rent > max_increase:
                return {
                    "valid": False,
                    "error": f"Augmentation supérieure à l'IRL (max {max_increase:.2f}€)"
                }
            
            return {"valid": True}
        
        if action == "create_lease":
            required_docs = ["identity", "income_proof", "tax_notice", "previous_rents"]
            provided = data.get("tenant_documents", [])
            missing = set(required_docs) - set(provided)
            
            if missing:
                return {
                    "valid": True,
                    "warning": f"Documents recommandés manquants: {missing}"
                }
            
            return {"valid": True}
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "steps": workflow.get("steps", workflow.get("phases", [])),
            "current_step": 0,
            "property_id": context.get("property_id"),
            "status": "in_progress"
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "rent_due":
            due_day = self.rules["rent_payment"]["due_day"]
            current_day = datetime.utcnow().day
            
            if current_day > due_day:
                days_late = current_day - due_day
                if days_late > 0:
                    triggered.append({
                        "rule": "rent_payment",
                        "severity": "warning",
                        "message": f"💰 Loyer en retard de {days_late} jour(s)",
                        "tenant_id": data.get("tenant_id")
                    })
        
        if event == "lease_expiry_check":
            expiry = data.get("lease_expiry")
            if expiry:
                expiry_dt = datetime.fromisoformat(expiry)
                months_remaining = (expiry_dt - datetime.utcnow()).days // 30
                
                if months_remaining in self.rules["lease_renewal"]["warning_months"]:
                    triggered.append({
                        "rule": "lease_renewal",
                        "severity": "info",
                        "message": f"📋 Bail expire dans {months_remaining} mois"
                    })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# ASSOCIATIONS SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class AssociationsSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Associations.
    
    Gère:
    - Membres et adhésions
    - Assemblées et votes
    - Événements et activités
    - Finances associatives
    - Documentation légale
    """
    
    @property
    def scope_id(self) -> str:
        return "associations"
    
    async def initialize(self) -> None:
        # Règles
        self.rules["quorum"] = {
            "name": "Quorum",
            "description": "Nombre minimum de membres pour décisions valides",
            "ag_percent": 25,  # 25% des membres pour AG
            "ca_percent": 50   # 50% du CA pour conseil
        }
        
        self.rules["membership_renewal"] = {
            "name": "Renouvellement Adhésion",
            "description": "Rappel de renouvellement",
            "warning_days": [30, 14, 7]
        }
        
        self.rules["financial_approval"] = {
            "name": "Approbation Financière",
            "description": "Seuils d'approbation pour dépenses",
            "thresholds": {
                "bureau": 500,
                "conseil": 2000,
                "ag": float("inf")
            }
        }
        
        # Workflows
        self.workflows["general_assembly"] = {
            "name": "Assemblée Générale",
            "phases": [
                {
                    "name": "Préparation",
                    "tasks": ["set_date", "prepare_agenda", "prepare_reports"],
                    "deadline_days_before": 30
                },
                {
                    "name": "Convocation",
                    "tasks": ["send_invitations", "collect_proxies"],
                    "deadline_days_before": 15
                },
                {
                    "name": "Tenue",
                    "tasks": ["check_quorum", "conduct_meeting", "record_votes"]
                },
                {
                    "name": "Clôture",
                    "tasks": ["write_minutes", "publish_decisions", "file_documents"]
                }
            ]
        }
        
        self.workflows["new_member"] = {
            "name": "Nouvelle Adhésion",
            "steps": [
                {"task": "receive_application", "description": "Recevoir demande"},
                {"task": "verify_eligibility", "description": "Vérifier éligibilité"},
                {"task": "collect_payment", "description": "Encaisser cotisation"},
                {"task": "create_member_card", "description": "Créer carte membre"},
                {"task": "welcome_email", "description": "Envoyer bienvenue"},
                {"task": "add_to_directory", "description": "Ajouter à l'annuaire"}
            ]
        }
        
        self.workflows["event_organization"] = {
            "name": "Organisation Événement",
            "phases": [
                {"name": "Planification", "tasks": ["define_event", "set_budget", "book_venue"]},
                {"name": "Promotion", "tasks": ["create_materials", "send_invitations", "social_media"]},
                {"name": "Préparation", "tasks": ["confirm_attendees", "prepare_materials", "brief_volunteers"]},
                {"name": "Événement", "tasks": ["setup", "run_event", "cleanup"]},
                {"name": "Bilan", "tasks": ["collect_feedback", "financial_report", "thank_participants"]}
            ]
        }
        
        self.workflows["grant_application"] = {
            "name": "Demande de Subvention",
            "steps": [
                {"task": "identify_opportunity", "description": "Identifier l'opportunité"},
                {"task": "gather_documents", "description": "Rassembler documents"},
                {"task": "write_proposal", "description": "Rédiger dossier"},
                {"task": "internal_review", "description": "Validation interne"},
                {"task": "submit", "description": "Soumettre demande"},
                {"task": "follow_up", "description": "Suivre le dossier"}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "approve_expense":
            amount = data.get("amount", 0)
            approver_role = data.get("approver_role", "member")
            
            thresholds = self.rules["financial_approval"]["thresholds"]
            
            if approver_role == "bureau" and amount > thresholds["bureau"]:
                return {
                    "valid": False,
                    "error": f"Montant supérieur au seuil bureau ({thresholds['bureau']}€)",
                    "requires": "conseil"
                }
            
            if approver_role == "conseil" and amount > thresholds["conseil"]:
                return {
                    "valid": False,
                    "error": f"Montant supérieur au seuil conseil ({thresholds['conseil']}€)",
                    "requires": "ag"
                }
            
            return {"valid": True}
        
        if action == "hold_vote":
            total_members = data.get("total_members", 0)
            present_members = data.get("present_members", 0)
            vote_type = data.get("vote_type", "ag")
            
            required_percent = self.rules["quorum"][f"{vote_type}_percent"]
            quorum = total_members * required_percent / 100
            
            if present_members < quorum:
                return {
                    "valid": False,
                    "error": f"Quorum non atteint ({present_members}/{quorum} requis)"
                }
            
            return {"valid": True}
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "phases": workflow.get("phases", workflow.get("steps", [])),
            "current_phase": 0,
            "status": "in_progress"
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "membership_expiry_check":
            expiry = data.get("membership_expiry")
            if expiry:
                expiry_dt = datetime.fromisoformat(expiry)
                days_remaining = (expiry_dt - datetime.utcnow()).days
                
                if days_remaining in self.rules["membership_renewal"]["warning_days"]:
                    triggered.append({
                        "rule": "membership_renewal",
                        "severity": "info",
                        "message": f"🎫 Adhésion expire dans {days_remaining} jours",
                        "member_id": data.get("member_id")
                    })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# SOCIAL SPACE LOGIC
# ═══════════════════════════════════════════════════════════════════════════════

class SocialSpaceLogic(SpaceLogic):
    """
    Logique métier pour l'espace Social.
    
    Gère:
    - Publications et contenu
    - Interactions sociales
    - Communautés et groupes
    - Modération et sécurité
    - Analytics et insights
    """
    
    @property
    def scope_id(self) -> str:
        return "social"
    
    async def initialize(self) -> None:
        # Règles
        self.rules["content_moderation"] = {
            "name": "Modération Contenu",
            "description": "Règles de modération automatique",
            "prohibited": ["spam", "hate_speech", "harassment", "illegal_content"],
            "review_triggers": ["flagged", "reported", "high_engagement"]
        }
        
        self.rules["rate_limiting"] = {
            "name": "Limite de Publication",
            "description": "Limites anti-spam",
            "posts_per_hour": 10,
            "comments_per_minute": 5,
            "messages_per_minute": 20
        }
        
        self.rules["engagement_quality"] = {
            "name": "Qualité d'Engagement",
            "description": "Détection comportements suspects",
            "suspicious_patterns": ["rapid_follows", "bulk_likes", "copy_paste_comments"]
        }
        
        # Workflows
        self.workflows["content_review"] = {
            "name": "Revue de Contenu",
            "steps": [
                {"action": "auto_scan", "description": "Scan automatique"},
                {"action": "ai_analysis", "description": "Analyse IA"},
                {"action": "human_review", "description": "Revue humaine si nécessaire"},
                {"action": "decision", "description": "Approuver/Rejeter/Modifier"},
                {"action": "notify", "description": "Notifier l'auteur"}
            ]
        }
        
        self.workflows["community_launch"] = {
            "name": "Lancement Communauté",
            "phases": [
                {"name": "Création", "tasks": ["define_purpose", "set_rules", "design_branding"]},
                {"name": "Configuration", "tasks": ["setup_channels", "configure_moderation", "invite_mods"]},
                {"name": "Seeding", "tasks": ["create_initial_content", "invite_founding_members"]},
                {"name": "Lancement", "tasks": ["announce", "welcome_members", "monitor_activity"]}
            ]
        }
        
        self.workflows["campaign_management"] = {
            "name": "Gestion Campagne",
            "steps": [
                {"task": "planning", "description": "Planifier la campagne"},
                {"task": "content_creation", "description": "Créer le contenu"},
                {"task": "scheduling", "description": "Programmer les publications"},
                {"task": "monitoring", "description": "Suivre les performances"},
                {"task": "optimization", "description": "Optimiser en temps réel"},
                {"task": "reporting", "description": "Rapport final"}
            ]
        }
        
        self.workflows["influencer_collaboration"] = {
            "name": "Collaboration Influenceur",
            "phases": [
                {"name": "Recherche", "tasks": ["identify_influencers", "analyze_audiences", "shortlist"]},
                {"name": "Contact", "tasks": ["initial_outreach", "negotiate_terms", "sign_agreement"]},
                {"name": "Exécution", "tasks": ["brief_influencer", "review_content", "approve_publish"]},
                {"name": "Analyse", "tasks": ["track_performance", "calculate_roi", "feedback"]}
            ]
        }
    
    async def validate_action(
        self,
        action: str,
        data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        
        if action == "create_post":
            content = data.get("content", "")
            
            # Vérifier la longueur
            if len(content) > 5000:
                return {
                    "valid": False,
                    "error": "Contenu trop long (max 5000 caractères)"
                }
            
            # Vérifier les mots interdits (simplifié)
            prohibited_words = ["spam", "scam"]  # Liste simplifiée
            content_lower = content.lower()
            for word in prohibited_words:
                if word in content_lower:
                    return {
                        "valid": False,
                        "error": "Contenu non conforme aux règles",
                        "requires_review": True
                    }
            
            return {"valid": True}
        
        if action == "bulk_action":
            action_count = data.get("count", 0)
            action_type = data.get("action_type", "")
            
            limits = self.rules["rate_limiting"]
            
            if action_type == "follow" and action_count > 50:
                return {
                    "valid": False,
                    "error": "Trop de follows en une fois (max 50)",
                    "suspicious": True
                }
            
            return {"valid": True}
        
        return {"valid": True}
    
    async def execute_workflow(
        self,
        workflow_id: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": f"Workflow '{workflow_id}' not found"}
        
        return {
            "workflow_id": workflow_id,
            "name": workflow["name"],
            "steps": workflow.get("steps", workflow.get("phases", [])),
            "current_step": 0,
            "status": "in_progress"
        }
    
    async def check_rules(
        self,
        event: str,
        data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        
        triggered = []
        
        if event == "engagement_spike":
            engagement_rate = data.get("engagement_rate", 0)
            normal_rate = data.get("normal_rate", 1)
            
            if engagement_rate > normal_rate * 10:
                triggered.append({
                    "rule": "engagement_quality",
                    "severity": "warning",
                    "message": "📊 Pic d'engagement suspect détecté",
                    "requires_review": True
                })
        
        if event == "content_flagged":
            flag_count = data.get("flag_count", 0)
            
            if flag_count >= 3:
                triggered.append({
                    "rule": "content_moderation",
                    "severity": "high",
                    "message": f"🚩 Contenu signalé {flag_count} fois",
                    "action": "review_required"
                })
        
        return triggered


# ═══════════════════════════════════════════════════════════════════════════════
# REGISTRATION HELPER
# ═══════════════════════════════════════════════════════════════════════════════

async def register_extended_spaces(registry) -> None:
    """
    Enregistre tous les espaces étendus dans le registre.
    
    Usage:
        from .extended_spaces import register_extended_spaces
        await register_extended_spaces(space_registry)
    """
    extended_spaces = [
        HomeSpaceLogic,
        CreativeStudioSpaceLogic,
        GovernmentSpaceLogic,
        ImmobilierSpaceLogic,
        AssociationsSpaceLogic,
        SocialSpaceLogic
    ]
    
    for space_class in extended_spaces:
        space = space_class(registry.db)
        await space.initialize()
        registry.register(space)
        logger.info(f"✅ Registered space: {space.scope_id}")
