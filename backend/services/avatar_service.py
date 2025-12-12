"""
CHE·NU - Advanced Avatar System
═══════════════════════════════════════════════════════════════════════════════
Système d'avatars avancé avec 6 styles et personnalisation complète.

Styles:
1. Humain Réaliste
2. Cartoon
3. Animal
4. Créature Mythique
5. Avatar 3D
6. Minimaliste / Flat

Features:
- Switch instantané entre styles
- Morphing facial
- Coiffures multiples
- Accessoires
- Expressions
- Preview temps réel
- Export PNG/SVG

Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import json
import logging
import hashlib
import base64

logger = logging.getLogger("CHENU.Avatars")


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class AvatarStyle(str, Enum):
    REALISTIC = "realistic"       # Humain réaliste
    CARTOON = "cartoon"           # Style cartoon/anime
    ANIMAL = "animal"             # Animaux anthropomorphes
    MYTHICAL = "mythical"         # Créatures mythiques
    THREE_D = "3d"                # Style 3D/Pixar
    MINIMAL = "minimal"           # Flat/Minimaliste


class SkinTone(str, Enum):
    LIGHT = "light"
    LIGHT_MEDIUM = "light_medium"
    MEDIUM = "medium"
    MEDIUM_DARK = "medium_dark"
    DARK = "dark"
    FANTASY = "fantasy"  # Bleu, vert, violet, etc.


class HairStyle(str, Enum):
    NONE = "none"
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"
    CURLY = "curly"
    WAVY = "wavy"
    BRAIDS = "braids"
    PONYTAIL = "ponytail"
    BUN = "bun"
    MOHAWK = "mohawk"
    AFRO = "afro"
    DREADLOCKS = "dreadlocks"


class HairColor(str, Enum):
    BLACK = "black"
    BROWN = "brown"
    BLONDE = "blonde"
    RED = "red"
    GRAY = "gray"
    WHITE = "white"
    BLUE = "blue"
    PINK = "pink"
    PURPLE = "purple"
    GREEN = "green"
    RAINBOW = "rainbow"


class EyeShape(str, Enum):
    ROUND = "round"
    ALMOND = "almond"
    HOODED = "hooded"
    UPTURNED = "upturned"
    DOWNTURNED = "downturned"
    MONOLID = "monolid"
    WIDE = "wide"


class EyeColor(str, Enum):
    BROWN = "brown"
    BLUE = "blue"
    GREEN = "green"
    HAZEL = "hazel"
    GRAY = "gray"
    AMBER = "amber"
    RED = "red"
    PURPLE = "purple"
    HETEROCHROMIA = "heterochromia"


class NoseShape(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    POINTED = "pointed"
    ROUND = "round"
    FLAT = "flat"


class MouthShape(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    WIDE = "wide"
    THIN = "thin"
    FULL = "full"


class FaceShape(str, Enum):
    OVAL = "oval"
    ROUND = "round"
    SQUARE = "square"
    HEART = "heart"
    OBLONG = "oblong"
    DIAMOND = "diamond"


class Expression(str, Enum):
    NEUTRAL = "neutral"
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    SURPRISED = "surprised"
    THINKING = "thinking"
    WINKING = "winking"
    LAUGHING = "laughing"
    CONFIDENT = "confident"
    SHY = "shy"


class AccessoryType(str, Enum):
    NONE = "none"
    GLASSES = "glasses"
    SUNGLASSES = "sunglasses"
    EARRINGS = "earrings"
    NECKLACE = "necklace"
    HAT = "hat"
    HEADPHONES = "headphones"
    MASK = "mask"
    CROWN = "crown"
    HORNS = "horns"
    WINGS = "wings"
    HALO = "halo"


class AnimalType(str, Enum):
    CAT = "cat"
    DOG = "dog"
    FOX = "fox"
    WOLF = "wolf"
    BEAR = "bear"
    RABBIT = "rabbit"
    OWL = "owl"
    LION = "lion"
    TIGER = "tiger"
    PANDA = "panda"
    KOALA = "koala"
    DRAGON = "dragon"


class MythicalType(str, Enum):
    ELF = "elf"
    FAIRY = "fairy"
    VAMPIRE = "vampire"
    WEREWOLF = "werewolf"
    MERMAID = "mermaid"
    CENTAUR = "centaur"
    PHOENIX = "phoenix"
    UNICORN = "unicorn"
    DEMON = "demon"
    ANGEL = "angel"
    ALIEN = "alien"
    ROBOT = "robot"


class BackgroundType(str, Enum):
    NONE = "none"
    SOLID = "solid"
    GRADIENT = "gradient"
    PATTERN = "pattern"
    NATURE = "nature"
    SPACE = "space"
    ABSTRACT = "abstract"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class FacialFeatures:
    """Caractéristiques faciales"""
    face_shape: FaceShape = FaceShape.OVAL
    skin_tone: SkinTone = SkinTone.MEDIUM
    
    # Yeux
    eye_shape: EyeShape = EyeShape.ALMOND
    eye_color: EyeColor = EyeColor.BROWN
    eyebrow_style: str = "natural"
    eyebrow_thickness: float = 0.5  # 0-1
    
    # Nez et bouche
    nose_shape: NoseShape = NoseShape.MEDIUM
    mouth_shape: MouthShape = MouthShape.MEDIUM
    lip_color: str = "#c44569"
    
    # Détails
    freckles: bool = False
    beauty_mark: bool = False
    facial_hair: Optional[str] = None  # beard, mustache, goatee, stubble
    wrinkles: float = 0.0  # 0-1
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "face_shape": self.face_shape.value,
            "skin_tone": self.skin_tone.value,
            "eye_shape": self.eye_shape.value,
            "eye_color": self.eye_color.value,
            "eyebrow_style": self.eyebrow_style,
            "eyebrow_thickness": self.eyebrow_thickness,
            "nose_shape": self.nose_shape.value,
            "mouth_shape": self.mouth_shape.value,
            "lip_color": self.lip_color,
            "freckles": self.freckles,
            "beauty_mark": self.beauty_mark,
            "facial_hair": self.facial_hair,
            "wrinkles": self.wrinkles
        }


@dataclass
class HairConfig:
    """Configuration des cheveux"""
    style: HairStyle = HairStyle.MEDIUM
    color: HairColor = HairColor.BROWN
    secondary_color: Optional[HairColor] = None  # Pour highlights/ombre
    length: float = 0.5  # 0-1
    volume: float = 0.5  # 0-1
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "style": self.style.value,
            "color": self.color.value,
            "secondary_color": self.secondary_color.value if self.secondary_color else None,
            "length": self.length,
            "volume": self.volume
        }


@dataclass
class Accessories:
    """Accessoires de l'avatar"""
    items: List[AccessoryType] = field(default_factory=list)
    glasses_style: Optional[str] = None  # round, square, cat-eye, etc.
    glasses_color: str = "#000000"
    hat_style: Optional[str] = None
    hat_color: str = "#333333"
    earring_style: Optional[str] = None
    special_items: List[str] = field(default_factory=list)  # Pour items custom
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "items": [item.value for item in self.items],
            "glasses_style": self.glasses_style,
            "glasses_color": self.glasses_color,
            "hat_style": self.hat_style,
            "hat_color": self.hat_color,
            "earring_style": self.earring_style,
            "special_items": self.special_items
        }


