import { test as setup, expect } from '@playwright/test';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://my.interserver.net/apiv2';

/**
 * Authenticates with real credentials from .env.local and saves browser
 * storage state so all 'real' project tests start already logged-in.
 *
 * Supported auth methods (checked in order):
 *   1. TEST_SESSION_ID — pre-authenticated session ID (most reliable)
 *   2. TEST_API_KEY — API key authentication
 *   3. TEST_USERNAME + TEST_PASSWORD — login via API (may fail if account requires email verification or 2FA)
 */
setup('authenticate with real credentials', async ({ page, request }) => {
    setup.setTimeout(120000);

    const sessionId = process.env.TEST_SESSION_ID;
    const apiKey = process.env.TEST_API_KEY;
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    let authState: { sessionId?: string; apiKey?: string; user: Record<string, any> } | null = null;

    // Method 1: Pre-authenticated session ID
    if (sessionId) {
        console.log('[auth] Using TEST_SESSION_ID');
        // Fetch account info to populate user data
        const accountResponse = await request.get(`${API_BASE_URL}/account`, {
            headers: { sessionid: sessionId },
        });
        let user: Record<string, any> = { sessionId };
        if (accountResponse.ok()) {
            const accountData = await accountResponse.json().catch(() => ({}));
            user = {
                sessionId,
                account_id: accountData.account_id,
                account_lid: accountData.account_lid,
                gravatar: accountData.gravatar,
                ima: accountData.ima || 'client',
                name: accountData.name,
            };
        }
        authState = { sessionId, user };
    }

    // Method 2: API key
    if (!authState && apiKey) {
        console.log('[auth] Using TEST_API_KEY');
        const accountResponse = await request.get(`${API_BASE_URL}/account`, {
            headers: { 'X-API-KEY': apiKey },
        });
        let user: Record<string, any> = {};
        if (accountResponse.ok()) {
            const accountData = await accountResponse.json().catch(() => ({}));
            user = {
                account_id: accountData.account_id,
                account_lid: accountData.account_lid,
                gravatar: accountData.gravatar,
                ima: accountData.ima || 'client',
                name: accountData.name,
            };
        }
        authState = { apiKey, user };
    }

    // Method 3: Username + password login via API
    if (!authState && username && password) {
        console.log('[auth] Using TEST_USERNAME + TEST_PASSWORD');
        const loginResponse = await request.post(`${API_BASE_URL}/login`, {
            data: { login: username, passwd: password, remember: false },
        });
        const body = await loginResponse.json().catch(() => null);
        console.log(`[auth] Login response: status=${loginResponse.status()} body=${JSON.stringify(body)}`);

        if (loginResponse.ok() && body?.sessionId) {
            authState = {
                sessionId: body.sessionId,
                user: {
                    sessionId: body.sessionId,
                    account_id: body.account_id,
                    account_lid: body.account_lid,
                    gravatar: body.gravatar,
                    ima: body.ima || 'client',
                    name: body.name,
                },
            };
        } else if (body?.field === 'verify') {
            throw new Error(
                'Login requires email verification which cannot be automated.\n' +
                'Add one of these to .env.local:\n' +
                '  TEST_SESSION_ID=<your session id>  (get from browser localStorage after logging in manually)\n' +
                '  TEST_API_KEY=<your api key>  (generate from Account > API Access)'
            );
        } else if (body?.field === 'tfa') {
            throw new Error(
                'Login requires two-factor authentication which cannot be automated.\n' +
                'Add one of these to .env.local:\n' +
                '  TEST_SESSION_ID=<your session id>\n' +
                '  TEST_API_KEY=<your api key>'
            );
        } else {
            throw new Error(`Login failed: ${JSON.stringify(body)}`);
        }
    }

    if (!authState) {
        throw new Error(
            'No authentication credentials found. Add to .env.local:\n' +
            '  TEST_SESSION_ID=<session id>  (preferred)\n' +
            '  TEST_API_KEY=<api key>\n' +
            '  TEST_USERNAME + TEST_PASSWORD  (may not work with email verification/2FA)'
        );
    }

    // Inject auth state into the browser
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(
        (auth) => {
            if (auth.sessionId) {
                localStorage.setItem('sessionId', auth.sessionId);
            }
            if (auth.apiKey) {
                localStorage.setItem('apiKey', auth.apiKey);
            }
            localStorage.setItem('user', JSON.stringify(auth.user));
        },
        authState
    );

    // Navigate to home to verify auth works
    await page.goto('/');
    await expect(page).not.toHaveURL(/login/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Save signed-in state for reuse by all 'real' project tests
    await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
