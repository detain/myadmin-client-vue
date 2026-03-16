import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import NewTicket from '@/views/tickets/NewTicket.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn(), close: vi.fn(), showLoading: vi.fn() },
}));

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn().mockResolvedValue({ success: true, text: 'Created', ticket: 123 }),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mockPush = vi.fn();
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: vi.fn(() => ({
            params: {},
            query: { view: undefined },
        })),
        useRouter: vi.fn(() => ({
            push: mockPush,
        })),
    };
});

describe('NewTicket.vue', () => {
    const mountOptions = {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: false,
                    initialState: {
                        account: { ip: '127.0.0.1' },
                    },
                }),
            ],
            stubs: {
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    };

    it('renders component', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it('has subject field', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Subject');
    });

    it('has description field', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Description');
    });

    it('has product selector', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Product');
    });

    it('has file upload section', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('File Upload');
        expect(wrapper.text()).toContain('Choose');
        expect(wrapper.text()).toContain('Reset');
    });

    it('has server access checkbox', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Server Access');
        expect(wrapper.text()).toContain('I allow InterServer to access my server');
    });

    it('shows root password and IP fields when access allowed', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Root Password');
        expect(wrapper.text()).toContain('Your IP Address');
    });

    it('has SSH restricted radio buttons', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Is SSH root restricted');
    });

    it('shows Terms of use button', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.text()).toContain('Terms of use');
    });

    it('shows terms modal when button clicked', async () => {
        const wrapper = mount(NewTicket, mountOptions);
        const termsBtn = wrapper.find('button.bg-gradient-gray');
        await termsBtn.trigger('click');
        expect(wrapper.text()).toContain('Before opening a ticket');
    });

    it('has submit button', () => {
        const wrapper = mount(NewTicket, mountOptions);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Submit');
    });

    it('submits form with ticket data', async () => {
        vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'Created', ticket: 123 });
        const wrapper = mount(NewTicket, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        expect(fetchWrapper.post).toHaveBeenCalledWith(
            expect.stringContaining('/tickets/new'),
            expect.objectContaining({
                subject: '',
                body: '',
            })
        );
    });

    it('handles failed ticket submission', async () => {
        vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Failed'));
        const wrapper = mount(NewTicket, mountOptions);
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
        await flushPromises();
    });

    it('resets file on reset button click', async () => {
        const wrapper = mount(NewTicket, mountOptions);
        const resetBtn = wrapper.find('.btn-reset');
        await resetBtn.trigger('click');
    });

    it('opens file dialog on choose button click', async () => {
        const wrapper = mount(NewTicket, mountOptions);
        const chooseBtn = wrapper.find('.btn-choose');
        await chooseBtn.trigger('click');
    });
});
