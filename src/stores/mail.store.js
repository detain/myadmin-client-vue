import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/mail`;

export const useMailStore = defineStore({
    id: 'mail',
    state: () => ({
        mailList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/mail');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log("got error response"+error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id) {
            const keyMap = {
                'package': 'pkg',
            };
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/mail/' + id);
                this.$reset();
                let key, value;
                console.log('api success');
                console.log(response);
                for (key in response) {
                    value = response[key];
                    if (typeof this[key] != 'undefined') {
                        this[key] = value;
                    } else if (typeof this[snakeToCamel(key)] != 'undefined') {
                        this[snakeToCamel(key)] = value;
                    } else if (typeof keyMap[key] != 'undefined') {
                        this[keyMap[key]] = value;
                    } else {
                        console.log("no key '"+key+"' with value '"+value+"'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }


        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.mailList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.mailList = this.mailList.filter(x => x.id !== id);
Z        }
    }
});
