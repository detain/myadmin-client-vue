import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, MenuItemConstructorOptions } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { autoUpdater } from 'electron-updater';
import icon from '../../resources/icon.png?asset';

interface VpsEntry {
    vps_id: number;
    vps_hostname: string;
    vps_ip: string;
    vps_status: string;
    vps_vzid: string;
    vps_vnc: string;
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let vpsList: VpsEntry[] = [];
let isQuitting = false;

function createWindow(): void {
    const { workAreaSize } = screen.getPrimaryDisplay();
    const MAX_WIDTH = 1380;
    const MAX_HEIGHT = 1000;
    const width = Math.min(workAreaSize.width, MAX_WIDTH);
    const height = Math.min(workAreaSize.height, MAX_HEIGHT);

    mainWindow = new BrowserWindow({
        width,
        height,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });

    mainWindow.center();

    if (workAreaSize.width < MAX_WIDTH || workAreaSize.height < MAX_HEIGHT) {
        mainWindow.maximize();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow!.show();
    });

    // Minimize to tray instead of closing
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow!.hide();
        }
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

function buildTrayMenu(): Menu {
    const vpsSubmenuItems: MenuItemConstructorOptions[] = vpsList.length > 0
        ? vpsList.map((vps) => ({
            label: `${vps.vps_hostname || `VPS #${vps.vps_id}`} (${vps.vps_ip})`,
            submenu: [
                {
                    label: 'View Info',
                    click: (): void => {
                        showWindowAndNavigate(`/vps/${vps.vps_id}`);
                    },
                },
                {
                    label: 'Open VNC',
                    click: (): void => {
                        showWindowAndNavigate(`/vps/${vps.vps_id}/view_desktop`);
                    },
                },
                {
                    label: 'Open SSH Connection',
                    click: (): void => {
                        const sshUrl = `ssh://root@${vps.vps_ip}`;
                        shell.openExternal(sshUrl);
                    },
                },
                {
                    label: 'Reboot Server',
                    click: (): void => {
                        showWindowAndNavigate(`/vps/${vps.vps_id}/restart`);
                    },
                },
                {
                    label: 'Create Support Ticket',
                    click: (): void => {
                        showWindowAndNavigate('/tickets/new');
                    },
                },
            ] as MenuItemConstructorOptions[],
        }))
        : [{ label: 'No active VPS', enabled: false }];

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: (): void => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            },
        },
        { type: 'separator' },
        {
            label: 'VPS Servers',
            submenu: vpsSubmenuItems,
        },
        { type: 'separator' },
        {
            label: 'Check for Updates',
            click: (): void => {
                autoUpdater.checkForUpdates();
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: (): void => {
                isQuitting = true;
                app.quit();
            },
        },
    ]);

    return contextMenu;
}

function showWindowAndNavigate(route: string): void {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('navigate', route);
    }
}

function createTray(): void {
    const trayIcon = nativeImage.createFromPath(icon);
    tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    tray.setToolTip('My InterServer Client');

    tray.setContextMenu(buildTrayMenu());

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

function updateTrayMenu(): void {
    if (tray) {
        tray.setContextMenu(buildTrayMenu());
    }
}

// ── Auto-updater setup ──────────────────────────────────────────────────────

function setupAutoUpdater(): void {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
        sendUpdateStatus('checking');
    });

    autoUpdater.on('update-available', (info) => {
        sendUpdateStatus('available', info.version);
    });

    autoUpdater.on('update-not-available', () => {
        sendUpdateStatus('not-available');
    });

    autoUpdater.on('download-progress', (progress) => {
        sendUpdateStatus('downloading', undefined, progress.percent);
    });

    autoUpdater.on('update-downloaded', (info) => {
        sendUpdateStatus('downloaded', info.version);
    });

    autoUpdater.on('error', (err) => {
        sendUpdateStatus('error', err.message);
    });

    // Check for updates every 30 minutes
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 30 * 60 * 1000);

    // Initial check after a short delay
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 5000);
}

function sendUpdateStatus(status: string, info?: string, progress?: number): void {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', { status, info, progress });
    }
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

function setupIpcHandlers(): void {
    ipcMain.on('ping', () => console.log('pong'));

    // Receive VPS list from renderer to build tray menu
    ipcMain.on('vps-list-update', (_event, list: VpsEntry[]) => {
        vpsList = list.filter((v) => v.vps_status === 'active');
        updateTrayMenu();
    });

    // Auto-updater controls from renderer
    ipcMain.on('check-for-updates', () => {
        autoUpdater.checkForUpdates();
    });

    ipcMain.on('install-update', () => {
        isQuitting = true;
        autoUpdater.quitAndInstall();
    });
}

// ── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron');

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    setupIpcHandlers();
    createWindow();
    createTray();
    setupAutoUpdater();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
});

// On macOS, keep running; on other platforms, keep running in tray
app.on('window-all-closed', () => {
    // Don't quit - stay in tray
});

app.on('before-quit', () => {
    isQuitting = true;
});
