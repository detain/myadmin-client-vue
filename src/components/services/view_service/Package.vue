<template>
    <div class="col-md-4">
        <div class="small-box bg-secondary b-radius">
            <div class="inner px-3 pb-1 pt-3">
                <h3>Package</h3>
                <p class="m-0 py-2">{{ pkg }}</p>
                <p>
                    Next Invoice Date: <b>{{ invNextDate }}</b>
                </p>
            </div>
            <div class="icon"><i class="fas fa-briefcase"></i></div>
            <span class="small-box-footer text-bold">{{ host }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    pkg: string;
    invNextDate: string;
    host: string;
}>();
</script>