@dataclass
class BackgroundConfig:
    """Configuration du fond"""
    type: BackgroundType = BackgroundType.SOLID
    primary_color: str = "#6c5ce7"
    secondary_color: Optional[str] = None
    pattern: Optional[str] = None
    opacity: float = 1.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "primary_color": self.primary_color,
            "secondary_color": self.secondary_color,
            "pattern": self.pattern,
            "opacity": self.opacity
        }


@dataclass
class AvatarConfig:
    """Configuration complète d'un avatar"""
    id: UUID = field(default_factory=uuid4)
    user_id: Optional[UUID] = None
    name: str = "Mon Avatar"
    
    # Style principal
    style: AvatarStyle = AvatarStyle.CARTOON
    
    # Pour style Animal
    animal_type: Optional[AnimalType] = None
    
    # Pour style Mythique
    mythical_type: Optional[MythicalType] = None
    
    # Caractéristiques
    facial: FacialFeatures = field(default_factory=FacialFeatures)
    hair: HairConfig = field(default_factory=HairConfig)
    accessories: Accessories = field(default_factory=Accessories)
    background: BackgroundConfig = field(default_factory=BackgroundConfig)
    
    # Expression actuelle
    expression: Expression = Expression.NEUTRAL
    
    # Couleurs custom (pour certains styles)
    primary_color: str = "#6c5ce7"
    secondary_color: str = "#a29bfe"
    accent_color: str = "#fd79a8"
    
    # Métadonnées
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "user_id": str(self.user_id) if self.user_id else None,
            "name": self.name,
            "style": self.style.value,
            "animal_type": self.animal_type.value if self.animal_type else None,
            "mythical_type": self.mythical_type.value if self.mythical_type else None,
            "facial": self.facial.to_dict(),
            "hair": self.hair.to_dict(),
            "accessories": self.accessories.to_dict(),
            "background": self.background.to_dict(),
            "expression": self.expression.value,
            "primary_color": self.primary_color,
            "secondary_color": self.secondary_color,
            "accent_color": self.accent_color,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AvatarConfig':
        """Crée un AvatarConfig depuis un dictionnaire"""
        config = cls()
        config.id = UUID(data["id"]) if data.get("id") else uuid4()
        config.user_id = UUID(data["user_id"]) if data.get("user_id") else None
        config.name = data.get("name", "Mon Avatar")
        config.style = AvatarStyle(data.get("style", "cartoon"))
        
        if data.get("animal_type"):
            config.animal_type = AnimalType(data["animal_type"])
        if data.get("mythical_type"):
            config.mythical_type = MythicalType(data["mythical_type"])
        
        # Facial features
        if data.get("facial"):
            f = data["facial"]
            config.facial = FacialFeatures(
                face_shape=FaceShape(f.get("face_shape", "oval")),
                skin_tone=SkinTone(f.get("skin_tone", "medium")),
                eye_shape=EyeShape(f.get("eye_shape", "almond")),
                eye_color=EyeColor(f.get("eye_color", "brown")),
                nose_shape=NoseShape(f.get("nose_shape", "medium")),
                mouth_shape=MouthShape(f.get("mouth_shape", "medium"))
            )
        
        config.expression = Expression(data.get("expression", "neutral"))
        config.primary_color = data.get("primary_color", "#6c5ce7")
        config.secondary_color = data.get("secondary_color", "#a29bfe")
        
        return config


