/* =====================================================
   CHE·NU — Themed Universe Demo
   
   Complete demo showing:
   - Universe theme resolution
   - Theme switching
   - Sphere navigation
   - Meeting room integration
   ===================================================== */

import React from 'react';
import {
  ThemedUniverseProvider,
  ThemedUniverseView,
  UniverseTypeSelector,
  DepthLevelSlider,
  useThemedUniverse,
  SphereData,
} from './index';
import { MeetingPage } from '../ui/meeting/MeetingPage';
import { MeetingObjective, ParticipantRegistry } from '../meeting/types';

// ─────────────────────────────────────────────────────
// DEMO DATA
// ─────────────────────────────────────────────────────

const DEMO_SPHERES: SphereData[] = [
  { id: 'finance', name: 'Finance', type: 'business', nodeCount: 45 },
  { id: 'operations', name: 'Operations', type: 'business', nodeCount: 38 },
  { id: 'design', name: 'Design', type: 'creative', nodeCount: 27 },
  { id: 'wellness', name: 'Wellness', type: 'personal', nodeCount: 15 },
  { id: 'research', name: 'Research', type: 'scholar', nodeCount: 52 },
  { id: 'marketing', name: 'Marketing', type: 'creative', nodeCount: 31 },
];

// ─────────────────────────────────────────────────────
// DEMO CONTROLS
// ─────────────────────────────────────────────────────

const DemoControls: React.FC = () => {
  const { theme, universe } = useThemedUniverse();
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 100,
      }}
    >
      <UniverseTypeSelector />
      <DepthLevelSlider />
      
      {/* Theme info */}
      <div
        style={{
          padding: 8,
          background: theme.colors.surface,
          borderRadius: theme.borders.radius.md,
          fontSize: 11,
          opacity: 0.8,
        }}
      >
        Theme: {theme.metadata.name} ({theme.metadata.mood})
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// MEETING INTEGRATION
// ─────────────────────────────────────────────────────

const MeetingIntegration: React.FC<{
  sphereId: string;
  onClose: () => void;
}> = ({ sphereId, onClose }) => {
  const { theme } = useThemedUniverse();
  
  const objective: MeetingObjective = {
    title: `${sphereId.charAt(0).toUpperCase() + sphereId.slice(1)} Review`,
    description: `Strategic review for ${sphereId} sphere`,
    sphereId,
    criticality: 'medium',
  };
  
  const participants: ParticipantRegistry = {
    humans: [
      { id: 'user-1', displayName: 'You', role: 'owner' },
    ],
    agents: [
      { id: 'analyst', name: 'Analyst', role: 'analyst', capabilities: ['analysis'], outputCount: 0 },
    ],
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
      }}
    >
      <MeetingPage
        meetingId={`meeting-${sphereId}-${Date.now()}`}
        objective={objective}
        participants={participants}
        onMeetingClosed={() => onClose()}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────
// MAIN DEMO
// ─────────────────────────────────────────────────────

export const ThemedUniverseDemo: React.FC = () => {
  const [meetingSphere, setMeetingSphere] = React.useState<string | null>(null);
  
  return (
    <ThemedUniverseProvider
      initialUniverse={{
        universeId: 'demo',
        universeType: 'cosmic',
        depthLevel: 0,
      }}
      injectCSS
    >
      <DemoContent
        meetingSphere={meetingSphere}
        onStartMeeting={setMeetingSphere}
        onCloseMeeting={() => setMeetingSphere(null)}
      />
    </ThemedUniverseProvider>
  );
};

const DemoContent: React.FC<{
  meetingSphere: string | null;
  onStartMeeting: (sphereId: string) => void;
  onCloseMeeting: () => void;
}> = ({ meetingSphere, onStartMeeting, onCloseMeeting }) => {
  const { theme, universe, setActiveSphere } = useThemedUniverse();
  
  const handleSphereClick = (sphereId: string) => {
    setActiveSphere(sphereId);
  };
  
  const handleSphereDoubleClick = (sphereId: string) => {
    onStartMeeting(sphereId);
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.background,
      }}
    >
      {/* Controls */}
      <DemoControls />
      
      {/* Universe View */}
      <ThemedUniverseView
        spheres={DEMO_SPHERES}
        centerNode={{ id: 'nova', name: 'NOVA' }}
        onSphereClick={handleSphereClick}
        showHUD
      />
      
      {/* Double-click hint */}
      {universe.activeSphereId && !meetingSphere && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: theme.colors.surface,
            borderRadius: theme.borders.radius.md,
            fontSize: 12,
            border: theme.borders.style.accent,
          }}
        >
          <button
            onClick={() => onStartMeeting(universe.activeSphereId!)}
            style={{
              padding: '8px 16px',
              background: theme.colors.primary,
              color: theme.colors.textPrimary,
              border: 'none',
              borderRadius: theme.borders.radius.sm,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Start Meeting in {universe.activeSphereId}
          </button>
        </div>
      )}
      
      {/* Meeting overlay */}
      {meetingSphere && (
        <MeetingIntegration
          sphereId={meetingSphere}
          onClose={onCloseMeeting}
        />
      )}
    </div>
  );
};

export default ThemedUniverseDemo;
