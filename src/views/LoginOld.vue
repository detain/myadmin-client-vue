<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();

const siteStore = useSiteStore();
const authStore = useAuthStore();
const { logo, captcha, language, counts, opts } = storeToRefs(authStore);
const { breadcrums, page_heading, sidemenu } = storeToRefs(siteStore);

const schema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required(t('validation.required', { field: t('login.username') })),
    passwd: Yup.string().required(t('validation.required', { field: t('login.password') })),
});
interface LoginParams {
    login: string;
    passwd: string;
    tfa?: string;
}
async function onSubmit(values: any) {
    const authStore = useAuthStore();
    const siteStore = useSiteStore();
    console.log('Values:', values);
    const loginParams: LoginParams = {
        login: values.login,
        passwd: values.passwd,
    };
    if (authStore.opts.tfa == true) {
        loginParams.tfa = values.tfa;
    }
    await authStore.login(loginParams);
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8 offset-sm-2 mt-5">
                <div class="card m-3">
                    <h4 class="card-header">{{ t('login.title') }}</h4>
                    <div class="card-body">
                        <Form v-slot="{ errors, isSubmitting }" :validation-schema="schema" @submit="onSubmit">
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.username') }}</label>
                                <Field name="login" type="text" class="form-control" :class="{ 'is-invalid': errors.login }" />
                                <div class="invalid-feedback">{{ errors.login }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.password') }}</label>
                                <Field name="passwd" type="password" class="form-control" :class="{ 'is-invalid': errors.passwd }" />
                                <div class="invalid-feedback">{{ errors.passwd }}</div>
                            </div>
                            <div v-if="opts.tfa" class="mb-3">
                                <label class="form-label">{{ t('login.twoFactorCode') }}</label>
                                <Field name="tfa" type="text" class="form-control" :class="{ 'is-invalid': errors.tfa }" />
                                <div class="invalid-feedback">{{ errors.tfa }}</div>
                            </div>
                            <div class="mb-3">
                                <div class="g-recaptcha" data-sitekey="6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2"></div>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary" :disabled="isSubmitting">
                                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                                    {{ t('common.buttons.login') }}
                                </button>
                                <router-link to="register" class="btn btn-link">{{ t('common.buttons.register') }}</router-link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
