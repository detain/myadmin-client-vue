import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';

export const useLoginStore = defineStore({
    id: 'login',
    state: () => ({
        logo: '//my.interserver.net/templates/my/logo.png',
        captcha: '',
        language: 'en-US',
        counts: {
            vps: 0,
            websites: 0,
            servers: 0
        }
    }),
    actions: {
        async load() {
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/login');
                this.logo = response.logo;
                this.captcha = response.captcha;
                this.language = response.language;
                this.counts = response.counts;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        }
    }
});
