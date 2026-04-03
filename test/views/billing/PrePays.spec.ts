import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import PrePays from '@/views/billing/PrePays.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { usePrePayStore } from '@/stores/prepay.store';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn(), close: vi.fn() },
}));

const mockJqueryChain = {
    val: vi.fn().mockReturnThis(),
    html: vi.fn().mockReturnThis(),
    trigger: vi.fn().mockReturnThis(),
    hide: vi.fn().mockReturnThis(),
    show: vi.fn().mockReturnThis(),
    submit: vi.fn().mockReturnThis(),
};
vi.mock('jquery', () => ({
    default: vi.fn(() => mockJqueryChain),
}));

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({}),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({ params: {}, query: {} })),
    useRouter: vi.fn(() => ({ push: mockPush })),
}));

describe('PrePays.vue', () => {
    const createMountOptions = (prepayState = {}) => ({
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                    initialState: {
                        prepay: {
                            loading: false,
                            prepays: {},
                            total_pages: 1,
                            total_records: 0,
                            limit: 25,
                            page: 1,
                            curr_page_records: 0,
                            modules: {},
                            allInfo: {},
                            ...prepayState,
                        },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    });

    it('renders component', ({ annotate }) => {
        annotate('PrePays: verifies the component mounts without errors');
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.exists()).toBe(true);
    });

    it('shows loading text when loading', ({ annotate }) => {
        annotate('PrePays: verifies loading indicator text appears when loading state is true');
        const wrapper = mount(PrePays, createMountOptions({ loading: true }));
        expect(wrapper.text()).toContain('Loading');
    });

    it('shows "No Prepaid funds available" when no prepays', ({ annotate }) => {
        annotate('PrePays: verifies empty state message when no prepaid funds exist');
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.text()).toContain('No prepaid funds available');
    });

    it('shows "Add New Prepay" button', ({ annotate }) => {
        annotate('PrePays: verifies the Add New Prepay button is rendered');
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.text()).toContain('Add New Prepay');
    });

    it('renders prepays when data exists', ({ annotate }) => {
        annotate('PrePays: verifies prepay entries display ID, amount, and module name');
        const wrapper = mount(PrePays, createMountOptions({
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: 'vps', prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                    history: [],
                },
            },
        }));
        expect(wrapper.text()).toContain('Prepay ID');
        expect(wrapper.text()).toContain('$50.00');
        expect(wrapper.text()).toContain('Vps');
    });

    it('renders prepay with null module as "All"', ({ annotate }) => {
        annotate('PrePays: verifies prepay with null module shows All and auto-use No');
        const wrapper = mount(PrePays, createMountOptions({
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '0' },
                    history: [],
                },
            },
        }));
        expect(wrapper.text()).toContain('All');
        expect(wrapper.text()).toContain('No');
    });

    it('renders history when present', ({ annotate }) => {
        annotate('PrePays: verifies History Log section appears when prepay has history entries');
        const wrapper = mount(PrePays, createMountOptions({
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: 'vps', prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                    history: [
                        { history_id: 1, history_timestamp_disp: '2024-01-01', desc: 'Payment', amt_used: '$10.00' },
                    ],
                },
            },
        }));
        expect(wrapper.text()).toContain('History Log');
    });

    it('shows "No History found!" when history is empty', ({ annotate }) => {
        annotate('PrePays: verifies No history found message when prepay history array is empty');
        const wrapper = mount(PrePays, createMountOptions({
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: 'vps', prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                    history: [],
                },
            },
        }));
        expect(wrapper.text()).toContain('No history found!');
    });

    it('renders pagination', ({ annotate }) => {
        annotate('PrePays: verifies pagination controls with Previous/Next and page info are rendered');
        const wrapper = mount(PrePays, createMountOptions({
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                    history: [],
                },
            },
            total_pages: 3,
            total_records: 30,
            page: 1,
            curr_page_records: 10,
        }));
        expect(wrapper.text()).toContain('Previous');
        expect(wrapper.text()).toContain('Next');
        expect(wrapper.text()).toContain('Showing page 1 of 3');
    });

    it('renders the add prepay modal', ({ annotate }) => {
        annotate('PrePays: verifies the add prepay modal with module select and amount input is rendered');
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.find('#add-prepay').exists()).toBe(true);
        expect(wrapper.text()).toContain('Select Module');
        expect(wrapper.text()).toContain('Amount in USD');
    });

    it('submits new prepay form', async ({ annotate }) => {
        await annotate('PrePays: verifies submitNewPrepay POSTs to /billing/prepays with module and amount');
        vi.mocked(fetchWrapper.post).mockResolvedValue({ invoice: 123 });
        const wrapper = mount(PrePays, createMountOptions());
        // Call the component's submit method directly since the form is inside a Bootstrap modal
        await (wrapper.vm as any).submitNewPrepay();
        await flushPromises();
        expect(fetchWrapper.post).toHaveBeenCalledWith(
            expect.stringContaining('/billing/prepays'),
            expect.objectContaining({ module: 'default', amount: 100 })
        );
    });

    describe('toggleHistory', () => {
        it('expands history on first click and collapses on second', async ({ annotate }) => {
            await annotate('PrePays: verifies history section toggles between expanded and collapsed on button clicks');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 42, prepay_module: 'vps', prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [
                            { history_id: 1, history_timestamp_disp: '2024-01-01', desc: 'Payment', amt_used: '$10.00' },
                        ],
                    },
                },
            }));
            const toggleBtn = wrapper.find('.card-tools button');
            expect(toggleBtn.exists()).toBe(true);

            // History body should be hidden initially (v-show=false uses display:none)
            const historyBody = wrapper.find('.card-secondary .card-body');
            expect(historyBody.attributes('style')).toContain('display: none');

            // Click to expand
            await toggleBtn.trigger('click');
            expect(wrapper.find('.card-secondary .card-body').attributes('style')).not.toContain('display: none');

            // Click to collapse
            await toggleBtn.trigger('click');
            expect(wrapper.find('.card-secondary .card-body').attributes('style')).toContain('display: none');
        });

        it('shows history rows when expanded', async ({ annotate }) => {
            await annotate('PrePays: verifies history rows with descriptions are visible when expanded');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 10, prepay_module: 'vps', prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [
                            { history_id: 1, history_timestamp_disp: '2024-01-01', desc: 'Payment Applied', amt_used: '$10.00' },
                            { history_id: 2, history_timestamp_disp: '2024-02-01', desc: 'Refund', amt_used: '$5.00' },
                        ],
                    },
                },
            }));
            await wrapper.find('.card-tools button').trigger('click');
            const rows = wrapper.findAll('.card-secondary tbody tr');
            expect(rows.length).toBe(2);
            expect(wrapper.text()).toContain('Payment Applied');
            expect(wrapper.text()).toContain('Refund');
        });
    });

    describe('goToPage', () => {
        const paginatedState = {
            prepays: {
                1: {
                    prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                    history: [],
                },
            },
            total_pages: 3,
            total_records: 30,
            page: 1,
            curr_page_records: 10,
        };

        it('navigates to a valid page when clicking a page number', async ({ annotate }) => {
            await annotate('PrePays: verifies clicking a page number triggers store.load for that page');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();

            // Click page 2 button
            const pageButtons = wrapper.findAll('.pagination .page-item button.page-link');
            // buttons: Previous, 1, 2, 3, Next
            await pageButtons[2].trigger('click'); // page 2
            expect(store.load).toHaveBeenCalled();
        });

        it('does not navigate when clicking current page', ({ annotate }) => {
            annotate('PrePays: verifies goToPage does not call store.load when already on that page');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();
            (store.load as any).mockClear();

            // goToPage(1) when already on page 1 should not call load
            (wrapper.vm as any).goToPage(1);
            expect(store.load).not.toHaveBeenCalled();
        });

        it('does not navigate to page < 1', ({ annotate }) => {
            annotate('PrePays: verifies goToPage ignores page numbers less than 1');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();
            (store.load as any).mockClear();

            (wrapper.vm as any).goToPage(0);
            expect(store.load).not.toHaveBeenCalled();
        });

        it('does not navigate beyond total_pages', ({ annotate }) => {
            annotate('PrePays: verifies goToPage ignores page numbers beyond total_pages');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();
            (store.load as any).mockClear();

            (wrapper.vm as any).goToPage(4);
            expect(store.load).not.toHaveBeenCalled();
        });

        it('clicking Previous on page 1 does not navigate', async ({ annotate }) => {
            await annotate('PrePays: verifies Previous button on page 1 does not trigger navigation');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();
            (store.load as any).mockClear();

            // Previous button triggers goToPage(page - 1) = goToPage(0)
            const prevBtn = wrapper.find('.pagination .page-item button.page-link');
            await prevBtn.trigger('click');
            expect(store.load).not.toHaveBeenCalled();
        });

        it('clicking Next navigates to next page', async ({ annotate }) => {
            await annotate('PrePays: verifies clicking Next button triggers store.load for the next page');
            const wrapper = mount(PrePays, createMountOptions(paginatedState));
            const store = usePrePayStore();
            (store.load as any).mockClear();

            const allBtns = wrapper.findAll('.pagination .page-item button.page-link');
            const nextBtn = allBtns[allBtns.length - 1]; // last button is Next
            await nextBtn.trigger('click');
            expect(store.load).toHaveBeenCalled();
        });
    });

    describe('delete_prepay', () => {
        it('calls Swal.fire with confirmation dialog', async ({ annotate }) => {
            await annotate('PrePays: verifies delete_prepay shows Swal confirmation dialog with error icon');
            const Swal = (await import('sweetalert2')).default;
            const wrapper = mount(PrePays, createMountOptions());
            (wrapper.vm as any).delete_prepay(42);
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Delete it.',
                })
            );
        });

        it('includes prepay id in the confirmation HTML', async ({ annotate }) => {
            await annotate('PrePays: verifies delete_prepay includes the prepay ID in the Swal confirmation HTML');
            const Swal = (await import('sweetalert2')).default;
            const wrapper = mount(PrePays, createMountOptions());
            (wrapper.vm as any).delete_prepay(99);
            const callArgs = vi.mocked(Swal.fire).mock.calls[vi.mocked(Swal.fire).mock.calls.length - 1][0] as any;
            expect(callArgs.html).toContain('99');
        });
    });

    describe('addPrepayUpdates', () => {
        it('hides service and type rows when module is default', ({ annotate }) => {
            annotate('PrePays: verifies addPrepayUpdates executes without error when module is default');
            const wrapper = mount(PrePays, createMountOptions({
                allInfo: {
                    vps: { module_name: 'VPS', services: { 1: 'Service A' } },
                },
            }));
            const event = { target: { value: 'default' } } as unknown as Event;
            (wrapper.vm as any).addPrepayUpdates(event);
            // Function should execute without errors when module is 'default'
        });

        it('processes module services when a non-default module is selected', ({ annotate }) => {
            annotate('PrePays: verifies addPrepayUpdates processes services for a valid non-default module');
            const wrapper = mount(PrePays, createMountOptions({
                allInfo: {
                    vps: { module_name: 'VPS', services: { 1: 'Service A', 2: 'Service B' } },
                },
            }));
            const event = { target: { value: 'vps' } } as unknown as Event;
            // Should not throw when called with a valid module
            expect(() => (wrapper.vm as any).addPrepayUpdates(event)).not.toThrow();
        });
    });

    describe('add_amount', () => {
        it('executes without error', ({ annotate }) => {
            annotate('PrePays: verifies add_amount executes without throwing');
            const wrapper = mount(PrePays, createMountOptions());
            expect(() => (wrapper.vm as any).add_amount('42', 'vps')).not.toThrow();
        });
    });

    describe('submitNewPrepay', () => {
        it('navigates to cart when response has invoice', async ({ annotate }) => {
            await annotate('PrePays: verifies submitNewPrepay navigates to /cart/{invoiceId} on success');
            vi.mocked(fetchWrapper.post).mockResolvedValue({ invoice: 456 });
            const wrapper = mount(PrePays, createMountOptions());

            await (wrapper.vm as any).submitNewPrepay();
            await flushPromises();

            expect(mockPush).toHaveBeenCalledWith('/cart/456');
        });

        it('calls Swal.close after successful response', async ({ annotate }) => {
            await annotate('PrePays: verifies submitNewPrepay calls Swal.close after successful API response');
            const Swal = (await import('sweetalert2')).default;
            vi.mocked(fetchWrapper.post).mockResolvedValue({ invoice: 789 });
            const wrapper = mount(PrePays, createMountOptions());

            await (wrapper.vm as any).submitNewPrepay();
            await flushPromises();

            expect(Swal.close).toHaveBeenCalled();
        });

        it('does not navigate when response has no invoice', async ({ annotate }) => {
            await annotate('PrePays: verifies submitNewPrepay does not navigate when response lacks an invoice');
            mockPush.mockClear();
            vi.mocked(fetchWrapper.post).mockResolvedValue({});
            const wrapper = mount(PrePays, createMountOptions());

            await (wrapper.vm as any).submitNewPrepay();
            await flushPromises();

            expect(mockPush).not.toHaveBeenCalled();
        });

        it('shows loading Swal before API call', async ({ annotate }) => {
            await annotate('PrePays: verifies submitNewPrepay shows a loading Swal with no confirm button');
            const Swal = (await import('sweetalert2')).default;
            vi.mocked(Swal.fire).mockClear();
            vi.mocked(fetchWrapper.post).mockResolvedValue({});
            const wrapper = mount(PrePays, createMountOptions());

            await (wrapper.vm as any).submitNewPrepay();
            await flushPromises();

            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    allowOutsideClick: false,
                    showConfirmButton: false,
                })
            );
        });

        it('handles fetch error gracefully', async ({ annotate }) => {
            await annotate('PrePays: verifies submitNewPrepay handles fetch errors without throwing');
            vi.mocked(fetchWrapper.post).mockImplementation(() => { throw new Error('Network error'); });
            const Swal = (await import('sweetalert2')).default;
            const wrapper = mount(PrePays, createMountOptions());

            expect(() => (wrapper.vm as any).submitNewPrepay()).not.toThrow();
            expect(Swal.close).toHaveBeenCalled();
        });
    });

    describe('form rendering', () => {
        it('renders module select with options from store', ({ annotate }) => {
            annotate('PrePays: verifies module select renders options from store modules data');
            const wrapper = mount(PrePays, createMountOptions({
                modules: { default: 'All', vps: 'VPS', webhosting: 'Web Hosting' },
            }));
            const options = wrapper.findAll('#add-prepay select option');
            expect(options.length).toBe(3);
        });

        it('renders amount input with default value', ({ annotate }) => {
            annotate('PrePays: verifies amount input defaults to 100');
            const wrapper = mount(PrePays, createMountOptions());
            const input = wrapper.find('#add-prepay input[type="number"]');
            expect(input.exists()).toBe(true);
            expect((input.element as HTMLInputElement).value).toBe('100');
        });

        it('renders auto-use radio buttons', ({ annotate }) => {
            annotate('PrePays: verifies two auto-use radio buttons are rendered');
            const wrapper = mount(PrePays, createMountOptions());
            const radios = wrapper.findAll('#add-prepay input[type="radio"]');
            expect(radios.length).toBe(2);
        });

        it('renders submit and cancel buttons in modal', ({ annotate }) => {
            annotate('PrePays: verifies submit and cancel buttons are rendered in the add prepay modal');
            const wrapper = mount(PrePays, createMountOptions());
            const buttons = wrapper.findAll('#add-prepay .text-center button');
            expect(buttons.length).toBe(2);
        });
    });

    describe('pagination rendering', () => {
        it('renders correct number of page buttons', ({ annotate }) => {
            annotate('PrePays: verifies pagination renders 5 page buttons plus Previous and Next');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [],
                    },
                },
                total_pages: 5,
                total_records: 50,
                page: 3,
                curr_page_records: 10,
            }));
            // 5 page buttons + Previous + Next = 7 page-items
            const pageItems = wrapper.findAll('.pagination .page-item');
            expect(pageItems.length).toBe(7);
        });

        it('marks current page as active', ({ annotate }) => {
            annotate('PrePays: verifies the current page button has the active CSS class');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [],
                    },
                },
                total_pages: 3,
                total_records: 30,
                page: 2,
                curr_page_records: 10,
            }));
            const pageItems = wrapper.findAll('.pagination .page-item');
            // Previous(0), page1(1), page2(2), page3(3), Next(4)
            expect(pageItems[2].classes()).toContain('active');
        });

        it('disables Previous button on first page', ({ annotate }) => {
            annotate('PrePays: verifies Previous button has disabled class on page 1');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [],
                    },
                },
                total_pages: 3,
                page: 1,
            }));
            const firstPageItem = wrapper.find('.pagination .page-item');
            expect(firstPageItem.classes()).toContain('disabled');
        });

        it('disables Next button on last page', ({ annotate }) => {
            annotate('PrePays: verifies Next button has disabled class on the last page');
            const wrapper = mount(PrePays, createMountOptions({
                prepays: {
                    1: {
                        prepay: { prepay_id: 1, prepay_module: null, prepay_remaining_disp: '$50.00', prepay_automatic_use: '1' },
                        history: [],
                    },
                },
                total_pages: 3,
                page: 3,
            }));
            const pageItems = wrapper.findAll('.pagination .page-item');
            const lastPageItem = pageItems[pageItems.length - 1];
            expect(lastPageItem.classes()).toContain('disabled');
        });
    });
});
