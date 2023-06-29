export const snakeToCamel = (s) => {
    return s.replace(/_(\w)/g, (match, p1) => {
        return p1.toUpperCase();
    });
};
