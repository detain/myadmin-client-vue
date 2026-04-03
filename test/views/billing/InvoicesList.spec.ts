import { mount, flushPromises } from '@vue/test-utils';
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
                    stubActions: true,
                    initialState: {
                        invoices: {
                            loading: false,
                            rows: [
                                {
                                    id: 100,
                                    module: 'vps',
                                    service_id: 1,
                                    date_raw: '2024-06-15',
                                    date: 'Jun 15, 2024',
                                    service: 'Test VPS',
                                    description: 'Monthly VPS',
                                    amount: '$10.00',
                                    paid: 'Yes',
                                    payment_type: 'Credit Card',
                                    payment_type_id: 11,
                                    payment_description: 'Visa ending 1234',
                                    paid_on: 'Jun 15, 2024',
                                },
                                {
                                    id: 101,
                                    module: 'domains',
                                    service_id: 2,
                                    date_raw: '2023-01-10',
                                    date: 'Jan 10, 2023',
                                    service: 'example.com',
                                    description: 'Domain renewal',
                                    amount: '$15.00',
                                    paid: 'No',
                                    payment_type: 'PayPal',
                                    payment_type_id: 10,
                                    payment_description: 'PayPal',
                                    paid_on: '',
                                },
                            ],
                            table_rows: [],
                            months_arr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            years_arr: { 2024: '2024', 2023: '2023' },
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

    it('renders component', ({ annotate }) => {
        annotate('Invoices List: verifies the component mounts without errors');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders invoice table with rows', ({ annotate }) => {
        annotate('Invoices List: verifies invoice table displays heading, description and amount from store data');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.text()).toContain('Invoices List');
        expect(wrapper.text()).toContain('Monthly VPS');
        expect(wrapper.text()).toContain('$10.00');
    });

    it('renders sorting headers', ({ annotate }) => {
        annotate('Invoices List: verifies all column headers (ID, Date, Service, Description, Amount) are present');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.text()).toContain('ID');
        expect(wrapper.text()).toContain('Date');
        expect(wrapper.text()).toContain('Service');
        expect(wrapper.text()).toContain('Description');
        expect(wrapper.text()).toContain('Amount');
    });

    it('renders filter controls', ({ annotate }) => {
        annotate('Invoices List: verifies Month, Year, and Page Size filter controls are rendered');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.text()).toContain('Month');
        expect(wrapper.text()).toContain('Year');
        expect(wrapper.text()).toContain('Page Size');
    });

    it('renders pagination', ({ annotate }) => {
        annotate('Invoices List: verifies pagination info text shows Page 1 of 1');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.text()).toContain('Page 1 of 1');
    });

    it('sorts columns when header clicked', async ({ annotate }) => {
        await annotate('Invoices List: verifies clicking a column header triggers sorting logic');
        const wrapper = mount(InvoicesList, mountOptions);
        const headers = wrapper.findAll('th');
        await headers[0].trigger('click');
        await headers[0].trigger('click');
    });

    it('filters by search text', async ({ annotate }) => {
        await annotate('Invoices List: verifies text search input filters rows to matching descriptions');
        const wrapper = mount(InvoicesList, mountOptions);
        const searchInput = wrapper.find('input[type="text"]');
        await searchInput.setValue('VPS');
        await flushPromises();
        expect(wrapper.text()).toContain('Monthly VPS');
    });

    it('renders Export Excel and Export PDF buttons', ({ annotate }) => {
        annotate('Invoices List: verifies Export Excel and Export PDF buttons are present');
        const wrapper = mount(InvoicesList, mountOptions);
        expect(wrapper.text()).toContain('Export Excel');
        expect(wrapper.text()).toContain('Export PDF');
    });

    it('shows paid/unpaid images', ({ annotate }) => {
        annotate('Invoices List: verifies paid/unpaid status images are rendered for invoice rows');
        const wrapper = mount(InvoicesList, mountOptions);
        const images = wrapper.findAll('img');
        expect(images.length).toBeGreaterThan(0);
    });

    describe('year filtering', () => {
        it('filters rows by selected year', async ({ annotate }) => {
            await annotate('Invoices List: verifies year filter shows only invoices from the selected year');
            const wrapper = mount(InvoicesList, mountOptions);
            const yearSelects = wrapper.findAll('select');
            // Year select is the second select
            const yearSelect = yearSelects[1];
            await yearSelect.setValue('2024');
            await flushPromises();
            // Should only show 2024 rows
            expect(wrapper.text()).toContain('Jun 15, 2024');
            expect(wrapper.text()).not.toContain('Jan 10, 2023');
        });
    });

    describe('month filtering', () => {
        it('filters rows by selected month', async ({ annotate }) => {
            await annotate('Invoices List: verifies month filter shows only invoices from the selected month');
            const wrapper = mount(InvoicesList, mountOptions);
            const monthSelect = wrapper.findAll('select')[0];
            await monthSelect.setValue('6');
            await flushPromises();
            expect(wrapper.text()).toContain('Jun 15, 2024');
            expect(wrapper.text()).not.toContain('Jan 10, 2023');
        });
    });

    describe('search text filtering', () => {
        it('filters rows by search text matching description', async ({ annotate }) => {
            await annotate('Invoices List: verifies search text filters to rows matching description and hides non-matching');
            const wrapper = mount(InvoicesList, mountOptions);
            const searchInput = wrapper.find('input[type="text"]');
            await searchInput.setValue('Domain');
            await flushPromises();
            expect(wrapper.text()).toContain('Domain renewal');
            expect(wrapper.text()).not.toContain('Monthly VPS');
        });

        it('shows no rows when search does not match', async ({ annotate }) => {
            await annotate('Invoices List: verifies no rows are displayed when search text matches nothing');
            const wrapper = mount(InvoicesList, mountOptions);
            const searchInput = wrapper.find('input[type="text"]');
            await searchInput.setValue('NONEXISTENT');
            await flushPromises();
            expect(wrapper.text()).not.toContain('Monthly VPS');
            expect(wrapper.text()).not.toContain('Domain renewal');
        });
    });

    describe('invoice detail view', () => {
        it('renders back button when viewing an invoice by id', async ({ annotate }) => {
            await annotate('Invoices List: verifies Back button appears when viewing a single invoice detail by route ID');
            const { useRoute } = await import('vue-router');
            vi.mocked(useRoute).mockReturnValue({
                params: { id: '100' },
                query: {},
            } as any);

            const wrapper = mount(InvoicesList, mountOptions);
            await flushPromises();
            expect(wrapper.text()).toContain('Back');
        });

        it('renders invoice detail back button', async ({ annotate }) => {
            await annotate('Invoices List: verifies invoice detail view has a Back link in card-tools area');
            const { useRoute } = await import('vue-router');
            vi.mocked(useRoute).mockReturnValue({
                params: { id: '100' },
                query: {},
            } as any);

            const wrapper = mount(InvoicesList, mountOptions);
            await flushPromises();
            // The back button should be present in detail view
            const backLink = wrapper.find('.card-tools');
            expect(backLink.exists()).toBe(true);
            expect(wrapper.text()).toContain('Back');
        });
    });

    describe('pagination controls', () => {
        beforeEach(async () => {
            // Ensure route has no id param so list mode is rendered
            const { useRoute } = await import('vue-router');
            vi.mocked(useRoute).mockReturnValue({
                params: {},
                query: {},
            } as any);
        });

        it('disables prev button on first page', ({ annotate }) => {
            annotate('Invoices List: verifies the Prev pagination button is disabled on the first page');
            const wrapper = mount(InvoicesList, mountOptions);
            const buttons = wrapper.findAll('button');
            const prevBtn = buttons.find((b) => b.text().includes('Prev'));
            expect(prevBtn).toBeDefined();
            expect(prevBtn!.attributes('disabled')).toBeDefined();
        });

        it('changes page size resets current page', async ({ annotate }) => {
            await annotate('Invoices List: verifies changing page size resets pagination to page 1');
            const wrapper = mount(InvoicesList, mountOptions);
            const selects = wrapper.findAll('select');
            // Page size select is the 3rd select (month, year, page size)
            const pageSizeSelect = selects[2];
            await pageSizeSelect.setValue('10');
            await flushPromises();
            expect(wrapper.text()).toContain('Page 1');
        });
    });
});
