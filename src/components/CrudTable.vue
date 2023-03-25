<script setup>
import { reactive, ref, computed } from 'vue'

export default {
  setup() {
    const title = ref('')
    const titleButtons = ref([])
    const selectMultiple = ref(false)
    const tableHeaders = ref([])
    const rowButtons = computed(() => typeof rowButtons !== 'undefined')
    const tableRows = reactive({{ $table_rows|json_encode|raw }});
    const selectMultiple = {{ $select_multiple ? 'true' : 'false' }};
    const labelRep = reactive({{ $label_rep|json_encode|raw }});
    const rowButtons = {{ isset($row_buttons) ? 'true' : 'false' }};

    function updateSort(col) {
      // Your sorting logic here
    }
    const state = reactive({
      page_links: Array.from({ length: props.total_pages }, (_, i) => i + 1),
    })

    const updatePageLimit = (limit) => {
      emit('update:page_limit', limit)
      emit('update:page', 1)
    }

    const gotoPage = (page) => {
      emit('update:page', page)
    }

    return {
      title,
      titleButtons,
      selectMultiple,
      tableHeaders,
      rowButtons,
      updateSort,
      tableRows, selectMultiple, labelRep, rowButtons,

    }
  }
}
const props = {
    totalPages: Number,
    choice: String,
    extraUrlArgs: String,
    labels: Object,
    headerButtons: Array,
    printButton: Boolean,
    exportButton: Boolean,
    exportFormats: Object,
    choice: String,
    extra_url_args: String,
    total_pages: Number,
    total_rows: Number,
    page: Number,
    page_limits: Array,
    page_limit: Number,
    refresh_button: Boolean,

  };
</script>

<template>
<link rel="stylesheet" href="/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="/css/crud_table5.css">

  <div class="row">
    <div class="col-md-12">
      <div v-if="module && module === 'backups'" class="alert alert-default">
        (For pricing and more information:
        <a style="color: #004085;" target="_blank" href="https://www.interserver.net/storage/">
          https://www.interserver.net/storage/
        </a>)
      </div>
      <div class="card">
        <div class="card-header text-right">
          <div class="row float-right">
            <div v-if="totalPages > 1" id="search_btns" class="col-md-auto printer-hidden text-right pl-2">
              <form accept-charset="UTF-8" role="form" id="paginationForm" class="" @submit.prevent="search" autocomplete="on" method="GET">
                <a id="crud-search" class="btn btn-sm btn-primary" href="" title="Search" data-tile="Search">
                  <span class="fa fa-search fa-fw"></span>
                  Search
                </a>
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
        <button v-for="button in headerButtons" :key="button">{{ button }}</button>
      </div>
    </div>
    <div v-if="printButton || exportButton" id="print_expo_btns" class="col-md-auto export float-right printer-hidden pl-2">
      <div class="btn-group">
        <button v-if="printButton" class="btn btn-sm btn-secondary" type="button" title="Print" @click="crudPrint">
          <i class="fa fa-print crud-icon"></i>Print
        </button>
        <button v-if="exportButton" class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-download crud-icon"></i>
          Export
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul v-if="exportButton" class="dropdown-menu" role="menu">
          <li v-for="(formatData, ext) in exportFormats" :key="ext" role="presentation" :data-type="ext">
            <a href="#" data-container="body" data-toggle="tooltip" :title="formatData.name" @click.prevent="crudExport($event, ext)">
              <img :src="`/images/crud/${ext}.png`" alt=""> {{ ext | uppercase }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div>
    <div class="card-header">
      <div class="row">
        <div class="col-md-12 d-flex justify-content-between align-items-center">
          <h3 class="card-title">{{ title }}</h3>
          <div id="title_btns" class="col-md-auto printer-hidden pl-2">
            <div class="btn-group">
              <button v-for="button in titleButtons" :key="button.id" class="btn btn-sm btn-primary" v-html="button.label"></button>
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
                    <th v-if="selectMultiple"><input type="checkbox" id="checkall" /></th>
                    <th v-for="col in tableHeaders" :key="col.id" :colspan="col.colspan" :bgcolor="col.bgcolor" :style="{ textAlign: col.align }" v-bind="col.opts">
                      <span role="button" class="header_link" @click="updateSort(col)">
                        {{ col.text }}
                      </span>
                    </th>
                    <th v-if="rowButtons"></th>
                  </tr>
                </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableRows" :key="rowIndex" :class="row.rowopts">
          <template v-if="selectMultiple">
            <td><input type="checkbox" class="checkthis" /></td>
          </template>
          <td v-for="(col, colIndex) in row.cols" :key="colIndex" :colspan="col.colspan" :bgcolor="col.colbgcolor" :style="{textAlign: col.colalign}" :class="col.colopts">
            <template v-if="col.text in labelRep">
              <span class="label label-sm label-{{ labelRep[col.text] }}">{{ col.text }}</span>
            </template>
            <template v-else>
              {{ col.text }}
            </template>
          </td>
          <template v-if="rowButtons">
            <td>
              <template v-for="(button, buttonIndex) in rowButtons" :key="buttonIndex">
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
      <form
        accept-charset="UTF-8"
        role="form"
        id="paginationForm"
        class=""
        :action="'ajax.php?choice=crud&crud=' + choice + '&action=list' + extra_url_args"
        autocomplete="on"
        method="GET"
        style="display:inline-flex;"
      >
        <div v-if="total_pages > 1" class="btn-group row-counts" role="group" aria-label="Rows Per Page">
          <button
            v-for="limit in page_limits"
            :key="limit"
            v-if="limit <= total_rows"
            type="button"
            class="btn btn-secondary btn-sm"
            :class="{ 'active': page_limit === limit }"
            @click="updatePageLimit(limit)"
            :data-limit="limit"
          >
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
</template>
<script src="/lib/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="/lib/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
<script>
var crud_rows = {$rows|json_encode};
var crud_primary_key = "{$primary_key}";
var crud_page_offset = {$page_offset};
var crud_page_limit = {$page_limit};
var crud_order_dir = "{$order_dir}";
var crud_order_by = "{$order_by}";
var crud_total_pages = {$total_pages};
var crud_page = {$page};
var crud_search_terms = [];
var crud_total_count = "{$total_rows}";
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
</script>
<script src="/js/crud.js"></script>
</templae>

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
