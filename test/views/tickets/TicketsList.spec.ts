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
        expect(wrapper.text()).toContain('Date');
    });

    it('shows period label in header', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Last 30 Days');
    });

    it('shows Quick Filter section', () => {
        const wrapper = mount(TicketsList, createMountOptions());
        expect(wrapper.text()).toContain('Quick Filter');
    });

    describe('search functionality', () => {
        it('does not search when search box is empty', async () => {
            const wrapper = mount(TicketsList, createMountOptions());
            const form = wrapper.find('#sidebar form');
            await form.trigger('submit.prevent');

            // searching should remain false - no API call
            expect(wrapper.find('.results').exists()).toBe(false);
        });

        it('shows search results after submitting search', async () => {
            const { fetchWrapper } = await import('@/helpers/fetchWrapper');
            vi.mocked(fetchWrapper.post).mockResolvedValue([
                {
                    ticketid: 10,
                    ticketmaskid: 'TKT-010',
                    subject: 'Search result ticket',
                    ticketstatusid: '7',
                    lastactivity_time: '2024-01-01',
                },
            ]);

            const wrapper = mount(TicketsList, createMountOptions());

            const searchInput = wrapper.find('#sidebar input.form-control');
            await searchInput.setValue('test search');
            await wrapper.find('#sidebar form').trigger('submit.prevent');
            await flushPromises();

            expect(wrapper.find('.results').exists()).toBe(true);
            expect(wrapper.text()).toContain('TKT-010');
            expect(wrapper.text()).toContain('Search result ticket');
        });

        it('shows spinner while searching and before results arrive', async () => {
            const { fetchWrapper } = await import('@/helpers/fetchWrapper');
            let resolveSearch!: (val: any) => void;
            vi.mocked(fetchWrapper.post).mockImplementation(() => new Promise((resolve) => { resolveSearch = resolve; }));

            const wrapper = mount(TicketsList, createMountOptions());
            await wrapper.find('#sidebar input.form-control').setValue('query');
            await wrapper.find('#sidebar form').trigger('submit.prevent');

            // showResults is true but searchResults is empty => shows spinner
            expect(wrapper.find('.results').exists()).toBe(true);
            expect(wrapper.find('.spinner-border').exists()).toBe(true);

            resolveSearch([]);
            await flushPromises();
        });
    });

    describe('pagination', () => {
        it('shows pagination when pages > 1', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                pages: 3,
                currentPage: 1,
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Test',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            const pageLinks = wrapper.findAll('.pagination .page-item');
            expect(pageLinks.length).toBe(3);
        });

        it('marks current page as active', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                pages: 3,
                currentPage: 2,
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Test',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            const activeItem = wrapper.find('.pagination .page-item.active');
            expect(activeItem.exists()).toBe(true);
            expect(activeItem.text()).toBe('2');
        });

        it('navigates to page on click', async () => {
            const wrapper = mount(TicketsList, createMountOptions({
                pages: 3,
                currentPage: 1,
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Test',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            const pageLinks = wrapper.findAll('.pagination .page-link');
            await pageLinks[2].trigger('click');
            expect(mockPush).toHaveBeenCalledWith({ query: expect.objectContaining({ page: 3 }) });
        });

        it('does not show pagination when pages <= 1', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                pages: 1,
                tickets: [],
            }));

            expect(wrapper.find('.pagination').exists()).toBe(false);
        });
    });

    describe('status icons and badges', () => {
        it('renders correct status icon for Open tickets', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Open ticket',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            const icon = wrapper.find('tbody td i.fa-envelope-open');
            expect(icon.exists()).toBe(true);
            expect(icon.classes()).toContain('text-success');
        });

        it('renders correct status icon for On Hold tickets', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 2,
                        ticketmaskid: 'TKT-002',
                        subject: 'Held ticket',
                        ticketstatustitle: 'On Hold',
                        ticketstatusid: '5',
                        lastreplier: 'Support',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            const icon = wrapper.find('tbody td i.fa-pause');
            expect(icon.exists()).toBe(true);
            expect(icon.classes()).toContain('text-warning');
        });

        it('renders paperclip icon for tickets with attachments', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'With attachment',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '1',
                    },
                ],
            }));

            expect(wrapper.find('i.fa-paperclip').exists()).toBe(true);
        });

        it('does not render paperclip icon for tickets without attachments', () => {
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'No attachment',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(Math.floor(Date.now() / 1000)),
                        hasattachments: '0',
                    },
                ],
            }));

            expect(wrapper.find('i.fa-paperclip').exists()).toBe(false);
        });
    });

    describe('time formatting', () => {
        it('formats time as seconds ago', () => {
            const now = Math.floor(Date.now() / 1000);
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Recent',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(now - 30),
                        hasattachments: '0',
                    },
                ],
            }));

            expect(wrapper.text()).toMatch(/\d+s ago/);
        });

        it('formats time as minutes ago', () => {
            const now = Math.floor(Date.now() / 1000);
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Minutes ago',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(now - 300),
                        hasattachments: '0',
                    },
                ],
            }));

            expect(wrapper.text()).toMatch(/\d+m ago/);
        });

        it('formats time as hours ago', () => {
            const now = Math.floor(Date.now() / 1000);
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Hours ago',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(now - 7200),
                        hasattachments: '0',
                    },
                ],
            }));

            expect(wrapper.text()).toMatch(/\d+h ago/);
        });

        it('formats time as days ago', () => {
            const now = Math.floor(Date.now() / 1000);
            const wrapper = mount(TicketsList, createMountOptions({
                tickets: [
                    {
                        ticketid: 1,
                        ticketmaskid: 'TKT-001',
                        subject: 'Days ago',
                        ticketstatustitle: 'Open',
                        ticketstatusid: '7',
                        lastreplier: 'Admin',
                        lastactivity: String(now - 172800),
                        hasattachments: '0',
                    },
                ],
            }));

            expect(wrapper.text()).toMatch(/\d+d ago/);
        });
    });

    describe('period filter change', () => {
        it('pushes route query when period changes', async () => {
            const wrapper = mount(TicketsList, createMountOptions());

            const select = wrapper.find('select.form-control');
            await select.setValue('90');

            expect(mockPush).toHaveBeenCalledWith({
                query: expect.objectContaining({ period: '90' }),
            });
        });

        it('omits period from query when set to 30 (default)', async () => {
            const wrapper = mount(TicketsList, createMountOptions());

            // Change to 90 first
            const select = wrapper.find('select.form-control');
            await select.setValue('90');
            mockPush.mockClear();

            // Change back to 30
            await select.setValue('30');
            expect(mockPush).toHaveBeenCalledWith({
                query: expect.objectContaining({ period: undefined }),
            });
        });
    });
});
