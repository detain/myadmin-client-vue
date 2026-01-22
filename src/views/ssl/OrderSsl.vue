<script setup lang="ts">
import Swal from 'sweetalert2';
import { useSiteStore } from '../../stores/site.store';
import $ from 'jquery';
import type { CouponInfo } from '../../types/vps_order.ts';
import { ref } from 'vue';

const siteStore = useSiteStore();
siteStore.setPageHeading('Order SSL');
siteStore.setTitle('Order SSL');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/ssl', 'SSL List'],
    ['/ssl/order', 'Order SSL'],
]);
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const coupon = ref('');
const module = 'ssl';
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
</script>

<template>
    <div class="row justify-content-center mt-5">
        <div class="col-md-10 text-center">
            <h3 class="text-capitalize pb-2">Find your ssl and check availability.</h3>
            <form method="post" action="ssl_order" class="search-ssl">
                <div class="form-group row justify-content-center">
                    <div class="col-md-5 input-group pb-2">
                        <input
                            id="ssl_search"
                            type="text"
                            class="form-control"
                            name="hostname"
                            value=""
                            autofocus
                            onfocus="
                                let value = this.value;
                                this.value = null;
                                this.value = value;
                            "
                            autocomplete="off"
                            style="border-radius: 5px" />
                    </div>
                </div>
                <div class="form-group row">
                    <div class="controls col-md-12" style="text-align: center">
                        <button type="submit" class="btn btn-custom mr-2 px-4 py-2 text-sm">Search</button>
                        <a target="blank" href="https://interserver.net/ssl_certs" class="btn btn-order px-3 py-2 text-sm">Check Prices</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
