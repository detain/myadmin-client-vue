<script setup>
import { ref } from 'vue'
const last_login_ip = ref("70.44.33.193")
const last_login = ref("12:35:pm - 21 Feb, 2023")
const currency = ref("$")
const amount = ref("$1,862.37")
const invoice_list = ref(25)
const balance = ref("$6.60")
const full_name = ref("Joe")
const email = ref("email@user.net")
const tickets = ref([
    {
        ticketid: "1105655",
        ticketmaskid: "JHY-550-37315",
        departmentid: "5",
        departmenttitle: "General",
        ticketstatusid: "4",
        ticketstatustitle: "Open",
        priorityid: "7",
        prioritytitle: "Standard - 1 to 3 hour resolution",
        emailqueueid: "0",
        userid: "12558",
        staffid: "0",
        ownerstaffid: "149",
        ownerstaffname: "",
        assignstatus: "0",
        fullname: "Joe Dude",
        email: "me@user.com",
        lastreplier: "Joe Dude",
        replyto: "me@user.com",
        subject: "test",
        dateline: "1657896904",
        lastactivity: "1677519418",
        laststaffreplytime: "0",
        lastuserreplytime: "1677519418",
        slaplanid: "2",
        ticketslaplanid: "0",
        duetime: "1677606721",
        totalreplies: "3",
        ipaddress: "1.2.3.4",
        flagtype: "0",
        hasnotes: "0",
        hasattachments: "1",
        isemailed: "0",
        edited: "0",
        editedbystaffid: "0",
        editeddateline: "0",
        creator: "2",
        charset: "",
        transferencoding: "",
        timeworked: "0",
        timebilled: "0",
        dateicon: "0",
        lastpostid: "5649603",
        firstpostid: "5107825",
        tgroupid: "1",
        messageid: "",
        escalationruleid: "0",
        hasdraft: "0",
        hasbilling: "0",
        isphonecall: "0",
        isescalated: "0",
        isescalatedvolatile: "0",
        phoneno: "",
        isautoclosed: "0",
        autocloseruleid: "0",
        autoclosestatus: "0",
        autoclosetimeline: "0",
        escalatedtime: "0",
        followupcount: "0",
        hasfollowup: "0",
        hasratings: "0",
        tickethash: "br9qkv83l3rv",
        islinked: "0",
        trasholddepartmentid: "0",
        tickettype: "1",
        tickettypeid: "1",
        tickettypetitle: "Issue",
        creationmode: "4",
        isfirstcontactresolved: "1",
        wasreopened: "1",
        reopendateline: "1677519418",
        resolutiondateline: "1660795905",
        escalationlevelcount: "0",
        resolutionseconds: "2899001",
        resolutionlevel: "0",
        repliestoresolution: "2",
        averageresponsetime: "0",
        averageresponsetimehits: "0",
        firstresponsetime: "0",
        resolutionduedateline: "1677781321",
        isresolved: "0",
        iswatched: "0",
        oldeditemailaddress: "",
        linkkbarticleid: "0",
        linkticketmacroid: "0",
        bayescategoryid: "1",
        recurrencefromticketid: "0",
        averageslaresponsetime: "0"
    }
])
const ticket_Status = ref({
    Open: 4,
    "On Hold": 5
})
const ticketStatusView = ref({
    4: "Open",
    5: "On Hold",
    6: "Closed"
})
const details = ref({
    modules: {
        domains: {
            icon: "globe",
            view_link: "view_domain",
            heading: "Domains",
            buy_link: "domain_order",
            list_link: "view_domains_list"
        },
        webhosting: {
            icon: "window-maximize",
            view_link: "view_website",
            heading: "Web Hosting",
            buy_link: "order_website",
            list_link: "view_websites_list"
        },
        vps: {
            icon: "cloud-meatball",
            view_link: "view_vps",
            heading: "VPS",
            buy_link: "order_vps",
            list_link: "view_vps_list"
        },
        licenses: {
            icon: "id-card",
            view_link: "view_license",
            heading: "Licenses",
            buy_link: "order_license",
            list_link: "view_licenses_list"
        },
        backups: {
            icon: "warehouse",
            view_link: "view_backup",
            heading: "Storages",
            buy_link: "order_storage",
            list_link: "view_backups_list"
        },
        servers: {
            icon: "server",
            view_link: "view_server",
            heading: "Dedicated Servers",
            buy_link: "order_server",
            list_link: "view_servers_list"
        },
        quickservers: {
            icon: "database",
            view_link: "view_qs",
            heading: "Quick Servers",
            buy_link: "order_quickserver",
            list_link: "view_quickservers_list"
        }
    }
})
const services = ref({
    domains: {
        links: {
            376503: "hostingenuity.com",
            592337: "detain.dev",
            376114: "pimpmy.website"
        },
        count: 5
    },
    webhosting: {
        links: {
            376359: "hussfamily.com",
            376473: "fancytush.com",
            386218: "admincoded.net"
        },
        count: 7
    },
    vps: {
        links: {
            242828: "vps242828 (vault3)",
            2578866: "vps2578866 (my-web-2)",
            2500081: "pdns3.is.cc (PowerDNS 3)"
        },
        count: 19
    },
    licenses: {
        links: {
            386522: "192.64.80.218"
        },
        count: 1
    },
    servers: {
        links: {
            16058: "mysqlcluster1.is.cc (1 x Six-Core E5-2620 64GB 10Tb (1Gb Port) 5 Vlan Ips (/29) Ubuntu 20.04 Linux No RAID Customers IP 70.44.33.193 plug it into the same rack that my-mysql1 is on.  if it has room for a 2nd network card could you add a 2nd 1gb port (one for a single live ip and one to plugin to the same private switch my-mysql1 uses))"
        },
        count: 1
    },
    backups: {
        links: [],
        count_link: '<span class="badge bg-danger float-right">0</span>',
        count: 0
    }
})

