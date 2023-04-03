<script setup>
import { ref, reactive, computed, onMounted } from "vue";

const label_rep = ref({
    active: "success",
    pending: "info",
    locked: "danger",
    suspended: "warning",
    canceled: "warning",
    expired: "danger",
    terminated: "danger"
});
const admin = ref(false);
const fluid_container = ref(true);
const refresh_button = ref(true);
const export_button = ref(true);
const print_button = ref(true);
const page_links = ref([1]);
const total_rows = ref(5);
const total_pages = ref(1);
const page_limits = ref([10,25,50,100,-1]);
const page = ref(1);
const page_limit = ref(100);
const page_offset = ref(0);
const order_dir = ref("asc");
const export_formats = ref({
    xlsx: {name: "Excel 2007+", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  read: "row", disposition: "attachment"},
    xls: {name: "Excel 2003/BIFF", type: "application/vnd.ms-excel", read: "row", disposition: "attachment"},
    ods: {name: "OpenDocument SpreadSheet", type: "application/vnd.oasis.opendocument.spreadsheet", read: "row", disposition: "attachment"},
    pdf: {name: "Adobe Portable Document Format", type: "application/pdf", read: "row", disposition: "attachment"},
    xml: {name: "Extensible Markup Language", type: "application/xml", read: "all", disposition: "attachment"},
    php: {name: "PHP Array", type: "text/x-php", read: "all", disposition: "inline"},
    csv: {name: "Comma-Seperated Values", type: "text/csv", read: "all", disposition: "inline"},
    json: {name: "JSON", type: "application/json", read: "all", disposition: "inline"},
    bbcode: {name: "BBcode", type: "text/x-bbcode", read: "all", disposition: "inline"},
    wiki: {name: "WikiCode", type: "text/x-wikicode", read: "all", disposition: "inline"},
    markdown: {name: "MarkDown", type: "text/x-markdown", read: "all", disposition: "inline"}
});
const extra_url_args = ref("");
const add_row = ref(true);
const select_multiple = ref(false);
const header = ref("");
const primary_key = ref("domain_id");
const choice = ref("view_domains_list");
const order_by = ref("domain_status");
const module = ref("domains");
const edit_form = ref("\n<div class=\"form-group row\">\n<label class=\"col-md-offset-1 col-md-4 control-label\" for=\"domain_id\">Service ID</label>\n<div class=\"form-group input-group col-md-6\">\n\t<div class=\"input-group-prepend\"><div class=\"input-group-text\"><i class=\"fa fa-fw fa-info\"></i></div></div>\n\t<input type=\"text\" class=\"form-control\" disabled=\"disabled\" name=\"domain_id\" id=\"domain_id\" onchange=\"update_inputs(\\\"domain_id\\\", this);\" value=\"\" placeholder=\"Service ID\" autocomplete=\"off\" style=\"width: 100%;\">\n</div>\n</div>\n\n<div class=\"form-group row\">\n<label class=\"col-md-offset-1 col-md-4 control-label\" for=\"domain_hostname\">Domain Name</label>\n<div class=\"form-group input-group col-md-6\">\n\t<div class=\"input-group-prepend\"><div class=\"input-group-text\"><i class=\"fa fa-fw fa-info\"></i></div></div>\n\t<input type=\"text\" class=\"form-control\" name=\"domain_hostname\" id=\"domain_hostname\" onchange=\"update_inputs(\\\"domain_hostname\\\", this);\" value=\"\" placeholder=\"Domain Name\" autocomplete=\"off\" style=\"width: 100%;\">\n</div>\n</div>\n\n<div class=\"form-group row\">\n<label class=\"col-md-offset-1 col-md-4 control-label\" for=\"domain_expire_date\">Domain Expire Date</label>\n<div class=\"form-group input-group col-md-6\">\n\t<div class=\"input-group-prepend\"><div class=\"input-group-text\"><i class=\"fa fa-fw fa-info\"></i></div></div>\n\t<input type=\"text\" class=\"form-control\" name=\"domain_expire_date\" id=\"domain_expire_date\" onchange=\"update_inputs(\\\"domain_expire_date\\\", this);\" value=\"\" placeholder=\"Domain Expire Date\" autocomplete=\"off\" style=\"width: 100%;\">\n</div>\n</div>\n\n<div class=\"form-group row\">\n<label class=\"col-md-offset-1 col-md-4 control-label\" for=\"domain_status\">Billing Status</label>\n<div class=\"form-group input-group col-md-6\">\n\t<div class=\"input-group-prepend\"><div class=\"input-group-text\"><i class=\"fa fa-fw fa-info\"></i></div></div>\n\t<input type=\"text\" class=\"form-control\" name=\"domain_status\" id=\"domain_status\" onchange=\"update_inputs(\\\"domain_status\\\", this);\" value=\"\" placeholder=\"Billing Status\" autocomplete=\"off\" style=\"width: 100%;\">\n</div>\n</div>\n");
const header_buttons = ref([
    "<a class='btn btn-primary btn-sm printer-hidden' href='domain_order');' data-toggle=\"tooltip\" title=\"Order Domain Registrations\"><i class='fa fa-shopping-cart'></i> Order</a>"
]);
const title_buttons = ref([
    "<a class='btn btn-info active btn-sm' onclick='crud_search(this, [[\"domain_status\",\"=\",\"active\"]]);'>Active</a>",
    "<a class='btn btn-info btn-sm' onclick='crud_search(this, [[\"domain_status\",\"in\",[\"pending\",\"pending-setup\",\"pend-approval\"]]]);'>Pending</a>",
    "<a class='btn btn-info btn-sm' onclick='crud_search(this, [[\"domain_status\",\"in\",[\"canceled\",\"expired\"]]]);'>Expired</a>",
    "<a class='btn btn-info btn-sm' onclick='crud_search(this, []);'>All</a>"
]);
const labels = ref({
    domain_id: "Service ID",
    domain_hostname: "Domain Name",
    domain_expire_date: "Domain Expire Date",
    domain_status: "Billing Status"
});
const rows = ref([
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=376503\"><img src=\"https://shot.sh?w=300&h=100&img=hostingenuity.com\"></a>", domain_id: "376503", domain_hostname: "hostingenuity.com", domain_expire_date: "2022-02-09 16:20:25", cost: "12.00", domain_status: "active"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=592337\"><img src=\"https://shot.sh?w=300&h=100&img=detain.dev\"></a>", domain_id: "592337", domain_hostname: "detain.dev", domain_expire_date: "2023-08-14 00:59:38", cost: "18.00", domain_status: "active"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=418295\"><img src=\"https://shot.sh?w=300&h=100&img=unixsrv10.com\"></a>", domain_id: "418295", domain_hostname: "unixsrv10.com", domain_expire_date: "", cost: "11.00", domain_status: "canceled"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=408615\"><img src=\"https://shot.sh?w=300&h=100&img=kirais.art\"></a>", domain_id: "408615", domain_hostname: "kirais.art", domain_expire_date: "", cost: "47.00", domain_status: "pending"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=408918\"><img src=\"https://shot.sh?w=300&h=100&img=kiraart.bet\"></a>", domain_id: "408918", domain_hostname: "kiraart.bet", domain_expire_date: "", cost: "18.00", domain_status: "pending"}
]);
const row_buttons = ref([
    "<button type=\"button\" alt=\"View Domain Registrations\" class=\"btn btn-primary btn-xs printer-hidden\" onclick=\"window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);\" title=\"View Domain Registrations\" data-toggle=\"tooltip\" tooltip=\"View Domain Registrations\"><i class=\"fa fa-fw fa-cog\"></i></button>"
]);


