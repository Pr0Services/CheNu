"""
CHE·NU v7.0 - Result Assembler
═══════════════════════════════════════════════════════════════════════════════
Assemble les résultats des sous-tâches en une réponse cohérente.
Supporte plusieurs stratégies d'assemblage et la synthèse par LLM.

Author: CHE·NU Team
Version: 7.0
═══════════════════════════════════════════════════════════════════════════════
"""

from __future__ import annotations
from typing import Any, Dict, List, Optional, Union, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime
import logging
import json
from enum import Enum

if TYPE_CHECKING:
    from ..schemas.task_schema import Task, TaskResult, AssemblyStrategy

logger = logging.getLogger("CHE·NU.Core.ResultAssembler")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class AssemblyStrategy(str, Enum):
    """Stratégies d'assemblage des résultats."""
    MERGE = "merge"              # Fusionner les outputs
    CONCATENATE = "concatenate"  # Concaténer
    STRUCTURED = "structured"    # Par département/agent
    HIERARCHICAL = "hierarchical"  # Hiérarchique avec sections
    SUMMARY = "summary"          # Résumé LLM
    BEST_OF = "best_of"         # Meilleur résultat par confiance
    WEIGHTED = "weighted"        # Moyenne pondérée


class OutputFormat(str, Enum):
    """Formats de sortie."""
    TEXT = "text"
    MARKDOWN = "markdown"
    JSON = "json"
    HTML = "html"


# ═══════════════════════════════════════════════════════════════════════════════
# ASSEMBLY RESULT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class AssemblyResult:
    """Résultat de l'assemblage."""
    task_id: str
    success: bool
    
    # Contenu
    content: Any
    format: OutputFormat
    
    # Métadonnées
    sources_count: int
    successful_sources: int
    strategy_used: AssemblyStrategy
    
    # Résumé optionnel
    summary: Optional[str] = None
    
    # Détails par source
    source_details: List[Dict[str, Any]] = field(default_factory=list)
    
    # Erreurs
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    
    # Métriques
    assembly_time_ms: int = 0
    llm_calls: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "task_id": self.task_id,
            "success": self.success,
            "content": self.content,
            "format": self.format.value,
            "sources_count": self.sources_count,
            "successful_sources": self.successful_sources,
            "strategy_used": self.strategy_used.value,
            "summary": self.summary,
            "errors": self.errors,
            "warnings": self.warnings
        }


# ═══════════════════════════════════════════════════════════════════════════════
# RESULT ASSEMBLER
# ═══════════════════════════════════════════════════════════════════════════════

