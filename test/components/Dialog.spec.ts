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
});
