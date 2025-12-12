"""
CHE·NU™ B17 - CHE·Learn Agent
Agent d'apprentissage central du système CHE·NU

Features:
- Mode Passif: Analyse automatique des interactions
- Mode Actif: Enseignement direct par utilisateur
- Learning Events tracking
- Agent Rules System avec versioning
- Orchestrator V2 integration
- Score de confiance par règle
- Rollback capabilities

Author: CHE·NU Dev Team
Date: December 2024
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, timedelta
from enum import Enum
import json
import hashlib
from uuid import uuid4

router = APIRouter(prefix="/api/v2/chelearn", tags=["CHE·Learn"])

# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class LearningMode(str, Enum):
    PASSIVE = "passive"
    ACTIVE = "active"

class RuleType(str, Enum):
    BEHAVIOR = "behavior"
    PREFERENCE = "preference"
    CONSTRAINT = "constraint"
    STYLE = "style"
    PIPELINE = "pipeline"
    FILTER = "filter"
    STRUCTURE = "structure"

class RuleScope(str, Enum):
    GLOBAL = "global"
    AGENT = "agent"
    USER = "user"
    PROJECT = "project"

class PatternType(str, Enum):
    ERROR = "error"
    PREFERENCE = "preference"
    OPPORTUNITY = "opportunity"
    BEHAVIOR = "behavior"
    PERFORMANCE = "performance"

class AgentTarget(str, Enum):
    NOVA = "nova"
    MARKETING = "marketing"
    FINANCE = "finance"
    HR = "hr"
    OPERATIONS = "operations"
    CRM = "crm"
    DOCUMENTS = "documents"
    SOCIAL = "social"
    FORUM = "forum"
    STREAMING = "streaming"
    CREATIVE = "creative"
    ALL = "all"

# Confidence thresholds
CONFIDENCE_THRESHOLDS = {
    "high": 0.8,
    "medium": 0.5,
    "low": 0.3
}

# =============================================================================
# MODELS - Learning Events
# =============================================================================

class InteractionLog(BaseModel):
    """Log d'une interaction agent-utilisateur"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: str
    agent_id: str
    session_id: str
    
    # Interaction data
    user_input: str
    agent_response: str
    context: Dict[str, Any] = {}
    
    # Metadata
    response_time_ms: int = 0
    tokens_used: int = 0
    was_helpful: Optional[bool] = None
    user_feedback: Optional[str] = None
    
    # Analysis flags
    analyzed: bool = False
    patterns_extracted: List[str] = []

class LearningEvent(BaseModel):
    """Événement d'apprentissage détecté"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    mode: LearningMode
    
    # Source
    source_interaction_id: Optional[str] = None
    source_user_id: Optional[str] = None
    source_agent_id: Optional[str] = None
    
    # Learning content
    event_type: str  # pattern_detected, rule_created, prompt_updated, etc.
    description: str
    data: Dict[str, Any] = {}
    
    # Impact
    confidence_score: float = 0.5
    applied: bool = False
    rollback_available: bool = True

class DetectedPattern(BaseModel):
    """Pattern détecté par CHE·Learn"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    pattern_type: PatternType
    
    # Pattern details
    description: str
    evidence: List[str] = []  # IDs des interactions qui supportent ce pattern
    frequency: int = 1
    
    # Scoring
    confidence: float = 0.5
    impact_score: float = 0.5  # Potential impact if acted upon
    
    # Action
    suggested_action: Optional[str] = None
    auto_applicable: bool = False

# =============================================================================
# MODELS - Rules System
# =============================================================================

class AgentRule(BaseModel):
    """Règle pour un agent"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    
    # Rule definition
    name: str
    description: str
    rule_type: RuleType
    scope: RuleScope
    
    # Target
    target_agent: AgentTarget
    target_user_id: Optional[str] = None
    target_project_id: Optional[str] = None
    
    # Rule content
    condition: Optional[str] = None  # When to apply
    action: str  # What to do
    parameters: Dict[str, Any] = {}
    
    # Metadata
    confidence_score: float = 0.5
    enabled: bool = True
    auto_generated: bool = False
    source_learning_event_id: Optional[str] = None
    
    # Versioning
    previous_version_id: Optional[str] = None
    changelog: str = ""

class RuleVersion(BaseModel):
    """Version historique d'une règle"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    rule_id: str
    version: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Snapshot
    rule_snapshot: Dict[str, Any]
    
    # Change info
    change_reason: str
    changed_by: str  # user_id or "chelearn"

class UserPreference(BaseModel):
    """Préférence utilisateur apprise"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Preference
    category: str  # communication_style, formatting, language, etc.
    key: str
    value: Any
    
    # Learning source
    learned_from: str  # explicit, implicit, interaction_id
    confidence: float = 0.5
    
    # Application
    applies_to: List[AgentTarget] = [AgentTarget.ALL]

class PromptUpdate(BaseModel):
    """Mise à jour de prompt suggérée"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    target_agent: AgentTarget
    update_type: str  # append, replace, remove
    
    # Content
    section: str  # personality, instructions, examples, etc.
    original_content: Optional[str] = None
    new_content: str
    
    # Status
    status: str = "pending"  # pending, approved, applied, rejected
    applied_at: Optional[datetime] = None
    applied_by: Optional[str] = None

