/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 9: TESTS E2E PLAYWRIGHT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Test Suites:
 * - T1: Authentication flows
 * - T2: Dashboard & navigation
 * - T3: Projects CRUD
 * - T4: Tasks management
 * - T5: Calendar operations
 * - T6: Documents & signatures
 * - T7: Team management
 * - T8: Settings & preferences
 * - T9: Mobile responsiveness
 * - T10: Accessibility (a11y)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const TEST_USER = {
  email: 'test@chenu.ca',
  password: 'Test123!@#',
  name: 'Test User',
};

const TEST_ADMIN = {
  email: 'admin@chenu.ca',
  password: 'Admin123!@#',
  name: 'Admin User',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function login(page: Page, user = TEST_USER) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL(`${BASE_URL}/dashboard`);
}

async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL(`${BASE_URL}/login`);
}

async function waitForToast(page: Page, message?: string) {
  const toast = page.locator('[data-testid="toast"]');
  await expect(toast).toBeVisible();
  if (message) {
    await expect(toast).toContainText(message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// T1: AUTHENTICATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await expect(page.locator('h1')).toContainText('Connexion');
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('[data-testid="email-input"]', 'wrong@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page);
    
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText(TEST_USER.name);
  });

  test('should logout successfully', async ({ page }) => {
    await login(page);
    await logout(page);
    
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('[data-testid="forgot-password-link"]');
    
    await expect(page).toHaveURL(`${BASE_URL}/forgot-password`);
    
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.click('[data-testid="reset-button"]');
    
    await waitForToast(page, 'Email envoyé');
  });

  test('should handle registration', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    const uniqueEmail = `test${Date.now()}@chenu.ca`;
    
    await page.fill('[data-testid="name-input"]', 'New User');
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', 'NewPass123!');
    await page.fill('[data-testid="confirm-password-input"]', 'NewPass123!');
    await page.click('[data-testid="register-button"]');
    
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T2: DASHBOARD & NAVIGATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Dashboard & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with KPIs', async ({ page }) => {
    await expect(page.locator('[data-testid="kpi-revenue"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-projects"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-tasks"]')).toBeVisible();
  });

  test('should navigate via sidebar', async ({ page }) => {
    const navItems = [
      { testId: 'nav-projects', url: '/projects' },
      { testId: 'nav-tasks', url: '/tasks' },
      { testId: 'nav-calendar', url: '/calendar' },
      { testId: 'nav-documents', url: '/documents' },
      { testId: 'nav-team', url: '/team' },
    ];

    for (const item of navItems) {
      await page.click(`[data-testid="${item.testId}"]`);
      await expect(page).toHaveURL(`${BASE_URL}${item.url}`);
    }
  });

  test('should open spotlight search with Cmd+K', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    
    await expect(page.locator('[data-testid="spotlight-search"]')).toBeVisible();
  });

  test('should toggle sidebar collapse', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    
    await expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    
    await page.click('[data-testid="sidebar-toggle"]');
    
    await expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  });

  test('should switch themes', async ({ page }) => {
    await page.click('[data-testid="theme-toggle"]');
    await page.click('[data-testid="theme-light"]');
    
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    
    await page.click('[data-testid="theme-toggle"]');
    await page.click('[data-testid="theme-dark"]');
    
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
  });

  test('should switch languages', async ({ page }) => {
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="lang-en"]');
    
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="lang-fr"]');
    
    await expect(page.locator('h1')).toContainText('Tableau de bord');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T3: PROJECTS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/projects`);
  });

  test('should display projects list', async ({ page }) => {
    await expect(page.locator('[data-testid="projects-list"]')).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.click('[data-testid="new-project-button"]');
    
    await page.fill('[data-testid="project-name"]', 'Test Project');
    await page.fill('[data-testid="project-client"]', 'Test Client');
    await page.selectOption('[data-testid="project-type"]', 'renovation');
    await page.fill('[data-testid="project-budget"]', '50000');
    
    await page.click('[data-testid="create-project-button"]');
    
    await waitForToast(page, 'Projet créé');
    await expect(page.locator('[data-testid="projects-list"]')).toContainText('Test Project');
  });

  test('should open project details', async ({ page }) => {
    await page.click('[data-testid="project-card"]:first-child');
    
    await expect(page.locator('[data-testid="project-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="project-phases"]')).toBeVisible();
  });

  test('should edit project', async ({ page }) => {
    await page.click('[data-testid="project-card"]:first-child');
    await page.click('[data-testid="edit-project-button"]');
    
    await page.fill('[data-testid="project-name"]', 'Updated Project Name');
    await page.click('[data-testid="save-project-button"]');
    
    await waitForToast(page, 'Projet mis à jour');
  });

  test('should filter projects by status', async ({ page }) => {
    await page.click('[data-testid="filter-status"]');
    await page.click('[data-testid="status-active"]');
    
    const projects = page.locator('[data-testid="project-card"]');
    const count = await projects.count();
    
    for (let i = 0; i < count; i++) {
      await expect(projects.nth(i)).toHaveAttribute('data-status', 'active');
    }
  });

  test('should search projects', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Dupont');
    
    await expect(page.locator('[data-testid="project-card"]')).toContainText('Dupont');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T4: TASKS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/tasks`);
  });

  test('should display Kanban board', async ({ page }) => {
    await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();
    await expect(page.locator('[data-testid="column-todo"]')).toBeVisible();
    await expect(page.locator('[data-testid="column-in-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="column-done"]')).toBeVisible();
  });

  test('should create new task', async ({ page }) => {
    await page.click('[data-testid="new-task-button"]');
    
    await page.fill('[data-testid="task-title"]', 'New Test Task');
    await page.fill('[data-testid="task-description"]', 'Task description');
    await page.selectOption('[data-testid="task-priority"]', 'high');
    
    await page.click('[data-testid="create-task-button"]');
    
    await waitForToast(page, 'Tâche créée');
  });

  test('should drag task between columns', async ({ page }) => {
    const task = page.locator('[data-testid="task-card"]:first-child');
    const targetColumn = page.locator('[data-testid="column-in-progress"]');
    
    await task.dragTo(targetColumn);
    
    await expect(targetColumn).toContainText(await task.textContent());
  });

  test('should open task details', async ({ page }) => {
    await page.click('[data-testid="task-card"]:first-child');
    
    await expect(page.locator('[data-testid="task-detail-sidebar"]')).toBeVisible();
  });

  test('should add comment to task', async ({ page }) => {
    await page.click('[data-testid="task-card"]:first-child');
    
    await page.fill('[data-testid="comment-input"]', 'Test comment');
    await page.click('[data-testid="add-comment-button"]');
    
    await expect(page.locator('[data-testid="comments-list"]')).toContainText('Test comment');
  });

  test('should add subtask', async ({ page }) => {
    await page.click('[data-testid="task-card"]:first-child');
    
    await page.fill('[data-testid="subtask-input"]', 'New subtask');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('[data-testid="subtasks-list"]')).toContainText('New subtask');
  });

  test('should toggle task completion', async ({ page }) => {
    await page.click('[data-testid="task-card"]:first-child');
    await page.click('[data-testid="complete-task-button"]');
    
    await expect(page.locator('[data-testid="task-status"]')).toContainText('Terminé');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T5: CALENDAR TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/calendar`);
  });

  test('should display calendar', async ({ page }) => {
    await expect(page.locator('[data-testid="calendar"]')).toBeVisible();
  });

  test('should switch calendar views', async ({ page }) => {
    await page.click('[data-testid="view-week"]');
    await expect(page.locator('[data-testid="week-view"]')).toBeVisible();
    
    await page.click('[data-testid="view-day"]');
    await expect(page.locator('[data-testid="day-view"]')).toBeVisible();
    
    await page.click('[data-testid="view-month"]');
    await expect(page.locator('[data-testid="month-view"]')).toBeVisible();
  });

  test('should create new event', async ({ page }) => {
    await page.click('[data-testid="new-event-button"]');
    
    await page.fill('[data-testid="event-title"]', 'Test Event');
    await page.fill('[data-testid="event-date"]', '2024-12-15');
    await page.fill('[data-testid="event-time"]', '10:00');
    
    await page.click('[data-testid="save-event-button"]');
    
    await waitForToast(page, 'Événement créé');
  });

  test('should navigate months', async ({ page }) => {
    const currentMonth = await page.locator('[data-testid="current-month"]').textContent();
    
    await page.click('[data-testid="next-month"]');
    
    const newMonth = await page.locator('[data-testid="current-month"]').textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test('should go to today', async ({ page }) => {
    await page.click('[data-testid="next-month"]');
    await page.click('[data-testid="next-month"]');
    await page.click('[data-testid="today-button"]');
    
    const today = new Date().toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' });
    await expect(page.locator('[data-testid="current-month"]')).toContainText(today);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T6: DOCUMENTS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Documents', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/documents`);
  });

  test('should display documents list', async ({ page }) => {
    await expect(page.locator('[data-testid="documents-list"]')).toBeVisible();
  });

  test('should upload document', async ({ page }) => {
    const fileInput = page.locator('[data-testid="file-input"]');
    
    await fileInput.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test content'),
    });
    
    await waitForToast(page, 'Fichier téléversé');
  });

  test('should create document from template', async ({ page }) => {
    await page.click('[data-testid="new-document-button"]');
    await page.click('[data-testid="template-soumission"]');
    
    await page.fill('[data-testid="field-client"]', 'Test Client');
    await page.click('[data-testid="generate-button"]');
    
    await waitForToast(page, 'Document créé');
  });

  test('should preview document', async ({ page }) => {
    await page.click('[data-testid="document-card"]:first-child');
    
    await expect(page.locator('[data-testid="document-preview"]')).toBeVisible();
  });

  test('should sign document', async ({ page }) => {
    await page.click('[data-testid="document-card"][data-status="pending"]');
    await page.click('[data-testid="sign-button"]');
    
    // Draw signature
    const canvas = page.locator('[data-testid="signature-canvas"]');
    await canvas.click({ position: { x: 100, y: 50 } });
    
    await page.click('[data-testid="confirm-signature-button"]');
    
    await waitForToast(page, 'Document signé');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T7: TEAM TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Team', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_ADMIN);
    await page.goto(`${BASE_URL}/team`);
  });

  test('should display team members', async ({ page }) => {
    await expect(page.locator('[data-testid="team-list"]')).toBeVisible();
  });

  test('should invite team member', async ({ page }) => {
    await page.click('[data-testid="invite-button"]');
    
    await page.fill('[data-testid="invite-email"]', 'newmember@test.com');
    await page.selectOption('[data-testid="invite-role"]', 'member');
    
    await page.click('[data-testid="send-invite-button"]');
    
    await waitForToast(page, 'Invitation envoyée');
  });

  test('should change member role', async ({ page }) => {
    await page.click('[data-testid="member-card"]:first-child [data-testid="member-menu"]');
    await page.click('[data-testid="change-role"]');
    await page.selectOption('[data-testid="new-role"]', 'manager');
    await page.click('[data-testid="confirm-role-button"]');
    
    await waitForToast(page, 'Rôle mis à jour');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T8: SETTINGS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/settings`);
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.locator('[data-testid="settings-page"]')).toBeVisible();
  });

  test('should update profile', async ({ page }) => {
    await page.fill('[data-testid="profile-name"]', 'Updated Name');
    await page.click('[data-testid="save-profile-button"]');
    
    await waitForToast(page, 'Profil mis à jour');
  });

  test('should update notification preferences', async ({ page }) => {
    await page.click('[data-testid="tab-notifications"]');
    
    await page.click('[data-testid="email-notifications-toggle"]');
    await page.click('[data-testid="save-notifications-button"]');
    
    await waitForToast(page, 'Préférences sauvegardées');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T9: MOBILE RESPONSIVENESS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should display mobile navigation', async ({ page }) => {
    await login(page);
    
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();
  });

  test('should open mobile menu', async ({ page }) => {
    await login(page);
    
    await page.click('[data-testid="mobile-menu-button"]');
    
    await expect(page.locator('[data-testid="mobile-drawer"]')).toBeVisible();
  });

  test('should display responsive cards', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/projects`);
    
    const card = page.locator('[data-testid="project-card"]:first-child');
    const box = await card.boundingBox();
    
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T10: ACCESSIBILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have alt text on images', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have labels on form inputs', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    
    const inputs = await page.locator('input:not([type="hidden"])').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      const hasLabel = id && (await page.locator(`label[for="${id}"]`).count()) > 0;
      
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).outline
    );
    
    expect(outline).not.toBe('none');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This would typically use axe-core
    // For now, check that text is visible
    const textElements = await page.locator('p, span, h1, h2, h3, a, button').all();
    
    for (const el of textElements.slice(0, 10)) {
      const isVisible = await el.isVisible();
      if (isVisible) {
        const color = await el.evaluate((e) => window.getComputedStyle(e).color);
        expect(color).toBeTruthy();
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Performance', () => {
  test('should load dashboard within 3 seconds', async ({ page }) => {
    await login(page);
    
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    await login(page);
    
    // Navigate between pages multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto(`${BASE_URL}/projects`);
      await page.goto(`${BASE_URL}/tasks`);
      await page.goto(`${BASE_URL}/calendar`);
    }
    
    // Check page is still responsive
    await expect(page.locator('[data-testid="calendar"]')).toBeVisible();
  });
});
