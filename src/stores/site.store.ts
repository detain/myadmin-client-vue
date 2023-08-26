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
        getSettings(module: string) {
            return this.modules[module];
        },
        async checkInfoLoaded(): Promise<void> {
            if (Object.keys(this.modules).length == 0) {
                this.loadInfo();
            }
        },
        async loadInfo(): Promise<void> {
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
        setBreadcrums(value: any) {
            this.breadcrums = value;
        },
        addBreadcrum(key: string, value: string) {
            this.breadcrums[key] = value;
        },
        setPageHeading(value: string) {
            this.page_heading = value;
        },
        setTitle(value: string) {
            this.title = value;
            document.title = this.title + ' | My InterServer';
        },
        setSideMenu(value: string) {
            this.sidemenu = value;
        },
    },
});
