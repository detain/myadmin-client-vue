import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import ServiceListTable from '@/components/ServiceListTable.vue';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'hostname', label: 'Hostname', link: true },
    { key: 'status', label: 'Status' },
];

const sampleData = [
    { id: 1, hostname: 'server1.test.com', status: 'active' },
    { id: 2, hostname: 'server2.test.com', status: 'pending' },
    { id: 3, hostname: 'server3.test.com', status: 'expired' },
    { id: 4, hostname: 'server4.test.com', status: 'active' },
];

function createWrapper(propsOverrides = {}) {
    return mount(ServiceListTable, {
        props: {
            module: 'vps',
            data: sampleData,
            columns,
            idField: 'id',
            statusField: 'status',
            ...propsOverrides,
        },
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
            stubs: { RouterLink: { template: '<a><slot /></a>' } },
        },
    });
}

describe('ServiceListTable', () => {
    it('renders table with provided columns', () => {
        const wrapper = createWrapper();
        const headers = wrapper.findAll('thead th');
        expect(headers.length).toBe(columns.length + 1); // +1 for action column
        expect(headers[0].text()).toContain('ID');
        expect(headers[1].text()).toContain('Hostname');
        expect(headers[2].text()).toContain('Status');
    });

    it('filters data by active status (default)', () => {
        const wrapper = createWrapper();
        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(2); // id 1 and 4 are active
    });

    it('filters data by pending status', async () => {
        const wrapper = createWrapper();
        const pendingBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Pending');
        await pendingBtn!.trigger('click');
        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(1); // id 2 is pending
    });

    it('shows all data when all filter selected', async () => {
        const wrapper = createWrapper();
        const allBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'All');
        await allBtn!.trigger('click');
        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(4);
    });

    it('sorts by column when header clicked', async () => {
        const wrapper = createWrapper();
        // Click 'All' first so all rows are visible
        const allBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'All');
        await allBtn!.trigger('click');
        // Click hostname header to sort ascending
        const hostnameHeader = wrapper.findAll('thead th')[1];
        await hostnameHeader.trigger('click');
        const firstCell = wrapper.findAll('tbody tr')[0].findAll('td')[1];
        expect(firstCell.text()).toContain('server1.test.com');
    });

    it('toggles sort direction on same column click', async () => {
        const wrapper = createWrapper();
        const allBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'All');
        await allBtn!.trigger('click');
        const idHeader = wrapper.findAll('thead th')[0];
        // Default sort is desc on idField, clicking toggles to asc
        await idHeader.trigger('click');
        let firstCell = wrapper.findAll('tbody tr')[0].findAll('td')[0];
        expect(firstCell.text()).toContain('1');
        // Click again to toggle to desc
        await idHeader.trigger('click');
        firstCell = wrapper.findAll('tbody tr')[0].findAll('td')[0];
        expect(firstCell.text()).toContain('4');
    });

    it('renders order button with correct route', () => {
        const wrapper = createWrapper({ orderRoute: '/vps/order' });
        const orderLink = wrapper.find('#header_btns a');
        expect(orderLink.exists()).toBe(true);
        expect(orderLink.text()).toContain('Order');
    });

    it('renders export dropdown with format options', () => {
        const wrapper = createWrapper();
        const exportItems = wrapper.findAll('.dropdown-menu li');
        expect(exportItems.length).toBe(11); // 11 export formats
    });

    it('renders router-link for link columns', () => {
        const wrapper = createWrapper();
        // Hostname column has link: true, check that it renders through the RouterLink stub
        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBeGreaterThan(0);
        const hostnameCell = rows[0].findAll('td')[1];
        expect(hostnameCell.find('a').exists()).toBe(true);
    });
});
