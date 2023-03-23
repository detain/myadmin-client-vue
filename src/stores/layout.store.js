import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

export const useLayoutStore = defineStore({
    id: 'layout',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: '',
        page_header: '',
        sidemenu: '',
        gravatar: '',
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
        setPageHeader(value) {
            this.page_header = value;
        },
        setSideMenu(value) {
            this.sidemenu = value;
        },
        useField(field) {
            this.opts[field] = true;
        },
    }
});
