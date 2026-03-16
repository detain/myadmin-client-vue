import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ChangePass from '@/views/account/ChangePass.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

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

    it('renders Update Password heading', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.text()).toContain('Update Password');
    });

    it('renders current password field', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('#currentpassword').exists()).toBe(true);
    });

    it('renders new password field', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('#password').exists()).toBe(true);
    });

    it('renders confirm password field', () => {
        const wrapper = mount(ChangePass, mountOptions);
        const inputs = wrapper.findAll('input[type="password"]');
        expect(inputs.length).toBe(3);
    });

    it('renders submit button', () => {
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Update Password');
    });

    it('toggles collapse on button click', async () => {
        const wrapper = mount(ChangePass, mountOptions);
        const collapseBtn = wrapper.find('.btn-tool');
        await collapseBtn.trigger('click');
        expect(wrapper.find('.collapse').exists()).toBe(true);
    });

    it('submits form and calls fetchWrapper.post', async () => {
        vi.mocked(fetchWrapper.post).mockResolvedValue({});
        const wrapper = mount(ChangePass, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
        expect(fetchWrapper.post).toHaveBeenCalledWith(
            expect.stringContaining('/account/password'),
            expect.objectContaining({ password: '' })
        );
    });

    it('handles failed password change', async () => {
        vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Failed'));
        const wrapper = mount(ChangePass, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
    });
});
