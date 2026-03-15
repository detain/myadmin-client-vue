import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Register from '@/views/Register.vue';

const mountOptions = {
    global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        stubs: {
            RouterLink: { template: '<a><slot /></a>' },
        },
    },
};

describe('Register', () => {
    it('renders registration form with all fields', () => {
        const wrapper = mount(Register, mountOptions);
        expect(wrapper.find('input[name="firstName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="lastName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="username"]').exists()).toBe(true);
        expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    });

    it('renders register button', () => {
        const wrapper = mount(Register, mountOptions);
        const btn = wrapper.find('button.btn-primary');
        expect(btn.exists()).toBe(true);
        expect(btn.text()).toContain('Register');
    });

    it('renders cancel link to login', () => {
        const wrapper = mount(Register, mountOptions);
        const cancelLink = wrapper.find('a.btn-link');
        expect(cancelLink.exists()).toBe(true);
        expect(cancelLink.text()).toContain('Cancel');
    });

    it('shows validation errors for required fields on empty submit', async () => {
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
});
