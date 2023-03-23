<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores';
import { fetchWrapper } from '@/helpers';
const authStore = useAuthStore();
const state = reactive({
    last_login_ip: ref("70.44.33.193"),
    last_login: ref("12:35:pm - 21 Feb, 2023"),
    currency: ref("$"),
    amount: ref("$1,862.37"),
    invoice_list: ref(25),
    balance: ref("$6.60"),
    full_name: ref("Joe"),
    email: ref("email@user.net"),
    data: ref({}),
    tickets: ref([]),
    affiliateUrl: ref("https://www.interserver.net/r/2773"),
    pin: ref("8675309"),
    affiliateAmount: ref("100"),
    services: ref({
        domains: {
            links: {},
            count: 0
        },
        webhosting: {
            links: {},
            count: 0
        },
        vps: {
            links: {},
            count: 0
        },
        licenses: {
            links: {},
            count: 0
        },
        servers: {
            links: {},
            count: 0
        },
        backups: {
            links: [],
            count_link: '<span class="badge bg-danger float-right">0</span>',
            count: 0
        }
    }),
    ticket_Status: ref({
        Open: 4,
        "On Hold": 5
    }),
    ticketStatusView: ref({
        4: "Open",
        5: "On Hold",
        6: "Closed"
    }),
    details: ref({
        modules: {
            domains: {
                icon: "globe",
                view_link: "view_domain",
                heading: "Domains",
                buy_link: "domain_order",
                list_link: "view_domains_list"
            },
            webhosting: {
                icon: "window-maximize",
                view_link: "view_website",
                heading: "Web Hosting",
                buy_link: "order_website",
                list_link: "view_websites_list"
            },
            vps: {
                icon: "cloud-meatball",
                view_link: "view_vps",
                heading: "VPS",
                buy_link: "order_vps",
                list_link: "view_vps_list"
            },
            licenses: {
                icon: "id-card",
                view_link: "view_license",
                heading: "Licenses",
                buy_link: "order_license",
                list_link: "view_licenses_list"
            },
            backups: {
                icon: "warehouse",
                view_link: "view_backup",
                heading: "Storages",
                buy_link: "order_storage",
                list_link: "view_backups_list"
            },
            servers: {
                icon: "server",
                view_link: "view_server",
                heading: "Dedicated Servers",
                buy_link: "order_server",
                list_link: "view_servers_list"
            },
            quickservers: {
                icon: "database",
                view_link: "view_qs",
                heading: "Quick Servers",
                buy_link: "order_quickserver",
                list_link: "view_quickservers_list"
            }
        }
    }),
});
const loadHome = async (state) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/home');
        console.log('api success');
        console.log(response);
        state.data = response.data;
        state.last_login_ip = response.last_login_ip;
        state.last_login = response.last_login;
        state.currency = response.currency;
        state.amount = response.amount;
        state.invoice_list = response.invoice_list;
        state.balance = response.balance;
        state.full_name = response.full_name;
        state.email = response.email;
        state.tickets = response.tickets;
        state.ticket_Status = response.ticket_Status;
        state.ticketStatusView = response.ticketStatusView;
        state.details = response.details;
        state.services = response.services;
        state.affiliateUrl = response.affiliateUrl;
        state.pin = response.data.pin;
        state.affiliateAmount = response.AFFILIATE_AMOUNT;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};
function $t(key) {
    // You need to implement your translation logic here
    return key;
}
//if (authStore.user) {
    //await loadHome(state)
    loadHome(state)
//}
</script>

