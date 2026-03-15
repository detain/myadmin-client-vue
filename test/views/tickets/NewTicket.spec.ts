import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import NewTicket from '@/views/tickets/NewTicket.vue';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn() },
}));

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({}),
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
        useRoute: vi.fn(() => ({
            params: {},
            query: { view: undefined },
        })),
        useRouter: vi.fn(() => ({
            push: vi.fn(),
        })),
    };
});

describe('NewTicket.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                    initialState: {
                        account: { ip: '127.0.0.1' },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    };

    it('renders component', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('has subject field', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Subject');
    });
});
