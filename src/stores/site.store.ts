import { fetchWrapper } from '@/helpers';
import { defineStore } from 'pinia';

const baseUrl = import.meta.env.VITE_API_URL;

interface ModuleSettings {
    BILLING_DAYS_OFFSET: number;
    DELETE_PENDING_DAYS: number;
    EMAIL_FROM: string;
    IMGNAME: string;
    MENUNAME: string;
    PREFIX: string;
    REPEAT_BILLING_METHOD: string;
    SERVICE_ID_OFFSET: number;
    SUSPEND_DAYS: number;
    SUSPEND_WARNING_DAYS: number;
    TABLE: string;
    TBLNAME: string;
    TITLE: string;
    TITLE_FIELD: string;
    TITLE_FIELD2: string;
    TITLE_FIELD3: string;
    USE_PACKAGES: boolean;
    USE_REPEAT_INVOICE: boolean;
}

interface ServiceInfo {
    services_id: number;
    services_name: string;
    services_type: number;
    services_buyable: boolean;
    services_category: number;
    services_cost: number;
    services_currency: string;
    services_field1: string;
    services_field2: string;
    services_module: string;
}

interface ServiceType {
    st_id: number;
    st_name: string;
    st_category: number;
    st_module: string;
}

interface ServiceCategory {
    category_id: number;
    category_name: string;
    category_tag: string;
    category_module: string;
}

interface SiteState {
    breadcrums: any;
    page_heading: string;
    sidemenu: string;
    title: string;
    modules: {
        [key: string]: ModuleSettings;
    }
    services: {
        [key: string]: ServiceInfo;
    }
    serviceTypes: {
        [key: string]: ServiceType;
    }
    serviceCategories: {
        [key: string]: ServiceCategory;
    }
}

export const useSiteStore = defineStore({
    id: 'site',
    state: (): SiteState => ({
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
