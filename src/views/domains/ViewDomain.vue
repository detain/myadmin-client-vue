<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, ucwords } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { useDomainStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import { Contact, Dnssec, Nameservers, Renew, Whois } from '@/views/domains';

const module = 'domains';
const siteStore = useSiteStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => { return route.params.link; });
const { modules } = storeToRefs(siteStore);
const settings = computed(() => { return modules.value[module]; });
const domainStore = useDomainStore();
const { loading, error, pkg, linkDisplay, serviceInfo, serviceTypes, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, contact_details, pwarning, transfer_info, errors, domain_logs, allInfo, registrarStatus, locked, whoisPrivacy, autoRenew } = storeToRefs(domainStore);

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums({ '/home': 'Home', '/domains': 'Domains' });
    siteStore.addBreadcrum('/domains/' + id, 'View Domain ' + id);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading('View Domain ' + id);
        siteStore.setTitle('View Domain ' + id);
    } else {
        siteStore.setPageHeading('Domain ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.setTitle('Domain ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.addBreadcrum('/domains/' + id + '/' + newLink, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'login') {
		// do something here
        }
    }
}

watch(
    () => route.params.link as string,
    (newLink) => {
        loadLink(newLink);
    }
);

loadLink(route.params.link as string);

domainStore.getById(id as string);
console.log('link:');
console.log(link.value);
</script>

<template>
    <div class="row my-4">
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p>{{ serviceType.services_name }}</p>
                    <p>
                        Next Invoice Date: <b>{{ billingDetails.next_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer">{{ serviceInfo.domain_hostname }}</span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-success">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Billing</h3>
                    <p>
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                    <p>
                        Expire Date: <b>{{ allInfo.attributes && allInfo.attributes.expiredate ? allInfo.attributes.expiredate : serviceInfo.domain_expire_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">
                    Domain Status: <b>{{ serviceInfo.domain_status }}</b>
                </span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-warning">
                <div class="inner mb-1 px-3 pb-2 text-white">
                    <h3>Whois Privacy</h3>
                    <p style="padding-top: 1.3rem; padding-bottom: 1rem">
                        Whois Privacy is: <b class="text-md">{{ whoisPrivacy }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-user-secret"></i>
                </div>
                <span class="small-box-footer">
                    Status: <b>{{ whoisPrivacy }}</b>
                    <router-link class="btn p-0 pl-1 text-sm text-white" :to="'/domains/' + id + '/whois'" title="Edit Whois Privacy Status"><i class="fa fa-pencil"></i></router-link>
                </span>
            </div>
        </div>
    </div>
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'contact'" class="col">
            <Contact :id="id"></Contact>
        </div>
        <div v-else-if="link == 'dnssec'" class="col">
            <Dnssec :id="id"></Dnssec>
        </div>
        <div v-else-if="link == 'nameservers'" class="col">
            <Nameservers :id="id"></Nameservers>
        </div>
        <div v-else-if="link == 'renew'" class="col">
            <Renew :id="id"></Renew>
        </div>
        <div v-else-if="link == 'whois'" class="col">
            <Whois :id="id"></Whois>
        </div>
        <div v-else class="col">{{ linkDisplay }}</div>
    </div>
    <div v-else class="row">
        <div class="col-md-6">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-link">&nbsp;</i> Links</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body my-4 py-5 text-center" style="height: auto">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/domains/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
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
                        <h3 class="card-title pt-2"><i class="fas fa-globe">&nbsp;</i>Nameservers</h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                        <div class="btn-group float-right">
                            <router-link :to="'/domains/' + id + '/nameservers'" class="btn btn-custom btn-sm" title="Edit NameServers"> <i class="fa fa-pencil" aria-hidden="true"></i>Edit </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0" style="height: 205px">
                    <div class="row">
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                        </div>
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[0]?.name ?? '&nbsp;' }}</h5>
                            <h5 class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[1]?.name ?? '&nbsp;' }}</h5>
                            <h5 class="nameserver_heading">{{ allInfo?.attributes?.nameserver_list[2]?.name ?? '&nbsp;' }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row my-2">
        <div class="col-12 col-sm-6 col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title pt-2"><i class="fas fa-id-card">&nbsp;</i>Contact Information</h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                        <div class="btn-group float-right">
                            <router-link :to="'/domains/' + id + '/contact'" class="btn btn-custom btn-sm" title="Edit Contact Information"> <i class="fa fa-pencil" aria-hidden="true"></i>Edit </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-5" style="height: 250px">
                    <p>
                        Name: Real Person <br />
                        Address: {{ serviceInfo.domain_address }}<br />
                        {{ serviceInfo.domain_city }}, {{ serviceInfo.domain_state }}<br />
                        {{ serviceInfo.domain_country }} - {{ serviceInfo.domain_zip }}<br />
                        Ph: <a @href="'tel:' + serviceInfo.domain_address">{{ serviceInfo.domain_phone }}</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-newspaper">&nbsp;</i> Domain Registry logs</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body" style="height: 250px; margin: 0 auto; display: flex; align-items: center">
                    <span class="text-secondary text-md">No domain log found.</span>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-times">&nbsp;</i> Errors in Contact Info</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body" style="height: 250px; margin: 0 auto; display: flex; align-items: center">
                    <span class="text-success text-md">All good! no errors in Contact Information!</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