function updateSort(col) {
    // Your sorting logic here
}

const updatePageLimit = (limit) => {
    emit('update:page_limit', limit)
    emit('update:page', 1)
}

const gotoPage = (page) => {
    emit('update:page', page)
}


function sortTable(table, order) {
        console.log("sort-table");
    var asc   = order === 'asc',
        tbody = table.find('tbody');

    tbody.find('tr').sort(function(a, b) {
        if (asc) {
            return $('td:eq(4)', a).text().localeCompare($('td:eq(4)', b).text());
        } else {
            return $('td:eq(4)', b).text().localeCompare($('td:eq(4)', a).text());
        }
    }).appendTo(tbody);
}

function crud_submit_handler(what, that) {
    var disabled = jQuery("#"+what+"ModalForm input[disabled], #"+what+"ModalForm select[disabled]");
    disabled.removeAttr("disabled");
    var url = jQuery("#"+what+"ModalForm").attr("action");
    var data = jQuery(that).serialize();
    console.log("calling "+url+" with post data "+data);
    disabled.attr("disabled", "disabled");
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(html){
            //console.log("handler returned html: "+html);
            jQuery('#'+what+'Modal .error_message').html('');
            if(html.substring(0, 4)=='true') {
                jQuery('#'+what+'Modal .error_message').html('<div style="margin: 15px; text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i> <span style="margin-left: 10px;font-size: 18px;">Redirecting</span><div>');
                if (html.length == 4) {
                    window.location="index.php";
                } else {
                    window.location=html.substring(4);
                }
            } else if (html == 'error') {
                $('#'+what+'Modal .btn').attr('disabled', false);
                jQuery('#'+what+'Modal .error_message').html("<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Error Charging the Credit-Card</div>");
            } else if (html == 'ok') {
                $('#'+what+'Modal .btn').attr('disabled', false);
            } else {
                $('#'+what+'Modal .btn').attr('disabled', false);
                jQuery('#'+what+'Modal .error_message').html("<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>"+html+"</div>");
            }
        },
        error: function() {
            $('#'+what+'Modal .btn').attr('disabled', false);
            jQuery('#'+what+'Modal .error_message').html("<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Error occurred!</div>");
        },
        beforeSend: function()
        {
            $('#'+what+'Modal .btn').attr('disabled', true);
            jQuery('#'+what+'Modal .error_message').html('<div style="margin: 15px; text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i> <span style="margin-left: 10px;font-size: 18px;">Processing "+what+"</span><div>');
        }
    });
    return false;
}

