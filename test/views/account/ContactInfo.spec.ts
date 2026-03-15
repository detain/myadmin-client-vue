import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ContactInfo from '@/views/account/ContactInfo.vue';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({ message: 'success' }),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: vi.fn(() => ({ params: {}, query: {} })),
        useRouter: vi.fn(() => ({ push: vi.fn() })),
    };
});

describe('ContactInfo.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                    initialState: {
                        auth: {
                            user: { account_id: 1, name: 'Test', account_lid: 'test@test.com', gravatar: '' },
                        },
                        account: {
                            data: {
                                account_id: 1,
                                account_lid: 'testuser',
                                name: 'Test User',
                                email: 'test@example.com',
                                company: 'Test Corp',
                                address: '123 Test St',
                                address2: '',
                                city: 'Testville',
                                state: 'NJ',
                                zip: '07001',
                                country: 'US',
                                phone: '555-1234',
                                payment_method: 'paypal',
                                ima: 'client',
                                status: 'active',
                                pin: 1234,
                                currency: 'USD',
                                locale: 'auto',
                            },
                            loading: false,
                            gravatar: 'https://gravatar.com/test',
                            ip: '127.0.0.1',
                            ima: 'client',
                            custid: 1,
                        },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    };

    it('renders component', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });
});
