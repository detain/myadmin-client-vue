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

    it('returns isDarkMode ref', ({ annotate }) => {
        annotate('useDarkMode: verifies composable exposes a boolean isDarkMode reactive ref');
        const wrapper = mount(TestComponent);
        expect(wrapper.vm.isDarkMode).toBeDefined();
        expect(typeof wrapper.vm.isDarkMode).toBe('boolean');
    });

    it('reads from localStorage on mount', ({ annotate }) => {
        annotate('useDarkMode: verifies localStorage darkMode key is read during component mount');
        getItemSpy.mockReturnValue('true');
        mount(TestComponent);
        expect(getItemSpy).toHaveBeenCalledWith('darkMode');
    });

    it('applies dark-mode class when localStorage is "true"', ({ annotate }) => {
        annotate('useDarkMode: verifies body gets dark-mode CSS class when localStorage value is "true"');
        getItemSpy.mockReturnValue('true');
        mount(TestComponent);
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    it('does not apply dark-mode class when localStorage is null', ({ annotate }) => {
        annotate('useDarkMode: verifies body does not get dark-mode class when no localStorage preference exists');
        getItemSpy.mockReturnValue(null);
        mount(TestComponent);
        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });

    it('toggles body class when isDarkMode changes', async ({ annotate }) => {
        await annotate('useDarkMode: verifies toggling isDarkMode ref syncs body class and persists to localStorage');
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
