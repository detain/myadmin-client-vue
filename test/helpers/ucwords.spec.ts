import { ucwords } from '@/helpers/ucwords';

describe('ucwords', () => {
    it('capitalizes a single word', () => {
        expect(ucwords('hello')).toBe('Hello');
    });

    it('capitalizes multiple words', () => {
        expect(ucwords('hello world foo')).toBe('Hello World Foo');
    });

    it('leaves already capitalized words unchanged', () => {
        expect(ucwords('Hello World')).toBe('Hello World');
    });

    it('capitalizes all lowercase words', () => {
        expect(ucwords('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('throws on non-string input', () => {
        expect(() => ucwords(123 as any)).toThrow(TypeError);
        expect(() => ucwords(123 as any)).toThrow('ucwords expects a string parameter');
    });
});
