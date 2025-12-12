import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// The Eight Spheres
const SPHERES = [
  { id: 'personal', name: 'Personnel', emoji: '🔐', color: '#DC2626', orbit: 1 },
  { id: 'methodology', name: 'Methodology', emoji: '📊', color: '#2563EB', orbit: 1 },
  { id: 'business', name: 'Business', emoji: '💼', color: '#059669', orbit: 2 },
  { id: 'scholar', name: 'Scholar', emoji: '📚', color: '#7C3AED', orbit: 2 },
  { id: 'creative_studio', name: 'Creative Studio', emoji: '🎨', color: '#DB2777', orbit: 2 },
  { id: 'xr_meeting', name: 'XR / Meeting', emoji: '🥽', color: '#0891B2', orbit: 3 },
  { id: 'social_media', name: 'Social & Media', emoji: '📱', color: '#EA580C', orbit: 3 },
  { id: 'institutions', name: 'Institutions', emoji: '🏛️', color: '#4B5563', orbit: 3 }
]

function App() {
  const [selectedSphere, setSelectedSphere] = useState(null)
  const [laws, setLaws] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch laws from API
    fetch('/api/laws')
      .then(res => res.json())
      .then(data => {
        setLaws(data.laws || [])
        setLoading(false)
      })
      .catch(() => {
        // Fallback if API not running
        setLaws([
          { id: 1, name: 'Souveraineté des données', principle: "L'humain possède ses données" },
          { id: 2, name: 'Pas d\'évaluation implicite', principle: 'Aucun jugement caché' },
          { id: 3, name: 'Pas de manipulation', principle: 'Aucune influence comportementale' },
          { id: 4, name: 'Consentement explicite', principle: 'Accord requis pour cross-contexte' },
          { id: 5, name: 'Clarté et calme', principle: 'Interface sans pression' },
          { id: 6, name: 'Réversibilité', principle: 'Toute action peut être annulée' }
        ])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-700">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          CHE·NU
        </h1>
        <p className="text-slate-400 mt-2">Governed Intelligence Operating System</p>
        <p className="text-sm text-slate-500 mt-1">L'IA assiste. L'humain décide. Toujours.</p>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Universe View */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-400 mb-6 text-center">
            🌌 Universe View — Les Huit Sphères
          </h2>
          
          <div className="relative h-96 flex items-center justify-center">
            {/* Central Core */}
            <div className="absolute w-16 h-16 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-2xl">⚡</span>
            </div>

            {/* Spheres */}
            {SPHERES.map((sphere, idx) => {
              const angle = (idx / SPHERES.length) * 2 * Math.PI - Math.PI / 2
              const radius = 80 + sphere.orbit * 60
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <motion.div
                  key={sphere.id}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `calc(50% + ${x}px - 32px)`,
                    top: `calc(50% + ${y}px - 32px)`
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedSphere(sphere)}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all"
                    style={{ 
                      backgroundColor: sphere.color + '20',
                      borderColor: sphere.color,
                      borderWidth: '2px'
                    }}
                  >
                    {sphere.emoji}
                  </div>
                  <p className="text-xs text-center mt-1 text-slate-400">{sphere.name}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Selected Sphere */}
        {selectedSphere && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{selectedSphere.emoji}</span>
              <div>
                <h3 className="text-xl font-semibold" style={{ color: selectedSphere.color }}>
                  {selectedSphere.name}
                </h3>
                <p className="text-slate-400 text-sm">Sphere ID: {selectedSphere.id}</p>
              </div>
              <button 
                onClick={() => setSelectedSphere(null)}
                className="ml-auto text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            {selectedSphere.id === 'personal' && (
              <p className="text-red-400 text-sm">
                🔐 Sanctuaire absolu — Aucune autre sphère ne peut y accéder
              </p>
            )}
          </motion.section>
        )}

        {/* Six Laws */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-6 text-center">
            ⚖️ Les Six Lois Fondamentales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laws.map((law) => (
              <div 
                key={law.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                    {law.id}
                  </span>
                  <h3 className="font-semibold text-white">{law.name}</h3>
                </div>
                <p className="text-slate-400 text-sm">{law.principle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Foundation Freeze Badge */}
        <div className="text-center py-8 border-t border-slate-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-amber-500/50">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-amber-400 font-medium">Foundation Freeze v1.0.0</span>
            <span className="text-slate-500">—</span>
            <span className="text-emerald-400">ACTIF</span>
          </div>
          <p className="text-slate-500 text-sm mt-4">Gelé pour l'humanité.</p>
        </div>
      </div>
    </div>
  )
}

export default App
