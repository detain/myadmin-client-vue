<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores/site.store';

const siteStore = useSiteStore();
const { sidemenu } = storeToRefs(siteStore);

interface MenuLink {
    link?: string;
    menu?: string;
    icon: string;
    text: string;
    activecheck?: string[];
}

interface MenuGroup {
    [key: string]: MenuLink[];
}

const menus = ref<MenuGroup>({
    main: [
        { link: '/', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
        { link: '/domains', icon: 'fas fa-globe', text: 'Domains' },
        { link: '/dns', icon: 'fas fa-atom', text: 'DNS Manager' },
        { link: '/vps', icon: 'fas fa-cloud-meatball', text: 'VPS' },
        { link: '/backups', icon: 'fas fa-warehouse', text: 'Storage' },
        { link: '/mail', icon: 'fas fa-envelope-open-text', text: 'Mail' },
        { link: '/licenses', icon: 'fas fa-id-card', text: 'Licenses' },
        { link: '/websites', icon: 'far fa-window-maximize', text: 'Webhosting' },
        { link: '/floating_ips', icon: 'fas fa-cloud-meatball', text: 'Floating IPs' },
        { link: '/scrub_ips', icon: 'fas fa-filter', text: 'Scrub IPs' },
        { link: '/qs', icon: 'fas fa-cloud', text: 'Rapid Deploy Servers' },
        { link: '/servers', icon: 'fas fa-server', text: 'Servers' },
        { link: '/affiliate', icon: 'fas fa-handshake', text: 'Affiliate System' },
        { link: '/tickets', icon: 'fas fa-ticket-alt', text: 'Tickets' },
        { menu: 'billing', icon: 'fas fa-file-invoice', text: 'Billing', activecheck: ['cart', 'invoices', 'payment_types', 'prepays'] },
        { menu: 'settings', icon: 'fas fa-cog', text: 'Settings', activecheck: ['account/settings', 'account/username', 'account/pass'] },
    ],
    billing: [
        { link: '/cart', icon: 'fas fa-shopping-cart', text: 'Cart' },
        { link: '/invoices', icon: 'fas fa-receipt', text: 'View Invoices' },
        { link: '/payment_types', icon: 'fas fa-credit-card', text: 'Credit Cards' },
        { link: '/prepays', icon: 'fas fa-cash-register', text: 'Pre-Paid Funds / Credit' },
    ],
    settings: [
        { link: '/account/settings', icon: 'fas fa-user-shield', text: 'Account Settings' },
        { link: '/account/username', icon: 'fas fa-user-edit', text: 'Change Login' },
        { link: '/account/pass', icon: 'fas fa-user-lock', text: 'Change Password' },
    ],
});

function isActive(key: string[] | undefined) {
    // You need to implement your translation logic here
    return typeof key != 'undefined' && key.includes(window.location.pathname.split('/')[1]);
}
</script>

<script lang="ts">
export default {
    name: 'MainMenu',
};
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
                <li v-for="(subLink, subIndex) in menus[link.menu]" :key="subIndex" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(subLink), 'menu-open': Array.isArray(subLink) && isActive(subLink.activecheck) }">
                    <a v-if="typeof subLink.menu != 'undefined'" href="#" class="nav-link" :class="{ active: isActive(subLink.activecheck) }" v-html="subLink.text"></a>
                    <router-link v-else-if="typeof subLink.link != 'undefined'" :to="subLink.link" class="nav-link" active-class="active">
                        <i class="nav-icon" :class="subLink.icon"></i>
                        <p>{{ subLink.text }}</p>
                    </router-link>
                    <ul v-if="Array.isArray(subLink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(subLink.activecheck) }">
                        <li v-for="(subSubLink, subSubIndex) in menus[subLink[0]]" :key="subSubIndex" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(subSubLink), 'menu-open': Array.isArray(subSubLink) && isActive(subSubLink.activecheck) }">
                            <a v-if="Array.isArray(subSubLink)" href="#" class="nav-link" :class="{ active: isActive(subSubLink.activecheck) }" v-html="subSubLink[1]"></a>
                            <router-link v-else-if="typeof subSubLink.link != 'undefined'" :to="subSubLink.link" class="nav-link" active-class="active">
                                <i class="nav-icon" :class="subSubLink.icon"></i>
                                <p>{{ subSubLink.text }}</p>
                            </router-link>
                            <ul v-if="Array.isArray(subSubLink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(subSubLink.activecheck) }">
                                <li v-for="(subSubSubLink, subSubSubIndex) in menus[subSubLink[0]]" :key="subSubSubIndex" v-html="subSubSubLink"></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style scoped></style>
