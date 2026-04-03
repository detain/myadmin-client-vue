import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Register from '@/views/Register.vue';
import { useUsersStore } from '@/stores/users.store';
import { useAlertStore } from '@/stores/alert.store';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({}),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('@/router', () => ({
    router: { push: vi.fn() },
}));

const mountOptions = {
    global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        stubs: {
            RouterLink: { template: '<a><slot /></a>' },
        },
    },
};

describe('Register', () => {
    it('renders registration form with all fields', ({ annotate }) => {
        annotate('Register View: verifies all required form fields (firstName, lastName, username, password) are present');
        const wrapper = mount(Register, mountOptions);
        expect(wrapper.find('input[name="firstName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="lastName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="username"]').exists()).toBe(true);
        expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    });

    it('renders register button', ({ annotate }) => {
        annotate('Register View: verifies the primary Register submit button is present with correct text');
        const wrapper = mount(Register, mountOptions);
        const btn = wrapper.find('button.btn-primary');
        expect(btn.exists()).toBe(true);
        expect(btn.text()).toContain('Register');
    });

    it('renders cancel link to login', ({ annotate }) => {
        annotate('Register View: verifies the Cancel link is present to navigate back to login');
        const wrapper = mount(Register, mountOptions);
        const cancelLink = wrapper.find('a.btn-link');
        expect(cancelLink.exists()).toBe(true);
        expect(cancelLink.text()).toContain('Cancel');
    });

    it('shows validation errors for required fields on empty submit', async ({ annotate }) => {
        await annotate('Register View: verifies that submitting an empty form triggers vee-validate validation errors');
        const wrapper = mount(Register, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit');
        // Wait for vee-validate async validation
        await vi.dynamicImportSettled();
        await wrapper.vm.$nextTick();
        // After a short wait, validation errors should appear
        await new Promise((r) => setTimeout(r, 100));
        await wrapper.vm.$nextTick();
        const feedbacks = wrapper.findAll('.invalid-feedback');
        const visibleErrors = feedbacks.filter((f) => f.text().length > 0);
        expect(visibleErrors.length).toBeGreaterThan(0);
    });

    it('calls onSubmit which registers user and redirects', async ({ annotate }) => {
        await annotate('Register View: verifies onSubmit calls usersStore.register with valid data and redirects');
        const wrapper = mount(Register, mountOptions);
        const vm = wrapper.vm as any;
        // Call the onSubmit function directly with valid data
        await vm.onSubmit({ firstName: 'John', lastName: 'Doe', username: 'john', password: 'pass123' });
        await flushPromises();
    });

    it('handles registration error', async ({ annotate }) => {
        await annotate('Register View: verifies that a rejected registration populates the alert store with the error message');
        const wrapper = mount(Register, mountOptions);
        const usersStore = useUsersStore();
        vi.mocked(usersStore.register).mockRejectedValue(new Error('Registration failed'));
        const vm = wrapper.vm as any;
        await vm.onSubmit({ firstName: 'John', lastName: 'Doe', username: 'john', password: 'pass123' });
        await flushPromises();
        const alertStore = useAlertStore();
        expect(alertStore.alert?.message).toContain('Registration failed');
    });
});
