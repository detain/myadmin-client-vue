<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';
import type { HomeTicket, HomeTicketStatus, HomeTicketStatusView, HomeDetails, HomeServices, HomeResponse } from '@/types/ClientHome.ts';
const siteStore = useSiteStore();
const authStore = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(authStore);
const { data } = storeToRefs(accountStore);
siteStore.setPageHeading('Dashboard');
siteStore.setTitle('Dashboard');
siteStore.setBreadcrums([['', 'Home']]);
const baseUrl = siteStore.getBaseUrl();
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

const copyToClipboard = async (): Promise<void> => {
    const el = document.getElementById('affiliateinput');
    if (!el) return;
    const value = el.textContent?.trim();
    if (!value) return;
    // Preferred modern API
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }
};

onMounted(() => {
    //$('.column').sortable({ connectWith: '.column' });
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        // Handle ui-icon and glyphicon clicks
        const icon = target.closest<HTMLElement>('.portlet-header .ui-icon, .portlet-header .glyphicon');
        if (!icon) return;
        const portlet = icon.closest<HTMLElement>('.portlet');
        const content = portlet?.querySelector<HTMLElement>('.portlet-content');
        if (!content) return;
        // Toggle icon-specific classes
        if (icon.classList.contains('ui-icon')) {
            icon.classList.toggle('ui-icon-minusthick');
            icon.classList.toggle('ui-icon-plusthick');
        }
        if (icon.classList.contains('glyphicon')) {
            icon.classList.toggle('glyphicon-minus');
            icon.classList.toggle('glyphicon-plus');
        }
        // Toggle content visibility
        content.style.display = content.style.display === 'none' ? '' : 'none';
    });
    // One-time portlet initialization
    document.querySelectorAll<HTMLElement>('.portlet').forEach((portlet) => {
        portlet.classList.add('ui-widget', 'ui-widget-content', 'ui-helper-clearfix', 'ui-corner-all');
        const header = portlet.querySelector<HTMLElement>('.portlet-header');
        if (!header) return;
        header.classList.add('ui-widget-header', 'ui-corner-all');
        const icon = document.createElement('span');
        icon.className = 'float-right glyphicon glyphicon-minus';
        icon.setAttribute('aria-hidden', 'true');
        header.prepend(icon);
    });
    //$('.column').disableSelection();
});

const affiliateUrl = computed(() => user.value !== null && typeof user.value.account_id !== 'undefined' && user.value.account_id !== null ? `https://www.interserver.net/r/${user.value.account_id}` : '');

const loadHome = async () => {
    try {
        fetchWrapper.get(`${baseUrl}/home`).then((response: HomeResponse) => {
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
                            <p class="mb-2 mt-3 py-3" style="min-height: 3.5em">
                                <template v-if="balance"> <b>Prepay Remaining Balance:</b> {{ balance }} </template>
                            </p>
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
                                        <router-link v-if="typeof value.ex_links != 'undefined' && value?.ex_links[serviceId]" class="btn btn-sm btn-primary float-right" :to="'/' + moduleLink(module) + '/' + serviceId + '/login'">Control Panel</router-link>
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
                                        <a class="mx-2" :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(affiliateUrl) + '&amp;title=InterServer Web Hosting and VPS'" title="InterServer Web Hosting and VPS"><img class="social" alt="Share on Facebook" src="../assets/images/social_flat_rounded_rects_svg/Facebook.svg" /></a>
                                        <a class="mx-2" :href="'https://twitter.com/intent/tweet?source=' + encodeURIComponent(affiliateUrl) + '&amp;text=&quot;Write something here&quot; @interserver ' + encodeURIComponent(affiliateUrl)" title="Tweet"><img class="social" alt="Tweet" src="../assets/images/social_flat_rounded_rects_svg/Twitter.svg" /></a>
                                        <a class="mx-2" :href="'https://www.linkedin.com/shareArticle?mini=true&amp;url=' + encodeURIComponent(affiliateUrl) + '&amp;title=affiliate%20link%20' + encodeURIComponent(affiliateUrl) + '&amp;summary=Very happy with the web hosting service @interserver give them a try if you have a website ' + encodeURIComponent(affiliateUrl)" title="Share on LinkedIn"><img class="social" alt="Share on LinkedIn" src="../assets/images/social_flat_rounded_rects_svg/LinkedIn.svg" /></a>
                                        <a class="mx-2" :href="'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(affiliateUrl) + '&amp;media=test&amp;description=Very happy with the web hosting service @interserver give them a try if you have a website ' + encodeURIComponent(affiliateUrl)" title="Pin it"><img class="social" alt="Pin it" src="../assets/images/social_flat_rounded_rects_svg/Pinterest.svg" /></a>
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
/* @import '../assets/css/home_new.css';
@import '../assets/css/home.css'; */
</style>
