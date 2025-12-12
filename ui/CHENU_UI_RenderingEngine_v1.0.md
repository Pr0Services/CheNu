# CHE·NU — UI RENDERING ENGINE
**VERSION:** UI.v1.0  
**MODE:** DETERMINISTIC / NON-MANIPULATIVE

---

## ARCHITECTURE ⚡

```
DATA → PARSER → LAYOUT → STYLE → RENDERER → VIEW
```

---

## MODULES ⚡

### 1. PARSER ⚡
| Fonction | Input → Output |
|----------|----------------|
| `parseThreads()` | Threads → Nodes/Edges |
| `parseMemory()` | Memory → Entries |

### 2. LAYOUT CALCULATOR ⚡
| Layout | Algorithm |
|--------|-----------|
| `LINEAR` | Horizontal |
| `GRAPH` | Force-directed |
| `ORBITAL` | Circular |
| `CONSTELLATION` | K-means |

### 3. STYLE RESOLVER ⚡
| Type | Color |
|------|-------|
| `factual` | `#4A90D9` Blue |
| `decision` | `#7B68EE` Purple |
| `context` | `#50C878` Green |
| `temporal` | `#FFB347` Orange |

### 4. RENDERER ⚡
| Target | Technology |
|--------|------------|
| **2D** | Canvas / SVG |
| **3D** | Three.js |
| **XR** | WebXR |

---

## RÈGLES NON-MANIPULATIVE ⚡

| Règle | Status |
|-------|--------|
| **No size = importance** | ✅ |
| **Neutral colors** | ✅ |
| **Equal spacing** | ✅ |
| **No forced focus** | ✅ |

---

**END — UI RENDERING ENGINE**
