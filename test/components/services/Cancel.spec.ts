import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Cancel from '@/components/services/Cancel.vue';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn() },
}));

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

describe('Cancel.vue', () => {
    const mountCancel = () =>
        mount(Cancel, {
            props: {
                id: 101,
                module: 'vps',
                package: 'VPS Slice',
                titleField: 'test.example.com',
                titleField2: '192.168.1.1',
            },
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
                stubs: { RouterLink: { template: '<a><slot /></a>' } },
            },
        });

    it('renders cancel form', ({ annotate }) => {
        annotate('Cancel: verifies the cancellation form element with id cancelForm is present in the DOM');
        const wrapper = mountCancel();
        expect(wrapper.find('form#cancelForm').exists()).toBe(true);
    });

    it('displays service ID', ({ annotate }) => {
        annotate('Cancel: confirms the service ID prop value is rendered in the cancellation form');
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('101');
    });

    it('displays package name', ({ annotate }) => {
        annotate('Cancel: confirms the package name prop is displayed in the form for user reference');
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('VPS Slice');
    });

    it('displays hostname', ({ annotate }) => {
        annotate('Cancel: validates the hostname from titleField prop is shown so the user can verify which service they are canceling');
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('test.example.com');
    });

    it('has confirm select with yes/no options', ({ annotate }) => {
        annotate('Cancel: verifies the confirmation select dropdown has exactly two options (no and yes) to prevent accidental cancellations');
        const wrapper = mountCancel();
        const select = wrapper.find('select#confirm');
        expect(select.exists()).toBe(true);
        const options = select.findAll('option');
        expect(options.length).toBe(2);
        expect(options[0].attributes('value')).toBe('no');
        expect(options[1].attributes('value')).toBe('yes');
    });

    it('has comment textarea', ({ annotate }) => {
        annotate('Cancel: confirms the comment textarea is present for users to provide a cancellation reason');
        const wrapper = mountCancel();
        expect(wrapper.find('textarea#comment').exists()).toBe(true);
    });

    it('has submit button', ({ annotate }) => {
        annotate('Cancel: verifies a submit button exists for the user to finalize the cancellation request');
        const wrapper = mountCancel();
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    describe('onSubmit()', () => {
        it('calls Swal.fire when form is submitted', async ({ annotate }) => {
            await annotate('Cancel onSubmit: verifies form submission triggers a SweetAlert2 confirmation dialog with error icon and cancel button');
            const Swal = (await import('sweetalert2')).default;
            const wrapper = mountCancel();
            const form = wrapper.find('form#cancelForm');
            await form.trigger('submit.prevent');
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: 'error',
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                })
            );
        });

        it('preConfirm calls fetchWrapper.get for cancel endpoint', async ({ annotate }) => {
            await annotate('Cancel onSubmit preConfirm: validates the SweetAlert preConfirm callback calls the correct module/id/cancel API endpoint');
            const { fetchWrapper } = await import('@/helpers/fetchWrapper');
            const Swal = (await import('sweetalert2')).default;
            vi.mocked(fetchWrapper.get).mockResolvedValue({ success: true });
            vi.mocked(Swal.fire).mockImplementation(async (options: any) => {
                if (options.preConfirm) {
                    options.preConfirm();
                }
                return { isConfirmed: true } as any;
            });

            const wrapper = mountCancel();
            const form = wrapper.find('form#cancelForm');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/vps/101/cancel'));
        });

        it('preConfirm catches synchronous errors', async ({ annotate }) => {
            await annotate('Cancel onSubmit preConfirm: ensures synchronous errors thrown during the cancel API call are caught and logged');
            const { fetchWrapper } = await import('@/helpers/fetchWrapper');
            const Swal = (await import('sweetalert2')).default;
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            // Make fetchWrapper.get throw synchronously to trigger the catch block
            vi.mocked(fetchWrapper.get).mockImplementation(() => { throw new Error('sync cancel fail'); });
            vi.mocked(Swal.fire).mockImplementation(async (options: any) => {
                if (options.preConfirm) {
                    options.preConfirm();
                }
                return { isConfirmed: true } as any;
            });

            const wrapper = mountCancel();
            const form = wrapper.find('form#cancelForm');
            await form.trigger('submit.prevent');
            await flushPromises();

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
