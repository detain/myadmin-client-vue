export const moduleLink = (str: string): string => {
    if (str == 'quickservers') {
        return 'qs';
    } else if (str == 'webhosting') {
        return 'websites';
    }
    return str;
};
