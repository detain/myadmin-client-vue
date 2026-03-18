import { watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useVpsStore } from '@/stores/vps.store';
import { storeToRefs } from 'pinia';

function isElectron(): boolean {
    return typeof window !== 'undefined' && typeof window.api?.updateVpsList === 'function';
}

export function useElectronTray(): void {
    if (!isElectron()) return;

    const router = useRouter();
    const vpsStore = useVpsStore();
    const { vpsList } = storeToRefs(vpsStore);

    let cleanupNavigate: (() => void) | null = null;

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

    watch(vpsList, sendVpsListToMain, { deep: true });

    onMounted(async () => {
        // Listen for tray navigation events
        cleanupNavigate = window.api.onNavigate((route: string) => {
            router.push(route);
        });

        // Fetch VPS list and send to tray
        try {
            await vpsStore.getAll();
            sendVpsListToMain();
        } catch {
            // User may not be logged in yet
        }
    });

    onBeforeUnmount(() => {
        if (cleanupNavigate) cleanupNavigate();
    });
}
