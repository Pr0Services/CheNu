const fs = require("fs");
const path = require("path");

const root = "che-nu-all";

// ----------- Spheres (coller le contenu complet entre les backticks) -----------
const spheres = [
  {
    name: "SpherePersonnel.md",
    folder: "personnel",
    content: `
# SPHERE_PERSONNEL
## 1. ROLE DE LA SPHÈRE
La sphère Personnel représente le noyau identitaire de l’utilisateur.
...
(COLLE ICI TOUT le contenu de Sphere Personnel)
`
  },
  {
    name: "SphereBusiness.md",
    folder: "business",
    content: `
# SPHERE_BUSINESS
## 1. RÔLE DE LA SPHÈRE
La sphère Business représente l’ensemble des activités professionnelles de l’utilisateur :
...
(COLLE ICI TOUT le contenu de Sphere Business)
`
  },
  {
    name: "SphereScholar.md",
    folder: "scholar",
    content: `
# SPHERE_SCHOLAR
## 1. RÔLE DE LA SPHÈRE
La sphère Scholar est le cerveau cognitif du système Che·Nu.
...
(COLLE ICI TOUT le contenu de Sphere Scholar)
`
  },
  {
    name: "SphereCreativeStudio.md",
    folder: "creative",
    content: `
# SPHERE_CREATIVE_STUDIO
## 1. RÔLE DE LA SPHÈRE
La sphère Creative Studio est l’espace de création, production et expérimentation artistique de Che·Nu.
...
(COLLE ICI TOUT le contenu de Sphere Creative Studio)
`
  },
  {
    name: "SphereSocialMedia.md",
    folder: "social",
    content: `
# SPHERE_SOCIAL_MEDIA
## 1. RÔLE DE LA SPHÈRE
La sphère Social & Media gère la présence publique, la diffusion de contenu et les interactions sociales de l’utilisateur ou de ses organisations.
...
(COLLE ICI TOUT le contenu de Sphere Social Media)
`
  },
  {
    name: "SphereMethodology.md",
    folder: "methodology",
    content: `
# SPHERE_METHODOLOGY
## 1. RÔLE DE LA SPHÈRE
La sphère Methodology gouverne la manière dont les tâches sont effectuées, la logique de découpage des problèmes, la sélection des stratégies optimales, la coordination multi-agents, la réduction des coûts (tokens, temps, erreurs), l’adaptation continue selon les résultats.
...
(COLLE ICI TOUT le contenu de Sphere Methodology)
`
  },
  {
    name: "SphereInstitutions.md",
    folder: "institutions",
    content: `
# SPHERE_INSTITUTIONS
## 1. RÔLE DE LA SPHÈRE
La sphère Institutions est le pilier juridique, éthique et réglementaire du système Che·Nu.
...
(COLLE ICI TOUT le contenu de Sphere Institutions)
`
  },
  {
    name: "SphereXR.md",
    folder: "xr",
    content: `
# SPHERE_XR
## 1. RÔLE DE LA SPHÈRE
La sphère XR est la couche spatiale vivante de Che·Nu.
...
(COLLE ICI TOUT le contenu de Sphere XR)
`
  },
  {
    name: "SphereIALab.md",
    folder: "ia-lab",
    content: `
# SPHERE_IA_LAB
## 1. RÔLE DE LA SPHÈRE
La sphère IA Lab est l’espace sécurisé et contrôlé dédié à l’expérimentation avec l’IA, l’apprentissage spécifique, la création d’agents spécialisés, l’analyse des performances et dérives, la recherche appliquée IA.
...
(COLLE ICI TOUT le contenu de Sphere IA Lab)
`
  },
  {
    name: "SphereMyTeam.md",
    folder: "my-team",
    content: `
# SPHERE_MY_TEAM
## 1. RÔLE DE LA SPHÈRE
La sphère My Team représente la dimension collective de Che·Nu.
...
(COLLE ICI TOUT le contenu de Sphere My Team)
`
  }
];

// ----------- System Documents (coller le contenu complet entre les backticks) -----------
const systemDocs = [
  {
    folder: "universe",
    name: "UNIVERSE_VIEW_FINAL.md",
    content: `
# UNIVERSE_VIEW_FINAL
## 1. OBJECTIF CENTRAL
Universe View est la représentation spatiale unifiée de tout le Che·Nu.
...
(COLLE ICI TOUT le contenu Universe View)
`
  },
  {
    folder: "",
    name: "CODE_FREEZE_DIRECTIVE.md",
    content: `
# CHE·NU — OFFICIAL CODE FREEZE DIRECTIVE (FOR COPILOT)
## STATUS
🚨 CODE FREEZE — ACTIVE (FOUNDATION LOCKED)
...
(COLLE ICI TOUT le contenu du code freeze)
`
  }
  // Ajoute ici d'autres documents système si besoin
];

// ----------- Génération de la structure et écriture des fichiers -----------

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(root);

// Spheres
ensureDir(path.join(root, "spheres"));
spheres.forEach(sphere => {
  const sphereDir = path.join(root, "spheres", sphere.folder);
  ensureDir(sphereDir);
  fs.writeFileSync(path.join(sphereDir, sphere.name), sphere.content.trim(), "utf8");
});

// System Docs
systemDocs.forEach(doc => {
  const docDir = doc.folder ? path.join(root, doc.folder) : root;
  ensureDir(docDir);
  fs.writeFileSync(path.join(docDir, doc.name), doc.content.trim(), "utf8");
});

console.log("✅ CHE·NU canonical structure and documents generated in 'che-nu-all'.");