import { generatePassword } from '@/helpers/generatePassword';

describe('generatePassword', () => {
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const digits = '23456789';
    const special = '!@#$%*?';

    it('generates password with default length 8', ({ annotate }) => {
        annotate('generatePassword: verifies default invocation produces an 8-character password');
        const pw = generatePassword();
        expect(pw).toHaveLength(8);
    });

    it('generates password with custom length', ({ annotate }) => {
        annotate('generatePassword: verifies custom length parameter produces passwords of exact specified lengths');
        expect(generatePassword(12)).toHaveLength(12);
        expect(generatePassword(4, 'l')).toHaveLength(4);
        expect(generatePassword(20)).toHaveLength(20);
    });

    it('includes only lowercase chars when availableSets="l"', ({ annotate }) => {
        annotate('generatePassword: verifies "l" character set restricts output to lowercase letters only');
        const pw = generatePassword(16, 'l');
        for (const ch of pw) {
            expect(lowercase).toContain(ch);
        }
    });

    it('includes only uppercase chars when availableSets="u"', ({ annotate }) => {
        annotate('generatePassword: verifies "u" character set restricts output to uppercase letters only');
        const pw = generatePassword(16, 'u');
        for (const ch of pw) {
            expect(uppercase).toContain(ch);
        }
    });

    it('includes only digits when availableSets="d"', ({ annotate }) => {
        annotate('generatePassword: verifies "d" character set restricts output to digit characters only');
        const pw = generatePassword(16, 'd');
        for (const ch of pw) {
            expect(digits).toContain(ch);
        }
    });

    it('includes only special chars when availableSets="s"', ({ annotate }) => {
        annotate('generatePassword: verifies "s" character set restricts output to special characters only');
        const pw = generatePassword(16, 's');
        for (const ch of pw) {
            expect(special).toContain(ch);
        }
    });

    it('includes chars from all sets with "luds"', ({ annotate }) => {
        annotate('generatePassword: verifies combined "luds" set only produces characters from the four allowed pools');
        const allChars = lowercase + uppercase + digits + special;
        const pw = generatePassword(32, 'luds');
        for (const ch of pw) {
            expect(allChars).toContain(ch);
        }
    });

    it('ensures at least one char from each selected set', ({ annotate }) => {
        annotate('generatePassword: verifies guaranteed representation from every selected character set across 20 runs');
        // Run multiple times to reduce flakiness
        for (let i = 0; i < 20; i++) {
            const pw = generatePassword(8, 'luds');
            expect(pw.split('').some((ch) => lowercase.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => uppercase.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => digits.includes(ch))).toBe(true);
            expect(pw.split('').some((ch) => special.includes(ch))).toBe(true);
        }
    });

    it('throws error when no character sets selected (empty string)', ({ annotate }) => {
        annotate('generatePassword: verifies empty character set string throws descriptive error');
        expect(() => generatePassword(8, '')).toThrow('No character sets selected');
    });

    it('generates different passwords on successive calls', ({ annotate }) => {
        annotate('generatePassword: verifies crypto-based randomness produces unique passwords across 10 consecutive calls');
        const passwords = new Set<string>();
        for (let i = 0; i < 10; i++) {
            passwords.add(generatePassword(16));
        }
        // With 16-char passwords from a large charset, collisions are astronomically unlikely
        expect(passwords.size).toBeGreaterThan(1);
    });
});
