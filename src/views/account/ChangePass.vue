<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
layoutStore.setPageHeading('Change Password');
layoutStore.setTitle('Change Password');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Change Password'});

const password = ref('')
const newPassword = ref('')
const currentPassword = ref('')
const isCollapsed = ref(false)

const schema = Yup.object().shape({
    currentPassword: Yup.string(),
    password: Yup.string().required('Password confirmation is required'),
    newPassword: Yup.string().required('Password is required')
});

function changePassword() {
  const url = 'change_pass';
  const formData = new FormData();
  formData.append('password2', this.password);
  axios.post(url, formData)
    .then(response => {
      // handle success
    })
    .catch(error => {
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
                    <h3 class="card-title py-2"><i class="fa fa-id-card-o"></i>&nbsp;Update Password</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed"><i class="fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body" :class="{ collapse: isCollapsed }">
                <form @submit.prevent="updatePassword">
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="currentpassword">Current Password</label>
                        <div class="col-md-9">
                            <input type="password" class="form-control form-control-sm" v-model="currentPassword" id="currentpassword" placeholder="Current Password">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="password">New Password</label>
                        <div class="col-md-9">
                            <input type="password" class="form-control form-control-sm" v-model="newPassword" id="password" placeholder="New Password">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="phone">Confirm Password</label>
                        <div class="col-md-9">
                            <input type="password" class="form-control form-control-sm" v-model="password" placeholder="Confirm Password">
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="controls">
                            <button type="submit" class="btn btn-custom btn-sm">Update Password</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
