import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick, vi } from 'vitest';
import Alert from '@/components/Alert.vue';
import { useAlertStore } from '@/stores/alert.store';

describe('Alert', () => {
    const createWrapper = () =>
        mount(Alert, {
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
            },
        });

    it('does not render when alert is null', ({ annotate }) => {
        annotate('Alert: verifies component produces no visible output when alertStore has no active alert');
        const wrapper = createWrapper();
        expect(wrapper.find('.container').exists()).toBe(false);
    });

    it('renders success alert message', async ({ annotate }) => {
        await annotate('Alert: confirms success alert renders with .alert-success class and displays the provided message text');
        const wrapper = createWrapper();
        const alertStore = useAlertStore();
        alertStore.success('Operation completed');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.alert-success').exists()).toBe(true);
        expect(wrapper.text()).toContain('Operation completed');
    });

    it('renders error alert message', async ({ annotate }) => {
        await annotate('Alert: confirms error alert renders with .alert-danger class and displays the error message text');
        const wrapper = createWrapper();
        const alertStore = useAlertStore();
        alertStore.error('Something went wrong');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.alert-danger').exists()).toBe(true);
        expect(wrapper.text()).toContain('Something went wrong');
    });

    it('close button calls alertStore.clear()', async ({ annotate }) => {
        await annotate('Alert: verifies clicking the dismiss button resets the alert store state to null');
        const wrapper = createWrapper();
        const alertStore = useAlertStore();
        alertStore.success('Test message');
        await wrapper.vm.$nextTick();
        await wrapper.find('button.close').trigger('click');
        expect(alertStore.alert).toBeNull();
    });

    it('displays correct alert type CSS class', async ({ annotate }) => {
        await annotate('Alert: validates the alert element carries both the type-specific class and the dismissable class for Bootstrap styling');
        const wrapper = createWrapper();
        const alertStore = useAlertStore();
        alertStore.success('Success message');
        await wrapper.vm.$nextTick();
        const alertDiv = wrapper.find('.alert');
        expect(alertDiv.classes()).toContain('alert-success');
        expect(alertDiv.classes()).toContain('alert-dismissable');
    });
});
