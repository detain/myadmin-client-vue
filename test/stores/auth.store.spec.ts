import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertStore } from '@/stores/alert.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
});

describe('auth.store', () => {
    describe('initial state', () => {
        it('has null sessionId and empty user', ({ annotate }) => {
            annotate('Auth Store: verifies initial state has null sessionId and empty user object when no localStorage data exists');
            localStorage.removeItem('sessionId');
            localStorage.removeItem('user');
            setActivePinia(createPinia());
            const store = useAuthStore();
            expect(store.sessionId).toBeNull();
            expect(store.user).toEqual({});
        });

        it('has null apiKey', ({ annotate }) => {
            annotate('Auth Store: verifies apiKey defaults to null on store initialization');
            const store = useAuthStore();
            expect(store.apiKey).toBeNull();
        });

        it('has default opts', ({ annotate }) => {
            annotate('Auth Store: verifies default opts flags (tfa=false, verify=false, captcha=true) on initialization');
            const store = useAuthStore();
            expect(store.opts.tfa).toBe(false);
            expect(store.opts.verify).toBe(false);
            expect(store.opts.captcha).toBe(true);
        });

        it('has default counts', ({ annotate }) => {
            annotate('Auth Store: verifies service counts default to zero for vps, websites, and servers');
            const store = useAuthStore();
            expect(store.counts).toEqual({ vps: 0, websites: 0, servers: 0 });
        });
    });

    describe('loggedIn()', () => {
        it('returns false when no session or apiKey', ({ annotate }) => {
            annotate('Auth Store: verifies loggedIn() returns false when both sessionId and apiKey are null');
            localStorage.removeItem('sessionId');
            setActivePinia(createPinia());
            const store = useAuthStore();
            store.sessionId = null;
            store.apiKey = null;
            expect(store.loggedIn()).toBe(false);
        });

        it('returns true when sessionId is set', ({ annotate }) => {
            annotate('Auth Store: verifies loggedIn() returns true when a valid sessionId exists');
            const store = useAuthStore();
            store.sessionId = 'abc123';
            expect(store.loggedIn()).toBe(true);
        });

        it('returns true when apiKey is set', ({ annotate }) => {
            annotate('Auth Store: verifies loggedIn() returns true when an API key is set without a sessionId');
            const store = useAuthStore();
            store.apiKey = 'key456';
            expect(store.loggedIn()).toBe(true);
        });
    });

    describe('login()', () => {
        it('sets user and sessionId with valid credentials', async ({ annotate }) => {
            await annotate('Auth Store: verifies POST /login sets user, sessionId, and persists both to localStorage on valid credentials');
            const mockUser = { sessionId: 'sess123', account_id: 1, name: 'Test User' };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);

            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });

            expect(store.user).toEqual(mockUser);
            expect(store.sessionId).toBe('sess123');
            expect(localStorage.getItem('sessionId')).toBe('sess123');
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        });

        it('sets error via alertStore with invalid credentials', async ({ annotate }) => {
            await annotate('Auth Store: verifies login failure triggers alert-danger in alertStore with error message');
            const mockError = { message: 'Invalid credentials' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.login({ username: 'bad', password: 'bad' });

            const alertStore = useAlertStore();
            expect(alertStore.alert).not.toBeNull();
            expect(alertStore.alert?.type).toBe('alert-danger');
        });

        it('sets opts.tfa when error field is tfa', async ({ annotate }) => {
            await annotate('Auth Store: verifies login sets opts.tfa=true when API returns error with field=tfa indicating two-factor required');
            const mockError = { message: 'TFA required', field: 'tfa' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });

            expect(store.opts.tfa).toBe(true);
        });
    });

    describe('logout()', () => {
        it('clears user and sessionId', async ({ annotate }) => {
            await annotate('Auth Store: verifies logout clears user, sessionId, apiKey from store and removes them from localStorage');
            vi.mocked(fetchWrapper.getNoLogout).mockResolvedValue({});

            const store = useAuthStore();
            store.user = { sessionId: 'sess123', account_id: 1, name: 'Test' };
            store.sessionId = 'sess123';
            localStorage.setItem('user', JSON.stringify(store.user));
            localStorage.setItem('sessionId', 'sess123');

            await store.logout();

            expect(store.user).toEqual({});
            expect(store.sessionId).toBeNull();
            expect(store.apiKey).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
            expect(localStorage.getItem('sessionId')).toBeNull();
        });
    });

    describe('load()', () => {
        it('fetches login page data and sets logo, captcha, counts', async ({ annotate }) => {
            await annotate('Auth Store: verifies load() fetches login page config and populates logo, captcha, language, and service counts');
            const mockResponse = {
                logo: '//example.com/logo.png',
                captcha: 'captcha-data-abc',
                language: 'en-US',
                counts: { vps: 5, websites: 3, servers: 1 },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useAuthStore();
            await store.load();

            expect(store.logo).toBe('//example.com/logo.png');
            expect(store.captcha).toBe('captcha-data-abc');
            expect(store.language).toBe('en-US');
            expect(store.counts).toEqual({ vps: 5, websites: 3, servers: 1 });
        });
    });

    describe('reloadCaptcha()', () => {
        it('updates captcha', async ({ annotate }) => {
            await annotate('Auth Store: verifies reloadCaptcha() fetches a fresh captcha value and replaces the existing one');
            vi.mocked(fetchWrapper.get).mockResolvedValue({ captcha: 'new-captcha-xyz' });

            const store = useAuthStore();
            store.captcha = 'old-captcha';
            await store.reloadCaptcha();

            expect(store.captcha).toBe('new-captcha-xyz');
        });
    });

    describe('signup()', () => {
        it('sets user on success', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup() sets user and sessionId in store on successful registration');
            const mockUser = { sessionId: 'signup-sess', account_id: 2, name: 'New User' };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);

            const store = useAuthStore();
            await store.signup({ email: 'new@example.com', password: 'pass' });

            expect(store.user).toEqual(mockUser);
            expect(store.sessionId).toBe('signup-sess');
        });

        it('stores sessionId and user in localStorage on success', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup() persists remember flag, sessionId, and user JSON to localStorage');
            const mockUser = { sessionId: 'signup-sess', account_id: 2 };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);

            const store = useAuthStore();
            await store.signup({ email: 'new@example.com', password: 'pass' });

            expect(localStorage.getItem('remember')).not.toBeNull();
            expect(localStorage.getItem('sessionId')).toBe('signup-sess');
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        });

        it('sets error via alertStore on failure', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup failure triggers alert-danger in alertStore');
            const mockError = { message: 'Signup failed' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.signup({ email: 'bad@example.com', password: 'x' });

            const alertStore = useAlertStore();
            expect(alertStore.alert).not.toBeNull();
            expect(alertStore.alert?.type).toBe('alert-danger');
        });

        it('sets opts.tfa when error field is tfa', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup sets opts.tfa=true when API error field is tfa');
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'TFA required', field: 'tfa' });
            const store = useAuthStore();
            await store.signup({ email: 'test@example.com', password: 'pass' });
            expect(store.opts.tfa).toBe(true);
        });

        it('sets opts.verify when error field is email_confirmation', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup sets opts.verify=true when API error field is email_confirmation');
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'Verify', field: 'email_confirmation' });
            const store = useAuthStore();
            await store.signup({ email: 'test@example.com', password: 'pass' });
            expect(store.opts.verify).toBe(true);
        });

        it('sets opts.captcha when error field is captcha', async ({ annotate }) => {
            await annotate('Auth Store: verifies signup sets opts.captcha=true when API error field is captcha');
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'Captcha', field: 'captcha' });
            const store = useAuthStore();
            await store.signup({ email: 'test@example.com', password: 'pass' });
            expect(store.opts.captcha).toBe(true);
        });
    });

    describe('login() error field branches', () => {
        it('sets opts.verify when error field is verify', async ({ annotate }) => {
            await annotate('Auth Store: verifies login sets opts.verify=true when API error field is verify');
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'Verify', field: 'verify' });
            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });
            expect(store.opts.verify).toBe(true);
        });

        it('sets opts.captcha when error field is captcha', async ({ annotate }) => {
            await annotate('Auth Store: verifies login sets opts.captcha=true when API error field is captcha');
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'Captcha', field: 'captcha' });
            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });
            expect(store.opts.captcha).toBe(true);
        });

        it('stores remember=false in localStorage', async ({ annotate }) => {
            await annotate('Auth Store: verifies login persists remember=false preference to localStorage');
            const mockUser = { sessionId: 'sess123' };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);
            const store = useAuthStore();
            store.remember = false;
            await store.login({ username: 'test', password: 'pass' });
            expect(localStorage.getItem('remember')).toBe('false');
        });
    });

    describe('setOAuthSession()', () => {
        it('sets user and sessionId from OAuth data', ({ annotate }) => {
            annotate('Auth Store: verifies setOAuthSession populates user, sessionId, and localStorage from OAuth provider response');
            const store = useAuthStore();
            const oauthData = {
                sessionId: 'oauth-sess',
                account_id: 10,
                account_lid: 'user@example.com',
                ima: 'client',
                name: 'OAuth User',
                gravatar: 'https://gravatar.com/avatar/123',
            };
            store.setOAuthSession(oauthData);
            expect(store.sessionId).toBe('oauth-sess');
            expect(store.user.account_id).toBe(10);
            expect(store.user.account_lid).toBe('user@example.com');
            expect(store.user.name).toBe('OAuth User');
            expect(localStorage.getItem('sessionId')).toBe('oauth-sess');
            expect(JSON.parse(localStorage.getItem('user') || '{}')).toMatchObject({
                sessionId: 'oauth-sess',
                account_id: 10,
            });
        });

        it('uses defaults for missing oauth fields', ({ annotate }) => {
            annotate('Auth Store: verifies setOAuthSession applies default values (ima=client, name=empty, gravatar=empty) for missing OAuth fields');
            const store = useAuthStore();
            store.setOAuthSession({ sessionId: 'oauth-sess', account_id: 10, account_lid: 'user@test.com' });
            expect(store.user.ima).toBe('client');
            expect(store.user.name).toBe('');
            expect(store.user.gravatar).toBe('');
        });
    });

    describe('sudo()', () => {
        it('sets sessionId and loads account', async ({ annotate }) => {
            await annotate('Auth Store: verifies sudo() sets new sessionId, persists to localStorage, and loads account data from API');
            const store = useAuthStore();
            // accountStore.load() fetches /account and expects response.data
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                data: {
                    account_id: 5,
                    account_lid: 'admin@test.com',
                    name: 'Admin',
                },
                gravatar: 'https://gravatar.com/test',
                custid: 5,
                ima: 'client',
            });
            await store.sudo('sudo-session-123');
            // Wait for the async accountStore.load().then() to complete
            await new Promise((r) => setTimeout(r, 50));
            expect(store.sessionId).toBe('sudo-session-123');
            expect(localStorage.getItem('sessionId')).toBe('sudo-session-123');
            expect(store.user.account_id).toBe(5);
        });

        it('initializes user to empty object when user is falsy', async ({ annotate }) => {
            await annotate('Auth Store: verifies sudo() initializes user to empty object when current user is null/falsy before setting sessionId');
            const store = useAuthStore();
            // Set user to a falsy value to trigger the !this.user branch (line 89-90)
            store.$patch({ user: null as any });
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                data: {
                    account_id: 7,
                    account_lid: 'sudo@test.com',
                    name: 'Sudo User',
                },
                gravatar: 'https://gravatar.com/sudo',
                custid: 7,
                ima: 'client',
            });
            await store.sudo('sudo-session-456');
            await new Promise((r) => setTimeout(r, 50));
            expect(store.sessionId).toBe('sudo-session-456');
            expect(store.user).toBeTruthy();
            expect(store.user.account_id).toBe(7);
        });

        it('handles sudo when user has no properties', async ({ annotate }) => {
            await annotate('Auth Store: verifies sudo() correctly sets sessionId on user object even when user starts as empty {}');
            const store = useAuthStore();
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                data: {
                    account_id: 8,
                    account_lid: 'sudo2@test.com',
                    name: 'Sudo User 2',
                },
                gravatar: 'https://gravatar.com/sudo2',
                custid: 8,
                ima: 'client',
            });
            // user starts as {} (truthy), sudo should still set sessionId on it
            await store.sudo('sudo-session-789');
            await new Promise((r) => setTimeout(r, 50));
            expect(store.sessionId).toBe('sudo-session-789');
            expect(store.user.sessionId).toBe('sudo-session-789');
        });
    });

    describe('load() error handling', () => {
        it('does not throw on error', async ({ annotate }) => {
            await annotate('Auth Store: verifies load() gracefully handles network errors without throwing');
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('Network error'));
            const store = useAuthStore();
            await expect(store.load()).resolves.toBeUndefined();
        });
    });

    describe('reloadCaptcha() error handling', () => {
        it('does not throw on error', async ({ annotate }) => {
            await annotate('Auth Store: verifies reloadCaptcha() gracefully handles network errors without throwing');
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('Network error'));
            const store = useAuthStore();
            await expect(store.reloadCaptcha()).resolves.toBeUndefined();
        });
    });

    describe('logout() error handling', () => {
        it('still clears state on API error', async ({ annotate }) => {
            await annotate('Auth Store: verifies logout still clears sessionId and user from state even when the logout API call fails');
            vi.mocked(fetchWrapper.getNoLogout).mockRejectedValue(new Error('Network error'));
            const store = useAuthStore();
            store.sessionId = 'test';
            store.user = { sessionId: 'test' };
            await store.logout();
            expect(store.sessionId).toBeNull();
            expect(store.user).toEqual({});
        });
    });

    describe('resetStores()', () => {
        it('resets all stores', ({ annotate }) => {
            annotate('Auth Store: verifies resetStores() clears state of all dependent stores including alertStore');
            const store = useAuthStore();
            const alertStore = useAlertStore();
            alertStore.success('test');
            store.resetStores();
            expect(alertStore.alert).toBeNull();
        });
    });
});
