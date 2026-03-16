import { mount } from '@vue/test-utils';
import Dialog from '@/components/Dialog.vue';

describe('Dialog.vue', () => {
    it('renders dialog element', () => {
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

    it('exposes show and close methods', () => {
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

    it('renders slot content', () => {
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

    it('show() sets body overflow to hidden', () => {
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

    it('close() sets body overflow to auto', () => {
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