# ═══════════════════════════════════════════════════════════════════════════════
# AVATAR TEMPLATES
# ═══════════════════════════════════════════════════════════════════════════════

AVATAR_TEMPLATES = {
    # Realistic templates
    "professional_man": {
        "name": "Professional Man",
        "style": "realistic",
        "facial": {
            "face_shape": "square",
            "skin_tone": "medium",
            "eye_color": "brown",
            "facial_hair": "stubble"
        },
        "hair": {"style": "short", "color": "brown"},
        "accessories": {"items": ["glasses"]},
        "expression": "confident"
    },
    "professional_woman": {
        "name": "Professional Woman",
        "style": "realistic",
        "facial": {
            "face_shape": "oval",
            "skin_tone": "light_medium",
            "eye_color": "green"
        },
        "hair": {"style": "long", "color": "blonde"},
        "accessories": {"items": ["earrings"]},
        "expression": "confident"
    },
    
    # Cartoon templates
    "friendly_cartoon": {
        "name": "Friendly Cartoon",
        "style": "cartoon",
        "facial": {
            "face_shape": "round",
            "eye_shape": "wide",
            "eye_color": "blue"
        },
        "hair": {"style": "medium", "color": "brown"},
        "expression": "happy",
        "primary_color": "#74b9ff"
    },
    "anime_style": {
        "name": "Anime Character",
        "style": "cartoon",
        "facial": {
            "face_shape": "heart",
            "eye_shape": "wide",
            "eye_color": "purple"
        },
        "hair": {"style": "long", "color": "pink", "volume": 0.8},
        "expression": "happy",
        "primary_color": "#fd79a8"
    },
    
    # Animal templates
    "cool_cat": {
        "name": "Cool Cat",
        "style": "animal",
        "animal_type": "cat",
        "primary_color": "#fdcb6e",
        "accessories": {"items": ["sunglasses"]},
        "expression": "confident"
    },
    "wise_owl": {
        "name": "Wise Owl",
        "style": "animal",
        "animal_type": "owl",
        "primary_color": "#a29bfe",
        "accessories": {"items": ["glasses"]},
        "expression": "thinking"
    },
    "friendly_fox": {
        "name": "Friendly Fox",
        "style": "animal",
        "animal_type": "fox",
        "primary_color": "#e17055",
        "expression": "happy"
    },
    
    # Mythical templates
    "elegant_elf": {
        "name": "Elegant Elf",
        "style": "mythical",
        "mythical_type": "elf",
        "facial": {"skin_tone": "light", "eye_color": "green"},
        "hair": {"style": "long", "color": "blonde"},
        "primary_color": "#00b894"
    },
    "cyber_robot": {
        "name": "Cyber Robot",
        "style": "mythical",
        "mythical_type": "robot",
        "primary_color": "#00cec9",
        "secondary_color": "#636e72",
        "expression": "neutral"
    },
    "space_alien": {
        "name": "Space Alien",
        "style": "mythical",
        "mythical_type": "alien",
        "facial": {"skin_tone": "fantasy", "eye_color": "purple"},
        "primary_color": "#a29bfe"
    },
    
    # 3D templates
    "pixar_hero": {
        "name": "Pixar Hero",
        "style": "3d",
        "facial": {"face_shape": "oval", "eye_shape": "round"},
        "expression": "happy",
        "primary_color": "#0984e3"
    },
    
    # Minimal templates
    "minimal_circle": {
        "name": "Minimal Circle",
        "style": "minimal",
        "primary_color": "#6c5ce7",
        "expression": "neutral"
    },
    "geometric_avatar": {
        "name": "Geometric",
        "style": "minimal",
        "primary_color": "#00b894",
        "secondary_color": "#55efc4"
    }
}


