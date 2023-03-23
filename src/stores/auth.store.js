import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore, useLayoutStore } from '@/stores';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(loginParams) {
            try {
                const user = await fetchWrapper.post('https://mystage.interserver.net/apiv2/login', loginParams );
                // update pinia state
                this.user = user;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch (error) {
                console.log("error:");
                console.log(error);
                const alertStore = useAlertStore();
                const layoutStore = useLayoutStore();
                if (typeof error.field != "undefined") {
                    layoutStore.useField(error.field);
                }
                alertStore.error(error);
            }
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/account/login');
        }
    }
});
