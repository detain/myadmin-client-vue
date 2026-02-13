/**
 * Generates a password with the given length allowing you to choose what type of characters are included.
 *
 * availableSets:
 *  l = lowercase
 *  u = uppercase
 *  d = digits
 *  s = special characters
 */
export function generatePassword(length: number = 8, availableSets: string = 'luds'): string {
    const sets: string[] = [];
    if (availableSets.includes('l')) {
        sets.push('abcdefghjkmnpqrstuvwxyz');
    }
    if (availableSets.includes('u')) {
        sets.push('ABCDEFGHJKMNPQRSTUVWXYZ');
    }
    if (availableSets.includes('d')) {
        sets.push('23456789');
    }
    if (availableSets.includes('s')) {
        sets.push('!@#$%*?');
    }
    if (sets.length === 0) {
        throw new Error('No character sets selected');
    }
    const getRandomChar = (str: string): string => str[Math.floor(Math.random() * str.length)];
    const passwordChars: string[] = [];
    let allChars = '';
    // Ensure at least one character from each selected set
    for (const set of sets) {
        passwordChars.push(getRandomChar(set));
        allChars += set;
    }
    // Fill remaining length
    for (let i = 0; i < length - sets.length; i++) {
        passwordChars.push(getRandomChar(allChars));
    }
    // Shuffle (Fisher–Yates)
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }
    return passwordChars.join('');
}
