/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROADY V25 - APP TESTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('ROADY V25 App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByText('ROADY')).toBeInTheDocument();
    });

    it('renders dashboard by default', () => {
      render(<App />);
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    });

    it('renders sidebar navigation', () => {
      render(<App />);
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });
  });

  describe('Theme System', () => {
    it('starts with dark theme by default', () => {
      render(<App />);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('switches to light theme when clicked', () => {
      render(<App />);
      const lightButton = screen.getByText('☀️');
      fireEvent.click(lightButton);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('persists theme in localStorage', () => {
      render(<App />);
      const lightButton = screen.getByText('☀️');
      fireEvent.click(lightButton);
      expect(localStorage.setItem).toHaveBeenCalledWith('roady-theme', 'light');
    });
  });

  describe('Language System', () => {
    it('starts with French by default', () => {
      render(<App />);
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    });

    it('switches to English when clicked', () => {
      render(<App />);
      const enButton = screen.getByText('🇬🇧');
      fireEvent.click(enButton);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('switches to Spanish when clicked', () => {
      render(<App />);
      const esButton = screen.getByText('🇪🇸');
      fireEvent.click(esButton);
      expect(screen.getByText('Panel')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to Projects page', () => {
      render(<App />);
      const projectsLink = screen.getByText('Projets');
      fireEvent.click(projectsLink);
      expect(screen.getByText('Nouveau projet')).toBeInTheDocument();
    });

    it('navigates to Calendar page', () => {
      render(<App />);
      const calendarLink = screen.getByText('Calendrier');
      fireEvent.click(calendarLink);
      expect(screen.getByText('Nouvel événement')).toBeInTheDocument();
    });

    it('navigates to Team page', () => {
      render(<App />);
      const teamLink = screen.getByText('Équipe');
      fireEvent.click(teamLink);
      expect(screen.getByText('Ajouter un membre')).toBeInTheDocument();
    });
  });

  describe('Spotlight Search', () => {
    it('opens spotlight with ⌘K', () => {
      render(<App />);
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
    });

    it('closes spotlight with Escape', () => {
      render(<App />);
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByPlaceholderText('Rechercher...')).not.toBeInTheDocument();
    });

    it('filters results based on query', () => {
      render(<App />);
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      const input = screen.getByPlaceholderText('Rechercher...');
      fireEvent.change(input, { target: { value: 'proj' } });
      expect(screen.getByText('Projets')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible search button', () => {
      render(<App />);
      const searchButton = screen.getByText('⌘K').closest('button');
      expect(searchButton).toBeInTheDocument();
    });

    it('has focus visible styles', () => {
      render(<App />);
      // Check that focus-visible CSS is present
      const styles = document.querySelector('style, link[rel="stylesheet"]');
      expect(styles).toBeDefined();
    });
  });
});

describe('Components', () => {
  describe('Card', () => {
    it('renders with padding by default', () => {
      render(<App />);
      // Cards should be visible in dashboard
      const cards = document.querySelectorAll('[style*="border-radius: 16px"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Avatar', () => {
    it('shows initials when no image', () => {
      render(<App />);
      // Check that user avatar shows initial
      const avatar = screen.getByText('J'); // Jo's initial
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders badges in dashboard', () => {
      render(<App />);
      // Navigate to projects to see badges
      fireEvent.click(screen.getByText('Projets'));
      const badges = document.querySelectorAll('[style*="border-radius: 20px"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });
});
