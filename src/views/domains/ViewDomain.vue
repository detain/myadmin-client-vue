<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useDomainStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Domain');
layoutStore.setBreadcrums({'/home': 'Home', '/domains': 'Domains'})
layoutStore.addBreadcrum('/domains/'+id, 'View Domain '+id);

const domainStore = useDomainStore();
const { loading, error, pkg, link_display, settings, serviceInfo, serviceTypes, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, csrf, contact_details, pwarning, transfer_info, errors, domain_logs, allInfo, registrarStatus, locked, whoisPrivacy, autoRenew } = storeToRefs(domainStore);

domainStore.getById(id)


</script>

<template>
    <div class="row my-4">
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p>{{ serviceType.services_name }}</p>
                    <p>Next Invoice Date: <b>{{ billingDetails.next_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer">{{ serviceInfo.domain_hostname }}</span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-success">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Billing</h3>
                    <p>
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                    <p>
                        Expire Date: <b>{{ allInfo.attributes.expiredate }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">Domain Status: <b>{{ serviceInfo.domain_status }}</b></span>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <div class="small-box bg-warning">
                <div class="inner text-white pb-2 px-3 mb-1">
                    <h3>Whois Privacy</h3>
                    <p style="padding-top: 1.3rem;padding-bottom: 1rem;">
                        Whois Privacy is: <b class="text-md">{{ whoisPrivacy }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-user-secret"></i>
                </div>
                <span class="small-box-footer">
                    Status: <b>{{ whoisPrivacy }}</b>
                    <a class="btn p-0 text-white text-sm pl-1" href="view_domain?id=592337&link=whois" title="Edit Whois Privacy Status"><i class="fa fa-pencil"></i>
                    </a>
                </span>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-link">&nbsp;</i> Links</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body py-5 text-center my-4" style="height: auto;">
                    <a v-for="clientLink in clientLinks" :key="clientLink.id" class="btn btn-app b-radius" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" :other-attr="clientLink.other_attr"><i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>{{ clientLink.label }}</a>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title pt-2"><i class="fas fa-globe">&nbsp;</i>Nameservers</h3>
                        <div class="card-tools float-right pt-1 pl-3">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="btn-group float-right">
                            <a class="btn btn-custom btn-sm" href="view_domain?id=592337&link=nameservers" title="Edit NameServers">
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                Edit </a>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0" style="height: 205px;">
                    <div class="row">
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                            <h5 class="nameserver_heading">Nameserver #<span class="nameserver_label">3</span></h5>
                        </div>
                        <div class="col-md-6 p-0">
                            <h5 class="nameserver_heading">{{ allInfo.attributes.nameserver_list[0].name }}</h5>
                            <h5 class="nameserver_heading">{{ allInfo.attributes.nameserver_list[1].name }}</h5>
                            <h5 class="nameserver_heading">{{ allInfo.attributes.nameserver_list[2].name }}</h5>
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
                        <div class="card-tools float-right pt-1 pl-3">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="btn-group float-right">
                            <a class="btn btn-custom btn-sm" href="view_domain?id=592337&link=contact" title="Edit Contact Information">
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                Edit </a>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-5" style="height: 250px;">
                    <p>
                        Name: Real Person <br>
                        Address: {{ serviceInfo.domain_address }}<br>
                        {{ serviceInfo.domain_city }}, {{ serviceInfo.domain_state }}<br>
                        {{ serviceInfo.domain_country }} - {{ serviceInfo.domain_zip }}<br>
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
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body" style="height:250px;margin: 0 auto;display: flex;align-items: center;">
                    <span class="text-secondary text-md">No domain log found.</span>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-2">
                <div class="card-header border-0">
                    <h3 class="card-title"><i class="fas fa-times">&nbsp;</i> Errors in Contact Info</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body" style="height:250px;margin: 0 auto;display: flex;align-items: center;">
                    <span class="text-success text-md">All good! no errors in Contact Information!</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>
