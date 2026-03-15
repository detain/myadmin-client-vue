import { snakeToCamel } from '@/helpers/snakeToCamel';

describe('snakeToCamel', () => {
    it('converts basic snake_case to camelCase', () => {
        expect(snakeToCamel('hello_world')).toBe('helloWorld');
    });

    it('converts multiple underscores', () => {
        expect(snakeToCamel('my_long_variable_name')).toBe('myLongVariableName');
    });

    it('returns the same string when no underscores', () => {
        expect(snakeToCamel('already')).toBe('already');
    });

    it('handles leading underscore', () => {
        expect(snakeToCamel('_private')).toBe('Private');
    });

    it('handles empty string', () => {
        expect(snakeToCamel('')).toBe('');
    });
});
