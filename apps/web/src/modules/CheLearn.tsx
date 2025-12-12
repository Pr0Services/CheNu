/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - CHE-LEARN / SCHOLARS                               ║
 * ║              Learning Platform with Courses, Tutorials & Research            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Features:
 * - Course catalog with categories
 * - Video tutorials with progress tracking
 * - Certifications & badges
 * - Research papers integration (Google Scholar, ResearchGate)
 * - Learning paths
 * - Quiz & assessments
 * - Instructor profiles
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A'
};

// Course Categories
const CATEGORIES = [
  { id: 'construction', name: 'Construction', icon: '🏗️', count: 45 },
  { id: 'architecture', name: 'Architecture', icon: '🏛️', count: 32 },
  { id: 'management', name: 'Gestion de projet', icon: '📋', count: 28 },
  { id: 'safety', name: 'Sécurité (SST)', icon: '🦺', count: 24 },
  { id: 'legal', name: 'Réglementation', icon: '⚖️', count: 18 },
  { id: 'tech', name: 'Technologies', icon: '💻', count: 36 },
  { id: 'finance', name: 'Finance', icon: '💰', count: 15 },
  { id: 'soft', name: 'Soft Skills', icon: '🤝', count: 22 }
];

// Mock Courses
const COURSES = [
  { id: '1', title: 'Gestion de projet construction 101', instructor: 'Marie Tremblay', avatar: '👩‍🏫', category: 'management', level: 'Débutant', duration: '8h', lessons: 24, students: 1234, rating: 4.8, price: 0, certified: true, progress: 65, thumbnail: '📋' },
  { id: '2', title: 'Sécurité sur chantier - Certification RBQ', instructor: 'Jean Dubois', avatar: '👨‍🏫', category: 'safety', level: 'Intermédiaire', duration: '12h', lessons: 36, students: 892, rating: 4.9, price: 149, certified: true, progress: 0, thumbnail: '🦺' },
  { id: '3', title: 'BIM Revit Avancé', instructor: 'Sophie Martin', avatar: '👩‍💻', category: 'tech', level: 'Avancé', duration: '20h', lessons: 48, students: 567, rating: 4.7, price: 299, certified: true, progress: 0, thumbnail: '💻' },
  { id: '4', title: 'Estimation des coûts de construction', instructor: 'Pierre Lavoie', avatar: '👨‍💼', category: 'finance', level: 'Intermédiaire', duration: '10h', lessons: 30, students: 445, rating: 4.6, price: 199, certified: true, progress: 30, thumbnail: '💰' },
  { id: '5', title: 'Code du bâtiment Québec 2024', instructor: 'Anne Gagnon', avatar: '👩‍⚖️', category: 'legal', level: 'Tous niveaux', duration: '6h', lessons: 18, students: 2100, rating: 4.9, price: 0, certified: true, progress: 100, thumbnail: '⚖️' },
  { id: '6', title: 'Leadership en construction', instructor: 'Marc Bergeron', avatar: '👨‍🎓', category: 'soft', level: 'Intermédiaire', duration: '5h', lessons: 15, students: 334, rating: 4.5, price: 79, certified: false, progress: 0, thumbnail: '🤝' }
];

// Learning Paths
const LEARNING_PATHS = [
  { id: '1', title: 'Devenir Gérant de Projet', icon: '🎯', courses: 5, duration: '40h', students: 890, description: 'Maîtrisez toutes les compétences pour gérer des projets de construction.' },
  { id: '2', title: 'Certification BIM Specialist', icon: '🏆', courses: 4, duration: '60h', students: 445, description: 'Devenez expert en modélisation BIM avec Revit et Navisworks.' },
  { id: '3', title: 'Conformité RBQ Complète', icon: '📜', courses: 6, duration: '30h', students: 1200, description: 'Toutes les certifications RBQ requises pour les entrepreneurs.' }
];

