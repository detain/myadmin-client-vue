import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ChangePass from '@/views/account/ChangePass.vue';

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

describe('ChangePass.vue', () => {
    const mountOptions = {
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
                Form: { template: '<form @submit.prevent="$emit(\'submit\')"><slot v-bind="{ errors: {}, isSubmitting: false }" /></form>' },
                Field: { template: '<input />' },
            },
        },
    };

    it('renders component', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders password form elements', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('form').exists()).toBe(true);
    });
});
