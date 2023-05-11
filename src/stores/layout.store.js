import { defineStore } from 'pinia';
export const useLayoutStore = defineStore({
    id: 'layout',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: {},
        page_heading: '',
        sidemenu: ''
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
    }
});