// Research Papers
const RESEARCH_PAPERS = [
  { id: '1', title: 'Impact of AI on Construction Project Management', authors: 'Smith, J. et al.', journal: 'Construction Innovation', year: 2024, citations: 45, source: 'Google Scholar' },
  { id: '2', title: 'Sustainable Building Materials: A Comprehensive Review', authors: 'Tremblay, M. et al.', journal: 'Journal of Green Building', year: 2023, citations: 128, source: 'ResearchGate' },
  { id: '3', title: 'BIM Implementation Challenges in SMEs', authors: 'Dubois, P.', journal: 'Automation in Construction', year: 2024, citations: 23, source: 'Google Scholar' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const CourseCard = ({ course, onClick }: { course: any; onClick: () => void }) => {
  return (
    <div onClick={onClick} style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
      {/* Thumbnail */}
      <div style={{ height: 140, background: `linear-gradient(135deg, ${colors.emerald}40, ${colors.turquoise}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: 56 }}>{course.thumbnail}</span>
        {course.certified && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
            🏆 Certifié
          </div>
        )}
        {course.progress > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: colors.card }}>
            <div style={{ width: `${course.progress}%`, height: '100%', background: colors.gold }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <span style={{ background: colors.card, color: colors.turquoise, padding: '3px 8px', borderRadius: 6, fontSize: 10 }}>{course.level}</span>
          <span style={{ background: colors.card, color: colors.stone, padding: '3px 8px', borderRadius: 6, fontSize: 10 }}>{course.duration}</span>
        </div>
        
        <h3 style={{ color: colors.sand, fontSize: 15, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4 }}>{course.title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>{course.avatar}</span>
          <span style={{ color: colors.stone, fontSize: 12 }}>{course.instructor}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: colors.gold, fontSize: 13 }}>⭐ {course.rating}</span>
            <span style={{ color: colors.stone, fontSize: 12 }}>({course.students.toLocaleString()})</span>
          </div>
          <div style={{ color: course.price === 0 ? colors.emerald : colors.sand, fontWeight: 700, fontSize: 16 }}>
            {course.price === 0 ? 'Gratuit' : `${course.price} $`}
          </div>
        </div>

        {course.progress > 0 && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: colors.card, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: colors.stone, fontSize: 12 }}>Progression</span>
            <span style={{ color: course.progress === 100 ? colors.emerald : colors.gold, fontSize: 12, fontWeight: 600 }}>
              {course.progress === 100 ? '✅ Complété' : `${course.progress}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEARNING PATH CARD
// ═══════════════════════════════════════════════════════════════════════════════

const LearningPathCard = ({ path }: { path: any }) => {
  return (
    <div style={{ background: `linear-gradient(135deg, ${colors.gold}20, ${colors.emerald}20)`, border: `1px solid ${colors.gold}40`, borderRadius: 16, padding: 20, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 56, height: 56, background: colors.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          {path.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: colors.sand, margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>{path.title}</h3>
          <p style={{ color: colors.stone, margin: '0 0 12px', fontSize: 13, lineHeight: 1.4 }}>{path.description}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ color: colors.stone, fontSize: 12 }}>📚 {path.courses} cours</span>
            <span style={{ color: colors.stone, fontSize: 12 }}>⏱️ {path.duration}</span>
            <span style={{ color: colors.stone, fontSize: 12 }}>👥 {path.students} inscrits</span>
          </div>
        </div>
        <button style={{ background: colors.gold, border: 'none', borderRadius: 8, padding: '10px 20px', color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>
          Commencer
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESEARCH PAPER CARD
// ═══════════════════════════════════════════════════════════════════════════════

const ResearchPaperCard = ({ paper }: { paper: any }) => {
  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: colors.sand, margin: '0 0 8px', fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{paper.title}</h4>
          <p style={{ color: colors.stone, margin: '0 0 8px', fontSize: 12 }}>{paper.authors}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: colors.turquoise, fontSize: 11 }}>{paper.journal}</span>
            <span style={{ color: colors.stone, fontSize: 11 }}>{paper.year}</span>
            <span style={{ color: colors.gold, fontSize: 11 }}>📖 {paper.citations} citations</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <span style={{ background: colors.card, color: colors.stone, padding: '4px 8px', borderRadius: 6, fontSize: 10 }}>{paper.source}</span>
          <button style={{ background: colors.emerald, border: 'none', borderRadius: 6, padding: '6px 12px', color: 'white', fontSize: 11, cursor: 'pointer' }}>
            📄 Lire
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const CourseDetail = ({ course, onBack }: { course: any; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  const curriculum = [
    { section: 'Introduction', lessons: [{ title: 'Bienvenue au cours', duration: '5:00', completed: true }, { title: 'Objectifs du cours', duration: '8:00', completed: true }] },
    { section: 'Fondamentaux', lessons: [{ title: 'Concepts de base', duration: '15:00', completed: true }, { title: 'Outils essentiels', duration: '20:00', completed: false }, { title: 'Exercice pratique', duration: '30:00', completed: false }] },
    { section: 'Avancé', lessons: [{ title: 'Techniques avancées', duration: '25:00', completed: false }, { title: 'Étude de cas', duration: '40:00', completed: false }] }
  ];

  return (
    <div>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>
        ← Retour aux cours
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* Main Content */}
        <div>
          {/* Video Player */}
          <div style={{ background: '#000', borderRadius: 16, aspectRatio: '16/9', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 80 }}>{course.thumbnail}</span>
          </div>

          <h1 style={{ color: colors.sand, fontSize: 24, margin: '0 0 12px' }}>{course.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 32 }}>{course.avatar}</span>
              <div>
                <div style={{ color: colors.sand, fontWeight: 500 }}>{course.instructor}</div>
                <div style={{ color: colors.stone, fontSize: 12 }}>Instructeur</div>
              </div>
            </div>
            <span style={{ color: colors.gold }}>⭐ {course.rating}</span>
            <span style={{ color: colors.stone, fontSize: 13 }}>{course.students.toLocaleString()} étudiants</span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: colors.card, padding: 4, borderRadius: 8 }}>
            {['overview', 'curriculum', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  flex: 1, padding: 12, background: activeTab === tab ? colors.moss : 'transparent',
                  border: 'none', borderRadius: 6, color: activeTab === tab ? colors.gold : colors.stone,
                  cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400
                }}
              >
                {tab === 'overview' ? '📋 Aperçu' : tab === 'curriculum' ? '📚 Curriculum' : '⭐ Avis'}
              </button>
            ))}
          </div>

          {activeTab === 'curriculum' && (
            <div>
              {curriculum.map((section, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <h4 style={{ color: colors.sand, margin: '0 0 12px', fontSize: 14 }}>{section.section}</h4>
                  {section.lessons.map((lesson, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{lesson.completed ? '✅' : '⏸️'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: colors.sand, fontSize: 13 }}>{lesson.title}</div>
                        <div style={{ color: colors.stone, fontSize: 11 }}>{lesson.duration}</div>
                      </div>
                      <button style={{ background: colors.emerald, border: 'none', borderRadius: 6, padding: '6px 12px', color: 'white', fontSize: 11, cursor: 'pointer' }}>
                        ▶ Lire
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 20, position: 'sticky', top: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: course.price === 0 ? colors.emerald : colors.sand, marginBottom: 16 }}>
              {course.price === 0 ? 'Gratuit' : `${course.price} $`}
            </div>
            
            <button style={{ width: '100%', padding: 14, background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              {course.progress > 0 ? 'Continuer' : 'Commencer maintenant'}
            </button>

            {course.progress > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: colors.stone, fontSize: 12 }}>Progression</span>
                  <span style={{ color: colors.gold, fontSize: 12 }}>{course.progress}%</span>
                </div>
                <div style={{ height: 6, background: colors.card, borderRadius: 3 }}>
                  <div style={{ width: `${course.progress}%`, height: '100%', background: colors.gold, borderRadius: 3 }} />
                </div>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
              <h4 style={{ color: colors.sand, margin: '0 0 12px', fontSize: 14 }}>Ce cours inclut:</h4>
              {[
                { icon: '🎬', text: `${course.lessons} leçons vidéo` },
                { icon: '⏱️', text: `${course.duration} de contenu` },
                { icon: '📱', text: 'Accès mobile' },
                { icon: '♾️', text: 'Accès à vie' },
                { icon: '🏆', text: course.certified ? 'Certificat inclus' : 'Sans certificat' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span>{item.icon}</span>
                  <span style={{ color: colors.stone, fontSize: 13 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function CheLearn() {
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'research' | 'mycourses'>('courses');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter(c => 
    (!selectedCategory || c.category === selectedCategory) &&
    (!searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const myCourses = COURSES.filter(c => c.progress > 0);

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            🎓 CHE-Learn
            <span style={{ background: colors.emerald, color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{COURSES.length} cours</span>
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>
            Formations, certifications et ressources pour les professionnels
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '12px 16px', background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 10, color: colors.sand, width: 250 }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: colors.slate, padding: 8, borderRadius: 12 }}>
        {[
          { id: 'courses', icon: '📚', label: 'Catalogue' },
          { id: 'paths', icon: '🎯', label: 'Parcours' },
          { id: 'research', icon: '🔬', label: 'Recherche' },
          { id: 'mycourses', icon: '📖', label: 'Mes cours', badge: myCourses.length }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            padding: '12px 20px', background: activeTab === tab.id ? colors.moss : 'transparent',
            border: 'none', borderRadius: 8, color: activeTab === tab.id ? colors.gold : colors.stone,
            cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            {tab.icon} {tab.label}
            {tab.badge && <span style={{ background: colors.gold, color: colors.slate, padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <>
          {/* Categories */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '10px 16px', background: !selectedCategory ? colors.gold : colors.card,
                border: 'none', borderRadius: 10, color: !selectedCategory ? colors.slate : colors.sand,
                cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap'
              }}
            >Tous</button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 16px', background: selectedCategory === cat.id ? colors.gold : colors.card,
                  border: 'none', borderRadius: 10, color: selectedCategory === cat.id ? colors.slate : colors.sand,
                  cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
                }}
              >
                <span>{cat.icon}</span> {cat.name}
                <span style={{ opacity: 0.7, fontSize: 12 }}>({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'paths' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LEARNING_PATHS.map(path => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      )}

      {activeTab === 'research' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input placeholder="🔍 Rechercher des articles..." style={{ flex: 1, padding: 14, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 10, color: colors.sand }} />
              <button style={{ padding: '14px 20px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>Rechercher</button>
            </div>
            {RESEARCH_PAPERS.map(paper => (
              <ResearchPaperCard key={paper.id} paper={paper} />
            ))}
          </div>
          <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, height: 'fit-content' }}>
            <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📊 Sources connectées</h4>
            {[
              { name: 'Google Scholar', icon: '🎓', status: 'connected' },
              { name: 'ResearchGate', icon: '🔬', status: 'connected' },
              { name: 'PubMed', icon: '🏥', status: 'disconnected' },
              { name: 'IEEE Xplore', icon: '⚡', status: 'disconnected' }
            ].map((source, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
                <span style={{ fontSize: 20 }}>{source.icon}</span>
                <span style={{ color: colors.sand, fontSize: 13, flex: 1 }}>{source.name}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: source.status === 'connected' ? '#10B981' : colors.stone }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mycourses' && (
        <>
          {myCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <span style={{ fontSize: 64 }}>📚</span>
              <h3 style={{ color: colors.sand, marginTop: 16 }}>Aucun cours en cours</h3>
              <p style={{ color: colors.stone }}>Explorez notre catalogue pour commencer à apprendre!</p>
              <button onClick={() => setActiveTab('courses')} style={{ marginTop: 16, padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>
                Voir les cours
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {myCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