# ═══════════════════════════════════════════════════════════════════════════════
# AVATAR SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class AvatarService:
    """
    Service de gestion des avatars.
    
    Fonctionnalités:
    - CRUD avatars
    - Génération SVG
    - Templates prédéfinis
    - Randomisation
    """
    
    def __init__(self, db_pool=None):
        self.db = db_pool
    
    # ═══════════════════════════════════════════════════════════════════════════
    # CRUD
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def create_avatar(
        self,
        user_id: UUID,
        config: AvatarConfig
    ) -> AvatarConfig:
        """Crée un nouvel avatar"""
        config.user_id = user_id
        config.created_at = datetime.utcnow()
        config.updated_at = datetime.utcnow()
        
        if self.db:
            await self.db.execute("""
                INSERT INTO avatars (id, user_id, name, config, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6)
            """,
                config.id,
                user_id,
                config.name,
                json.dumps(config.to_dict()),
                config.created_at,
                config.updated_at
            )
        
        return config
    
    async def get_avatar(self, avatar_id: UUID) -> Optional[AvatarConfig]:
        """Récupère un avatar par ID"""
        if not self.db:
            return None
        
        row = await self.db.fetchrow(
            "SELECT config FROM avatars WHERE id = $1",
            avatar_id
        )
        
        if row:
            return AvatarConfig.from_dict(json.loads(row["config"]))
        return None
    
    async def get_user_avatars(self, user_id: UUID) -> List[AvatarConfig]:
        """Récupère tous les avatars d'un utilisateur"""
        if not self.db:
            return []
        
        rows = await self.db.fetch(
            "SELECT config FROM avatars WHERE user_id = $1 ORDER BY updated_at DESC",
            user_id
        )
        
        return [AvatarConfig.from_dict(json.loads(row["config"])) for row in rows]
    
    async def update_avatar(
        self,
        avatar_id: UUID,
        updates: Dict[str, Any]
    ) -> Optional[AvatarConfig]:
        """Met à jour un avatar"""
        avatar = await self.get_avatar(avatar_id)
        if not avatar:
            return None
        
        # Appliquer les mises à jour
        for key, value in updates.items():
            if hasattr(avatar, key):
                setattr(avatar, key, value)
        
        avatar.updated_at = datetime.utcnow()
        
        if self.db:
            await self.db.execute("""
                UPDATE avatars SET config = $2, updated_at = $3 WHERE id = $1
            """,
                avatar_id,
                json.dumps(avatar.to_dict()),
                avatar.updated_at
            )
        
        return avatar
    
    async def delete_avatar(self, avatar_id: UUID) -> bool:
        """Supprime un avatar"""
        if self.db:
            result = await self.db.execute(
                "DELETE FROM avatars WHERE id = $1",
                avatar_id
            )
            return result == "DELETE 1"
        return False
    
    # ═══════════════════════════════════════════════════════════════════════════
    # TEMPLATES
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_templates(self, style: Optional[AvatarStyle] = None) -> List[Dict[str, Any]]:
        """Retourne les templates disponibles"""
        templates = []
        
        for key, template in AVATAR_TEMPLATES.items():
            if style and template.get("style") != style.value:
                continue
            
            templates.append({
                "key": key,
                **template
            })
        
        return templates
    
    def apply_template(self, template_key: str) -> Optional[AvatarConfig]:
        """Applique un template et retourne la config"""
        template = AVATAR_TEMPLATES.get(template_key)
        if not template:
            return None
        
        config = AvatarConfig()
        config.name = template.get("name", "Avatar")
        config.style = AvatarStyle(template.get("style", "cartoon"))
        
        if template.get("animal_type"):
            config.animal_type = AnimalType(template["animal_type"])
        if template.get("mythical_type"):
            config.mythical_type = MythicalType(template["mythical_type"])
        
        if template.get("facial"):
            f = template["facial"]
            if f.get("face_shape"):
                config.facial.face_shape = FaceShape(f["face_shape"])
            if f.get("skin_tone"):
                config.facial.skin_tone = SkinTone(f["skin_tone"])
            if f.get("eye_color"):
                config.facial.eye_color = EyeColor(f["eye_color"])
            if f.get("eye_shape"):
                config.facial.eye_shape = EyeShape(f["eye_shape"])
        
        if template.get("hair"):
            h = template["hair"]
            if h.get("style"):
                config.hair.style = HairStyle(h["style"])
            if h.get("color"):
                config.hair.color = HairColor(h["color"])
        
        if template.get("expression"):
            config.expression = Expression(template["expression"])
        
        if template.get("primary_color"):
            config.primary_color = template["primary_color"]
        if template.get("secondary_color"):
            config.secondary_color = template["secondary_color"]
        
        return config
    
    # ═══════════════════════════════════════════════════════════════════════════
    # RANDOMIZATION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_random(self, style: Optional[AvatarStyle] = None) -> AvatarConfig:
        """Génère un avatar aléatoire"""
        import random
        
        config = AvatarConfig()
        
        # Style aléatoire ou spécifié
        config.style = style or random.choice(list(AvatarStyle))
        
        # Caractéristiques aléatoires
        config.facial.face_shape = random.choice(list(FaceShape))
        config.facial.skin_tone = random.choice(list(SkinTone))
        config.facial.eye_shape = random.choice(list(EyeShape))
        config.facial.eye_color = random.choice(list(EyeColor))
        config.facial.nose_shape = random.choice(list(NoseShape))
        config.facial.mouth_shape = random.choice(list(MouthShape))
        
        config.hair.style = random.choice(list(HairStyle))
        config.hair.color = random.choice(list(HairColor))
        
        config.expression = random.choice(list(Expression))
        
        # Style spécifique
        if config.style == AvatarStyle.ANIMAL:
            config.animal_type = random.choice(list(AnimalType))
        elif config.style == AvatarStyle.MYTHICAL:
            config.mythical_type = random.choice(list(MythicalType))
        
        # Couleurs aléatoires
        config.primary_color = f"#{random.randint(0, 0xFFFFFF):06x}"
        config.secondary_color = f"#{random.randint(0, 0xFFFFFF):06x}"
        
        return config
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SVG GENERATION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_svg(self, config: AvatarConfig, size: int = 200) -> str:
        """
        Génère le SVG de l'avatar.
        
        Retourne une chaîne SVG complète.
        """
        
        # Couleurs de peau
        skin_colors = {
            SkinTone.LIGHT: "#ffeaa7",
            SkinTone.LIGHT_MEDIUM: "#fdcb6e",
            SkinTone.MEDIUM: "#e17055",
            SkinTone.MEDIUM_DARK: "#d35400",
            SkinTone.DARK: "#784212",
            SkinTone.FANTASY: config.primary_color
        }
        
        skin_color = skin_colors.get(config.facial.skin_tone, "#fdcb6e")
        
        # Couleurs des yeux
        eye_colors = {
            EyeColor.BROWN: "#5D4037",
            EyeColor.BLUE: "#2196F3",
            EyeColor.GREEN: "#4CAF50",
            EyeColor.HAZEL: "#795548",
            EyeColor.GRAY: "#607D8B",
            EyeColor.AMBER: "#FF8F00",
            EyeColor.RED: "#F44336",
            EyeColor.PURPLE: "#9C27B0"
        }
        
        eye_color = eye_colors.get(config.facial.eye_color, "#5D4037")
        
        # Couleurs des cheveux
        hair_colors = {
            HairColor.BLACK: "#212121",
            HairColor.BROWN: "#5D4037",
            HairColor.BLONDE: "#FDD835",
            HairColor.RED: "#E64A19",
            HairColor.GRAY: "#9E9E9E",
            HairColor.WHITE: "#FAFAFA",
            HairColor.BLUE: "#2196F3",
            HairColor.PINK: "#E91E63",
            HairColor.PURPLE: "#9C27B0",
            HairColor.GREEN: "#4CAF50"
        }
        
        hair_color = hair_colors.get(config.hair.color, "#5D4037")
        
        # Base SVG
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{config.background.primary_color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{config.background.secondary_color or config.background.primary_color};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="{size}" height="{size}" fill="url(#bgGrad)" rx="20"/>
  '''
        
        cx, cy = size // 2, size // 2
        
        if config.style == AvatarStyle.MINIMAL:
            # Style minimaliste - juste un cercle avec initiales
            svg += f'''
  <!-- Minimal Avatar -->
  <circle cx="{cx}" cy="{cy}" r="{size * 0.35}" fill="{config.primary_color}"/>
  <text x="{cx}" y="{cy + 8}" text-anchor="middle" fill="white" font-size="{size * 0.25}" font-family="Arial, sans-serif" font-weight="bold">
    {config.name[0].upper() if config.name else "?"}
  </text>
'''
        
        elif config.style == AvatarStyle.ANIMAL:
            # Avatar animal
            animal_emoji = {
                AnimalType.CAT: "🐱",
                AnimalType.DOG: "🐶",
                AnimalType.FOX: "🦊",
                AnimalType.WOLF: "🐺",
                AnimalType.BEAR: "🐻",
                AnimalType.RABBIT: "🐰",
                AnimalType.OWL: "🦉",
                AnimalType.LION: "🦁",
                AnimalType.TIGER: "🐯",
                AnimalType.PANDA: "🐼",
                AnimalType.DRAGON: "🐲"
            }.get(config.animal_type, "🐱")
            
            svg += f'''
  <!-- Animal Avatar -->
  <circle cx="{cx}" cy="{cy}" r="{size * 0.38}" fill="{config.primary_color}" opacity="0.3"/>
  <text x="{cx}" y="{cy + size * 0.12}" text-anchor="middle" font-size="{size * 0.5}">
    {animal_emoji}
  </text>
'''
        
        else:
            # Avatar humain/cartoon/3D/mythique
            head_radius = size * 0.32
            
            # Tête
            svg += f'''
  <!-- Head -->
  <ellipse cx="{cx}" cy="{cy}" rx="{head_radius}" ry="{head_radius * 1.1}" fill="{skin_color}"/>
'''
            
            # Cheveux (si pas chauve)
            if config.hair.style != HairStyle.NONE:
                hair_path = self._generate_hair_path(config.hair.style, cx, cy, head_radius)
                svg += f'''
  <!-- Hair -->
  <path d="{hair_path}" fill="{hair_color}"/>
'''
            
            # Yeux
            eye_offset = head_radius * 0.3
            eye_y = cy - head_radius * 0.1
            eye_size = head_radius * 0.15
            
            # Expression des yeux
            if config.expression == Expression.HAPPY:
                # Yeux souriants (arcs)
                svg += f'''
  <!-- Happy Eyes -->
  <path d="M {cx - eye_offset - eye_size} {eye_y} Q {cx - eye_offset} {eye_y - eye_size} {cx - eye_offset + eye_size} {eye_y}" stroke="{eye_color}" stroke-width="3" fill="none"/>
  <path d="M {cx + eye_offset - eye_size} {eye_y} Q {cx + eye_offset} {eye_y - eye_size} {cx + eye_offset + eye_size} {eye_y}" stroke="{eye_color}" stroke-width="3" fill="none"/>
'''
            elif config.expression == Expression.WINKING:
                # Un œil fermé, un ouvert
                svg += f'''
  <!-- Winking Eyes -->
  <circle cx="{cx - eye_offset}" cy="{eye_y}" r="{eye_size}" fill="white"/>
  <circle cx="{cx - eye_offset}" cy="{eye_y}" r="{eye_size * 0.5}" fill="{eye_color}"/>
  <path d="M {cx + eye_offset - eye_size} {eye_y} L {cx + eye_offset + eye_size} {eye_y}" stroke="#333" stroke-width="3"/>
'''
            else:
                # Yeux normaux
                svg += f'''
  <!-- Eyes -->
  <ellipse cx="{cx - eye_offset}" cy="{eye_y}" rx="{eye_size}" ry="{eye_size * 1.2}" fill="white"/>
  <ellipse cx="{cx + eye_offset}" cy="{eye_y}" rx="{eye_size}" ry="{eye_size * 1.2}" fill="white"/>
  <circle cx="{cx - eye_offset}" cy="{eye_y}" r="{eye_size * 0.5}" fill="{eye_color}"/>
  <circle cx="{cx + eye_offset}" cy="{eye_y}" r="{eye_size * 0.5}" fill="{eye_color}"/>
  <circle cx="{cx - eye_offset + 2}" cy="{eye_y - 2}" r="{eye_size * 0.15}" fill="white"/>
  <circle cx="{cx + eye_offset + 2}" cy="{eye_y - 2}" r="{eye_size * 0.15}" fill="white"/>
'''
            
            # Bouche selon expression
            mouth_y = cy + head_radius * 0.35
            mouth_width = head_radius * 0.4
            
            if config.expression in [Expression.HAPPY, Expression.LAUGHING]:
                svg += f'''
  <!-- Happy Mouth -->
  <path d="M {cx - mouth_width} {mouth_y} Q {cx} {mouth_y + mouth_width * 0.8} {cx + mouth_width} {mouth_y}" stroke="#333" stroke-width="3" fill="none"/>
'''
            elif config.expression == Expression.SAD:
                svg += f'''
  <!-- Sad Mouth -->
  <path d="M {cx - mouth_width} {mouth_y + 10} Q {cx} {mouth_y - mouth_width * 0.5} {cx + mouth_width} {mouth_y + 10}" stroke="#333" stroke-width="3" fill="none"/>
'''
            else:
                svg += f'''
  <!-- Neutral Mouth -->
  <line x1="{cx - mouth_width * 0.7}" y1="{mouth_y}" x2="{cx + mouth_width * 0.7}" y2="{mouth_y}" stroke="#333" stroke-width="3"/>
'''
            
            # Accessoires
            if AccessoryType.GLASSES in config.accessories.items:
                svg += f'''
  <!-- Glasses -->
  <circle cx="{cx - eye_offset}" cy="{eye_y}" r="{eye_size * 1.5}" fill="none" stroke="#333" stroke-width="2"/>
  <circle cx="{cx + eye_offset}" cy="{eye_y}" r="{eye_size * 1.5}" fill="none" stroke="#333" stroke-width="2"/>
  <line x1="{cx - eye_offset + eye_size * 1.5}" y1="{eye_y}" x2="{cx + eye_offset - eye_size * 1.5}" y2="{eye_y}" stroke="#333" stroke-width="2"/>
'''
        
        svg += '</svg>'
        return svg
    
    def _generate_hair_path(
        self,
        style: HairStyle,
        cx: float,
        cy: float,
        head_radius: float
    ) -> str:
        """Génère le path SVG pour les cheveux"""
        
        top = cy - head_radius * 1.1
        left = cx - head_radius
        right = cx + head_radius
        
        if style == HairStyle.SHORT:
            return f"M {left} {cy - head_radius * 0.3} Q {cx} {top - 10} {right} {cy - head_radius * 0.3}"
        
        elif style == HairStyle.MEDIUM:
            return f"M {left - 5} {cy} Q {left - 10} {top} {cx} {top - 15} Q {right + 10} {top} {right + 5} {cy}"
        
        elif style == HairStyle.LONG:
            return f"M {left - 10} {cy + head_radius * 0.8} Q {left - 15} {top} {cx} {top - 20} Q {right + 15} {top} {right + 10} {cy + head_radius * 0.8}"
        
        elif style == HairStyle.CURLY:
            # Cheveux bouclés avec des cercles
            return f"M {left} {cy - head_radius * 0.2} Q {left - 10} {top + 10} {cx - head_radius * 0.5} {top} Q {cx} {top - 20} {cx + head_radius * 0.5} {top} Q {right + 10} {top + 10} {right} {cy - head_radius * 0.2}"
        
        elif style == HairStyle.PONYTAIL:
            return f"M {left} {cy - head_radius * 0.3} Q {cx} {top - 10} {right} {cy - head_radius * 0.3} L {right + 20} {cy + head_radius} L {right + 10} {cy + head_radius * 0.5} Z"
        
        elif style == HairStyle.BUN:
            return f"M {left} {cy - head_radius * 0.3} Q {cx} {top - 10} {right} {cy - head_radius * 0.3} M {cx - 15} {top - 15} A 20 20 0 1 1 {cx + 15} {top - 15}"
        
        else:
            # Default medium
            return f"M {left} {cy - head_radius * 0.2} Q {cx} {top - 10} {right} {cy - head_radius * 0.2}"
    
    def generate_data_url(self, config: AvatarConfig, size: int = 200) -> str:
        """Génère une data URL pour l'avatar (utilisable dans img src)"""
        svg = self.generate_svg(config, size)
        encoded = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
        return f"data:image/svg+xml;base64,{encoded}"
    
    def get_avatar_hash(self, config: AvatarConfig) -> str:
        """Génère un hash unique pour la config (utile pour le cache)"""
        config_str = json.dumps(config.to_dict(), sort_keys=True)
        return hashlib.md5(config_str.encode()).hexdigest()


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY
# ═══════════════════════════════════════════════════════════════════════════════

_service_instance: Optional[AvatarService] = None

def get_avatar_service(db_pool=None) -> AvatarService:
    """Factory pour le service d'avatars"""
    global _service_instance
    if _service_instance is None:
        _service_instance = AvatarService(db_pool)
    return _service_instance
