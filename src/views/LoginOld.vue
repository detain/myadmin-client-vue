<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useSiteStore } from '@/stores';

const siteStore = useSiteStore();
const authStore = useAuthStore();
const { logo, captcha, language, counts, opts } = storeToRefs(authStore);
const { breadcrums, page_heading, sidemenu } = storeToRefs(siteStore);

const schema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required('Username is required'),
    passwd: Yup.string().required('Password is required'),
});
interface LoginParams {
    login : string;
    passwd: string;
    tfa?: string;
}
async function onSubmit(values: any) {
    const authStore = useAuthStore();
    const siteStore = useSiteStore();
    console.log('Values:');
    console.log(values);
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
                    <h4 class="card-header">Login</h4>
                    <div class="card-body">
                        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                            <div class="form-group">
                                <label>Username</label>
                                <Field name="login" type="text" class="form-control" :class="{ 'is-invalid': errors.login }" />
                                <div class="invalid-feedback">{{ errors.login }}</div>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <Field name="passwd" type="password" class="form-control" :class="{ 'is-invalid': errors.passwd }" />
                                <div class="invalid-feedback">{{ errors.passwd }}</div>
                            </div>
                            <div class="form-group" v-if="opts.tfa">
                                <label>2-Factor Authentication Code</label>
                                <Field name="tfa" type="text" class="form-control" :class="{ 'is-invalid': errors.tfa }" />
                                <div class="invalid-feedback">{{ errors.tfa }}</div>
                            </div>
                            <div class="form-group">
                                <div class="g-recaptcha" data-sitekey="6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2"></div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" :disabled="isSubmitting">
                                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                                    Login
                                </button>
                                <router-link to="register" class="btn btn-link">Register</router-link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
