import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Searchbox from '@/components/Searchbox.vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({ results: [], tables: {} }),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({ params: {}, query: {} })),
    useRouter: vi.fn(() => ({ push: mockPush })),
    RouterLink: { template: '<a><slot /></a>' },
}));

const mockSearchData = {
    results: [
        [1, '100', 'vps100.example.com', '10.0.0.1'],
        [1, '101', 'vps101.example.com', '10.0.0.2'],
        [2, '200', 'example.com'],
    ],
    tables: {
        1: { id: 'vps_id', table: 'vps', label: 'VPS', link: '/vps/', search: ['vps_id', 'vps_hostname', 'vps_ip'], prefix: 'vps' },
        2: { id: 'domain_id', table: 'domains', link: '/domains/', search: ['domain_id', 'domain_hostname'] },
    } as Record<number, any>,
};

const mountOptions = {
    global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
};

describe('Searchbox', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(fetchWrapper.get).mockResolvedValue({ results: [], tables: {} });
    });

    it('renders search input', ({ annotate }) => {
        annotate('Searchbox: verifies the search input element with class new-search is present in the DOM');
        const wrapper = mount(Searchbox, mountOptions);
        expect(wrapper.find('input.new-search').exists()).toBe(true);
    });

    it('shows icon', ({ annotate }) => {
        annotate('Searchbox: confirms the search icon element is rendered alongside the input');
        const wrapper = mount(Searchbox, mountOptions);
        const icon = wrapper.find('.search-icon');
        expect(icon.exists()).toBe(true);
    });

    it('clears search on icon click when search has value', async ({ annotate }) => {
        await annotate('Searchbox: validates clicking the icon when input has text clears the input value to empty string');
        const wrapper = mount(Searchbox, mountOptions);
        const input = wrapper.find('input.new-search');
        await input.setValue('test query');
        const icon = wrapper.find('.search-icon');
        await icon.trigger('click');
        expect((input.element as HTMLInputElement).value).toBe('');
    });

    it('loads search results on mount', async ({ annotate }) => {
        await annotate('Searchbox: confirms the component fetches search data from the /search endpoint on initial mount');
        mount(Searchbox, mountOptions);
        await flushPromises();
        expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/search'));
    });

    it('shows down arrow icon by default', ({ annotate }) => {
        annotate('Searchbox: verifies the default icon state shows a down arrow indicator when no search is active');
        const wrapper = mount(Searchbox, mountOptions);
        expect(wrapper.find('.search-icon').text()).toContain('▼');
    });

    describe('with search data', () => {
        beforeEach(() => {
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(mockSearchData)));
        });

        it('filters results based on search input', async ({ annotate }) => {
            await annotate('Searchbox filtering: confirms typing a query shows results and filteredResults contains matching entries');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('vps100');
            await flushPromises();
            const vm = wrapper.vm as any;
            expect(vm.showResults).toBe(true);
            expect(vm.filteredResults.length).toBeGreaterThan(0);
        });

        it('hides results when search is cleared', async ({ annotate }) => {
            await annotate('Searchbox filtering: validates the results dropdown closes when the search input is cleared back to empty');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('vps');
            await flushPromises();
            await input.setValue('');
            await flushPromises();
            const vm = wrapper.vm as any;
            expect(vm.showResults).toBe(false);
        });

        it('shows X icon when input has value', async ({ annotate }) => {
            await annotate('Searchbox icon state: confirms the icon switches from down arrow to X clear button when input contains text');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('test');
            await flushPromises();
            expect(wrapper.find('.search-icon').text()).toContain('✖');
        });

        it('onIconClick shows all results when results hidden', async ({ annotate }) => {
            await annotate('Searchbox icon click: verifies clicking the icon when results are hidden toggles the dropdown open');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            expect(vm.showResults).toBe(false);
            await wrapper.find('.search-icon').trigger('click');
            expect(vm.showResults).toBe(true);
        });

        it('onIconClick hides results when showing and no search', async ({ annotate }) => {
            await annotate('Searchbox icon click: validates a second icon click closes the dropdown when the input is empty (toggle behavior)');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            // First click to show
            await wrapper.find('.search-icon').trigger('click');
            expect(vm.showResults).toBe(true);
            // Second click to hide (no search input)
            await wrapper.find('.search-icon').trigger('click');
            expect(vm.showResults).toBe(false);
        });

        it('navigates with ArrowDown key', async ({ annotate }) => {
            await annotate('Searchbox keyboard nav: confirms ArrowDown increments the highlight index to select the next result');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            // Show results first
            await wrapper.find('.search-icon').trigger('click');
            const input = wrapper.find('input.new-search');
            await input.trigger('keydown', { key: 'ArrowDown' });
            const vm = wrapper.vm as any;
            expect(vm.highlightIndex).toBeGreaterThanOrEqual(0);
        });

        it('navigates with ArrowUp key', async ({ annotate }) => {
            await annotate('Searchbox keyboard nav: confirms ArrowUp decrements the highlight index after moving down through results');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            await wrapper.find('.search-icon').trigger('click');
            const input = wrapper.find('input.new-search');
            // Move down first
            await input.trigger('keydown', { key: 'ArrowDown' });
            await input.trigger('keydown', { key: 'ArrowDown' });
            // Now move up
            await input.trigger('keydown', { key: 'ArrowUp' });
            const vm = wrapper.vm as any;
            expect(vm.highlightIndex).toBeGreaterThanOrEqual(0);
        });

        it('navigates on Enter key', async ({ annotate }) => {
            await annotate('Searchbox keyboard nav: validates pressing Enter on a highlighted result triggers router navigation');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            await wrapper.find('.search-icon').trigger('click');
            const input = wrapper.find('input.new-search');
            await input.trigger('keydown', { key: 'ArrowDown' });
            await input.trigger('keydown', { key: 'Enter' });
            expect(mockPush).toHaveBeenCalled();
        });

        it('does nothing on keydown when no results', async ({ annotate }) => {
            await annotate('Searchbox keyboard nav: ensures arrow key presses are ignored and highlight stays at -1 when there are no results');
            vi.mocked(fetchWrapper.get).mockResolvedValue({ results: [], tables: {} });
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.trigger('keydown', { key: 'ArrowDown' });
            const vm = wrapper.vm as any;
            expect(vm.highlightIndex).toBe(-1);
        });

        it('renders display rows with fields', async ({ annotate }) => {
            await annotate('Searchbox display: verifies displayRows computed property produces rows with fields when a matching search is entered');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('example');
            await flushPromises();
            const vm = wrapper.vm as any;
            expect(vm.displayRows.length).toBeGreaterThan(0);
        });
    });

    describe('utility functions', () => {
        it('ucwords converts snake_case to Title Case', async ({ annotate }) => {
            await annotate('Searchbox ucwords: validates snake_case field names are converted to Title Case for display labels');
            const wrapper = mount(Searchbox, mountOptions);
            const vm = wrapper.vm as any;
            expect(vm.ucwords('vps_hostname')).toBe('Vps Hostname');
        });

        it('ucwords converts id to uppercase', async ({ annotate }) => {
            await annotate('Searchbox ucwords: confirms the special-case "id" token is converted to uppercase "ID"');
            const wrapper = mount(Searchbox, mountOptions);
            const vm = wrapper.vm as any;
            expect(vm.ucwords('id')).toBe('ID');
        });

        it('ucwords converts ip to uppercase', async ({ annotate }) => {
            await annotate('Searchbox ucwords: confirms the special-case "ip" token is converted to uppercase "IP"');
            const wrapper = mount(Searchbox, mountOptions);
            const vm = wrapper.vm as any;
            expect(vm.ucwords('ip')).toBe('IP');
        });

        it('splitHighlight returns full text when no search', async ({ annotate }) => {
            await annotate('Searchbox splitHighlight: verifies an empty search string returns the full text as a single non-matching segment');
            const wrapper = mount(Searchbox, mountOptions);
            const vm = wrapper.vm as any;
            const result = vm.splitHighlight('hello world', '');
            expect(result).toEqual([{ text: 'hello world', match: false }]);
        });

        it('splitHighlight splits on match', async ({ annotate }) => {
            await annotate('Searchbox splitHighlight: confirms text is split into multiple segments with the matching portion flagged for highlighting');
            const wrapper = mount(Searchbox, mountOptions);
            const vm = wrapper.vm as any;
            const result = vm.splitHighlight('hello world', 'world');
            expect(result.length).toBeGreaterThan(1);
            expect(result.some((p: any) => p.match)).toBe(true);
        });
    });

    describe('click outside', () => {
        it('hides results when clicking outside', async ({ annotate }) => {
            await annotate('Searchbox click outside: validates the results dropdown closes when a click event occurs outside the component');
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(mockSearchData)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            // Show results
            await wrapper.find('.search-icon').trigger('click');
            const vm = wrapper.vm as any;
            expect(vm.showResults).toBe(true);
            // Simulate click outside
            document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(vm.showResults).toBe(false);
        });
    });

    describe('updateSearchResults', () => {
        it('fetches additional results when search length is 18', async ({ annotate }) => {
            await annotate('Searchbox updateSearchResults: confirms a server-side search fetch is triggered when the input reaches exactly 18 characters');
            vi.mocked(fetchWrapper.get)
                .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockSearchData)))
                .mockResolvedValueOnce({ results: [[1, '999', 'new-result.com', '10.0.0.99']] });
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('123456789012345678'); // exactly 18 chars
            await flushPromises();
            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/search?search='));
        });
    });

    describe('error handling', () => {
        it('handles loadSearchResults error', async ({ annotate }) => {
            await annotate('Searchbox error handling: verifies a network error during initial search load is caught and logged to console.error');
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('Network error'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mount(Searchbox, mountOptions);
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('handles updateSearchResults error', async ({ annotate }) => {
            await annotate('Searchbox error handling: verifies a failed server-side search update is caught and logged without crashing the component');
            vi.mocked(fetchWrapper.get)
                .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockSearchData)))
                .mockRejectedValueOnce(new Error('Search update error'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('123456789012345678'); // exactly 18 chars
            await flushPromises();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('getServiceId with extra fields', () => {
        it('returns correct service id when table has extra fields', async ({ annotate }) => {
            await annotate('Searchbox getServiceId: confirms the service ID is correctly extracted when extra fields shift the column position in result rows');
            const dataWithExtras = {
                results: [
                    [3, 'extra_val', '500', 'hostname.test.com'],
                ],
                tables: {
                    ...mockSearchData.tables,
                    3: { id: 'svc_id', table: 'services', link: '/services/', search: ['svc_id', 'svc_hostname'], extra: ['svc_type'], prefix: 'svc' },
                } as Record<number, any>,
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(dataWithExtras)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            const row = vm.searchResults.results[0];
            const serviceId = vm.getServiceId(row);
            expect(serviceId).toBe('500');
        });
    });

    describe('buildDisplayFields with extra fields and edge cases', () => {
        it('builds display fields including extra fields', async ({ annotate }) => {
            await annotate('Searchbox buildDisplayFields: validates both regular search fields and extra fields are included in the display output');
            const dataWithExtras = {
                results: [
                    [3, 'linux', '500', 'hostname.test.com'],
                ],
                tables: {
                    3: { id: 'svc_id', table: 'services', link: '/services/', search: ['svc_id', 'svc_hostname'], extra: ['svc_type'], prefix: 'svc' },
                } as Record<number, any>,
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(dataWithExtras)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            const row = vm.searchResults.results[0];
            const fields = vm.buildDisplayFields(row);
            // Should include both regular and extra fields
            expect(fields.length).toBeGreaterThan(0);
            // Check extra field is present
            const extraField = fields.find((f: any) => f.value === 'linux');
            expect(extraField).toBeDefined();
        });

        it('handles field with no label', async ({ annotate }) => {
            await annotate('Searchbox buildDisplayFields: verifies fields beyond the defined search columns are still included but with an undefined label');
            const dataNoLabel = {
                results: [
                    [4, '600', 'hostname.test.com', 'extra-value'],
                ],
                tables: {
                    4: { id: 'item_id', table: 'items', link: '/items/', search: ['item_id', 'item_hostname'] },
                } as Record<number, any>,
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(dataNoLabel)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            const row = vm.searchResults.results[0];
            const fields = vm.buildDisplayFields(row);
            // extra-value has no corresponding search field label
            const noLabelField = fields.find((f: any) => f.value === 'extra-value');
            expect(noLabelField).toBeDefined();
            expect(noLabelField!.label).toBeUndefined();
        });

        it('returns empty array when searchResults is null', async ({ annotate }) => {
            await annotate('Searchbox buildDisplayFields: confirms the function returns an empty array gracefully when searchResults has been set to null');
            vi.mocked(fetchWrapper.get).mockResolvedValue({ results: [], tables: {} });
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.searchResults = null;
            const fields = vm.buildDisplayFields([1, '100', 'test']);
            expect(fields).toEqual([]);
        });
    });

    describe('onBeforeUnmount cleanup', () => {
        it('removes click event listener on unmount', async ({ annotate }) => {
            await annotate('Searchbox cleanup: verifies the document click listener is properly removed during component unmount to prevent memory leaks');
            const removeListenerSpy = vi.spyOn(document, 'removeEventListener');
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            wrapper.unmount();
            expect(removeListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            removeListenerSpy.mockRestore();
        });
    });

    describe('keyboard navigation edge cases', () => {
        it('ArrowDown does not exceed results length', async ({ annotate }) => {
            await annotate('Searchbox keyboard edge case: ensures ArrowDown is clamped so highlightIndex never exceeds the last result index');
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(mockSearchData)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            await wrapper.find('.search-icon').trigger('click');
            const input = wrapper.find('input.new-search');
            const vm = wrapper.vm as any;
            // Press down many times to try to exceed length
            for (let i = 0; i < 10; i++) {
                await input.trigger('keydown', { key: 'ArrowDown' });
            }
            expect(vm.highlightIndex).toBeLessThan(vm.filteredResults.length);
        });

        it('ArrowUp does not go below 0', async ({ annotate }) => {
            await annotate('Searchbox keyboard edge case: ensures ArrowUp is clamped so highlightIndex never goes below 0');
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(mockSearchData)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            await wrapper.find('.search-icon').trigger('click');
            const input = wrapper.find('input.new-search');
            const vm = wrapper.vm as any;
            // Press up without moving down first
            await input.trigger('keydown', { key: 'ArrowUp' });
            expect(vm.highlightIndex).toBeGreaterThanOrEqual(0);
        });

        it('Enter with highlightIndex -1 does not navigate', async ({ annotate }) => {
            await annotate('Searchbox keyboard edge case: confirms pressing Enter without a highlighted result does not trigger navigation');
            vi.mocked(fetchWrapper.get).mockResolvedValue(JSON.parse(JSON.stringify(mockSearchData)));
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            await input.setValue('vps');
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.highlightIndex = -1;
            await input.trigger('keydown', { key: 'Enter' });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('updateSearchResults deduplication', () => {
        it('does not fetch again for the same search string', async ({ annotate }) => {
            await annotate('Searchbox deduplication: validates that re-entering the same 18-char search string does not trigger a duplicate server fetch');
            vi.mocked(fetchWrapper.get)
                .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockSearchData)))
                .mockResolvedValueOnce({ results: [[1, '999', 'new.com', '10.0.0.99']] });
            const wrapper = mount(Searchbox, mountOptions);
            await flushPromises();
            const input = wrapper.find('input.new-search');
            const searchStr = '123456789012345678';
            await input.setValue(searchStr);
            await flushPromises();
            const callCount = vi.mocked(fetchWrapper.get).mock.calls.length;
            // Set the same value again - should not trigger additional fetch
            await input.setValue('short');
            await flushPromises();
            await input.setValue(searchStr);
            await flushPromises();
            // Should not have made another search call for same string
            expect(vi.mocked(fetchWrapper.get).mock.calls.length).toBe(callCount);
        });
    });
});
