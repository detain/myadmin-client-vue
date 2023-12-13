<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { fetchWrapper, moduleLink } from '@/helpers';
import { storeToRefs } from 'pinia';
import { useAuthStore, useSiteStore, useAccountStore } from '@/stores';
const siteStore = useSiteStore();
const authStore = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(authStore);
const { data } = storeToRefs(accountStore)
siteStore.setPageHeading('Dashboard');
siteStore.setTitle('Dashboard');
siteStore.setBreadcrums([['', 'Home']]);
const baseUrl = siteStore.getBaseUrl();
import $ from 'jquery';
import jQuery from 'jquery';
const last_login_ip = ref('');
const last_login = ref('');
const currency = ref('');
const amount = ref('');
const invoice_list = ref('');
const balance = ref('');
const full_name = ref('');
const email = ref('');
const tickets = ref<HomeTicket[]>([]);
const ticketStatus = ref<HomeTicketStatus>({});
const ticketStatusView = ref<HomeTicketStatusView>({});
const details = ref<HomeDetails>({ modules: {} });
const services = ref<HomeServices>({});
const AFFILIATE_AMOUNT = ref('');

interface HomeResponse {
    last_login_ip: string;
    last_login: string;
    currency: string;
    amount: string;
    invoice_list: string;
    balance: string;
    full_name: string;
    email: string;
    tickets: HomeTicket[];
    data: any;
    ticketStatus: HomeTicketStatus;
    ticketStatusView: HomeTicketStatusView;
    details: HomeDetails;
    services: HomeServices;
    AFFILIATE_AMOUNT: string;
}

interface HomeDetails {
    modules: {
        [key: string]: {
            icon: string;
            view_link: string;
            heading: string;
            buy_link: string;
            list_link: string;
        };
    };
}

interface HomeTicket {
    ticketid: number;
    ticketstatusid: number;
    ticketmaskid: string;
    subject: string;
    lastreplier: string;
}

interface HomeTicketStatus {
    [key: string]: number;
}

interface HomeTicketStatusView {
    [key: number]: string;
}

interface HomeServices {
    [key: string]: HomeServices;
}

interface HomeService {
    links: {
        [key: number]: string;
    };
    count: number;
}

const copyToClipboard = () => {
    const value = (document.getElementById('affiliateinput') as HTMLElement).innerText;
    const $temp = document.createElement('input');
    document.body.appendChild($temp);
    $temp.value = value;
    $temp.select();
    document.execCommand('copy');
    document.body.removeChild($temp);
};

onMounted(() => {
    //$('.column').sortable({ connectWith: '.column' });
    $('.portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all').find('.portlet-header').addClass('ui-widget-header ui-corner-all').prepend('<span class="float-right glyphicon glyphicon-minus" aria-hidden="true"></span>').end().find('.portlet-content');
    $('.portlet-header .ui-icon').click(function () {
        $(this).toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
        $(this).parents('.portlet:first').find('.portlet-content').toggle();
    });
    $('.portlet-header .glyphicon').click(function () {
        $(this).toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');
        $(this).parents('.portlet:first').find('.portlet-content').toggle();
    });
    //$('.column').disableSelection();
});

const affiliateUrl = computed(() => {
    return user.value !== null && typeof user.value.account_id !== 'undefined' && user.value.account_id !== null ? 'https://www.interserver.net/r/' + user.value.account_id : '';
});

