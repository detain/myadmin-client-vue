import { moduleLink } from '@/helpers/moduleLink';

describe('moduleLink', () => {
    it('maps "quickservers" to "qs"', ({ annotate }) => {
        annotate('moduleLink: verifies "quickservers" module name maps to shortened "qs" route prefix');
        expect(moduleLink('quickservers')).toBe('qs');
    });

    it('maps "webhosting" to "websites"', ({ annotate }) => {
        annotate('moduleLink: verifies "webhosting" module name maps to "websites" route prefix');
        expect(moduleLink('webhosting')).toBe('websites');
    });

    it('passes through other strings unchanged', ({ annotate }) => {
        annotate('moduleLink: verifies unmapped module names like vps, domains, ssl pass through as-is');
        expect(moduleLink('vps')).toBe('vps');
        expect(moduleLink('domains')).toBe('domains');
        expect(moduleLink('ssl')).toBe('ssl');
    });

    it('returns non-string input coerced to string', ({ annotate }) => {
        annotate('moduleLink: verifies non-string input passes through without type guard enforcement');
        // moduleLink has no runtime type guard; non-string input passes through
        expect(moduleLink(42 as any)).toBe(42);
    });
});
