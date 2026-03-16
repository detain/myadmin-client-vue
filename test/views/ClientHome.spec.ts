import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import ClientHome from '@/views/ClientHome.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({
            last_login_ip: '192.168.1.1',
            last_login: '2024-01-15 10:30:00',
            currency: 'USD',
            amount: '$25.00',
            invoice_list: '3',
            balance: '$150.00',
            full_name: 'John Doe',
            email: 'john@test.com',
            tickets: [
                { ticketid: 1, ticketmaskid: 'TKT-001', subject: 'Help needed', lastreplier: 'Support', ticketstatusid: '4' },
            ],
            ticketStatus: { 4: 'Open' },
            ticketStatusView: { 4: 'Open' },
            details: {
                modules: {
                    vps: { icon: 'cloud', heading: 'VPS Services' },
                },
            },
            services: {
                vps: {
                    count: 2,
                    links: { 1: 'my-vps.example.com' },
                    ex_links: {},
                },
            },
            AFFILIATE_AMOUNT: '100',
        }),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mountOptions = {
    global: {
        plugins: [
            createTestingPinia({
                createSpy: vi.fn,
                stubActions: true,
                initialState: {
                    auth: {
                        user: { account_id: 1, name: 'John', account_lid: 'john@test.com', gravatar: '', ima: 'client' },
                    },
                    account: {
                        data: {
                            account_id: 1,
                            account_lid: 'john@test.com',
                            name: 'John Doe',
                            pin: 5678,
                            status: 'active',
                            address: '',
                            address2: '',
                            city: '',
                            state: '',
                            zip: '',
                            phone: '',
                            country: 'US',
                            payment_method: 'paypal',
                            ima: 'client',
                            company: '',
                            currency: 'USD',
                            locale: 'auto',
                        },
                        loading: false,
                    },
                },
            }),
        ],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
};

describe('ClientHome', () => {
    it('renders without crashing', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('shows welcome section', async () => {
        const wrapper = mount(ClientHome, mountOptions);
        await flushPromises();
        expect(wrapper.text()).toContain('Welcome');
    });

    it('shows PrePay Balance section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('PrePay Balance');
    });

    it('shows Unpaid Invoices section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Unpaid Invoices');
    });

    it('shows Call in Pin', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Call in Pin');
        expect(wrapper.text()).toContain('5678');
    });

    it('shows affiliate section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Per Sale');
        expect(wrapper.text()).toContain('Copy to Clipboard');
    });

    it('shows social share links', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Share with');
    });

    it('renders affiliate URL input', () => {
        const wrapper = mount(ClientHome, mountOptions);
        const input = wrapper.find('#affiliateinput');
        expect(input.exists()).toBe(true);
    });

    it('renders Manage Account link for prepay', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Manage Account');
    });

    it('renders Pay Now link', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Pay Now');
    });

    it('calls fetchWrapper.get to load home data', () => {
        mount(ClientHome, mountOptions);
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/home'));
    });
});
