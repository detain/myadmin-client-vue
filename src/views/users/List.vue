<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUsersStore } from '@/stores/users.store';

const { t } = useI18n();
const usersStore = useUsersStore();
const { users, loading, error } = storeToRefs(usersStore);

usersStore.getAll();
</script>

<template>
    <h1>{{ t('users.title') }}</h1>
    <router-link to="/users/add" class="btn btn-sm btn-success mb-2">{{ t('users.addUser') }}</router-link>
    <table class="table-striped table">
        <thead>
            <tr>
                <th style="width: 30%">{{ t('users.firstName') }}</th>
                <th style="width: 30%">{{ t('users.lastName') }}</th>
                <th style="width: 30%">{{ t('users.username') }}</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users.length">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.username }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/edit/${user.id}`" class="btn btn-sm btn-primary me-1">{{ t('common.buttons.edit') }}</router-link>
                        <button class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting" @click="usersStore.delete(user.id as number)">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>{{ t('common.buttons.delete') }}</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="error">
                <td colspan="4">
                    <div class="text-danger">{{ t('users.errorLoading') }} {{ error }}</div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
