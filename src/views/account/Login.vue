<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore } from '@/stores';

const use_tfa = false
const schema = Yup.object().shape({
    tfa: Yup.string(),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

async function onSubmit(values) {
    const authStore = useAuthStore();
    const { username, password } = values;
    await authStore.login(username, password);
}
</script>

<template>
    <div class="card m-3">
        <h4 class="card-header">Login</h4>
        <div class="card-body">
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                <div class="form-group">
                    <label>Username</label>
                    <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                    <div class="invalid-feedback">{{ errors.username }}</div>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
                <div class="form-group" v-if="use_tfa">
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
</template>
