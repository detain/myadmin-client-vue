import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import TicketsList from '@/views/tickets/TicketsList.vue';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({
            ima: 'client',
            custid: 1,
            view: 'all',
            selected_period: '30',
            currentPage: 1,
            limit: 50,
            pages: 1,
            offset: 0,
            total: { tickets: 0 },
            st_count: [],
            tickets: [],
        }),
        post: vi.fn().mockResolvedValue([]),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({
        params: {},
        query: {},
    })),
    useRouter: vi.fn(() => ({
        push: mockPush,
    })),
    RouterLink: { template: '<a><slot /></a>' },
}));

describe('TicketsList.vue', () => {
    const createMountOptions = (ticketState = {}) => ({
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                    initialState: {
                        tickets: {
                            loading: false,
                            tickets: [],
                            st_count: [
                                { ticketstatustitle: 'Open', st_count: 2 },
                                { ticketstatustitle: 'Closed', st_count: 5 },
                                { ticketstatustitle: 'On Hold', st_count: 1 },
                                { ticketstatustitle: 'In Progress', st_count: 0 },
                            ],
                            pages: 1,
                            currentPage: 1,
                            view: 'all',
                            ...ticketState,
                        },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    });

    it('renders component', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.exists()).toBe(true);
    });

    it('shows "No tickets found!" when no tickets', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('No tickets found!');
    });

    it('shows ticket status filters', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Open');
        expect(wrapper.text()).toContain('Closed');
        expect(wrapper.text()).toContain('On Hold');
        expect(wrapper.text()).toContain('In Progress');
    });

    it('shows status counts', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('2');
        expect(wrapper.text()).toContain('5');
    });

    it('renders search box', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.find('input.form-control').exists()).toBe(true);
    });

    it('renders period filter', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Filter by Age');
        expect(wrapper.text()).toContain('Last 30 Days');
        expect(wrapper.text()).toContain('Last 90 Days');
        expect(wrapper.text()).toContain('All Time');
    });

    it('renders New Ticket link', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('New Ticket');
    });

    it('renders tickets when data exists', () => {
        const wrapper = mount(TicketsList, createMountOptions({
            tickets: [
                {
                    ticketid: 1,
                    ticketmaskid: 'TKT-001',
                    subject: 'Test ticket',
                    ticketstatustitle: 'Open',
                    ticketstatusid: '7',
                    lastreplier: 'Support',
                    lastactivity: String(Math.floor(Date.now() / 1000) - 3600),
                    hasattachments: '1',
                },
            ],
        }));
        expect(wrapper.text()).toContain('TKT-001');
        expect(wrapper.text()).toContain('Test ticket');
        expect(wrapper.text()).toContain('Support');
    });

    it('renders table headers when tickets exist', () => {
        const wrapper = mount(TicketsList, createMountOptions({
            tickets: [
                {
                    ticketid: 1,
                    ticketmaskid: 'TKT-001',
                    subject: 'Test',
                    ticketstatustitle: 'Open',
                    ticketstatusid: '7',
                    lastreplier: 'Support',
                    lastactivity: String(Math.floor(Date.now() / 1000)),
                    hasattachments: '0',
                },
            ],
        }));
        expect(wrapper.text()).toContain('Subject');
        expect(wrapper.text()).toContain('Last Replier');
        expect(wrapper.text()).toContain('Last Activity');
    });

    it('shows period label in header', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Last 30 Days');
    });

    it('shows Quick Filter section', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Quick Filter');
    });
});
