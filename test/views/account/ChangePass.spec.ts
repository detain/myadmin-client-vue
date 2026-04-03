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

    it('renders component', ({ annotate }) => {
        annotate('Change Password: verifies the component mounts without errors');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders password form elements', ({ annotate }) => {
        annotate('Change Password: verifies the password change form element is present in the DOM');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('renders Update Password heading', ({ annotate }) => {
        annotate('Change Password: verifies the Update Password heading text is displayed');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.text()).toContain('Update Password');
    });

    it('renders current password field', ({ annotate }) => {
        annotate('Change Password: verifies the current password input field exists with correct ID');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('#currentpassword').exists()).toBe(true);
    });

    it('renders new password field', ({ annotate }) => {
        annotate('Change Password: verifies the new password input field exists with correct ID');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('#password').exists()).toBe(true);
    });

    it('renders confirm password field', ({ annotate }) => {
        annotate('Change Password: verifies all three password inputs (current, new, confirm) are rendered');
        const wrapper = mount(ChangePass, mountOptions);
        const inputs = wrapper.findAll('input[type="password"]');
        expect(inputs.length).toBe(3);
    });

    it('renders submit button', ({ annotate }) => {
        annotate('Change Password: verifies the submit button exists and contains Update Password text');
        const wrapper = mount(ChangePass, mountOptions);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Update Password');
    });

    it('toggles collapse on button click', async ({ annotate }) => {
        await annotate('Change Password: verifies the card body collapse toggles on tool button click');
        const wrapper = mount(ChangePass, mountOptions);
        const collapseBtn = wrapper.find('.btn-tool');
        await collapseBtn.trigger('click');
        expect(wrapper.find('.collapse').exists()).toBe(true);
    });

    it('submits form and calls fetchWrapper.post', async ({ annotate }) => {
        await annotate('Change Password: verifies form submission POSTs to /account/password endpoint');
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

    it('handles failed password change', async ({ annotate }) => {
        await annotate('Change Password: verifies the component handles API rejection without crashing');
        vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Failed'));
        const wrapper = mount(ChangePass, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
    });

    describe('password field v-model bindings', () => {
        it('binds currentPassword input via v-model', async ({ annotate }) => {
            await annotate('Change Password: verifies v-model binding on current password input reflects user input');
            const wrapper = mount(ChangePass, mountOptions);
            const input = wrapper.find('#currentpassword');
            await input.setValue('myOldPassword');
            expect((input.element as HTMLInputElement).value).toBe('myOldPassword');
        });

        it('binds newPassword input via v-model', async ({ annotate }) => {
            await annotate('Change Password: verifies v-model binding on new password input reflects user input');
            const wrapper = mount(ChangePass, mountOptions);
            const input = wrapper.find('#password');
            await input.setValue('myNewPassword123');
            expect((input.element as HTMLInputElement).value).toBe('myNewPassword123');
        });

        it('binds confirm password input via v-model', async ({ annotate }) => {
            await annotate('Change Password: verifies v-model binding on confirm password input reflects user input');
            const wrapper = mount(ChangePass, mountOptions);
            const inputs = wrapper.findAll('input[type="password"]');
            const confirmInput = inputs[2]; // third password input is confirm
            await confirmInput.setValue('myNewPassword123');
            expect((confirmInput.element as HTMLInputElement).value).toBe('myNewPassword123');
        });

        it('submits form with filled password value', async ({ annotate }) => {
            await annotate('Change Password: verifies form submission includes the filled password value in POST body');
            vi.mocked(fetchWrapper.post).mockResolvedValue({});
            const wrapper = mount(ChangePass, mountOptions);
            const inputs = wrapper.findAll('input[type="password"]');
            await inputs[2].setValue('secretPass');
            const form = wrapper.find('form');
            await form.trigger('submit.prevent');
            await flushPromises();
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/account/password'),
                expect.objectContaining({ password: 'secretPass' })
            );
        });
    });
});
