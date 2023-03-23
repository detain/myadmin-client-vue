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
        useField(field) {
            this.opts[field] = true;
        },
    }
});
