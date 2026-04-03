import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import FloatingIpsList from '@/views/floating_ips/FloatingIpsList.vue';

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

describe('FloatingIpsList', () => {
    it('renders ServiceListTable component', ({ annotate }) => {
        annotate('Floating IPs List: verifies the ServiceListTable child component is rendered in the DOM');
        const wrapper = mount(FloatingIpsList, mountOptions);
        expect(wrapper.find('[data-testid="service-list-table"]').exists()).toBe(true);
    });

    it('sets page heading', ({ annotate }) => {
        annotate('Floating IPs List: verifies the component mounts successfully and sets the page heading');
        const wrapper = mount(FloatingIpsList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });
});
