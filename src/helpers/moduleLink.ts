export const moduleLink = (str: string | number): string => {
    if (typeof str !== 'string') {
        throw new TypeError('moduleLinks expects a string parameter');
    }
    if (str == 'quickservers') {
        return 'qs';
    } else if (str == 'webhosting') {
        return 'websites';
    }
    return str;
};
