<script setup>
import { ref } from 'vue'

const admindir = ref('')
const menus = ref({
    main: [
        '<a class="nav-link active" href="home" ><i class="nav-icon fa fa-tachometer-alt" ></i><p>Dashboard</p></a>',
        '<a class="nav-link " href="view_domains_list" ><i class="nav-icon fa fa-globe"></i><p>Domains</p></a>',
        '<a class="nav-link " href="dns_manager" ><i class="nav-icon fa fa-atom"></i><p>DNS Manager</p></a>',
        '<a class="nav-link " href="view_vps_list" ><i class="nav-icon fa fa-cloud-meatball"></i><p>VPS</p></a>',
        '<a class="nav-link " href="view_backups_list" ><i class="nav-icon fa fa-warehouse"></i><p>Storage</p></a>',
        '<a class="nav-link " href="view_mail_list" ><i class="nav-icon fa fa-envelope-open-text"></i><p>Mail</p></a>',
        '<a class="nav-link " href="view_licenses_list" ><i class="nav-icon fa fa-id-card"></i><p>Licenses</p></a>',
        ["ssl", "SSL <b class=\"caret\"></b>", "security-ssl.png", []],
        '<a class="nav-link " href="view_websites_list" ><i  class="nav-icon far fa-window-maximize" ></i><p>Webhosting</p></a>',
        ["quickservers", "Rapid Deploy Servers <b class=\"caret\"></b>", "server.png", []],
        '<a class="nav-link " href="view_quickservers_list" ><i class="nav-icon fa fa-cloud" ></i><p>Rapid Deploy Servers</p></a>',
        ["servers", "Servers <b class=\"caret\"></b>", "menus/servers.png", []],
        '<a class="nav-link " href="view_servers_list" ><i class="nav-icon fa fa-server" ></i><p>Servers</p></a>',
        '<a class="nav-link " href="affiliate" ><i class="nav-icon fa fa-handshake"></i><p>Affiliate System</p></a>',
        [
            "billing",
            '<i class="nav-icon fa fa-file-invoice"></i><p>Billing<i class="right fas fa-angle-left"></i></p>',
            ["cart", "view_invoices", "payment_types", "prepays"]
        ],
        '<a class="nav-link " href="tickets_list" ><i class="nav-icon fa fa-ticket" ></i><p>Tickets</p></a>',
        [
            "settings",
            '<i class="nav-icon fa fa-gear" ></i><p>Settings<i class="right fas fa-angle-left"></i></p>',
            ["account_settings", "change_username", "change_pass"]
        ]
    ],
    billing: [
        '<a class="nav-link " href="cart" ><i class="nav-icon far fa-circle"></i><p>Cart</p></a>',
        '<a class="nav-link " href="view_invoices" ><i class="nav-icon far fa-circle"></i><p>View Invoices</p></a>',
        '<a class="nav-link " href="payment_types" ><i class="nav-icon far fa-circle"></i><p>Credit Cards</p></a>',
        '<a class="nav-link " href="prepays" ><i class="nav-icon far fa-circle"></i><p>Pre-Paid Funds / Credit</p></a>',
        ["billingreports", "Reports <b class=\"caret\"></b>", "/images/myadmin/investment.png", []]
    ],
    settings: [
        '<a class="nav-link " href="account_settings" ><i class="nav-icon far fa-circle"></i><p>Account Settings</p></a>',
        '<a class="nav-link " href="change_username" ><i class="nav-icon far fa-circle"></i><p>Change Login</p></a>',
        '<a class="nav-link " href="change_pass" ><i class="nav-icon far fa-circle"></i><p>Change Password</p></a>'
    ]
});
const menu_names = ref(["main", "billing", "settings"])
const menu_images = ref({
    main: false,
    billing: true,
    settings: false
})
const menu_orientation = ref("horizontal")
const menu_url_g = ref("")
const boxmenu = ref(true)
const prefix = ref("sidemenu")
const session_cookies = ref(true)
const ima = ref("client")
const fa = ref({
    admin: "cogs",
    billing: "cart-arrow-down",
    monitoring: "heartbeat",
    products: "basket",
    servers: "server",
    support: "life-ring",
    licenses: "drivers-license",
    vps: "tasks",
    backups: "hdd-o",
    webhosting: "sitemap",
    quickservers: "server",
    ssl: "key"
})
function isActive(key) {
    // You need to implement your translation logic here
    key.includes(this.menu_url_g);
}
</script>

<template>
    <ul class="nav nav-pills nav-sidebar flex-column nav-dark" :class="{ 'nav-justified': sidemenu }" data-widget="treeview" role="menu" data-accordion="false">
        <li v-for="(link, index) in menus.main" :key="index" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(link), 'menu-open': Array.isArray(link) && isActive(link[2]) }">
            <a v-if="!Array.isArray(link)" href="#" class="nav-link" v-html="link"></a>
            <a v-else-if="typeof menus[link[0]] !== 'undefined'" href="#" class="nav-link" :class="{ active: isActive(link[2]) }" @click.prevent="toggleActive(link[2])" v-html="link[1]"></a>
            <ul v-if="Array.isArray(link) && typeof menus[link[0]] !== 'undefined'" class="nav nav-treeview" :class="{ 'menu-open': isActive(link[2]) }">
                <li v-for="(sublink, index) in menus[link[0]]" :key="index" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(sublink), 'menu-open': Array.isArray(sublink) && isActive(sublink[2]) }">
                    <a v-if="Array.isArray(sublink)" href="#" class="nav-link" :class="{ active: isActive(sublink[2]) }" @click.prevent="toggleActive(sublink[2])" v-html="sublink[1]"></a>
                    <a v-else href="#" class="nav-link" v-html="sublink"></a>
                    <ul v-if="Array.isArray(sublink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(sublink[2]) }">
                        <li v-for="(subsublink, index) in menus[sublink[0]]" :key="index" :class="{ 'nav-item': true, 'has-treeview': Array.isArray(subsublink), 'menu-open': Array.isArray(subsublink) && isActive(subsublink[2]) }">
                            <a v-if="Array.isArray(subsublink)" href="#" class="nav-link" :class="{ active: isActive(subsublink[2]) }" @click.prevent="toggleActive(subsublink[2])" v-html="subsublink[1]"></a>
                            <a v-else href="#" class="nav-link" v-html="subsublink"></a>
                            <ul v-if="Array.isArray(subsublink)" class="nav nav-treeview" :class="{ 'menu-open': isActive(subsublink[2]) }">
                                <li v-for="(subsubsublink, index) in menus[subsublink[0]]" :key="index" v-html="subsubsublink"></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style scoped>
</style>
