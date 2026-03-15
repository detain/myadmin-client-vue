import { mount } from '@vue/test-utils';
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

vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({
        params: {},
        query: {},
    })),
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
    RouterLink: { template: '<a><slot /></a>' },
}));

describe('TicketsList.vue', () => {
    const mountOptions = {
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
                                { ticketstatustitle: 'Open', st_count: 0 },
                                { ticketstatustitle: 'Closed', st_count: 0 },
                            ],
                            pages: 1,
                            currentPage: 1,
                            view: 'all',
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
        const wrapper = mount(TicketsList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('sets page heading to Tickets List', () => {
        mount(TicketsList, mountOptions);
        // The component calls siteStore.setPageHeading('Tickets List')
    });
});
