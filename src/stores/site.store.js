import { defineStore } from 'pinia';

const baseUrl = import.meta.env.VITE_API_URL;

export const useSiteStore = defineStore({
    id: 'site',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: {},
        page_heading: '',
        sidemenu: '',
        title: ''
    }),
    actions: {
        getBaseUrl() {
            return baseUrl;
        },
        setBreadcrums(value) {
            this.breadcrums = value;
        },
        addBreadcrum(key, value) {
            this.breadcrums[key] = value;
        },
        setPageHeading(value) {
            this.page_heading = value;
        },
        setTitle(value) {
            this.title = value;
            document.title = this.title + ' | My InterServer';
        },
        setSideMenu(value) {
            this.sidemenu = value;
        },
    }
});