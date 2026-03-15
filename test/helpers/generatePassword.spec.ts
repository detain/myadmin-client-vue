import { generatePassword } from '@/helpers/generatePassword';

describe('generatePassword', () => {
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const digits = '23456789';
    const special = '!@#$%*?';

    it('generates password with default length 8', () => {
        const pw = generatePassword();
        expect(pw).toHaveLength(8);
    });

    it('generates password with custom length', () => {
        expect(generatePassword(12)).toHaveLength(12);
        expect(generatePassword(4, 'l')).toHaveLength(4);
        expect(generatePassword(20)).toHaveLength(20);
    });

    it('includes only lowercase chars when availableSets="l"', () => {
        const pw = generatePassword(16, 'l');
        for (const ch of pw) {
            expect(lowercase).toContain(ch);
        }
    });

    it('includes only uppercase chars when availableSets="u"', () => {
        const pw = generatePassword(16, 'u');
        for (const ch of pw) {
            expect(uppercase).toContain(ch);
        }
    });

    it('includes only digits when availableSets="d"', () => {
        const pw = generatePassword(16, 'd');
        for (const ch of pw) {
            expect(digits).toContain(ch);
        }
    });

    it('includes only special chars when availableSets="s"', () => {
        const pw = generatePassword(16, 's');
        for (const ch of pw) {
            expect(special).toContain(ch);
        }
    });

    it('includes chars from all sets with "luds"', () => {
        const allChars = lowercase + uppercase + digits + special;
        const pw = generatePassword(32, 'luds');
        for (const ch of pw) {
            expect(allChars).toContain(ch);
        }
    });

    it('ensures at least one char from each selected set', () => {
        // Run multiple times to reduce flakiness
        for (let i = 0; i < 20; i++) {
            const pw = generatePassword(8, 'luds');
            expect(pw.split('').some((ch) => lowercase.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => uppercase.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => digits.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => special.includes(ch))).toBe(true);
        }
    });

    it('throws error when no character sets selected (empty string)', () => {
        expect(() => generatePassword(8, '')).toThrow('No character sets selected');
    });

    it('generates different passwords on successive calls', () => {
        const passwords = new Set<string>();
        for (let i = 0; i < 10; i++) {
            passwords.add(generatePassword(16));
        }
        // With 16-char passwords from a large charset, collisions are astronomically unlikely
        expect(passwords.size).toBeGreaterThan(1);
    });
});
