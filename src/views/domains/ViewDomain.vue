<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';
import { useI18n } from 'vue-i18n';

import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { useDomainStore } from '@/stores/domain.store';
import { useSiteStore } from '@/stores/site.store';

import Swal from 'sweetalert2';
import { useServiceLoading } from '@/helpers/useServiceLoading';
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import Contact from './Contact.vue';
import Dnssec from './Dnssec.vue';
import Nameservers from './Nameservers.vue';
import Renew from './Renew.vue';
import Transfer from './Transfer.vue';
import Whois from './Whois.vue';

const { t, d } = useI18n();
const module = 'domains';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => route.params.link);
const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module]);
const domainStore = useDomainStore();
const { loading, error, pkg, linkDisplay, serviceInfo, titleField, serviceTypes, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, contact_details, pwarning, transfer_info, errors, domain_logs, allInfo, registrarStatus, locked, whoisPrivacy, autoRenew } = storeToRefs(domainStore);
useServiceLoading(loading);

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.domains')],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, serviceInfo.value.domain_hostname);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(t('domains.view.pageTitle', { hostname: serviceInfo.value.domain_hostname }));
        siteStore.setTitle(t('domains.view.title', { hostname: serviceInfo.value.domain_hostname }));
    } else {
        siteStore.setPageHeading(t('domains.view.pageTitleWithLink', { id, link: ucwords(newLink.replace('_', ' ')) }));
        siteStore.setTitle(t('domains.view.pageTitleWithLink', { id, link: ucwords(newLink.replace('_', ' ')) }));
        siteStore.addBreadcrum(`/${moduleLink(module)}/${id}/${newLink}`, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: 'question',
                title: `<h3>${t('common.confirm.title')}</h3> `,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: t('common.confirm.yes'),
                html: t('domains.view.welcomeEmailConfirm'),
                preConfirm: async () => {
                    try {
                        await fetchWrapper.get(`/${moduleLink(module)}/${id}/welcome_email`);
                        Swal.fire({
                            icon: 'success',
                            title: `<h3>${t('domains.view.emailSent')}</h3> `,
                            showCancelButton: false,
                            confirmButtonText: t('common.confirm.yes'),
                            html: t('domains.view.welcomeEmailResent'),
                            preConfirm: () => {
                                router.push(`/${moduleLink(module)}/${id}`);
                            },
                        });
                    } catch (error: any) {
                        console.log('error', error);
                    }
                },
            });
        } else if (newLink == 'login') {
            // do something here
        }
    }
}

const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString.replace(' ', 'T')); // Ensure ISO-8601 compatibility
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

watch(
    [
        () => route.params.link as string | undefined,
        () => serviceInfo.value, // or domainStore.domain
    ],
    ([link, serviceInfo]) => {
        if (!link || !serviceInfo) return;

        loadLink(link);
    },
    { immediate: true }
);

domainStore.getById(id);
console.log('link:', link.value);
loadLink(route.params.link as string);
</script>

