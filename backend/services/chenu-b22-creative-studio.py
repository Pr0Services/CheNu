"""
CHE·NU™ B22 - Creative Studio Global
Hub central de création multimédia

Features:
- Creative Studio Core (hub central)
- Asset Manager (gestion images/vidéos/audio)
- Template Engine (templates par entreprise)
- Brand Kit Manager (kits de marque)
- Export System (vers Social/Streaming/Docs)
- Creative Agents (design, montage, branding)

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~650
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from enum import Enum
from uuid import uuid4

router = APIRouter(prefix="/api/v2/creative", tags=["Creative Studio"])

# =============================================================================
# ENUMS
# =============================================================================

class AssetType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"
    FONT = "font"
    ICON = "icon"
    TEMPLATE = "template"

class AssetStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    ARCHIVED = "archived"

class ExportTarget(str, Enum):
    SOCIAL = "social"
    STREAMING = "streaming"
    DOCUMENT = "document"
    DOWNLOAD = "download"
    EMAIL = "email"

class TemplateCategory(str, Enum):
    SOCIAL_POST = "social_post"
    PRESENTATION = "presentation"
    DOCUMENT = "document"
    VIDEO_INTRO = "video_intro"
    THUMBNAIL = "thumbnail"
    BANNER = "banner"
    LOGO = "logo"
    INFOGRAPHIC = "infographic"
    EMAIL = "email"

class AgentType(str, Enum):
    DESIGN = "design"
    MONTAGE = "montage"
    BRANDING = "branding"
    COPYWRITING = "copywriting"
    ANALYSIS = "analysis"

# =============================================================================
# MODELS - Assets
# =============================================================================

class AssetMetadata(BaseModel):
    """Métadonnées d'un asset"""
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None  # For video/audio
    file_size: int = 0
    mime_type: str = ""
    color_palette: List[str] = []  # Extracted colors
    tags_auto: List[str] = []  # AI-generated tags

class Asset(BaseModel):
    """Asset créatif"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic info
    name: str
    description: Optional[str] = None
    asset_type: AssetType
    status: AssetStatus = AssetStatus.UPLOADING
    
    # Files
    original_url: str = ""
    thumbnail_url: Optional[str] = None
    preview_url: Optional[str] = None
    
    # Metadata
    metadata: AssetMetadata = AssetMetadata()
    
    # Organization
    folder_id: Optional[str] = None
    tags: List[str] = []
    
    # Context
    space_id: Optional[str] = None
    project_id: Optional[str] = None
    
    # Usage tracking
    usage_count: int = 0
    last_used_at: Optional[datetime] = None

class AssetFolder(BaseModel):
    """Dossier d'assets"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    name: str
    parent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    color: str = "#D8B26A"
    icon: str = "📁"
    
    # Stats
    assets_count: int = 0
    subfolders_count: int = 0

class AssetUpload(BaseModel):
    name: str
    asset_type: AssetType
    description: Optional[str] = None
    folder_id: Optional[str] = None
    tags: List[str] = []
    space_id: Optional[str] = None

# =============================================================================
# MODELS - Brand Kit
# =============================================================================

class ColorPalette(BaseModel):
    """Palette de couleurs de marque"""
    primary: str
    secondary: str
    accent: str
    background: str
    text: str
    muted: str
    success: str = "#3F7249"
    warning: str = "#F59E0B"
    danger: str = "#EF4444"
    custom: Dict[str, str] = {}

class Typography(BaseModel):
    """Typographie de marque"""
    heading_font: str = "Lora"
    body_font: str = "Inter"
    accent_font: Optional[str] = None
    
    # Sizes
    h1_size: int = 40
    h2_size: int = 32
    h3_size: int = 24
    h4_size: int = 20
    body_size: int = 16
    small_size: int = 14
    
    # Weights
    heading_weight: int = 700
    body_weight: int = 400

class BrandAssets(BaseModel):
    """Assets de marque"""
    logo_light_id: Optional[str] = None
    logo_dark_id: Optional[str] = None
    logo_icon_id: Optional[str] = None
    favicon_id: Optional[str] = None
    watermark_id: Optional[str] = None
    
    # Social
    social_avatar_id: Optional[str] = None
    social_banner_id: Optional[str] = None

class BrandGuidelines(BaseModel):
    """Guidelines de marque"""
    voice_tone: str = "Professional and friendly"
    key_messages: List[str] = []
    do_list: List[str] = []
    dont_list: List[str] = []
    hashtags: List[str] = []

