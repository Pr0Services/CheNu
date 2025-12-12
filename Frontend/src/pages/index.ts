/**
 * CHE·NU - Pages Index
 */

// Main pages
export { HomePage, default as Home } from './HomePage';
export { DashboardPage } from './DashboardPage';
export { SettingsPage, default as Settings } from './SettingsPage';

// Auth pages
export * from './auth/LoginPage';
export * from './auth/RegisterPage';

// Space pages
export * from './spaces/MaisonPage';
export * from './spaces/EntreprisePage';
export * from './spaces/ProjetPage';
export * from './spaces/GouvernementPage';
export * from './spaces/ImmobilierPage';
export * from './spaces/AssociationsPage';

// Module pages
export * from './modules';
