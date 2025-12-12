/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - VIDEO STREAMING PRO                                ║
 * ║              Complete Streaming Platform with Multi-Source Integration       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Features:
 * - CHE·NU Video (internal platform)
 * - Multi-platform aggregation (YouTube, Twitch, TikTok, Vimeo)
 * - Video player with chapters & AI summaries
 * - Live streaming with chat
 * - Playlists & Watch Later
 * - Creator Studio
 * - Analytics dashboard
 */

import React, { useState, useRef } from 'react';

// Design Tokens
const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A',
  youtube: '#FF0000', twitch: '#9146FF', tiktok: '#000000', vimeo: '#1AB7EA'
};

// Platform data
const STREAMING_PLATFORMS = [
  { id: 'chenu', name: 'CHE·NU Video', icon: '🏠', color: colors.gold, connected: true },
  { id: 'youtube', name: 'YouTube', icon: '📺', color: colors.youtube, connected: true },
  { id: 'twitch', name: 'Twitch', icon: '🎮', color: colors.twitch, connected: true },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: colors.tiktok, connected: false },
  { id: 'vimeo', name: 'Vimeo', icon: '🎬', color: colors.vimeo, connected: false }
];

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const VideoCard = ({ video, size = 'normal', onClick }: { video: any; size?: 'normal' | 'large' | 'small' | 'list'; onClick?: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const platform = STREAMING_PLATFORMS.find(p => p.id === video.platform);

  if (size === 'list') {
    return (
      <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} 
        style={{ display: 'flex', gap: 12, cursor: 'pointer', padding: 8, borderRadius: 12, background: hovered ? colors.card : 'transparent', transition: 'background 0.2s' }}>
        <div style={{ width: 168, aspectRatio: '16/9', background: colors.moss, borderRadius: 8, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${colors.emerald}40, ${colors.turquoise}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32 }}>🎬</span>
          </div>
          <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{video.duration}</div>
          {video.progress && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.3)' }}><div style={{ width: `${video.progress}%`, height: '100%', background: colors.gold }} /></div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ color: colors.sand, fontSize: 14, fontWeight: 600, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{video.title}</h4>
          <div style={{ color: colors.stone, fontSize: 12 }}>{video.channel.name} {video.channel.verified && <span style={{ color: colors.turquoise }}>✓</span>}</div>
          <div style={{ color: colors.stone, fontSize: 12 }}>{video.views} vues · {video.time}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', background: colors.moss, borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', marginBottom: 12 }}>
        <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${colors.emerald}40, ${colors.turquoise}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s' }}>
          <span style={{ fontSize: size === 'large' ? 64 : size === 'small' ? 32 : 48 }}>🎬</span>
        </div>
        
        {/* Duration */}
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{video.duration}</div>
        
        {/* Live Badge */}
        {video.isLive && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
            EN DIRECT
          </div>
        )}
        
        {/* Platform Badge */}
        {platform && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: platform.color, width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{platform.icon}</div>
        )}
        
        {/* Live Viewers */}
        {video.isLive && video.viewers && (
          <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>👁️ {video.viewers.toLocaleString()}</div>
        )}

        {/* Progress Bar */}
        {video.progress && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: `${video.progress}%`, height: '100%', background: colors.gold }} />
          </div>
        )}

        {/* Hover Play Button */}
        {hovered && !video.isLive && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(0,0,0,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, marginLeft: 4 }}>▶️</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', gap: 12 }}>
        {size !== 'small' && (
          <div style={{ width: 36, height: 36, background: colors.moss, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{video.channel.avatar}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: colors.sand, fontSize: size === 'small' ? 13 : 14, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</h3>
          <div style={{ color: colors.stone, fontSize: size === 'small' ? 11 : 12 }}>
            {video.channel.name} {video.channel.verified && <span style={{ color: colors.turquoise }}>✓</span>}
          </div>
          <div style={{ color: colors.stone, fontSize: size === 'small' ? 11 : 12 }}>
            {video.views} vues · {video.time}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHANNEL CARD
// ═══════════════════════════════════════════════════════════════════════════════

const ChannelCard = ({ channel }: { channel: any }) => {
  const [subscribed, setSubscribed] = useState(channel.isSubscribed);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ width: 80, height: 80, background: colors.moss, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{channel.avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h4 style={{ color: colors.sand, margin: 0, fontSize: 16 }}>{channel.name}</h4>
          {channel.verified && <span style={{ color: colors.turquoise }}>✓</span>}
        </div>
        <p style={{ color: colors.stone, fontSize: 13, margin: '4px 0' }}>{channel.subscribers.toLocaleString()} abonnés · {channel.videos} vidéos</p>
        <p style={{ color: colors.stone, fontSize: 12, margin: 0 }}>{channel.description}</p>
      </div>
      <button onClick={() => setSubscribed(!subscribed)} style={{
        padding: '10px 20px', background: subscribed ? 'transparent' : colors.gold,
        border: subscribed ? `1px solid ${colors.gold}` : 'none',
        color: subscribed ? colors.gold : colors.slate, borderRadius: 20, fontWeight: 600, cursor: 'pointer'
      }}>{subscribed ? '✓ Abonné' : "S'abonner"}</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO PLAYER
// ═══════════════════════════════════════════════════════════════════════════════

const VideoPlayer = ({ video, onClose }: { video: any; onClose: () => void }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showChat, setShowChat] = useState(video.isLive);
  const [showChapters, setShowChapters] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const chapters = [
    { time: '0:00', title: 'Introduction', duration: '2:30' },
    { time: '2:30', title: 'Préparation du matériel', duration: '5:15' },
    { time: '7:45', title: 'Techniques de base', duration: '8:20' },
    { time: '16:05', title: 'Conseils d\'expert', duration: '6:40' },
    { time: '22:45', title: 'Conclusion', duration: '1:00' }
  ];

  const aiSummary = {
    keyPoints: [
      'Importance de la préparation avant de commencer',
      'Choix des bons outils pour chaque tâche',
      'Techniques de sécurité essentielles',
      'Astuces pour gagner du temps'
    ],
    topics: ['Construction', 'Sécurité', 'Outils', 'Techniques'],
    sentiment: 'Informatif et pratique'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showChat ? '1fr 350px' : showChapters ? '250px 1fr' : '1fr', gap: 24 }}>
      {/* Chapters Sidebar */}
      {showChapters && (
        <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.moss}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: colors.sand, margin: 0, fontSize: 14 }}>📑 Chapitres</h4>
            <button onClick={() => setShowChapters(false)} style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
          <div style={{ padding: 8 }}>
            {chapters.map((chapter, i) => (
              <button
                key={i}
                onClick={() => setCurrentChapter(i)}
                style={{
                  width: '100%', padding: 12, background: currentChapter === i ? colors.moss : 'transparent',
                  border: 'none', borderRadius: 8, textAlign: 'left', cursor: 'pointer', marginBottom: 4
                }}
              >
                <div style={{ color: colors.gold, fontSize: 12, fontWeight: 600 }}>{chapter.time}</div>
                <div style={{ color: colors.sand, fontSize: 13 }}>{chapter.title}</div>
                <div style={{ color: colors.stone, fontSize: 11 }}>{chapter.duration}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        {/* Video Player */}
        <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', marginBottom: 16, position: 'relative' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.emerald}40, ${colors.turquoise}40)` }}>
            <span style={{ fontSize: 80 }}>🎬</span>
          </div>
          
          {/* Live indicator */}
          {video.isLive && (
            <div style={{ position: 'absolute', top: 16, left: 16, background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />
              EN DIRECT · {video.viewers?.toLocaleString()} spectateurs
            </div>
          )}

          {/* Player Controls */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '40px 16px 16px' }}>
            {/* Progress Bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 12, cursor: 'pointer' }}>
              <div style={{ width: '35%', height: '100%', background: colors.gold, borderRadius: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', right: -6, top: -4, width: 12, height: 12, background: colors.gold, borderRadius: '50%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 24 }}>⏸️</button>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>⏮️</button>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>⏭️</button>
                <span style={{ color: 'white', fontSize: 13 }}>8:23 / {video.duration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setShowChapters(!showChapters)} style={{ background: showChapters ? colors.gold : 'none', border: 'none', color: showChapters ? colors.slate : 'white', cursor: 'pointer', fontSize: 14, padding: '4px 8px', borderRadius: 4 }}>📑</button>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>⚙️</button>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>⛶</button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <h1 style={{ color: colors.sand, fontSize: 20, fontWeight: 600, margin: '0 0 12px', lineHeight: 1.4 }}>{video.title}</h1>
        
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ color: colors.stone, fontSize: 14 }}>{video.views} vues · {video.time}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setLiked(!liked); setDisliked(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: liked ? colors.gold : colors.card, border: 'none', borderRadius: 20, color: liked ? colors.slate : colors.sand, cursor: 'pointer', fontSize: 13 }}>
              👍 {(parseInt(video.likes?.replace('K', '000') || '0') + (liked ? 1 : 0)).toLocaleString()}
            </button>
            <button onClick={() => { setDisliked(!disliked); setLiked(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: disliked ? colors.stone : colors.card, border: 'none', borderRadius: 20, color: colors.sand, cursor: 'pointer', fontSize: 13 }}>
              👎
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: colors.card, border: 'none', borderRadius: 20, color: colors.sand, cursor: 'pointer', fontSize: 13 }}>
              🔗 Partager
            </button>
            <button onClick={() => setSaved(!saved)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: saved ? colors.gold : colors.card, border: 'none', borderRadius: 20, color: saved ? colors.slate : colors.sand, cursor: 'pointer', fontSize: 13 }}>
              {saved ? '✓ Enregistré' : '📥 Enregistrer'}
            </button>
            <button onClick={() => setShowAISummary(!showAISummary)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: showAISummary ? colors.turquoise : colors.card, border: 'none', borderRadius: 20, color: showAISummary ? 'white' : colors.sand, cursor: 'pointer', fontSize: 13 }}>
              🤖 Résumé IA
            </button>
          </div>
        </div>

        {/* AI Summary */}
        {showAISummary && (
          <div style={{ background: `linear-gradient(135deg, ${colors.turquoise}20, ${colors.emerald}20)`, border: `1px solid ${colors.turquoise}50`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <h4 style={{ color: colors.sand, margin: 0, fontSize: 14 }}>Résumé généré par Nova IA</h4>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: colors.stone, fontSize: 12, marginBottom: 4 }}>Points clés:</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {aiSummary.keyPoints.map((point, i) => (
                  <li key={i} style={{ color: colors.sand, fontSize: 13, marginBottom: 4 }}>{point}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {aiSummary.topics.map((topic, i) => (
                <span key={i} style={{ background: colors.turquoise, color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 11 }}>{topic}</span>
              ))}
            </div>
          </div>
        )}

        {/* Channel Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, background: colors.moss, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{video.channel.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: colors.sand, fontWeight: 600 }}>{video.channel.name}</span>
              {video.channel.verified && <span style={{ color: colors.turquoise }}>✓</span>}
            </div>
            <div style={{ color: colors.stone, fontSize: 13 }}>{video.channel.subscribers?.toLocaleString()} abonnés</div>
          </div>
          <button style={{ padding: '10px 24px', background: colors.gold, border: 'none', borderRadius: 20, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>S'abonner</button>
        </div>

        {/* Description */}
        <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, padding: 16 }}>
          <p style={{ color: colors.sand, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{video.description}</p>
        </div>
      </div>

      {/* Live Chat */}
      {showChat && (
        <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, display: 'flex', flexDirection: 'column', height: 600 }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${colors.moss}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: colors.sand, margin: 0 }}>💬 Chat en direct</h4>
            <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {[
              { user: 'Jean D.', msg: 'Super stream! 🔥', badge: '💎' },
              { user: 'Marie L.', msg: 'Question: quel logiciel tu utilises?', badge: null },
              { user: 'Pierre T.', msg: 'Merci pour les conseils!', badge: '⭐' },
              { user: 'Sophie M.', msg: '👏👏👏', badge: null },
              { user: 'Admin', msg: 'Bienvenue à tous!', badge: '🛡️' }
            ].map((chat, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12 }}>{chat.badge} </span>
                <span style={{ color: colors.gold, fontWeight: 600, fontSize: 12 }}>{chat.user}: </span>
                <span style={{ color: colors.sand, fontSize: 13 }}>{chat.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${colors.moss}` }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Envoyer un message..." style={{ flex: 1, padding: 10, background: colors.moss, border: 'none', borderRadius: 8, color: colors.sand, fontSize: 13 }} />
              <button style={{ padding: '10px 16px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>📤</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CREATOR STUDIO
// ═══════════════════════════════════════════════════════════════════════════════

const CreatorStudio = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'upload' | 'analytics' | 'monetization'>('dashboard');

  const stats = [
    { label: 'Vues (28j)', value: '45.2K', change: '+12%', icon: '👁️' },
    { label: 'Temps de visionnage', value: '1,234h', change: '+8%', icon: '⏱️' },
    { label: 'Abonnés', value: '+234', change: '+15%', icon: '👥' },
    { label: 'Revenus estimés', value: '456 $', change: '+22%', icon: '💰' }
  ];

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 20, borderBottom: `1px solid ${colors.moss}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🎬</span>
        <div>
          <h3 style={{ color: colors.sand, margin: 0, fontSize: 18 }}>Creator Studio</h3>
          <p style={{ color: colors.stone, margin: 0, fontSize: 13 }}>Gérez vos vidéos et analysez vos performances</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.moss}` }}>
        {[
          { id: 'dashboard', label: '📊 Tableau de bord' },
          { id: 'upload', label: '📤 Mettre en ligne' },
          { id: 'analytics', label: '📈 Analytics' },
          { id: 'monetization', label: '💰 Monétisation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            style={{
              flex: 1, padding: 14, background: 'transparent', border: 'none',
              borderBottom: activeSection === tab.id ? `2px solid ${colors.gold}` : '2px solid transparent',
              color: activeSection === tab.id ? colors.gold : colors.stone,
              cursor: 'pointer', fontSize: 13, fontWeight: activeSection === tab.id ? 600 : 400
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {activeSection === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ background: colors.card, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{stat.icon}</span>
                    <span style={{ color: colors.stone, fontSize: 12 }}>{stat.label}</span>
                  </div>
                  <div style={{ color: colors.sand, fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: '#10b981', fontSize: 12 }}>{stat.change}</div>
                </div>
              ))}
            </div>
            
            <h4 style={{ color: colors.sand, margin: '0 0 16px' }}>Vidéos récentes</h4>
            {[
              { title: 'Formation gestion de projet', views: '12K', revenue: '45 $', status: 'Public' },
              { title: 'Tutoriel rénovation cuisine', views: '8.5K', revenue: '32 $', status: 'Public' },
              { title: 'Live: Q&A Construction', views: '2.3K', revenue: '12 $', status: 'Terminé' }
            ].map((video, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, background: colors.card, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ width: 120, height: 68, background: colors.moss, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: colors.sand, fontWeight: 500 }}>{video.title}</div>
                  <div style={{ color: colors.stone, fontSize: 12 }}>{video.views} vues · {video.revenue}</div>
                </div>
                <span style={{ background: colors.emerald, color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 11 }}>{video.status}</span>
              </div>
            ))}
          </>
        )}

        {activeSection === 'upload' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 120, height: 120, background: colors.card, borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${colors.stone}` }}>
              <span style={{ fontSize: 48 }}>📤</span>
            </div>
            <h4 style={{ color: colors.sand, marginBottom: 8 }}>Glissez vos fichiers ici</h4>
            <p style={{ color: colors.stone, fontSize: 13, marginBottom: 20 }}>ou cliquez pour sélectionner</p>
            <button style={{ padding: '12px 32px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>Sélectionner des fichiers</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function VideoStreamingPro() {
  const [activeTab, setActiveTab] = useState<'accueil' | 'lives' | 'abonnements' | 'tendances' | 'studio'>('accueil');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | string>('all');

  const videos = [
    { id: '1', title: 'Formation complète: Gestion de projet construction 2024', channel: { name: 'Construction Pro', avatar: '🏗️', verified: true, subscribers: 45000 }, views: '12K', time: 'il y a 2 jours', duration: '1:23:45', likes: '1.2K', description: 'Formation complète sur la gestion de projet...', platform: 'youtube' },
    { id: '2', title: '🔴 LIVE: Visite de chantier - Projet résidentiel Laval', channel: { name: 'Immobilier Québec', avatar: '🏠', verified: true, subscribers: 28000 }, viewers: 1234, time: 'En direct', duration: 'LIVE', isLive: true, description: 'Visite en direct!', platform: 'chenu' },
    { id: '3', title: 'Comment calculer vos prix en construction', channel: { name: 'Entrepreneur Expert', avatar: '💼', verified: false, subscribers: 12000 }, views: '8.5K', time: 'il y a 1 semaine', duration: '18:32', description: 'Guide pratique...', platform: 'chenu' },
    { id: '4', title: 'Les erreurs à éviter en rénovation', channel: { name: 'Réno Tips', avatar: '🔨', verified: true, subscribers: 67000 }, views: '45K', time: 'il y a 3 jours', duration: '24:15', description: 'Évitez ces erreurs...', platform: 'youtube' },
    { id: '5', title: '🎮 LIVE: Construction dans Minecraft avec un architecte', channel: { name: 'ArchiGamer', avatar: '🎮', verified: true, subscribers: 23000 }, viewers: 567, time: 'En direct', duration: 'LIVE', isLive: true, description: 'Stream gaming!', platform: 'twitch' },
    { id: '6', title: 'Tutoriel: Lecture de plans architecturaux', channel: { name: 'Archi Learn', avatar: '📐', verified: false, subscribers: 8500 }, views: '6.2K', time: 'il y a 2 semaines', duration: '35:22', description: 'Apprenez...', platform: 'chenu', progress: 45 }
  ];

  const filteredVideos = platformFilter === 'all' ? videos : videos.filter(v => v.platform === platformFilter);

  if (selectedVideo) {
    return (
      <div>
        <button onClick={() => setSelectedVideo(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}>
          ← Retour
        </button>
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            🎬 Video Streaming
            <span style={{ background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>PRO</span>
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>Vidéos, formations, lives et plus encore</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: colors.card, border: `1px solid ${colors.moss}`, borderRadius: 10, color: colors.sand, cursor: 'pointer' }}>
            🔴 Démarrer un live
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>
            📹 Mettre en ligne
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: colors.slate, padding: 8, borderRadius: 12 }}>
        {[
          { id: 'accueil', icon: '🏠', label: 'Accueil' },
          { id: 'lives', icon: '🔴', label: 'En direct' },
          { id: 'abonnements', icon: '📺', label: 'Abonnements' },
          { id: 'tendances', icon: '🔥', label: 'Tendances' },
          { id: 'studio', icon: '🎬', label: 'Creator Studio' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            padding: '12px 20px', background: activeTab === tab.id ? colors.moss : 'transparent',
            border: 'none', borderRadius: 8, color: activeTab === tab.id ? colors.gold : colors.stone,
            cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 8
          }}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {activeTab === 'studio' ? (
        <CreatorStudio />
      ) : (
        <>
          {/* Platform Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
            <button onClick={() => setPlatformFilter('all')} style={{
              padding: '8px 16px', background: platformFilter === 'all' ? colors.gold : colors.card,
              border: 'none', borderRadius: 20, color: platformFilter === 'all' ? colors.slate : colors.sand,
              cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}>Tout</button>
            {STREAMING_PLATFORMS.filter(p => p.connected).map(platform => (
              <button key={platform.id} onClick={() => setPlatformFilter(platform.id)} style={{
                padding: '8px 16px', background: platformFilter === platform.id ? platform.color : colors.card,
                border: 'none', borderRadius: 20, color: platformFilter === platform.id ? 'white' : colors.sand,
                cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6
              }}>{platform.icon} {platform.name}</button>
            ))}
          </div>

          {/* Live Section */}
          {(activeTab === 'accueil' || activeTab === 'lives') && filteredVideos.some(v => v.isLive) && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: colors.sand, fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
                En direct maintenant
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {filteredVideos.filter(v => v.isLive).map(video => (
                  <VideoCard key={video.id} video={video} size="large" onClick={() => setSelectedVideo(video)} />
                ))}
              </div>
            </div>
          )}

          {/* Continue Watching */}
          {activeTab === 'accueil' && filteredVideos.some(v => v.progress) && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: colors.sand, fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>⏯️ Continuer à regarder</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filteredVideos.filter(v => v.progress).map(video => (
                  <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: colors.sand, fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
              {activeTab === 'tendances' ? '🔥 Tendances' : activeTab === 'abonnements' ? '📺 De vos abonnements' : '📹 Recommandées pour vous'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filteredVideos.filter(v => !v.isLive && !v.progress).map(video => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
