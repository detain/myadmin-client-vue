import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Sudo from '@/views/Sudo.vue';
import { useAuthStore } from '@/stores/auth.store';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({
        params: { sessionid: 'test-session-123' },
    })),
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

describe('Sudo.vue', () => {
    it('renders redirect message', ({ annotate }) => {
        annotate('Sudo View: verifies the component renders a message indicating the user is logged in as a client');
        const wrapper = mount(Sudo, {
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: true })],
            },
        });
        expect(wrapper.text()).toContain('Logged in as a client');
    });

    it('calls authStore.sudo with session id from route params', ({ annotate }) => {
        annotate('Sudo View: verifies that authStore.sudo is invoked with the sessionid route parameter on mount');
        mount(Sudo, {
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: true })],
            },
        });
        const authStore = useAuthStore();
        expect(authStore.sudo).toHaveBeenCalledWith('test-session-123');
    });
});
