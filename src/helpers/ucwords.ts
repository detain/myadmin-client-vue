export const ucwords = (str: string) => {
    if (typeof str !== 'string') {
        throw new TypeError('ucwords expects a string parameter');
    }
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
};
