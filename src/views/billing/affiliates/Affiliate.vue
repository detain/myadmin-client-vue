<script setup>
import { ref, onMounted } from 'vue'

const body = ref('');
const custid = ref()
const affiliate_amount = ref(0);


function replace_url(st) {
    $("#ex_xlsx").attr("href", "ajax.php?choice=affiliate_download&ex=xlsx&st="+st);
    $("#ex_csv").attr("href", "ajax.php?choice=affiliate_download&ex=csv&st="+st);
    $("#ex_xls").attr("href", "ajax.php?choice=affiliate_download&ex=xls&st="+st);
    $("#ex_pdf").attr("href", "ajax.php?choice=affiliate_download&ex=pdf&st="+st);
}

onMounted(() => {
    $(".export").click(function(e){
        e.preventDefault();
        document.location.href = $(this).attr('href');
    });
    $('#copy_url').click(function(){
        var copyText = $("#affiliateinput");
        copyText.select();
        document.execCommand("copy");
        Swal.fire({
        type: 'success',
        title: 'Copied to clipboard.'
      });
    });
    //$.fn.dataTable.render.moment( 'HH:mm MMM D, YY' );
    var table_default = $('#table_default').DataTable({
        "ajax": "ajax.php?choice=affiliates_clientside&st=default",
        "order": [[ 3, "desc" ]],
        "pageLength": 25,
        "lengthMenu": [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "All"]]
    });
    var table_pending = $('#table_pending').DataTable({
        "ajax": "ajax.php?choice=affiliates_clientside&st=pending",
        "pageLength": 50,
        "order": [[ 3, "desc" ]],
        "lengthMenu": [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "All"]]
    });
    var table_paid = $('#table_paid').DataTable({
        "ajax": "ajax.php?choice=affiliates_clientside&st=paid",
        "order": [[ 3, "desc" ]],
        "pageLength": 50,
        "lengthMenu": [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "All"]]
    });
    var table_failed = $('#table_failed').DataTable({
        "ajax": "ajax.php?choice=affiliates_clientside&st=failed",
        "order": [[ 3, "desc" ]],
        "pageLength": 50,
        "lengthMenu": [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "All"]]
    });
    var tables = ["table_default", "table_pending", "table_paid", "table_failed"];
    for (var j = tables.length - 1; j >= 0; j--) {
        $('#'+tables[j]+' thead tr').clone(true).appendTo( '#'+tables[j]+' thead');
        $('#'+tables[j]+' thead tr:eq(1) td').each(function(i){
            $(this).removeAttr('class aria-controls aria-label rowspan colspan style');
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search" style="width:100%"/>' );
             $( 'input', this ).on( 'keyup change', function (){
                 var table_name = $(this).parents('table').attr('id');
                 if (table_name == 'table_default' && table_default.column(i).search() !== this.value) {
                     table_default.column(i).search( this.value).draw();
                 } else if (table_name == 'table_pending') {
                    table_pending.column(i).search( this.value).draw();
                 } else if(table_name == 'table_paid') {
                     table_paid.column(i).search( this.value).draw();
                 } else if(table_name == 'table_failed') {
                     table_failed.column(i).search( this.value).draw();
                 }
            });
        });
    }
})
</script>

<template>
<div class="row mt-2 justify-content-center">
    <div class="col">
  <template v-if="body" v-html="body"></template>
  <template v-else>
        <div class="card shadow-none w-100 bg-white p-2 mb-4" style="border-left: 4px solid red;display: block ruby;">
            <p class="m-0 text-md">
                <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">Attention:</b>&nbsp;This affiliate program is not intended for referral of “family members” or “clients” please read <a class="link" href="affiliate?link=faq">FAQ</a> before proceeding.
            </p>
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
                            <h3 class="card-title py-2"><i class="fa fa-money" aria-hidden="true">&nbsp;</i> Earn <b>{{ '$' + affiliate_amount }}</b> per new customer sale!</h3>
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
                    <div class="card-body text-center pb-4 mb-2">
                        <form class="form-inline">
                            <div class="form-group mr-2 w-50">
                                <input id="affiliateinput" type="text" class="form-control form-control-sm w-100" placeholder="Affiliate URL" :value="'https://www.interserver.net/r/' + custid">
                                <span class="text-xs text-muted">Share your unique affiliate URL with friends</span>
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
                        <a class="btn btn-app mb-3" href="affiliate?link=sales_graph" data-toggle="tooltip" title="Sales Graph"><i class="fa fa-line-chart" aria-hidden="true"></i>Sales Graph</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=traffic_graph" data-toggle="tooltip" title="Web Traffic Graph"><i class="fa fa-line-chart" aria-hidden="true"></i>Web Traffic Graph</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=banners" data-toggle="tooltip" title="View Banners & Links"><i class="fa fa-picture-o" aria-hidden="true"></i>View Banners & Links</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=landing_pg" data-toggle="tooltip" title="Setup Landing page & Coupons"><i class="fa fa-ticket" aria-hidden="true"></i>Setup Landing page & Coupons</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=payment_method" data-toggle="tooltip" title="Setup Payment Method"><i class="fa fa-money" aria-hidden="true"></i>Setup Payment Method</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=rich_report" data-toggle="tooltip" title="Rich Report"><i class="fa fa-file-text-o" aria-hidden="true"></i>Rich Report</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=web_traffic" data-toggle="tooltip" title="Latest Web Traffic"><i class="fa fa-globe" aria-hidden="true"></i>Latest Web Traffic</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=status_legend" data-toggle="tooltip" title="Status Legend"><i class="fa fa-cc" aria-hidden="true"></i>Status Legend</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=faq" data-toggle="tooltip" title="Frequently Asked Questions"><i class="fa fa-question" aria-hidden="true"></i>Frequently Asked Questions</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=tos" data-toggle="tooltip" title="Terms Of Service"><i class="fa fa-file-text" aria-hidden="true"></i>Terms Of Service</a>
                        <a class="btn btn-app mb-3" href="affiliate?link=sales_report" data-toggle="tooltip" title="Sales Report"><i class="fa fa-user-plus" aria-hidden="true"></i>Sales Report</a>
                    </div>
                </div>
            </div>
        </div>
        </template>
    </div>
</div>
</template>