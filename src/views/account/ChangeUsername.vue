<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { loadLocaleMessages } from '@/i18n';

await loadLocaleMessages('en', 'account');
const { t } = useI18n();

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
watchEffect(() => {
    siteStore.setPageHeading(t('account.changeUsername.title'));
    siteStore.setTitle(t('account.changeUsername.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('account.changeUsername.title')],
    ]);
});
const disabled = true;
const oldUsername = ref<string | null>(null);
const success = ref<string | null>(null);
const failed = ref<string | null>(null);
const newUsername = ref<string>(''); // mirrors $new_username
const emailConfirmation = ref<string>('');
const submitting = ref(false);

const handleSubmit = async () => {
    if (submitting.value) return;
    submitting.value = true;
    setTimeout(() => (submitting.value = false), 5000);
    const payload = {
        new_username: newUsername.value,
        email_confirmation: emailConfirmation.value || null,
    };
    await Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('account.changeUsername.pleaseWait')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.post(`${baseUrl}/account/username`, payload).then((response) => {
            submitting.value = false;
            Swal.close();
            console.log('Response:', response);
            success.value = response;
            failed.value = null;
        });
    } catch (error: any) {
        submitting.value = false;
        Swal.close();
        console.log('caught error:', error);
        failed.value = t('account.changeUsername.gotError', { error });
        success.value = null;
    }
};

const resetForm = () => {
    newUsername.value = '';
    emailConfirmation.value = '';
    success.value = null;
    failed.value = null;
};
</script>

<template>
    <div class="container">
        <template v-if="disabled">
            <div class="row justify-content-center">
                <div class="col-md-7">{{ t('account.changeUsername.disabled') }}</div>
            </div>
        </template>
        <template v-else>
            <!-- Alerts -->
            <div v-if="success" class="alert alert-success"><strong>{{ t('common.alerts.success') }} </strong>{{ success }}</div>

            <div v-if="failed" class="alert alert-danger"><strong>{{ t('common.alerts.error') }} </strong>{{ failed }}</div>

            <div class="row">
                <div class="offset-md-2 col-sm-8">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <h4>{{ t('account.changeUsername.title') }}</h4>
                            </div>
                        </div>

                        <div class="card-body">
                            <form id="changeusername_form" accept-charset="UTF-8" role="form" class="not-bold left-align-text" @submit.prevent="handleSubmit">
                                <!-- Current Username -->
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label"> {{ t('account.changeUsername.currentUsername') }} </label>
                                    <div class="form-group input-group col-md-7">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <font-awesome-icon :icon="['fas', 'at']" />
                                            </div>
                                        </div>
                                        <input type="text" class="form-control" disabled :value="oldUsername" />
                                    </div>
                                </div>
                                <!-- New Username (confirmation step) -->
                                <template v-if="newUsername">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label"> {{ t('account.changeUsername.newDesiredUsername') }} <span style="color: red">*</span> </label>
                                        <div class="form-group input-group col-md-7">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <font-awesome-icon :icon="['fas', 'at']" />
                                                </div>
                                            </div>
                                            <input v-model="newUsername" type="text" class="form-control" readonly />
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label"> {{ t('account.changeUsername.confirmationCode') }} <span style="color: red">*</span> </label>
                                        <div class="form-group input-group col-md-7">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <font-awesome-icon :icon="['fas', 'key']" />
                                                </div>
                                            </div>
                                            <input v-model="emailConfirmation" type="text" class="form-control" required />
                                        </div>
                                    </div>
                                </template>

                                <!-- New Username (initial step) -->
                                <template v-else>
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label"> {{ t('account.changeUsername.newDesiredUsername') }} <span style="color: red">*</span> </label>
                                        <div class="form-group input-group col-md-7">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <font-awesome-icon :icon="['fas', 'at']" />
                                                </div>
                                            </div>
                                            <input v-model="newUsername" type="text" class="form-control" required />
                                        </div>
                                    </div>
                                </template>

                                <!-- Actions -->
                                <div class="form-group row">
                                    <div class="controls col-md-12 text-center">
                                        <button type="submit" class="btn btn-primary" :disabled="submitting">{{ t('common.buttons.continue') }}</button>
                                        <button type="button" class="btn btn-danger" @click="resetForm">{{ t('common.buttons.reset') }}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped></style>