const loadHome = async () => {
    try {
        fetchWrapper.get(baseUrl + '/home').then((response: HomeResponse) => {
            console.log('api success');
            console.log(response);
            last_login_ip.value = response.last_login_ip;
            last_login.value = response.last_login;
            currency.value = response.currency;
            amount.value = response.amount;
            invoice_list.value = response.invoice_list;
            balance.value = response.balance;
            full_name.value = response.full_name;
            email.value = response.email;
            tickets.value = response.tickets;
            ticketStatus.value = response.ticketStatus;
            ticketStatusView.value = response.ticketStatusView;
            details.value = response.details;
            services.value = response.services;
            AFFILIATE_AMOUNT.value = response.AFFILIATE_AMOUNT;
        });
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadHome();
accountStore.load();
</script>

<template>
    <div class="row">
        <div class="col-md-12 mb-2">
            <div class="row">
                <div class="col-md-4">
                    <div class="small-box bg-yellow">
                        <div class="inner px-3 pb-2 pt-3 text-white">
                            <h3>Welcome, {{ full_name }}</h3>
                            <p class="mb-2 mt-3 py-3"><b>Last Login: </b>{{ last_login }}</p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-id-card"></i>
                        </div>
                        <div class="small-box-footer"><b>Last Login IP: </b>{{ last_login_ip }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-success">
                        <div class="inner px-3 pb-2 pt-3">
                            <h3>PrePay Balance</h3>
                            <p class="mb-2 mt-3 py-3" v-if="balance"><b>Prepay Remaining Balance: </b>{{ balance }}</p>
                        </div>
                        <div class="icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="small-box-footer">
                            <router-link to="/prepays" class="text-bold text-white" title="Manage Your PrePay Account"> Manage Account&nbsp;<i class="fa fa-pencil text-sm"></i> </router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-info">
                        <div class="inner px-3 pb-2 pt-3">
                            <h3>Unpaid Invoices</h3>
                            <div class="pt-2"><b>Total Unpaid Invoices: </b>{{ invoice_list }}</div>
                            <div class="mb-2 mt-2"><b>Total Amount To Be Paid: </b>{{ amount }}</div>
                        </div>
                        <div class="icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="small-box-footer">
                            <router-link to="/cart?invoice_days=-1" class="text-bold text-white" title="Pay Total Amount"> <i class="fa fa-dollar text-sm"></i>&nbsp;Pay Now </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-100 d-flex callpin mb-5 bg-white p-3">
                <i class="fas fa-key" style="font-size: 20px; padding: 5px"></i>
                <h5 style="position: relative; top: 5px; left: 10px">Call in Pin:</h5>
                <h5 style="position: relative; left: 15px; top: 5px; font-weight: bold; font-size: 20px">
                    {{ data.pin }}
                </h5>
            </div>
            <div v-if="tickets.length > 0" class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title float-left py-2"><i class="fa fa-ticket"></i>Recent Tickets</h3>
                                <div class="card-tools float-right">
                                    <router-link to="/tickets" class="btn btn-custom btn-sm" title="View All Tickets"> <i class="fa fa-eye"></i>&nbsp;&nbsp;View All&nbsp;&nbsp; </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table-bordered table-sm table text-center">
                                <thead>
                                    <tr>
                                        <th>Ticket ID</th>
                                        <th>Subject</th>
                                        <th>Last Replier</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="ticket in tickets" :key="ticket.ticketid">
                                        <td>{{ ticket.ticketmaskid }}</td>
                                        <td>{{ ticket.subject }}</td>
                                        <td>{{ ticket.lastreplier }}</td>
                                        <td>{{ ticketStatusView[ticket.ticketstatusid] }}</td>
                                        <td>
                                            <router-link class="btn btn-primary btn-sm" title="Edit Ticket" :to="'/tickets/' + ticket.ticketid"> <i class="fa fa-pencil"></i>&nbsp;Edit </router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div v-for="(value, module) in services" :key="module" class="col-md-4 b-radius mb-3 px-3">
                    <div class="card">
                        <div class="card-header home-card" style="background-color: rgba(0, 0, 0, 0.03) !important">
                            <h2 class="card-title mt-2 text-lg">
                                <i :class="'fa fa-' + details.modules[module].icon"></i>
                                <span>{{ details.modules[module].heading }}</span>
                            </h2>
                            <div class="card-tools float-right">
                                <span class="card-subtitle text-muted float-right mb-2 mt-2">
                                    <router-link class="badge bg-success float-right" title="View All" :to="'/' + moduleLink(module)">{{ value.count }}</router-link>
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <template v-if="Object.keys(value.links).length === 0">
                                    <li class="list-group-item">No Active Services</li>
                                </template>
                                <template v-else>
                                    <li v-for="(serviceDesc, serviceId) in value.links" :key="serviceId" class="list-group-item" style="overflow: clip; white-space: nowrap">
                                        <router-link :to="'/' + moduleLink(module) + '/' + serviceId">{{ serviceDesc }}</router-link>
                                    </li>
                                </template>
                                <li class="order-button m-3 text-center" style="list-style-type: none">
                                    <router-link :to="'/' + moduleLink(module) + '/order'" class="btn order">Order Now</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card card-navy mt-3" style="border-radius: 9px; transition-duration: 0.3s">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="d-flex aff-main">
                                        <div class="text-md aff-heading my-2">Earn {{ `$${AFFILIATE_AMOUNT}` }} Per Sale:</div>
                                        <div class="form-group aff-body"><input id="affiliateinput" type="text" class="form-control" placeholder="Affiliate URL" :value="affiliateUrl" /></div>
                                        <button id="copy_url" type="submit" class="btn btn-primary aff-btn" @click="copyToClipboard()">Copy to Clipboard</button>
                                    </div>
                                    <div class="aff-share m-2">
                                        <h4 class="aff-social mx-2">Share with:</h4>
                                        <a class="mx-2" :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(affiliateUrl) + '&amp;title=InterServer Web Hosting and VPS'" title="InterServer Web Hosting and VPS"><img class="social" alt="Share on Facebook" src="/images/social_flat_rounded_rects_svg/Facebook.svg" /></a>
                                        <a class="mx-2" :href="'https://twitter.com/intent/tweet?source=' + encodeURIComponent(affiliateUrl) + '&amp;text=&quot;Write something here&quot; @interserver ' + encodeURIComponent(affiliateUrl)" title="Tweet"><img class="social" alt="Tweet" src="/images/social_flat_rounded_rects_svg/Twitter.svg" /></a>
                                        <a class="mx-2" :href="'https://www.linkedin.com/shareArticle?mini=true&amp;url=' + encodeURIComponent(affiliateUrl) + '&amp;title=affiliate%20link%20' + encodeURIComponent(affiliateUrl) + '&amp;summary=Very happy with the web hosting service @interserver give them a try if you have a website ' + encodeURIComponent(affiliateUrl)" title="Share on LinkedIn"><img class="social" alt="Share on LinkedIn" src="/images/social_flat_rounded_rects_svg/LinkedIn.svg" /></a>
                                        <a class="mx-2" :href="'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(affiliateUrl) + '&amp;media=test&amp;description=Very happy with the web hosting service @interserver give them a try if you have a website ' + encodeURIComponent(affiliateUrl)" title="Pin it"><img class="social" alt="Pin it" src="/images/social_flat_rounded_rects_svg/Pinterest.svg" /></a>
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
/* @import '/css/home_new.css';
@import '/css/home.css'; */
</style>
