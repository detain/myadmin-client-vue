<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '../../../stores/site.store';

import $ from 'jquery';
import Swal from 'sweetalert2';
//import DataTable from 'datatables.net';
//import 'datatables.net-bs4';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate System');
siteStore.setTitle('Affiliate System');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Affiliate'],
]);
const myUrl = 'https://my.interserver.net';
const body = ref('');
const custid = ref();
const affiliate_amount = ref(0);

onMounted(() => {
    $('.export').click(function (e) {
        e.preventDefault();
        document.location.href = $(this).attr('href') as string;
    });
    $('#copy_url').click(function () {
        const copyText = $('#affiliateinput');
        copyText.select();
        document.execCommand('copy');
        Swal.fire({
            icon: 'success',
            title: 'Copied to clipboard.',
        });
    });
    //$.fn.dataTable.render.moment( 'HH:mm MMM D, YY' );
    /*let table_default = new DataTable('#table_default', {
        ajax: myUrl+'ajax.php?choice=affiliates_clientside&st=default',
        order: [[3, 'desc']],
        pageLength: 25,
        lengthMenu: [
            [10, 25, 50, 100, 500, -1],
            [10, 25, 50, 100, 500, 'All'],
        ],
    });
    let table_pending = new DataTable('#table_pending', {
        ajax: myUrl+'ajax.php?choice=affiliates_clientside&st=pending',
        pageLength: 50,
        order: [[3, 'desc']],
        lengthMenu: [
            [10, 25, 50, 100, 500, -1],
            [10, 25, 50, 100, 500, 'All'],
        ],
    });
    let table_paid = new DataTable('#table_paid', {
        ajax: myUrl+'ajax.php?choice=affiliates_clientside&st=paid',
        order: [[3, 'desc']],
        pageLength: 50,
        lengthMenu: [
            [10, 25, 50, 100, 500, -1],
            [10, 25, 50, 100, 500, 'All'],
        ],
    });
    let table_failed = new DataTable('#table_failed', {
        ajax: myUrl+'ajax.php?choice=affiliates_clientside&st=failed',
        order: [[3, 'desc']],
        pageLength: 50,
        lengthMenu: [
            [10, 25, 50, 100, 500, -1],
            [10, 25, 50, 100, 500, 'All'],
        ],
    });
    const tables = ['table_default', 'table_pending', 'table_paid', 'table_failed'];
    for (let j = tables.length - 1; j >= 0; j--) {
        $('#'+tables[j]+' thead tr')
            .clone(true)
            .appendTo('#'+tables[j]+' thead');
        $('#'+tables[j]+' thead tr:eq(1) td').each(function (i) {
            $(this).removeAttr('class aria-controls aria-label rowspan colspan style');
            const title = $(this).text();
            $(this).html('<input type="text" placeholder="Search" style="width:100%"/>');
            $('input', this).on('keyup change', function (event, value) {
                const table_name = $(this).parents('table').attr('id');
                if (table_name === 'table_default' && table_default.column(i).search() !== value) {
                    table_default.column(i).search(value).draw();
                } else if (table_name === 'table_pending') {
                    table_pending.column(i).search(value).draw();
                } else if (table_name === 'table_paid') {
                    table_paid.column(i).search(value).draw();
                } else if (table_name === 'table_failed') {
                    table_failed.column(i).search(value).draw();
                }
            });
        });
    }
    */
});
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col">
            <template v-if="body">
                <div v-html="body"></div>
            </template>
            <template v-else>
                <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                    <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Attention:</b>&nbsp;This affiliate program is not intended for referral of “family members” or “clients” please read <router-link class="link" :to="'/affiliate/faq'">FAQ</router-link> before proceeding.</p>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                    </div>
                    <p></p>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h3 class="card-title py-2">
                                        <i class="fa fa-money" aria-hidden="true">&nbsp;</i> Earn <b>{{ '$' + affiliate_amount }}</b> per new customer sale!
                                    </h3>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <p>
                                    By adding a link to Interserver on your website you will get <b class="text-success">{{ '$' + affiliate_amount }}</b> commission on each new sale we get that results from clicking the link on your website. <a href="https://www.interserver.net/affiliate.html" target="__blank" class="link">Know More</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h3 class="card-title py-2"><i class="fa fa-external-link" aria-hidden="true">&nbsp;</i>Affiliate URL</h3>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body mb-2 pb-4 text-center">
                                <form class="form-inline">
                                    <div class="form-group w-50 mr-2">
                                        <input id="affiliateinput" type="text" class="form-control form-control-sm w-100" placeholder="Affiliate URL" :value="'https://www.interserver.net/r/' + custid" />
                                        <span class="text-muted text-xs">Share your unique affiliate URL with friends</span>
                                    </div>
                                    <button id="copy_url" type="submit" class="btn btn-custom btn-sm mb-3">Copy to Clipboard</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h3 class="card-title py-2"><i class="fa fa-link" aria-hidden="true">&nbsp;</i>Links</h3>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/sales_graph'" title="Sales Graph"><i class="fa fa-line-chart" aria-hidden="true"></i>Sales Graph</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/traffic_graph'" title="Web Traffic Graph"><i class="fa fa-line-chart" aria-hidden="true"></i>Web Traffic Graph</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/banners'" title="View Banners & Links"><i class="fa fa-picture-o" aria-hidden="true"></i>View Banners & Links</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/landing_pg'" title="Setup Landing page & Coupons"><i class="fa fa-ticket" aria-hidden="true"></i>Setup Landing page & Coupons</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/payment_setup'" title="Setup Payment Method"><i class="fa fa-money" aria-hidden="true"></i>Setup Payment Method</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/rich_report'" title="Rich Report"><i class="fa fa-file-text-o" aria-hidden="true"></i>Rich Report</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/web_traffic'" title="Latest Web Traffic"><i class="fa fa-globe" aria-hidden="true"></i>Latest Web Traffic</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/status_legend'" title="Status Legend"><i class="fa fa-cc" aria-hidden="true"></i>Status Legend</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/faq'" title="Frequently Asked Questions"><i class="fa fa-question" aria-hidden="true"></i>Frequently Asked Questions</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/tos'" title="Terms Of Service"><i class="fa fa-file-text" aria-hidden="true"></i>Terms Of Service</router-link>
                                <router-link class="btn btn-app mb-3" :to="'/affiliate/sales_report'" title="Sales Report"><i class="fa fa-user-plus" aria-hidden="true"></i>Sales Report</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
