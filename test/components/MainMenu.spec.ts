import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MainMenu from '@/components/MainMenu.vue';

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

    it('renders navigation menu', () => {
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.find('ul.nav').exists()).toBe(true);
    });

    it('renders main menu links', () => {
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Dashboard');
        expect(wrapper.text()).toContain('Domains');
        expect(wrapper.text()).toContain('VPS');
        expect(wrapper.text()).toContain('Tickets');
    });

    it('renders submenu items for billing', () => {
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Billing');
        expect(wrapper.text()).toContain('Cart');
        expect(wrapper.text()).toContain('View Invoices');
    });

    it('renders submenu items for settings', () => {
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.text()).toContain('Settings');
        expect(wrapper.text()).toContain('Account Settings');
        expect(wrapper.text()).toContain('Change Login');
        expect(wrapper.text()).toContain('Change Password');
    });

    it('renders all service links', () => {
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

    it('renders icons for menu items', () => {
        const wrapper = mount(MainMenu, mountOptions);
        expect(wrapper.find('.fas.fa-tachometer-alt').exists()).toBe(true);
        expect(wrapper.find('.fas.fa-globe').exists()).toBe(true);
        expect(wrapper.find('.fas.fa-ticket-alt').exists()).toBe(true);
    });

    it('has nav-item class on list items', () => {
        const wrapper = mount(MainMenu, mountOptions);
        const items = wrapper.findAll('li.nav-item');
        expect(items.length).toBeGreaterThan(0);
    });

    describe('isActive detection', () => {
        it('marks billing submenu as active when on /cart path', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/cart' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            // The billing menu item should have active class on its nav-link
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });

        it('does not mark settings as active on /account/settings since isActive uses first path segment only', () => {
            // isActive checks key.includes(pathname.split('/')[1])
            // pathname.split('/')[1] = 'account', but activecheck has 'account/settings' (not 'account')
            // Array.includes does exact match, so 'account' !== 'account/settings'
            Object.defineProperty(window, 'location', {
                value: { pathname: '/account/settings' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            const settingsLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Settings'));
            expect(settingsLink).toBeDefined();
            expect(settingsLink!.classes()).not.toContain('active');
        });

        it('does not mark billing as active when on non-billing path', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/vps' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).not.toContain('active');
        });

        it('does not mark settings as active when on /domains path', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/domains' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            const settingsLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Settings'));
            expect(settingsLink).toBeDefined();
            expect(settingsLink!.classes()).not.toContain('active');
        });

        it('marks billing as active when on /invoices path', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/invoices' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });

        it('marks billing as active when on /prepays path', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/prepays' },
                writable: true,
                configurable: true,
            });
            const wrapper = mount(MainMenu, mountOptions);
            const billingLink = wrapper.findAll('a.nav-link').find((a) => a.text().includes('Billing'));
            expect(billingLink).toBeDefined();
            expect(billingLink!.classes()).toContain('active');
        });
    });

    describe('submenu treeview structure', () => {
        it('billing menu item has has-treeview class', () => {
            const wrapper = mount(MainMenu, mountOptions);
            // Find li elements that have has-treeview class
            const treeviewItems = wrapper.findAll('li.has-treeview');
            expect(treeviewItems.length).toBeGreaterThanOrEqual(2); // billing and settings
        });

        it('renders billing submenu with nav-treeview class', () => {
            const wrapper = mount(MainMenu, mountOptions);
            const subMenus = wrapper.findAll('ul.nav-treeview');
            expect(subMenus.length).toBeGreaterThanOrEqual(2);
        });

        it('billing submenu contains Cart, View Invoices, Credit Cards, Pre-Paid Funds', () => {
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
