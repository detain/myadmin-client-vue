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

    describe('file upload and base64 conversion', () => {
        let OriginalFileReader: typeof FileReader;
        let mockReadAsDataURL: ReturnType<typeof vi.fn>;

        beforeEach(() => {
            OriginalFileReader = globalThis.FileReader;
            mockReadAsDataURL = vi.fn();
        });

        afterEach(() => {
            globalThis.FileReader = OriginalFileReader;
        });

        function installFileReaderMock(resultValue: string) {
            function MockFileReader(this: any) {
                this._result = null;
                this.onload = null;
                this.readAsDataURL = mockReadAsDataURL.mockImplementation(() => {
                    this._result = resultValue;
                    if (this.onload) this.onload();
                });
            }
            Object.defineProperty(MockFileReader.prototype, 'result', {
                get(this: any) { return this._result; },
                configurable: true,
            });
            globalThis.FileReader = MockFileReader as any;
        }

        it('handles file selection and converts to base64', async () => {
            installFileReaderMock('data:image/png;base64,dGVzdC1jb250ZW50');

            const wrapper = mount(NewTicket, mountOptions);
            const fileInput = wrapper.find('input[type="file"]');

            const file = new File(['test-content'], 'screenshot.png', { type: 'image/png' });
            Object.defineProperty(fileInput.element, 'files', { value: [file], writable: false });
            await fileInput.trigger('change');

            expect(mockReadAsDataURL).toHaveBeenCalledWith(file);
            const textInput = wrapper.find('input[name="file_attachment"]');
            expect((textInput.element as HTMLInputElement).value).toBe('screenshot.png');
        });

        it('clears file data when no file is selected', async () => {
            const wrapper = mount(NewTicket, mountOptions);
            const fileInput = wrapper.find('input[type="file"]');

            Object.defineProperty(fileInput.element, 'files', { value: [], writable: false });
            await fileInput.trigger('change');

            const textInput = wrapper.find('input[name="file_attachment"]');
            expect((textInput.element as HTMLInputElement).value).toBe('');
        });

        it('submits attachment data with base64 when file is attached', async () => {
            installFileReaderMock('data:image/jpeg;base64,aW1n');

            vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'Created', ticket: 456 });
            const wrapper = mount(NewTicket, mountOptions);

            const file = new File(['img'], 'photo.jpeg', { type: 'image/jpeg' });
            const fileInput = wrapper.find('input[type="file"]');
            Object.defineProperty(fileInput.element, 'files', { value: [file], writable: false });
            await fileInput.trigger('change');

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/tickets/new'),
                expect.objectContaining({
                    attachments: [{ name: 'photo.jpeg', content: 'aW1n', type: 'image/jpeg' }],
                })
            );
        });

        it('submits empty attachments array when no file is attached', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'Created', ticket: 789 });
            const wrapper = mount(NewTicket, mountOptions);

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/tickets/new'),
                expect.objectContaining({
                    attachments: [],
                })
            );
        });
    });

    describe('form validation and submission', () => {
        it('submits form fields correctly with filled data', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'Created', ticket: 100 });
            const wrapper = mount(NewTicket, mountOptions);

            await wrapper.find('input[placeholder="Subject"]').setValue('Server down');
            await wrapper.find('textarea').setValue('My server is not responding');

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/tickets/new'),
                expect.objectContaining({
                    subject: 'Server down',
                    body: 'My server is not responding',
                    server_access: true,
                    port_no: 22,
                })
            );
        });

        it('navigates to ticket on successful submission', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'Done', ticket: 555 });
            const wrapper = mount(NewTicket, mountOptions);

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(mockPush).toHaveBeenCalledWith('/tickets/555');
        });

        it('shows warning on non-success response', async () => {
            const Swal = (await import('sweetalert2')).default;
            vi.mocked(fetchWrapper.post).mockResolvedValue('Some error message');
            const wrapper = mount(NewTicket, mountOptions);

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(Swal.fire).toHaveBeenCalledWith('Warning', 'Some error message', 'warning');
        });

        it('shows error on submission exception', async () => {
            const Swal = (await import('sweetalert2')).default;
            vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Network error'));
            const wrapper = mount(NewTicket, mountOptions);

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(Swal.fire).toHaveBeenCalledWith('Error', 'Failed to post reply', 'error');
        });
    });

    describe('product loading', () => {
        it('loads products on mount', async () => {
            const productData = {
                VPS: { vps_123: 'My VPS Server' },
                Dedicated: { ded_456: 'My Dedicated' },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(productData);

            const wrapper = mount(NewTicket, mountOptions);
            await flushPromises();

            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/tickets/new'));
            // Products should render as optgroups
            const optgroups = wrapper.findAll('optgroup');
            expect(optgroups.length).toBe(2);
        });

        it('renders product options within optgroups', async () => {
            const productData = {
                VPS: { vps_1: 'VPS Plan A', vps_2: 'VPS Plan B' },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(productData);

            const wrapper = mount(NewTicket, mountOptions);
            await flushPromises();

            const options = wrapper.findAll('optgroup option');
            expect(options.length).toBe(2);
            expect(options[0].text()).toBe('VPS Plan A');
        });
    });

    describe('SSH restricted fields', () => {
        it('shows sudo fields when SSH is restricted', async () => {
            const wrapper = mount(NewTicket, mountOptions);

            // SSH restricted defaults to '0', so sudo fields hidden
            expect(wrapper.text()).not.toContain('Sudo User');

            // Set SSH restricted to '1'
            const yesRadio = wrapper.find('input[type="radio"][value="1"]');
            await yesRadio.setValue();

            expect(wrapper.text()).toContain('Sudo User');
            expect(wrapper.text()).toContain('Sudo Password');
            expect(wrapper.text()).toContain('SSH Port');
        });

        it('hides sudo fields when SSH is not restricted', async () => {
            const wrapper = mount(NewTicket, mountOptions);

            // Set to restricted first
            await wrapper.find('input[type="radio"][value="1"]').setValue();
            expect(wrapper.text()).toContain('Sudo User');

            // Set back to not restricted
            await wrapper.find('input[type="radio"][value="0"]').setValue();
            expect(wrapper.text()).not.toContain('Sudo User');
        });

        it('includes sudo fields in submission when SSH is restricted', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({ success: true, text: 'OK', ticket: 200 });
            const wrapper = mount(NewTicket, mountOptions);

            // Enable SSH restricted
            await wrapper.find('input[type="radio"][value="1"]').setValue();

            // Fill sudo fields
            await wrapper.find('input[placeholder="Subject"]').setValue('SSH issue');
            const sudoInputs = wrapper.findAll('.form-row input.form-control-sm');
            // Find the sudo user and sudo password fields
            for (const input of sudoInputs) {
                const label = input.element.closest('.form-group')?.querySelector('label');
                if (label?.textContent?.includes('Sudo User')) {
                    await input.setValue('admin');
                }
                if (label?.textContent?.includes('Sudo Password')) {
                    await input.setValue('secret123');
                }
            }

            await wrapper.find('form').trigger('submit.prevent');
            await flushPromises();

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/tickets/new'),
                expect.objectContaining({
                    sudo_user: 'admin',
                    sudo_pass: 'secret123',
                })
            );
        });
    });

    describe('terms modal', () => {
        it('closes terms modal when close button clicked', async () => {
            const wrapper = mount(NewTicket, mountOptions);

            // Open the modal
            await wrapper.find('button.bg-gradient-gray').trigger('click');
            expect(wrapper.find('.modal-backdrop').exists()).toBe(true);

            // Close the modal
            await wrapper.find('.modal-backdrop .close').trigger('click');
            expect(wrapper.find('.modal-backdrop').exists()).toBe(false);
        });
    });

    describe('server access toggle', () => {
        it('hides root password and IP when access is unchecked', async () => {
            const wrapper = mount(NewTicket, mountOptions);

            // By default allowAccess is true
            expect(wrapper.text()).toContain('Root Password');

            // Uncheck
            const checkbox = wrapper.find('#allow-access');
            await checkbox.setValue(false);

            expect(wrapper.text()).not.toContain('Root Password');
            expect(wrapper.text()).not.toContain('Your IP Address');
        });
    });
});
