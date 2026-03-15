import { vi, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Login from '../src/views/Login.vue';

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

describe('Login.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                }),
            ],
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        const wrapper = mount(Login, mountOptions);
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    });

    it('updates login and password fields', async () => {
        const wrapper = mount(Login, mountOptions);

        const loginInput = wrapper.find('#loginname');
        const passwordInput = wrapper.find('#loginpassword');

        await loginInput.setValue('testuser');
        await passwordInput.setValue('secret');

        expect((loginInput.element as HTMLInputElement).value).toBe('testuser');
        expect((passwordInput.element as HTMLInputElement).value).toBe('secret');
    });

    it('has a submit button', () => {
        const wrapper = mount(Login, mountOptions);
        expect(wrapper.find('#loginsubmit').exists()).toBe(true);
    });

    it('has forgot password section', () => {
        const wrapper = mount(Login, mountOptions);
        expect(wrapper.text()).toContain('Forgot');
    });
});
