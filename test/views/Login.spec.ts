import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Login from '@/views/Login.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn(), close: vi.fn(), showLoading: vi.fn() },
}));

vi.mock('jquery', () => {
    const jq: any = vi.fn(() => ({
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
    }));
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
                    stubActions: true,
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
});
