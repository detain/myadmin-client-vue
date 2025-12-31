import { defineStore } from 'pinia';

interface AlertMessage {
    message: string;
    type: string;
}

interface AlertState {
    alert: AlertMessage | null;
}

export const useAlertStore = defineStore({
    id: 'alert',
    state: (): AlertState => ({
        alert: null,
    }),
    getters: {},
    actions: {
        success(message: string) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message: string) {
            this.alert = { message, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        },
    },
});
