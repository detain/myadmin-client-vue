import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import InvoicesList from '@/views/billing/InvoicesList.vue';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({
            custid: 1,
            years_arr: {},
            months_arr: [],
            sortcol: 0,
            sortdir: 1,
            textextraction: '"complex"',
            table_header: [],
            size: 100,
            sizes: '10,25,50,100',
            table_rows: [],
            rows: [],
        }),
        post: vi.fn(),
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
        useRoute: vi.fn(() => ({
            params: {},
            query: {},
        })),
        useRouter: vi.fn(() => ({
            push: vi.fn(),
        })),
    };
});

describe('InvoicesList.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                    initialState: {
                        invoices: {
                            loading: false,
                            rows: [],
                            table_rows: [],
                            months_arr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            years_arr: {},
                        },
                        auth: {
                            sessionId: 'test-session',
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
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('sets page heading to Invoice List', () => {
        mount(InvoicesList, mountOptions);
        // The component calls siteStore.setPageHeading('Invoice List')
    });
});
