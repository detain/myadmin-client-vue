import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

export const useMailOrderStore = defineStore({
    id: 'mail_order',
    state: () => ({
        packageCosts: {},
        serviceTypes: {}
    }),
    actions: {
        async load() {
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/mail/order');
                this.packageCosts = response.packageCosts;
                this.serviceTypes = response.serviceTypes;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        }
    }
});
