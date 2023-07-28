import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';
import inject from '@rollup/plugin-inject';
import { VitePWA } from 'vite-plugin-pwa';
import VueDevTools from 'vite-plugin-vue-devtools';
import Inspect from 'vite-plugin-inspect';
import Inspector from 'vite-plugin-vue-inspector';
import TurboConsole from "vite-plugin-turbo-console";

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        inject({
            jQuery: 'jquery',
        }),
        TurboConsole(),
        checker({
            vueTsc: false,
            typescript: false,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }),
        Inspect(),
        Inspector(),
        VueDevTools(),
    ],
    optimizeDeps: {
        disabled: false,
        include: ['jquery'],
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    accounts: [ './src/views/account/ContactInfo.vue', './src/views/account/AccountSettings.vue', './src/views/account/ChangePass.vue', './src/views/account/ChangeUsername.vue',  ],
                    backups: [ './src/views/backups/BackupsList.vue', './src/views/backups/ViewBackup.vue', './src/views/backups/OrderBackup.vue',  ],
                    dns: [ './src/views/dns/DnsManager.vue', './src/views/dns/DnsEditor.vue',  ],
                    domains: [ './src/views/domains/DomainsList.vue', './src/views/domains/ViewDomain.vue', './src/views/domains/OrderDomain.vue',  ],
                    floating_ips: [ './src/views/floating_ips/FloatingIpsList.vue', './src/views/floating_ips/ViewFloatingIp.vue', './src/views/floating_ips/OrderFloatingIp.vue',  ],
                    main: [ './src/views/ClientHome.vue', './src/views/Home.vue', './src/views/Login.vue', './src/views/LoginOld.vue', './src/views/Register.vue', './src/views/billing/PrePays.vue', './src/views/billing/PaymentTypes.vue', './src/views/billing/InvoicesList.vue', './src/views/billing/Cart.vue', './src/views/billing/Pay.vue',  ],
                    licenses: [ './src/views/licenses/LicensesList.vue', './src/views/licenses/ViewLicense.vue', './src/views/licenses/OrderLicense.vue',  ],
                    mail: [ './src/views/mail/MailList.vue', './src/views/mail/ViewMail.vue', './src/views/mail/OrderMail.vue',  ],
                    quickservers: [ './src/views/quickservers/QsList.vue', './src/views/quickservers/ViewQs.vue', './src/views/quickservers/OrderQs.vue',  ],
                    servers: [ './src/views/servers/ServersList.vue', './src/views/servers/ViewServer.vue', './src/views/servers/OrderServer.vue',  ],
                    ssl: [ './src/views/ssl/SslList.vue', './src/views/ssl/ViewSsl.vue', './src/views/ssl/OrderSsl.vue',  ],
                    tickets: [ './src/views/tickets/TicketsList.vue', './src/views/tickets/ViewTicket.vue', './src/views/tickets/NewTicket.vue',  ],
                    users: [ './src/views/users/List.vue', './src/views/users/AddEdit.vue',  ],
                    vps: [ './src/views/vps/VpsList.vue', './src/views/vps/ViewVps.vue', './src/views/vps/OrderVps.vue',  ],
                    webhosting: [ './src/views/webhosting/WebsitesList.vue', './src/views/webhosting/ViewWebsite.vue', './src/views/webhosting/OrderWebsite.vue',  ],
                    affiliates: [ './src/views/billing/affiliates/Affiliate.vue', './src/views/billing/affiliates/ViewBanners.vue', './src/views/billing/affiliates/DockSetup.vue', './src/views/billing/affiliates/Faq.vue', './src/views/billing/affiliates/Layout.vue', './src/views/billing/affiliates/PaymentSetup.vue', './src/views/billing/affiliates/RichReport.vue', './src/views/billing/affiliates/SalesGraph.vue', './src/views/billing/affiliates/Signups.vue', './src/views/billing/affiliates/Status.vue', './src/views/billing/affiliates/Tos.vue', './src/views/billing/affiliates/TrafficGraph.vue', './src/views/billing/affiliates/ViewBanner.vue', './src/views/billing/affiliates/WebTraffic.vue', ],
                    datatables: ['datatables.net-bs', 'datatables.net-bs4', 'datatables.net-dt', 'datatables.net-responsive-bs', 'datatables.net-responsive-bs4', 'datatables.net-select', 'datatables.net-select-bs', 'datatables.net-select-bs4', 'datatables.net-vue3'],
                    bootstrap: ['admin-lte', 'bootstrap', 'select2', 'sweetalert2', '@sweetalert2/theme-bootstrap-4', 'tempusdominus-bootstrap-4', 'jquery', 'jquery-simple-pass-meter', 'jquery-sortable', 'jquery-ui', 'vue', '@tanstack/vue-query', 'vue-recaptcha', 'vue-router', '@vueuse/core', 'pinia', 'vee-validate'],
                    chartjs: ['chart.js'],
                },
            },
        },
        commonjsOptions: {
            include: [],
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
