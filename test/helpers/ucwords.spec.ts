import { ucwords } from '@/helpers/ucwords';

describe('ucwords', () => {
    it('capitalizes a single word', ({ annotate }) => {
        annotate('ucwords: verifies single lowercase word gets its first letter capitalized');
        expect(ucwords('hello')).toBe('Hello');
    });

    it('capitalizes multiple words', ({ annotate }) => {
        annotate('ucwords: verifies each space-separated word gets its first letter capitalized');
        expect(ucwords('hello world foo')).toBe('Hello World Foo');
    });

    it('leaves already capitalized words unchanged', ({ annotate }) => {
        annotate('ucwords: verifies already-capitalized input is returned without modification');
        expect(ucwords('Hello World')).toBe('Hello World');
    });

    it('capitalizes all lowercase words', ({ annotate }) => {
        annotate('ucwords: verifies a full sentence of lowercase words all get capitalized');
        expect(ucwords('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('throws on non-string input', ({ annotate }) => {
        annotate('ucwords: verifies non-string input throws TypeError with descriptive message');
        expect(() => ucwords(123 as any)).toThrow(TypeError);
        expect(() => ucwords(123 as any)).toThrow('ucwords expects a string parameter');
    });
});
