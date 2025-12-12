/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - SOCIAL NETWORK PRO                                 ║
 * ║              Complete Social Platform with Multi-Source Integration          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

// Design Tokens
const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A',
  facebook: '#1877F2', instagram: '#E4405F', linkedin: '#0A66C2',
  twitter: '#1DA1F2', tiktok: '#000000', youtube: '#FF0000'
};

// Platform data
const PLATFORMS = [
  { id: 'chenu', name: 'CHE·NU', icon: '🏠', color: colors.gold, connected: true, followers: 1250 },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: colors.facebook, connected: true, followers: 892 },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: colors.instagram, connected: true, followers: 2340 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: colors.linkedin, connected: true, followers: 567 },
  { id: 'twitter', name: 'X', icon: '𝕏', color: colors.twitter, connected: false },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: colors.tiktok, connected: false },
  { id: 'youtube', name: 'YouTube', icon: '📺', color: colors.youtube, connected: true, followers: 4500 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// STORIES BAR
// ═══════════════════════════════════════════════════════════════════════════════

const StoriesBar = () => {
  const stories = [
    { id: '1', name: 'Votre story', avatar: '➕', viewed: false, isYou: true },
    { id: '2', name: 'Construction Pro', avatar: '🏗️', viewed: false, isLive: true, platform: 'chenu' },
    { id: '3', name: 'Marie D.', avatar: '👩‍💼', viewed: false, platform: 'instagram' },
    { id: '4', name: 'Immobilier QC', avatar: '🏘️', viewed: true, platform: 'instagram' },
    { id: '5', name: 'Pierre T.', avatar: '👷', viewed: true, platform: 'facebook' },
    { id: '6', name: 'Réno Tips', avatar: '🔨', viewed: false, platform: 'chenu' },
    { id: '7', name: 'Archi MTL', avatar: '📐', viewed: false, platform: 'linkedin' }
  ];

  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px 0', overflowX: 'auto', marginBottom: 20 }}>
      {stories.map((story) => (
        <div key={story.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 72 }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%', padding: 3,
            background: story.viewed ? colors.stone : story.isLive 
              ? 'linear-gradient(45deg, #ef4444, #f97316)' 
              : `linear-gradient(45deg, ${colors.gold}, ${colors.emerald})`
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%', background: colors.slate,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: story.isYou ? 24 : 28,
              position: 'relative'
            }}>
              {story.avatar}
              {story.isLive && (
                <div style={{
                  position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                  background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700
                }}>LIVE</div>
              )}
              {story.platform && (
                <div style={{
                  position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%',
                  background: colors.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10
                }}>{PLATFORMS.find(p => p.id === story.platform)?.icon}</div>
              )}
            </div>
          </div>
          <span style={{ fontSize: 11, color: story.viewed ? colors.stone : colors.sand, textAlign: 'center', maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST COMPOSER
// ═══════════════════════════════════════════════════════════════════════════════

const PostComposer = ({ onPost }: { onPost: (content: string) => void }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['chenu']);
  const [showPlatforms, setShowPlatforms] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
        <div style={{ flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            placeholder="Quoi de neuf? Partagez sur plusieurs plateformes..."
            style={{ width: '100%', minHeight: 80, padding: 12, background: 'transparent', border: 'none', color: colors.sand, fontSize: 16, resize: 'none', fontFamily: 'inherit', outline: 'none' }}
          />
          
          {/* Platform Selector */}
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setShowPlatforms(!showPlatforms)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px', color: colors.sand, cursor: 'pointer', fontSize: 13 }}>
              <span>📤</span>
              <span>Publier sur {selectedPlatforms.length} plateforme(s)</span>
              <span>{showPlatforms ? '▲' : '▼'}</span>
            </button>
            
            {showPlatforms && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, padding: 12, background: colors.card, borderRadius: 12 }}>
                {PLATFORMS.filter(p => p.connected).map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                      background: selectedPlatforms.includes(platform.id) ? platform.color : 'transparent',
                      border: `1px solid ${platform.color}`, borderRadius: 20,
                      color: selectedPlatforms.includes(platform.id) ? 'white' : platform.color,
                      cursor: 'pointer', fontSize: 12, fontWeight: 500
                    }}
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.name}</span>
                    {selectedPlatforms.includes(platform.id) && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${colors.moss}` }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['🖼️', '🎬', '📊', '📅', '📍', '😀'].map((icon, i) => (
                <button key={i} style={{ width: 36, height: 36, background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>{icon}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: content.length > 450 ? '#ef4444' : colors.stone }}>{content.length}/500</span>
              <button
                onClick={() => { onPost(content); setContent(''); }}
                disabled={!content.trim()}
                style={{
                  padding: '10px 24px', background: content.trim() ? colors.gold : colors.moss,
                  border: 'none', borderRadius: 20, color: content.trim() ? colors.slate : colors.stone,
                  fontWeight: 600, cursor: content.trim() ? 'pointer' : 'not-allowed'
                }}
              >Publier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════════════════════════════

const PostCard = ({ post }: { post: any }) => {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const platform = PLATFORMS.find(p => p.id === post.platform);

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 48, height: 48,
              background: post.author.isEnterprise ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})` : `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`,
              borderRadius: post.author.isEnterprise ? 12 : '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
            }}>{post.author.avatar}</div>
            {platform && (
              <div style={{
                position: 'absolute', bottom: -4, right: -4, width: 20, height: 20,
                background: platform.color, borderRadius: '50%', border: `2px solid ${colors.slate}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10
              }}>{platform.icon}</div>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: colors.sand, fontWeight: 600 }}>{post.author.name}</span>
              {post.author.verified && <span style={{ color: colors.turquoise }}>✓</span>}
              {post.author.isEnterprise && (
                <span style={{ background: colors.gold, color: colors.slate, padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>ENTREPRISE</span>
              )}
            </div>
            <div style={{ color: colors.stone, fontSize: 13 }}>
              @{post.author.handle} · {post.time}
              {post.location && <span> · 📍 {post.location}</span>}
            </div>
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 18 }}>⋯</button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 16px' }}>
        <p style={{ color: colors.sand, fontSize: 15, lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>{post.content}</p>
        {post.hashtags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {post.hashtags.map((tag: string) => (
              <span key={tag} style={{ color: colors.turquoise, fontSize: 14, cursor: 'pointer' }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && (
        <div style={{ margin: '0 16px 16px' }}>
          {post.media.type === 'poll' && (
            <div style={{ background: colors.card, borderRadius: 12, padding: 16 }}>
              {post.media.options.map((opt: any, i: number) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: colors.sand, fontSize: 14 }}>{opt.text}</span>
                    <span style={{ color: colors.gold, fontSize: 14, fontWeight: 600 }}>{opt.percent}%</span>
                  </div>
                  <div style={{ height: 8, background: colors.moss, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${opt.percent}%`, height: '100%', background: colors.gold, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{ color: colors.stone, fontSize: 12, marginTop: 8 }}>{post.media.totalVotes?.toLocaleString()} votes</div>
            </div>
          )}
          {(post.media.type === 'image' || post.media.type === 'carousel' || post.media.type === 'reel') && (
            <div style={{
              background: `linear-gradient(135deg, ${colors.emerald}40, ${colors.turquoise}40)`,
              borderRadius: 12, aspectRatio: post.media.type === 'reel' ? '9/16' : '16/9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <span style={{ fontSize: 48 }}>{post.media.type === 'reel' ? '🎬' : '🖼️'}</span>
              {post.media.type === 'carousel' && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 6, color: 'white', fontSize: 12 }}>1/4</div>
              )}
              {post.media.type === 'reel' && (
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 6, color: 'white', fontSize: 12 }}>🎵 Reel</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.moss}`, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <button onClick={() => setLiked(!liked)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: liked ? '#ef4444' : colors.stone, cursor: 'pointer', fontSize: 14 }}>
            {liked ? '❤️' : '🤍'} {(post.likes + (liked ? 1 : 0)).toLocaleString()}
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 14 }}>
            💬 {post.comments}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 14 }}>
            🔄 {post.shares}
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} style={{ background: 'none', border: 'none', color: saved ? colors.gold : colors.stone, cursor: 'pointer', fontSize: 18 }}>
          {saved ? '🔖' : '🏷️'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ padding: 16, borderTop: `1px solid ${colors.moss}`, background: colors.card }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: colors.moss, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
            <input placeholder="Ajouter un commentaire..." style={{ flex: 1, padding: 10, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 20, color: colors.sand, fontSize: 13 }} />
          </div>
          {[
            { user: 'Jean D.', comment: 'Super travail! 👏', time: '1h' },
            { user: 'Marie L.', comment: 'Très impressionnant, félicitations!', time: '45min' }
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: colors.moss, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👤</div>
              <div>
                <span style={{ color: colors.sand, fontWeight: 600, fontSize: 13 }}>{c.user}</span>
                <span style={{ color: colors.stone, fontSize: 12, marginLeft: 8 }}>{c.time}</span>
                <p style={{ color: colors.sand, fontSize: 13, margin: '4px 0 0' }}>{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENTERPRISE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const EnterpriseCard = ({ enterprise }: { enterprise: any }) => {
  const [following, setFollowing] = useState(enterprise.isFollowing);

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          width: 64, height: 64, background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
        }}>{enterprise.logo}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ color: colors.sand, margin: 0, fontSize: 16 }}>{enterprise.name}</h4>
            {enterprise.verified && <span style={{ color: colors.turquoise }}>✓</span>}
          </div>
          <p style={{ color: colors.stone, fontSize: 13, margin: '4px 0' }}>{enterprise.followers.toLocaleString()} abonnés</p>
          <p style={{ color: colors.stone, fontSize: 12, margin: 0, lineHeight: 1.4 }}>{enterprise.description}</p>
        </div>
        <button
          onClick={() => setFollowing(!following)}
          style={{
            padding: '10px 20px', height: 'fit-content',
            background: following ? 'transparent' : colors.gold,
            border: following ? `1px solid ${colors.gold}` : 'none',
            color: following ? colors.gold : colors.slate,
            borderRadius: 20, fontWeight: 600, cursor: 'pointer', fontSize: 13
          }}
        >{following ? '✓ Abonné' : 'Suivre'}</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP CARD
// ═══════════════════════════════════════════════════════════════════════════════

const GroupCard = ({ group }: { group: any }) => {
  const [joined, setJoined] = useState(group.isJoined);

  return (
    <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          width: 56, height: 56, background: colors.moss,
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
        }}>{group.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ color: colors.sand, margin: 0, fontSize: 15 }}>{group.name}</h4>
            <span style={{ background: group.privacy === 'private' ? colors.moss : colors.turquoise + '30', color: group.privacy === 'private' ? colors.stone : colors.turquoise, padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>
              {group.privacy === 'private' ? '🔒 Privé' : '🌐 Public'}
            </span>
          </div>
          <p style={{ color: colors.stone, fontSize: 12, margin: '4px 0 0' }}>
            👥 {group.members.toLocaleString()} membres · Actif il y a {group.lastActivity}
          </p>
        </div>
        <button
          onClick={() => setJoined(!joined)}
          style={{
            padding: '8px 16px', height: 'fit-content',
            background: joined ? 'transparent' : colors.emerald,
            border: joined ? `1px solid ${colors.emerald}` : 'none',
            color: joined ? colors.emerald : 'white',
            borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: 12
          }}
        >{joined ? '✓ Membre' : 'Rejoindre'}</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const AnalyticsSidebar = () => {
  const totalFollowers = PLATFORMS.filter(p => p.connected).reduce((sum, p) => sum + (p.followers || 0), 0);

  return (
    <div>
      {/* Profile Card */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 16, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`,
          borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
        }}>👤</div>
        <h4 style={{ color: colors.sand, margin: '0 0 4px' }}>Mon Profil</h4>
        <p style={{ color: colors.stone, fontSize: 13, margin: 0 }}>@monprofil</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div><div style={{ color: colors.sand, fontWeight: 700 }}>{totalFollowers.toLocaleString()}</div><div style={{ color: colors.stone, fontSize: 12 }}>Abonnés</div></div>
          <div><div style={{ color: colors.sand, fontWeight: 700 }}>156</div><div style={{ color: colors.stone, fontSize: 12 }}>Publications</div></div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📊 Plateformes connectées</h4>
        {PLATFORMS.filter(p => p.connected).map(platform => (
          <div key={platform.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '8px 12px', background: colors.card, borderRadius: 8 }}>
            <span style={{ fontSize: 20 }}>{platform.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: colors.sand, fontSize: 13, fontWeight: 500 }}>{platform.name}</div>
              <div style={{ color: colors.stone, fontSize: 11 }}>{platform.followers?.toLocaleString()} abonnés</div>
            </div>
            <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }} />
          </div>
        ))}
        <button style={{ width: '100%', padding: 10, background: colors.card, border: `1px dashed ${colors.stone}`, borderRadius: 8, color: colors.stone, cursor: 'pointer', fontSize: 13, marginTop: 8 }}>
          + Connecter une plateforme
        </button>
      </div>

      {/* Trending */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16 }}>
        <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>🔥 Tendances</h4>
        {['#construction2024', '#immobilierQC', '#RBQ', '#renovation'].map((tag, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? `1px solid ${colors.moss}` : 'none' }}>
            <div style={{ color: colors.turquoise, fontWeight: 600, fontSize: 14 }}>{tag}</div>
            <div style={{ color: colors.stone, fontSize: 12 }}>{Math.floor(Math.random() * 1000) + 100} publications</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function SocialNetworkPro() {
  const [activeTab, setActiveTab] = useState<'feed' | 'entreprises' | 'groupes' | 'analytics'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | string>('all');

  const posts = [
    { id: '1', author: { name: 'Construction Laval', handle: 'constructionlaval', avatar: '🏗️', verified: true, isEnterprise: true }, content: '🏗️ Notre nouveau projet résidentiel avance bien! 50 unités de logements modernes.\n\nMerci à toute l\'équipe! 💪', hashtags: ['construction', 'laval'], media: { type: 'carousel' }, time: '2h', location: 'Laval, QC', likes: 234, comments: 45, shares: 12, liked: false, saved: false, platform: 'chenu' },
    { id: '2', author: { name: 'Pierre Tremblay', handle: 'ptremblay', avatar: '👷', verified: false, isEnterprise: false }, content: '💼 Excited to announce my PMP certification!', time: '4h', likes: 89, comments: 23, shares: 5, liked: true, saved: false, platform: 'linkedin' },
    { id: '3', author: { name: 'Immobilier Québec', handle: 'immobilierqc', avatar: '🏘️', verified: true, isEnterprise: true }, content: '✨ New listing! Stunning 3BR condo downtown Montreal →', hashtags: ['realestate', 'montreal'], media: { type: 'carousel' }, time: '6h', likes: 456, comments: 67, shares: 34, liked: false, saved: true, platform: 'instagram' },
    { id: '4', author: { name: 'Marie Dubois', handle: 'mdubois', avatar: '👩‍💼', verified: false, isEnterprise: false }, content: 'Sondage: Plus grande difficulté en 2024?', media: { type: 'poll', options: [{ text: 'Recrutement', percent: 45 }, { text: 'Coût matériaux', percent: 35 }, { text: 'Délais', percent: 15 }, { text: 'Réglementation', percent: 5 }], totalVotes: 892 }, time: '1j', likes: 156, comments: 89, shares: 23, liked: false, saved: false, platform: 'facebook' },
    { id: '5', author: { name: 'Réno Expert', handle: 'renoexpert', avatar: '🔨', verified: true, isEnterprise: true }, content: '🎬 Kitchen transformation in 3 days!', media: { type: 'reel' }, time: '8h', likes: 12500, comments: 342, shares: 890, liked: false, saved: false, platform: 'tiktok' }
  ];

  const enterprises = [
    { id: '1', name: 'Construction Laval', logo: '🏗️', verified: true, followers: 12500, description: 'Entreprise générale de construction depuis 1985.', isFollowing: true },
    { id: '2', name: 'Immobilier Québec', logo: '🏘️', verified: true, followers: 8900, description: 'Leader de l\'immobilier au Québec.', isFollowing: false },
    { id: '3', name: 'Réno Expert', logo: '🔨', verified: false, followers: 5600, description: 'Spécialistes en rénovation résidentielle.', isFollowing: false }
  ];

  const groups = [
    { id: '1', name: 'Entrepreneurs Construction QC', icon: '🏗️', members: 15200, privacy: 'public', isJoined: true, lastActivity: '2 min' },
    { id: '2', name: 'Investisseurs Immobilier MTL', icon: '💰', members: 3400, privacy: 'private', isJoined: false, lastActivity: '15 min' },
    { id: '3', name: 'RBQ & Réglementation', icon: '📋', members: 8900, privacy: 'public', isJoined: true, lastActivity: '1h' },
    { id: '4', name: 'Femmes en Construction', icon: '👷‍♀️', members: 2100, privacy: 'public', isJoined: true, lastActivity: '5 min' }
  ];

  const filteredPosts = feedFilter === 'all' ? posts : posts.filter(p => p.platform === feedFilter);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
      {/* Main Content */}
      <div>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            📱 Social Network
            <span style={{ background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>PRO</span>
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>Gérez tous vos réseaux en un seul endroit</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: colors.slate, padding: 8, borderRadius: 12 }}>
          {[
            { id: 'feed', icon: '🏠', label: 'Fil' },
            { id: 'entreprises', icon: '🏢', label: 'Entreprises' },
            { id: 'groupes', icon: '👥', label: 'Groupes' },
            { id: 'analytics', icon: '📊', label: 'Statistiques' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
              flex: 1, padding: '12px 16px',
              background: activeTab === tab.id ? colors.moss : 'transparent',
              border: 'none', borderRadius: 8,
              color: activeTab === tab.id ? colors.gold : colors.stone,
              cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <>
            {/* Platform Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 8 }}>
              <button onClick={() => setFeedFilter('all')} style={{
                padding: '8px 16px', background: feedFilter === 'all' ? colors.gold : colors.card,
                border: 'none', borderRadius: 20, color: feedFilter === 'all' ? colors.slate : colors.sand,
                cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap'
              }}>Tout</button>
              {PLATFORMS.filter(p => p.connected).map(platform => (
                <button key={platform.id} onClick={() => setFeedFilter(platform.id)} style={{
                  padding: '8px 16px', background: feedFilter === platform.id ? platform.color : colors.card,
                  border: 'none', borderRadius: 20, color: feedFilter === platform.id ? 'white' : colors.sand,
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}>{platform.icon} {platform.name}</button>
              ))}
            </div>

            <StoriesBar />
            <PostComposer onPost={(content) => console.log('Post:', content)} />
            {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
          </>
        )}

        {activeTab === 'entreprises' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <input placeholder="🔍 Rechercher une entreprise..." style={{ width: '100%', padding: 14, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, color: colors.sand, fontSize: 14 }} />
            </div>
            {enterprises.map(e => <EnterpriseCard key={e.id} enterprise={e} />)}
          </>
        )}

        {activeTab === 'groupes' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input placeholder="🔍 Rechercher un groupe..." style={{ flex: 1, padding: 14, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, color: colors.sand, fontSize: 14 }} />
              <button style={{ padding: '14px 20px', background: colors.gold, border: 'none', borderRadius: 12, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>+ Créer</button>
            </div>
            {groups.map(g => <GroupCard key={g.id} group={g} />)}
          </>
        )}

        {activeTab === 'analytics' && (
          <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: colors.sand, margin: '0 0 20px' }}>📈 Aperçu des performances</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Portée totale', value: '45.2K', change: '+12%', icon: '👁️' },
                { label: 'Engagements', value: '3.8K', change: '+8%', icon: '💬' },
                { label: 'Nouveaux abonnés', value: '+234', change: '+15%', icon: '👥' },
                { label: 'Partages', value: '892', change: '+22%', icon: '🔄' }
              ].map((stat, i) => (
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
            <div style={{ background: colors.card, borderRadius: 12, padding: 20, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: colors.stone }}>📊 Graphique de performance (7 derniers jours)</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <AnalyticsSidebar />
    </div>
  );
}
