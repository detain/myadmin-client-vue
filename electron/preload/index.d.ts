import { ElectronAPI } from '@electron-toolkit/preload';

interface AppApi {
    updateVpsList: (vpsList: any[]) => void;
    onNavigate: (callback: (route: string) => void) => () => void;
    checkForUpdates: () => void;
    installUpdate: () => void;
    onUpdateStatus: (callback: (status: { status: string; info?: string; progress?: number }) => void) => () => void;
}

declare global {
    interface Window {
        electron: ElectronAPI;
        api: AppApi;
    }
}
