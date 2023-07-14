export const snakeToCamel = (s: string) => {
    return s.replace(/_(\w)/g, (match, p1) => {
        return p1.toUpperCase();
    });
};
