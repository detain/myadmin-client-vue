import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import Searchbox from '@/components/Searchbox.vue';

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

const mountOptions = {
    global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
};

describe('Searchbox', () => {
    it('renders search input', () => {
        const wrapper = mount(Searchbox, mountOptions);
        expect(wrapper.find('input.new-search').exists()).toBe(true);
    });

    it('shows icon', () => {
        const wrapper = mount(Searchbox, mountOptions);
        const icon = wrapper.find('.search-icon');
        expect(icon.exists()).toBe(true);
    });

    it('clears search on icon click when search has value', async () => {
        const wrapper = mount(Searchbox, mountOptions);
        const input = wrapper.find('input.new-search');
        await input.setValue('test query');
        // After setting value, showResults becomes true and icon shows X
        const icon = wrapper.find('.search-icon');
        await icon.trigger('click');
        expect((input.element as HTMLInputElement).value).toBe('');
    });
});
