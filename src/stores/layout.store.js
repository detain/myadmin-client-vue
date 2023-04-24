import { defineStore } from 'pinia';
export const useLayoutStore = defineStore({
    id: 'layout',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: {},
        page_heading: '',
        sidemenu: '',
        gravatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        opts: {
            tfa: false,
            verify: false,
            captcha: true
        }
    }),
    actions: {
        setBreadcrums(value) {
            this.breadcrums = value;
        },
        addBreadcrum(key, value) {
            this.breadcrums[key] = value;
        },
        setPageHeading(value) {
            this.page_heading = value;
        },
        setSideMenu(value) {
            this.sidemenu = value;
        },
        useField(field) {
            this.opts[field] = true;
        },
    }
});
