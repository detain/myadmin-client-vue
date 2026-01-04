import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
//import AutoImport from "unplugin-auto-import/vite";
//import i18nResources from "vite-plugin-i18n-resources"
//import checker from 'vite-plugin-checker';
//import * as path from 'path';
import { fileURLToPath, URL } from 'node:url';
//import fs from 'fs';
import inject from '@rollup/plugin-inject';
//import legacy from '@vitejs/plugin-legacy'
//import { VitePWA } from 'vite-plugin-pwa';
//import vueDevTools from 'vite-plugin-vue-devtools';
import Inspect from 'vite-plugin-inspect';
//import Inspector from 'vite-plugin-vue-inspector';
//import TurboConsole from 'unplugin-turbo-console/vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        dts({
            insertTypesEntry: true,
        }),
        // https://github.com/feat-agency/vite-plugin-webfont-dl#options
        //webfontDownload(),
        inject({
            jQuery: 'jquery',
        }),
        /*
        checker({
            vueTsc: true,
            typescript: false,
        }),
        TurboConsole(),
        i18nResources({
            path: resolve(__dirname, "src/locales"),
        }),
        AutoImport({
            imports: ["vue", "@vueuse/core"],
            resolvers: [],
            dirs: ["./composables/" + "**", "./views/" + "**"],
            vueTemplate: true,
            cache: true
        }),
        splitVendorChunkPlugin(),
*/
        /* legacy({ targets: ["defaults", "not IE 11"] }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }), */
        Inspect(),
        //Inspector(),
        //vueDevTools(),
        //        TurboConsole(),
    ],
    /*
    optimizeDeps: {
        disabled: false,
        include: ['jquery'],
    },
    */
    build: {
        sourcemap: false,
        rollupOptions: {
            preserveEntrySignatures: 'allow-extension',
            output: {
                preserveModules: false,
                validate: true,
                inlineDynamicImports: false,
                interop: 'compat', // "compat"| "auto"| "esModule"| "default"| "defaultOnly"
                format: 'es', // es | umd
                globals: {
                    jquery: '$',
                },
                generatedCode: {
                    preset: 'es2015', // es5 | es2015
                    constBindings: true,
                    arrowFunctions: true,
                },
                /*
                manualChunks: {
                    components: [ 'src/components/TheWelcome.vue', 'src/components/icons/IconTooling.vue', 'src/components/icons/IconEcosystem.vue', 'src/components/icons/IconDocumentation.vue', 'src/components/icons/IconCommunity.vue', 'src/components/icons/IconSupport.vue', 'src/components/account/SshKeys.vue', 'src/components/account/AccountFeatures.vue', 'src/components/account/IpLimits.vue', 'src/components/account/ApiAccess.vue', 'src/components/account/TwoFactorAuth.vue', 'src/components/account/LinkedAccounts.vue', 'src/components/services/Invoices.vue', 'src/components/services/Alert.vue', 'src/components/services/Cancel.vue', 'src/components/Alert.vue', 'src/components/HelloWorld.vue', 'src/components/Nav.vue', 'src/components/WelcomeItem.vue', 'src/components/MainMenu.vue', 'src/views/tickets/ViewTicket.vue', 'src/views/tickets/TicketsList.vue', 'src/views/tickets/NewTicket.vue', 'src/views/users/AddEdit.vue', 'src/views/users/List.vue', 'src/views/mail/OrderMail.vue', 'src/views/mail/MailList.vue', 'src/views/mail/Alerts.vue', 'src/views/mail/ViewMail.vue', 'src/views/mail/DenyRules.vue', 'src/views/account/ChangeUsername.vue', 'src/views/account/ChangePass.vue', 'src/views/account/AccountSettings.vue', 'src/views/account/ContactInfo.vue', 'src/views/Sudo.vue', ],
                    licdnswebback: [ 'src/views/licenses/LicensesList.vue', 'src/views/licenses/ChangeIp.vue', 'src/views/licenses/ViewLicense.vue', 'src/views/licenses/ChangeOs.vue', 'src/views/licenses/OrderLicense.vue', 'src/views/dns/DnsManager.vue', 'src/views/dns/DnsEditor.vue', 'src/views/LoginOld.vue', 'src/views/floating_ips/ViewFloatingIp.vue', 'src/views/floating_ips/FloatingIpsList.vue', 'src/views/floating_ips/OrderFloatingIp.vue', 'src/views/ClientHome.vue', 'src/views/domains/OrderDomain.vue', 'src/views/domains/ViewDomain.vue', 'src/views/domains/Contact.vue', 'src/views/domains/WhoisToggle.vue', 'src/views/domains/EppCode.vue', 'src/views/domains/Nameservers.vue', 'src/views/domains/DomainsList1.vue', 'src/views/domains/DomainsList2.vue', 'src/views/domains/DomainsList.vue', 'src/views/domains/Renew.vue', 'src/views/domains/Lock.vue', 'src/views/domains/Dnssec.vue', 'src/views/domains/Whois.vue', 'src/views/webhosting/BuyIp.vue', 'src/views/webhosting/DownloadBackups.vue', 'src/views/webhosting/ViewWebsite.vue', 'src/views/webhosting/Migration.vue', 'src/views/webhosting/WebsitesList.vue', 'src/views/webhosting/ReverseDns.vue', 'src/views/webhosting/OrderWebsite.vue', 'src/views/servers/ViewServer.vue', 'src/views/servers/ServersList.vue', 'src/views/servers/IpmiLive.vue', 'src/views/servers/ReverseDns.vue', 'src/views/servers/BandwidthGraph.vue', 'src/views/servers/OrderServer.vue', 'src/views/quickservers/ViewQs.vue', 'src/views/quickservers/QsList.vue', 'src/views/quickservers/OrderQs.vue', 'src/views/Login.vue', 'src/views/backups/BackupsList.vue', 'src/views/backups/ViewBackup.vue', 'src/views/backups/OrderBackup.vue' ],
                    billing: [ 'src/views/Register.vue', 'src/views/Home.vue', 'src/views/billing/PrePays.vue', 'src/views/billing/Pay.vue', 'src/views/billing/PaymentTypes.vue', 'src/views/billing/Cart.vue', 'src/views/billing/InvoicesList.vue', 'src/views/billing/affiliates/Tos.vue', 'src/views/billing/affiliates/Affiliate.vue', 'src/views/billing/affiliates/Layout.vue' ],
                    vpssslaffil: [ 'src/views/vps/InsertCd.vue', 'src/views/vps/Backups.vue', 'src/views/vps/ChangeTimezone.vue', 'src/views/vps/ChangeRootPassword.vue', 'src/views/vps/BuyIp.vue', 'src/views/vps/ViewVps.vue', 'src/views/vps/ChangeHostname.vue', 'src/views/vps/VpsList.vue', 'src/views/vps/TrafficUsage.vue', 'src/views/vps/ResetPassword.vue', 'src/views/vps/ReinstallOs.vue', 'src/views/vps/Vnc.vue', 'src/views/vps/ReverseDns.vue', 'src/views/vps/Slices.vue', 'src/views/vps/OrderVps.vue', 'src/views/vps/Backup.vue', 'src/views/vps/ChangeWebuzoPassword.vue', 'src/views/vps/BuyHdSpace.vue', 'src/views/vps/SetupVnc.vue', 'src/views/ssl/ViewSsl.vue', 'src/views/ssl/OrderSsl.vue', 'src/views/ssl/ChangeApproverEmail.vue', 'src/views/ssl/SslList.vue', 'src/views/billing/affiliates/SalesGraph.vue', 'src/views/billing/affiliates/ViewBanner.vue', 'src/views/billing/affiliates/RichReport.vue', 'src/views/billing/affiliates/PaymentSetup.vue', 'src/views/billing/affiliates/Status.vue', 'src/views/billing/affiliates/ViewBanners.vue', 'src/views/billing/affiliates/Faq.vue', 'src/views/billing/affiliates/DockSetup.vue', 'src/views/billing/affiliates/Signups.vue', 'src/views/billing/affiliates/WebTraffic.vue', 'src/views/billing/affiliates/TrafficGraph.vue' ],
                },
*/
            },
        },
        /*
        commonjsOptions: {
            include: [],
        },*/
    },
    /**/
    resolve: {
        alias: {
            //'@': path.resolve(__dirname, './src'),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        allowedHosts: true,
    },
});
