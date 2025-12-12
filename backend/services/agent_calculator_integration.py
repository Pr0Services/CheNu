"""
CHE·NU Construction - Intégration Agents ↔ Calculateurs
Les agents peuvent appeler les calculateurs comme outils
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Callable
from enum import Enum
import json
from datetime import datetime

# ============================================
# CALCULATEURS COMME OUTILS
# ============================================

class CalculatorTool:
    """Base class pour tous les calculateurs"""
    
    def __init__(self, tool_id: str, name: str, description: str):
        self.tool_id = tool_id
        self.name = name
        self.description = description
        self.usage_count = 0
        self.last_used = None
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """À implémenter dans les sous-classes"""
        raise NotImplementedError
    
    def log_usage(self, agent_id: str, params: Dict, result: Dict):
        """Log l'utilisation de l'outil"""
        self.usage_count += 1
        self.last_used = datetime.now()
        return {
            "tool_id": self.tool_id,
            "agent_id": agent_id,
            "timestamp": self.last_used.isoformat(),
            "params": params,
            "result": result
        }


class ConcreteCalculator(CalculatorTool):
    """Calculateur de béton"""
    
    CONCRETE_PRICES = {
        "15 MPa": 180,
        "20 MPa": 195,
        "25 MPa": 210,
        "30 MPa": 225,
        "35 MPa": 245,
    }
    
    def __init__(self):
        super().__init__(
            tool_id="concrete_calculator",
            name="Calculateur Béton",
            description="Calcule volume, quantité et coût du béton"
        )
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        length = float(params.get("length", 0))
        width = float(params.get("width", 0))
        thickness_mm = float(params.get("thickness", 0))
        concrete_type = params.get("type", "25 MPa")
        waste_percent = float(params.get("waste", 10))
        
        thickness_m = thickness_mm / 1000
        volume = length * width * thickness_m
        volume_with_waste = volume * (1 + waste_percent / 100)
        price_per_m3 = self.CONCRETE_PRICES.get(concrete_type, 210)
        total_cost = volume_with_waste * price_per_m3
        bags_80lb = int(volume_with_waste * 45) + 1
        
        return {
            "status": "success",
            "data": {
                "volume_net_m3": round(volume, 2),
                "volume_with_waste_m3": round(volume_with_waste, 2),
                "bags_80lb": bags_80lb,
                "concrete_type": concrete_type,
                "price_per_m3": price_per_m3,
                "total_cost_cad": round(total_cost, 2),
                "waste_percent": waste_percent
            },
            "summary": f"Volume: {round(volume_with_waste, 2)} m³ ({concrete_type}) = ${round(total_cost, 2)} CAD"
        }


class LoadCalculator(CalculatorTool):
    """Calculateur de charges structurales"""
    
    DEAD_LOADS = {
        "floor": 3.5,
        "roof_flat": 2.0,
        "roof_sloped": 1.5,
        "partition": 1.0
    }
    
    LIVE_LOADS = {
        "residential": 1.9,
        "office": 2.4,
        "commercial": 4.8,
        "storage": 7.2,
        "assembly": 4.8,
        "industrial": 6.0
    }
    
    def __init__(self):
        super().__init__(
            tool_id="load_calculator",
            name="Calculateur Charges",
            description="Calcule les charges mortes et vives"
        )
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        area = float(params.get("area", 0))
        floors = int(params.get("floors", 1))
        usage = params.get("usage", "residential")
        roof_type = params.get("roof_type", "flat")
        
        roof_dead = self.DEAD_LOADS["roof_flat"] if roof_type == "flat" else self.DEAD_LOADS["roof_sloped"]
        floor_dead = self.DEAD_LOADS["floor"] + self.DEAD_LOADS["partition"]
        live_load_per_m2 = self.LIVE_LOADS.get(usage, 1.9)
        
        total_dead = (floor_dead * (floors - 1) + roof_dead) * area
        total_live = live_load_per_m2 * area * floors
        total_load = total_dead + total_live
        
        return {
            "status": "success",
            "data": {
                "area_m2": area,
                "floors": floors,
                "usage_type": usage,
                "dead_load_kn": round(total_dead, 1),
                "live_load_kn": round(total_live, 1),
                "total_load_kn": round(total_load, 1),
                "load_per_m2_kn": round(total_load / area, 2) if area > 0 else 0
            },
            "summary": f"Charge totale: {round(total_load, 1)} kN ({round(total_load / area, 2)} kN/m²)"
        }


class PaintCalculator(CalculatorTool):
    """Calculateur de peinture"""
    
    def __init__(self):
        super().__init__(
            tool_id="paint_calculator",
            name="Calculateur Peinture",
            description="Calcule surface et quantité de peinture"
        )
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        room_length = float(params.get("room_length", 0))
        wall_height = float(params.get("wall_height", 2.4))
        coats = int(params.get("coats", 2))
        doors = int(params.get("doors", 0))
        windows = int(params.get("windows", 0))
        
        wall_area = room_length * wall_height * 4
        door_area = doors * 1.9
        window_area = windows * 1.5
        net_area = wall_area - door_area - window_area
        total_area = net_area * coats
        liters = total_area / 10
        gallons = liters / 3.78
        cans_4l = int(liters / 4) + 1
        
        return {
            "status": "success",
            "data": {
                "wall_area_m2": round(wall_area, 1),
                "net_area_m2": round(net_area, 1),
                "total_area_m2": round(total_area, 1),
                "liters_required": round(liters, 1),
                "gallons_required": round(gallons, 1),
                "cans_4l": cans_4l,
                "coats": coats
            },
            "summary": f"Surface: {round(total_area, 1)} m² = {round(liters, 1)} L ({cans_4l} contenants 4L)"
        }


class LumberCalculator(CalculatorTool):
    """Calculateur de bois de charpente"""
    
    LUMBER_PRICES = {
        "2x4": 5.50,
        "2x6": 8.50,
        "2x8": 11.00,
        "2x10": 14.50,
        "2x12": 18.00
    }
    
    def __init__(self):
        super().__init__(
            tool_id="lumber_calculator",
            name="Calculateur Bois",
            description="Calcule quantité de bois de charpente"
        )
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        length = float(params.get("length", 0))
        width = float(params.get("width", 0))
        spacing_inches = int(params.get("spacing", 16))
        lumber_type = params.get("lumber_type", "2x10")
        
        spacing_m = spacing_inches * 0.0254
        joists = int(length / spacing_m) + 1
        total_linear_feet = joists * (width * 3.28084)
        boards_12ft = int(total_linear_feet / 12) + 1
        price_per_board = self.LUMBER_PRICES.get(lumber_type, 14.50)
        total_cost = boards_12ft * price_per_board
        
        return {
            "status": "success",
            "data": {
                "area_m2": round(length * width, 1),
                "joists_count": joists,
                "linear_feet": round(total_linear_feet, 0),
                "boards_12ft": boards_12ft,
                "lumber_type": lumber_type,
                "price_per_board": price_per_board,
                "total_cost_cad": round(total_cost, 2)
            },
            "summary": f"{boards_12ft} planches {lumber_type} (12') = ${round(total_cost, 2)} CAD"
        }


class RebarCalculator(CalculatorTool):
    """Calculateur d'armature"""
    
    REBAR_WEIGHTS = {
        "10M": 0.785,
        "15M": 1.570,
        "20M": 2.355,
        "25M": 3.925,
        "30M": 5.495
    }
    
    def __init__(self):
        super().__init__(
            tool_id="rebar_calculator",
            name="Calculateur Armature",
            description="Calcule quantité d'acier d'armature"
        )
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        length = float(params.get("length", 0))
        width = float(params.get("width", 0))
        spacing = float(params.get("spacing", 0.15))
        bar_size = params.get("bar_size", "15M")
        layers = int(params.get("layers", 1))
        
        bars_length = int(width / spacing) + 1
        bars_width = int(length / spacing) + 1
        total_bars = (bars_length + bars_width) * layers
        
        linear_m = (bars_length * length + bars_width * width) * layers
        weight_per_m = self.REBAR_WEIGHTS.get(bar_size, 1.570)
        total_weight = linear_m * weight_per_m
        
        return {
            "status": "success",
            "data": {
                "area_m2": round(length * width, 1),
                "total_bars": total_bars,
                "linear_meters": round(linear_m, 1),
                "bar_size": bar_size,
                "weight_kg": round(total_weight, 1),
                "weight_per_m": weight_per_m
            },
            "summary": f"{total_bars} barres {bar_size} = {round(total_weight, 1)} kg"
        }


