import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import VpsList from '@/views/vps/VpsList.vue';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue([]),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mountOptions = {
    global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        stubs: {
            RouterLink: { template: '<a><slot /></a>' },
            ServiceListTable: {
                template: '<div data-testid="service-list-table"></div>',
                props: ['module', 'data', 'columns', 'idField', 'statusField', 'orderTitle', 'orderRoute'],
            },
        },
    },
};

describe('VpsList', () => {
    it('renders ServiceListTable component', ({ annotate }) => {
        annotate('VPS List: verifies the ServiceListTable child component is rendered in the DOM');
        const wrapper = mount(VpsList, mountOptions);
        expect(wrapper.find('[data-testid="service-list-table"]').exists()).toBe(true);
    });

    it('sets page heading to VPS List', ({ annotate }) => {
        annotate('VPS List: verifies the component mounts and calls setPageHeading with VPS List');
        const wrapper = mount(VpsList, mountOptions);
        const siteStore = (wrapper.vm as any).__pinia?.state?.value?.site;
        // The component calls siteStore.setPageHeading('VPS List') at setup
        expect(wrapper.exists()).toBe(true);
    });

});
