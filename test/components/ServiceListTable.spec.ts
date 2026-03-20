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

    describe('crud_print and crud_export', () => {
        it('calls window.print when print button is clicked', async () => {
            const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
            const wrapper = createWrapper();
            const printBtn = wrapper.findAll('button').find((b) => b.text().includes('Print'));
            expect(printBtn).toBeDefined();
            await printBtn!.trigger('click');
            expect(printSpy).toHaveBeenCalled();
            printSpy.mockRestore();
        });

        it('calls crud_export when export format is clicked', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const wrapper = createWrapper();
            const exportItems = wrapper.findAll('.dropdown-menu li a');
            expect(exportItems.length).toBe(11);
            // Click the first export option (xlsx)
            await exportItems[0].trigger('click');
            // Check that console.log was called with 'xlsx' in any of its calls
            const calls = consoleSpy.mock.calls.flat();
            expect(calls).toContain('xlsx');
            consoleSpy.mockRestore();
        });

        it('calls crud_export with csv type', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const wrapper = createWrapper();
            const exportItems = wrapper.findAll('.dropdown-menu li a');
            // csv is the 7th format (0-indexed: 6)
            await exportItems[6].trigger('click');
            const calls = consoleSpy.mock.calls.flat();
            expect(calls).toContain('csv');
            consoleSpy.mockRestore();
        });
    });

    describe('filter buttons', () => {
        it('filters by expired status', async () => {
            const wrapper = createWrapper();
            const expiredBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Expired');
            expect(expiredBtn).toBeDefined();
            await expiredBtn!.trigger('click');
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(1); // id 3 is expired
        });

        it('active button has active class by default', () => {
            const wrapper = createWrapper();
            const activeBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Active');
            expect(activeBtn!.classes()).toContain('active');
        });

        it('pending button gets active class when clicked', async () => {
            const wrapper = createWrapper();
            const pendingBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Pending');
            await pendingBtn!.trigger('click');
            expect(pendingBtn!.classes()).toContain('active');
        });

        it('handles pending-setup and pend-approval statuses', async () => {
            const extendedData = [
                ...sampleData,
                { id: 5, hostname: 'server5.test.com', status: 'pending-setup' },
                { id: 6, hostname: 'server6.test.com', status: 'pend-approval' },
            ];
            const wrapper = createWrapper({ data: extendedData });
            const pendingBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Pending');
            await pendingBtn!.trigger('click');
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(3); // id 2, 5, 6
        });

        it('handles canceled status under expired filter', async () => {
            const extendedData = [
                ...sampleData,
                { id: 5, hostname: 'server5.test.com', status: 'canceled' },
            ];
            const wrapper = createWrapper({ data: extendedData });
            const expiredBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'Expired');
            await expiredBtn!.trigger('click');
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(2); // id 3 (expired) and 5 (canceled)
        });
    });

    describe('sorting edge cases', () => {
        it('does not sort when column has sortable: false', async () => {
            const nonSortableCols = [
                { key: 'id', label: 'ID' },
                { key: 'hostname', label: 'Hostname', sortable: false },
                { key: 'status', label: 'Status' },
            ];
            const wrapper = createWrapper({ columns: nonSortableCols });
            const allBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'All');
            await allBtn!.trigger('click');
            const hostnameHeader = wrapper.findAll('thead th')[1];
            await hostnameHeader.trigger('click');
            // Sort field should remain the default (idField), not hostname
            const vm = wrapper.vm as any;
            expect(vm.sortField).toBe('id');
        });

        it('handles null values during sort', async () => {
            const dataWithNulls = [
                { id: 1, hostname: null, status: 'active' },
                { id: 2, hostname: 'server2.test.com', status: 'active' },
                { id: 3, hostname: null, status: 'active' },
            ];
            const wrapper = createWrapper({ data: dataWithNulls });
            const hostnameHeader = wrapper.findAll('thead th')[1];
            await hostnameHeader.trigger('click');
            // Should not throw, renders correctly
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(3);
        });

        it('sorts numeric values correctly', async () => {
            const wrapper = createWrapper();
            const allBtn = wrapper.findAll('#limitStatusGroup a').find((a) => a.text() === 'All');
            await allBtn!.trigger('click');
            const idHeader = wrapper.findAll('thead th')[0];
            // Click to sort ascending
            await idHeader.trigger('click');
            const cells = wrapper.findAll('tbody tr').map((tr) => tr.findAll('td')[0].text());
            expect(Number(cells[0])).toBeLessThanOrEqual(Number(cells[1]));
        });
    });

    describe('empty state', () => {
        it('renders empty table when no data matches filter', async () => {
            const noActiveData = [
                { id: 1, hostname: 'server1.test.com', status: 'expired' },
            ];
            const wrapper = createWrapper({ data: noActiveData });
            // Default filter is active, no items are active
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(0);
        });

        it('renders table with no data', () => {
            const wrapper = createWrapper({ data: [] });
            const rows = wrapper.findAll('tbody tr');
            expect(rows.length).toBe(0);
        });
    });

    describe('computedOrderRoute', () => {
        it('uses provided orderRoute when given', () => {
            const wrapper = createWrapper({ orderRoute: '/custom/order' });
            const orderLink = wrapper.find('#header_btns a');
            expect(orderLink.exists()).toBe(true);
        });

        it('computes default order route from module', () => {
            const wrapper = createWrapper({ orderRoute: '' });
            const orderLink = wrapper.find('#header_btns a');
            expect(orderLink.exists()).toBe(true);
        });
    });
});
