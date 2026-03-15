import { setActivePinia, createPinia } from 'pinia';
import { useSiteStore } from '@/stores/site.store';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

beforeEach(() => {
    setActivePinia(createPinia());
});

describe('site.store', () => {
    describe('getBaseUrl()', () => {
        it('returns the API base URL', () => {
            const store = useSiteStore();
            const url = store.getBaseUrl();
            expect(typeof url).toBe('string');
            expect(url).toContain('interserver.net');
        });
    });

    describe('getSettings()', () => {
        it('returns vps module settings', () => {
            const store = useSiteStore();
            const vpsSettings = store.getSettings('vps');
            expect(vpsSettings).toBeDefined();
            expect(vpsSettings.TITLE).toBe('VPS');
            expect(vpsSettings.TABLE).toBe('vps');
            expect(vpsSettings.TITLE_FIELD).toBe('vps_hostname');
            expect(vpsSettings.PREFIX).toBe('vps');
        });

        it('returns domains module settings', () => {
            const store = useSiteStore();
            const domainSettings = store.getSettings('domains');
            expect(domainSettings).toBeDefined();
            expect(domainSettings.TITLE).toBe('Domain Registrations');
            expect(domainSettings.TABLE).toBe('domains');
            expect(domainSettings.TITLE_FIELD).toBe('domain_hostname');
            expect(domainSettings.PREFIX).toBe('domain');
        });

        it('returns undefined for unknown module', () => {
            const store = useSiteStore();
            const result = store.getSettings('nonexistent');
            expect(result).toBeUndefined();
        });
    });

    describe('setBreadcrums()', () => {
        it('sets breadcrumbs array', () => {
            const store = useSiteStore();
            const crumbs: [string, string][] = [
                ['/home', 'Home'],
                ['/vps', 'VPS'],
            ];
            store.setBreadcrums(crumbs);
            expect(store.breadcrums).toEqual(crumbs);
        });

        it('replaces existing breadcrumbs', () => {
            const store = useSiteStore();
            store.setBreadcrums([['/old', 'Old']]);
            store.setBreadcrums([['/new', 'New']]);
            expect(store.breadcrums).toEqual([['/new', 'New']]);
        });
    });

    describe('addBreadcrum()', () => {
        it('appends to breadcrumbs', () => {
            const store = useSiteStore();
            store.setBreadcrums([['/home', 'Home']]);
            store.addBreadcrum('/vps', 'VPS');
            expect(store.breadcrums).toHaveLength(2);
            expect(store.breadcrums[1]).toEqual(['/vps', 'VPS']);
        });
    });

    describe('setPageHeading()', () => {
        it('sets page_heading', () => {
            const store = useSiteStore();
            store.setPageHeading('My VPS List');
            expect(store.page_heading).toBe('My VPS List');
        });
    });

    describe('setTitle()', () => {
        it('sets title and document.title', () => {
            const store = useSiteStore();
            store.setTitle('Dashboard');
            expect(store.title).toBe('Dashboard');
            expect(document.title).toBe('Dashboard | My InterServer');
        });
    });

    describe('modules', () => {
        it('has pre-populated modules including domains, vps, backups', () => {
            const store = useSiteStore();
            expect(store.modules).toHaveProperty('domains');
            expect(store.modules).toHaveProperty('vps');
            expect(store.modules).toHaveProperty('backups');
            expect(store.modules).toHaveProperty('mail');
            expect(store.modules).toHaveProperty('licenses');
            expect(store.modules).toHaveProperty('ssl');
            expect(store.modules).toHaveProperty('webhosting');
            expect(store.modules).toHaveProperty('servers');
        });
    });
});
