import { defineStore } from 'pinia';

interface AlertMessage {
    message: string;
    type: string;
}

interface AlertState {
    alert: AlertMessage | null;
}

export const useAlertStore = defineStore('alert', {
    state: (): AlertState => ({
        alert: null,
    }),
    getters: {},
    actions: {
        success(message: string) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message: string | { message?: string } | unknown) {
            const msg = typeof message === 'string' ? message : (message as any)?.message ?? String(message);
            this.alert = { message: msg, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        },
    },
});
