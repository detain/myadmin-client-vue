<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - Banners');
layoutStore.setBreadcrums({'/home': 'Home', '/affiliate': 'Affiliate', '': 'Banners'});


onMounted(() => {
      $('#freetile').freetile({});
})
</script>

<template>
<div class="row">
    <div class="col-md-12">
        <div class="card shadow-none w-100 bg-white p-2 mb-4"
            style="border-left: 4px solid skyblue;display: block ruby;">
            <p class="m-0 text-md">
                <i class="fas fa-info-circle text-info" aria-hidden="true"></i>&nbsp;<b class="text-info">
                    Note:</b>
                &nbsp;For details about banner like HTML Code,
                image size etc. Click on any banner image that you want to use it in your website.
            </p>
            <p></p>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2">
                        <i class="fa fa-link">&nbsp;</i>Useful Affiliate Links
                    </h3>
                    <div class="card-tools float-right">
                        <a href="affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                            <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</a>
                    </div>
                </div>
            </div>
  <div class="card-body">
      <div class="row justify-content-center">
        <div v-for="(linkDet, index) in usefulLinks" :key="index" class="col-md-12">
          <div class="col-md-2 px-0 text-bold">{{ linkDet.page }}</div>
          <div class="col-md-4">
            <input class="inp b-radius form-control form-control-sm" type="text" :value="linkDet.link" readonly disabled>
          </div>
          <div class="col-md-2">
            <button class="btn btn-custom btn-sm mb-3" @click="copyLink(index)">Copy Link To Clipboard</button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="card-header">
      <div class="p-1">
        <h3 class="card-title py-2">
          <i class="fa fa-picture-o">&nbsp;</i>Banners
        </h3>
      </div>
    </div>
    <div class="card-body">
      <div id="freetile">
        <a v-for="(banner, index) in banners" :key="index" :href="`/affiliate?link=view_banner&b=${banner.image}&w=${banner.width}&h=${banner.height}`">
          <img :src="`https://www.interserver.net/logos/${banner.image}`" alt="InterServer Web Hosting and VPS" style="padding: 10px;">
        </a>
      </div>
    </div>
        </div>
    </div>
</div>
<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card shadow-none w-100 bg-white p-2 mb-4" style="border-left: 4px solid skyblue;display: block ruby;">
                <p class="m-0 text-md">
                    <i class="fas fa-info-circle text-info" aria-hidden="true"></i>&nbsp;<b class="text-info">
                        Note:</b>
                    &nbsp;For details about banner like HTML Code,
                    image size etc. Click on any banner image that you want to use it in your website.
                </p>
                <p></p>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-link">&nbsp;</i>Useful Affiliate Links
                        </h3>
                        <div class="card-tools float-right">
                            <a href="affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                                <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div v-for="(linkDet, index) in usefulLinks" :key="index" class="col-md-12">
                            <div class="col-md-2 px-0 text-bold">{{ linkDet.page }}</div>
                            <div class="col-md-4">
                                <input class="inp b-radius form-control form-control-sm" type="text" :value="linkDet.link" readonly disabled>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-custom btn-sm mb-3" @click="copyLink(index)">Copy Link To Clipboard</button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-picture-o">&nbsp;</i>Banners
                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    <div id="freetile">
                        <a v-for="(banner, index) in banners" :key="index" :href="`/affiliate?link=view_banner&b=${banner.image}&w=${banner.width}&h=${banner.height}`">
                            <img :src="`https://www.interserver.net/logos/${banner.image}`" alt="InterServer Web Hosting and VPS" style="padding: 10px;">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
</template>

<style scoped>
    .linktd {
        width: 60%;
    }

    .inp {
        width: 100%;
    }
</style>
