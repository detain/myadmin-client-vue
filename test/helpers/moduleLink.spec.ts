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

    it('returns non-string input coerced to string', () => {
        // moduleLink has no runtime type guard; non-string input passes through
        expect(moduleLink(42 as any)).toBe(42);
    });
});
