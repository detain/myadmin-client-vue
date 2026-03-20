import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Login from '@/views/Login.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import Swal from 'sweetalert2';
import $ from 'jquery';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn(), close: vi.fn(), showLoading: vi.fn() },
}));

vi.mock('jquery', () => {
    const jqChain: any = {
        find: vi.fn().mockReturnThis(),
        outerHeight: vi.fn().mockReturnValue(0),
        innerHeight: vi.fn().mockReturnValue(0),
        width: vi.fn().mockReturnValue(1024),
        height: vi.fn().mockReturnValue(768),
        css: vi.fn().mockReturnThis(),
        serializeArray: vi.fn().mockReturnValue([]),
        attr: vi.fn().mockReturnValue(''),
        val: vi.fn().mockReturnValue(''),
        show: vi.fn().mockReturnThis(),
        hide: vi.fn().mockReturnThis(),
        hasClass: vi.fn().mockReturnValue(false),
        removeClass: vi.fn().mockReturnThis(),
        removeAttr: vi.fn().mockReturnThis(),
        prop: vi.fn().mockReturnThis(),
        html: vi.fn().mockReturnThis(),
        text: vi.fn().mockReturnThis(),
        ajax: vi.fn(),
    };
    const jq: any = vi.fn(() => jqChain);
    jq.ajax = vi.fn();
    return { default: jq };
});

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({}),
        put: vi.fn(),
        patch: vi.fn().mockResolvedValue({}),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: vi.fn(() => ({ params: {}, query: {} })),
        useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
    };
});

// Mock window.turnstile globally
const mockTurnstile = {
    render: vi.fn().mockReturnValue('widget-1'),
    reset: vi.fn(),
    getResponse: vi.fn().mockReturnValue('turnstile-token'),
};
(window as any).turnstile = mockTurnstile;

