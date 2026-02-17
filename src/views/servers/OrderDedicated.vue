<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import Swal from 'sweetalert2';
import { useSiteStore } from '@/stores/site.store';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);
const basePrice = ref(0);
const discountPercent = ref(0);
const regions = ref<Region[]>([]);
const selectedRegion = ref<number | null>(null);
const hostname = ref('');
const rootPassword = ref('');
const comments = ref('');
const subtotal = computed(() => basePrice.value + optionsTotal.value);
const discountAmount = computed(() => subtotal.value * (discountPercent.value / 100));
const total = computed(() => Math.max(0, subtotal.value - discountAmount.value));
const labels = { ips: 'IPs', bandwidth: 'Bandwidth', os: 'Operating System', cp: 'Control Panel', raid: 'Raid' } as const;
const serverCoupon = ref<ServerCoupon | null>(null);
const serverAsset = ref<ServerAsset | null>(null);
const regionName = computed(() => {
    const list = regions.value;
    if (!Array.isArray(list)) return '';
    const region = list.find((r) => r.region_id === selectedRegion.value);
    return region?.region_name ?? '';
});
const selected = reactive<Record<string, number | null>>({
    ips: null,
    bandwidth: null,
    os: null,
    cp: null,
    raid: null,
});
const options = reactive<Record<string, Option[]>>({
    ips: [],
    bandwidth: [],
    os: [],
    cp: [],
    raid: [],
});
const optionsTotal = computed(() =>
    Object.entries(selected).reduce((sum, [key, id]) => {
        if (!id) return sum;
        const opt = options[key]?.find((o) => o.id === id);
        return sum + Number(opt?.monthly_price ?? 0);
    }, 0)
);
const orderSummary = computed(() =>
    (Object.keys(selected) as LabelKey[])
        .map((key) => {
            const id = selected[key];
            if (!id) return null;
            const opt = options[key].find((o) => o.id === id);
            if (!opt) return null;
            return {
                key,
                label: labels[key],
                short_desc: opt.short_desc,
                price: Number(opt.monthly_price),
            };
        })
        .filter(Boolean)
);
siteStore.setPageHeading('Order Dedicated');
siteStore.setTitle('Order Dedicated');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/servers`, 'Servers List'],
    ['/servers/order_dedicated', 'Order Dedicated'],
]);

type LabelKey = keyof typeof labels;


interface ServerCoupon {
    amount: string;
    datacenter: string;
    description: string;
    id: string;
    in_stock: string;
    is_public: string;
    name: string;
    region_id: string;
    region_name: string;
    serveR_region_id: string;
}

interface ServerAsset {
    CPU: string[];
    Memory: string[];
    HD: string[];
    Bandwidth?: string[];
    IPs?: string[];
    Region?: string[];
}

interface InitResponse {
    basePrice: number;
    discountPercent: number;
    coupon?: {
        id: number;
        name: string;
        description: string;
        regionId: number;
    };
    asset?: {
        id: number;
        regionId: number;
        details: Array<{ label: string; category: string; price: number }>;
    };
    options: {
        ips: Option[];
        bandwidth: Option[];
        os: Option[];
        cp: Option[];
        raid: Option[];
    };
    regions: Region[];
}

interface SubmitPayload {
    hostname: string;
    rootPassword: string;
    comments: string;
    selections: Record<string, number | null>;
    region: number | null;
    coupon?: string;
    assetId?: number;
}

interface Option {
    id: number;
    short_desc: string;
    long_desc?: string;
    monthly_price: string;
    os_type?: string;
}

interface Region {
    region_id: number;
    region_name: string;
}

function showLoading() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });
}

async function serverOrderRequest() {
    showLoading();
    const params = new URLSearchParams();
    if (typeof route.query.c === 'string') {
        params.append('c', route.query.c);
    }
    if (typeof route.query.a === 'string') {
        params.append('a', route.query.a);
    }
    const query = params.toString();
    fetchWrapper
        .get(`${baseUrl}/servers/order/buy_now_server?${query}`)
        .then((response) => {
            Swal.close();
            console.log('Response:');
            console.log(response);
            options.bandwidth = response.bandwidth;
            options.cp = response.cp;
            options.ips = response.ips;
            options.os = response.os;
            options.raid = response.raid;
            regions.value = response.regions;
            if (typeof response.a !== 'undefined') {
                serverAsset.value = response.a;
            }
            if (typeof response.c !== 'undefined') {
                serverCoupon.value = response.c;
                basePrice.value = Number(response.c.amount);
            }
            /*
            basePrice.value = response.basePrice;
            discountPercent.value = response.discountPercent ?? 0;
            */
            // Preselect first option per category
            ['cp', 'ips', 'os', 'bandwidth', 'raid'].forEach((key) => {
                if (options[key].length > 0) {
                    selected[key] = options[key][0].id;
                }
            });
            //selected['region'] = regions.value.length > 0 ? regions.value[0].region_id : null;
            selectedRegion.value = regions.value.length > 0 ? regions.value[0].region_id : null;
            loading.value = false;
        })
        .catch((error) => {
            loading.value = false;
            Swal.close();
            console.log('Error:');
            console.log(error);
        });
}

async function submitOrder() {
    try {
        const postData: SubmitPayload = {
            hostname: hostname.value,
            rootPassword: rootPassword.value,
            comments: comments.value,
            selections: selected,
            region: selectedRegion.value,
            coupon: route.query.c as string,
            assetId: Number(route.query.a),
        };
        fetchWrapper
            .post(`${baseUrl}/servers/dedicated`, postData)
            .then((response: InitResponse) => {
                Swal.close();
                console.log('Response:');
                console.log(response);
            })
            .catch((error) => {
                Swal.close();
                console.log('Error:');
                console.log(error);
            });
    } catch (e) {
        error.value = 'Order submission failed';
    }
}

onMounted(async () => {
    serverOrderRequest();
});
</script>

<template>
    <div class="row mb-2">
        <div class="col-sm-12">
            <form method="POST" autocomplete="off">
                <input type="hidden" name="a" value="3288" />
                <table id="dedicated_server" class="table table-bordered table-striped dataTable">
                    <thead class="ui-widget-header">
                        <tr>
                            <td style="text-align: center" colspan="6">
                                <h3 class="p-3 m-0">Order Dedicated Server</h3>
                                <hr class="mt-0" />
                            </td>
                        </tr>
                    </thead>
                    <tbody class="ui-widget-content">
                        <template v-for="(opts, key) in options" :key="key">
                            <tr>
                                <td colspan="6" style="text-align: center">
                                    <span>
                                        <h3 style="background: #f9f9f9" class="py-2 text-lg b-radius border">Select {{ labels[key as LabelKey] ?? key }}</h3>
                                    </span>
                                </td>
                            </tr>
                            <tr v-for="opt in opts" :key="opt.id">
                                <td colspan="6" style="text-align: left">
                                    <span>
                                        <div class="icheck-success w-100" style="display: inline">
                                            <input v-model="selected[key]" type="radio" :name="key" :value="opt.id" class="form-check-input" />
                                            <label class="font-weight-normal w-100" for="ips9">
                                                <div class="row mb-2">
                                                    <div class="col-md-8">
                                                        <div class="text-sm text-bold">{{ opt.short_desc }}</div>
                                                    </div>
                                                    <div class="col-md-4 text-right">
                                                        <span class="text-md text-bold pl-2 text-green">${{ Number(opt.monthly_price).toFixed(2) }}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </span>
                                </td>
                            </tr>
                        </template>
                        <tr>
                            <td colspan="6" style="text-align: center">
                                <span><h3 style="background: #f9f9f9" class="py-2 text-lg b-radius border">Server Region</h3></span>
                            </td>
                        </tr>
                        <tr v-for="region in regions" :key="region.region_id">
                            <td colspan="1" style="text-align: left">
                                <span>
                                    <div class="icheck-success w-100" style="display: inline">
                                        <input v-model="selectedRegion" type="radio" clasls="form-check-input" name="region" :value="region.region_id" />
                                        <label class="font-weight-normal w-100" for="region-2">
                                            <div class="row mb-2">
                                                <div class="col-md-8">
                                                    <div class="text-sm text-bold">{{ region.region_name }}</div>
                                                </div>
                                                <div class="col-md-4 text-right"><span class="text-md text-bold pl-2 text-green"></span></div>
                                            </div>
                                        </label>
                                    </div>
                                </span>
                            </td>
                            <td colspan="5" style="text-align: left">
                                <span>&nbsp;</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><h3 style="border: 1px solid #ccc; background: #f9f9f9" class="py-2 text-lg b-radius mt-2">Enter Server Details</h3></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><label class="m-0" for="servername">Server Hostname</label></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><input id="servername" v-model="hostname" tabindex="0" type="text" name="servername" size="30" placeholder="server.hostname.com" class="form-control" autocomplete="off" /></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span>
                                    <small class="form-text text-muted">
                                        <b>Example: server.hostname.com</b><br />
                                        Use the hostname to identify the server. The domain does not need to be valid or registered. One period is required in the hostname. Other examples: database.local, web.server or your.name.
                                    </small>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><label class="m-0" for="root_pass">Root Password</label></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><input id="root_pass" v-model="rootPassword" tabindex="0" type="text" name="rootpass" size="30" placeholder="Enter Password" class="form-control" autocomplete="off" ß="" /></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><small class="form-text text-muted"> Note: Password must contain atleast 8 characters,one lowercase letter, one uppercase letter, one number, a special character. </small></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span><label class="m-0" for="comment">Comments</label></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: left">
                                <span>
                                    <textarea id="comment" v-model="comments" placeholder="Enter Comment" class="form-control" name="comments" rows="7" cols="30"></textarea>
                                    <hr />
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: center">
                                <span><input type="submit" value="Add to cart" class="btn btn-order py-2 px-3 b-radius mb-3" /></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <form method="post">
                <input type="hidden" name="choice" value="order_dedicated" />
                <table id="order_summary" class="table table-bordered table-striped dataTable">
                    <thead class="ui-widget-header">
                        <tr>
                            <td style="text-align: center" colspan="3">
                                <h3 class="p-3 m-0">Order Summary</h3>
                                <hr class="mt-0" />
                            </td>
                        </tr>
                    </thead>
                    <tbody class="ui-widget-content">
                        <tr>
                            <td colspan="3" style="text-align: left">
                                <span>
                                    <div class="order_summary w-100 d-block" style="border-bottom: 1px solid #ccc">
                                        <template v-for="(rows, cat, index) in serverAsset" :key="index">
                                            <div v-for="(row, idx) in rows" :key="idx" class="label-row">
                                                <div class="text">
                                                    {{ row }}<span class="badge">{{ cat }}</span>
                                                </div>
                                                <div class="price">$0.00</div>
                                            </div>
                                        </template>
                                        <div v-for="item in orderSummary" :key="item?.key" class="label-row js-added-row">
                                            <div class="text">
                                                {{ item?.short_desc }}<span class="badge">{{ item?.label }}</span>
                                            </div>
                                            <div class="price">${{ item?.price.toFixed(2) }}</div>
                                        </div>
                                        <div class="label-row js-added-row">
                                            <div class="text">{{ regionName }}<span class="badge">region</span></div>
                                            <div class="price">$0.00</div>
                                        </div>
                                    </div>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: left">
                                <span><div class="w-100 d-block pb-2 font-weight-bold">Monthly Total</div></span>
                            </td>
                            <td colspan="1" style="text-align: right">
                                <span>
                                    <div id="total_price" class="w-100 d-block pb-2 font-weight-bold">${{ total.toFixed(2) }}</div>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>

    <div class="order-dedicated">
        <h2>Order Dedicated Server</h2>
        <div v-if="loading">Loading…</div>
        <div v-if="error" class="error">{{ error }}</div>
        <form v-if="!loading" @submit.prevent="submitOrder">
            <!-- REGION -->
            <section>
                <h3>Server Region</h3>
                <label v-for="r in regions" :key="r.region_id">
                    <input v-model="selectedRegion" type="radio" name="region" :value="r.region_id" :disabled="selectedRegion !== r.region_id" />
                    {{ r.region_name }}
                </label>
            </section>
            <!-- SUMMARY -->
            <aside class="order-summary">
                <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
                <p v-if="discountPercent">Discount ({{ discountPercent }}%): -${{ discountAmount.toFixed(2) }}</p>
                <strong>Total: ${{ total.toFixed(2) }}</strong>
            </aside>
            <button type="submit">Add to Cart</button>
        </form>
    </div>
</template>

<style scoped>
#dedicated_server td,
#dedicated_server th,
#order_summary td,
#order_summary th {
    border: none !important;
    background: white !important;
    padding: 5px 15px !important;
}

#order_summary {
    position: fixed;
    top: 12%;
    border: 0px !important;
    border-radius: 8px;
    width: 25%;
    margin: auto;
    float: right;
    left: 70%;
}

#dedicated_server {
    position: relative;
    width: 50%;
    left: 10%;
}

#dedicated_server,
#order_summary {
    border-collapse: separate;
    border-spacing: 0px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    transition-duration: 0.4s;
}

#dedicated_server .ui-widget-header,
#dedicated_server .ui-widget-content,
#order_summary .ui-widget-header,
#order_summary .ui-widget-content {
    border: 0px !important;
}

#dedicated_server:hover,
#order_summary:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    transition-duration: 0.4s;
}

tr:has(td > span > h3.hidden-options),
tr:has(td > span > div.hidden-options) {
    display: none !important;
}

.order_summary div.label-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    margin: 5px 0;
}

.order_summary div.label-row:not(:nth-last-child(1)) {
    border-bottom: 1px solid #ddd;
}

.order_summary div.label-row .text {
    text-align: left;
    font-size: 14px;
    color: #333;
}

.order_summary div.label-row .price {
    text-align: right;
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.order_summary .badge {
    display: inline-block;
    background-color: #dbdbdb;
    color: black;
    padding: 3px 6px;
    margin-left: 8px;
    border-radius: 8px;
    font-size: 11px;
    text-transform: capitalize;
}

@media only screen and (max-width: 767px) {
    #dedicated_server {
        display: block !important;
        position: relative;
        width: 100% !important;
        left: 0% !important;
    }
    #order_summary {
        display: block !important;
        position: relative;
        top: 0%;
        width: 100%;
        float: none;
        left: 0%;
        background-color: #fff;
    }
    #order_summary .ui-widget-header {
        width: 100%;
        display: inline-table;
    }
    #order_summary .ui-widget-content {
        display: inline-table;
    }
}

.order-summary {
    border-top: 1px solid #ccc;
    margin-top: 1rem;
}
.error {
    color: red;
}
</style>
