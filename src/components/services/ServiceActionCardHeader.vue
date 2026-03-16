<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { parseFaIcon } from '@/helpers/parseFaIcon';

const { t } = useI18n();

withDefaults(
    defineProps<{
        title: string;
        backTo: string;
        iconClass?: string;
        materialIcon?: string;
    }>(),
    {
        iconClass: '',
        materialIcon: '',
    }
);
</script>

<template>
    <div class="card-header">
        <div class="p-1">
            <h3 class="card-title py-2">
                <i v-if="materialIcon" class="material-icons pr-1" style="vertical-align: bottom">{{ materialIcon }}</i>
                <template v-else-if="iconClass && parseFaIcon(iconClass)"><font-awesome-icon :icon="parseFaIcon(iconClass)!" />&nbsp;</template>
                <i v-else-if="iconClass" :class="iconClass">&nbsp;</i>
                {{ title }}
            </h3>
            <div class="card-tools text-right">
                <router-link :to="backTo" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('common.buttons.goBack')"> <font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp; </router-link>
            </div>
        </div>
    </div>
</template>
