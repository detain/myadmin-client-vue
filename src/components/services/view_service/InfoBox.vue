<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseFaIcon } from '@/helpers/parseFaIcon';

const { t } = useI18n();
defineProps<{
    heading: string;
    key1: string;
    val1: string;
    iconClass: string;
    iconName: string;
    bgClass: string;
    footerKey: string;
    footerVal: string;
}>();
</script>

<template>
    <div class="col-md-4">
        <div :class="['small-box', bgClass, 'b-radius']">
            <div class="inner px-3 pb-2 pt-3">
                <h3>{{ heading }}</h3>
                <p class="my-3 py-3">{{ key1 }}: {{ val1 }}</p>
            </div>
            <div class="icon">
                <font-awesome-icon v-if="parseFaIcon(iconClass)" :icon="parseFaIcon(iconClass)!" />
                <i v-else :class="[iconClass]">{{ iconName }}</i>
            </div>
            <span class="small-box-footer"> {{ footerKey }}: {{ footerVal }} </span>
        </div>
    </div>
</template>
