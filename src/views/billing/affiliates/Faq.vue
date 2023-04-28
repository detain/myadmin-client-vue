<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - Faq');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'Faq'});


onMounted(() => {
})
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-question">&nbsp;</i>Frequently Asked Questions
                        </h3>
                        <div class="card-tools float-right">
                            <a href="affiliate" class=" btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                                <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="accordion" id="faq">
                        <div class="card m-0">
                            <div class="card-header" id="qs1">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#q1" aria-expanded="true" aria-controls="q1">
                                        1. What is your Commission structure?
                                    </button>
                                </h2>
                            </div>

                            <div id="q1" class="collapse show" aria-labelledby="qs1" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            We pay $100 flat commission/sales and this one of the highest paying
                                            Affiliate Program.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs2">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q2" aria-expanded="false" aria-controls="q2">
                                        2. How long does it take for a sale to show up in my account?
                                    </button>
                                </h2>
                            </div>
                            <div id="q2" class="collapse" aria-labelledby="qs2" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>It should show up immediately.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs3">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q3" aria-expanded="false" aria-controls="q3">
                                        3. I just made a sale. Where can I see it?
                                    </button>
                                </h2>
                            </div>
                            <div id="q3" class="collapse" aria-labelledby="qs3" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            Log into <a href="https://my.interserver.net" class="link" target="_blank">interserver.net.</a>
                                        </li>
                                        <li>
                                            On the bottom right side you will see an option
                                            <b>View Affiliate Page.</b>
                                        </li>
                                        <li>Here you can see all of your Pending and Approved commissions.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs4">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q4" aria-expanded="false" aria-controls="q4">
                                        4. I know someone who needs hosting. How do I earn a referral fee?
                                    </button>
                                </h2>
                            </div>
                            <div id="q4" class="collapse" aria-labelledby="qs4" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            Log into <a href="https://my.interserver.net" class="link" target="_blank">interserver.net.</a>
                                        </li>
                                        <li>Scroll down to the bottom to see your affiliate link.</li>
                                        <li>Send this link to your acquaintance that needs hosting.</li>
                                        <li>
                                            When they click on that link and order an account with us, you earn a
                                            commission.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs5">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q5" aria-expanded="false" aria-controls="q5">
                                        5. I've been approved for the Interserver Hosting affiliate program.
                                        Now what do I do?
                                    </button>
                                </h2>
                            </div>
                            <div id="q5" class="collapse" aria-labelledby="qs5" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            Log into your affiliate account to access Interserver marketing materials
                                            by clicking <b>Banners and Links</b> Tab.
                                        </li>
                                        <li>
                                            Choose the marketing material you would like to add to your site.
                                        </li>
                                        <li>
                                            You will see Banner codes right side of all banners, and copy/paste this
                                            code to your site.
                                        </li>
                                        <li>
                                            When someone clicks on that link and purchases a hosting account, you
                                            earn a commission.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs6">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q6" aria-expanded="false" aria-controls="q6">
                                        6. Can I PPC bid to promote Interserver Hosting?
                                    </button>
                                </h2>
                            </div>
                            <div id="q6" class="collapse" aria-labelledby="qs6" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            Yes, but please do not bid on our corporate name, variation of our
                                            corporate name, misspelling or any keyword that contains a portion of it
                                            including <b>Interserver, Interserver Hosting, Interserver
                                                Hosting</b>.
                                        </li>
                                        <li>
                                            Focus on bids for keywords like <b>fast hosting, PHP hosting, WordPress
                                                hosting</b>.
                                        </li>
                                        <li>
                                            Please contact us if you need help brainstorming keywords.
                                        </li>
                                        <li>
                                            Make sure to add <b>Interserver, Interserver hosting, Interserver
                                                hosting, Interserver.net, Interserver web hosting</b>
                                            as negative campaign keywords.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs7">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q7" aria-expanded="false" aria-controls="q7">
                                        7. I've made a sale. Now when do I get paid?
                                    </button>
                                </h2>
                            </div>
                            <div id="q7" class="collapse" aria-labelledby="qs7" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            After 90 days a valid sale will change from status <b>Default</b>
                                            to <b>Pending.</b>
                                        </li>
                                        <li>
                                            Once the sale is Pending it will be paid during the first 7 days of the
                                            month.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs8">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q8" aria-expanded="false" aria-controls="q8">
                                        8. I have a pending sale that did not get paid.
                                    </button>
                                </h2>
                            </div>
                            <div id="q8" class="collapse" aria-labelledby="qs8" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            There might be a few reasons for this. Sometimes we need more time to
                                            validate a sale.
                                        </li>
                                        <li>
                                            One easy thing to check to make sure your payment method is set.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs9">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q9" aria-expanded="false" aria-controls="q9">
                                        9. How long do my sales/commission remain pending until they are approved?
                                    </button>
                                </h2>
                            </div>
                            <div id="q9" class="collapse" aria-labelledby="qs9" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>90-days.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs10">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q10" aria-expanded="false" aria-controls="q10">
                                        10. Can I use my affiliate link for self-referrals on accounts I'll use
                                        for personal use?
                                    </button>
                                </h2>
                            </div>
                            <div id="q10" class="collapse" aria-labelledby="qs10" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>
                                            No. Any contact with a resold account will result in automatic failure
                                            of the sale.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs11">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q11" aria-expanded="false" aria-controls="q11">
                                        11. WHY WAS MY Commission REJECTED?
                                    </button>
                                </h2>
                            </div>
                            <div id="q11" class="collapse" aria-labelledby="qs11" data-parent="#faq">
                                <div class="card-body px-5">
                                    <p>Rejected means the commission has failed permanently.</p>
                                    <p>
                                        Some reasons for this could be:
                                    <ul style="padding-left: 25px;">
                                        <li>The customer has already signed up with us in the past.</li>
                                        <li>The same payment method was used as another account.</li>
                                        <li>
                                            The system detected that you the affiliate is also using the
                                            customer's account.
                                        </li>
                                    </ul>
                                    </p>
                                    <p>
                                        Since our payout of $100 per sale is often way more then we recover
                                        from the customer even after 1 year. We have strict policy in place
                                        to catch referrals that do not meet our guidelines. If you are
                                        referring a friend or a customer just give them a link or a coupon.
                                        Do not share payment types and do not use the account.
                                    </p>
                                    <p> Also please review our affiliate terms here:
                                        <a class="link" target="_blank" href="https://my.interserver.net/index.php?choice=none.affiliate_tos">
                                            Terms Of Services
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs12">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q12" aria-expanded="false" aria-controls="q12">
                                        12. I AM A DESIGNER/DEVELOPER AND WILL REFER CUSTOMERS Is that okay?
                                    </button>
                                </h2>
                            </div>
                            <div id="q12" class="collapse" aria-labelledby="qs12" data-parent="#faq">
                                <div class="card-body">
                                    <ul>
                                        <li>
                                            This plan is not going to work with us
                                            (or any other hosting affiliate program).
                                            Once there are matches made across multiple accounts the commission's
                                            fail.
                                        </li>
                                        <li>
                                            This is done to prevent the same person from signing up and making money
                                            off our affiliate program by referring themselves.
                                        </li>
                                        <li>
                                            You might want to consider hosting the customers directly and bill them
                                            yourself using something like PayPal. You can buy a reseller hosting
                                            account from us and get started.
                                            <a href="https://www.interserver.net/webhosting/reseller-hosting.html" class="link" target="__blank">Click Here</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div class="card-header" id="qs13">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q13" aria-expanded="false" aria-controls="q13">
                                        13. Where I can setup my payment?
                                    </button>
                                </h2>
                            </div>
                            <div id="q13" class="collapse" aria-labelledby="qs13" data-parent="#faq">
                                <div class="card-body">
                                    <ul>
                                        <li>
                                            You can setup your payment,
                                            <a href="https://my.interserver.net/index.php?choice=none.affiliate_payment_setup" class="link" target="_blank">By clicking Here</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
