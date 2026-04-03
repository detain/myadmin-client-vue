import { setActivePinia, createPinia } from 'pinia';
import { useSiteStore } from '@/stores/site.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

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
    vi.clearAllMocks();
});

describe('site.store', () => {
    describe('getBaseUrl()', () => {
        it('returns the API base URL', ({ annotate }) => {
            annotate('Site Store: verifies getBaseUrl() returns a string containing the interserver.net API base URL');
            const store = useSiteStore();
            const url = store.getBaseUrl();
            expect(typeof url).toBe('string');
            expect(url).toContain('interserver.net');
        });
    });

    describe('getSettings()', () => {
        it('returns vps module settings', ({ annotate }) => {
            annotate('Site Store: verifies getSettings(vps) returns correct TITLE, TABLE, TITLE_FIELD, and PREFIX for VPS module');
            const store = useSiteStore();
            const vpsSettings = store.getSettings('vps');
            expect(vpsSettings).toBeDefined();
            expect(vpsSettings.TITLE).toBe('VPS');
            expect(vpsSettings.TABLE).toBe('vps');
            expect(vpsSettings.TITLE_FIELD).toBe('vps_hostname');
            expect(vpsSettings.PREFIX).toBe('vps');
        });

        it('returns domains module settings', ({ annotate }) => {
            annotate('Site Store: verifies getSettings(domains) returns correct TITLE, TABLE, TITLE_FIELD, and PREFIX for domains module');
            const store = useSiteStore();
            const domainSettings = store.getSettings('domains');
            expect(domainSettings).toBeDefined();
            expect(domainSettings.TITLE).toBe('Domain Registrations');
            expect(domainSettings.TABLE).toBe('domains');
            expect(domainSettings.TITLE_FIELD).toBe('domain_hostname');
            expect(domainSettings.PREFIX).toBe('domain');
        });

        it('returns undefined for unknown module', ({ annotate }) => {
            annotate('Site Store: verifies getSettings() returns undefined for a non-existent module name');
            const store = useSiteStore();
            const result = store.getSettings('nonexistent');
            expect(result).toBeUndefined();
        });
    });

    describe('setBreadcrums()', () => {
        it('sets breadcrumbs array', ({ annotate }) => {
            annotate('Site Store: verifies setBreadcrums() stores the provided breadcrumb path/label pairs');
            const store = useSiteStore();
            const crumbs: [string, string][] = [
                ['/home', 'Home'],
                ['/vps', 'VPS'],
            ];
            store.setBreadcrums(crumbs);
            expect(store.breadcrums).toEqual(crumbs);
        });

        it('replaces existing breadcrumbs', ({ annotate }) => {
            annotate('Site Store: verifies setBreadcrums() replaces previous breadcrumbs entirely instead of appending');
            const store = useSiteStore();
            store.setBreadcrums([['/old', 'Old']]);
            store.setBreadcrums([['/new', 'New']]);
            expect(store.breadcrums).toEqual([['/new', 'New']]);
        });
    });

    describe('addBreadcrum()', () => {
        it('appends to breadcrumbs', ({ annotate }) => {
            annotate('Site Store: verifies addBreadcrum() appends a new breadcrumb entry to the existing array');
            const store = useSiteStore();
            store.setBreadcrums([['/home', 'Home']]);
            store.addBreadcrum('/vps', 'VPS');
            expect(store.breadcrums).toHaveLength(2);
            expect(store.breadcrums[1]).toEqual(['/vps', 'VPS']);
        });
    });

    describe('setPageHeading()', () => {
        it('sets page_heading', ({ annotate }) => {
            annotate('Site Store: verifies setPageHeading() updates the page_heading state value');
            const store = useSiteStore();
            store.setPageHeading('My VPS List');
            expect(store.page_heading).toBe('My VPS List');
        });
    });

    describe('setTitle()', () => {
        it('sets title and document.title', ({ annotate }) => {
            annotate('Site Store: verifies setTitle() updates both store.title and document.title with appended site name suffix');
            const store = useSiteStore();
            store.setTitle('Dashboard');
            expect(store.title).toBe('Dashboard');
            expect(document.title).toBe('Dashboard | My InterServer');
        });
    });

    describe('setSideMenu()', () => {
        it('sets sidemenu value', ({ annotate }) => {
            annotate('Site Store: verifies setSideMenu() updates the sidemenu state value');
            const store = useSiteStore();
            store.setSideMenu('collapsed');
            expect(store.sidemenu).toBe('collapsed');
        });
    });

    describe('checkInfoLoaded()', () => {
        it('calls loadInfo when modules are empty', async ({ annotate }) => {
            await annotate('Site Store: verifies checkInfoLoaded() triggers loadInfo API call when modules object is empty');
            const store = useSiteStore();
            store.modules = {};
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                modules: {},
                services: {},
                serviceTypes: {},
                serviceCategories: {},
            });
            await store.checkInfoLoaded();
            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/info'));
        });

        it('does not call loadInfo when modules exist', async ({ annotate }) => {
            await annotate('Site Store: verifies checkInfoLoaded() skips API call when modules are already populated');
            const store = useSiteStore();
            await store.checkInfoLoaded();
            expect(fetchWrapper.get).not.toHaveBeenCalled();
        });
    });

    describe('loadInfo()', () => {
        it('fetches and sets modules, services, serviceTypes, serviceCategories', async ({ annotate }) => {
            await annotate('Site Store: verifies loadInfo() fetches /info endpoint and populates services, serviceTypes, and serviceCategories');
            const mockResponse = {
                modules: { vps: { TITLE: 'VPS Updated' } },
                services: { 1: { services_name: 'Test Service' } },
                serviceTypes: { 1: { st_name: 'Type1' } },
                serviceCategories: { 1: { category_name: 'Cat1' } },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);
            const store = useSiteStore();
            await store.loadInfo();
            await vi.waitFor(() => {
                expect(store.services).toEqual(mockResponse.services);
                expect(store.serviceTypes).toEqual(mockResponse.serviceTypes);
                expect(store.serviceCategories).toEqual(mockResponse.serviceCategories);
            });
        });
    });

    describe('modules', () => {
        it('has pre-populated modules including domains, vps, backups', ({ annotate }) => {
            annotate('Site Store: verifies modules object is pre-populated with all expected module keys (domains, vps, backups, mail, licenses, ssl, webhosting, servers)');
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
