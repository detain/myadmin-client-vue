import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import PrePays from '@/views/billing/PrePays.vue';

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

vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({ params: {}, query: {} })),
    useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('PrePays.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                    initialState: {
                        prepay: {
                            loading: false,
                            prepays: [],
                            total_pages: 1,
                            total_records: 0,
                            limit: 25,
                            page: 1,
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
        const wrapper = mount(PrePays, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });
});
