import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ContactInfo from '@/views/account/ContactInfo.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({ message: 'success' }),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: vi.fn(() => ({ params: {}, query: {} })),
        useRouter: vi.fn(() => ({ push: vi.fn() })),
    };
});

describe('ContactInfo.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                    initialState: {
                        auth: {
                            user: { account_id: 1, name: 'Test', account_lid: 'test@test.com', gravatar: '' },
                        },
                        account: {
                            data: {
                                account_id: 1,
                                account_lid: 'testuser',
                                name: 'Test User',
                                email: 'test@example.com',
                                company: 'Test Corp',
                                address: '123 Test St',
                                address2: '',
                                city: 'Testville',
                                state: 'NJ',
                                zip: '07001',
                                country: 'US',
                                phone: '555-1234',
                                payment_method: 'paypal',
                                ima: 'client',
                                status: 'active',
                                pin: 1234,
                                currency: 'USD',
                                locale: 'auto',
                                timezone: 'America/New_York',
                                gstin: '',
                                disable_email_notifications: 0,
                                disable_reset: 0,
                                disable_server_notifications: 0,
                                disable_reinstall: 0,
                                email_invoices: '',
                                email_abuse: '',
                            },
                            loading: false,
                            gravatar: 'https://gravatar.com/test',
                            ip: '127.0.0.1',
                            ima: 'client',
                            custid: 1,
                        },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    };

    it('renders component', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('shows Update Contact Info heading', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.text()).toContain('Update Contact Info');
    });

    it('renders personal information fields', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#name').exists()).toBe(true);
        expect(wrapper.find('#company').exists()).toBe(true);
        expect(wrapper.find('#address').exists()).toBe(true);
        expect(wrapper.find('#city').exists()).toBe(true);
        expect(wrapper.find('#zip').exists()).toBe(true);
        expect(wrapper.find('#phone').exists()).toBe(true);
    });

    it('renders country select', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#country').exists()).toBe(true);
    });

    it('renders timezone select', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#timezone').exists()).toBe(true);
    });

    it('renders Other Settings section', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.text()).toContain('Other Settings');
        expect(wrapper.text()).toContain('Disable (Forgot your Password) Password Resets');
        expect(wrapper.text()).toContain('Disable Invoice Reminder Email Notifications');
        expect(wrapper.text()).toContain('Disable Server Invoice Reminder Email Notifications');
        expect(wrapper.text()).toContain('Disable Reinstall');
    });

    it('renders alternate email fields', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#email_invoices').exists()).toBe(true);
        expect(wrapper.find('#email_abuse').exists()).toBe(true);
    });

    it('renders Update Info submit button', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#save_settings').exists()).toBe(true);
    });

    it('renders avatar image', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        const img = wrapper.find('img.avatar');
        expect(img.exists()).toBe(true);
    });

    it('shows user name and account_id', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.text()).toContain('Test User');
        expect(wrapper.text()).toContain('1');
    });

    it('submits form and calls fetchWrapper.post', async () => {
        vi.mocked(fetchWrapper.post).mockResolvedValue({ message: 'success' });
        const wrapper = mount(ContactInfo, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
        expect(fetchWrapper.post).toHaveBeenCalledWith(
            expect.stringContaining('/account'),
            expect.objectContaining({ name: 'Test User' })
        );
    });

    it('handles failed form submission', async () => {
        vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Failed'));
        const wrapper = mount(ContactInfo, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
    });

    it('loads countries, timezones, currencies, locales on mount', () => {
        mount(ContactInfo, mountOptions);
        // Should call get for countries, timezones, currencies, locales
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/account/countries'));
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/account/timezones'));
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/account/currencies'));
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/account/locales'));
    });

    it('renders Language select', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('.locale-preview-select').exists()).toBe(true);
    });

    it('renders Currency select', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#currency').exists()).toBe(true);
    });

    describe('populated dropdown options', () => {
        it('renders country options when countries are loaded', async () => {
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/countries')) return { US: 'United States', IN: 'India' };
                if (url.includes('/account/timezones')) return ['America/New_York', 'Asia/Kolkata'];
                if (url.includes('/account/currencies')) return ['USD', 'INR'];
                if (url.includes('/account/locales')) return { 'en-US': { name: 'English', local_name: 'English' }, 'hi-IN': { name: 'Hindi', local_name: 'हिन्दी' } };
                return {};
            });
            const wrapper = mount(ContactInfo, mountOptions);
            await flushPromises();
            const countrySelect = wrapper.find('#country');
            expect(countrySelect.exists()).toBe(true);
            const options = countrySelect.findAll('option');
            expect(options.length).toBeGreaterThanOrEqual(2);
        });

        it('renders timezone options when timezones are loaded', async () => {
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/timezones')) return ['America/New_York', 'Asia/Kolkata'];
                if (url.includes('/account/countries')) return {};
                if (url.includes('/account/currencies')) return [];
                if (url.includes('/account/locales')) return {};
                return {};
            });
            const wrapper = mount(ContactInfo, mountOptions);
            await flushPromises();
            const tzSelect = wrapper.find('#timezone');
            const options = tzSelect.findAll('option');
            expect(options.length).toBeGreaterThanOrEqual(2);
        });

        it('renders currency options when currencies are loaded', async () => {
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/currencies')) return ['USD', 'EUR'];
                if (url.includes('/account/countries')) return {};
                if (url.includes('/account/timezones')) return [];
                if (url.includes('/account/locales')) return {};
                return {};
            });
            const wrapper = mount(ContactInfo, mountOptions);
            await flushPromises();
            const currSelect = wrapper.find('#currency');
            const options = currSelect.findAll('option');
            expect(options.length).toBeGreaterThanOrEqual(2);
        });

        it('renders locale options when locales are loaded', async () => {
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/locales')) return { 'en-US': { name: 'English', local_name: 'English' }, 'fr-FR': { name: 'French', local_name: 'Français' } };
                if (url.includes('/account/countries')) return {};
                if (url.includes('/account/timezones')) return [];
                if (url.includes('/account/currencies')) return [];
                return {};
            });
            const wrapper = mount(ContactInfo, mountOptions);
            await flushPromises();
            const localeSelect = wrapper.find('.locale-preview-select');
            expect(localeSelect.exists()).toBe(true);
            // Open the dropdown to render options
            await localeSelect.find('button').trigger('click');
            const options = localeSelect.findAll('li[role="option"]');
            // 'auto' option + 2 locales
            expect(options.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('error handling for data loading', () => {
        it('handles loadTimezones failure', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/timezones')) throw new Error('tz fail');
                return {};
            });
            mount(ContactInfo, mountOptions);
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            const hasTzCall = consoleSpy.mock.calls.some((args) => args.some((a) => a === 'error loading timezones:'));
            expect(hasTzCall).toBe(true);
            consoleSpy.mockRestore();
        });

        it('handles loadCountries failure', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/countries')) throw new Error('countries fail');
                return {};
            });
            mount(ContactInfo, mountOptions);
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            const hasCall = consoleSpy.mock.calls.some((args) => args.some((a) => a === 'error loading countries:'));
            expect(hasCall).toBe(true);
            consoleSpy.mockRestore();
        });

        it('handles loadCurrencies failure', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/currencies')) throw new Error('currencies fail');
                return {};
            });
            mount(ContactInfo, mountOptions);
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            const hasCall = consoleSpy.mock.calls.some((args) => args.some((a) => a === 'error loading currencies:'));
            expect(hasCall).toBe(true);
            consoleSpy.mockRestore();
        });

        it('handles loadLocales failure', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.mocked(fetchWrapper.get).mockImplementation(async (url: string) => {
                if (url.includes('/account/locales')) throw new Error('locales fail');
                return {};
            });
            mount(ContactInfo, mountOptions);
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            const hasCall = consoleSpy.mock.calls.some((args) => args.some((a) => a === 'error loading locales:'));
            expect(hasCall).toBe(true);
            consoleSpy.mockRestore();
        });
    });

    describe('form field rendering with data', () => {
        it('renders zip input with model value', () => {
            const wrapper = mount(ContactInfo, mountOptions);
            const zip = wrapper.find('#zip');
            expect(zip.exists()).toBe(true);
            expect((zip.element as HTMLInputElement).value).toBe('07001');
        });

        it('renders phone input with model value', () => {
            const wrapper = mount(ContactInfo, mountOptions);
            const phone = wrapper.find('#phone');
            expect(phone.exists()).toBe(true);
            expect((phone.element as HTMLInputElement).value).toBe('555-1234');
        });

        it('renders checkbox fields for disable settings', () => {
            const wrapper = mount(ContactInfo, mountOptions);
            expect(wrapper.find('#disable_reset').exists()).toBe(true);
            expect(wrapper.find('#disable_email_notifications').exists()).toBe(true);
            expect(wrapper.find('#disable_server_notifications').exists()).toBe(true);
            expect(wrapper.find('#disable_reinstall').exists()).toBe(true);
        });

        it('renders email_invoices input', () => {
            const wrapper = mount(ContactInfo, mountOptions);
            const emailInvoices = wrapper.find('#email_invoices');
            expect(emailInvoices.exists()).toBe(true);
            expect((emailInvoices.element as HTMLInputElement).type).toBe('email');
        });

        it('renders email_abuse input', () => {
            const wrapper = mount(ContactInfo, mountOptions);
            const emailAbuse = wrapper.find('#email_abuse');
            expect(emailAbuse.exists()).toBe(true);
            expect((emailAbuse.element as HTMLInputElement).type).toBe('email');
        });

        it('shows GSTIN field when country is IN', async () => {
            const indiaMountOptions = {
                global: {
                    ...mountOptions.global,
                    plugins: [
                        createTestingPinia({
                            createSpy: vi.fn,
                            stubActions: true,
                            initialState: {
                                auth: {
                                    user: { account_id: 1, name: 'Test', account_lid: 'test@test.com', gravatar: '' },
                                },
                                account: {
                                    data: {
                                        account_id: 1,
                                        account_lid: 'testuser',
                                        name: 'Test User',
                                        email: 'test@example.com',
                                        company: 'Test Corp',
                                        address: '123 Test St',
                                        address2: '',
                                        city: 'Mumbai',
                                        state: 'MH',
                                        zip: '400001',
                                        country: 'IN',
                                        phone: '555-1234',
                                        payment_method: 'paypal',
                                        ima: 'client',
                                        status: 'active',
                                        pin: 1234,
                                        currency: 'INR',
                                        locale: 'auto',
                                        timezone: 'Asia/Kolkata',
                                        gstin: '22AAAAA0000A1Z5',
                                        disable_email_notifications: 0,
                                        disable_reset: 0,
                                        disable_server_notifications: 0,
                                        disable_reinstall: 0,
                                        email_invoices: '',
                                        email_abuse: '',
                                    },
                                    loading: false,
                                    gravatar: '',
                                    ip: '127.0.0.1',
                                    ima: 'client',
                                    custid: 1,
                                },
                            },
                        }),
                    ],
                },
            };
            const wrapper = mount(ContactInfo, indiaMountOptions);
            expect(wrapper.find('#gstin').exists()).toBe(true);
        });
    });
});
