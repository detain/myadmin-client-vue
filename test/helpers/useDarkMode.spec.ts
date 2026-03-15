import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { useDarkMode } from '@/helpers/useDarkMode';

const TestComponent = defineComponent({
    setup() {
        const { isDarkMode } = useDarkMode();
        return { isDarkMode };
    },
    template: '<div>{{ isDarkMode }}</div>',
});

describe('useDarkMode', () => {
    let getItemSpy: ReturnType<typeof vi.spyOn>;
    let setItemSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        document.body.classList.remove('dark-mode');
        getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns isDarkMode ref', () => {
        const wrapper = mount(TestComponent);
        expect(wrapper.vm.isDarkMode).toBeDefined();
        expect(typeof wrapper.vm.isDarkMode).toBe('boolean');
    });

    it('reads from localStorage on mount', () => {
        getItemSpy.mockReturnValue('true');
        mount(TestComponent);
        expect(getItemSpy).toHaveBeenCalledWith('darkMode');
    });

    it('applies dark-mode class when localStorage is "true"', () => {
        getItemSpy.mockReturnValue('true');
        mount(TestComponent);
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    it('does not apply dark-mode class when localStorage is null', () => {
        getItemSpy.mockReturnValue(null);
        mount(TestComponent);
        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });

    it('toggles body class when isDarkMode changes', async () => {
        getItemSpy.mockReturnValue(null);
        const wrapper = mount(TestComponent);

        expect(document.body.classList.contains('dark-mode')).toBe(false);

        wrapper.vm.isDarkMode = true;
        await nextTick();

        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'true');

        wrapper.vm.isDarkMode = false;
        await nextTick();

        expect(document.body.classList.contains('dark-mode')).toBe(false);
        expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'false');
    });
});