class BrandKit(BaseModel):
    """Kit de marque complet"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Identity
    name: str
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    
    # Visual identity
    colors: ColorPalette = ColorPalette(
        primary="#D8B26A",
        secondary="#3EB4A2",
        accent="#8B5CF6",
        background="#1A1A1A",
        text="#E8E4DC",
        muted="#6B6560"
    )
    typography: Typography = Typography()
    assets: BrandAssets = BrandAssets()
    
    # Guidelines
    guidelines: BrandGuidelines = BrandGuidelines()
    
    # Context
    space_id: Optional[str] = None
    is_default: bool = False

# =============================================================================
# MODELS - Templates
# =============================================================================

class TemplateVariable(BaseModel):
    """Variable de template"""
    name: str
    type: Literal["text", "image", "color", "number"]
    default_value: Any = None
    placeholder: Optional[str] = None
    required: bool = False

class Template(BaseModel):
    """Template créatif"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic info
    name: str
    description: Optional[str] = None
    category: TemplateCategory
    thumbnail_url: Optional[str] = None
    
    # Template content
    content: Dict[str, Any] = {}  # Template structure/data
    variables: List[TemplateVariable] = []
    
    # Dimensions
    width: int = 1080
    height: int = 1080
    
    # Style
    brand_kit_id: Optional[str] = None
    
    # Sharing
    is_public: bool = False
    is_premium: bool = False
    
    # Stats
    usage_count: int = 0
    
    # Tags
    tags: List[str] = []

class TemplateInstance(BaseModel):
    """Instance d'un template (création)"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    template_id: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    variables_values: Dict[str, Any] = {}
    
    # Output
    output_url: Optional[str] = None
    output_format: str = "png"
    status: str = "draft"

# =============================================================================
# MODELS - Projects & Export
# =============================================================================

class CreativeProject(BaseModel):
    """Projet créatif"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    description: Optional[str] = None
    
    # Content
    asset_ids: List[str] = []
    template_ids: List[str] = []
    
    # Brand
    brand_kit_id: Optional[str] = None
    
    # Context
    space_id: Optional[str] = None
    project_id: Optional[str] = None  # Business project
    
    # Status
    status: str = "active"

class ExportJob(BaseModel):
    """Job d'export"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Source
    source_type: Literal["asset", "template", "project"]
    source_id: str
    
    # Target
    target: ExportTarget
    target_config: Dict[str, Any] = {}  # Platform-specific config
    
    # Output
    output_url: Optional[str] = None
    output_format: str = "png"
    
    # Status
    status: str = "pending"
    progress: int = 0
    error_message: Optional[str] = None

# =============================================================================
# MODELS - Creative Agents
# =============================================================================

class AgentTask(BaseModel):
    """Tâche pour un agent créatif"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    agent_type: AgentType
    instruction: str
    
    # Input
    input_asset_ids: List[str] = []
    input_text: Optional[str] = None
    brand_kit_id: Optional[str] = None
    
    # Output
    output_asset_ids: List[str] = []
    output_text: Optional[str] = None
    suggestions: List[str] = []
    
    # Status
    status: str = "pending"
    progress: int = 0

class AgentCapability(BaseModel):
    """Capacité d'un agent"""
    name: str
    description: str
    input_types: List[str]
    output_types: List[str]

class CreativeAgent(BaseModel):
    """Agent créatif"""
    id: str
    type: AgentType
    name: str
    description: str
    capabilities: List[AgentCapability]
    is_available: bool = True

# =============================================================================
# STORAGE
# =============================================================================

class CreativeStore:
    def __init__(self):
        self.assets: Dict[str, Asset] = {}
        self.folders: Dict[str, AssetFolder] = {}
        self.brand_kits: Dict[str, BrandKit] = {}
        self.templates: Dict[str, Template] = {}
        self.template_instances: Dict[str, TemplateInstance] = {}
        self.projects: Dict[str, CreativeProject] = {}
        self.export_jobs: Dict[str, ExportJob] = {}
        self.agent_tasks: Dict[str, AgentTask] = {}
        
        # Indexes
        self.assets_by_owner: Dict[str, List[str]] = {}
        self.assets_by_folder: Dict[str, List[str]] = {}
        self.templates_by_category: Dict[str, List[str]] = {}