# ============================================
# REGISTRE DES CALCULATEURS
# ============================================

class CalculatorRegistry:
    """Registre central de tous les calculateurs"""
    
    def __init__(self):
        self.calculators: Dict[str, CalculatorTool] = {}
        self._register_defaults()
    
    def _register_defaults(self):
        """Enregistre les calculateurs par défaut"""
        defaults = [
            ConcreteCalculator(),
            LoadCalculator(),
            PaintCalculator(),
            LumberCalculator(),
            RebarCalculator()
        ]
        for calc in defaults:
            self.register(calc)
    
    def register(self, calculator: CalculatorTool):
        """Enregistre un calculateur"""
        self.calculators[calculator.tool_id] = calculator
    
    def get(self, tool_id: str) -> Optional[CalculatorTool]:
        """Récupère un calculateur"""
        return self.calculators.get(tool_id)
    
    def list_all(self) -> List[Dict]:
        """Liste tous les calculateurs"""
        return [
            {
                "id": c.tool_id,
                "name": c.name,
                "description": c.description,
                "usage_count": c.usage_count
            }
            for c in self.calculators.values()
        ]


# ============================================
# INTÉGRATION AGENT ↔ CALCULATEUR
# ============================================

@dataclass
class AgentToolCall:
    """Représente un appel d'outil par un agent"""
    agent_id: str
    tool_id: str
    params: Dict[str, Any]
    result: Optional[Dict] = None
    timestamp: datetime = field(default_factory=datetime.now)
    success: bool = False


