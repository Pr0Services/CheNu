/* =====================================================
   CHE·NU — XR Notifications Module
   
   Spatial 3D notifications for VR/AR environment.
   ===================================================== */

// Types
export * from './notification.types';

// Hook
export { useNotifications } from './useNotifications';
export type { UseNotificationsOptions, UseNotificationsReturn, ShowNotificationParams } from './useNotifications';

// Components
export {
  XRNotificationToast,
  XRNotificationContainer,
  XRSpatialNotification,
} from './XRNotificationToast';
export type {
  XRNotificationToastProps,
  XRNotificationContainerProps,
  XRSpatialNotificationProps,
} from './XRNotificationToast';

// Re-export defaults
export {
  DEFAULT_QUEUE,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_NOTIFICATION_THEME,
  NOTIFICATION_ICONS,
  createNotification,
} from './notification.types';