function crud_edit_form(that) {
    var parent = get_crud_row_idx(that);
    //console.log(get_crud_row_id(that));
    var row = crud_rows[parent], field, value;
    console.log(row);
    for (field in row) {
        value = row[field];
        jQuery("#"+field).val(value);
    }
    jQuery('#editModal .error_message').html();
    jQuery("#editModal").modal("show");
}

function crud_delete_form(that) {
    var parent = get_crud_row_id(that);
    var row = crud_rows[parent], field, value;
    console.log(row);
    console.log(row[crud_primary_key]);
    jQuery("#primary_key").val(row[crud_primary_key]);
    jQuery('#editModal .error_message').html();
    jQuery("#deleteModal").modal("show");
}

function get_crud_row_idx(that) {
    return replaceAll(jQuery(that).parent().parent().attr("id"), "itemrow", "");
}

function get_crud_row_id(that) {
    var parent = get_crud_row_idx(that);
    var row = crud_rows[parent], field, value;
    return row[crud_primary_key];
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function crud_search(that, terms) {
    crud_search_terms = terms;
    jQuery('.crud-header-buttons a').removeClass('active');
    if (jQuery(that).attr('id') != 'crud_search_button')
        jQuery(that).addClass('active');
    crud_load_page();
}

function get_crud_url() {
    var url = jQuery("#paginationForm").attr("action");
    if (typeof url == undefined || typeof url == "undefined") {
        url = document.location.pathname.replace(/\/[^\/]*$/,'')+'/ajax.php'+document.location.search.replace('choice=none\.', 'choice=crud&crud=')+'&action=list';
        console.log("Got undefined action= contents from #pagionationForm so used fallback method and generated: "+url);
    }
    url = url+"&order_by="+crud_order_by+"&order_dir="+crud_order_dir+"&offset="+crud_page_offset+"&limit="+crud_page_limit;
    if (crud_search_terms.length > 0)
        url = url + "&search=" + JSON.stringify(crud_search_terms);
    return url;
}

function crud_export(that) {
    var obj = jQuery(that);
    var parent = obj.parent();
    var format = parent.attr('data-type');
    console.log("Exporting to format "+format);
    var url = get_crud_url() + "&format="+format;
    url = url.replace("action=list","action=export");
    window.location = url;
    //$.ajax({ url: url });

}

function crud_load_page(callback) {
    $.getJSON(get_crud_url(), { }, function(json) {
        crud_rows = json;
        var empty = document.getElementById('itemrowempty').innerHTML;
        var x, row;
        jQuery('#crud-table tbody').html('');
        jQuery('#crud-table tbody').append('<tr id="itemrowempty" style="display: none;">' + empty + '</tr>');
        for(var x = 0; x < json.length; x++) {
            //row = replaceAll(empty, 'display: none;','');
            row = empty;
            for (var field in json[x]) {
                row = replaceAll(row, '%'+field+'%', json[x][field]);
            }
            jQuery('#crud-table tbody').append('<tr id="itemrow'+x+'">' + row + '</tr>');
        }
        crud_update_pager();
        //console.log(json);
        //jQuery("[data-toggle=tooltip]").tooltip();
        console.log("page finished loading "+crud_rows.length+" rows");
        if (typeof callback != "undefined") {
            callback();
        }
    });
sortTable(jQuery('.webhosting-list'),'asc');
}

function crud_update_pager() {
    var x, first, page_links = [], page_html = '';
    crud_page = (crud_page_offset / crud_page_limit) + 1;
    //console.log(crud_page);
    //console.log(crud_page_offset);
    //console.log(crud_page_limit);
    //console.log('crud_total_counts'+crud_total_count);
    crud_total_pages = Math.ceil(crud_total_count / crud_page_limit);
    //console.log("Offset "+crud_page_offset+" Limit "+crud_page_limit+" Page "+crud_page);
    if (crud_page > 1)
        jQuery('#crud-pager-prev').removeClass('disabled');
    else
        jQuery('#crud-pager-prev').addClass('disabled');
    if (crud_page < crud_total_pages)
        jQuery('#crud-pager-next').removeClass('disabled');
    else
        jQuery('#crud-pager-next').addClass('disabled');
    page_links[0] = 1;
    first = crud_page - 2;
    if (first < 2)
        first = 2;
    for (x = 0; x < 4; x++)
        if (page_links.indexOf(first + x) == -1 && first + x < crud_total_pages)
            page_links[page_links.length] = first + x;
    page_links[page_links.length] = crud_total_pages;
    var page_html = '', page_offset;
    for (x = 0; x < page_links.length; x++) {
        page_html = page_html + '<li class="page-item crud-page';
        page_offset = ((page_links[x] - 1) * crud_page_limit);
        if (crud_page_offset == page_offset)
            page_html = page_html + ' active';
        page_html = page_html + '"><a href="" class="page-link" data-offset="'+page_offset+'">'+page_links[x]+'</a></li>';
    }
    jQuery('.crud .pagination li.crud-page').remove();
    jQuery('.crud .pagination #crud-pager-prev').after(page_html);
    //jQuery('.crud .pagination li.crud-page').removeClass('active');
    //jQuery('.crud .pagination li.crud-page a[data-offset="'+crud_page_offset+'"]').parent().addClass('active');
    crud_setup_pager_binds();
}

function crud_setup_edit_binds() {
    jQuery("#editModal").on("shown.bs.modal", function(e) {
        jQuery("#editModal input").focus();
    });
    jQuery("#editModal form").on("submit", function(event) {
        event.preventDefault();
        crud_submit_handler('edit', this);
    });
}

function crud_setup_delete_binds() {
    jQuery("#deleteModal form").on("submit", function(event) {
        event.preventDefault();
        crud_submit_handler('delete', this);
    });
}

function crud_setup_search_binds() {
    jQuery('#crud-search').on('click', function(event) {
        event.preventDefault();
        jQuery('#crud-search').hide();
        jQuery('#crud-search-more').show();
    });
    jQuery('#crud_search_button').on('click', function(event) {
        event.preventDefault();
        crud_search(this, [jQuery('#crud_search_column').val(),'=',jQuery('.crud-searchdata.crud-search-active').val()]);
    });
}

function crud_update_sort(that) {
    event.preventDefault();
    var obj = jQuery(that);
    var parent = obj.parent();
    crud_order_dir = parent.attr('data-order-dir');
    crud_order_by = parent.attr('data-order-by');
        //console.log("got a click on "+crud_order_by+" dir "+crud_order_dir);
    if (crud_order_dir == 'asc')
        parent.attr('data-order-dir', 'desc');
    else
        parent.attr('data-order-dir', 'asc');
    //jQuery('.crud #itemrowheader th').removeClass('active');
    jQuery('.crud #itemrowheader .header_link i').css('opacity', '0.3').removeClass('fa-sort-desc').removeClass('fa-sort-asc').addClass('fa-sort');
    //jQuery(this).parent().addClass('active');
    //console.log("current classes "+obj.attr('class')+" setting to "+crud_order_dir);
    obj.find('i').css('opacity', '1').removeClass('fa-sort').removeClass('fa-sort-desc').removeClass('fa-sort-asc').addClass('fa-sort-'+crud_order_dir);
    crud_load_page();
}

function crud_setup_pager_binds() {
    jQuery('.crud .pagination .crud-page a').on('click', function(event) {
        event.preventDefault();
        crud_page_offset = jQuery(this).attr('data-offset');
        jQuery('.crud .pagination li ').removeClass('active');
        jQuery(this).parent().addClass('active');
        crud_load_page();
    });
    jQuery('#crud-pager-prev a').on('click', function(event) {
        event.preventDefault();
        crud_page_offset = crud_page_offset - crud_page_limit;
        if (crud_page_offset < 0)
            crud_page_offset = 0;
        crud_load_page();
    });
    jQuery('#crud-pager-next a').on('click', function(event) {
        event.preventDefault();
        crud_page_offset = crud_page_offset + crud_page_limit;
        if ((crud_page_offset / crud_page_limit) + 1 >  crud_total_pages)
            crud_page_offset = (crud_total_pages - 1 ) * crud_page_limit;
        crud_load_page();
    });
}

function crud_setup_mass_binds() {
    jQuery("#crud-table #checkall").click(function () {
        if (jQuery("#crud-table #checkall").is(':checked')) {
            jQuery("#crud-table input[type=checkbox]").each(function () {
                jQuery(this).prop("checked", true);
            });
        } else {
            jQuery("#crud-table input[type=checkbox]").each(function () {
                jQuery(this).prop("checked", false);
            });
        }
    });
}

function crud_setup_limit_binds() {
    jQuery('.crud .row-counts button').on('click', function(event) {
        var obj = jQuery(this);
        crud_page_limit = obj.attr('data-limit');
        jQuery('.crud .row-counts button').removeClass('active');
        obj.addClass('active');
        crud_load_page();
    });
}

function crud_setup_binds() {
    crud_setup_edit_binds();
    crud_setup_delete_binds();
    crud_setup_search_binds();
    crud_setup_pager_binds();
    crud_setup_limit_binds();
    crud_setup_mass_binds();
}

$.fn.refreshMe = function(opts){
    var $this = this,
    defaults = {
        panel: '.crud',
        refreshcontainer: '.refresh-container',
        started: function(){},
        completed: function(){}
    },
    settings = $.extend(defaults, opts);

    var panelToRefresh = $this.parents(settings.panel).find(settings.refreshcontainer);
    //var dataToRefresh = $this.parents(settings.panel).find('.refresh-data');
    var started = settings.started;        //function before timeout
    var completed = settings.completed;    //function after timeout

    $this.click(function(event){
        $this.find('.fa').addClass("fa-spin");
        panelToRefresh.show();
        started($this, panelToRefresh);
        /*
        completed(dataToRefresh);
        panelToRefresh.fadeOut(800);
        $this.removeClass("fa-spin");
        */
        return false;
    })
};

function crud_setup_refresh() {
    $('.refresh').refreshMe({
        started: function(refreshobj, panel){
            crud_load_page(function(){
                panel.fadeOut(800);
                refreshobj.find('.fa').removeClass('fa-spin');
            });
        }
    });
}

function crud_print() {
    event.preventDefault();
    jQuery('.printer-hidden').hide();
    var oldPage = document.body.innerHTML;
    jQuery("#crud-table td a").each(function() {
        jQuery(this).parent().text(jQuery(this).parent().text());
    });
    var obj = jQuery('.crud .table-responsive');
    var divElements = obj.html();
    document.body.innerHTML = "<html><head><title></title></head><body>"+divElements+"</body>";
    setTimeout(function(oldpage) {
        window.print();
        document.body.innerHTML = oldPage;
        jQuery('.printer-hidden').show();
    }, 250);
}

onMounted(() => {
    crud_setup_binds();
    crud_setup_refresh();
    sortTable(jQuery('.webhosting-list'),'asc');
    //jQuery("[data-toggle=tooltip]").tooltip();
    $('#crud-table > thead > tr:first div.crud-header-buttons a.active').trigger('click');
/*
    const crud_rows = {{ JSON.stringify(rows) }};
    const crud_primary_key = "{{ primary_key }";
    const crud_page_offset = {{ page_offset };
    const crud_page_limit = {{ page_limit };
    const crud_order_dir = "{{ order_dir }";
    const crud_order_by = "{{ order_by }}";
    const crud_total_pages = {{ total_pages }};
    const crud_page = {{ page }};
    const crud_search_terms = [];
    const crud_total_count = {{ total_rows }};
*/
    jQuery(function() {
        $('#title_btns > .btn-group > a.active').trigger('click');
        $('#title_btns > .btn-group > a').on('click', function(){
            $('#title_btns > .btn-group > a').each(function(){
                $(this).removeClass('active');
            });
            $(this).addClass('active');
        });
        $('.row-counts > .active').addClass('btn-primary');
        $('.row-counts > .btn').on('click', function(){
            $(this).addClass('btn-primary');
        });
    });
});

</script>

<template>
<link rel="stylesheet" href="https://mystage.interserver.net/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="https://mystage.interserver.net/css/crud_table5.css">
<div class="row">
  <div class="col-md-12">
    <div v-if="module && module === 'backups'" class="alert alert-default">
      (For pricing and more information: <a style="color: #004085;" target="_blank" href="https://www.interserver.net/storage/">https://www.interserver.net/storage/</a>)
    </div>
    <div class="card">
      <div class="card-header text-right">
        <div class="row float-right">
          <div v-if="total_pages > 1" id="search_btns" class="col-md-auto printer-hidden text-right pl-2">
            <form accept-charset="UTF-8" role="form" id="paginationForm" class="" @submit.prevent="search" autocomplete="on" method="GET">
              <a id="crud-search" class="btn btn-sm btn-primary" href="" title="Search" data-tile="Search"><span class="fa fa-search fa-fw"></span> Search</a>
              <span id="crud-search-more" class="crud-search form-inline float-right" style="display: none;">
                <input class="crud-searchdata crud-search-active form-control form-control-sm mr-1" name="search" data-type="text" type="text" v-model="searchTerm">
                <select class="crud-daterange crud-searchdata form-control form-control-sm selectpicker mr-1" name="range" data-fieldtype="date" style="display:none; ">
                  <option value="">- choose range -</option>
                  <option value="next_year" data-from="" data-to="">Next Year</option>
                  <option value="next_month" data-from="" data-to="">Next Month</option>
                  <option value="today" data-from="" data-to="">Today</option>
                  <option value="this_week_today" data-from="" data-to="">This Week up to today</option>
                  <option value="this_week_full" data-from="" data-to="">This full Week</option>
                  <option value="last_week" data-from="" data-to="">Last Week</option>
                  <option value="last_2weeks" data-from="" data-to="">Last two Weeks</option>
                  <option value="this_month" data-from="" data-to="">This Month</option>
                  <option value="last_month" data-from="" data-to="">Last Month</option>
                  <option value="last_3months" data-from="" data-to="">Last 3 Months</option>
                  <option value="last_6months" data-from="" data-to="">Last 6 Months</option>
                  <option value="this_year" data-from="" data-to="">This Year</option>
                  <option value="last_year" data-from="" data-to="">Last Year</option>
                </select>
                <input class="crud-searchdata crud-datepicker-from form-control form-control-sm mr-1" name="date_from" style="display:none; " data-type="datetime" data-fieldtype="date" type="text" v-model="dateFrom">
                <input class="crud-searchdata crud-datepicker-to form-control form-control-sm mr-1" name="date_to" style="display:none; " data-type="datetime" data-fieldtype="date" type="text" v-model="dateTo">
                <select class="crud-data crud-columns-select form-control form-control-sm mr-1" name="column" id="crud_search_column" v-model="searchColumn">
                  <option value="">All fields</option>
                  <option v-for="(value, idx) in labels" :key="idx" :value="idx" data-type="int">{{ value }}</option>
                </select>
                <span class="btn-group">
                  <a class="btn btn-sm btn-primary" href="" data-search="1" id="crud_search_button" @click.prevent="submitSearch">Go</a>
                </span>
              </span>
            </form>
          </div>
          <div id="header_btns" class="col-md-auto printer-hidden text-right pl-2">
            <div class="btn-group">
              <button v-for="button in header_buttons" :key="button">{{ button }}</button>
            </div>
          </div>
          <div v-if="print_button || export_button" id="print_expo_btns" class="col-md-auto export float-right printer-hidden pl-2">
            <div class="btn-group">
              <button v-if="print_button" class="btn btn-sm btn-secondary" type="button" title="Print" @click="crudPrint">
                <i class="fa fa-print crud-icon"></i>Print
              </button>
              <button v-if="export_button" class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-download crud-icon"></i>
                Export
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul v-if="export_button" class="dropdown-menu" role="menu">
                <li v-for="(formatData, ext) in exportFormats" :key="ext" role="presentation" :data-type="ext">
                  <a href="#" data-container="body" data-toggle="tooltip" :title="formatData.name" @click.prevent="crudExport($event, ext)">
                    <img :src="`/images/crud/${ext}.png`" alt=""> {{ ext | uppercase }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="card-header">
        <div class="row">
          <div class="col-md-12 d-flex justify-content-between align-items-center">
            <h3 class="card-title">{{ title }}</h3>
            <div id="title_btns" class="col-md-auto printer-hidden pl-2">
              <div class="btn-group">
                <button v-for="button in title_buttons" :key="button.id" class="btn btn-sm btn-primary" v-html="button.label"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div id="crud" class="crud">
          <div class="row">
            <div class="col-md-12">
              <div class="table">
                <table id="crud-table" class="crud-table table table-bordred table-striped table-hover table-sm">
                  <thead class="">
                    <tr>
                      <th v-if="select_multiple"><input type="checkbox" id="checkall" /></th>
                      <th v-for="col in table_headers" :key="col.id" :colspan="col.colspan" :bgcolor="col.bgcolor" :style="{ textAlign: col.align }" v-bind="col.opts">
                        <span role="button" class="header_link" @click="updateSort(col)">
                          {{ col.text }}
                        </span>
                      </th>
                      <th v-if="row_buttons"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in table_rows" :key="rowIndex" :class="row.rowopts">
                      <template v-if="select_multiple">
                        <td><input type="checkbox" class="checkthis" /></td>
                      </template>
                      <td v-for="(col, colIndex) in row.cols" :key="colIndex" :colspan="col.colspan" :bgcolor="col.colbgcolor" :style="{textAlign: col.colalign}" :class="col.colopts">
                        <template v-if="col.text in label_rep">
                          <span class="label label-sm label-{{ label_rep[col.text] }}">{{ col.text }}</span>
                        </template>
                        <template v-else>
                          {{ col.text }}
                        </template>
                      </td>
                      <template v-if="row_buttons">
                        <td>
                          <template v-for="(button, buttonIndex) in row_buttons" :key="buttonIndex">
                            {{ button }}
                          </template>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <form accept-charset="UTF-8" role="form" id="paginationForm" class="" :action="'ajax.php?choice=crud&crud=' + choice + '&action=list' + extra_url_args" autocomplete="on" method="GET" style="display:inline-flex;">
                <div v-if="total_pages > 1" class="btn-group row-counts" role="group" aria-label="Rows Per Page">
                  <button v-for="limit in page_limits" :key="limit" v-if="limit <= total_rows" type="button" class="btn btn-secondary btn-sm" :class="{ 'active': page_limit === limit }" @click="updatePageLimit(limit)" :data-limit="limit">
                    {{ limit === -1 ? 'All' : limit }}
                  </button>
                </div>
                <span v-if="refresh_button" class="btn-group nav-rows">
                  <a class="btn btn-sm btn-info refresh" href="" title="Refresh Table" data-title="Refresh Table">
                    <span class="fas fa-sync fa-fw"></span>
                  </a>
                </span>
              </form>
            </div>
            <div class="col-md-6 float-right">
              <nav v-if="total_pages > 1" aria-label="Page navigation float-right" class="crud">
                <ul class="pagination justify-content-end">
                  <li id="crud-pager-prev" class="page-item" :class="{ 'disabled': page === 1 }">
                    <a class="page-link" href="javascript:void(0);" aria-label="Previous" @click.prevent="prevPage()">
                      <span aria-hidden="true">&laquo;</span>
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li v-for="pager in page_links" :key="pager" class="page-item crud-page" :class="{ 'active': pager === page }">
                    <a class="page-link" href="" @click.prevent="gotoPage(pager)" :data-offset="(pager - 1) * page_limit">{{ pager }}</a>
                  </li>
                  <li id="crud-pager-next" class="page-item" :class="{ 'disabled': page >= total_pages }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="nextPage()">
                      <span aria-hidden="true">&raquo;</span>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
a.btn-info:link, a.btn-info:active, a.btn-info:visited, a.btn-info:hover {
    font-size: inherit;
}
div.dataTables_length label, div.dataTables_filter label {
    text-align: left;
    white-space: nowrap;
}
div.dataTables_filter {
    text-align: right;
}
</style>
