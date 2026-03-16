import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import PrePays from '@/views/billing/PrePays.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn(), close: vi.fn() },
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

    it('renders component', () => {
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.exists()).toBe(true);
    });

    it('shows loading text when loading', () => {
        const wrapper = mount(PrePays, createMountOptions({ loading: true }));
        expect(wrapper.text()).toContain('Loading');
    });

    it('shows "No Prepaid funds available" when no prepays', () => {
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.text()).toContain('No prepaid funds available');
    });

    it('shows "Add New Prepay" button', () => {
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.text()).toContain('Add New Prepay');
    });

    it('renders prepays when data exists', () => {
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

    it('renders prepay with null module as "All"', () => {
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

    it('renders history when present', () => {
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

    it('shows "No History found!" when history is empty', () => {
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

    it('renders pagination', () => {
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

    it('renders the add prepay modal', () => {
        const wrapper = mount(PrePays, createMountOptions());
        expect(wrapper.find('#add-prepay').exists()).toBe(true);
        expect(wrapper.text()).toContain('Select Module');
        expect(wrapper.text()).toContain('Amount in USD');
    });

    it('submits new prepay form', async () => {
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
});
