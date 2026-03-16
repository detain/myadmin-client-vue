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
});
