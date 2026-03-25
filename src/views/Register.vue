<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useI18n } from 'vue-i18n';

import { useUsersStore } from '@/stores/users.store';
import { useAlertStore } from '@/stores/alert.store';

import { router } from '@/router';

const { t } = useI18n();

const schema = Yup.object().shape({
    firstName: Yup.string().required(t('validation.required', { field: t('login.firstName') })),
    lastName: Yup.string().required(t('validation.required', { field: t('login.lastName') })),
    username: Yup.string().required(t('validation.required', { field: t('login.username') })),
    password: Yup.string().required(t('validation.required', { field: t('login.password') })).min(6, t('validation.minLength', { min: 6 })),
});

async function onSubmit(values: any) {
    const usersStore = useUsersStore();
    const alertStore = useAlertStore();
    try {
        await usersStore.register(values);
        await router.push('/account/login');
        alertStore.success(t('login.registrationSuccessful'));
    } catch (error: any) {
        console.log();
        alertStore.error(error.message);
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8 offset-sm-2 mt-5">
                <div class="card m-3">
                    <h4 class="card-header">{{ t('login.register') }}</h4>
                    <div class="card-body">
                        <Form v-slot="{ errors, isSubmitting }" :validation-schema="schema" @submit="onSubmit">
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.firstName') }}</label>
                                <Field name="firstName" type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" />
                                <div class="invalid-feedback">{{ errors.firstName }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.lastName') }}</label>
                                <Field name="lastName" type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" />
                                <div class="invalid-feedback">{{ errors.lastName }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.username') }}</label>
                                <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                                <div class="invalid-feedback">{{ errors.username }}</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">{{ t('login.password') }}</label>
                                <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                                <div class="invalid-feedback">{{ errors.password }}</div>
                            </div>
                            <div class="mb-3">
                                <div class="g-recaptcha" data-sitekey="6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2"></div>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary" :disabled="isSubmitting">
                                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                                    {{ t('common.buttons.register') }}
                                </button>
                                <router-link to="login" class="btn btn-link">{{ t('common.buttons.cancel') }}</router-link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
