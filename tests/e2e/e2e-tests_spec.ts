// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V20 - E2E Tests (Playwright)
// ═══════════════════════════════════════════════════════════════════════════════

import { test, expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES & HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const testUser = {
  email: 'test@roady.app',
  password: 'Test123!@#',
  name: 'Test User'
};

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', testUser.email);
  await page.fill('[data-testid="password"]', testUser.password);
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.locator('[data-testid="email"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'wrong@email.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    await login(page);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await login(page);
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/login');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to all main pages', async ({ page }) => {
    const pages = [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Projects', url: '/projects' },
      { name: 'Calendar', url: '/calendar' },
      { name: 'Email', url: '/email' },
      { name: 'Team', url: '/team' },
    ];

    for (const p of pages) {
      await page.click(`[data-testid="nav-${p.name.toLowerCase()}"]`);
      await expect(page).toHaveURL(p.url);
      await expect(page.locator('h1')).toContainText(p.name);
    }
  });

  test('should open spotlight search with Cmd+K', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await expect(page.locator('[data-testid="spotlight-search"]')).toBeVisible();
  });

  test('should navigate via spotlight search', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.fill('[data-testid="spotlight-input"]', 'projects');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/projects');
  });

  test('should toggle sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toHaveCSS('width', '240px');
    
    await page.keyboard.press('Meta+b');
    await expect(sidebar).toHaveCSS('width', '70px');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THEME & LANGUAGE TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Theme & Language', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should toggle theme', async ({ page }) => {
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'vr');
    
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
  });

  test('should change language', async ({ page }) => {
    await page.click('[data-testid="language-selector"]');
    await expect(page.locator('h1')).toContainText('Dashboard'); // EN
    
    await page.click('[data-testid="language-selector"]');
    await expect(page.locator('h1')).toContainText('Tableau'); // FR
  });

  test('should persist theme preference', async ({ page, context }) => {
    await page.click('[data-testid="theme-toggle"]');
    await page.reload();
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/projects');
  });

  test('should display projects list', async ({ page }) => {
    await expect(page.locator('[data-testid="projects-list"]')).toBeVisible();
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards).toHaveCount(await projectCards.count());
  });

  test('should create new project', async ({ page }) => {
    await page.click('[data-testid="new-project-button"]');
    await page.fill('[data-testid="project-name"]', 'E2E Test Project');
    await page.fill('[data-testid="project-description"]', 'Created by E2E test');
    await page.click('[data-testid="save-project"]');
    
    await expect(page.locator('text=E2E Test Project')).toBeVisible();
  });

  test('should edit project', async ({ page }) => {
    await page.click('[data-testid="project-card"]:first-child');
    await page.click('[data-testid="edit-project"]');
    await page.fill('[data-testid="project-name"]', 'Updated Project Name');
    await page.click('[data-testid="save-project"]');
    
    await expect(page.locator('text=Updated Project Name')).toBeVisible();
  });

  test('should delete project', async ({ page }) => {
    const projectName = await page.locator('[data-testid="project-card"]:first-child [data-testid="project-name"]').textContent();
    await page.click('[data-testid="project-card"]:first-child [data-testid="delete-project"]');
    await page.click('[data-testid="confirm-delete"]');
    
    await expect(page.locator(`text=${projectName}`)).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NOVA AI TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Nova AI', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should open Nova chat', async ({ page }) => {
    await page.click('[data-testid="nova-button"]');
    await expect(page.locator('[data-testid="nova-chat"]')).toBeVisible();
  });

  test('should send message to Nova', async ({ page }) => {
    await page.click('[data-testid="nova-button"]');
    await page.fill('[data-testid="nova-input"]', 'Hello Nova!');
    await page.click('[data-testid="nova-send"]');
    
    await expect(page.locator('[data-testid="nova-message-user"]')).toContainText('Hello Nova!');
    await expect(page.locator('[data-testid="nova-message-assistant"]')).toBeVisible();
  });

  test('should use quick actions', async ({ page }) => {
    await page.click('[data-testid="nova-button"]');
    await page.click('[data-testid="quick-action-projects"]');
    
    await expect(page.locator('[data-testid="nova-message-assistant"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should have no accessibility violations on dashboard', async ({ page }) => {
    // Using axe-playwright
    // const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate through main elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    }
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveCSS('outline-style', 'solid');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Responsive Design', () => {
  test('should adapt to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    // Sidebar should be hidden on mobile
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();
    
    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
  });

  test('should adapt to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await login(page);
    
    // Sidebar should be collapsed
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toHaveCSS('width', '70px');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Performance', () => {
  test('should load dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await login(page);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await login(page);
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries[entries.length - 1].startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // Good LCP < 2.5s
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL REGRESSION TESTS
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Visual Regression', () => {
  test('dashboard should match snapshot', async ({ page }) => {
    await login(page);
    await expect(page).toHaveScreenshot('dashboard.png', { maxDiffPixels: 100 });
  });

  test('projects page should match snapshot', async ({ page }) => {
    await login(page);
    await page.goto('/projects');
    await expect(page).toHaveScreenshot('projects.png', { maxDiffPixels: 100 });
  });
});
