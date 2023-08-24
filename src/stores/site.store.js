import { fetchWrapper } from '@/helpers';
import { defineStore } from 'pinia';

const baseUrl = import.meta.env.VITE_API_URL;

export const useSiteStore = defineStore({
    id: 'site',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: {},
        page_heading: '',
        sidemenu: '',
        title: '',
        modules: {},
        services: {},
        serviceTypes: {},
        serviceCategories: {}
    }),
    getters: {

    },
    actions: {
        getBaseUrl() {
            return baseUrl;
        },
        getSettings(module) {
            return this.modules[module];
        },
        async checkInfoLoaded() {
            if (Object.keys(this.modules).length == 0) {
                this.loadInfo();
            }
        },
        async loadInfo() {
            fetchWrapper
                .get(baseUrl + '/info')
                .then((response) => {
                    this.modules = response.modules;
                    this.services = response.services;
                    this.serviceTypes = response.serviceTypes;
                    this.serviceCategories = response.serviceCategories;
                    console.log('info success');
                    console.log(response);
                });
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
    },
});
