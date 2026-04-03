import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MainMenu from '@/components/MainMenu.vue';

const mockRoute = { path: '/' };
vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
}));

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

describe('MainMenu.vue', () => {
    const mountOptions = {
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
            stubs: {
                RouterLink: {
                    template: '<a :href="to"><slot /></a>',
                    props: ['to'],
                },
            },
        },
    };

    beforeEach(() => {
        mockRoute.path = '/';
    });

    it('renders navigation menu', ({ annotate }) => {
        annotate('MainMenu: verifies the top-level nav unordered list element is present in the DOM');
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.find('ul.nav').exists()).toBe(true);
    });

    it('renders main menu links', ({ annotate }) => {
        annotate('MainMenu: confirms the primary navigation items (Dashboard, Domains, VPS, Tickets) are all rendered');
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Dashboard');
        expect(wrapper.text()).toContain('Domains');
        expect(wrapper.text()).toContain('VPS');
        expect(wrapper.text()).toContain('Tickets');
    });

    it('renders submenu items for billing', ({ annotate }) => {
        annotate('MainMenu: validates the Billing submenu contains its child items Cart and View Invoices');
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Billing');
        expect(wrapper.text()).toContain('Cart');
        expect(wrapper.text()).toContain('View Invoices');
    });

    it('renders submenu items for settings', ({ annotate }) => {
        annotate('MainMenu: validates the Settings submenu renders Account Settings, Change Login, and Change Password items');
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Settings');
        expect(wrapper.text()).toContain('Account Settings');
        expect(wrapper.text()).toContain('Change Login');
        expect(wrapper.text()).toContain('Change Password');
    });

    it('renders all service links', ({ annotate }) => {
        annotate('MainMenu: ensures every expected service link (DNS, Storage, Mail, Licenses, etc.) is rendered in the navigation');
        const wrapper = mount(MainMenu, mountOptions);
        const expectedLinks = [
            'DNS Manager', 'Storage', 'Mail', 'Licenses',
            'Webhosting', 'Floating IPs', 'Scrub IPs',
            'Rapid Deploy Servers', 'Servers', 'Affiliate System',
        ];
        for (const link of expectedLinks) {
            expect(wrapper.text()).toContain(link);
        }
    });

    it('renders icons for menu items', ({ annotate }) => {
        annotate('MainMenu: confirms Font Awesome icons for Dashboard, Domains, and Tickets menu items are rendered');
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.find('.fas.fa-tachometer-alt').exists()).toBe(true);
        expect(wrapper.find('.fas.fa-globe').exists()).toBe(true);
        expect(wrapper.find('.fas.fa-ticket-alt').exists()).toBe(true);
    });

    it('has nav-item class on list items', ({ annotate }) => {
        annotate('MainMenu: verifies list items use the AdminLTE nav-item CSS class for proper sidebar styling');
        const wrapper = mount(MainMenu, mountOptions);
        const items = wrapper.findAll('li.nav-item');
        expect(items.length).toBeGreaterThan(0);
    });

    describe('isActive detection', () => {
        it('marks billing submenu as active when on /cart path', ({ annotate }) => {
            annotate('MainMenu isActive: verifies the Billing parent link receives the active class when the current route is /cart');
            mockRoute.path = '/cart';
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });

        it('does not mark settings as active on /account/settings since isActive uses first path segment only', ({ annotate }) => {
            annotate('MainMenu isActive: confirms isActive only matches the first path segment, so /account/settings does not activate Settings');
            mockRoute.path = '/account/settings';
            const wrapper = mount(MainMenu, mountOptions);
            const settingsLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Settings'));
            expect(settingsLink).toBeDefined();
            expect(settingsLink!.classes()).not.toContain('active');
        });

        it('does not mark billing as active when on non-billing path', ({ annotate }) => {
            annotate('MainMenu isActive: ensures Billing link does not receive active class when on an unrelated /vps route');
            mockRoute.path = '/vps';
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).not.toContain('active');
        });

        it('does not mark settings as active when on /domains path', ({ annotate }) => {
            annotate('MainMenu isActive: ensures Settings link is not marked active when the route is /domains');
            mockRoute.path = '/domains';
            const wrapper = mount(MainMenu, mountOptions);
            const settingsLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Settings'));
            expect(settingsLink).toBeDefined();
            expect(settingsLink!.classes()).not.toContain('active');
        });

        it('marks billing as active when on /invoices path', ({ annotate }) => {
            annotate('MainMenu isActive: verifies Billing link is active when navigated to the /invoices child route');
            mockRoute.path = '/invoices';
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });

        it('marks billing as active when on /prepays path', ({ annotate }) => {
            annotate('MainMenu isActive: verifies Billing link is active when navigated to the /prepays child route');
            mockRoute.path = '/prepays';
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });
    });

    describe('submenu treeview structure', () => {
        it('billing menu item has has-treeview class', ({ annotate }) => {
            annotate('MainMenu treeview: verifies at least 2 parent menu items (Billing and Settings) carry the has-treeview class for expandable submenus');
            const wrapper = mount(MainMenu, mountOptions);
            // Find li elements that have has-treeview class
            const treeviewItems = wrapper.findAll('li.has-treeview');
            expect(treeviewItems.length).toBeGreaterThanOrEqual(2); // billing and settings
        });

        it('renders billing submenu with nav-treeview class', ({ annotate }) => {
            annotate('MainMenu treeview: confirms at least 2 submenu UL elements have the nav-treeview class for AdminLTE tree styling');
            const wrapper = mount(MainMenu, mountOptions);
            const subMenus = wrapper.findAll('ul.nav-treeview');
            expect(subMenus.length).toBeGreaterThanOrEqual(2);
        });

        it('billing submenu contains Cart, View Invoices, Credit Cards, Pre-Paid Funds', ({ annotate }) => {
            annotate('MainMenu treeview: validates the Billing submenu lists all four child items including Cart, View Invoices, Credit Cards, and Pre-Paid Funds');
            const wrapper = mount(MainMenu, mountOptions);
            const subMenus = wrapper.findAll('ul.nav-treeview');
            const billingSubmenu = subMenus.find((sm) => sm.text().includes('Cart'));
            expect(billingSubmenu).toBeDefined();
            expect(billingSubmenu!.text()).toContain('View Invoices');
            expect(billingSubmenu!.text()).toContain('Credit Cards');
            expect(billingSubmenu!.text()).toContain('Pre-Paid Funds');
        });
    });
});