const affiliateUrl = ref("https://www.interserver.net/r/2773")
const pin = ref("123456")
const affiliateAmount = ref("100")
function $t(key) {
    // You need to implement your translation logic here
    return key;
}
</script>

<template>
    <div class="row">
        <div class="col-md-12 mb-2">
            <div class="row">
                <div class="col-md-4">
                    <div class="small-box bg-yellow">
                        <div class="inner pt-3 pb-2 px-3 text-white">
                            <h3>{{ $t('Welcome, ') }}{{ full_name }}</h3>
                            <p class="py-3 mt-3 mb-2">
                                <b>{{ $t('Last Login: ') }}</b>{{ last_login }}
                            </p>
                        </div>
                        <div class="icon">
                            <i class="fa fa-id-card"></i>
                        </div>
                        <div class="small-box-footer">
                            <b>{{ $t('Last Login IP: ') }}</b>{{ last_login_ip }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-success">
                        <div class="inner pt-3 pb-2 px-3">
                            <h3>{{ $t('PrePay Balance') }}</h3>
                            <p class="py-3 mt-3 mb-2" v-if="balance">
                                <b>{{ $t('Prepay Remaining Balance: ') }}</b>{{ balance }}
                            </p>
                        </div>
                        <div class="icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="small-box-footer">
                            <a href="/prepays" class="text-bold text-white" data-toggle="tooltip" title="{{ $t('Manage Your PrePay Account') }}">
                                {{ $t('Manage Account') }}&nbsp;<i class="fa fa-pencil text-sm"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-info">
                        <div class="inner pt-3 pb-2 px-3">
                            <h3>{{ $t('Unpaid Invoices') }}</h3>
                            <div class="pt-2">
                                <b>{{ $t('Total Unpaid Invoices: ') }}</b>{{ invoice_list }}
                            </div>
                            <div class="mb-2 mt-2">
                                <b>{{ $t('Total Amount To Be Paid: ') }}</b>{{ amount }}
                            </div>
                        </div>
                        <div class="icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="small-box-footer">
                            <a href="/cart?invoice_days=-1" class="text-bold text-white" data-toggle="tooltip" title="{{ $t('Pay Total Amount') }}">
                                <i class="fa fa-dollar text-sm"></i>&nbsp;{{ $t('Pay Now') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-100 d-flex bg-white p-3 mb-5 callpin">
                <i class="fas fa-key" style="font-size: 20px; padding: 5px;"></i>
                <h5 style="position: relative; top: 5px; left: 10px;">{{ $t('Call in Pin:') }}</h5>
                <h5 style="position: relative; left: 15px; top: 5px; font-weight: bold; font-size: 20px;">
                    {{ pin }}
                </h5>
            </div>
            <div v-if="tickets.length > 0" class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2 float-left">
                                    <i class="fa fa-ticket"></i>{{ $t('Recent Tickets') }}
                                </h3>
                                <div class="card-tools float-right">
                                    <a href="/tickets_list" class="btn btn-custom btn-sm" data-toggle="tooltip" title="{{ $t('View All Tickets') }}">
                                        <i class="fa fa-eye"></i>&nbsp;&nbsp;{{ $t('View All') }}&nbsp;&nbsp;
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-sm text-center">
                                <thead>
                                    <tr>
                                        <th>{{ $t('Ticket ID') }}</th>
                                        <th>{{ $t('Subject') }}</th>
                                        <th>{{ $t('Last Replier') }}</th>
                                        <th>{{ $t('Status') }}</th>
                                        <th>{{ $t('Action') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="ticket in tickets" :key="ticket.ticketid">
                                        <td>{{ ticket.ticketmaskid }}</td>
                                        <td>{{ ticket.subject }}</td>
                                        <td>{{ ticket.lastreplier }}</td>
                                        <td>{{ ticketStatusView[ticket.ticketstatusid] }}</td>
                                        <td>
                                            <a class="btn btn-primary btn-sm" data-toggle="tooltip" title="{{ $t('Edit Ticket') }}" :href="'/view_ticket?ticket=' + ticket.ticketid">
                                                <i class="fa fa-pencil"></i>&nbsp;{{ $t('Edit') }}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div v-for="(value, module) in services" :key="module" class="col-md-4 px-3 mb-3 b-radius">
                    <div class="card">
                        <div class="card-header home-card" style="background-color: rgba(0,0,0,.03) !important;">
                            <h2 class="card-title mt-2 text-lg">
                                <i :class="'fa fa-' + details.modules[module].icon"></i>
                                <span>{{ details.modules[module].heading }}</span>
                            </h2>
                            <div class="card-tools float-right">
                                <span class="card-subtitle mb-2 text-muted float-right mt-2">
                                    <a class="badge bg-success float-right" data-toggle="tooltip" title="View All" :href="details.modules[module].list_link">{{ value.count }}</a>
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <template v-if="value.links.length === 0">
                                    <li class="list-group-item">{{ $t('No Active Services') }}</li>
                                </template>
                                <template v-else>
                                    <li v-for="(serviceDesc, serviceId) in value.links" :key="serviceId" class="list-group-item" style="overflow: clip; white-space: nowrap;">
                                        <a :href="details.modules[module].view_link + '?id=' + serviceId">{{ serviceDesc }}</a>
                                    </li>
                                </template>
                                <li class="m-3 text-center order-button" style="list-style-type:none;">
                                    <a :href="details.modules[module].buy_link" class="btn order">{{ $t('Order Now') }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card card-navy mt-3" style="border-radius: 9px;transition-duration: 0.3s;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="d-flex aff-main">
                                        <div class="text-md my-2 aff-heading">{{ $t("Earn") }} {{ `$${affiliateAmount}` }} {{ $t("Per Sale:") }}</div>
                                        <div class="form-group aff-body"><input id="affiliateinput" type="text" class="form-control" placeholder="Affiliate URL" :value="affiliateUrl"></div>
                                        <button id="copy_url" type="submit" class="btn btn-primary aff-btn" @click="copyToClipboard">{{ $t("Copy to Clipboard") }}</button>
                                    </div>
                                    <div class="m-2 aff-share">
                                        <h4 class="mx-2 aff-social">{{ $t("Share with:") }}</h4>
                                        <a class="mx-2" href="https://www.facebook.com/sharer/sharer.php?u={{ socialMediaUrl }}&amp;title=InterServer Web Hosting and VPS" title="InterServer Web Hosting and VPS" @click.prevent="shareOnFacebook"><img class="social" alt="Share on Facebook" src="images/social_flat_rounded_rects_svg/Facebook.svg"></a>
                                        <a class="mx-2" href="https://twitter.com/intent/tweet?source=https%3A%2F%2Finterserver.net&amp;text=&quot;Write something here&quot; @interserver {{ socialMediaUrl }}&amp;" @click.prevent="shareOnTwitter" title="Tweet"><img class="social" alt="Tweet" src="images/social_flat_rounded_rects_svg/Twitter.svg"></a>
                                        <a class="mx-2" href="http://www.linkedin.com/shareArticle?mini=true&amp;url={{ socialMediaUrl }}&amp;title=affiliate%20link%20{{ socialMediaUrl }}&amp;summary=Very happy with the web hosting service @interserver give them a try if you have a website {{ socialMediaUrl }}" @click.prevent="shareOnLinkedIn" title="Share on LinkedIn"><img class="social" alt="Share on LinkedIn" src="images/social_flat_rounded_rects_svg/LinkedIn.svg"></a>
                                        <a class="mx-2" href="http://pinterest.com/pin/create/button/?url={{ socialMediaUrl }}&amp;media=test&amp;description=Very happy with the web hosting service @interserver give them a try if you have a website {{ socialMediaUrl }}" @click.prevent="shareOnPinterest" title="Pin it"><img class="social" alt="Pin it" src="images/social_flat_rounded_rects_svg/Pinterest.svg"></a>
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
</style>
