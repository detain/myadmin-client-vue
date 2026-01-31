import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';

import { useAuthStore } from '../stores/auth.store';
import { useSiteStore } from '../stores/site.store';

interface UserRow {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    isDeleting?: boolean;
}

interface UserState {
    loading?: boolean;
    error?: string | boolean;
    users: UserRow[];
    user: UserRow;
}

export const useUsersStore = defineStore('users', {
    state: (): UserState => ({
        loading: false,
        error: false,
        users: [],
        user: {},
    }),
    getters: {},
    actions: {
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                this.users = await fetchWrapper.get(baseUrl);
            } catch (error: any) {
                this.error = error;
            }
        },
        async getById(id: number | string): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error: any) {
                this.error = error;
            }
        },
        async update(id: number, params: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged-in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.account_id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id: number): Promise<void> {
            // add isDeleting prop to user being deleted
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            //this.users.find((x: any) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            //this.users = this.users.filter((x: any) => x.id !== id);

            // auto logout if the logged-in user deleted their own record
            const authStore = useAuthStore();
            if (id === authStore.user.account_id) {
                await authStore.logout();
            }
        },
    },
});
