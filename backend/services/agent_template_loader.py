# chenu_v8/core/agent_template_loader.py

from typing import Dict, Any, List
from dataclasses import dataclass

from ..agents import BaseAgent, AgentConfig, AgentLevel  # depuis ton package agents __init__ :contentReference[oaicite:9]{index=9}
from ..core.llm_client import llm_client
from ..agent_personalities import AGENT_TEMPLATES  # TODO: adapter chemin si besoin :contentReference[oaicite:10]{index=10}
from ..base_agent import AgentContext, AgentResponse  # même module que BaseAgent :contentReference[oaicite:11]{index=11}


@dataclass
class TemplateAgent(BaseAgent):
    """
    Agent générique basé sur un template AGENT_TEMPLATES.
    Implémente process() et can_handle() en mode simple.
    """

    def process(self, context: AgentContext) -> AgentResponse:
        description = context.input_data.get("description") or context.input_data.get("message", "")
        prompt = (
            f"{self.config.system_prompt}\n\n"
            f"CONTEXTE:\n{context.input_data}\n\n"
            f"TÂCHE:\n{description}"
        )

        content = self.call_llm(prompt, context)

        return AgentResponse(
            success=True,
            output=content,
            output_type="text",
            confidence=0.9,
        )

    def can_handle(self, task_type: str, requirements: Dict[str, Any] = None) -> bool:
        # Simple: tous les templates peuvent gérer "generic" ou leur département
        req_dept = (requirements or {}).get("department")
        if req_dept and self.config.department and req_dept != self.config.department:
            return False
        return True


def _template_to_config(tpl: Dict[str, Any]) -> AgentConfig:
    dept = tpl.get("department")
    level = tpl.get("level", 3)

    return AgentConfig(
        agent_id=f"TEMPLATE_{tpl['id']}",
        name=tpl["name"],
        level=AgentLevel(min(level, 3)),  # clamp 0–3
        department=dept,
        description=tpl.get("description", ""),
        avatar=tpl.get("avatar", "🤖"),
        system_prompt=tpl.get("system_prompt", ""),
        capabilities=tpl.get("skills", []),
        tools=tpl.get("compatible_apis", []),
        preferred_llm="claude-sonnet-4-20250514",
    )


def build_template_agents() -> Dict[str, TemplateAgent]:
    """
    Construit un dictionnaire {agent_id: TemplateAgent} à partir de AGENT_TEMPLATES.
    """
    agents: Dict[str, TemplateAgent] = {}
    for tpl in AGENT_TEMPLATES:
        cfg = _template_to_config(tpl)
        agent = TemplateAgent(
            config=cfg,
            llm_client=llm_client,
            tools_registry={},  # tu pourras brancher SPECIALIZED_APIS ici si tu veux
        )
        agents[cfg.agent_id] = agent
    return agents
