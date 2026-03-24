import { watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVpsStore } from '@/stores/vps.store';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';

function isElectron(): boolean {
    return typeof window !== 'undefined' && typeof window.api?.updateVpsList === 'function';
}

export function useElectronTray(): void {
    if (!isElectron()) return;

    const router = useRouter();
    const vpsStore = useVpsStore();
    const authStore = useAuthStore();
    const { vpsList } = storeToRefs(vpsStore);
    const loggedIn = computed(() => !!authStore.loggedIn);

    let cleanupNavigate: (() => void) | null = null;
    let cleanupRefresh: (() => void) | null = null;

    function sendVpsListToMain(): void {
        const list = vpsList.value.map((vps) => ({
            vps_id: vps.vps_id,
            vps_hostname: vps.vps_hostname,
            vps_ip: vps.vps_ip,
            vps_status: vps.vps_status,
            vps_vzid: vps.vps_vzid,
            vps_vnc: vps.vps_vnc,
        }));
        window.api.updateVpsList(list);
    }

    async function fetchVpsList(): Promise<void> {
        window.api.updateVpsLoadingState(true);
        try {
            await vpsStore.getAll();
            sendVpsListToMain();
        } catch {
            // Fetch failed - loading state will be cleared by vps-list-update or next attempt
            window.api.updateVpsLoadingState(false);
        }
    }

    // Sync VPS list changes to main process
    watch(vpsList, sendVpsListToMain, { deep: true });

    // Watch login state and notify main process
    watch(loggedIn, async (isLoggedIn) => {
        window.api.updateAuthStatus(isLoggedIn);
        if (isLoggedIn) {
            await fetchVpsList();
        }
    });

    onMounted(async () => {
        // Listen for tray navigation events
        cleanupNavigate = window.api.onNavigate((route: string) => {
            router.push(route);
        });

        // Listen for refresh request from tray menu
        cleanupRefresh = window.api.onRefreshVpsList(() => {
            fetchVpsList();
        });

        // Send initial auth status
        window.api.updateAuthStatus(loggedIn.value);

        // Fetch VPS list if already logged in
        if (loggedIn.value) {
            await fetchVpsList();
        }
    });

    onBeforeUnmount(() => {
        if (cleanupNavigate) cleanupNavigate();
        if (cleanupRefresh) cleanupRefresh();
    });
}
