import { snakeToCamel } from '@/helpers/snakeToCamel';

describe('snakeToCamel', () => {
    it('converts basic snake_case to camelCase', ({ annotate }) => {
        annotate('snakeToCamel: verifies single-underscore snake_case converts to camelCase');
        expect(snakeToCamel('hello_world')).toBe('helloWorld');
    });

    it('converts multiple underscores', ({ annotate }) => {
        annotate('snakeToCamel: verifies multi-segment snake_case correctly capitalizes each word boundary');
        expect(snakeToCamel('my_long_variable_name')).toBe('myLongVariableName');
    });

    it('returns the same string when no underscores', ({ annotate }) => {
        annotate('snakeToCamel: verifies strings without underscores pass through unchanged');
        expect(snakeToCamel('already')).toBe('already');
    });

    it('handles leading underscore', ({ annotate }) => {
        annotate('snakeToCamel: verifies leading underscore is removed and following character is capitalized');
        expect(snakeToCamel('_private')).toBe('Private');
    });

    it('handles empty string', ({ annotate }) => {
        annotate('snakeToCamel: verifies empty string input returns empty string without error');
        expect(snakeToCamel('')).toBe('');
    });
});
