import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
    // Send VPS list to main process for tray menu
    updateVpsList: (vpsList: any[]): void => {
        ipcRenderer.send('vps-list-update', vpsList);
    },

    // Send auth status to main process
    updateAuthStatus: (loggedIn: boolean): void => {
        ipcRenderer.send('auth-status-change', loggedIn);
    },

    // Send VPS loading state to main process
    updateVpsLoadingState: (loading: boolean): void => {
        ipcRenderer.send('vps-loading-state', loading);
    },

    // Navigation from tray menu
    onNavigate: (callback: (route: string) => void): (() => void) => {
        const handler = (_event: any, route: string): void => callback(route);
        ipcRenderer.on('navigate', handler);
        return () => ipcRenderer.removeListener('navigate', handler);
    },

    // Listen for refresh VPS list request from tray menu
    onRefreshVpsList: (callback: () => void): (() => void) => {
        const handler = (): void => callback();
        ipcRenderer.on('refresh-vps-list', handler);
        return () => ipcRenderer.removeListener('refresh-vps-list', handler);
    },

    // Auto-updater
    checkForUpdates: (): void => {
        ipcRenderer.send('check-for-updates');
    },

    installUpdate: (): void => {
        ipcRenderer.send('install-update');
    },

    onUpdateStatus: (callback: (status: { status: string; info?: string; progress?: number }) => void): (() => void) => {
        const handler = (_event: any, data: any): void => callback(data);
        ipcRenderer.on('update-status', handler);
        return () => ipcRenderer.removeListener('update-status', handler);
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
