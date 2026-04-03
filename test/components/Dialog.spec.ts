import { mount } from '@vue/test-utils';
import Dialog from '@/components/Dialog.vue';

describe('Dialog.vue', () => {
    it('renders dialog element', ({ annotate }) => {
        annotate('Dialog: verifies the native HTML dialog element is present in the rendered output');
        const wrapper = mount(Dialog, {
            global: {
                stubs: {
                    'el-dialog': { template: '<div><slot /></div>' },
                    'el-dialog-backdrop': { template: '<div />' },
                    'el-dialog-panel': { template: '<div><slot /></div>' },
                },
            },
        });
        expect(wrapper.find('dialog').exists()).toBe(true);
    });

    it('exposes show and close methods', ({ annotate }) => {
        annotate('Dialog: confirms the component exposes show() and close() as callable functions on the public API');
        const wrapper = mount(Dialog, {
            global: {
                stubs: {
                    'el-dialog': { template: '<div><slot /></div>' },
                    'el-dialog-backdrop': { template: '<div />' },
                    'el-dialog-panel': { template: '<div><slot /></div>' },
                },
            },
        });
        expect(typeof wrapper.vm.show).toBe('function');
        expect(typeof wrapper.vm.close).toBe('function');
    });

    it('renders slot content', ({ annotate }) => {
        annotate('Dialog: validates that content passed via the dialog-conent slot is rendered inside the dialog');
        const wrapper = mount(Dialog, {
            global: {
                stubs: {
                    'el-dialog': { template: '<div><slot /></div>' },
                    'el-dialog-backdrop': { template: '<div />' },
                    'el-dialog-panel': { template: '<div><slot /></div>' },
                },
            },
            slots: {
                'dialog-conent': '<p>Test Content</p>',
            },
        });
        expect(wrapper.html()).toContain('Test Content');
    });

    it('show() sets body overflow to hidden', ({ annotate }) => {
        annotate('Dialog: verifies calling show() sets document.body overflow to hidden to prevent background scrolling');
        // jsdom doesn't implement HTMLDialogElement.show(), so mock it
        HTMLDialogElement.prototype.show = vi.fn();
        const wrapper = mount(Dialog, {
            global: {
                stubs: {
                    'el-dialog': { template: '<div><slot /></div>' },
                    'el-dialog-backdrop': { template: '<div />' },
                    'el-dialog-panel': { template: '<div><slot /></div>' },
                },
            },
        });
        document.body.style.overflow = 'auto';
        wrapper.vm.show();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('close() sets body overflow to auto', ({ annotate }) => {
        annotate('Dialog: verifies calling close() restores document.body overflow to auto so scrolling resumes');
        HTMLDialogElement.prototype.close = vi.fn();
        const wrapper = mount(Dialog, {
            global: {
                stubs: {
                    'el-dialog': { template: '<div><slot /></div>' },
                    'el-dialog-backdrop': { template: '<div />' },
                    'el-dialog-panel': { template: '<div><slot /></div>' },
                },
            },
        });
        document.body.style.overflow = 'hidden';
        wrapper.vm.close();
        expect(document.body.style.overflow).toBe('auto');
    });
});
