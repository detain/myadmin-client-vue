<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUsersStore } from '@/stores/users.store.ts';
import { useAlertStore } from '@/stores/alert.store.ts';

import { router } from '@/router';

const usersStore = useUsersStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;

let title = 'Add User';
let user: any = null;
if (id) {
    // edit mode
    title = 'Edit User';
    ({ user } = storeToRefs(usersStore));
    usersStore.getById(id as string);
}

const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    password: user
        ? Yup.string()
              .transform((x) => (x === '' ? undefined : x))
              .min(6, 'Password must be at least 6 characters')
        : Yup.string()
              .transform((x) => (x === '' ? undefined : x))
              // password optional in edit mode
              .concat(Yup.string().required('Password is required'))
              .min(6, 'Password must be at least 6 characters'),
});

async function onSubmit(values: any) {
    try {
        let message;
        if (user) {
            await usersStore.update(user.value.id, values);
            message = 'User updated';
        } else {
            await usersStore.register(values);
            message = 'User added';
        }
        await router.push('/users');
        alertStore.success(message);
    } catch (error: any) {
        console.log();
        alertStore.error(error.message);
    }
}
</script>

<template>
    <h1>{{ title }}</h1>
    <template v-if="!(user?.loading || user?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="user" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>First Name</label>
                    <Field name="firstName" type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" />
                    <div class="invalid-feedback">{{ errors.firstName }}</div>
                </div>
                <div class="form-group col">
                    <label>Last Name</label>
                    <Field name="lastName" type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" />
                    <div class="invalid-feedback">{{ errors.lastName }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col">
                    <label>Username</label>
                    <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                    <div class="invalid-feedback">{{ errors.username }}</div>
                </div>
                <div class="form-group col">
                    <label>
                        Password
                        <em v-if="user">(Leave blank to keep the same password)</em>
                    </label>
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Save
                </button>
                <router-link to="/users" class="btn btn-link">Cancel</router-link>
            </div>
        </Form>
    </template>
    <template v-if="user?.loading">
        <div class="m-5 text-center">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="user?.error">
        <div class="m-5 text-center">
            <div class="text-danger">Error loading user: {{ user.error }}</div>
        </div>
    </template>
</template>
