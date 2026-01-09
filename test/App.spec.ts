// tests/App.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { ref } from 'vue';

// Mocks must be declared before importing the component under test
// Mock the auth and site stores module
const authStoreState = {
    sessionId: null,
    apiKey: null,
    logout: vi.fn(),
    user: {
        gravatar: 'https://example.com/avatar.png',
        name: 'Test User',
        account_lid: 'test_lid',
    },
};

const siteStoreState = {
    breadcrums: [
        ['/home', 'Home'],
        ['/page', 'Page'],
    ],
    page_heading: 'Test Heading',
    checkInfoLoaded: vi.fn(),
};

vi.mock('../src/stores/auth.store', () => {
    return {
        useAuthStore: () => authStoreState,
    };
});

vi.mock('../src/stores/site.store', () => {
    return {
        useSiteStore: () => siteStoreState,
    };
});

// Mock pinia's storeToRefs so the component's storeToRefs(...) calls return refs
vi.mock('pinia', async () => {
    const vue = await vi.importActual('vue');
    return {
        storeToRefs: (store: any) => {
            // return only the keys the component expects
            const out: Record<string, any> = {};
            if (store.user !== undefined) out.user = vue.ref(store.user);
            if (store.breadcrums !== undefined) out.breadcrums = vue.ref(store.breadcrums);
            if (store.page_heading !== undefined) out.page_heading = vue.ref(store.page_heading);
            return out;
        },
    };
});

// Provide a minimal global jQuery ($) mock used in onMounted
// It should be available before the component mounts
global.$ = (selector?: any) => {
    // return an object with the methods used in App.vue
    return {
        passwordRequirements: () => {},
        select2: () => {},
        popover: () => {},
        tooltip: () => {},
        hover: (inFn?: Function, outFn?: Function) => {},
        removeClass: () => {},
        addClass: () => {},
        css: () => {},
    };
};

// Now import the component under test
import App from '../src/App.vue';

// Helper to reset cookies and body classes between tests
function clearDomState() {
    document.cookie = 'toggleState=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.body.className = '';
}

describe('App.vue', () => {
    beforeEach(() => {
        clearDomState();
        // reset spies
        authStoreState.logout = vi.fn();
        siteStoreState.checkInfoLoaded = vi.fn();
    });

    afterEach(() => {
        clearDomState();
        vi.clearAllMocks();
    });

    it('renders guest view when not authenticated', async () => {
        // ensure no sessionId or apiKey
        authStoreState.sessionId = null;
        authStoreState.apiKey = null;

        const wrapper = shallowMount(App, {
            global: {
                // stub router components and child components
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        // When not authenticated, the top-level .app-container should not exist
        expect(wrapper.find('.app-container').exists()).toBe(false);

        // The fallback router-view container should exist
        expect(wrapper.find('.container-fluid').exists()).toBe(true);
    });

    it('renders authenticated layout when sessionId is present', async () => {
        authStoreState.sessionId = 'abc123';
        authStoreState.apiKey = null;

        const wrapper = shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        // Authenticated layout should be visible
        expect(wrapper.find('.app-container').exists()).toBe(true);

        // Page heading should render from siteStore
        expect(wrapper.find('h1').text()).toContain(siteStoreState.page_heading);
    });

    it('collapseMenu writes cookie "toggleState" as closed when body does not have sidebar-collapse', async () => {
        authStoreState.sessionId = 'abc123';

        const wrapper = shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        // Ensure body does not have sidebar-collapse
        document.body.classList.remove('sidebar-collapse');

        // Find the collapse button and trigger click
        const collapseLink = wrapper.find('.collapse_menu');
        // call the click handler directly (preventDefault is used in template)
        await collapseLink.trigger('click');

        // cookie should be set to closed
        const match = document.cookie.match(/(?:^|;\s*)toggleState=([^;]+)/);
        expect(match).not.toBeNull();
        expect(decodeURIComponent(match![1])).toBe('closed');
    });

    it('collapseMenu writes cookie "toggleState" as opened when body has sidebar-collapse', async () => {
        authStoreState.sessionId = 'abc123';

        const wrapper = shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        // Add the class to simulate opened sidebar
        document.body.classList.add('sidebar-collapse');

        const collapseLink = wrapper.find('.collapse_menu');
        await collapseLink.trigger('click');

        const match = document.cookie.match(/(?:^|;\s*)toggleState=([^;]+)/);
        expect(match).not.toBeNull();
        expect(decodeURIComponent(match![1])).toBe('opened');
    });

    it('restoreSidebarState adds sidebar-collapse when cookie is closed', async () => {
        // set cookie to closed before mounting
        document.cookie = 'toggleState=closed; path=/';

        authStoreState.sessionId = 'abc123';

        // Mount component; onMounted should call restoreSidebarState
        shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        // After mount, body should have sidebar-collapse class
        expect(document.body.classList.contains('sidebar-collapse')).toBe(true);
    });

    it('calls siteStore.checkInfoLoaded on mount', () => {
        authStoreState.sessionId = 'abc123';

        shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        expect(siteStoreState.checkInfoLoaded).toHaveBeenCalled();
    });

    it('logout button calls authStore.logout', async () => {
        authStoreState.sessionId = 'abc123';

        const wrapper = shallowMount(App, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true,
                    MainMenu: true,
                    Alert: true,
                },
            },
        });

        const logoutButton = wrapper.find('button[title="logout"], button.btn');
        // There are multiple buttons; find the one with click handler by selector fallback
        // Trigger the first button with click handler
        await wrapper.find('button').trigger('click');

        expect(authStoreState.logout).toHaveBeenCalled();
    });
});
