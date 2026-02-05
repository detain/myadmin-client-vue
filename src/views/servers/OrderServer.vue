<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import Swal from 'sweetalert2';
import { useSiteStore } from '../../stores/site.store';
import type { SimpleStringObj, ServerOrderResponse, CpuCores, ConfigIds, FormValues, FieldLabel, ConfigLi, CpuLi, Region, MemoryLi, HdLi, BandwidthLi, IpsLi, OsLi, CpLi, RaidLi, CpuRow, CpuCoresRow, MemoryRow, HdRow, BandwidthRow, IpsRow, OsRow, CpRow, RaidRow } from '../../types/servers_order.ts';
import $ from 'jquery';
import type { CouponInfo } from '../../types/vps_order.ts';
const module: string = 'servers';
const siteStore = useSiteStore();
const country = ref('US');
const baseUrl = siteStore.getBaseUrl();
const currency = ref('USD');
const cust_discount = ref(0);
const step = ref('order_form');
const cpu = ref<number>(34);
const cpu_li = ref<CpuLi>({});
const configIds = ref<ConfigIds>({});
const formValues = ref<FormValues>({});
const regions = ref<Region[]>([]);
const configLi = ref<ConfigLi>({
    cpu_li: {},
    memory_li: {},
    hd_li: {},
    bandwidth_li: {},
    ips_li: {},
    os_li: {},
    cp_li: {},
    raid_li: {},
});
const servername = ref('');
const rootpass = ref('');
const comment = ref('');
const cpuCores = ref<CpuCores>({});
const hdValues = computed(() => {
    return configLi.value.hd_li;
});
const buyItServers = ref<BuyNowServer[]>([]);
const assetServers = ref<AssetServer[]>([]);
const displayShowMore = ref<'yes' | 'no'>('no');
const fieldLabel = ref<FieldLabel>({
    bandwidth: { name: 'Bandwidth', active: 1 },
    ips: { name: 'IPs', active: 0 },
    os: { name: 'Operating System', active: 1 },
    cp: { name: 'Control Panel', active: 0 },
    raid: { name: 'Raid' },
    memory: { name: 'Memory' },
    hd: { name: 'Hard Drives' },
});
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const coupon = ref('');
const setupTimes: Record<string, string> = { '2': '48 hrs', '9': '5 days', '11': '3 days' };
const drives = reactive<{ id: number; type: 'lff' | 'sff' | 'nve'; desc: string; price: number }[]>([]);
const curLff = ref(0);
const curSff = ref(0);
const curNve = ref(0);
const maxLff = computed(() => Number(configLi.value.cpu_li[cpu.value]?.max_lff ?? 0));
const maxSff = computed(() => Number(configLi.value.cpu_li[cpu.value]?.max_sff ?? 0));
const maxNve = computed(() => Number(configLi.value.cpu_li[cpu.value]?.max_nve ?? 0));
const totalCost = ref(0);
const discountCost = ref(0);
const totalPayable = ref(0);
const lastOs = ref<string | number | null>(null);
const money = (val: number) => Intl.NumberFormat(`en-${country.value}`, { style: 'currency', currency: currency.value }).format(val);
siteStore.setPageHeading('Order Server');
siteStore.setTitle('Order Server');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/servers`, 'Servers List'],
    ['/servers/order', 'Order Server'],
]);

type ComponentKey = keyof FormValues;

interface BuyNowServer {
    name: string;
    description: string;
    amount_disp: string;
}

interface AssetServer {
    id: number;
    CPU: string[];
    Memory: string[];
    HD: string[];
    Bandwidth?: string[];
    IPs?: string[];
    Region?: string[];
    price: string;
}

function imageUrl(imageName: string) {
    const trimmed = imageName.trim();
    return new URL(`../../assets/images/v2-images/${trimmed}`, import.meta.url).href;
}

function setupTime(regionId: string) {
    return setupTimes[regionId] ?? '48 hrs';
}

function addDrive(id: number, type: 'lff' | 'sff' | 'nve', desc: string, price: number) {
    if ((type === 'lff' && Number(curLff.value) >= Number(maxLff.value)) || (type === 'sff' && Number(curSff.value) >= Number(maxSff.value)) || (type === 'nve' && Number(curNve.value) >= Number(maxNve.value))) {
        return;
    }
    drives.push({ id, type, desc, price });
    if (type === 'lff') {
        curLff.value++;
        if (Number(maxLff.value) === Number(maxSff.value)) curSff.value++;
    } else if (type === 'sff') {
        curSff.value++;
        if (maxLff.value === maxSff.value) curLff.value++;
    } else {
        curNve.value++;
    }
    updatePrice();
}

function removeDrive(id: number, type: 'lff' | 'sff' | 'nve') {
    const idx = drives.findIndex((d) => d.id === id);
    if (idx === -1) return;
    drives.splice(idx, 1);
    if (type === 'lff') {
        curLff.value--;
        if (maxLff.value === maxSff.value) curSff.value--;
    } else if (type === 'sff') {
        curSff.value--;
        if (maxLff.value === maxSff.value) curLff.value--;
    } else {
        curNve.value--;
    }
    updatePrice();
}

function canAddDrive(type: 'lff' | 'sff' | 'nve') {
    if (type === 'lff') return curLff.value < maxLff.value;
    if (type === 'sff') return curSff.value < maxSff.value;
    if (type === 'nve') {
        if ((cpu.value === 58 || cpu.value === 107) && curNve.value >= 2) return false;
        return curNve.value < maxNve.value;
    }
    return false;
}

function canRemoveDrive(id: number) {
    return drives.some((d) => d.id === id);
}

function updatePrice() {
    let total = 0;
    const components: ComponentKey[] = ['cpu', 'memory', 'bandwidth', 'ips', 'os', 'cp', 'raid'];
    components.forEach((input) => {
        const val = formValues.value[input];
        if (!val) return;
        if (val === undefined || val === null || val === 0) return;

        if (input === 'memory') {
            total += Number(configLi.value.memory_li[cpu.value][val].monthly_price);
        } else {
            total += Number(configLi.value[`${input}_li`][val].monthly_price);
        }
    });
    drives.forEach((d) => (total += d.price));
    totalCost.value = total;
    if (cust_discount.value > 0) {
        discountCost.value = total * (cust_discount.value / 100);
        totalPayable.value = total - discountCost.value;
    }
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

function updateCoupon() {
    if (lastCoupon.value != coupon.value) {
        lastCoupon.value = coupon.value;
        (document.getElementById('couponimg') as unknown as HTMLImageElement).src = `https://my.interserver.net/validate_coupon.php?module=${module}&coupon=${coupon.value}`;
        fetch(`https://my.interserver.net/ajax/coupon_info.php?module=${module}&coupon=${encodeURIComponent(coupon.value)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json() as Promise<CouponInfo>;
            })
            .then((json) => {
                couponInfo.value = json;
                if (typeof json.applies !== 'undefined') {
                    // update_vps_choices();
                    if (couponInfo.value.onetime === '0') {
                        // update_vps_choices_order();
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to load coupon info:', error);
            });
    }
}

function onSubmitCpu(idCpu: number, idHd: number) {
    cpu.value = idCpu;
    serverOrderRequest(idCpu, idHd);
}

function serverOrderRequest(idCpu?: number, idHd?: number) {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    const params = new URLSearchParams();
    if (idCpu) {
        params.append('cpu', String(idCpu));
    }
    if (idHd) {
        params.append('hd', String(idHd));
    }
    const query = params.toString();
    const url = query ? `${baseUrl}/servers/order?${query}` : `${baseUrl}/servers/order`;
    fetchWrapper.get(url).then((response: ServerOrderResponse) => {
        Swal.close();
        console.log('Response:');
        console.log(response);
        configIds.value = response.config_ids;
        configLi.value = response.config_li;
        cpu.value = response.cpu;
        cpu_li.value = response.cpu_li;
        cpuCores.value = response.cpu_cores;
        fieldLabel.value = response.field_label;
        formValues.value = response.form_values;
        displayShowMore.value = response.display_showmore;
        assetServers.value = response.asset_servers;
        buyItServers.value = response.buy_it_servers;
        regions.value = response.regions;
        cust_discount.value = response.cust_discount;
        console.log('buy it servers:', buyItServers.value, buyItServers.value.length);
        console.log('asset servers:', assetServers.value, assetServers.value.length);
        if (query) {
            step.value = 'step2';
        }
    });
}

watch(
    () => formValues.value.os,
    (os) => {
        if (os === lastOs.value) return;
        lastOs.value = os;
        const allowed = Object.values(configLi.value.cp_li).filter((cp) => cp.types.includes(os));
        if (allowed.length) {
            formValues.value.cp = allowed[0].id;
        }
        updatePrice();
    }
);

watch(() => ({ ...formValues.value, drives: drives.length }), updatePrice, { deep: true });

onMounted(() => {
    curLff.value = 0;
    curSff.value = 0;
    curNve.value = 0;
    drives.splice(0);
    updatePrice();
});

serverOrderRequest();
</script>

<template>
    <template v-if="!step || step == 'order_form'">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server</h3>
                            <div class="card-tools float-right">
                                <router-link to="/servers" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init">
                            <div class="form-group row">
                                <div class="input-group col-md-12">
                                    <template v-for="(cpuDetails, coreKey) in cpuCores" :key="coreKey">
                                        <template v-for="cpuDetail in cpuDetails" :key="cpuDetail.id">
                                            <div class="d-flex w-100">
                                                <!-- CPU -->
                                                <div class="col-4">
                                                    <img class="d-block" style="max-width: 75px" :src="imageUrl(cpuDetail.img)" alt="" />
                                                    <span class="text-lg font-weight-light">{{ cpuDetail.short_desc }}</span>
                                                    <div>({{ cpuDetail.num_cpus }} cpu, {{ cpuDetail.num_cores }} cores)</div>
                                                </div>
                                                <!-- Memory -->
                                                <div class="col">
                                                    <div class="text-lg">{{ cpuDetail.memory_det?.short_desc }}</div>
                                                    <div class="text-sm">RAM</div>
                                                </div>
                                                <!-- HDD -->
                                                <div class="col">
                                                    <div class="text-lg">{{ cpuDetail.hd_det?.short_desc }}</div>
                                                    <div class="text-sm">HDD</div>
                                                </div>
                                                <!-- Speed -->
                                                <div class="col">
                                                    <div class="text-lg">
                                                        <template v-if="cpuDetail.speed">{{ cpuDetail.speed }} GHz</template>
                                                    </div>
                                                    <div class="text-sm">Speed</div>
                                                </div>
                                                <!-- Price -->
                                                <div class="col">
                                                    <div class="text-green text-lg">{{ cpuDetail.monthly_fee }}</div>
                                                    <div class="text-sm">/mo</div>
                                                </div>
                                                <!-- Select button -->
                                                <div class="col my-auto text-center">
                                                    <button type="button" class="btn btn-custom btn-sm" @click="onSubmitCpu(cpuDetail.id, cpuDetail.hd_det?.id)">Select</button>
                                                </div>
                                            </div>
                                            <hr class="w-100 m-2" />
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Server Recommendations -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-hand-o-right">&nbsp;</i>Recommendations</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-for="(cpu_det, core) in cpuCores" :key="core">
                            <a :id="'core-' + core" href="javascript:void(0);" data-toggle="modal" :data-target="'#coreM-' + core" class="btn btn-sm btn-secondary m-2" style="min-width: 100px">{{ core }}-Cores</a>
                            <div :id="'coreM-' + core" class="modal fade">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header border-0 p-4">
                                            <h4>{{ core }}-Cores Servers</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div v-for="cpu_details in cpu_det" :key="cpu_details.id">
                                                <div class="row">
                                                    <div class="col"><img :src="imageUrl(cpu_details.img)" alt="" style="max-width: 100px" /></div>
                                                    <div class="col">
                                                        <div class="font-weight-light text-lg">{{ cpu_details.short_desc }}</div>
                                                        <div class="text-green text-sm">{{ cpu_details.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-lg">{{ cpu_details.memory_det.short_desc }}</div>
                                                        <div class="text-sm">RAM</div>
                                                        <div class="text-green text-sm">{{ cpu_details.memory_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div v-if="cpu_details.hd_det" class="text-lg">{{ cpu_details.hd_det.short_desc }}</div>
                                                        <div class="text-sm">HDD</div>
                                                        <div v-if="cpu_details.hd_det" class="text-green text-sm">{{ cpu_details.hd_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-green text-lg">{{ cpu_details.monthly_fee }}</div>
                                                        <div class="text-sm">Total Cost per month</div>
                                                    </div>
                                                    <div class="col">
                                                        <button type="button" class="btn btn-green btn-sm mt-2 px-4 py-2" @click="onSubmitCpu(cpu_details.id, cpu_details.hd_det?.id)">Order</button>
                                                    </div>
                                                </div>
                                                <hr class="w-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- End Server Recommendations -->
                <!-- Buy Now Servers -->
                <div v-if="(buyItServers && buyItServers.length > 0) || (assetServers && assetServers.length > 0)" class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2">
                                <i class="fa fa-thumbs-up">&nbsp;</i> Buy It Now Servers
                                <div><sub>Pre-configured servers ready to use!</sub></div>
                            </h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Buy It Now Servers -->
                            <template v-if="buyItServers && buyItServers.length">
                                <div v-for="server in buyItServers" :key="server.name" class="card mx-2" style="width: 46% !important">
                                    <div class="card-header bg-secondary">
                                        <h5 class="card-title text-center">{{ server.name }}</h5>
                                    </div>
                                    <div class="card-body" v-html="server.description.replace(/\n/g, '<br>')" />
                                    <div class="card-footer text-center">
                                        <div class="font-weight-bold">{{ server.amount_disp }}</div>
                                        <hr class="w-100 m-1" />
                                        <a :href="`order_dedicated?c=${encodeURIComponent(server.name)}`" class="btn btn-sm btn-custom font-weight-bold" style="min-width: 100px">Order Now</a>
                                    </div>
                                </div>
                            </template>
                            <!-- Asset Servers -->
                            <template v-if="assetServers && assetServers.length">
                                <div v-for="asset in assetServers" :key="asset.id" class="card mx-2" style="width: 46% !important">
                                    <div class="card-header bg-secondary">
                                        <h5 class="card-title text-center">{{ asset.CPU[0] }} SALE</h5>
                                    </div>
                                    <div class="card-body">
                                        {{ asset.CPU[0] }}<br />
                                        {{ asset.Memory[0] }} Memory<br />
                                        <template v-for="(hd, i) in asset.HD" :key="i"> {{ hd }}<br /> </template>
                                        <template v-if="asset.Bandwidth?.[0]"> {{ asset.Bandwidth[0] }}<br /> </template>
                                        <template v-if="asset.IPs?.[0]"> {{ asset.IPs[0] }}<br /> </template>
                                        <template v-if="asset.Region">
                                            {{ asset.Region }}
                                        </template>
                                    </div>
                                    <div class="card-footer text-center">
                                        <div class="font-weight-bold">{{ asset.price }}</div>
                                        <hr class="w-100 m-1" />
                                        <a :href="`order_dedicated?a=${asset.id}`" class="btn btn-sm btn-custom font-weight-bold" style="min-width: 100px">Order Now</a>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <!-- Show More -->
                    <div :v-if="displayShowMore == 'yes'" class="card-footer text-center">
                        <a class="btn bg-secondary" href="https://www.interserver.net/dedicated/buy-now-servers.html" target="_blank" rel="noopener">Show More</a>
                    </div>
                </div>
                <!-- End Buy Now Servers -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'step2'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server</h3>
                            <div class="card-tools float-right">
                                <router-link to="/servers/order" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init" action="order_server">
                            <input id="cpu" type="hidden" name="cpu" :value="formValues.cpu" />
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order" />
                            <template v-for="(inputDetails, inputName) in configLi" :key="inputName">
                                <template v-if="inputName !== 'cpu_li'">
                                    <template v-if="['memory_li', 'hd_li'].includes(inputName as string)">
                                        <div class="form-group row">
                                            <label class="col-md-3 col-form-label text-right">
                                                {{ fieldLabel[(inputName as string).replace('_li', '')].name }}
                                                <span class="text-danger"> *</span>
                                            </label>
                                            <div class="input-group col-md-9">
                                                <template v-for="(details, id) in inputDetails[cpu.toString()]" :key="id">
                                                    <div class="icheck-success d-inline w-100">
                                                        <input v-if="inputName === 'memory_li'" :id="`ds-memory-${id}`" v-model="formValues.memory" type="radio" class="form-check-input" name="memory" :value="id" />
                                                        <label v-if="Object.keys(inputDetails[cpu.toString()])[0] === String(id) && inputName === 'hd_li'" class="font-weight-normal w-100">
                                                            <div class="row mb-2">
                                                                <div class="col-md-12">
                                                                    <table class="table-sm table-bordered table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Drive Type</th>
                                                                                <th>LFF</th>
                                                                                <th>SFF</th>
                                                                                <th>NVE</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Max Drives</td>
                                                                                <td id="drives-lff">{{ curLff }}/{{ maxLff }}</td>
                                                                                <td id="drives-sff">{{ curSff }}/{{ maxSff }}</td>
                                                                                <td id="drives-nve">{{ curNve }}/{{ maxNve }}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </label>
                                                        <label v-if="Object.keys(inputDetails[cpu.toString()])[0] !== String(id) || inputName !== 'hd_li'" :for="'ds-' + (inputName as string).replace('_li', '') + '-' + id" :class="'font-weight-normal w-100' + (inputName === 'hd_li' ? ' drive-row-' + details.drive_type : '')">
                                                            <div class="row mb-2">
                                                                <div class="col-md-8">
                                                                    <div class="text-md font-weight-light">
                                                                        <template v-if="inputName === 'hd_li'">
                                                                            <button :id="'drive-remove-' + id" type="button" class="remove-button btn btn-xs btn-secondary pb-0" @click="removeDrive(Number(id), details.drive_type)">
                                                                                <i class="fa fa-minus"></i>
                                                                            </button>
                                                                            <b>/</b>
                                                                            <button :id="'drive-add-' + id" type="button" class="add-button btn btn-success btn-xs pb-0" @click="addDrive(Number(id), details.drive_type, details.short_desc, details.monthly_price)">
                                                                                <i class="fa fa-plus"></i>
                                                                            </button>
                                                                        </template>
                                                                        <span class="text-bold ml-2 text-sm">{{ details.short_desc }}</span>
                                                                        <template v-if="inputName === 'hd_li'">
                                                                            <span class="badge bg-info ml-2">{{ details.drive_type }}</span>
                                                                        </template>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-4 text-right">
                                                                    <span class="text-md text-bold text-green pl-2">{{ details.monthly_price_display }}</span>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                    <div v-else-if="fieldLabel[(inputName as string).replace('_li', '')]" class="form-group row">
                                        <label class="col-md-3 col-form-label text-right">
                                            {{ fieldLabel[(inputName as string).replace('_li', '')]?.name }}
                                            <span class="text-danger"> *</span>
                                        </label>
                                        <div class="input-group col-md-9" :class="inputName + '-row'">
                                            <div v-for="(details, id) in inputDetails" :key="id" class="icheck-success d-inline w-100">
                                                <input :id="`ds-${(inputName as string).replace('_li', '')}-${id}`" v-model="formValues[(inputName as string).replace('_li', '')]" type="radio" class="form-check-input" :name="(inputName as string).replace('_li', '')" :value="id" />
                                                <label :for="'ds-' + (inputName as string).replace('_li', '') + '-' + id" class="font-weight-normal w-100">
                                                    <div class="row mb-2">
                                                        <div class="col-md-8">
                                                            <div class="text-bold text-sm">{{ details.short_desc }}</div>
                                                        </div>
                                                        <div class="col-md-4 text-right">
                                                            <span class="text-md text-bold text-green pl-2">{{ details.monthly_price_display }}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label text-right">Server Region <span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9 region-row">
                                    <div v-for="(region, indx) in regions" :key="region.region_id" class="icheck-success d-inline w-100">
                                        <input :id="`region-${indx}`" v-model="formValues.region" type="radio" class="form-check-input" name="region" :value="region.region_id" />
                                        <label class="font-weight-normal w-100" :for="`region-${indx}`">
                                            <div class="row mb-2">
                                                <div class="col-md-8">
                                                    <div class="text-sm text-bold">{{ region.region_name }} [Setup Time - {{ setupTime(region.region_id) }}</div>
                                                </div>
                                                <div class="col-md-4 text-right"><span class="text-md text-bold pl-2 text-green"></span></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order btn-sm px-3 py-2" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Dedicated Server</div>
                            <div id="package_period" class="col text-bold text-right">1 Month(s)</div>
                        </div>
                        <div class="row cpu-row mb-3">
                            <div class="col-md-8">
                                <span class="cpu_name">{{ configLi.cpu_li[cpu].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">CPU</span>
                            </div>
                            <div class="col text-md text-bold cpu_cost text-right">{{ configLi.cpu_li[cpu].monthly_price_display }}</div>
                        </div>
                        <div class="row memory-row mb-3">
                            <div class="col-md-8">
                                <span class="memory_name">{{ configLi.memory_li[cpu][formValues.memory].short_desc }} RAM</span>
                                <span class="badge badge-pill badge-warning ml-2">RAM</span>
                            </div>
                            <div class="col text-md text-bold memory_cost text-right">{{ configLi.memory_li[cpu][formValues.memory].monthly_price_display }}</div>
                        </div>
                        <div id="hd-row" class="d-none"></div>
                        <div class="row bandwidth-row mb-3">
                            <div class="col-md-8">
                                <span class="bandwidth_name">{{ configLi.bandwidth_li[formValues.bandwidth].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                            </div>
                            <div class="col text-md text-bold bandwidth_cost text-right">{{ configLi.bandwidth_li[formValues.bandwidth].monthly_price_display }}</div>
                        </div>
                        <div class="row ips-row mb-3">
                            <div class="col-md-8">
                                <span class="ips_name">{{ configLi.ips_li[formValues.ips].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">IP</span>
                            </div>
                            <div class="col text-md text-bold ips_cost text-right">{{ configLi.ips_li[formValues.ips].monthly_price_display }}</div>
                        </div>
                        <div class="row os-row mb-3">
                            <div class="col-md-8">
                                <span class="os_name">{{ configLi.os_li[formValues.os].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">OS</span>
                            </div>
                            <div class="col text-md text-bold os_cost text-right">{{ configLi.os_li[formValues.os].monthly_price_display }}</div>
                        </div>
                        <div class="row cp-row mb-3">
                            <div class="col-md-8">
                                <span class="cp_name">{{ configLi.cp_li[formValues.cp].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                            </div>
                            <div class="col text-md text-bold cp_cost text-right">{{ configLi.cp_li[formValues.cp].monthly_price_display }}</div>
                        </div>
                        <div class="row raid-row mb-3">
                            <div class="col-md-8">
                                <span class="raid_name">{{ configLi.raid_li[formValues.raid].short_desc }}</span>
                                <span class="badge badge-pill badge-warning ml-2">RAID</span>
                            </div>
                            <div class="col text-md text-bold raid_cost text-right">{{ configLi.raid_li[formValues.raid].monthly_price_display }}</div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-bold total_cost text-right text-lg">{{ totalCost }}</div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'confirm_order'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card shadow-none">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="edit_order_form" method="post" action="order_server">
                            <template v-for="(field_value, field) in formValues">
                                <input v-if="field !== 'hd'" :id="field as string" :key="field" type="hidden" :name="field as string" :value="field_value" />
                            </template>
                            <input v-for="(hd_val, indexx) in hdValues" :key="indexx" class="input-hd" type="hidden" name="hd[]" :value="hd_val" />
                            <input type="hidden" name="Submit" />
                        </form>
                        <form method="post" class="dserver_form_confirm" action="order_server">
                            <template v-for="(field_value, field) in formValues">
                                <input v-if="field !== 'hd'" :id="field as string" :key="field" type="hidden" :name="field as string" :value="field_value" />
                            </template>
                            <input v-for="(hd_val, indexx) in hdValues" :key="indexx" type="hidden" name="hd[]" :value="hd_val" />
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order" />
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Server Hostname<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-8">
                                    <input type="text" class="form-control form-control-sm" name="servername" :value="servername" placeholder="server.hostname.com" required />
                                    <small class="form-text text-muted">
                                        <b>Example: server.hostname.com</b><br />
                                        Use the hostname to identify the server. The domain does not need to be valid or registered. One period is required in the hostname. Other examples: database.local, web.server or your.name.
                                    </small>
                                </div>
                            </div>
                            <div id="rootpassrownew" class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group input-group col-md-8">
                                    <input v-model="rootpass" placeholder="Enter Password" class="form-control form-control-sm" required />
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters,one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-4 col-form-label text-right">Comments</label>
                                <div class="form-group input-group col-md-8">
                                    <textarea id="comment" v-model="comment" placeholder="Enter Comment" rows="5" class="form-control form-control-sm"></textarea>
                                </div>
                            </div>
                            <hr />
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div id="package_name" class="float-left" style="position: relative; top: 5px">Dedicated Server</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" onclick="edit_form()" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div id="package_period" class="text-bold">1 Month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span class="cpu_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">CPU</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cpu_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="memory_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAM</span>
                                        </td>
                                        <td>
                                            <div class="text-bold memory_cost"></div>
                                        </td>
                                    </tr>
                                    <tr v-for="(hdValue, index) in hdValues" :key="index">
                                        <td>
                                            <span class="hd_name">{{ configLi['hd_li'][cpu][Number(index)]['drive_type'].toUpperCase() }} - {{ configLi['hd_li'][cpu][Number(index)]['short_desc'] }}</span>
                                            <span class="badge badge-pill badge-warning ml-2">HDD</span>
                                        </td>
                                        <td>
                                            <div class="text-bold hd_cost">{{ configLi['hd_li'][cpu][Number(index)]['monthly_price_display'] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="bandwidth_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                                        </td>
                                        <td>
                                            <div class="text-bold bandwidth_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="ips_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">IP</span>
                                        </td>
                                        <td>
                                            <div class="text-bold ips_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="os_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">OS</span>
                                        </td>
                                        <td>
                                            <div class="text-bold os_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="cp_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cp_cost"></div>
                                        </td>
                                    </tr>
                                    <tr class="d-none raid-row">
                                        <td>
                                            <span class="raid_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAID</span>
                                        </td>
                                        <td class="text-bold raid_cost"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="col-md-10 text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-bold total_cost text-lg"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="pb-1 pt-3">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <p class="icheck-success text-bold text-center">
                                    <input id="tos" type="checkbox" name="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
