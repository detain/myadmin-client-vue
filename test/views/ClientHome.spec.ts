import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import ClientHome from '@/views/ClientHome.vue';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({
            last_login_ip: '127.0.0.1',
            last_login: '2024-01-01',
            currency: 'USD',
            amount: '0.00',
            invoice_list: '0',
            balance: '$0.00',
            full_name: 'Test User',
            email: 'test@test.com',
            tickets: [],
            ticketStatus: {},
            ticketStatusView: {},
            details: { modules: {} },
            services: {},
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
                        user: { account_id: 1, name: 'Test', account_lid: 'test@test.com', gravatar: '', ima: 'client' },
                    },
                    account: {
                        data: {
                            account_id: 1,
                            account_lid: 'test@test.com',
                            name: 'Test User',
                            pin: 1234,
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

    it('component exists', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.vm).toBeTruthy();
    });
});
