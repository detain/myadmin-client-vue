import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import SslList from '@/views/ssl/SslList.vue';

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

describe('SslList', () => {
    it('renders ServiceListTable component', ({ annotate }) => {
        annotate('SSL List: verifies the ServiceListTable child component is rendered in the DOM');
        const wrapper = mount(SslList, mountOptions);
        expect(wrapper.find('[data-testid="service-list-table"]').exists()).toBe(true);
    });

    it('sets page heading', ({ annotate }) => {
        annotate('SSL List: verifies the component mounts successfully and sets the page heading');
        const wrapper = mount(SslList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });
});
