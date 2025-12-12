# CHE·NU — Structure Figma UI Officielle
> Version: 1.0 | Plan de prototypage complet

---

## 📚 Pages Figma (9 pages)

```
PAGES
1. 00 – Foundations
2. 01 – Components
3. 02 – Layouts & Templates
4. 03 – My Office & Spheres
5. 04 – Tasks & Workspace Mode
6. 05 – Universe View
7. 06 – XR Handoff & Portals
8. 07 – Agent Console (Admin)
9. 08 – Design Tokens & Docs
```

---

## 🎨 Page 00 – Foundations

### FND/Colors
| Category | Usage |
|----------|-------|
| Palette CHE·NU | Fondation system |
| Palette Spheres | Business, Personal, Creative, Scholar... |
| Semantic colors | success / warning / info / neutral |

### FND/Typography
| Style | Name |
|-------|------|
| H1 | TXT/H1 |
| H2 | TXT/H2 |
| H3 | TXT/H3 |
| Body | TXT/Body |
| Caption | TXT/Caption |

### FND/Grid & Spacing
| Breakpoint | Columns |
|------------|---------|
| Desktop | 12-col |
| Tablet | 8-col |
| Mobile | 4-col |

**Spacings**: 4 / 8 / 12 / 16 / 24 / 32 / 48

---

## 🧩 Page 01 – Components

### Naming Convention
Tous les components avec préfixe `C/`

```
C/Button/Primary
C/Button/Secondary
C/Input/Text
C/Input/TextArea
C/Select/Single
C/Select/Multi
C/Tag/Sphere
C/Card/Task
C/Card/Sphere
C/Chip/Agent
C/Toast/Notification
C/Sidebar/NavItem
C/Topbar/Main
C/Icon/24/*
```

### Component Specs
- **Variants**: default / hover / active / disabled
- **Auto-layout**: enabled
- **Constraints**: responsive

---

## 📐 Page 02 – Layouts & Templates

### LAY/Login
- Email / Password
- Sign in / Sign up
- Forgot Password

### LAY/MyOffice
- **Top bar**: logo CHE·NU / user menu
- **Left panel**: Spheres list
- **Main**: "My Office" overview (cards: Tasks, Projects, XR, Agents, Replay)

### LAY/TaskWorkspace
- **Header**: Task title, sphere, status
- **Tabs**: Overview / Subtasks / Timeline / XR / Notes
- **Content**: board ou form

### LAY/UniverseView
- Central big orb (User)
- Orbiting Spheres
- Right panel: Selected sphere info

### LAY/AgentConsole
- **Table**: agents, roles, status, last run
- **Right panel**: agent details

---

## 🏠 Page 03 – My Office & Spheres

### Frames
```
UI/MyOffice/Desktop
UI/MyOffice/Tablet
UI/MyOffice/Mobile
```

### Content Grid
- "Mes Sphères"
- "Dernières tâches"
- "Dernières décisions"
- "Replays récents"
- "Accès XR (portail)"

### Sphere Dashboards
```
UI/SphereDashboard/Business
UI/SphereDashboard/Personal
UI/SphereDashboard/Creative
```
> Même layout, couleur différente selon sphère

---

## 📋 Page 04 – Tasks & Workspace Mode

### UI/Task/Compact (top)
- Résumé rapide: titre, status, agents suggérés

### UI/Task/Workspace/Board
- Kanban: To do / Doing / Done
- Chaque carte = sous-tâche

### UI/Task/Workspace/Timeline
- Timeline horizontale (Thread Weaver style)
- Milestones, décisions, replays

### UI/Task/Workspace/SplitView
| Left | Right |
|------|-------|
| Board ou liste | Panneau "Nova / Agents" |
| | Suggestions |
| | Plan proposé |
| | Logs d'exécution |

---

## 🌌 Page 05 – Universe View

### UI/UniverseView/Default
- Grand cercle central (User)
- Orbites: Spheres
- Ligne lumineuse pour liens inter-sphères

### UI/UniverseView/FocusedSphere
- Zoom sur une sphère
- Liste des projets & threads

---

## 🥽 Page 06 – XR Handoff & Portals

### UI/XRPortal/Entry
- Carte "Entrer en XR"
- Infos: Room type (Decision / Brainstorm / Review…)
- Bouton "Open in XR"
- Preview: mini-capture du room

### UI/XRTimelineReplay
- Inspecter un replay XR depuis interface 2D
- Timeline + boutons "Revoir dans XR / Voir résumé 2D"

---

## 🤖 Page 07 – Agent Console

### UI/AgentConsole/List
| Column | Content |
|--------|---------|
| Nom | Agent name |
| Rôle | Agent role |
| Spécialité | Specialization |
| Sphère | Assigned sphere |
| Dernière exécution | Last run |
| Status | Active/Inactive |

### UI/AgentConsole/AgentDetail
- Section config (prompt système + paramètres)
- Section logs (dernières exécutions)
- Section "suggested improvements"

---

## 📖 Page 08 – Design Tokens & Docs

Documentation des tokens et conventions pour handoff développeurs.

---

**CHE·NU FIGMA STRUCTURE — READY FOR DESIGN** 🎨
