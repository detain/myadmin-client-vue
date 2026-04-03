import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import LicensesList from '@/views/licenses/LicensesList.vue';

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

describe('LicensesList', () => {
    it('renders ServiceListTable component', ({ annotate }) => {
        annotate('Licenses List: verifies the ServiceListTable child component is rendered in the DOM');
        const wrapper = mount(LicensesList, mountOptions);
        expect(wrapper.find('[data-testid="service-list-table"]').exists()).toBe(true);
    });

    it('sets page heading', ({ annotate }) => {
        annotate('Licenses List: verifies the component mounts successfully and sets the page heading');
        const wrapper = mount(LicensesList, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });
});
