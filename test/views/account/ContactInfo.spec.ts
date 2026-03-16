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
        expect(wrapper.find('#locale').exists()).toBe(true);
    });

    it('renders Currency select', () => {
        const wrapper = mount(ContactInfo, mountOptions);
        expect(wrapper.find('#currency').exists()).toBe(true);
    });
});
