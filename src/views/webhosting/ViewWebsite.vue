<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useWebsiteStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Website');
layoutStore.setBreadcrums({'/home': 'Home', '/websites': 'Websites'})
layoutStore.addBreadcrum('/websites/'+id, 'View Website '+id);

const websiteStore = useWebsiteStore();
const { loading, error, pkg, link_display, settings, serviceInfo, clientLinks, admin_links, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables, csrf } = storeToRefs(websiteStore);

websiteStore.getById(id)



function isEmpty(table) {
  return table === null || table === undefined || table.length === 0;
}
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-2 m-0">{{ pkg }}</p>
                    <p>Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo.website_hostname }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="{
          'small-box': true,
          'bg-success': serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active',
          'bg-orange': serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended',
          'bg-danger': serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled',
          'bg-info': !(serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active' || serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended' || serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled')
        }">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Billing</h3>
                    <p class="py-3 my-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">
                    Billing Status is:
                    <b>{{ serviceInfo.website_status }}</b>
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Host Info</h3>
                    <p class="py-2 m-0">
                        Username:
                        <b>
                            <template v-if="!isEmpty(serviceInfo.website_username)">{{ serviceInfo.website_username }}</template>
                            <template v-else>Not set yet</template>
                        </b>
                    </p>
                    <p>
                        IP:
                        <b>
                            <template v-if="!isEmpty(serviceInfo.website_ip)">{{ serviceInfo.website_ip }}</template>
                            <template v-else>Not set yet</template>
                        </b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <span class="small-box-footer">
                    Server:
                    <b>
                        <template v-if="!isEmpty(serviceMaster.website_name)">{{ serviceMaster.website_name }}</template>
                        <template v-else>Not set yet</template>
                    </b>
                </span>
            </div>
        </div>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div class="col">
            {{ link_display }}
        </div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row mt-2">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-sign-in" aria-hidden="true">&nbsp;</i>&nbsp;{{ pkg }} Login</h3>
                        <div class="card-tools float-right">
                            <button class="btn btn-tool mt-0" type="button" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-bordered">
                                <tr>
                                    <th>Types:</th>
                                    <th>Links:</th>
                                </tr>
                                <template v-if="extraInfoTables.links && extraInfoTables.links.rows[0] && extraInfoTables.links.rows[0].value">
                                    <tr>
                                        <td>Manual Login</td>
                                        <td><a :href="extraInfoTables.links.rows[0].value" target="__blank" class="link">Click Here</a></td>
                                    </tr>
                                </template>
                                <tr v-if="clientLinks[3]">
                                    <td>Automatic Login</td>
                                    <td><a :href="clientLinks[3].link" target="__blank" class="link">Click Here</a></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-globe">&nbsp;</i>Default Nameservers
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <table class="table table-bordered">
                        <tr>
                            <th>Nameservers:</th>
                        </tr>
                        <template v-if="extraInfoTables.dns && extraInfoTables.dns.rows">
                            <tr v-for="nameserver in extraInfoTables.dns.rows">
                                <td>{{ nameserver.desc }}</td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.links" class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-link" aria-hidden="true">&nbsp;</i>External Links
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <table class="table table-bordered">
                        <tr>
                            <th>Names:</th>
                            <th>Links:</th>
                        </tr>
                        <tr v-for="link in extraInfoTables.links.rows" :key="link.value" v-if="link.desc !== 'CPanel' && link.desc !== 'Plesk Panel' && link.desc !== 'DirectAdmin Panel'">
                            <td>{{ link.desc }}</td>
                            <td><a :href="link.value" target="__blank" class="link">Click Here</a></td>
                        </tr>
                        <tr>
                            <td>Website Preview</td>
                            <td><a :href="extraInfoTables.preview.rows[0].value" target="__blank" class="link">Click Here</a></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row row-flex">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <a v-for="clientLink in clientLinks" :key="clientLink.id" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" :other-attr="clientLink.other_attr"><i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>{{ clientLink.label }}</a>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.addons" class="col-md-3">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-plus">&nbsp;</i>{{ extraInfoTables.addons.title }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <tr v-for="addon in extraInfoTables.addons.rows" :key="addon.id">
                            <td>{{ addon.desc }}</td>
                            <td>{{ addon.value }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>