<template>
    <div class="row">
        <div class="col-md-12 mb-2">
            <div class="row">
                <div class="col-md-4">
                    <div class="small-box bg-yellow">
                        <div class="inner pt-3 pb-2 px-3 text-white">
                            <h3>{{ $t('Welcome, ') }}{{ state.full_name }}</h3>
                            <p class="py-3 mt-3 mb-2">
                                <b>{{ $t('Last Login: ') }}</b>{{ state.last_login }}
                            </p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-id-card"></i>
                        </div>
                        <div class="small-box-footer">
                            <b>{{ $t('Last Login IP: ') }}</b>{{ state.last_login_ip }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-success">
                        <div class="inner pt-3 pb-2 px-3">
                            <h3>{{ $t('PrePay Balance') }}</h3>
                            <p class="py-3 mt-3 mb-2" v-if="state.balance">
                                <b>{{ $t('Prepay Remaining Balance: ') }}</b>{{ state.balance }}
                            </p>
                        </div>
                        <div class="icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="small-box-footer">
                            <a href="/prepays" class="text-bold text-white" data-toggle="tooltip" title="{{ $t('Manage Your PrePay Account') }}">
                                {{ $t('Manage Account') }}&nbsp;<i class="fa fa-pencil text-sm"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-info">
                        <div class="inner pt-3 pb-2 px-3">
                            <h3>{{ $t('Unpaid Invoices') }}</h3>
                            <div class="pt-2">
                                <b>{{ $t('Total Unpaid Invoices: ') }}</b>{{ state.invoice_list }}
                            </div>
                            <div class="mb-2 mt-2">
                                <b>{{ $t('Total Amount To Be Paid: ') }}</b>{{ state.amount }}
                            </div>
                        </div>
                        <div class="icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="small-box-footer">
                            <a href="/cart?invoice_days=-1" class="text-bold text-white" data-toggle="tooltip" title="{{ $t('Pay Total Amount') }}">
                                <i class="fa fa-dollar text-sm"></i>&nbsp;{{ $t('Pay Now') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-100 d-flex bg-white p-3 mb-5 callpin">
                <i class="fas fa-key" style="font-size: 20px; padding: 5px;"></i>
                <h5 style="position: relative; top: 5px; left: 10px;">{{ $t('Call in Pin:') }}</h5>
                <h5 style="position: relative; left: 15px; top: 5px; font-weight: bold; font-size: 20px;">
                    {{ state.pin }}
                </h5>
            </div>
            <div v-if="state.tickets.length > 0" class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2 float-left">
                                    <i class="fa fa-ticket"></i>{{ $t('Recent Tickets') }}
                                </h3>
                                <div class="card-tools float-right">
                                    <a href="/tickets_list" class="btn btn-custom btn-sm" data-toggle="tooltip" title="{{ $t('View All Tickets') }}">
                                        <i class="fa fa-eye"></i>&nbsp;&nbsp;{{ $t('View All') }}&nbsp;&nbsp;
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-sm text-center">
                                <thead>
                                    <tr>
                                        <th>{{ $t('Ticket ID') }}</th>
                                        <th>{{ $t('Subject') }}</th>
                                        <th>{{ $t('Last Replier') }}</th>
                                        <th>{{ $t('Status') }}</th>
                                        <th>{{ $t('Action') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="ticket in state.tickets" :key="ticket.ticketid">
                                        <td>{{ ticket.ticketmaskid }}</td>
                                        <td>{{ ticket.subject }}</td>
                                        <td>{{ ticket.lastreplier }}</td>
                                        <td>{{ state.ticketStatusView[ticket.ticketstatusid] }}</td>
                                        <td>
                                            <a class="btn btn-primary btn-sm" data-toggle="tooltip" title="{{ $t('Edit Ticket') }}" :href="'/view_ticket?ticket=' + ticket.ticketid">
                                                <i class="fa fa-pencil"></i>&nbsp;{{ $t('Edit') }}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div v-for="(value, module) in state.services" :key="module" class="col-md-4 px-3 mb-3 b-radius">
                    <div class="card">
                        <div class="card-header home-card" style="background-color: rgba(0,0,0,.03) !important;">
                            <h2 class="card-title mt-2 text-lg">
                                <i :class="'fa fa-' + state.details.modules[module].icon"></i>
                                <span>{{ state.details.modules[module].heading }}</span>
                            </h2>
                            <div class="card-tools float-right">
                                <span class="card-subtitle mb-2 text-muted float-right mt-2">
                                    <a class="badge bg-success float-right" data-toggle="tooltip" title="View All" :href="state.details.modules[module].list_link">{{ value.count }}</a>
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <template v-if="value.links.length === 0">
                                    <li class="list-group-item">{{ $t('No Active Services') }}</li>
                                </template>
                                <template v-else>
                                    <li v-for="(serviceDesc, serviceId) in value.links" :key="serviceId" class="list-group-item" style="overflow: clip; white-space: nowrap;">
                                        <a :href="state.details.modules[module].view_link + '?id=' + serviceId">{{ serviceDesc }}</a>
                                    </li>
                                </template>
                                <li class="m-3 text-center order-button" style="list-style-type:none;">
                                    <a :href="state.details.modules[module].buy_link" class="btn order">{{ $t('Order Now') }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card card-navy mt-3" style="border-radius: 9px;transition-duration: 0.3s;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="d-flex aff-main">
                                        <div class="text-md my-2 aff-heading">{{ $t("Earn") }} {{ `$${state.affiliateAmount}` }} {{ $t("Per Sale:") }}</div>
                                        <div class="form-group aff-body"><input id="affiliateinput" type="text" class="form-control" placeholder="Affiliate URL" :value="state.affiliateUrl"></div>
                                        <button id="copy_url" type="submit" class="btn btn-primary aff-btn" @click="copyToClipboard">{{ $t("Copy to Clipboard") }}</button>
                                    </div>
                                    <div class="m-2 aff-share">
                                        <h4 class="mx-2 aff-social">{{ $t("Share with:") }}</h4>
                                        <a class="mx-2" href="https://www.facebook.com/sharer/sharer.php?u={{ socialMediaUrl }}&amp;title=InterServer Web Hosting and VPS" title="InterServer Web Hosting and VPS" @click.prevent="shareOnFacebook"><img class="social" alt="Share on Facebook" src="//mystage.interserver.net/images/social_flat_rounded_rects_svg/Facebook.svg"></a>
                                        <a class="mx-2" href="https://twitter.com/intent/tweet?source=https%3A%2F%2Finterserver.net&amp;text=&quot;Write something here&quot; @interserver {{ socialMediaUrl }}&amp;" @click.prevent="shareOnTwitter" title="Tweet"><img class="social" alt="Tweet" src="//mystage.interserver.net/images/social_flat_rounded_rects_svg/Twitter.svg"></a>
                                        <a class="mx-2" href="http://www.linkedin.com/shareArticle?mini=true&amp;url={{ socialMediaUrl }}&amp;title=affiliate%20link%20{{ socialMediaUrl }}&amp;summary=Very happy with the web hosting service @interserver give them a try if you have a website {{ socialMediaUrl }}" @click.prevent="shareOnLinkedIn" title="Share on LinkedIn"><img class="social" alt="Share on LinkedIn" src="//mystage.interserver.net/images/social_flat_rounded_rects_svg/LinkedIn.svg"></a>
                                        <a class="mx-2" href="http://pinterest.com/pin/create/button/?url={{ socialMediaUrl }}&amp;media=test&amp;description=Very happy with the web hosting service @interserver give them a try if you have a website {{ socialMediaUrl }}" @click.prevent="shareOnPinterest" title="Pin it"><img class="social" alt="Pin it" src="//mystage.interserver.net/images/social_flat_rounded_rects_svg/Pinterest.svg"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
