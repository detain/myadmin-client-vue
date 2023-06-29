<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores';

const siteStore = useSiteStore();
const { sidemenu } = storeToRefs(siteStore);

const admindir = ref('');
const menus = ref({
    main: [
        { link: '/', icon: 'fa fa-tachometer-alt', text: 'Dashboard' },
        { link: '/domains', icon: 'fa fa-globe', text: 'Domains' },
        { link: '/dns', icon: 'fa fa-atom', text: 'DNS Manager' },
        { link: '/vps', icon: 'fa fa-cloud-meatball', text: 'VPS' },
        { link: '/backups', icon: 'fa fa-warehouse', text: 'Storage' },
        { link: '/mail', icon: 'fa fa-envelope-open-text', text: 'Mail' },
        { link: '/licenses', icon: 'fa fa-id-card', text: 'Licenses' },
        { link: '/websites', icon: 'far fa-window-maximize', text: 'Webhosting' },
        { link: '/floating_ips', icon: 'fa fa-cloud-meatball', text: 'Floating IPs' },
        { link: '/qs', icon: 'fa fa-cloud', text: 'Rapid Deploy Servers' },
        { link: '/servers', icon: 'fa fa-server', text: 'Servers' },
        { link: '/affiliate', icon: 'fa fa-handshake', text: 'Affiliate System' },
        { link: '/tickets', icon: 'fa fa-ticket', text: 'Tickets' },
        { menu: 'billing', icon: 'fa fa-file-invoice', text: 'Billing', activecheck: ['cart', 'invoices', 'payment_types', 'prepays'] },
        { menu: 'settings', icon: 'fa fa-gear', text: 'Settings', activecheck: ['account/settings', 'account/username', 'account/pass'] },
    ],
    billing: [
        { link: '/cart', icon: 'far fa-circle', text: 'Cart' },
        { link: '/invoices', icon: 'far fa-circle', text: 'View Invoices' },
        { link: '/payment_types', icon: 'far fa-circle', text: 'Credit Cards' },
        { link: '/prepays', icon: 'far fa-circle', text: 'Pre-Paid Funds / Credit' },
    ],
    settings: [
        { link: '/account/settings', icon: 'far fa-circle', text: 'Account Settings' },
        { link: '/account/username', icon: 'far fa-circle', text: 'Change Login' },
        { link: '/account/pass', icon: 'far fa-circle', text: 'Change Password' },
    ],
});
const menu_names = ref(['main', 'billing', 'settings']);
const menu_images = ref({
    main: false,
    billing: true,
    settings: false,
});
const menu_orientation = ref('horizontal');
const menu_url_g = ref('');
const boxmenu = ref(true);
const prefix = ref('sidemenu');
const session_cookies = ref(true);
const ima = ref('client');
const fa = ref({
    admin: 'cogs',
    billing: 'cart-arrow-down',
    monitoring: 'heartbeat',
    products: 'basket',
    servers: 'server',
    support: 'life-ring',
    licenses: 'drivers-license',
    vps: 'tasks',
    backups: 'hdd-o',
    webhosting: 'sitemap',
    quickservers: 'server',
    ssl: 'key',
});
function isActive(key) {
    // You need to implement your translation logic here
    key.includes(this.menu_url_g);
}
</script>

<template>
    <ul class="nav nav-pills nav-sidebar flex-column nav-dark" :class="{ 'nav-justified': sidemenu }" data-widget="treeview" role="menu" data-accordion="false">
        <li v-for="(link, index) in menus.main" :key="index" :class="{ 'nav-item': true, 'has-treeview': typeof link.menu != 'undefined' && typeof menus[link.menu] != 'undefined', 'menu-open': Array.isArray(link) && isActive(link.activecheck) }">
            <router-link v-if="typeof link.link != 'undefined'" :to="link.link" class="nav-link" active-class="active">
                <i class="nav-icon" :class="link.icon"></i>
                <p>{{ link.text }}</p>
            </router-link>
            <a v-else-if="typeof link.menu != 'undefined' && typeof menus[link.menu] !== 'undefined'" href="#" class="nav-link" :class="{ active: isActive(link.activecheck) }">
                <i class="nav-icon" :class="link.icon"></i>
                <p>{{ link.text }}<i class="right fas fa-angle-left"></i></p>
            </a>
            <ul v-if="typeof link.menu != 'undefined' && typeof menus[link.menu] !== 'undefined'" class="nav nav-treeview" :class="{ 'menu-open': isActive(link.activecheck) }">
                <li v-for="(sublink, index) in menus[link.menu]" :key="index" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(sublink), 'menu-open': Array.isArray(sublink) && isActive(sublink.activecheck) }">
                    <a v-if="typeof sublink.menu != 'undefined'" href="#" class="nav-link" :class="{ active: isActive(sublink.activecheck) }" v-html="sublink[1]"></a>
                    <router-link v-else :to="sublink.link" class="nav-link" active-class="active">
                        <i class="nav-icon" :class="sublink.icon"></i>
                        <p>{{ sublink.text }}</p>
                    </router-link>
                    <ul v-if="Array.isArray(sublink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(sublink.activecheck) }">
                        <li v-for="(subsublink, index) in menus[sublink[0]]" :key="index" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(subsublink), 'menu-open': Array.isArray(subsublink) && isActive(subsublink.activecheck) }">
                            <a v-if="Array.isArray(subsublink)" href="#" class="nav-link" :class="{ active: isActive(subsublink.activecheck) }" v-html="subsublink[1]"></a>
                            <router-link v-else :to="subsublink.link" class="nav-link" active-class="active">
                                <i class="nav-icon" :class="subsublink.icon"></i>
                                <p>{{ subsubsublink.text }}</p>
                            </router-link>
                            <ul v-if="Array.isArray(subsublink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(subsublink.activecheck) }">
                                <li v-for="(subsubsublink, index) in menus[subsublink[0]]" :key="index" v-html="subsubsublink"></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style scoped></style>