<template>
    <div class="row my-4">
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('domains.view.package') }}</h3>
                    <p>{{ serviceType.services_name }}</p>
                    <p>
                        <i18n-t keypath="domains.view.nextInvoiceDate" tag="span"><template #date><b>{{ formatDate(billingDetails.next_date) }}</b></template></i18n-t>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <span class="small-box-footer">{{ serviceInfo.domain_hostname }}</span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-success">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('domains.view.billing') }}</h3>
                    <p>
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        {{ t('domains.view.billedFrequency', { frequency: billingDetails.service_frequency }) }}
                    </p>
                    <p>
                        <i18n-t keypath="domains.view.expireDate" tag="span"><template #date><b>{{ allInfo.attributes && allInfo.attributes.expiredate ? formatDate(allInfo.attributes.expiredate) : formatDate(serviceInfo.domain_expire_date) }}</b></template></i18n-t>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-dollar-sign"></i></div>
                <span class="small-box-footer">
                    {{ t('domains.view.domainStatus', { status: serviceInfo.domain_status }) }}
                </span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-warning">
                <div class="inner mb-1 px-3 pb-2 text-white">
                    <h3>{{ t('domains.view.whoisPrivacy') }}</h3>
                    <p style="padding-top: 1.3rem; padding-bottom: 1rem">
                        <i18n-t keypath="domains.view.whoisPrivacyIs" tag="span"><template #status><b class="text-md">{{ whoisPrivacy }}</b></template></i18n-t>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-user-secret"></i></div>
                <span class="small-box-footer">
                    {{ t('common.labels.status') }}: <b>{{ whoisPrivacy }}</b>
                    <router-link class="btn p-0 pl-1 text-sm text-white" :to="'/' + moduleLink(module) + '/' + id + '/whois'" :title="t('domains.view.editWhoisPrivacy')"><i class="fas fa-pencil-alt"></i></router-link>
                </span>
            </div>
        </div>
    </div>
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'contact'" class="col">
            <Contact :id="id"></Contact>
        </div>
        <div v-else-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField"></Cancel>
        </div>
        <div v-else-if="link == 'dnssec'" class="col">
            <Dnssec :id="id"></Dnssec>
        </div>
        <div v-else-if="link == 'nameservers'" class="col">
            <Nameservers :id="id" :nameservers="allInfo.attributes?.nameserver_list"></Nameservers>
        </div>
        <div v-else-if="link == 'renew'" class="col">
            <Renew :id="id"></Renew>
        </div>
        <div v-else-if="link == 'transfer'" class="col">
            <Transfer :id="id"></Transfer>
        </div>
        <div v-else-if="link == 'whois'" class="col">
            <Whois :id="id" :hostname="serviceInfo.domain_hostname"></Whois>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <div v-else class="row">
        <div class="col-md-6">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-link"></i>&nbsp; {{ t('domains.view.links') }}</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body my-4 py-5 text-center" style="height: auto">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
                </div>
            </div>
        </div>
        <div v-if="allInfo.attributes" class="col-12 col-sm-6 col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title pt-2"><i class="fas fa-globe"></i>&nbsp;{{ t('domains.view.nameservers') }}</h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                        <div class="btn-group float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + id + '/nameservers'" class="btn btn-custom btn-sm" :title="t('domains.view.editNameservers')"> <i class="fas fa-pencil-alt" aria-hidden="true"></i>{{ t('common.buttons.edit') }} </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0" style="height: 205px">
                    <div class="row">
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">{{ t('domains.view.nameserverLabel', { number: 1 }) }}</h5>
                            <h5 class="nameserver_heading">{{ t('domains.view.nameserverLabel', { number: 2 }) }}</h5>
                            <h5 v-if="allInfo?.attributes?.nameserver_list[2]?.name" class="nameserver_heading">{{ t('domains.view.nameserverLabel', { number: 3 }) }}</h5>
                        </div>
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[0]?.name ?? '&nbsp;' }}</h5>
                            <h5 class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[1]?.name ?? '&nbsp;' }}</h5>
                            <h5 v-if="allInfo?.attributes?.nameserver_list[2]?.name" class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[2]?.name ?? '&nbsp;' }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!link" class="row my-2">
        <div class="col-12 col-sm-6 col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title pt-2"><i class="fas fa-id-card"></i>&nbsp;{{ t('domains.view.contactInformation') }}</h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                        <div class="btn-group float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + id + '/contact'" class="btn btn-custom btn-sm" :title="t('domains.view.editContactInformation')"> <i class="fas fa-pencil-alt" aria-hidden="true"></i>{{ t('common.buttons.edit') }} </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-5" style="height: 250px">
                    <p>
                        {{ t('domains.view.name') }} {{ serviceInfo.domain_firstname }} {{ serviceInfo.domain_lastname }} <br />
                        {{ t('domains.view.organization') }} {{ serviceInfo.domain_company }}<br />
                        {{ t('domains.view.address') }} {{ serviceInfo.domain_address }}<br />
                        {{ serviceInfo.domain_city }}, {{ serviceInfo.domain_state }}<br />
                        {{ serviceInfo.domain_country }} - {{ serviceInfo.domain_zip }}<br />
                        {{ t('domains.view.phone') }} <a :href="'tel:' + serviceInfo.domain_phone">{{ serviceInfo.domain_phone }}</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-newspaper"></i>&nbsp; {{ t('domains.view.domainRegistryLogs') }}</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body" style="height: 250px; margin: 0 auto; display: flex; align-items: center"><span class="text-secondary text-md">{{ t('domains.view.noDomainLogFound') }}</span></div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-times"></i>&nbsp; {{ t('domains.view.errorsInContactInfo') }}</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body" style="height: 250px; margin: 0 auto; display: flex; align-items: center"><span class="text-success text-md">{{ t('domains.view.allGoodNoErrors') }}</span></div>
            </div>
        </div>
    </div>
</template>
<style>
@import '../../assets/css/view_service.css';
</style>