store = CreativeStore()

# Initialize agents
CREATIVE_AGENTS = {
    AgentType.DESIGN: CreativeAgent(
        id="agent_design",
        type=AgentType.DESIGN,
        name="Design Agent",
        description="Creates and modifies visual designs",
        capabilities=[
            AgentCapability(name="Generate Image", description="Create images from text", input_types=["text"], output_types=["image"]),
            AgentCapability(name="Edit Image", description="Modify existing images", input_types=["image", "text"], output_types=["image"]),
            AgentCapability(name="Remove Background", description="Remove image background", input_types=["image"], output_types=["image"]),
        ]
    ),
    AgentType.MONTAGE: CreativeAgent(
        id="agent_montage",
        type=AgentType.MONTAGE,
        name="Montage Agent",
        description="Video editing and composition",
        capabilities=[
            AgentCapability(name="Trim Video", description="Cut video segments", input_types=["video"], output_types=["video"]),
            AgentCapability(name="Add Captions", description="Auto-generate captions", input_types=["video"], output_types=["video"]),
            AgentCapability(name="Create Montage", description="Combine multiple clips", input_types=["video"], output_types=["video"]),
        ]
    ),
    AgentType.BRANDING: CreativeAgent(
        id="agent_branding",
        type=AgentType.BRANDING,
        name="Branding Agent",
        description="Brand consistency and style",
        capabilities=[
            AgentCapability(name="Apply Brand", description="Apply brand kit to asset", input_types=["image", "brand_kit"], output_types=["image"]),
            AgentCapability(name="Generate Palette", description="Extract color palette", input_types=["image"], output_types=["colors"]),
            AgentCapability(name="Check Consistency", description="Verify brand guidelines", input_types=["image", "brand_kit"], output_types=["report"]),
        ]
    ),
    AgentType.COPYWRITING: CreativeAgent(
        id="agent_copy",
        type=AgentType.COPYWRITING,
        name="Copywriting Agent",
        description="Text generation and editing",
        capabilities=[
            AgentCapability(name="Generate Caption", description="Create social captions", input_types=["image", "text"], output_types=["text"]),
            AgentCapability(name="Rewrite", description="Improve existing text", input_types=["text"], output_types=["text"]),
            AgentCapability(name="Translate", description="Translate content", input_types=["text"], output_types=["text"]),
        ]
    ),
    AgentType.ANALYSIS: CreativeAgent(
        id="agent_analysis",
        type=AgentType.ANALYSIS,
        name="Analysis Agent",
        description="Content analysis and insights",
        capabilities=[
            AgentCapability(name="Analyze Image", description="Describe image content", input_types=["image"], output_types=["text"]),
            AgentCapability(name="Extract Colors", description="Get color palette", input_types=["image"], output_types=["colors"]),
            AgentCapability(name="Suggest Tags", description="Auto-tag content", input_types=["image"], output_types=["tags"]),
        ]
    ),
}

# =============================================================================
# API - ASSETS
# =============================================================================

@router.post("/assets", response_model=Asset)
async def create_asset(data: AssetUpload, owner_id: str):
    """Crée un nouvel asset"""
    asset = Asset(
        owner_id=owner_id,
        name=data.name,
        asset_type=data.asset_type,
        description=data.description,
        folder_id=data.folder_id,
        tags=data.tags,
        space_id=data.space_id
    )
    
    store.assets[asset.id] = asset
    
    if owner_id not in store.assets_by_owner:
        store.assets_by_owner[owner_id] = []
    store.assets_by_owner[owner_id].append(asset.id)
    
    if data.folder_id:
        if data.folder_id not in store.assets_by_folder:
            store.assets_by_folder[data.folder_id] = []
        store.assets_by_folder[data.folder_id].append(asset.id)
        if data.folder_id in store.folders:
            store.folders[data.folder_id].assets_count += 1
    
    return asset

