<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from "vue";
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "domain.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Domain Registrations",
    MENUNAME: "Domains",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Domains",
    TABLE: "domains",
    TITLE_FIELD: "domain_hostname",
    PREFIX: "domain"
});
const serviceInfo = ref({
    domain_id: "592337",
    domain_hostname: "detain.dev",
    domain_username: "detaindev",
    domain_password: "12315688fgfasghs",
    domain_type: "10673",
    domain_currency: "USD",
    domain_expire_date: "2023-08-14 00:59:38",
    domain_order_date: "2022-08-13 20:58:58",
    domain_custid: "2773",
    domain_status: "active",
    domain_invoice: "19917286",
    domain_coupon: "0",
    domain_firstname: "Real",
    domain_lastname: "Person",
    domain_email: "realperson@mydomain.com",
    domain_address: "91 Mullberry St.",
    domain_address2: "",
    domain_address3: "",
    domain_city: "Area 51",
    domain_state: "PA",
    domain_zip: "00001",
    domain_country: "US",
    domain_phone: "8675309",
    domain_fax: "",
    domain_company: "InterServer Secaucus",
});
const client_links = ref([
    {
        label: "Invoices",
        link: "view_domain?id=592337&link=invoices",
        image: '<i class="fas fa-file-invoice-dollar fa-w-12"></i>',
        help_text: "Invoice History"
    },
    {
        label: "Cancel Domains",
        link: "view_domain?id=592337&link=cancel",
        image: '<i class="fas fa-times"></i>',
        help_text: "Cancel Domains"
    },
    {
        label: "Renew",
        link: "view_domain?id=592337&link=renew",
        image: '<i class="fa fa-hourglass"></i>',
        help_text: "Renew Domain"
    },
    {
        label: "DNSSEC",
        link: "view_domain?id=592337&link=dnssec",
        image: '<i class="fa fa-lock"></i>',
        help_text: "DNS Security Details"
    },
    {
        label: "Email EPP Code",
        link: "view_domain?id=592337&link=authepp",
        image: '<i class="fa fa-envelope"></i>',
        help_text: "Email Auth/EPP Code"
    },
    {
        label: "Lock / Unlock",
        link: "view_domain?id=592337&link=lock",
        image: '<i class="fa fa-lock"></i>',
        help_text: "Lock / Unlock Domain"
    }
]);
const billingDetails = ref({
    service_last_invoice_date: "August 13, 2022",
    service_payment_status: "Paid",
    service_frequency: "Yearly",
    next_date: "2023-08-14 00:59:38",
    service_next_invoice_date: "August 14, 2023",
    service_currency: "USD",
    service_currency_symbol: "$",
    service_cost_info: "18.00",
    service_extra: {
        order: {
            _OPS_version: "0.9",
            protocol: "XCP",
            is_success: "1",
            action: "REPLY",
            attributes: { id: "311873405", admin_email: "realperson@mydomain.com" },
            response_text: "Order created",
            object: "DOMAIN",
            response_code: "200"
        },
        order_id: "311873405",
        domain_id: "65006148",
        provProcessPending: {
            _OPS_version: "0.9",
            response_text: "Domain registration successfully completed.",
            protocol: "XCP",
            response_code: "200",
            action: "REPLY",
            object: "DOMAIN",
            is_success: "1",
            attributes: {
                id: "65006148",
                order_id: "311873405",
                "registration expiration date": "2023-08-14 00:59:38",
                f_auto_renew: "N"
            }
        },
        email: "realperson@mydomain.com",
        firstname: "Real",
        lastname: "Person",
        company: "InterServer Secaucus",
        address: "91 Mullberry St.",
        address2: "",
        address3: "",
        city: "Area 51",
        state: "PA",
        zip: "00001",
        country: "US",
        phone: "8675309",
        fax: ""
    }
});
const custCurrency = ref("USD");
const custCurrencySymbol = ref("$");
const serviceExtra = ref({
    order: {
        _OPS_version: "0.9",
        protocol: "XCP",
        is_success: "1",
        action: "REPLY",
        attributes: { id: "311873405", admin_email: "realperson@mydomain.com" },
        response_text: "Order created",
        object: "DOMAIN",
        response_code: "200"
    },
    order_id: "311873405",
    domain_id: "65006148",
    provProcessPending: {
        _OPS_version: "0.9",
        response_text: "Domain registration successfully completed.",
        protocol: "XCP",
        response_code: "200",
        action: "REPLY",
        object: "DOMAIN",
        is_success: "1",
        attributes: {
            id: "65006148",
            order_id: "311873405",
            "registration expiration date": "2023-08-14 00:59:38",
            f_auto_renew: "N"
        }
    },
    email: "realperson@mydomain.com",
    firstname: "Real",
    lastname: "Person",
    company: "InterServer Secaucus",
    address: "91 Mullberry St.",
    address2: "",
    address3: "",
    city: "Area 51",
    state: "PA",
    zip: "00001",
    country: "US",
    phone: "8675309",
    fax: ""
});
const extraInfoTables = ref([]);
const serviceType = ref({
    services_id: "10673",
    services_name: ".dev Domain Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "domains"
});
const contact_details = ref({
    postal_code: "00001",
    fax: "",
    status: "active",
    first_name: "Real",
    address1: "91 Mullberry St.",
    state: "PA",
    address3: "",
    phone: "8675309",
    city: "Area 51",
    email: "realperson@mydomain.com",
    org_name: "InterServer Secaucus",
    country: "US",
    address2: "",
    last_name: "Person"
});
const pwarning = ref("");
const transfer_info = ref("");
const errors = ref(false);
const domain_logs = ref([]);
const allInfo = ref({
    _OPS_version: "0.9",
    response_text: "Query Successful",
    response_code: "200",
    protocol: "XCP",
    is_success: "1",
    object: "DOMAIN",
    attributes: {
        registry_updatedate: "2022-08-19 00:59:38",
        affiliate_id: "",
        sponsoring_rsp: "1",
        auto_renew: "0",
        contact_set: {
            owner: {
                country: "US",
                address2: "",
                last_name: "Person",
                email: "realperson@mydomain.com",
                city: "Area 51",
                org_name: "InterServer Secaucus",
                address1: "91 Mullberry St.",
                first_name: "Real",
                status: "active",
                phone: "8675309",
                address3: "",
                state: "PA",
                fax: "",
                postal_code: "00001"
            },
            admin: {
                postal_code: "00001",
                fax: "",
                status: "active",
                first_name: "Real",
                address1: "91 Mullberry St.",
                state: "PA",
                address3: "",
                phone: "8675309",
                city: "Area 51",
                email: "realperson@mydomain.com",
                org_name: "InterServer Secaucus",
                country: "US",
                address2: "",
                last_name: "Person"
            },
            tech: {
                last_name: "Person",
                address2: "",
                country: "US",
                org_name: "InterServer Secaucus",
                city: "Area 51",
                email: "realperson@mydomain.com",
                address3: "",
                state: "PA",
                phone: "8675309",
                status: "active",
                address1: "91 Mullberry St.",
                first_name: "Real",
                postal_code: "00001",
                fax: ""
            }
        },
        tld_data: "",
        let_expire: "0",
        gdpr_consent_status: "PENDING",
        nameserver_list: [
            { name: "cdns1.interserver.net", ipaddress: "", sortorder: "1" },
            { sortorder: "2", ipaddress: "", name: "cdns2.interserver.net" },
            { name: "cdns3.interserver.net", ipaddress: "", sortorder: "3" }
        ],
        registry_expiredate: "2023-08-14 00:59:38",
        expiredate: "2023-08-14 00:59:38",
        registry_createdate: "2022-08-14 00:59:38"
    },
    action: "REPLY"
});
const registrarStatus = ref("Active");
const locked = ref("Inactive");
const whoisPrivacy = ref("disabled");
const autoRenew = ref("Disabled");

const loadDomain = async (data) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/domains_list');
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

//loadDomain(data)
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
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=invoices"><i class="fas fa-file-invoice-dollar fa-w-12"></i>Invoices</a>
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=cancel"><i class="fas fa-times"></i>Cancel Domains</a>
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=renew"><i class="fa fa-hourglass"></i>Renew</a>
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=dnssec"><i class="fa fa-lock"></i>DNSSEC</a>
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=authepp"><i class="fa fa-envelope"></i>Email EPP Code</a>
        <a class="btn btn-app b-radius" href="view_domain?id=592337&link=lock"><i class="fa fa-lock"></i>Lock / Unlock</a>
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
