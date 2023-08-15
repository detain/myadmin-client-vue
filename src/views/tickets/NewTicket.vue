<script setup>
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '@/stores';
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
const ticketsStore = useTicketsStore();
const route = useRoute();
console.log('Route Query View:');
console.log(route.query.view);
//const { tickets, loading, error, ima, custid, sortcol, sortdir, countArray, inboxCount, viewText, rowsOffset, rowsTotal, limit, currentPage, pages, view, search } = storeToRefs(ticketsStore);
//ticketsStore.getAll();
const createAs = ref('customer');
const message = ref('');
const departments = {
    1: 'Department 1',
    2: 'Department 2',
    // add more departments as needed
};
const products = {
    1: 'Product 1',
    2: 'Product 2',
    // add more products as needed
};
const kyDept = ref('');
const ima = ref('admin');
const abuse = '';

const getActionUrl = () => {
    // return the action URL for the form submission
    return 'your-action-url';
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form method="POST" class="new-ticket" enctype="multipart/form-data" :action="getActionUrl">
                <input v-if="abuse" type="hidden" name="abuse" :value="abuse" />
                <div class="card card-outline card-success">
                    <div class="card-header">
                        <h3 class="card-title">New Ticket</h3>
                        <div class="card-tools">
                            <button type="button" class="btn bg-teal btn-sm bg-gradient-teal" data-toggle="modal" data-target="#termsofuse">Terms of use</button>
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <label for="product" class="col-sm-4 col-form-label">Product</label>
                            <div class="col-sm-8">
                                <select name="product" class="form-control form-control-sm select2" style="width: 100%">
                                    <option value="">Select Product</option>
                                    <option v-for="(product, value, index) in products" :key="index" :value="value">{{ product }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="user_ip" class="col-sm-4 col-form-label">Subject</label>
                            <div class="col-sm-8">
                                <input type="text" name="subject" class="form-control form-control-sm" placeholder="Subject" v-model="subject" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="message" class="col-sm-4 col-form-label">Message</label>
                            <div class="col-sm-8">
                                <textarea name="message" class="form-control form-control-sm" rows="5" placeholder="Message" v-model="message"></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="attachments" class="col-sm-4 col-form-label">Attachments</label>
                            <div class="col-sm-8">
                                <input type="file" name="attachments[]" multiple class="form-control-file" accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip" />
                                <small class="text-muted">Allowed file types: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx, txt, csv, zip</small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4"></div>
                            <div class="col-sm-8">
                                <button type="submit" class="btn bg-gradient-primary btn-sm">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
