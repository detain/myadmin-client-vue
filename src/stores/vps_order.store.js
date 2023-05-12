import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

export const useVpsOrderStore = defineStore({
    id: 'vps_order',
    state: () => ({
        platformPackages: {
            kvm: 32,
            kvmstorage: 57,
            hyperv: 54
        },
        platformNames: {
            kvm: "KVM",
            kvmstorage: "KVM Storage",
            hyperv: "HyperV"
        },
        packageCosts: {
            32: 10,
            54: 10,
            57: 6
        },
        locationStock: {
            1: { kvm: true, kvmstorage: true, hyperv: true },
            2: { kvm: true, kvmstorage: false, hyperv: true },
            3: { kvm: false, kvmstorage: false, hyperv: false }
        },
        locationNames: {
            1: "New Jersey",
            2: "Los Angeles",
            3: "Equinix NY4"
        },
        osNames: {
            windows: "Windows",
            almalinux: "Almalinux"
        },
        templates: {
            hyperv: {
                windows: { Windows2019Standard: "2019 Standard", Windows2022: "2022" }
            },
            kvm: {},
            kvmstorage: {}
        }

    }),
    actions: {
        async load() {
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/vps/order');
                this.maxSlices = response.maxSlices;
                this.platformPackages = response.platformPackages;
                this.platformNames = response.platformNames;
                this.packageCosts = response.packageCosts;
                this.locationStock = response.locationStock;
                this.locationNames = response.locationNames;
                this.osNames = response.osNames;
                this.locationNames = response.locationNames;
                this.templates = response.templates;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        },
        async reloadCaptcha() {
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/captcha');
                this.captcha = response.captcha;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        },
        async login(loginParams) {
            try {
                const user = await fetchWrapper.post('https://mystage.interserver.net/apiv2/login', loginParams );
                this.user = user;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error) {
                console.log("error:");
                console.log(error);
                if (typeof error.field != "undefined") {
                    this.opts[field] = true;
                }
                const alertStore = useAlertStore();
                alertStore.error(error);
            }
        },
        async logout() {
            this.user = null;
            localStorage.removeItem('user');
            await router.push('/account/login');
        }
    }
});
