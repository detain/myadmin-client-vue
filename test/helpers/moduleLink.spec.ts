import { moduleLink } from '@/helpers/moduleLink';

describe('moduleLink', () => {
    it('maps "quickservers" to "qs"', () => {
        expect(moduleLink('quickservers')).toBe('qs');
    });

    it('maps "webhosting" to "websites"', () => {
        expect(moduleLink('webhosting')).toBe('websites');
    });

    it('passes through other strings unchanged', () => {
        expect(moduleLink('vps')).toBe('vps');
        expect(moduleLink('domains')).toBe('domains');
        expect(moduleLink('ssl')).toBe('ssl');
    });

    it('throws on non-string input', () => {
        expect(() => moduleLink(42)).toThrow(TypeError);
        expect(() => moduleLink(42)).toThrow('moduleLinks expects a string parameter');
    });
});
