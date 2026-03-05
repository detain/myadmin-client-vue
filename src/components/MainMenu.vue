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
        { link: '/', icon: 'fa fa-tachometer-alt', text: 'Dashboard' },
        { link: '/domains', icon: 'fa fa-globe', text: 'Domains' },
        { link: '/dns', icon: 'fa fa-atom', text: 'DNS Manager' },
        { link: '/vps', icon: 'fa fa-cloud-meatball', text: 'VPS' },
        { link: '/backups', icon: 'fa fa-warehouse', text: 'Storage' },
        { link: '/mail', icon: 'fa fa-envelope-open-text', text: 'Mail' },
        { link: '/licenses', icon: 'fa fa-id-card', text: 'Licenses' },
        { link: '/websites', icon: 'far fa-window-maximize', text: 'Webhosting' },
        { link: '/floating_ips', icon: 'fa fa-cloud-meatball', text: 'Floating IPs' },
        { link: '/scrub_ips', icon: 'fa fa-filter', text: 'Scrub IPs' },
        { link: '/qs', icon: 'fa fa-cloud', text: 'Rapid Deploy Servers' },
        { link: '/servers', icon: 'fa fa-server', text: 'Servers' },
        { link: '/affiliate', icon: 'fa fa-handshake', text: 'Affiliate System' },
        { link: '/tickets', icon: 'fa fa-ticket', text: 'Tickets' },
        { menu: 'billing', icon: 'fa fa-file-invoice', text: 'Billing', activecheck: ['cart', 'invoices', 'payment_types', 'prepays'] },
        { menu: 'settings', icon: 'fa fa-cog', text: 'Settings', activecheck: ['account/settings', 'account/username', 'account/pass'] },
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
