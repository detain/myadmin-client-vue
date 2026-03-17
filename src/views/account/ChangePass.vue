<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { fetchWrapper } from '@/helpers/fetchWrapper';

import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();

const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('account.changePassword.title'));
    siteStore.setTitle(t('account.changePassword.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('account.changePassword.title')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();
const password = ref('');
const newPassword = ref('');
const currentPassword = ref('');
const isCollapsed = ref(false);

const schema = Yup.object().shape({
    currentPassword: Yup.string(),
    password: Yup.string().required(t('validation.required', { field: t('account.changePassword.confirmPassword') })),
    newPassword: Yup.string().required(t('validation.required', { field: t('account.changePassword.newPassword') })),
});

function changePassword() {
    const url = 'change_pass';
    const formData = new FormData();
    formData.append('password2', password.value);
    fetchWrapper
        //.post(`${baseUrl}/account/password`, formData)
        .post(`${baseUrl}/account/password`, {
            password: password.value,
        })
        .then((response) => {
            // handle success
        })
        .catch((error) => {
            // handle error
        });
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-7">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="far fa-id-card-o"></i>&nbsp;{{ t('account.changePassword.cardTitle') }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" :class="{ collapse: isCollapsed }">
                    <form @submit.prevent="changePassword">
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="currentpassword">{{ t('account.changePassword.currentPassword') }}</label>
                            <div class="col-md-9">
                                <input id="currentpassword" v-model="currentPassword" type="password" class="form-control form-control-sm" :placeholder="t('account.changePassword.currentPassword')" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="password">{{ t('account.changePassword.newPassword') }}</label>
                            <div class="col-md-9">
                                <input id="password" v-model="newPassword" type="password" class="form-control form-control-sm" :placeholder="t('account.changePassword.newPassword')" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="phone">{{ t('account.changePassword.confirmPassword') }}</label>
                            <div class="col-md-9">
                                <input v-model="password" type="password" class="form-control form-control-sm" :placeholder="t('account.changePassword.confirmPassword')" />
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="controls">
                                <button type="submit" class="btn btn-custom btn-sm">{{ t('account.changePassword.updatePassword') }}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