class AgentCalculatorBridge:
    """Pont entre les agents et les calculateurs"""
    
    def __init__(self):
        self.registry = CalculatorRegistry()
        self.call_history: List[AgentToolCall] = []
    
    def call_calculator(
        self, 
        agent_id: str, 
        tool_id: str, 
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Permet à un agent d'appeler un calculateur
        
        Args:
            agent_id: ID de l'agent appelant
            tool_id: ID du calculateur
            params: Paramètres du calcul
            
        Returns:
            Résultat du calcul
        """
        call = AgentToolCall(
            agent_id=agent_id,
            tool_id=tool_id,
            params=params
        )
        
        calculator = self.registry.get(tool_id)
        if not calculator:
            call.result = {"status": "error", "message": f"Calculateur '{tool_id}' non trouvé"}
            call.success = False
        else:
            try:
                result = calculator.execute(params)
                calculator.log_usage(agent_id, params, result)
                call.result = result
                call.success = True
            except Exception as e:
                call.result = {"status": "error", "message": str(e)}
                call.success = False
        
        self.call_history.append(call)
        return call.result
    
    def get_available_tools(self, agent_id: str) -> List[Dict]:
        """Retourne les outils disponibles pour un agent"""
        # Ici on pourrait filtrer selon les permissions de l'agent
        return self.registry.list_all()
    
    def get_agent_history(self, agent_id: str) -> List[Dict]:
        """Historique des appels d'un agent"""
        return [
            {
                "tool_id": call.tool_id,
                "params": call.params,
                "result": call.result,
                "timestamp": call.timestamp.isoformat(),
                "success": call.success
            }
            for call in self.call_history
            if call.agent_id == agent_id
        ]


# ============================================
# AGENT AVEC CALCULATEURS INTÉGRÉS
# ============================================

class ConstructionAgent:
    """Agent de construction avec accès aux calculateurs"""
    
    def __init__(
        self,
        agent_id: str,
        name: str,
        role: str,
        allowed_tools: List[str],
        bridge: AgentCalculatorBridge
    ):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.allowed_tools = allowed_tools
        self.bridge = bridge
    
    def use_calculator(self, tool_id: str, params: Dict) -> Dict:
        """Utilise un calculateur"""
        if tool_id not in self.allowed_tools:
            return {
                "status": "error",
                "message": f"Agent '{self.name}' n'a pas accès à '{tool_id}'"
            }
        return self.bridge.call_calculator(self.agent_id, tool_id, params)
    
    def get_my_tools(self) -> List[Dict]:
        """Liste les outils disponibles pour cet agent"""
        all_tools = self.bridge.get_available_tools(self.agent_id)
        return [t for t in all_tools if t["id"] in self.allowed_tools]


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

if __name__ == "__main__":
    # Créer le pont
    bridge = AgentCalculatorBridge()
    
    # Créer un agent estimateur
    estimator = ConstructionAgent(
        agent_id="cost_estimator_001",
        name="Estimateur Principal",
        role="Cost Estimator",
        allowed_tools=[
            "concrete_calculator",
            "rebar_calculator",
            "lumber_calculator",
            "paint_calculator"
        ],
        bridge=bridge
    )
    
    # Créer un agent ingénieur
    engineer = ConstructionAgent(
        agent_id="structural_eng_001",
        name="Ingénieur Structure",
        role="Structural Engineer",
        allowed_tools=[
            "load_calculator",
            "concrete_calculator",
            "rebar_calculator"
        ],
        bridge=bridge
    )
    
    print("=" * 60)
    print("CHE·NU - Test Intégration Agents ↔ Calculateurs")
    print("=" * 60)
    
    # Test 1: Estimateur calcule le béton
    print("\n📋 Estimateur calcule le béton pour une dalle:")
    result = estimator.use_calculator("concrete_calculator", {
        "length": 10,
        "width": 8,
        "thickness": 150,
        "type": "25 MPa",
        "waste": 10
    })
    print(f"   Résultat: {result['summary']}")
    
    # Test 2: Ingénieur calcule les charges
    print("\n🔩 Ingénieur calcule les charges:")
    result = engineer.use_calculator("load_calculator", {
        "area": 200,
        "floors": 2,
        "usage": "commercial",
        "roof_type": "flat"
    })
    print(f"   Résultat: {result['summary']}")
    
    # Test 3: Estimateur calcule l'armature
    print("\n🔗 Estimateur calcule l'armature:")
    result = estimator.use_calculator("rebar_calculator", {
        "length": 10,
        "width": 8,
        "spacing": 0.15,
        "bar_size": "15M",
        "layers": 2
    })
    print(f"   Résultat: {result['summary']}")
    
    # Test 4: Accès refusé
    print("\n⛔ Ingénieur tente d'utiliser calculateur peinture:")
    result = engineer.use_calculator("paint_calculator", {})
    print(f"   Résultat: {result['message']}")
    
    # Historique
    print("\n📊 Historique de l'estimateur:")
    history = bridge.get_agent_history("cost_estimator_001")
    for h in history:
        print(f"   - {h['tool_id']}: {'✅' if h['success'] else '❌'}")
    
    print("\n" + "=" * 60)
    print("✅ Intégration réussie!")