@router.get("/assets/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    """Récupère un asset"""
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    return store.assets[asset_id]

@router.get("/assets", response_model=List[Asset])
async def list_assets(
    owner_id: str,
    folder_id: Optional[str] = None,
    asset_type: Optional[AssetType] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    """Liste les assets"""
    if folder_id:
        asset_ids = store.assets_by_folder.get(folder_id, [])
    else:
        asset_ids = store.assets_by_owner.get(owner_id, [])
    
    assets = [store.assets[aid] for aid in asset_ids if aid in store.assets]
    
    if asset_type:
        assets = [a for a in assets if a.asset_type == asset_type]
    
    if search:
        search_lower = search.lower()
        assets = [a for a in assets if search_lower in a.name.lower() or any(search_lower in t for t in a.tags)]
    
    return sorted(assets, key=lambda x: x.created_at, reverse=True)[:limit]

@router.put("/assets/{asset_id}", response_model=Asset)
async def update_asset(asset_id: str, updates: Dict[str, Any], owner_id: str):
    """Met à jour un asset"""
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    
    asset = store.assets[asset_id]
    if asset.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    for key, value in updates.items():
        if hasattr(asset, key) and key not in ['id', 'owner_id', 'created_at']:
            setattr(asset, key, value)
    
    asset.updated_at = datetime.utcnow()
    return asset

@router.delete("/assets/{asset_id}")
async def delete_asset(asset_id: str, owner_id: str):
    """Supprime un asset"""
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    
    asset = store.assets[asset_id]
    if asset.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    asset.status = AssetStatus.ARCHIVED
    return {"status": "archived"}

# =============================================================================
# API - FOLDERS
# =============================================================================

@router.post("/folders", response_model=AssetFolder)
async def create_folder(name: str, owner_id: str, parent_id: Optional[str] = None, color: str = "#D8B26A"):
    """Crée un dossier"""
    folder = AssetFolder(owner_id=owner_id, name=name, parent_id=parent_id, color=color)
    store.folders[folder.id] = folder
    store.assets_by_folder[folder.id] = []
    
    if parent_id and parent_id in store.folders:
        store.folders[parent_id].subfolders_count += 1
    
    return folder

@router.get("/folders", response_model=List[AssetFolder])
async def list_folders(owner_id: str, parent_id: Optional[str] = None):
    """Liste les dossiers"""
    folders = [f for f in store.folders.values() if f.owner_id == owner_id and f.parent_id == parent_id]
    return sorted(folders, key=lambda x: x.name)

@router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str, owner_id: str):
    """Supprime un dossier"""
    if folder_id not in store.folders:
        raise HTTPException(404, "Folder not found")
    
    folder = store.folders[folder_id]
    if folder.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    if folder.assets_count > 0 or folder.subfolders_count > 0:
        raise HTTPException(400, "Folder not empty")
    
    del store.folders[folder_id]
    return {"status": "deleted"}

# =============================================================================
# API - BRAND KITS
# =============================================================================

@router.post("/brand-kits", response_model=BrandKit)
async def create_brand_kit(name: str, owner_id: str, company_name: Optional[str] = None):
    """Crée un kit de marque"""
    brand_kit = BrandKit(owner_id=owner_id, name=name, company_name=company_name)
    store.brand_kits[brand_kit.id] = brand_kit
    return brand_kit

@router.get("/brand-kits/{kit_id}", response_model=BrandKit)
async def get_brand_kit(kit_id: str):
    """Récupère un kit de marque"""
    if kit_id not in store.brand_kits:
        raise HTTPException(404, "Brand kit not found")
    return store.brand_kits[kit_id]

@router.get("/brand-kits", response_model=List[BrandKit])
async def list_brand_kits(owner_id: str, space_id: Optional[str] = None):
    """Liste les kits de marque"""
    kits = [k for k in store.brand_kits.values() if k.owner_id == owner_id]
    if space_id:
        kits = [k for k in kits if k.space_id == space_id]
    return kits

@router.put("/brand-kits/{kit_id}", response_model=BrandKit)
async def update_brand_kit(kit_id: str, updates: Dict[str, Any], owner_id: str):
    """Met à jour un kit de marque"""
    if kit_id not in store.brand_kits:
        raise HTTPException(404, "Brand kit not found")
    
    kit = store.brand_kits[kit_id]
    if kit.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    for key, value in updates.items():
        if hasattr(kit, key) and key not in ['id', 'owner_id', 'created_at']:
            if key in ['colors', 'typography', 'assets', 'guidelines']:
                # Handle nested models
                current = getattr(kit, key)
                if isinstance(value, dict):
                    for k, v in value.items():
                        if hasattr(current, k):
                            setattr(current, k, v)
            else:
                setattr(kit, key, value)
    
    kit.updated_at = datetime.utcnow()
    return kit

@router.post("/brand-kits/{kit_id}/set-default")
async def set_default_brand_kit(kit_id: str, owner_id: str):
    """Définit le kit de marque par défaut"""
    if kit_id not in store.brand_kits:
        raise HTTPException(404, "Brand kit not found")
    
    kit = store.brand_kits[kit_id]
    if kit.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    # Unset other defaults
    for k in store.brand_kits.values():
        if k.owner_id == owner_id:
            k.is_default = False
    
    kit.is_default = True
    return {"status": "set_default"}

# =============================================================================
# API - TEMPLATES
# =============================================================================

@router.post("/templates", response_model=Template)
async def create_template(
    name: str,
    category: TemplateCategory,
    owner_id: str,
    content: Dict[str, Any] = {},
    width: int = 1080,
    height: int = 1080
):
    """Crée un template"""
    template = Template(
        owner_id=owner_id,
        name=name,
        category=category,
        content=content,
        width=width,
        height=height
    )
    
    store.templates[template.id] = template
    
    cat_key = category.value
    if cat_key not in store.templates_by_category:
        store.templates_by_category[cat_key] = []
    store.templates_by_category[cat_key].append(template.id)
    
    return template

@router.get("/templates/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Récupère un template"""
    if template_id not in store.templates:
        raise HTTPException(404, "Template not found")
    return store.templates[template_id]

@router.get("/templates", response_model=List[Template])
async def list_templates(
    category: Optional[TemplateCategory] = None,
    owner_id: Optional[str] = None,
    public_only: bool = False,
    limit: int = 50
):
    """Liste les templates"""
    if category:
        template_ids = store.templates_by_category.get(category.value, [])
        templates = [store.templates[tid] for tid in template_ids if tid in store.templates]
    else:
        templates = list(store.templates.values())
    
    if owner_id:
        templates = [t for t in templates if t.owner_id == owner_id]
    
    if public_only:
        templates = [t for t in templates if t.is_public]
    
    return sorted(templates, key=lambda x: x.usage_count, reverse=True)[:limit]

@router.post("/templates/{template_id}/use", response_model=TemplateInstance)
async def use_template(template_id: str, owner_id: str, name: str, variables: Dict[str, Any] = {}):
    """Crée une instance d'un template"""
    if template_id not in store.templates:
        raise HTTPException(404, "Template not found")
    
    template = store.templates[template_id]
    template.usage_count += 1
    
    instance = TemplateInstance(
        template_id=template_id,
        owner_id=owner_id,
        name=name,
        variables_values=variables
    )
    
    store.template_instances[instance.id] = instance
    return instance

# =============================================================================
# API - EXPORT
# =============================================================================

@router.post("/export", response_model=ExportJob)
async def create_export(
    source_type: Literal["asset", "template", "project"],
    source_id: str,
    target: ExportTarget,
    owner_id: str,
    target_config: Dict[str, Any] = {},
    output_format: str = "png"
):
    """Crée un job d'export"""
    job = ExportJob(
        owner_id=owner_id,
        source_type=source_type,
        source_id=source_id,
        target=target,
        target_config=target_config,
        output_format=output_format
    )
    
    store.export_jobs[job.id] = job
    
    # Simulate processing
    job.status = "processing"
    job.progress = 50
    
    # In production: background task
    job.status = "completed"
    job.progress = 100
    job.output_url = f"/exports/{job.id}.{output_format}"
    
    return job

@router.get("/export/{job_id}", response_model=ExportJob)
async def get_export_job(job_id: str):
    """Récupère le statut d'un export"""
    if job_id not in store.export_jobs:
        raise HTTPException(404, "Export job not found")
    return store.export_jobs[job_id]

@router.post("/export/to-social")
async def export_to_social(
    asset_id: str,
    owner_id: str,
    platform: str,
    caption: Optional[str] = None
):
    """Export rapide vers Social"""
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    
    job = ExportJob(
        owner_id=owner_id,
        source_type="asset",
        source_id=asset_id,
        target=ExportTarget.SOCIAL,
        target_config={"platform": platform, "caption": caption}
    )
    
    store.export_jobs[job.id] = job
    job.status = "completed"
    
    return {"job_id": job.id, "status": "exported", "platform": platform}

@router.post("/export/to-streaming")
async def export_to_streaming(
    asset_id: str,
    owner_id: str,
    title: str,
    description: Optional[str] = None
):
    """Export rapide vers Streaming"""
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    
    asset = store.assets[asset_id]
    if asset.asset_type != AssetType.VIDEO:
        raise HTTPException(400, "Asset must be a video")
    
    job = ExportJob(
        owner_id=owner_id,
        source_type="asset",
        source_id=asset_id,
        target=ExportTarget.STREAMING,
        target_config={"title": title, "description": description}
    )
    
    store.export_jobs[job.id] = job
    job.status = "completed"
    
    return {"job_id": job.id, "status": "exported", "video_title": title}

# =============================================================================
# API - CREATIVE AGENTS
# =============================================================================

@router.get("/agents", response_model=List[CreativeAgent])
async def list_agents():
    """Liste les agents créatifs disponibles"""
    return list(CREATIVE_AGENTS.values())

@router.get("/agents/{agent_type}", response_model=CreativeAgent)
async def get_agent(agent_type: AgentType):
    """Récupère un agent"""
    if agent_type not in CREATIVE_AGENTS:
        raise HTTPException(404, "Agent not found")
    return CREATIVE_AGENTS[agent_type]

@router.post("/agents/task", response_model=AgentTask)
async def create_agent_task(
    agent_type: AgentType,
    instruction: str,
    owner_id: str,
    input_asset_ids: List[str] = [],
    input_text: Optional[str] = None,
    brand_kit_id: Optional[str] = None
):
    """Crée une tâche pour un agent"""
    if agent_type not in CREATIVE_AGENTS:
        raise HTTPException(404, "Agent not found")
    
    task = AgentTask(
        owner_id=owner_id,
        agent_type=agent_type,
        instruction=instruction,
        input_asset_ids=input_asset_ids,
        input_text=input_text,
        brand_kit_id=brand_kit_id
    )
    
    store.agent_tasks[task.id] = task
    
    # Simulate processing
    task.status = "processing"
    task.progress = 50
    
    # Generate output (simplified)
    if agent_type == AgentType.COPYWRITING:
        task.output_text = f"Generated caption for: {instruction}"
        task.suggestions = ["Shorter version", "More formal", "Add hashtags"]
    elif agent_type == AgentType.ANALYSIS:
        task.output_text = f"Analysis of {len(input_asset_ids)} assets"
        task.suggestions = ["Professional image", "Good lighting", "Consider cropping"]
    elif agent_type == AgentType.BRANDING:
        task.suggestions = ["Apply brand colors", "Use brand fonts", "Add logo watermark"]
    
    task.status = "completed"
    task.progress = 100
    
    return task

@router.get("/agents/task/{task_id}", response_model=AgentTask)
async def get_agent_task(task_id: str):
    """Récupère le statut d'une tâche"""
    if task_id not in store.agent_tasks:
        raise HTTPException(404, "Task not found")
    return store.agent_tasks[task_id]

# =============================================================================
# API - PROJECTS
# =============================================================================

@router.post("/projects", response_model=CreativeProject)
async def create_project(name: str, owner_id: str, description: Optional[str] = None, brand_kit_id: Optional[str] = None):
    """Crée un projet créatif"""
    project = CreativeProject(
        owner_id=owner_id,
        name=name,
        description=description,
        brand_kit_id=brand_kit_id
    )
    store.projects[project.id] = project
    return project

@router.get("/projects/{project_id}", response_model=CreativeProject)
async def get_project(project_id: str):
    """Récupère un projet"""
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    return store.projects[project_id]

@router.get("/projects", response_model=List[CreativeProject])
async def list_projects(owner_id: str, limit: int = 20):
    """Liste les projets"""
    projects = [p for p in store.projects.values() if p.owner_id == owner_id]
    return sorted(projects, key=lambda x: x.updated_at, reverse=True)[:limit]

@router.post("/projects/{project_id}/assets")
async def add_asset_to_project(project_id: str, asset_id: str, owner_id: str):
    """Ajoute un asset à un projet"""
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    if asset_id not in store.assets:
        raise HTTPException(404, "Asset not found")
    
    project = store.projects[project_id]
    if project.owner_id != owner_id:
        raise HTTPException(403, "Not authorized")
    
    if asset_id not in project.asset_ids:
        project.asset_ids.append(asset_id)
    
    project.updated_at = datetime.utcnow()
    return {"status": "added"}

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "assets": len(store.assets),
        "templates": len(store.templates),
        "brand_kits": len(store.brand_kits),
        "agents": len(CREATIVE_AGENTS)
    }
