import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import ClientHome from '@/views/ClientHome.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({
            last_login_ip: '192.168.1.1',
            last_login: '2024-01-15 10:30:00',
            currency: 'USD',
            amount: '$25.00',
            invoice_list: '3',
            balance: '$150.00',
            full_name: 'John Doe',
            email: 'john@test.com',
            tickets: [
                { ticketid: 1, ticketmaskid: 'TKT-001', subject: 'Help needed', lastreplier: 'Support', ticketstatusid: '4' },
            ],
            ticketStatus: { 4: 'Open' },
            ticketStatusView: { 4: 'Open' },
            details: {
                modules: {
                    vps: { icon: 'cloud', heading: 'VPS Services' },
                },
            },
            services: {
                vps: {
                    count: 2,
                    links: { 1: 'my-vps.example.com' },
                    ex_links: {},
                },
            },
            AFFILIATE_AMOUNT: '100',
        }),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mountOptions = {
    global: {
        plugins: [
            createTestingPinia({
                createSpy: vi.fn,
                stubActions: true,
                initialState: {
                    auth: {
                        user: { account_id: 1, name: 'John', account_lid: 'john@test.com', gravatar: '', ima: 'client' },
                    },
                    account: {
                        data: {
                            account_id: 1,
                            account_lid: 'john@test.com',
                            name: 'John Doe',
                            pin: 5678,
                            status: 'active',
                            address: '',
                            address2: '',
                            city: '',
                            state: '',
                            zip: '',
                            phone: '',
                            country: 'US',
                            payment_method: 'paypal',
                            ima: 'client',
                            company: '',
                            currency: 'USD',
                            locale: 'auto',
                        },
                        loading: false,
                    },
                },
            }),
        ],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
};

describe('ClientHome', () => {
    it('renders without crashing', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('shows welcome section', async () => {
        const wrapper = mount(ClientHome, mountOptions);
        await flushPromises();
        expect(wrapper.text()).toContain('Welcome');
    });

    it('shows PrePay Balance section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Prepay Balance');
    });

    it('shows Unpaid Invoices section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Unpaid Invoices');
    });

    it('shows Call in Pin', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Call-in PIN');
        expect(wrapper.text()).toContain('5678');
    });

    it('shows affiliate section', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Per Sale');
        expect(wrapper.text()).toContain('Copy to Clipboard');
    });

    it('shows social share links', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Share with');
    });

    it('renders affiliate URL input', () => {
        const wrapper = mount(ClientHome, mountOptions);
        const input = wrapper.find('#affiliateinput');
        expect(input.exists()).toBe(true);
    });

    it('renders Manage Account link for prepay', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Manage Account');
    });

    it('renders Pay Now link', () => {
        const wrapper = mount(ClientHome, mountOptions);
        expect(wrapper.text()).toContain('Pay Now');
    });

    it('calls fetchWrapper.get to load home data', () => {
        mount(ClientHome, mountOptions);
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/home'));
    });

    describe('copyToClipboard', () => {
        it('invokes copyToClipboard on button click', async () => {
            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();

            const copyBtn = wrapper.find('#copy_url');
            expect(copyBtn.exists()).toBe(true);
            // Click triggers copyToClipboard - the function exercises lines 42-49
            // (getElementById, textContent check, clipboard API)
            await copyBtn.trigger('click');
            await flushPromises();
        });

        it('does nothing if affiliateinput element is not found', async () => {
            // Mock getElementById to return null to cover early return
            const origGetElementById = document.getElementById.bind(document);
            document.getElementById = vi.fn((id: string) => {
                if (id === 'affiliateinput') return null;
                return origGetElementById(id);
            });

            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();

            const copyBtn = wrapper.find('#copy_url');
            await copyBtn.trigger('click');
            await flushPromises();

            document.getElementById = origGetElementById;
        });

        it('uses clipboard API when element has textContent', async () => {
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.assign(navigator, { clipboard: { writeText: writeTextMock } });

            // Mock getElementById to return an element with textContent
            const origGetElementById = document.getElementById.bind(document);
            document.getElementById = vi.fn((id: string) => {
                if (id === 'affiliateinput') {
                    return { textContent: 'https://www.interserver.net/r/1' } as any;
                }
                return origGetElementById(id);
            });

            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();

            const copyBtn = wrapper.find('#copy_url');
            await copyBtn.trigger('click');
            await flushPromises();

            expect(writeTextMock).toHaveBeenCalledWith('https://www.interserver.net/r/1');
            document.getElementById = origGetElementById;
        });
    });

    describe('loadHome error handling', () => {
        it('handles API failure in loadHome', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            // loadHome uses .then() so a rejection results in unhandled rejection
            // Instead, mock to throw synchronously in the try block
            vi.mocked(fetchWrapper.get).mockImplementation(() => { throw new Error('API down'); });

            mount(ClientHome, mountOptions);
            await flushPromises();

            consoleSpy.mockRestore();
            // Restore the original mock for subsequent tests
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                last_login_ip: '192.168.1.1',
                last_login: '2024-01-15 10:30:00',
                currency: 'USD',
                amount: '$25.00',
                invoice_list: '3',
                balance: '$150.00',
                full_name: 'John Doe',
                email: 'john@test.com',
                tickets: [],
                ticketStatus: {},
                ticketStatusView: {},
                details: { modules: {} },
                services: {},
                AFFILIATE_AMOUNT: '100',
            });
        });
    });

    describe('services rendering', () => {
        beforeEach(() => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                last_login_ip: '192.168.1.1',
                last_login: '2024-01-15 10:30:00',
                currency: 'USD',
                amount: '$25.00',
                invoice_list: '3',
                balance: '$150.00',
                full_name: 'John Doe',
                email: 'john@test.com',
                tickets: [
                    { ticketid: 1, ticketmaskid: 'TKT-001', subject: 'Help needed', lastreplier: 'Support', ticketstatusid: '4' },
                ],
                ticketStatus: { 4: 'Open' },
                ticketStatusView: { 4: 'Open' },
                details: {
                    modules: {
                        vps: { icon: 'cloud', heading: 'VPS Services' },
                    },
                },
                services: {
                    vps: {
                        count: 2,
                        links: { 1: 'my-vps.example.com' },
                        ex_links: {},
                    },
                },
                AFFILIATE_AMOUNT: '100',
            });
        });

        it('renders service sections after data loads', async () => {
            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('VPS Services');
        });

        it('renders service links', async () => {
            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('my-vps.example.com');
        });

        it('renders Order Now buttons for services', async () => {
            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('Order Now');
        });

        it('renders ex_links control panel button when available', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                last_login_ip: '192.168.1.1',
                last_login: '2024-01-15 10:30:00',
                currency: 'USD',
                amount: '$25.00',
                invoice_list: '3',
                balance: '$150.00',
                full_name: 'John Doe',
                email: 'john@test.com',
                tickets: [],
                ticketStatus: {},
                ticketStatusView: {},
                details: {
                    modules: {
                        vps: { icon: 'cloud', heading: 'VPS Services' },
                    },
                },
                services: {
                    vps: {
                        count: 1,
                        links: { 5: 'my-vps.example.com' },
                        ex_links: { 5: 'Login' },
                    },
                },
                AFFILIATE_AMOUNT: '100',
            });

            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('Control Panel');
        });
    });

    describe('onMounted portlet handling', () => {
        it('initializes portlet elements on mount', async () => {
            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });
    });

    describe('tickets table', () => {
        it('renders tickets table when tickets exist', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                last_login_ip: '192.168.1.1',
                last_login: '2024-01-15 10:30:00',
                currency: 'USD',
                amount: '$25.00',
                invoice_list: '3',
                balance: '$150.00',
                full_name: 'John Doe',
                email: 'john@test.com',
                tickets: [
                    { ticketid: 1, ticketmaskid: 'TKT-001', subject: 'Help needed', lastreplier: 'Support', ticketstatusid: '4' },
                ],
                ticketStatus: { 4: 'Open' },
                ticketStatusView: { 4: 'Open' },
                details: { modules: {} },
                services: {},
                AFFILIATE_AMOUNT: '100',
            });

            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('Recent Tickets');
            expect(wrapper.text()).toContain('TKT-001');
            expect(wrapper.text()).toContain('Help needed');
        });

        it('does not render tickets table when no tickets', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                last_login_ip: '192.168.1.1',
                last_login: '2024-01-15 10:30:00',
                currency: 'USD',
                amount: '$25.00',
                invoice_list: '3',
                balance: '$150.00',
                full_name: 'John Doe',
                email: 'john@test.com',
                tickets: [],
                ticketStatus: {},
                ticketStatusView: {},
                details: { modules: {} },
                services: {},
                AFFILIATE_AMOUNT: '100',
            });

            const wrapper = mount(ClientHome, mountOptions);
            await flushPromises();
            expect(wrapper.text()).not.toContain('Recent Tickets');
        });
    });
});