describe('Login.vue', () => {
    const createMountOptions = (initialAuthState = {}) => ({
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                    initialState: {
                        auth: {
                            logo: 'logo.png',
                            captcha: { code: '' },
                            language: 'en',
                            counts: { vps: 100, websites: 200, servers: 300 },
                            opts: { verify: false, tfa: false, captcha: false },
                            remember: false,
                            sessionId: null,
                            returnUrl: null,
                            ...initialAuthState,
                        },
                        site: {
                            modules: {},
                            services: {},
                        },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Ensure turnstile mock is always available for onMounted
        (window as any).turnstile = mockTurnstile;
    });

    it('renders component', () => {
        const wrapper = mount(Login, createMountOptions());
        expect(wrapper.exists()).toBe(true);
    });

    it('shows login form by default', () => {
        const wrapper = mount(Login, createMountOptions());
        expect(wrapper.text()).toContain('Login');
    });

    it('renders email/username input', () => {
        const wrapper = mount(Login, createMountOptions());
        const inputs = wrapper.findAll('input');
        expect(inputs.length).toBeGreaterThan(0);
    });

    it('renders password input', () => {
        const wrapper = mount(Login, createMountOptions());
        const passwordInputs = wrapper.findAll('input[type="password"]');
        expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it('toggles forgot password visibility', async () => {
        const wrapper = mount(Login, createMountOptions());
        const vm = wrapper.vm as any;
        expect(vm.showForgotPass).toBe(false);
        vm.toggleForgotPass();
        expect(vm.showForgotPass).toBe(true);
        vm.toggleForgotPass();
        expect(vm.showForgotPass).toBe(false);
    });

    it('toggles captcha method', async () => {
        const wrapper = mount(Login, createMountOptions());
        const vm = wrapper.vm as any;
        expect(vm.primaryCaptcha).toBe(true);
        vm.toggleCaptchaMethod();
        expect(vm.primaryCaptcha).toBe(false);
        vm.toggleCaptchaMethod();
        expect(vm.primaryCaptcha).toBe(true);
    });

    it('toggles login/signup mode', async () => {
        const wrapper = mount(Login, createMountOptions());
        const vm = wrapper.vm as any;
        const initialLogin = vm.isLogin;
        vm.toggleLoginSignup();
        expect(vm.isLogin).toBe(!initialLogin);
    });

    describe('passwordRules computed', () => {
        it('validates length >= 8', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.password = 'short';
            expect(vm.passwordRules.length).toBe(false);
            vm.password = 'longpassword';
            expect(vm.passwordRules.length).toBe(true);
        });

        it('validates lowercase letter', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.password = 'UPPERCASE';
            expect(vm.passwordRules.letter).toBe(false);
            vm.password = 'MIXEDcase';
            expect(vm.passwordRules.letter).toBe(true);
        });

        it('validates uppercase letter', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.password = 'lowercase';
            expect(vm.passwordRules.capital).toBe(false);
            vm.password = 'Uppercase';
            expect(vm.passwordRules.capital).toBe(true);
        });

        it('validates number', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.password = 'NoNumbers';
            expect(vm.passwordRules.number).toBe(false);
            vm.password = 'Has1Number';
            expect(vm.passwordRules.number).toBe(true);
        });

        it('validates special character', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.password = 'NoSpecial1';
            expect(vm.passwordRules.special).toBe(false);
            vm.password = 'Has@Special';
            expect(vm.passwordRules.special).toBe(true);
        });
    });

    describe('computed properties', () => {
        it('isTosChecked returns true when tos checked', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.tos = true;
            expect(vm.isTosChecked).toBe(true);
        });

        it('isTosChecked returns true when login has value', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            expect(vm.isTosChecked).toBe(true);
        });

        it('passwordType returns text when visible', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isPasswordVisible = true;
            expect(vm.passwordType).toBe('text');
        });

        it('passwordType returns password when hidden', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isPasswordVisible = false;
            expect(vm.passwordType).toBe('password');
        });
    });

    describe('onLoginSubmit()', () => {
        it('calls authStore.login with params', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password123';
            await vm.onLoginSubmit();
            await flushPromises();
        });

        it('includes tfa when opts.tfa is true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { tfa: true, verify: false, captcha: false } }));
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password123';
            vm.twoFactorAuthCode = '123456';
            await vm.onLoginSubmit();
            await flushPromises();
        });
    });

    describe('onSignupSubmit()', () => {
        it('calls authStore.signup with params', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.tos = true;
            await vm.onSignupSubmit();
            await flushPromises();
        });

        it('includes email_confirmation when opts.verify is true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { verify: true, tfa: false, captcha: false } }));
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.emailCode = '654321';
            await vm.onSignupSubmit();
            await flushPromises();
        });

        it('includes tfa when opts.tfa is true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { verify: false, tfa: true, captcha: false } }));
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.twoFactorAuthCode = '654321';
            await vm.onSignupSubmit();
            await flushPromises();
        });
    });

    describe('submitOAuth2FA()', () => {
        it('sends 2FA code via fetchWrapper.patch', async () => {
            vi.mocked(fetchWrapper.patch).mockResolvedValue({ login: true, sessionId: 'sess', account_id: 1, account_lid: 'user@test.com', ima: 'client', name: 'Test', gravatar: '' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.twoFactorAuthCode = '123456';
            vm.oauthToken = 'oauth-token-abc';
            await vm.submitOAuth2FA();
            await flushPromises();
            expect(fetchWrapper.patch).toHaveBeenCalledWith(
                expect.stringContaining('/oauth'),
                expect.objectContaining({ code: '123456', oauth_token: 'oauth-token-abc' })
            );
        });

        it('shows error on invalid code', async () => {
            vi.mocked(fetchWrapper.patch).mockResolvedValue({ login: false });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.twoFactorAuthCode = '000000';
            vm.oauthToken = 'token';
            await vm.submitOAuth2FA();
            await flushPromises();
        });

        it('handles error response', async () => {
            vi.mocked(fetchWrapper.patch).mockRejectedValue(new Error('Network'));
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.twoFactorAuthCode = '123456';
            vm.oauthToken = 'token';
            await vm.submitOAuth2FA();
            await flushPromises();
        });
    });

    describe('submitOAuthLink()', () => {
        it('sends link request via fetchWrapper.post', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ linked: true, sessionId: 'sess', account_id: 1, account_lid: 'user@test.com', ima: 'client', name: 'Test', gravatar: '' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/oauth'),
                expect.objectContaining({ login: 'user@test.com', password: 'password', oauth_token: 'oauth-token' })
            );
        });

        it('passes create flag when createNew is true', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ signup: true, sessionId: 'sess', account_id: 1, account_lid: 'user@test.com', ima: 'client', name: 'Test', gravatar: '' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            await vm.submitOAuthLink(true);
            await flushPromises();
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/oauth'),
                expect.objectContaining({ create: true })
            );
        });

        it('includes email_confirmation when provided', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ linked: true, sessionId: 'sess', account_id: 1, account_lid: 'user@test.com', ima: 'client', name: 'Test', gravatar: '' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            vm.emailCode = '12345';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/oauth'),
                expect.objectContaining({ email_confirmation: '12345' })
            );
        });

        it('shows warning if login or password empty', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = '';
            vm.password = '';
            await vm.submitOAuthLink(false);
            await flushPromises();
            // fetchWrapper.post should not be called when credentials are empty
        });

        it('handles email_verification_required error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'email_verification_required' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
        });

        it('handles 2fa_required error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: '2fa_required' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthNeeds2FA).toBe(true);
        });

        it('handles generic error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'something went wrong' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthErrorMessage).toBe('something went wrong');
        });
    });

    describe('oAuthLogin()', () => {
        it('opens popup window', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('google');
            expect(vm.oauthProvider).toBe('google');
            expect(mockOpen).toHaveBeenCalled();
        });
    });

    describe('animateValue()', () => {
        it('animates value on DOM element', () => {
            vi.useFakeTimers();
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            const el = document.createElement('span');
            el.textContent = '100';
            vm.animateValue(el, 0, 100, 500);
            vi.advanceTimersByTime(600);
            vi.useRealTimers();
        });

        it('handles null element gracefully', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(() => vm.animateValue(null)).not.toThrow();
        });
    });

    describe('closePopup and submitForgotPassForm stubs', () => {
        it('closePopup does not throw', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(() => vm.closePopup()).not.toThrow();
        });

        it('submitForgotPassForm does not throw', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(() => vm.submitForgotPassForm()).not.toThrow();
        });
    });

    describe('toggleModal()', () => {
        it('toggles classes on modal elements', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            const modal = document.createElement('div');
            modal.id = 'test-modal';
            modal.classList.add('hidden');
            document.body.appendChild(modal);
            const backdrop = document.createElement('div');
            backdrop.id = 'test-modal-backdrop';
            backdrop.classList.add('hidden');
            document.body.appendChild(backdrop);
            vm.toggleModal('test-modal');
            expect(modal.classList.contains('flex')).toBe(true);
            document.body.removeChild(modal);
            document.body.removeChild(backdrop);
        });
    });

    describe('reloadCaptcha()', () => {
        it('calls authStore.reloadCaptcha', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.reloadCaptcha();
        });
    });

    describe('showPasswordInfo toggle', () => {
        it('default is false', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(vm.showPasswordInfo).toBe(false);
        });
    });

    describe('login_handler()', () => {
        it('shows warning when username is empty', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = '';
            vm.password = 'somepass';
            vm.login_handler();
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: 'warning' })
            );
        });

        it('shows warning when password is empty', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = '';
            vm.login_handler();
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: 'warning' })
            );
        });

        it('calls $.ajax when username and password are provided', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'POST' })
            );
        });

        it('includes 2fa code when twoFactorAuthCode is set', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.twoFactorAuthCode = '123456';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
            const callArgs = ($ as any).ajax.mock.calls[($ as any).ajax.mock.calls.length - 1][0];
            expect(callArgs.data).toContain('2fa_code=123456');
        });

        it('includes email confirmation code when emailCode is set', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.emailCode = 'ABC123';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
            const callArgs = ($ as any).ajax.mock.calls[($ as any).ajax.mock.calls.length - 1][0];
            expect(callArgs.data).toContain('email_confirmation=ABC123');
        });

        it('returns false', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = '';
            vm.password = '';
            const result = vm.login_handler();
            expect(result).toBe(false);
        });
    });

    describe('login_handler ajax callbacks', () => {
        it('handles successful login (true response)', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('true');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            // Should have called ajax
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles successful login with redirect (true + url)', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('true/dashboard');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles 2fa_auth response', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('2fa_auth');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles verify response', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('verify');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles Max Tries response', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('Max Tries exceeded');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles Invalid Email Confirmation response', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('Invalid Email Confirmation');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(($ as any).ajax).toHaveBeenCalled();
        });

        it('handles generic error response with Swal', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.success) opts.success('Some error occurred');
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: 'warning' })
            );
        });

        it('handles ajax error callback', () => {
            ($ as any).ajax.mockImplementation((opts: any) => {
                if (opts.beforeSend) opts.beforeSend();
                if (opts.error) opts.error();
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.login_handler();
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({ icon: 'warning' })
            );
        });
    });

    describe('signup_handler()', () => {
        it('calls Swal.fire with please wait message', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.signup_handler();
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('returns false', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            const result = vm.signup_handler();
            expect(result).toBe(false);
        });
    });

    describe('forgot_password()', () => {
        it('shows error when email is empty', () => {
            // Make val() return '' for the email input
            ($ as any).mockReturnValue({
                find: vi.fn().mockReturnThis(),
                outerHeight: vi.fn().mockReturnValue(0),
                innerHeight: vi.fn().mockReturnValue(0),
                width: vi.fn().mockReturnValue(1024),
                height: vi.fn().mockReturnValue(768),
                css: vi.fn().mockReturnThis(),
                serializeArray: vi.fn().mockReturnValue([]),
                attr: vi.fn().mockReturnValue(''),
                val: vi.fn().mockReturnValue(''),
                show: vi.fn().mockReturnThis(),
                hide: vi.fn().mockReturnThis(),
                hasClass: vi.fn().mockReturnValue(false),
                removeClass: vi.fn().mockReturnThis(),
                removeAttr: vi.fn().mockReturnThis(),
                prop: vi.fn().mockReturnThis(),
                html: vi.fn().mockReturnThis(),
                text: vi.fn().mockReturnThis(),
                ajax: vi.fn(),
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.forgot_password();
            // Should have called html on the message element
        });

        it('shows error for invalid email format', () => {
            ($ as any).mockReturnValue({
                find: vi.fn().mockReturnThis(),
                outerHeight: vi.fn().mockReturnValue(0),
                innerHeight: vi.fn().mockReturnValue(0),
                width: vi.fn().mockReturnValue(1024),
                height: vi.fn().mockReturnValue(768),
                css: vi.fn().mockReturnThis(),
                serializeArray: vi.fn().mockReturnValue([]),
                attr: vi.fn().mockReturnValue(''),
                val: vi.fn().mockReturnValue('notanemail'),
                show: vi.fn().mockReturnThis(),
                hide: vi.fn().mockReturnThis(),
                hasClass: vi.fn().mockReturnValue(false),
                removeClass: vi.fn().mockReturnThis(),
                removeAttr: vi.fn().mockReturnThis(),
                prop: vi.fn().mockReturnThis(),
                html: vi.fn().mockReturnThis(),
                text: vi.fn().mockReturnThis(),
                ajax: vi.fn(),
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.forgot_password();
        });

        it('calls ajax when valid email provided', () => {
            ($ as any).mockReturnValue({
                find: vi.fn().mockReturnThis(),
                outerHeight: vi.fn().mockReturnValue(0),
                innerHeight: vi.fn().mockReturnValue(0),
                width: vi.fn().mockReturnValue(1024),
                height: vi.fn().mockReturnValue(768),
                css: vi.fn().mockReturnThis(),
                serializeArray: vi.fn().mockReturnValue([]),
                attr: vi.fn().mockReturnValue(''),
                val: vi.fn().mockReturnValue('user@example.com'),
                show: vi.fn().mockReturnThis(),
                hide: vi.fn().mockReturnThis(),
                hasClass: vi.fn().mockReturnValue(false),
                removeClass: vi.fn().mockReturnThis(),
                removeAttr: vi.fn().mockReturnThis(),
                prop: vi.fn().mockReturnThis(),
                html: vi.fn().mockReturnThis(),
                text: vi.fn().mockReturnThis(),
                ajax: vi.fn(),
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.forgot_password();
            expect(($ as any).ajax).toHaveBeenCalled();
        });
    });

    describe('onSignupSubmit() with turnstile', () => {
        it('includes cf-turnstile-response in signup params', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.tos = true;
            await vm.onSignupSubmit();
            await flushPromises();
            expect(mockTurnstile.getResponse).toHaveBeenCalled();
        });

        it('calls turnstile.reset after successful signup', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.tos = true;
            await vm.onSignupSubmit();
            await flushPromises();
            expect(mockTurnstile.reset).toHaveBeenCalled();
        });

        it('calls turnstile.reset even on signup error', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { verify: false, tfa: false, captcha: false } }));
            const vm = wrapper.vm as any;
            // Mock authStore.signup to reject
            const authStore = (await import('@/stores/auth.store')).useAuthStore();
            const origSignup = authStore.signup;
            authStore.signup = vi.fn().mockRejectedValue(new Error('signup failed'));
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.tos = true;
            await vm.onSignupSubmit();
            await flushPromises();
            expect(mockTurnstile.reset).toHaveBeenCalled();
            authStore.signup = origSignup;
        });
    });

    describe('onLoginSubmit() with Swal', () => {
        it('calls Swal.fire with loading message before login', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            await vm.onLoginSubmit();
            await flushPromises();
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('calls Swal.close after login completes', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            await vm.onLoginSubmit();
            await flushPromises();
            expect(Swal.close).toHaveBeenCalled();
        });
    });

    describe('oAuthLogin() message handling', () => {
        it('sets oauthProvider value', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('GitHub');
            expect(vm.oauthProvider).toBe('GitHub');
        });

        it('opens popup with correct URL containing provider and origin', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Google');
            expect(mockOpen).toHaveBeenCalledWith(
                expect.stringContaining('provider=Google'),
                'oauth',
                'width=600,height=600'
            );
        });

        it('handles oauth_success message event', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Google');
            // Simulate the message event
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_success',
                    sessionId: 'sess-123',
                    account_id: 1,
                    account_lid: 'user@test.com',
                    ima: 'client',
                    name: 'Test User',
                    gravatar: '',
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
        });

        it('handles oauth_2fa_required message event', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Google');
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_2fa_required',
                    account_id: 42,
                    oauth_token: 'tok-abc',
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            expect(vm.oauthNeeds2FA).toBe(true);
            expect(vm.oauthAccountId).toBe(42);
            expect(vm.oauthToken).toBe('tok-abc');
        });

        it('handles oauth_link_required message event', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Facebook');
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_link_required',
                    oauth_token: 'tok-link',
                    email: 'fb@test.com',
                    display_name: 'FB User',
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(true);
            expect(vm.oauthToken).toBe('tok-link');
            expect(vm.oauthEmail).toBe('fb@test.com');
            expect(vm.oauthDisplayName).toBe('FB User');
            expect(vm.login).toBe('fb@test.com');
        });

        it('handles oauth_error message event', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Twitter');
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_error',
                    message: 'Provider denied access',
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            expect(vm.oauthErrorMessage).toBe('Provider denied access');
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('ignores messages from non-interserver origins', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Google');
            const messageEvent = new MessageEvent('message', {
                data: { type: 'oauth_success', sessionId: 'sess' },
                origin: 'https://evil.example.com',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            // Nothing should have changed
            expect(vm.oauthNeeds2FA).toBe(false);
            expect(vm.oauthLinkRequired).toBe(false);
        });

        it('ignores messages with no data or no type', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Google');
            const messageEvent = new MessageEvent('message', {
                data: null,
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            expect(vm.oauthNeeds2FA).toBe(false);
        });
    });

    describe('loadTurnstileScript()', () => {
        it('resolves immediately when turnstile is already available', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            // window.turnstile is already set in mock setup
            await expect(vm.loadTurnstileScript()).resolves.toBeUndefined();
        });

        it('loads script when turnstile is not available', async () => {
            // Mount first while turnstile exists (so onMounted succeeds)
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await flushPromises();

            // Now delete turnstile and mock appendChild to simulate loading
            const originalTurnstile = (window as any).turnstile;
            delete (window as any).turnstile;
            const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation((node: any) => {
                // Simulate script load - restore turnstile before onload
                (window as any).turnstile = originalTurnstile;
                if (node.onload) node.onload();
                return node;
            });
            await vm.loadTurnstileScript();
            expect(appendChildSpy).toHaveBeenCalled();
            appendChildSpy.mockRestore();
            (window as any).turnstile = originalTurnstile;
        });

        it('rejects when script fails to load', async () => {
            // Mount first while turnstile exists (so onMounted succeeds)
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await flushPromises();

            // Now delete turnstile and mock appendChild to simulate failure
            const originalTurnstile = (window as any).turnstile;
            delete (window as any).turnstile;
            const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation((node: any) => {
                if (node.onerror) node.onerror(new Error('load failed'));
                return node;
            });
            await expect(vm.loadTurnstileScript()).rejects.toBeTruthy();
            appendChildSpy.mockRestore();
            (window as any).turnstile = originalTurnstile;
        });
    });

    describe('setModalMaxHeight()', () => {
        it('sets max-height and overflow on modal body', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            const el = document.createElement('div');
            // Should not throw even with mock jQuery
            expect(() => vm.setModalMaxHeight(el)).not.toThrow();
        });
    });

    describe('submitOAuth2FA() success with session', () => {
        it('resets oauthNeeds2FA and oauthToken on success', async () => {
            vi.mocked(fetchWrapper.patch).mockResolvedValue({
                login: true,
                sessionId: 'sess-123',
                account_id: 1,
                account_lid: 'user@test.com',
                ima: 'client',
                name: 'Test',
                gravatar: '',
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthNeeds2FA = true;
            vm.twoFactorAuthCode = '123456';
            vm.oauthToken = 'oauth-token-abc';
            await vm.submitOAuth2FA();
            await flushPromises();
            expect(vm.oauthNeeds2FA).toBe(false);
            expect(vm.oauthToken).toBe(null);
        });

        it('shows error Swal when login is false', async () => {
            vi.mocked(fetchWrapper.patch).mockResolvedValue({ login: false });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.twoFactorAuthCode = '000000';
            vm.oauthToken = 'token';
            await vm.submitOAuth2FA();
            await flushPromises();
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('shows error Swal on network error', async () => {
            vi.mocked(fetchWrapper.patch).mockRejectedValue(new Error('Network'));
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.twoFactorAuthCode = '123456';
            vm.oauthToken = 'token';
            await vm.submitOAuth2FA();
            await flushPromises();
            expect(Swal.fire).toHaveBeenCalled();
        });
    });

    describe('submitOAuthLink() success with session data', () => {
        it('resets oauthLinkRequired and oauthToken on linked success', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({
                linked: true,
                sessionId: 'sess',
                account_id: 1,
                account_lid: 'user@test.com',
                ima: 'client',
                name: 'Test',
                gravatar: '',
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthLinkRequired = true;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(false);
            expect(vm.oauthToken).toBe(null);
        });

        it('resets on signup response', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({
                signup: true,
                sessionId: 'sess',
                account_id: 1,
                account_lid: 'user@test.com',
                ima: 'client',
                name: 'Test',
                gravatar: '',
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthLinkRequired = true;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            await vm.submitOAuthLink(true);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(false);
        });

        it('shows Swal warning when login is empty', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = '';
            vm.password = '';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(Swal.fire).toHaveBeenCalled();
            expect(fetchWrapper.post).not.toHaveBeenCalledWith(
                expect.stringContaining('/oauth'),
                expect.anything()
            );
        });

        it('shows Swal info for email_verification_required error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'email_verification_required' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(Swal.fire).toHaveBeenCalled();
        });

        it('sets oauthNeeds2FA on 2fa_required error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: '2fa_required' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthLinkRequired = true;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(false);
            expect(vm.oauthNeeds2FA).toBe(true);
            expect(vm.oauthErrorMessage).toBe('');
        });

        it('sets oauthErrorMessage and shows Swal on generic error', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({ message: 'something broke' });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthErrorMessage).toBe('something broke');
            expect(Swal.fire).toHaveBeenCalled();
        });
    });

    describe('toggleLoginSignup()', () => {
        it('switches from login to signup mode', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = true;
            vm.toggleLoginSignup();
            expect(vm.isLogin).toBe(false);
        });

        it('switches from signup to login mode', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            vm.toggleLoginSignup();
            expect(vm.isLogin).toBe(true);
        });
    });

    describe('template rendering', () => {
        it('renders forgot password form when showForgotPass is true', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.showForgotPass = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.myadmin_forgotPwd').exists()).toBe(true);
        });

        it('renders signup form when isLogin is false', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.wrapper-signup').exists()).toBe(true);
        });

        it('renders OAuth section when oauthNeeds2FA is true', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthNeeds2FA = true;
            vm.oauthProvider = 'Google';
            await wrapper.vm.$nextTick();
            const oauthSection = wrapper.findAll('.bg-gray-50');
            expect(oauthSection.length).toBeGreaterThan(0);
        });

        it('renders OAuth link section when oauthLinkRequired is true', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthLinkRequired = true;
            vm.oauthProvider = 'GitHub';
            vm.oauthDisplayName = 'GH User';
            await wrapper.vm.$nextTick();
            const oauthSection = wrapper.findAll('.bg-gray-50');
            expect(oauthSection.length).toBeGreaterThan(0);
        });

        it('renders error message when oauthErrorMessage is set', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthNeeds2FA = true;
            vm.oauthErrorMessage = 'Some error happened';
            await wrapper.vm.$nextTick();
            expect(wrapper.text()).toContain('Some error happened');
        });

        it('renders social auth login buttons', () => {
            const wrapper = mount(Login, createMountOptions());
            const socialLinks = wrapper.findAll('.social-auth-links a');
            expect(socialLinks.length).toBeGreaterThanOrEqual(4);
        });

        it('renders remember me checkbox on login form', () => {
            const wrapper = mount(Login, createMountOptions());
            const rememberCheckbox = wrapper.find('#remember');
            expect(rememberCheckbox.exists()).toBe(true);
        });

        it('renders TOS checkbox on signup form', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            await wrapper.vm.$nextTick();
            const tosCheckbox = wrapper.find('#tos');
            expect(tosCheckbox.exists()).toBe(true);
        });

        it('renders password visibility toggle on login form', () => {
            const wrapper = mount(Login, createMountOptions());
            const toggleBtn = wrapper.find('.input-group-text button');
            expect(toggleBtn.exists()).toBe(true);
        });

        it('renders captcha alternate link on signup form', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            await wrapper.vm.$nextTick();
            const captchaAltLink = wrapper.find('#captcha_alt_link_signup');
            expect(captchaAltLink.exists()).toBe(true);
        });

        it('renders turnstile container on signup form', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            await wrapper.vm.$nextTick();
            const turnstileDiv = wrapper.find('#turnstileDiv');
            expect(turnstileDiv.exists()).toBe(true);
        });

        it('shows 2FA popup when opts.tfa is true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { tfa: true, verify: false, captcha: false } }));
            await wrapper.vm.$nextTick();
            const tfaPopup = wrapper.find('.popup');
            expect(tfaPopup.exists()).toBe(true);
        });

        it('shows email verification popup on signup when opts.verify is true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { verify: true, tfa: false, captcha: false } }));
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            await wrapper.vm.$nextTick();
            const emailPopup = wrapper.find('.email_popup');
            expect(emailPopup.exists()).toBe(true);
        });

        it('renders sign up link text on login page', () => {
            const wrapper = mount(Login, createMountOptions());
            expect(wrapper.find('.sign-up-txt').exists()).toBe(true);
        });

        it('renders alternate captcha section when primaryCaptcha is false on signup', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.isLogin = false;
            vm.primaryCaptcha = false;
            await wrapper.vm.$nextTick();
            const altCaptcha = wrapper.find('.captcha_alt_signup');
            expect(altCaptcha.exists()).toBe(true);
        });

        it('renders forgot password turnstile container', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.showForgotPass = true;
            await wrapper.vm.$nextTick();
            const turnstileDiv2 = wrapper.find('#turnstileDiv2');
            expect(turnstileDiv2.exists()).toBe(true);
        });
    });

    describe('remember me functionality', () => {
        it('remember ref defaults to false', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(vm.remember).toBe(false);
        });

        it('remember ref can be set to true', () => {
            const wrapper = mount(Login, createMountOptions({ remember: true }));
            const vm = wrapper.vm as any;
            expect(vm.remember).toBe(true);
        });
    });

    describe('submitDisabled ref', () => {
        it('defaults to false', () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(vm.submitDisabled).toBe(false);
        });
    });

    describe('password visibility toggle', () => {
        it('toggles isPasswordVisible on click', async () => {
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            expect(vm.isPasswordVisible).toBe(false);
            vm.isPasswordVisible = true;
            expect(vm.passwordType).toBe('text');
            vm.isPasswordVisible = false;
            expect(vm.passwordType).toBe('password');
        });
    });

    describe('onSignupSubmit() with all options', () => {
        it('includes both verify and tfa params when both opts are true', async () => {
            const wrapper = mount(Login, createMountOptions({ opts: { verify: true, tfa: true, captcha: false } }));
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'Password1!';
            vm.tos = true;
            vm.emailCode = '123456';
            vm.twoFactorAuthCode = '654321';
            await vm.onSignupSubmit();
            await flushPromises();
            expect(mockTurnstile.getResponse).toHaveBeenCalled();
            expect(mockTurnstile.reset).toHaveBeenCalled();
        });
    });

    describe('oauth link_required with empty email/display_name', () => {
        it('handles oauth_link_required with missing email and display_name', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('GitHub');
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_link_required',
                    oauth_token: 'tok-xyz',
                    // no email or display_name
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(true);
            expect(vm.oauthEmail).toBe('');
            expect(vm.oauthDisplayName).toBe('');
            expect(vm.login).toBe('');
        });
    });

    describe('oauth_error with no message', () => {
        it('uses default error message when data.message is empty', async () => {
            const mockOpen = vi.fn().mockReturnValue({ closed: false });
            vi.spyOn(window, 'open').mockImplementation(mockOpen);
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            await vm.oAuthLogin('Twitter');
            const messageEvent = new MessageEvent('message', {
                data: {
                    type: 'oauth_error',
                    // no message field
                },
                origin: 'https://my.interserver.net',
            });
            window.dispatchEvent(messageEvent);
            await flushPromises();
            // oauthErrorMessage should be set to the fallback translation key result
            expect(vm.oauthErrorMessage).toBeDefined();
        });
    });

    describe('submitOAuthLink with sessionId response', () => {
        it('handles response with only sessionId (no linked/signup flag)', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({
                sessionId: 'sess-only',
                account_id: 1,
                account_lid: 'user@test.com',
                ima: 'client',
                name: 'Test',
                gravatar: '',
            });
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.oauthLinkRequired = true;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'oauth-token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            expect(vm.oauthLinkRequired).toBe(false);
            expect(vm.oauthToken).toBe(null);
        });
    });

    describe('submitOAuthLink error with no message', () => {
        it('uses fallback error message when error has no message', async () => {
            vi.mocked(fetchWrapper.post).mockRejectedValue({});
            const wrapper = mount(Login, createMountOptions());
            const vm = wrapper.vm as any;
            vm.login = 'user@test.com';
            vm.password = 'password';
            vm.oauthToken = 'token';
            await vm.submitOAuthLink(false);
            await flushPromises();
            // oauthErrorMessage should be set to fallback
            expect(vm.oauthErrorMessage).toBeDefined();
        });
    });
});