class MemoryUpdate(BaseModel):
    """Mise à jour de mémoire agent"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    target_agent: AgentTarget
    user_id: Optional[str] = None
    
    # Memory content
    memory_type: str  # short_term, long_term, context
    key: str
    value: Any
    ttl_hours: Optional[int] = None
    
    # Status
    applied: bool = False

# =============================================================================
# MODELS - CHE·Learn Outputs
# =============================================================================

class PassiveLearningOutput(BaseModel):
    """Output du mode passif CHE·Learn"""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    interactions_analyzed: int
    
    learning_summary: str
    detected_patterns: List[DetectedPattern]
    recommended_prompt_updates: List[PromptUpdate]
    memory_updates: List[MemoryUpdate]
    
    # Stats
    new_rules_suggested: int = 0
    confidence_avg: float = 0.0

class ActiveLearningOutput(BaseModel):
    """Output du mode actif CHE·Learn (enseignement utilisateur)"""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    agent_target: AgentTarget
    training_summary: str
    
    rules_to_add: List[AgentRule]
    preferences_to_add: List[UserPreference]
    prompt_updates: List[PromptUpdate]
    memory_updates: List[MemoryUpdate]
    
    # Confirmation
    requires_confirmation: bool = True
    estimated_impact: str = "medium"

class TeachingRequest(BaseModel):
    """Requête d'enseignement par l'utilisateur"""
    user_id: str
    target_agent: AgentTarget
    
    instruction_type: str  # rule, style, constraint, system, pipeline
    instruction: str
    
    # Optional specifics
    examples: List[str] = []
    apply_to_all_agents: bool = False
    priority: str = "medium"

# =============================================================================
# IN-MEMORY STORAGE (Production: PostgreSQL)
# =============================================================================

class CheLearneStore:
    def __init__(self):
        self.interaction_logs: Dict[str, InteractionLog] = {}
        self.learning_events: Dict[str, LearningEvent] = {}
        self.detected_patterns: Dict[str, DetectedPattern] = {}
        self.agent_rules: Dict[str, AgentRule] = {}
        self.rule_versions: Dict[str, List[RuleVersion]] = {}
        self.user_preferences: Dict[str, List[UserPreference]] = {}
        self.prompt_updates: Dict[str, PromptUpdate] = {}
        self.memory_updates: Dict[str, MemoryUpdate] = {}
        
        # Indexes
        self.rules_by_agent: Dict[str, List[str]] = {}
        self.patterns_by_type: Dict[str, List[str]] = {}

store = CheLearneStore()

# =============================================================================
# CHE·LEARN CORE ENGINE
# =============================================================================

class CheLearningEngine:
    """Moteur principal de CHE·Learn"""
    
    def __init__(self):
        self.min_interactions_for_pattern = 3
        self.pattern_similarity_threshold = 0.7
        
    # -------------------------------------------------------------------------
    # MODE PASSIF - Analyse automatique
    # -------------------------------------------------------------------------
    
    async def analyze_interaction(self, interaction: InteractionLog) -> PassiveLearningOutput:
        """Analyse une interaction et détecte les patterns"""
        
        patterns = []
        prompt_updates = []
        memory_updates = []
        
        # 1. Détecter les patterns d'erreur
        error_patterns = self._detect_error_patterns(interaction)
        patterns.extend(error_patterns)
        
        # 2. Détecter les préférences implicites
        pref_patterns = self._detect_preference_patterns(interaction)
        patterns.extend(pref_patterns)
        
        # 3. Détecter les opportunités d'amélioration
        opp_patterns = self._detect_opportunity_patterns(interaction)
        patterns.extend(opp_patterns)
        
        # 4. Générer les mises à jour recommandées
        for pattern in patterns:
            if pattern.confidence >= CONFIDENCE_THRESHOLDS["medium"]:
                # Créer suggestion de prompt update si pertinent
                if pattern.pattern_type in [PatternType.ERROR, PatternType.BEHAVIOR]:
                    update = self._generate_prompt_update(pattern, interaction)
                    if update:
                        prompt_updates.append(update)
                
                # Créer memory update si préférence détectée
                if pattern.pattern_type == PatternType.PREFERENCE:
                    mem_update = self._generate_memory_update(pattern, interaction)
                    if mem_update:
                        memory_updates.append(mem_update)
        
        # 5. Marquer l'interaction comme analysée
        interaction.analyzed = True
        interaction.patterns_extracted = [p.id for p in patterns]
        store.interaction_logs[interaction.id] = interaction
        
        # 6. Stocker les patterns
        for pattern in patterns:
            store.detected_patterns[pattern.id] = pattern
        
        # 7. Créer learning event
        event = LearningEvent(
            mode=LearningMode.PASSIVE,
            source_interaction_id=interaction.id,
            source_user_id=interaction.user_id,
            source_agent_id=interaction.agent_id,
            event_type="interaction_analyzed",
            description=f"Analyzed interaction, found {len(patterns)} patterns",
            data={
                "patterns_count": len(patterns),
                "prompt_updates_count": len(prompt_updates),
                "memory_updates_count": len(memory_updates)
            },
            confidence_score=sum(p.confidence for p in patterns) / len(patterns) if patterns else 0
        )
        store.learning_events[event.id] = event
        
        return PassiveLearningOutput(
            interactions_analyzed=1,
            learning_summary=self._generate_learning_summary(patterns),
            detected_patterns=patterns,
            recommended_prompt_updates=prompt_updates,
            memory_updates=memory_updates,
            new_rules_suggested=len([p for p in patterns if p.auto_applicable]),
            confidence_avg=event.confidence_score
        )
    
    async def batch_analyze(self, user_id: str, limit: int = 50) -> PassiveLearningOutput:
        """Analyse un batch d'interactions non analysées"""
        
        # Récupérer les interactions non analysées
        unanalyzed = [
            log for log in store.interaction_logs.values()
            if not log.analyzed and log.user_id == user_id
        ][:limit]
        
        all_patterns = []
        all_prompt_updates = []
        all_memory_updates = []
        
        for interaction in unanalyzed:
            result = await self.analyze_interaction(interaction)
            all_patterns.extend(result.detected_patterns)
            all_prompt_updates.extend(result.recommended_prompt_updates)
            all_memory_updates.extend(result.memory_updates)
        
        # Consolider les patterns similaires
        consolidated_patterns = self._consolidate_patterns(all_patterns)
        
        return PassiveLearningOutput(
            interactions_analyzed=len(unanalyzed),
            learning_summary=self._generate_batch_summary(consolidated_patterns),
            detected_patterns=consolidated_patterns,
            recommended_prompt_updates=all_prompt_updates,
            memory_updates=all_memory_updates,
            new_rules_suggested=len([p for p in consolidated_patterns if p.auto_applicable]),
            confidence_avg=sum(p.confidence for p in consolidated_patterns) / len(consolidated_patterns) if consolidated_patterns else 0
        )
    
    def _detect_error_patterns(self, interaction: InteractionLog) -> List[DetectedPattern]:
        """Détecte les patterns d'erreur dans une interaction"""
        patterns = []
        
        # Check for negative feedback
        if interaction.was_helpful == False:
            patterns.append(DetectedPattern(
                pattern_type=PatternType.ERROR,
                description=f"User marked response as not helpful",
                evidence=[interaction.id],
                confidence=0.8,
                impact_score=0.7,
                suggested_action="Review agent response and adjust behavior"
            ))
        
        # Check for explicit correction in user feedback
        if interaction.user_feedback:
            feedback_lower = interaction.user_feedback.lower()
            if any(word in feedback_lower for word in ["wrong", "incorrect", "error", "mistake", "non", "faux"]):
                patterns.append(DetectedPattern(
                    pattern_type=PatternType.ERROR,
                    description=f"User provided correction: {interaction.user_feedback[:100]}",
                    evidence=[interaction.id],
                    confidence=0.9,
                    impact_score=0.8,
                    suggested_action="Apply user correction to agent knowledge"
                ))
        
        # Check for slow response time
        if interaction.response_time_ms > 5000:
            patterns.append(DetectedPattern(
                pattern_type=PatternType.PERFORMANCE,
                description=f"Slow response time: {interaction.response_time_ms}ms",
                evidence=[interaction.id],
                confidence=0.6,
                impact_score=0.4,
                suggested_action="Optimize agent response pipeline"
            ))
        
        return patterns
    
    def _detect_preference_patterns(self, interaction: InteractionLog) -> List[DetectedPattern]:
        """Détecte les préférences utilisateur implicites"""
        patterns = []
        
        user_input = interaction.user_input.lower()
        
        # Language preference
        if any(word in user_input for word in ["en français", "in english", "en español"]):
            lang = "fr" if "français" in user_input else "en" if "english" in user_input else "es"
            patterns.append(DetectedPattern(
                pattern_type=PatternType.PREFERENCE,
                description=f"User prefers language: {lang}",
                evidence=[interaction.id],
                confidence=0.85,
                impact_score=0.6,
                suggested_action=f"Set default language to {lang}",
                auto_applicable=True
            ))
        
        # Format preference
        if any(word in user_input for word in ["bullet points", "liste", "résumé", "détaillé", "brief"]):
            if "bullet" in user_input or "liste" in user_input:
                format_pref = "list"
            elif "résumé" in user_input or "brief" in user_input:
                format_pref = "concise"
            else:
                format_pref = "detailed"
            
            patterns.append(DetectedPattern(
                pattern_type=PatternType.PREFERENCE,
                description=f"User prefers {format_pref} format",
                evidence=[interaction.id],
                confidence=0.7,
                impact_score=0.5,
                suggested_action=f"Adjust response format to {format_pref}"
            ))
        
        # Tone preference
        if any(word in user_input for word in ["formel", "informel", "casual", "professional"]):
            tone = "formal" if any(w in user_input for w in ["formel", "professional"]) else "casual"
            patterns.append(DetectedPattern(
                pattern_type=PatternType.PREFERENCE,
                description=f"User prefers {tone} tone",
                evidence=[interaction.id],
                confidence=0.75,
                impact_score=0.5,
                suggested_action=f"Set communication tone to {tone}",
                auto_applicable=True
            ))
        
        return patterns
    
    def _detect_opportunity_patterns(self, interaction: InteractionLog) -> List[DetectedPattern]:
        """Détecte les opportunités d'amélioration"""
        patterns = []
        
        # Check context for repeated questions
        context = interaction.context
        if context.get("repeat_question_count", 0) >= 2:
            patterns.append(DetectedPattern(
                pattern_type=PatternType.OPPORTUNITY,
                description="User asking same question multiple times",
                evidence=[interaction.id],
                confidence=0.8,
                impact_score=0.7,
                suggested_action="Improve clarity of responses on this topic"
            ))
        
        # Check for feature requests
        user_input = interaction.user_input.lower()
        if any(phrase in user_input for phrase in ["j'aimerais", "it would be nice", "can you add", "pourrait-on"]):
            patterns.append(DetectedPattern(
                pattern_type=PatternType.OPPORTUNITY,
                description=f"Potential feature request detected",
                evidence=[interaction.id],
                confidence=0.6,
                impact_score=0.5,
                suggested_action="Log as potential feature request"
            ))
        
        return patterns
    
    def _generate_prompt_update(self, pattern: DetectedPattern, interaction: InteractionLog) -> Optional[PromptUpdate]:
        """Génère une suggestion de mise à jour de prompt"""
        
        if pattern.pattern_type == PatternType.ERROR and pattern.confidence >= 0.7:
            return PromptUpdate(
                target_agent=AgentTarget(interaction.agent_id) if interaction.agent_id in [e.value for e in AgentTarget] else AgentTarget.NOVA,
                update_type="append",
                section="error_corrections",
                new_content=f"Correction learned: {pattern.description}"
            )
        
        if pattern.pattern_type == PatternType.BEHAVIOR:
            return PromptUpdate(
                target_agent=AgentTarget(interaction.agent_id) if interaction.agent_id in [e.value for e in AgentTarget] else AgentTarget.NOVA,
                update_type="append",
                section="behavior_guidelines",
                new_content=f"Behavior adjustment: {pattern.suggested_action}"
            )
        
        return None
    
    def _generate_memory_update(self, pattern: DetectedPattern, interaction: InteractionLog) -> Optional[MemoryUpdate]:
        """Génère une mise à jour de mémoire agent"""
        
        if pattern.pattern_type == PatternType.PREFERENCE:
            return MemoryUpdate(
                target_agent=AgentTarget(interaction.agent_id) if interaction.agent_id in [e.value for e in AgentTarget] else AgentTarget.ALL,
                user_id=interaction.user_id,
                memory_type="long_term",
                key=f"preference_{pattern.id[:8]}",
                value={
                    "description": pattern.description,
                    "action": pattern.suggested_action,
                    "confidence": pattern.confidence
                }
            )
        
        return None
    
    def _consolidate_patterns(self, patterns: List[DetectedPattern]) -> List[DetectedPattern]:
        """Consolide les patterns similaires"""
        
        consolidated = {}
        
        for pattern in patterns:
            key = f"{pattern.pattern_type}_{pattern.description[:50]}"
            
            if key in consolidated:
                # Merge evidence and increase frequency
                existing = consolidated[key]
                existing.evidence.extend(pattern.evidence)
                existing.frequency += 1
                existing.confidence = min(1.0, existing.confidence + 0.1)
            else:
                consolidated[key] = pattern
        
        return list(consolidated.values())
    
    def _generate_learning_summary(self, patterns: List[DetectedPattern]) -> str:
        """Génère un résumé d'apprentissage"""
        
        if not patterns:
            return "No significant patterns detected in this interaction."
        
        summary_parts = []
        
        error_count = len([p for p in patterns if p.pattern_type == PatternType.ERROR])
        pref_count = len([p for p in patterns if p.pattern_type == PatternType.PREFERENCE])
        opp_count = len([p for p in patterns if p.pattern_type == PatternType.OPPORTUNITY])
        
        if error_count:
            summary_parts.append(f"{error_count} potential issue(s) detected")
        if pref_count:
            summary_parts.append(f"{pref_count} user preference(s) identified")
        if opp_count:
            summary_parts.append(f"{opp_count} improvement opportunity(ies) found")
        
        return ". ".join(summary_parts) + "."
    
    def _generate_batch_summary(self, patterns: List[DetectedPattern]) -> str:
        """Génère un résumé pour un batch d'analyses"""
        
        base_summary = self._generate_learning_summary(patterns)
        
        high_confidence = [p for p in patterns if p.confidence >= CONFIDENCE_THRESHOLDS["high"]]
        auto_applicable = [p for p in patterns if p.auto_applicable]
        
        additions = []
        if high_confidence:
            additions.append(f"{len(high_confidence)} high-confidence pattern(s) ready for action")
        if auto_applicable:
            additions.append(f"{len(auto_applicable)} pattern(s) can be auto-applied")
        
        if additions:
            return base_summary + " " + ". ".join(additions) + "."
        
        return base_summary
    
    # -------------------------------------------------------------------------
    # MODE ACTIF - Enseignement par l'utilisateur
    # -------------------------------------------------------------------------
    
    async def process_teaching(self, request: TeachingRequest) -> ActiveLearningOutput:
        """Traite une requête d'enseignement utilisateur"""
        
        rules_to_add = []
        preferences_to_add = []
        prompt_updates = []
        memory_updates = []
        
        # 1. Analyser l'instruction
        instruction_analysis = self._analyze_instruction(request.instruction)
        
        # 2. Créer les règles appropriées
        if request.instruction_type == "rule":
            rule = self._create_rule_from_instruction(request, instruction_analysis)
            rules_to_add.append(rule)
        
        elif request.instruction_type == "style":
            # Style = préférence + prompt update
            pref = self._create_style_preference(request)
            preferences_to_add.append(pref)
            
            update = PromptUpdate(
                target_agent=request.target_agent,
                update_type="append",
                section="communication_style",
                new_content=f"User style preference: {request.instruction}"
            )
            prompt_updates.append(update)
        
        elif request.instruction_type == "constraint":
            rule = AgentRule(
                name=f"User constraint: {request.instruction[:50]}",
                description=request.instruction,
                rule_type=RuleType.CONSTRAINT,
                scope=RuleScope.USER,
                target_agent=request.target_agent,
                target_user_id=request.user_id,
                action=f"Apply constraint: {request.instruction}",
                confidence_score=1.0,  # User-defined = full confidence
                auto_generated=False
            )
            rules_to_add.append(rule)
        
        elif request.instruction_type == "system":
            # System = global rule for all agents
            if request.apply_to_all_agents:
                for agent in AgentTarget:
                    if agent != AgentTarget.ALL:
                        rule = AgentRule(
                            name=f"System rule: {request.instruction[:50]}",
                            description=request.instruction,
                            rule_type=RuleType.BEHAVIOR,
                            scope=RuleScope.GLOBAL,
                            target_agent=agent,
                            action=request.instruction,
                            confidence_score=1.0,
                            auto_generated=False
                        )
                        rules_to_add.append(rule)
            else:
                rule = AgentRule(
                    name=f"System rule: {request.instruction[:50]}",
                    description=request.instruction,
                    rule_type=RuleType.BEHAVIOR,
                    scope=RuleScope.AGENT,
                    target_agent=request.target_agent,
                    action=request.instruction,
                    confidence_score=1.0,
                    auto_generated=False
                )
                rules_to_add.append(rule)
        
        elif request.instruction_type == "pipeline":
            rule = AgentRule(
                name=f"Pipeline: {request.instruction[:50]}",
                description=request.instruction,
                rule_type=RuleType.PIPELINE,
                scope=RuleScope.AGENT,
                target_agent=request.target_agent,
                action=f"Execute pipeline: {request.instruction}",
                parameters={"steps": self._parse_pipeline_steps(request.instruction)},
                confidence_score=1.0,
                auto_generated=False
            )
            rules_to_add.append(rule)
        
        # 3. Ajouter les exemples comme mémoire
        for i, example in enumerate(request.examples):
            memory_updates.append(MemoryUpdate(
                target_agent=request.target_agent,
                user_id=request.user_id,
                memory_type="long_term",
                key=f"teaching_example_{i}",
                value={
                    "instruction": request.instruction,
                    "example": example
                }
            ))
        
        # 4. Créer l'événement d'apprentissage
        event = LearningEvent(
            mode=LearningMode.ACTIVE,
            source_user_id=request.user_id,
            event_type="user_teaching",
            description=f"User taught {request.instruction_type} to {request.target_agent}",
            data={
                "instruction": request.instruction,
                "rules_count": len(rules_to_add),
                "preferences_count": len(preferences_to_add)
            },
            confidence_score=1.0,
            applied=False
        )
        store.learning_events[event.id] = event
        
        # 5. Générer le résumé
        training_summary = self._generate_training_summary(
            request, rules_to_add, preferences_to_add, prompt_updates
        )
        
        return ActiveLearningOutput(
            agent_target=request.target_agent,
            training_summary=training_summary,
            rules_to_add=rules_to_add,
            preferences_to_add=preferences_to_add,
            prompt_updates=prompt_updates,
            memory_updates=memory_updates,
            requires_confirmation=True,
            estimated_impact=self._estimate_impact(rules_to_add)
        )
    
    def _analyze_instruction(self, instruction: str) -> Dict[str, Any]:
        """Analyse une instruction utilisateur"""
        
        # Simple keyword-based analysis (in production: use NLP/LLM)
        analysis = {
            "length": len(instruction),
            "has_conditions": any(word in instruction.lower() for word in ["si", "if", "when", "quand", "lorsque"]),
            "is_negative": any(word in instruction.lower() for word in ["ne pas", "jamais", "never", "don't", "not"]),
            "has_examples": any(word in instruction.lower() for word in ["exemple", "example", "comme", "like"]),
            "keywords": []
        }
        
        # Extract potential keywords
        common_words = {"le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "the", "a", "an", "and", "or"}
        words = instruction.lower().split()
        analysis["keywords"] = [w for w in words if len(w) > 3 and w not in common_words][:10]
        
        return analysis
    
    def _create_rule_from_instruction(self, request: TeachingRequest, analysis: Dict) -> AgentRule:
        """Crée une règle à partir d'une instruction"""
        
        return AgentRule(
            name=f"User rule: {request.instruction[:50]}",
            description=request.instruction,
            rule_type=RuleType.BEHAVIOR,
            scope=RuleScope.USER,
            target_agent=request.target_agent,
            target_user_id=request.user_id,
            condition="Always" if not analysis["has_conditions"] else "Conditional",
            action=request.instruction,
            parameters={
                "is_negative": analysis["is_negative"],
                "keywords": analysis["keywords"]
            },
            confidence_score=1.0,
            auto_generated=False
        )
    
    def _create_style_preference(self, request: TeachingRequest) -> UserPreference:
        """Crée une préférence de style"""
        
        return UserPreference(
            user_id=request.user_id,
            category="communication_style",
            key=f"style_{request.target_agent.value}",
            value=request.instruction,
            learned_from="explicit",
            confidence=1.0,
            applies_to=[request.target_agent] if not request.apply_to_all_agents else [AgentTarget.ALL]
        )
    
    def _parse_pipeline_steps(self, instruction: str) -> List[Dict[str, str]]:
        """Parse les étapes d'un pipeline"""
        
        # Simple parsing (in production: more sophisticated)
        steps = []
        
        # Look for numbered steps or step indicators
        lines = instruction.split("\n")
        for i, line in enumerate(lines):
            line = line.strip()
            if line:
                steps.append({
                    "order": i + 1,
                    "action": line,
                    "type": "execute"
                })
        
        if not steps:
            steps.append({
                "order": 1,
                "action": instruction,
                "type": "execute"
            })
        
        return steps
    
    def _generate_training_summary(
        self,
        request: TeachingRequest,
        rules: List[AgentRule],
        preferences: List[UserPreference],
        updates: List[PromptUpdate]
    ) -> str:
        """Génère un résumé de l'enseignement"""
        
        parts = [f"Teaching processed for agent '{request.target_agent.value}'."]
        
        if rules:
            parts.append(f"{len(rules)} rule(s) created.")
        if preferences:
            parts.append(f"{len(preferences)} preference(s) recorded.")
        if updates:
            parts.append(f"{len(updates)} prompt update(s) suggested.")
        
        if request.apply_to_all_agents:
            parts.append("Applied to ALL agents.")
        
        return " ".join(parts)
    
    def _estimate_impact(self, rules: List[AgentRule]) -> str:
        """Estime l'impact des règles"""
        
        if not rules:
            return "low"
        
        global_rules = [r for r in rules if r.scope == RuleScope.GLOBAL]
        constraint_rules = [r for r in rules if r.rule_type == RuleType.CONSTRAINT]
        
        if global_rules or len(rules) > 3:
            return "high"
        if constraint_rules or len(rules) > 1:
            return "medium"
        return "low"

# Initialize engine
engine = CheLearningEngine()

# =============================================================================
# RULES MANAGEMENT
# =============================================================================

class RulesManager:
    """Gestionnaire des règles avec versioning"""
    
    async def create_rule(self, rule: AgentRule, created_by: str = "chelearn") -> AgentRule:
        """Crée une nouvelle règle"""
        
        # Store rule
        store.agent_rules[rule.id] = rule
        
        # Index by agent
        agent_key = rule.target_agent.value
        if agent_key not in store.rules_by_agent:
            store.rules_by_agent[agent_key] = []
        store.rules_by_agent[agent_key].append(rule.id)
        
        # Create initial version
        version = RuleVersion(
            rule_id=rule.id,
            version=1,
            rule_snapshot=rule.dict(),
            change_reason="Initial creation",
            changed_by=created_by
        )
        store.rule_versions[rule.id] = [version]
        
        return rule
    
    async def update_rule(
        self,
        rule_id: str,
        updates: Dict[str, Any],
        change_reason: str,
        changed_by: str = "chelearn"
    ) -> AgentRule:
        """Met à jour une règle avec versioning"""
        
        if rule_id not in store.agent_rules:
            raise HTTPException(status_code=404, detail="Rule not found")
        
        rule = store.agent_rules[rule_id]
        
        # Increment version
        new_version = rule.version + 1
        
        # Apply updates
        for key, value in updates.items():
            if hasattr(rule, key):
                setattr(rule, key, value)
        
        rule.version = new_version
        rule.updated_at = datetime.utcnow()
        rule.previous_version_id = rule.id
        rule.changelog = change_reason
        
        # Store updated rule
        store.agent_rules[rule_id] = rule
        
        # Create version record
        version = RuleVersion(
            rule_id=rule_id,
            version=new_version,
            rule_snapshot=rule.dict(),
            change_reason=change_reason,
            changed_by=changed_by
        )
        store.rule_versions[rule_id].append(version)
        
        return rule
    
    async def rollback_rule(self, rule_id: str, target_version: int) -> AgentRule:
        """Rollback une règle à une version précédente"""
        
        if rule_id not in store.rule_versions:
            raise HTTPException(status_code=404, detail="Rule versions not found")
        
        versions = store.rule_versions[rule_id]
        target = next((v for v in versions if v.version == target_version), None)
        
        if not target:
            raise HTTPException(status_code=404, detail=f"Version {target_version} not found")
        
        # Restore from snapshot
        restored_rule = AgentRule(**target.rule_snapshot)
        restored_rule.version = len(versions) + 1
        restored_rule.updated_at = datetime.utcnow()
        restored_rule.changelog = f"Rolled back to version {target_version}"
        
        store.agent_rules[rule_id] = restored_rule
        
        # Create rollback version record
        version = RuleVersion(
            rule_id=rule_id,
            version=restored_rule.version,
            rule_snapshot=restored_rule.dict(),
            change_reason=f"Rollback to version {target_version}",
            changed_by="system"
        )
        store.rule_versions[rule_id].append(version)
        
        return restored_rule
    
    async def get_rules_for_agent(self, agent: AgentTarget) -> List[AgentRule]:
        """Récupère toutes les règles pour un agent"""
        
        rule_ids = store.rules_by_agent.get(agent.value, [])
        rules = [store.agent_rules[rid] for rid in rule_ids if rid in store.agent_rules]
        
        # Also get global rules
        global_rule_ids = store.rules_by_agent.get("all", [])
        global_rules = [store.agent_rules[rid] for rid in global_rule_ids if rid in store.agent_rules]
        
        # Filter enabled only
        all_rules = rules + global_rules
        return [r for r in all_rules if r.enabled]
    
    async def delete_rule(self, rule_id: str) -> bool:
        """Supprime une règle (soft delete)"""
        
        if rule_id not in store.agent_rules:
            return False
        
        rule = store.agent_rules[rule_id]
        rule.enabled = False
        rule.updated_at = datetime.utcnow()
        rule.changelog = "Disabled by user"
        
        store.agent_rules[rule_id] = rule
        return True

rules_manager = RulesManager()

# =============================================================================
# API ENDPOINTS - Interaction Logging
# =============================================================================

@router.post("/interactions/log", response_model=InteractionLog)
async def log_interaction(interaction: InteractionLog):
    """Log une interaction agent-utilisateur"""
    store.interaction_logs[interaction.id] = interaction
    return interaction

@router.get("/interactions/{user_id}", response_model=List[InteractionLog])
async def get_user_interactions(
    user_id: str,
    limit: int = 50,
    analyzed_only: bool = False
):
    """Récupère les interactions d'un utilisateur"""
    interactions = [
        log for log in store.interaction_logs.values()
        if log.user_id == user_id
    ]
    
    if analyzed_only:
        interactions = [i for i in interactions if i.analyzed]
    
    return sorted(interactions, key=lambda x: x.timestamp, reverse=True)[:limit]

# =============================================================================
# API ENDPOINTS - Passive Learning
# =============================================================================

@router.post("/analyze/single", response_model=PassiveLearningOutput)
async def analyze_single_interaction(interaction_id: str):
    """Analyse une interaction spécifique"""
    
    if interaction_id not in store.interaction_logs:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    interaction = store.interaction_logs[interaction_id]
    return await engine.analyze_interaction(interaction)

@router.post("/analyze/batch", response_model=PassiveLearningOutput)
async def analyze_batch(user_id: str, limit: int = 50):
    """Analyse un batch d'interactions non analysées"""
    return await engine.batch_analyze(user_id, limit)

@router.get("/patterns", response_model=List[DetectedPattern])
async def get_detected_patterns(
    pattern_type: Optional[PatternType] = None,
    min_confidence: float = 0.0
):
    """Récupère les patterns détectés"""
    
    patterns = list(store.detected_patterns.values())
    
    if pattern_type:
        patterns = [p for p in patterns if p.pattern_type == pattern_type]
    
    patterns = [p for p in patterns if p.confidence >= min_confidence]
    
    return sorted(patterns, key=lambda x: x.confidence, reverse=True)

# =============================================================================
# API ENDPOINTS - Active Learning (User Teaching)
# =============================================================================

@router.post("/teach", response_model=ActiveLearningOutput)
async def teach_agent(request: TeachingRequest):
    """
    Enseigne un agent via instruction utilisateur
    
    Exemples de commandes:
    - "CHE-Learn, enseigne à Marketing d'être plus structuré"
    - "CHE-Learn, ajoute cette règle à Finance"
    - "CHE-Learn, applique ce système à tous les agents"
    """
    return await engine.process_teaching(request)

@router.post("/teach/confirm/{event_id}")
async def confirm_teaching(event_id: str, background_tasks: BackgroundTasks):
    """Confirme et applique un enseignement"""
    
    if event_id not in store.learning_events:
        raise HTTPException(status_code=404, detail="Learning event not found")
    
    event = store.learning_events[event_id]
    
    # Mark as applied
    event.applied = True
    store.learning_events[event_id] = event
    
    # Background task to apply changes
    background_tasks.add_task(apply_learning_changes, event_id)
    
    return {"status": "confirmed", "event_id": event_id}

async def apply_learning_changes(event_id: str):
    """Applique les changements d'apprentissage en background"""
    
    event = store.learning_events.get(event_id)
    if not event:
        return
    
    # Get associated rules and apply them
    # In production: update agent prompts, memories, etc.
    pass

# =============================================================================
# API ENDPOINTS - Rules Management
# =============================================================================

@router.post("/rules", response_model=AgentRule)
async def create_rule(rule: AgentRule):
    """Crée une nouvelle règle"""
    return await rules_manager.create_rule(rule)

@router.get("/rules", response_model=List[AgentRule])
async def get_rules(
    agent: Optional[AgentTarget] = None,
    rule_type: Optional[RuleType] = None,
    enabled_only: bool = True
):
    """Récupère les règles"""
    
    rules = list(store.agent_rules.values())
    
    if agent:
        rules = [r for r in rules if r.target_agent == agent or r.target_agent == AgentTarget.ALL]
    
    if rule_type:
        rules = [r for r in rules if r.rule_type == rule_type]
    
    if enabled_only:
        rules = [r for r in rules if r.enabled]
    
    return rules

@router.get("/rules/{rule_id}", response_model=AgentRule)
async def get_rule(rule_id: str):
    """Récupère une règle spécifique"""
    
    if rule_id not in store.agent_rules:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    return store.agent_rules[rule_id]

@router.put("/rules/{rule_id}", response_model=AgentRule)
async def update_rule(
    rule_id: str,
    updates: Dict[str, Any],
    change_reason: str = "User update"
):
    """Met à jour une règle"""
    return await rules_manager.update_rule(rule_id, updates, change_reason)

@router.post("/rules/{rule_id}/rollback", response_model=AgentRule)
async def rollback_rule(rule_id: str, target_version: int):
    """Rollback une règle à une version précédente"""
    return await rules_manager.rollback_rule(rule_id, target_version)

@router.get("/rules/{rule_id}/versions", response_model=List[RuleVersion])
async def get_rule_versions(rule_id: str):
    """Récupère l'historique des versions d'une règle"""
    
    if rule_id not in store.rule_versions:
        raise HTTPException(status_code=404, detail="Rule versions not found")
    
    return store.rule_versions[rule_id]

@router.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    """Désactive une règle"""
    
    success = await rules_manager.delete_rule(rule_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    return {"status": "disabled", "rule_id": rule_id}

# =============================================================================
# API ENDPOINTS - User Preferences
# =============================================================================

@router.get("/preferences/{user_id}", response_model=List[UserPreference])
async def get_user_preferences(user_id: str, category: Optional[str] = None):
    """Récupère les préférences d'un utilisateur"""
    
    preferences = store.user_preferences.get(user_id, [])
    
    if category:
        preferences = [p for p in preferences if p.category == category]
    
    return preferences

@router.post("/preferences", response_model=UserPreference)
async def add_preference(preference: UserPreference):
    """Ajoute une préférence utilisateur"""
    
    if preference.user_id not in store.user_preferences:
        store.user_preferences[preference.user_id] = []
    
    store.user_preferences[preference.user_id].append(preference)
    return preference

# =============================================================================
# API ENDPOINTS - Prompt Updates
# =============================================================================

@router.get("/prompt-updates", response_model=List[PromptUpdate])
async def get_prompt_updates(
    agent: Optional[AgentTarget] = None,
    status: Optional[str] = None
):
    """Récupère les mises à jour de prompt suggérées"""
    
    updates = list(store.prompt_updates.values())
    
    if agent:
        updates = [u for u in updates if u.target_agent == agent]
    
    if status:
        updates = [u for u in updates if u.status == status]
    
    return updates

@router.post("/prompt-updates/{update_id}/apply")
async def apply_prompt_update(update_id: str, approved_by: str):
    """Applique une mise à jour de prompt"""
    
    if update_id not in store.prompt_updates:
        raise HTTPException(status_code=404, detail="Update not found")
    
    update = store.prompt_updates[update_id]
    update.status = "applied"
    update.applied_at = datetime.utcnow()
    update.applied_by = approved_by
    
    store.prompt_updates[update_id] = update
    
    # In production: actually update the agent's prompt
    
    return {"status": "applied", "update_id": update_id}

# =============================================================================
# API ENDPOINTS - Learning Events & Stats
# =============================================================================

@router.get("/events", response_model=List[LearningEvent])
async def get_learning_events(
    mode: Optional[LearningMode] = None,
    limit: int = 100
):
    """Récupère les événements d'apprentissage"""
    
    events = list(store.learning_events.values())
    
    if mode:
        events = [e for e in events if e.mode == mode]
    
    return sorted(events, key=lambda x: x.timestamp, reverse=True)[:limit]

@router.get("/stats")
async def get_learning_stats():
    """Récupère les statistiques d'apprentissage"""
    
    total_interactions = len(store.interaction_logs)
    analyzed_interactions = len([i for i in store.interaction_logs.values() if i.analyzed])
    total_patterns = len(store.detected_patterns)
    total_rules = len(store.agent_rules)
    active_rules = len([r for r in store.agent_rules.values() if r.enabled])
    total_events = len(store.learning_events)
    
    # Patterns by type
    patterns_by_type = {}
    for pattern in store.detected_patterns.values():
        ptype = pattern.pattern_type.value
        patterns_by_type[ptype] = patterns_by_type.get(ptype, 0) + 1
    
    # Rules by agent
    rules_by_agent = {}
    for rule in store.agent_rules.values():
        agent = rule.target_agent.value
        rules_by_agent[agent] = rules_by_agent.get(agent, 0) + 1
    
    # Average confidence
    confidences = [p.confidence for p in store.detected_patterns.values()]
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    return {
        "interactions": {
            "total": total_interactions,
            "analyzed": analyzed_interactions,
            "pending": total_interactions - analyzed_interactions
        },
        "patterns": {
            "total": total_patterns,
            "by_type": patterns_by_type,
            "avg_confidence": round(avg_confidence, 2)
        },
        "rules": {
            "total": total_rules,
            "active": active_rules,
            "by_agent": rules_by_agent
        },
        "events": {
            "total": total_events,
            "passive": len([e for e in store.learning_events.values() if e.mode == LearningMode.PASSIVE]),
            "active": len([e for e in store.learning_events.values() if e.mode == LearningMode.ACTIVE])
        }
    }

# =============================================================================
# API ENDPOINTS - Agent Integration
# =============================================================================

@router.get("/agents/{agent_id}/context")
async def get_agent_learning_context(agent_id: str, user_id: str):
    """
    Récupère le contexte d'apprentissage pour un agent
    
    Utilisé par l'orchestrateur pour enrichir les prompts des agents
    avec les règles et préférences apprises.
    """
    
    try:
        agent = AgentTarget(agent_id)
    except ValueError:
        agent = AgentTarget.NOVA
    
    # Get rules for this agent
    rules = await rules_manager.get_rules_for_agent(agent)
    
    # Get user preferences
    preferences = store.user_preferences.get(user_id, [])
    applicable_prefs = [
        p for p in preferences
        if AgentTarget.ALL in p.applies_to or agent in p.applies_to
    ]
    
    # Format for agent consumption
    context = {
        "agent_id": agent_id,
        "user_id": user_id,
        "rules": [
            {
                "name": r.name,
                "action": r.action,
                "type": r.rule_type.value,
                "confidence": r.confidence_score
            }
            for r in rules
        ],
        "preferences": [
            {
                "category": p.category,
                "key": p.key,
                "value": p.value,
                "confidence": p.confidence
            }
            for p in applicable_prefs
        ],
        "prompt_additions": []
    }
    
    # Get applicable prompt updates
    for update in store.prompt_updates.values():
        if update.target_agent == agent and update.status == "applied":
            context["prompt_additions"].append({
                "section": update.section,
                "content": update.new_content
            })
    
    return context

# =============================================================================
# ORCHESTRATOR V2 INTEGRATION
# =============================================================================

class OrchestratorV2:
    """
    Orchestrateur V2 avec intégration CHE·Learn
    
    Responsabilités:
    1. Router les requêtes vers les bons agents
    2. Enrichir les prompts avec le contexte CHE·Learn
    3. Logger les interactions pour analyse
    4. Appliquer les règles et préférences
    """
    
    async def process_request(
        self,
        user_id: str,
        agent_id: str,
        user_input: str,
        session_id: str,
        context: Dict[str, Any] = {}
    ) -> Dict[str, Any]:
        """Traite une requête utilisateur"""
        
        # 1. Get learning context
        learning_context = await self._get_learning_context(agent_id, user_id)
        
        # 2. Enrich prompt with rules and preferences
        enriched_prompt = self._enrich_prompt(user_input, learning_context)
        
        # 3. Call agent (simulated here)
        response_start = datetime.utcnow()
        agent_response = await self._call_agent(agent_id, enriched_prompt, context)
        response_time = int((datetime.utcnow() - response_start).total_seconds() * 1000)
        
        # 4. Log interaction for CHE·Learn
        interaction = InteractionLog(
            user_id=user_id,
            agent_id=agent_id,
            session_id=session_id,
            user_input=user_input,
            agent_response=agent_response["content"],
            context=context,
            response_time_ms=response_time,
            tokens_used=agent_response.get("tokens", 0)
        )
        store.interaction_logs[interaction.id] = interaction
        
        # 5. Trigger async analysis (non-blocking)
        # In production: use Celery or similar
        
        return {
            "response": agent_response["content"],
            "interaction_id": interaction.id,
            "agent_id": agent_id,
            "rules_applied": len(learning_context.get("rules", [])),
            "preferences_applied": len(learning_context.get("preferences", []))
        }
    
    async def _get_learning_context(self, agent_id: str, user_id: str) -> Dict[str, Any]:
        """Récupère le contexte d'apprentissage"""
        
        try:
            return await get_agent_learning_context(agent_id, user_id)
        except Exception:
            return {"rules": [], "preferences": [], "prompt_additions": []}
    
    def _enrich_prompt(self, user_input: str, learning_context: Dict) -> str:
        """Enrichit le prompt avec le contexte d'apprentissage"""
        
        enrichments = []
        
        # Add rules as instructions
        for rule in learning_context.get("rules", []):
            if rule["confidence"] >= 0.7:
                enrichments.append(f"[Rule] {rule['action']}")
        
        # Add preferences
        for pref in learning_context.get("preferences", []):
            if pref["confidence"] >= 0.6:
                enrichments.append(f"[Preference] {pref['category']}: {pref['value']}")
        
        # Add prompt additions
        for addition in learning_context.get("prompt_additions", []):
            enrichments.append(f"[{addition['section']}] {addition['content']}")
        
        if enrichments:
            enrichment_block = "\n".join(enrichments)
            return f"<learning_context>\n{enrichment_block}\n</learning_context>\n\n{user_input}"
        
        return user_input
    
    async def _call_agent(
        self,
        agent_id: str,
        prompt: str,
        context: Dict
    ) -> Dict[str, Any]:
        """Appelle l'agent (simulation)"""
        
        # In production: call actual agent API
        return {
            "content": f"[{agent_id}] Response to: {prompt[:50]}...",
            "tokens": len(prompt.split()) * 2
        }

orchestrator_v2 = OrchestratorV2()

@router.post("/orchestrator/process")
async def orchestrator_process(
    user_id: str,
    agent_id: str,
    user_input: str,
    session_id: str,
    context: Dict[str, Any] = {}
):
    """
    Point d'entrée principal pour les requêtes utilisateur
    
    L'orchestrateur V2:
    1. Récupère le contexte CHE·Learn
    2. Enrichit le prompt avec règles et préférences
    3. Route vers l'agent approprié
    4. Log l'interaction pour analyse future
    """
    return await orchestrator_v2.process_request(
        user_id=user_id,
        agent_id=agent_id,
        user_input=user_input,
        session_id=session_id,
        context=context
    )

# =============================================================================
# HEALTH & INFO
# =============================================================================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "CHE·Learn",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/info")
async def service_info():
    """Information sur le service CHE·Learn"""
    return {
        "name": "CHE·Learn Agent",
        "description": "Agent d'apprentissage central du système CHE·NU",
        "version": "2.0.0",
        "capabilities": [
            "Passive learning from interactions",
            "Active teaching from users",
            "Pattern detection",
            "Rule generation and management",
            "User preference learning",
            "Prompt enrichment",
            "Orchestrator integration"
        ],
        "modes": ["passive", "active"],
        "supported_agents": [agent.value for agent in AgentTarget],
        "rule_types": [rt.value for rt in RuleType],
        "pattern_types": [pt.value for pt in PatternType]
    }
