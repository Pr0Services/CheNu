/* =====================================================
   CHE·NU — Personalization UI Module
   
   Settings panel and tab components.
   ===================================================== */

// Main panel
export { PersonalizationPanel } from './PersonalizationPanel';
export type { PersonalizationPanelProps, TabKey } from './PersonalizationPanel';

// Individual tabs
export {
  LayoutTab,
  AppearanceTab,
  SpheresTab,
  AgentsTab,
  XRTab,
  NotificationsTab,
  ShortcutsTab,
} from './tabs';

export type {
  LayoutTabProps,
  AppearanceTabProps,
  SpheresTabProps,
  AgentsTabProps,
  XRTabProps,
  NotificationsTabProps,
  ShortcutsTabProps,
} from './tabs';

// Default export
export { PersonalizationPanel as default } from './PersonalizationPanel';