class ResultAssembler:
    """
    📦 Assembleur de Résultats
    
    Combine les résultats des sous-tâches en une réponse cohérente:
    - Multiples stratégies d'assemblage
    - Synthèse intelligente par LLM
    - Validation de cohérence
    - Gestion des erreurs partielles
    """
    
    def __init__(
        self,
        llm_client: Any = None,
        default_strategy: AssemblyStrategy = AssemblyStrategy.MERGE,
        default_format: OutputFormat = OutputFormat.MARKDOWN,
        max_output_length: int = 10000,
        preferred_model: str = "claude-sonnet-4-20250514"
    ):
        """
        Initialise l'assembleur.
        
        Args:
            llm_client: Client LLM pour la synthèse
            default_strategy: Stratégie par défaut
            default_format: Format de sortie par défaut
            max_output_length: Longueur max de la sortie
            preferred_model: Modèle LLM préféré
        """
        self.llm_client = llm_client
        self.default_strategy = default_strategy
        self.default_format = default_format
        self.max_output_length = max_output_length
        self.preferred_model = preferred_model
        
        logger.info("📦 Result Assembler initialized")
    
    async def assemble(
        self,
        task_id: str,
        subtask_results: List[Dict[str, Any]],
        original_request: Dict[str, Any],
        strategy: Optional[AssemblyStrategy] = None,
        output_format: Optional[OutputFormat] = None
    ) -> AssemblyResult:
        """
        Assemble les résultats des sous-tâches.
        
        Args:
            task_id: ID de la tâche
            subtask_results: Résultats des sous-tâches
            original_request: Requête originale
            strategy: Stratégie d'assemblage
            output_format: Format de sortie
            
        Returns:
            Résultat assemblé
        """
        import time
        start_time = time.time()
        
        strategy = strategy or self.default_strategy
        output_format = output_format or self.default_format
        
        # Filtrer les résultats valides
        valid_results = [r for r in subtask_results if r.get("success", False)]
        failed_results = [r for r in subtask_results if not r.get("success", False)]
        
        # Assembler selon la stratégie
        try:
            if strategy == AssemblyStrategy.MERGE:
                content = self._assemble_merge(valid_results)
            elif strategy == AssemblyStrategy.CONCATENATE:
                content = self._assemble_concatenate(valid_results)
            elif strategy == AssemblyStrategy.STRUCTURED:
                content = self._assemble_structured(valid_results)
            elif strategy == AssemblyStrategy.HIERARCHICAL:
                content = self._assemble_hierarchical(valid_results)
            elif strategy == AssemblyStrategy.SUMMARY:
                content = await self._assemble_summary(
                    valid_results, original_request
                )
            elif strategy == AssemblyStrategy.BEST_OF:
                content = self._assemble_best_of(valid_results)
            elif strategy == AssemblyStrategy.WEIGHTED:
                content = self._assemble_weighted(valid_results)
            else:
                content = self._assemble_merge(valid_results)
            
            # Formater la sortie
            formatted_content = self._format_output(content, output_format)
            
            # Générer un résumé si nécessaire
            summary = None
            if strategy != AssemblyStrategy.SUMMARY and len(valid_results) > 1:
                summary = self._generate_quick_summary(valid_results)
            
            # Collecter les erreurs
            errors = []
            for r in failed_results:
                errors.append(f"Subtask {r.get('subtask_id', 'unknown')}: {r.get('error', 'Unknown error')}")
            
            assembly_time = int((time.time() - start_time) * 1000)
            
            return AssemblyResult(
                task_id=task_id,
                success=len(valid_results) > 0,
                content=formatted_content,
                format=output_format,
                sources_count=len(subtask_results),
                successful_sources=len(valid_results),
                strategy_used=strategy,
                summary=summary,
                source_details=[
                    {
                        "subtask_id": r.get("subtask_id"),
                        "department": r.get("department"),
                        "agent_id": r.get("agent_id"),
                        "success": r.get("success"),
                        "confidence": r.get("confidence", 1.0)
                    }
                    for r in subtask_results
                ],
                errors=errors,
                warnings=[],
                assembly_time_ms=assembly_time
            )
            
        except Exception as e:
            logger.error(f"Assembly failed: {e}")
            return AssemblyResult(
                task_id=task_id,
                success=False,
                content="",
                format=output_format,
                sources_count=len(subtask_results),
                successful_sources=0,
                strategy_used=strategy,
                errors=[str(e)],
                assembly_time_ms=int((time.time() - start_time) * 1000)
            )
    
    def assemble_sync(
        self,
        task_id: str,
        subtask_results: List[Dict[str, Any]],
        strategy: Optional[AssemblyStrategy] = None
    ) -> AssemblyResult:
        """Version synchrone (pas de LLM summary)."""
        strategy = strategy or self.default_strategy
        
        if strategy == AssemblyStrategy.SUMMARY:
            strategy = AssemblyStrategy.MERGE
        
        valid_results = [r for r in subtask_results if r.get("success", False)]
        failed_results = [r for r in subtask_results if not r.get("success", False)]
        
        if strategy == AssemblyStrategy.MERGE:
            content = self._assemble_merge(valid_results)
        elif strategy == AssemblyStrategy.CONCATENATE:
            content = self._assemble_concatenate(valid_results)
        elif strategy == AssemblyStrategy.STRUCTURED:
            content = self._assemble_structured(valid_results)
        elif strategy == AssemblyStrategy.HIERARCHICAL:
            content = self._assemble_hierarchical(valid_results)
        else:
            content = self._assemble_merge(valid_results)
        
        formatted = self._format_output(content, self.default_format)
        
        return AssemblyResult(
            task_id=task_id,
            success=len(valid_results) > 0,
            content=formatted,
            format=self.default_format,
            sources_count=len(subtask_results),
            successful_sources=len(valid_results),
            strategy_used=strategy,
            errors=[r.get("error", "") for r in failed_results if r.get("error")]
        )
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ASSEMBLY STRATEGIES
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _assemble_merge(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fusionne tous les outputs en un seul."""
        merged = {
            "type": "merged",
            "sections": []
        }
        
        for r in results:
            output = r.get("output", "")
            if output:
                merged["sections"].append({
                    "source": r.get("subtask_id", "unknown"),
                    "department": r.get("department", "unknown"),
                    "content": output
                })
        
        return merged
    
    def _assemble_concatenate(self, results: List[Dict[str, Any]]) -> str:
        """Concatène les outputs avec séparateurs."""
        parts = []
        
        for r in results:
            output = r.get("output", "")
            if output:
                if isinstance(output, dict):
                    output = json.dumps(output, ensure_ascii=False, indent=2)
                parts.append(str(output))
        
        return "\n\n---\n\n".join(parts) if parts else "Aucun résultat"
    
    def _assemble_structured(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Organise par département/agent."""
        structured = {
            "type": "structured",
            "by_department": {},
            "by_agent": {}
        }
        
        for r in results:
            dept = r.get("department", "unknown")
            agent = r.get("agent_id", "unknown")
            output = r.get("output", "")
            
            if dept not in structured["by_department"]:
                structured["by_department"][dept] = []
            structured["by_department"][dept].append(output)
            
            if agent not in structured["by_agent"]:
                structured["by_agent"][agent] = []
            structured["by_agent"][agent].append(output)
        
        return structured
    
    def _assemble_hierarchical(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Organisation hiérarchique avec sections."""
        hierarchical = {
            "type": "hierarchical",
            "title": "Résultat consolidé",
            "sections": []
        }
        
        # Grouper par département
        by_dept: Dict[str, List] = {}
        for r in results:
            dept = r.get("department", "unknown")
            if dept not in by_dept:
                by_dept[dept] = []
            by_dept[dept].append(r)
        
        # Créer les sections
        for dept, dept_results in by_dept.items():
            section = {
                "title": f"Département {dept.title()}",
                "department": dept,
                "items": []
            }
            
            for r in dept_results:
                section["items"].append({
                    "agent": r.get("agent_id", "unknown"),
                    "subtask": r.get("subtask_id", "unknown"),
                    "content": r.get("output", ""),
                    "confidence": r.get("confidence", 1.0)
                })
            
            hierarchical["sections"].append(section)
        
        return hierarchical
    
    async def _assemble_summary(
        self,
        results: List[Dict[str, Any]],
        original_request: Dict[str, Any]
    ) -> str:
        """Crée un résumé intelligent via LLM."""
        if not self.llm_client:
            return self._assemble_concatenate(results)
        
        # Préparer le contenu pour le LLM
        content_parts = []
        for r in results:
            output = r.get("output", "")
            dept = r.get("department", "unknown")
            if output:
                content_parts.append(f"[{dept.upper()}]: {output}")
        
        combined_content = "\n\n".join(content_parts)
        
        # Extraire la requête originale
        original_text = ""
        if isinstance(original_request, str):
            original_text = original_request
        elif isinstance(original_request, dict):
            original_text = original_request.get("description", 
                          original_request.get("content", ""))
        
        prompt = f"""Tu es un assistant expert. Synthétise ces résultats en une réponse cohérente et complète.

REQUÊTE ORIGINALE:
{original_text[:500]}

RÉSULTATS DES DIFFÉRENTS DÉPARTEMENTS:
{combined_content[:3000]}

INSTRUCTIONS:
- Crée une réponse unifiée et professionnelle
- Intègre les informations de tous les départements
- Élimine les redondances
- Formate clairement avec des sections si nécessaire
- Maximum 800 mots

RÉPONSE:"""

        try:
            response = await self._call_llm(prompt)
            return response
        except Exception as e:
            logger.warning(f"LLM summary failed: {e}")
            return self._assemble_concatenate(results)
    
    def _assemble_best_of(self, results: List[Dict[str, Any]]) -> Any:
        """Retourne le meilleur résultat par confiance."""
        if not results:
            return None
        
        best = max(results, key=lambda r: r.get("confidence", 0))
        return best.get("output")
    
    def _assemble_weighted(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Moyenne pondérée par confiance."""
        weighted = {
            "type": "weighted",
            "results": [],
            "total_weight": 0.0
        }
        
        for r in results:
            confidence = r.get("confidence", 1.0)
            weighted["results"].append({
                "content": r.get("output"),
                "weight": confidence,
                "source": r.get("subtask_id")
            })
            weighted["total_weight"] += confidence
        
        return weighted
    
    # ═══════════════════════════════════════════════════════════════════════════
    # FORMATTING
    # ═══════════════════════════════════════════════════════════════════════════
    
    def _format_output(
        self,
        content: Any,
        format: OutputFormat
    ) -> Any:
        """Formate la sortie selon le format demandé."""
        if format == OutputFormat.JSON:
            if isinstance(content, str):
                return {"content": content}
            return content
        
        elif format == OutputFormat.TEXT:
            if isinstance(content, str):
                return content
            elif isinstance(content, dict):
                return self._dict_to_text(content)
            return str(content)
        
        elif format == OutputFormat.MARKDOWN:
            if isinstance(content, str):
                return content
            elif isinstance(content, dict):
                return self._dict_to_markdown(content)
            return str(content)
        
        elif format == OutputFormat.HTML:
            if isinstance(content, str):
                return f"<div>{content}</div>"
            elif isinstance(content, dict):
                return self._dict_to_html(content)
            return f"<div>{content}</div>"
        
        return content
    
    def _dict_to_text(self, d: Dict[str, Any]) -> str:
        """Convertit un dict en texte."""
        parts = []
        
        if "sections" in d:
            for section in d["sections"]:
                if isinstance(section, dict):
                    content = section.get("content", "")
                    source = section.get("source", "")
                    parts.append(f"[{source}]\n{content}")
                else:
                    parts.append(str(section))
        
        elif "by_department" in d:
            for dept, items in d["by_department"].items():
                parts.append(f"\n=== {dept.upper()} ===")
                for item in items:
                    parts.append(str(item))
        
        else:
            parts.append(json.dumps(d, ensure_ascii=False, indent=2))
        
        return "\n\n".join(parts)
    
    def _dict_to_markdown(self, d: Dict[str, Any]) -> str:
        """Convertit un dict en markdown."""
        lines = []
        
        if d.get("type") == "hierarchical":
            title = d.get("title", "Résultat")
            lines.append(f"# {title}\n")
            
            for section in d.get("sections", []):
                lines.append(f"\n## {section.get('title', 'Section')}\n")
                for item in section.get("items", []):
                    content = item.get("content", "")
                    confidence = item.get("confidence", 1.0)
                    lines.append(f"- {content}")
                    if confidence < 1.0:
                        lines.append(f"  _(confiance: {confidence:.0%})_")
        
        elif d.get("type") == "structured":
            for dept, items in d.get("by_department", {}).items():
                lines.append(f"\n## {dept.title()}\n")
                for item in items:
                    lines.append(f"- {item}")
        
        elif d.get("type") == "merged":
            for section in d.get("sections", []):
                source = section.get("source", "")
                content = section.get("content", "")
                lines.append(f"\n### {source}\n")
                lines.append(content)
        
        else:
            lines.append("```json")
            lines.append(json.dumps(d, ensure_ascii=False, indent=2))
            lines.append("```")
        
        return "\n".join(lines)
    
    def _dict_to_html(self, d: Dict[str, Any]) -> str:
        """Convertit un dict en HTML."""
        html_parts = ['<div class="assembly-result">']
        
        if d.get("type") == "hierarchical":
            title = d.get("title", "Résultat")
            html_parts.append(f'<h1>{title}</h1>')
            
            for section in d.get("sections", []):
                html_parts.append(f'<section class="department">')
                html_parts.append(f'<h2>{section.get("title", "Section")}</h2>')
                html_parts.append('<ul>')
                for item in section.get("items", []):
                    content = item.get("content", "")
                    html_parts.append(f'<li>{content}</li>')
                html_parts.append('</ul>')
                html_parts.append('</section>')
        
        else:
            html_parts.append(f'<pre>{json.dumps(d, ensure_ascii=False, indent=2)}</pre>')
        
        html_parts.append('</div>')
        return "\n".join(html_parts)
    
    def _generate_quick_summary(self, results: List[Dict[str, Any]]) -> str:
        """Génère un résumé rapide sans LLM."""
        successful = len([r for r in results if r.get("success")])
        departments = set(r.get("department", "unknown") for r in results)
        
        return (
            f"Tâche complétée avec {successful}/{len(results)} sous-tâches réussies. "
            f"Départements impliqués: {', '.join(departments)}."
        )
    
    async def _call_llm(self, prompt: str) -> str:
        """Appelle le LLM."""
        if hasattr(self.llm_client, 'messages'):
            response = await self.llm_client.messages.create(
                model=self.preferred_model,
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        elif hasattr(self.llm_client, 'chat'):
            response = await self.llm_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        else:
            raise ValueError("Unknown LLM client type")
    
    def validate_coherence(
        self,
        results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Valide la cohérence des résultats."""
        validation = {
            "is_coherent": True,
            "issues": [],
            "confidence": 1.0
        }
        
        # Vérifier les résultats vides
        empty_count = sum(1 for r in results if not r.get("output"))
        if empty_count > 0:
            validation["issues"].append(f"{empty_count} résultats vides")
            validation["confidence"] -= 0.1 * empty_count
        
        # Vérifier les erreurs
        error_count = sum(1 for r in results if not r.get("success"))
        if error_count > len(results) / 2:
            validation["is_coherent"] = False
            validation["issues"].append(f"Trop d'erreurs: {error_count}/{len(results)}")
        
        # Vérifier les confidences faibles
        low_confidence = sum(1 for r in results if r.get("confidence", 1.0) < 0.5)
        if low_confidence > len(results) / 3:
            validation["issues"].append(f"{low_confidence} résultats à faible confiance")
            validation["confidence"] -= 0.15
        
        validation["confidence"] = max(0.0, validation["confidence"])
        
        return validation


# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

__all__ = [
    "ResultAssembler",
    "AssemblyResult",
    "AssemblyStrategy",
    "OutputFormat"
]
