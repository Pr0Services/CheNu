export type Sphere = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const SPHERES: Sphere[] = [
  { id: "personal", name: "Personnel", emoji: "👤", description: "Identité, préférences, privé" },
  { id: "methodology", name: "Méthodologie", emoji: "🧠", description: "Processus et décisions" },
  { id: "business", name: "Business", emoji: "🏢", description: "Opérations et projets" },
  { id: "scholar", name: "Scholar", emoji: "🎓", description: "Savoir et apprentissage" },
  { id: "creative_studio", name: "Creative Studio", emoji: "🎨", description: "Création multimédia" },
  { id: "social_media", name: "Social & Media", emoji: "🎉", description: "Échange social" },
  { id: "xr_meeting", name: "XR / Meeting", emoji: "🕶️", description: "Présence et réunions" },
  { id: "institutions", name: "Institutions / Government", emoji: "🏛️", description: "Gouvernance" },
];
