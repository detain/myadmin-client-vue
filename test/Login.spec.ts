import { vi, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import Login from '../src/views/Login.vue';
import { useAuthStore } from '../src/stores/auth.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { nextTick } from 'vue';

vi.mock('sweetalert2');

test('renders login form', async () => {
    const { getByText } = render(Login, {
        //props: { name: 'Vitest' },
    });
    await expect.element(getByText('Sign in using')).toBeInTheDocument();
});


describe('Login.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                }),
            ],
        },
    };
    beforeEach(() => {
        setActivePinia(createPinia());
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

    it('submits form and updates store user & sessionId', async () => {
        // Mount component with Pinia injected
        const wrapper = mount(Login, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false, // let actions run
                    }),
                ],
            },
        });

        // Get the store **after Pinia is installed**
        const authStore = useAuthStore();

        // Arrange: mock fetchWrapper.post to return a fake user
        const fakeUser = { sessionId: 'abc123', userName: 'Joe' };
        vi.spyOn(fetchWrapper, 'post').mockResolvedValue(fakeUser);

        const loginInput = wrapper.find('#loginname');
        const passwordInput = wrapper.find('#loginpassword');

        await loginInput.setValue('testuser');
        await passwordInput.setValue('secret');

        expect((loginInput.element as HTMLInputElement).value).toBe('testuser');
        expect((passwordInput.element as HTMLInputElement).value).toBe('secret');

        // Act: trigger form submit
        await wrapper.find('form.myadmin_loginForm').trigger('submit.prevent');

        // Wait for all async tasks in login
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 0)); // ensures all promises resolved

        // Assert: fetchWrapper.post was called with login URL
        expect(fetchWrapper.post).toHaveBeenCalledWith(
            expect.stringContaining('/login'),
            expect.objectContaining({
                login: 'testuser',
                passwd: 'secret',
            })
        );

        // Assert: store was updated correctly
        expect(authStore.user).toEqual(fakeUser);
        expect(authStore.sessionId).toEqual(fakeUser.sessionId);
    });
/*
    it('blocks submit when fields are empty', async () => {
        const wrapper = mount(Login, mountOptions);

        await wrapper.find('form').trigger('submit.prevent');

        expect(Swal.fire).not.toHaveBeenCalled();
    });

    it('triggers SweetAlert on valid submit', async () => {
        const wrapper = mount(Login, mountOptions);

        await wrapper.find('input[name="login"]').setValue('user');
        await wrapper.find('input[type="password"]').setValue('pass');

        await wrapper.find('form').trigger('submit.prevent');

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Please wait',
            })
        );
    });

    it('toggles between login and signup forms', async () => {
        const wrapper = mount(Login, mountOptions);

        // Initially shows login
        expect(wrapper.find('.wrapper').isVisible()).toBe(true);
        expect(wrapper.find('.wrapper-signup').isVisible()).toBe(false);

        // Click sign up link
        await wrapper.find('.sign-up').trigger('click');

        expect(wrapper.find('.wrapper').isVisible()).toBe(false);
        expect(wrapper.find('.wrapper-signup').isVisible()).toBe(true);

        // Click login link
        await wrapper.find('.sign-up').trigger('click');

        expect(wrapper.find('.wrapper').isVisible()).toBe(true);
        expect(wrapper.find('.wrapper-signup').isVisible()).toBe(false);
    });

    it('toggles password visibility', async () => {
        const wrapper = mount(Login, mountOptions);

        const passwordInput = wrapper.find('input[type="password"]');
        const toggleButton = wrapper.find('button[aria-label="Toggle password visibility"]'); // Assuming there's a button

        // Initially password
        expect(passwordInput.attributes('type')).toBe('password');

        // Click toggle
        await toggleButton.trigger('click');

        expect(passwordInput.attributes('type')).toBe('text');
    });

    it('calls authStore.signup on signup submit', async () => {
        const authStore = useAuthStore();
        const wrapper = mount(Login, mountOptions);

        // Switch to signup
        await wrapper.find('.sign-up').trigger('click');

        await wrapper.find('form').trigger('submit.prevent');

        expect(authStore.signup).toHaveBeenCalled();
    });
*/
    it('shows forgot password form', async () => {
        const wrapper = mount(Login, mountOptions);

        // Initially hidden
        expect(wrapper.find('.myadmin_login[style*="display: none"]').exists()).toBe(true);

        // Simulate click on forgot link (but since jQuery, hard to test directly)
        // Perhaps test the function directly or mock
    });
/*
    it('computes isTosChecked correctly', async () => {
        const wrapper = mount(Login, mountOptions);

        // Switch to signup
        await wrapper.find('.sign-up').trigger('click');

        const tosCheckbox = wrapper.find('input[name="tos"]');

        expect(wrapper.vm.isTosChecked).toBe(false);

        await tosCheckbox.setChecked(true);

        expect(wrapper.vm.isTosChecked).toBe(true);
    });

    it('computes passwordType correctly', async () => {
        const wrapper = mount(Login, mountOptions);

        expect(wrapper.vm.passwordType).toBe('password');

        // Toggle visibility
        const toggleButton = wrapper.find('button[aria-label="Toggle password visibility"]');
        await toggleButton.trigger('click');

        expect(wrapper.vm.passwordType).toBe('text');
    });

    it('reloads captcha', async () => {
        const authStore = useAuthStore();
        const wrapper = mount(Login, mountOptions);

        const reloadButton = wrapper.find('button[aria-label="Reload captcha"]'); // Assuming exists

        await reloadButton.trigger('click');

        expect(authStore.reloadCaptcha).toHaveBeenCalled();
    });

    it('handles two-factor auth', async () => {
        const wrapper = mount(Login, mountOptions);

        // Set TFA in store
        const authStore = useAuthStore();
        authStore.opts.tfa = true;

        await wrapper.find('input[name="login"]').setValue('user');
        await wrapper.find('input[type="password"]').setValue('pass');
        await wrapper.find('input[name="twoFactorAuthCode"]').setValue('123456');

        await wrapper.find('form').trigger('submit.prevent');

        expect(authStore.login).toHaveBeenCalledWith(
            expect.objectContaining({
                tfa: '123456',
            })
        );
    });
*/
    it('calls forgot_password function', () => {
        const wrapper = mount(Login, mountOptions);

        // Since it's called via jQuery, hard to test. Perhaps spy on $
        // For now, assume we can call it directly if exposed
    });
});
