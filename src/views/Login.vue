<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import * as Yup from 'yup';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import $ from 'jquery';
import Swal from 'sweetalert2';
//import { Form, Field } from 'vee-validate';
//import { useRecaptchaProvider, Checkbox } from 'vue-recaptcha';
const siteStore = useSiteStore();
const authStore = useAuthStore();
const { logo, captcha, language, counts, opts, remember } = storeToRefs(authStore);
const gresponse = ref('');
const isLogin = ref(true);
const isPasswordVisible = ref(false);
const login = ref('');
const password = ref('');
const tos = ref(false);
const captchaCode = ref('');
const emailCode = ref('');
const twoFactorAuthCode = ref('');
const primaryCaptcha = ref(true);
const showForgotPass = ref(false);
const showPasswordInfo = ref(false);
const validClass = 'fa-check bg-green p-1';
const invalidClass = 'fa-close bg-red px-2 py-1';

const passwordRules = computed(() => {
    const val = password.value;
    return {
        length: val.length >= 8,
        letter: /[a-z]/.test(val),
        capital: /[A-Z]/.test(val),
        number: /\d/.test(val),
        special: !/^[a-zA-Z0-9- ]*$/.test(val),
    };
});

const containerRef = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);
const containerRef2 = ref<HTMLElement | null>(null);
const widgetId2 = ref<string | null>(null);
const isTosChecked = computed(() => tos.value == true || login.value != '');
const passwordType = computed(() => (isPasswordVisible.value == true ? 'text' : 'password'));
let signup_running = 0;

const loginSchema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required('Username is required'),
    passwd: Yup.string().required('Password is required'),
});

declare global {
    interface Window {
        turnstile: any;
    }
}

interface LoginParams {
    login: string;
    passwd: string;
    remember: string | null;
    tfa?: string;
    'g-recaptcha-response'?: string;
}

interface SignupParams extends LoginParams {
    tos?: boolean;
}

async function onLoginSubmit() {
    Swal.fire({
        title: 'Please wait',
        html: '<i class="fa fa-spinner fa-spin fa-2x"></i><br/>Processing Login Information',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    const authStore = useAuthStore();
    let loginParams: LoginParams = {
        login: login.value,
        passwd: password.value,
        remember: remember.value,
    };
    if (authStore.opts.tfa == true) {
        loginParams.tfa = twoFactorAuthCode.value;
    }
    console.log('Login Params:', loginParams);
    await authStore.login(loginParams).then((response) => {
        Swal.close();
    });
}

async function oAuthLogin(provider: string) {
    window.open(`oauth/callback.php?provider=${provider}`, 'authWindow', 'width=600,height=600,scrollbars=yes');
}

async function onSignupSubmit() {
    Swal.fire({
        title: 'Please wait',
        html: '<i class="fa fa-spinner fa-spin fa-2x"></i><br/>Processing Signup Information',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    const authStore = useAuthStore();
    let signupParams: SignupParams = {
        login: login.value,
        passwd: password.value,
        tos: tos.value,
        remember: remember.value,
    };
    if (authStore.opts.tfa == true) {
        signupParams.tfa = twoFactorAuthCode.value;
    }
    if (window.location.host != 'cn.interserver.net') {
        signupParams['g-recaptcha-response'] = gresponse.value;
    }
    console.log('Signup Params:', signupParams);
    authStore.signup(signupParams).then((response) => {
        Swal.close();
    });
}

async function reloadCaptcha() {
    authStore.reloadCaptcha();
}

async function toggleCaptchaMethod() {
    primaryCaptcha.value = !primaryCaptcha.value;
}

async function toggleForgotPass() {
    showForgotPass.value = !showForgotPass.value;
}

function closePopup() {}

function submitForgotPassForm() {}

function setModalMaxHeight(element: HTMLElement | JQuery<HTMLElement>) {
    element = $(element);
    const content = element.find('.modal-content');
    const borderWidth = (content.outerHeight() as number) - (content.innerHeight() as number);
    const dialogMargin = ($(window).width() as number) < 768 ? 20 : 60;
    const contentHeight = ($(window).height() as number) - (dialogMargin + borderWidth);
    const headerHeight = element.find('.modal-header').outerHeight() || 0;
    const footerHeight = element.find('.modal-footer').outerHeight() || 0;
    const maxHeight = contentHeight - (headerHeight + footerHeight);
    content.css({
        overflow: 'hidden',
    });
    element.find('.modal-body').css({
        'max-height': maxHeight,
        'overflow-y': 'auto',
    });
}

function toggleModal(modalID: string) {
    document.getElementById(modalID)?.classList.toggle('hidden');
    document.getElementById(`${modalID}-backdrop`)?.classList.toggle('hidden');
    document.getElementById(modalID)?.classList.toggle('flex');
    document.getElementById(`${modalID}-backdrop`)?.classList.toggle('flex');
}

function animateValue(obj: any, start = 0, end: null | number = null, duration = 1000) {
    if (obj) {
        // save starting text for later (and as a fallback text if JS not running and/or google)
        const textStarting = obj.innerHTML;
        // remove non-numeric from starting text if not specified
        end = end || parseInt(textStarting.replace(/\D/g, ''));
        const range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        const minTimer = 50;
        // calc step time to show all interediate values
        let stepTime = Math.abs(Math.floor(duration / range));
        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);
        // get current time and calculate desired end time
        const startTime = new Date().getTime();
        const endTime = startTime + duration;
        let timer: NodeJS.Timeout;
        const run = () => {
            const now = new Date().getTime();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round((end as number) - remaining * range);
            // replace numeric digits only in the original string
            obj.innerHTML = textStarting.replace(/([0-9]+)/g, value);
            if (value == end) {
                clearInterval(timer);
            }
        };
        timer = setInterval(run, stepTime);
        run();
    }
}

function login_handler() {
    const username = login.value;
    const twofactor = twoFactorAuthCode.value;
    const captcha = captchaCode.value;
    const remember = localStorage.rememberMe === 'true' ? 'yes' : 'no';
    if (username == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a username',
            html: username,
        });
    } else if (password.value == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a password',
            html: password.value,
        });
    } else {
        let loginCheckData = `ajax=1&remember=${remember}&login_id=${encodeURIComponent(username)}&passwd=${encodeURIComponent(password.value)}&captcha=${encodeURIComponent(captcha)}`;
        if (twofactor) {
            loginCheckData = `${loginCheckData}&2fa_code=${encodeURIComponent(twofactor)}`;
        }
        if (emailCode.value != '') {
            loginCheckData = `${loginCheckData}&email_confirmation=${encodeURIComponent(emailCode.value)}`;
        }
        const pathArray = window.location.pathname.split('/');
        let newPath = '/';
        let i;
        for (i = 1; i < pathArray.length - 1; i++) {
            newPath += pathArray[i];
            newPath += '/';
        }
        $.ajax({
            type: 'POST',
            url: `https://${window.location.host}${newPath}ajax_check_login.php`,
            data: loginCheckData,
            success: function (html) {
                console.log(loginCheckData, `${html.substring(0, 8)} got ${html}`);
                if (html.substring(0, 4) == 'true') {
                    if (html.length == 4) {
                        window.location.href = 'index.php';
                    } else {
                        window.location.href = html.substring(4);
                    }
                } else if (html.substring(0, 8) == '2fa_auth') {
                    $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                    $('.twofactorauth').show(500);
                    $('.captcha_main').hide();
                    $('.captcha_alt').hide();
                    if ($('.popup').hasClass('hidden')) {
                        $('.popup').removeClass('hidden');
                    } else {
                        $('.popup .error-box').show();
                        $('.popup #error-message').text('Invalid Code, Please Enter correct code.');
                    }
                } else if (html.substring(0, 6) == 'verify') {
                    $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                    if ($('.login_email_popup').hasClass('hidden')) {
                        $('.login_email_popup').removeClass('hidden');
                    } else {
                        $('.login_email_popup .error-box').show();
                        $('.login_email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                    }
                    $('.captcha_main_signup').hide();
                    $('.captcha_alt_signup').hide();
                } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                    $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                    $('.login_email_popup .error-box').show();
                    $('.login_email_popup #error-message').html(html);
                    $('.captcha_main_signup').hide();
                    $('.captcha_alt_signup').hide();
                } else {
                    if (window.location.host != 'cn.interserver.net') {
                        gresponse.value = '';
                    }
                    reloadCaptcha();
                    $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                    // $("#message").html(html);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error',
                        html: html,
                    });
                }
            },
            error: function () {
                $('.loginsubmit, .signupsubmit').prop('disabled', false);
                gresponse.value = '';
                Swal.fire({
                    icon: 'warning',
                    title: 'Error occurred!',
                });
            },
            beforeSend: function () {
                $('.loginsubmit, .signupsubmit').attr('disabled', 'disabled');
            },
        });
    }
    return false;
}

function forgot_password() {
    const username = $("input[name='email']").val() as string;
    const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const captcha = captchaCode.value;
    if (username == '') {
        $('#forgot-password-message').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a email address.</div>');
    } else if (regex.test(username) == false) {
        $('#forgot-password-message').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a valid email address.</div>');
    } else {
        const pathArray = window.location.pathname.split('/');
        let newPath = '/';
        let i;
        for (i = 1; i < pathArray.length - 1; i++) {
            newPath += pathArray[i];
            newPath += '/';
        }
        $.ajax({
            type: 'POST',
            url: `https://${window.location.host}${newPath}password.php`,
            data: `ajax=1&email=${encodeURIComponent(username)}&g-recaptcha-response=${encodeURIComponent(gresponse.value)}&captcha=${encodeURIComponent(captcha)}`,
            success: function (html) {
                $('#forgot-password-message').html(html);
            },
            error: function () {
                $('#btn-forgot').prop('disabled', false);
                $('#forgot-password-message').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred!</div>');
            },
            beforeSend: function () {
                $('#forgot-password-message').html('<div style="margin: 15px; text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i> <span style="margin-left: 10px;font-size: 18px;">Processing Information</span></div>');
            },
        });
    }
}

function signup_handler() {
    Swal.fire({
        title: 'Please wait',
        html: '<i class="fa fa-spinner fa-spin fa-2x"></i><br/>Processing Signup Information',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    const items = $('#loginForm input:not(.login_info), #loginForm select:not(.login_info)').serializeArray();
    const email_conf = $('input[name=email_confirmation]').val();
    const captchaSignup = $('#captcha_signup').val();
    let data_string = 'ajax=1';
    let errors = '';
    let i, n;
    for (i = 0, n = items.length; i < n; i++) {
        if (items[i].name != 'remember' && items[i].name != 'email_confirmation' && items[i].name != 'captcha' && items[i].value == '') {
            if (items[i].name == 'login_id') {
                errors = `${errors}<strong>Error!</strong> Please enter an email address<br>`;
            } else if (items[i].name == 'passwd' || items[i].name == 'password') {
                errors = `${errors}<strong>Error!</strong> Please enter a password<br>`;
            } else if (items[i].name == 'giftcard_number') {
                errors = `${errors}<strong>Error!</strong> Please enter a giftcard number<br>`;
            } else if (items[i].name == '2fa_code') {
                // do something
            } else if (items[i].name == 'captcha' || items[i].name == 'g-recaptcha-response') {
                // do something
            } else {
                errors = `${errors}<strong>Error!</strong> Please enter a ${items[i].name} (got a blank value)<br>`;
            }
        }
        if (items[i].value != '' && items[i].name != 'captcha' && items[i].name != 'g-recaptcha-response') {
            data_string = `${data_string}&${items[i].name}=${encodeURIComponent(items[i].value)}`;
        }
    }
    if (errors != '') {
        Swal.fire({
            icon: 'warning',
            html: errors,
        });
    } else {
        if (email_conf == '') {
            data_string = `${data_string}&captcha=${encodeURIComponent(captchaCode.value)}&g-recaptcha-response=${encodeURIComponent(gresponse.value)}`;
        }
        if (signup_running == 0) {
            signup_running = 1;
            $.ajax({
                type: 'POST',
                url: $('#loginForm').attr('action'),
                data: data_string,
                success: function (html) {
                    Swal.close();
                    if (html.substring(0, 4) == 'true') {
                        if (html.length == 4) {
                            window.location.href = 'index.php';
                        } else {
                            window.location.href = html.substring(4);
                        }
                    } else if (html.substring(0, 6) == 'verify') {
                        $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                        if ($('.email_popup').hasClass('hidden')) {
                            $('.email_popup').removeClass('hidden');
                        } else {
                            $('.email_popup .error-box').show();
                            $('.email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                        }
                        $('.captcha_main_signup').hide();
                        $('.captcha_alt_signup').hide();
                    } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                        $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                        $('.email_popup .error-box').show();
                        $('.email_popup #error-message').html(html);
                    } else {
                        $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                        gresponse.value = '';
                        Swal.fire({
                            icon: 'warning',
                            html: html,
                        });
                    }
                    signup_running = 0;
                },
                error: function () {
                    Swal.close();
                    $('.loginsubmit, .signupsubmit').prop('disabled', false);
                    gresponse.value = '';
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error occurred!',
                    });
                },
                beforeSend: function () {
                    $('.loginsubmit, .signupsubmit').removeAttr('disabled');
                    Swal.close();
                },
            });
        }
    }
    return false;
}

function loadTurnstileScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.turnstile) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

onMounted(async () => {
    await loadTurnstileScript();
    widgetId.value = window.turnstile.render(containerRef.value, {
        sitekey: '0x4AAAAAABeXCi3hjKZn2bcS',
        callback: (token: string) => {
            console.log(token);
        },
    });
    widgetId2.value = window.turnstile.render(containerRef2.value, {
        sitekey: '0x4AAAAAABeXCi3hjKZn2bcS',
        callback: (token: string) => {
            console.log(token);
        },
    });
    animateValue(document.getElementById('count-v'));
    animateValue(document.getElementById('count-w'));
    animateValue(document.getElementById('count-s'));
    //reloadCaptcha();
});

//useRecaptchaProvider();
authStore.load();
</script>

<template>
    <div class="bg-black p-3 px-3"><img src="../assets/images/logo_new.png" alt="" /></div>
    <div class="container-main flex min-h-screen flex-grow flex-col-reverse lg:flex-row">
        <div class="marketing-content min-h-full w-full bg-blue-700 lg:block lg:w-5/12">
            <h1 class="mt-5 w-full text-center text-3xl uppercase tracking-widest text-white">Welcome back to our growing Community</h1>
            <div class="mt-24 flex">
                <div class="mx-auto">
                    <div class="mb-1"><img src="../assets/images/vps.png" alt="" /></div>
                    <div id="count-v" class="text-center text-4xl tracking-widest text-white">{{ counts.vps }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">VPS</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="../assets/images/website.png" alt="" /></div>
                    <div id="count-w" class="text-center text-4xl tracking-widest text-white">{{ counts.websites }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">Websites</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="../assets/images/servers.png" alt="" /></div>
                    <div id="count-s" class="text-center text-4xl tracking-widest text-white">{{ counts.servers }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">Servers</div>
                </div>
            </div>
        </div>
        <div class="w-full lg:w-7/12">
            <div class="p-2"></div>
            <div class="mx-auto block lg:my-auto">
                <Transition name="fade-slide">
                    <div v-show="isLogin && !showForgotPass" class="wrapper w-full">
                        <div class="myadmin_login w-full">
                            <div class="login-box m-auto" style="width: 400px">
                                <div class="card card-outline card-primary">
                                    <div class="card-header text-center" style="display: flex">
                                        <i class="fa fa-user-circle text-orange-500" style="font-size: 35px" aria-hidden="true"></i>
                                        <h3 class="card-title text-bold ml-3 mt-2">Sign in to start your session</h3>
                                    </div>
                                    <div class="card-body">
                                        <form class="myadmin_loginForm mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" :validation-schema="loginSchema" @submit.prevent="onLoginSubmit">
                                            <div class="input-group mb-3">
                                                <input id="loginname" v-model="login" type="email" class="login_info form-control" placeholder="Email Address" required autofocus autocomplete="off" />
                                                <div class="input-group-append">
                                                    <div class="input-group-text"><span class="fas fa-envelope" aria-hidden="true"></span></div>
                                                </div>
                                            </div>
                                            <div class="input-group mb-3">
                                                <input id="loginpassword" v-model="password" :type="passwordType" class="login_info form-control" placeholder="Password" autocomplete="off" required />
                                                <div class="input-group-append">
                                                    <div class="input-group-text">
                                                        <button type="button" aria-hidden="true" @click.prevent="isPasswordVisible = !isPasswordVisible"><i class="fa" :class="{ 'fa-eye': !isPasswordVisible, 'fa-eye-slash': isPasswordVisible }"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12 mb-1">
                                                    <a id="forgot_link" class="float-right inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800" href="#" @click.prevent="toggleForgotPass">I forgot my password</a>
                                                </div>
                                                <div class="col-8">
                                                    <div class="icheck-primary">
                                                        <input id="remember" v-model="remember" class="login_info" type="checkbox" />
                                                        <label for="remember">Remember Me</label>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <button id="loginsubmit" type="submit" class="loginsubmit btn btn-primary btn-block text-bold" @click.prevent="onLoginSubmit">Sign In</button>
                                                </div>
                                            </div>
                                            <div class="poppup login_email_popup fixed inset-0 z-10 flex hidden items-center justify-center">
                                                <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                                <div class="relative z-10 mx-auto w-full max-w-3xl rounded-lg bg-white py-4 shadow-lg">
                                                    <i class="close fa fa-close float-right cursor-pointer px-4 text-lg" @click="closePopup"></i>
                                                    <div class="p-6">
                                                        <h2 class="mb-4 text-center text-2xl font-bold"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                        <p class="mb-8 text-center text-gray-600"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                        <form>
                                                            <div class="mb-4">
                                                                <input id="email_confirmation" v-model="emailCode" type="text" class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" name="email_confirmation" placeholder="Security Code" autocomplete="off" required />
                                                            </div>
                                                            <div class="col-8">
                                                                <div class="icheck-primary">
                                                                    <input id="code-remember" v-model="remember" class="login_info" type="checkbox" />
                                                                    <label for="remember">Remember Me</label>
                                                                </div>
                                                            </div>
                                                            <div class="mb-4">
                                                                <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                    <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                    <strong class="font-bold">Error!</strong>
                                                                    <span id="error-message" class="block sm:inline"></span>
                                                                    <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none'"><i class="fas fa-times" aria-hidden="true"></i></span>
                                                                </div>
                                                            </div>
                                                            <div class="text-center">
                                                                <button type="submit" class="loginsubmit rounded-lg bg-indigo-500 px-6 py-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50" @click.prevent="onLoginSubmit">Sign In</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="opts.tfa" class="poppup popup fixed inset-0 z-10 flex items-center justify-center">
                                                <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                                <div class="relative z-10 mx-auto w-full max-w-3xl rounded-lg bg-white py-4 shadow-lg">
                                                    <i class="close fa fa-close float-right cursor-pointer px-4 text-lg" @click="closePopup"></i>
                                                    <div class="p-6">
                                                        <h2 class="mb-4 text-center text-2xl font-bold"><i class="fas fa-shield-alt mr-2" aria-hidden="true"></i>Enter Two Factor Authorization Code!</h2>
                                                        <p class="mb-8 text-center text-gray-600"><i class="fas fa-info-circle mr-2" aria-hidden="true"></i>Use your configured Authenticator to get a code and enter it here.</p>
                                                        <form>
                                                            <div class="signup_toggle twofactorauth mb-4">
                                                                <input v-model="twoFactorAuthCode" type="text" placeholder="Enter Code from Authenticator" class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
                                                            </div>
                                                            <div class="mb-4">
                                                                <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                    <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                    <strong class="font-bold">Error!</strong>
                                                                    <span id="2fa-error-message" class="block sm:inline"></span>
                                                                    <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none'">
                                                                        <i class="fas fa-times" aria-hidden="true"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="mb-4">
                                                                <label class="flex items-center">
                                                                    <input id="2fa-remember" v-model="remember" type="checkbox" name="remember" class="form-checkbox h-4 w-4 rounded-sm text-indigo-500" />
                                                                    <span class="ml-2 text-gray-800">Remember me</span>
                                                                </label>
                                                            </div>
                                                            <div class="text-center">
                                                                <button type="submit" class="loginsubmit rounded-lg bg-indigo-500 px-6 py-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50" @click.prevent="onLoginSubmit">Sign In</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div class="social-auth-links mb-3 mt-2 text-center">
                                            <h3 class="text-bold text-center text-lg">Sign in using:</h3>
                                            <a href="#" class="btn btn-primary btn-lg" data-toggle="tooltip" title="Sign in using Facebook" @click.prevent="oAuthLogin('Facebook')">
                                                <i class="fab fa-facebook" aria-hidden="true"></i>
                                            </a>
                                            <a href="#" class="btn btn-danger btn-lg" data-toggle="tooltip" title="Sign in using Google+" @click.prevent="oAuthLogin('Google')">
                                                <i class="fab fa-google-plus" aria-hidden="true"></i>
                                            </a>
                                            <a href="#" class="btn btn-secondary btn-lg" data-toggle="tooltip" title="Sign in using Github" @click.prevent="oAuthLogin('GitHub')">
                                                <i class="fab fa-github"></i>
                                            </a>
                                            <a href="#" class="btn btn-info btn-lg" data-toggle="tooltip" title="Sign in using Twitter" @click.prevent="oAuthLogin('Twitter')">
                                                <i class="fab fa-twitter"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
                <Transition name="fade-slide">
                    <div v-show="showForgotPass" class="myadmin_login w-full p-4">
                        <div class="login-box m-auto" style="width: 400px">
                            <div class="card card-outline card-primary">
                                <div class="card-header text-center">
                                    <h3 class="card-title ml-3 mt-1">Forgot your Password?</h3>
                                </div>
                                <div class="card-body">
                                    <div class="text-yellow-700">
                                        Enter the Email address you use to log in to your account<br />
                                        We'll send you an email with instructions to choose a new password.
                                    </div>
                                    <form class="myadmin_loginForm mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" @submit.prevent="submitForgotPassForm">
                                        <div class="input-group mb-3">
                                            <input v-model="login" type="email" class="login_info form-control" placeholder="Email Address" required autofocus autocomplete="off" />
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <span class="fas fa-envelope" aria-hidden="true"></span>
                                                </div>
                                            </div>
                                        </div>

                                        <Transition name="fade-slide">
                                            <div v-show="primaryCaptcha" class="captcha_main_signup mb-6">
                                                <!-- <Checkbox v-model="gresponse" /> -->
                                                <div id="turnstileDiv2" ref="containerRef2"></div>
                                                <div id="gcaptcha-2"></div>
                                                <a href="#" class="text-sm font-bold text-blue-500 underline hover:text-blue-800" @click.prevent="toggleCaptchaMethod">Alternate Captcha</a>
                                            </div>
                                        </Transition>
                                        <Transition name="fade-slide">
                                            <div v-show="!primaryCaptcha" class="captcha_alt_signup mb-6">
                                                <div class="flex">
                                                    <img :src="captcha" style="max-width: 75%" alt="" />
                                                    <button class="focus:shadow-outline btn-captcha-reload ml-4 block rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none" type="button" title="Reload Captcha" tabindex="-1" aria-pressed="false" @click="reloadCaptcha">
                                                        <span class="fa fa-refresh fa-fw"></span>
                                                    </button>
                                                </div>
                                                <div class="input-group my-3">
                                                    <input v-model="captchaCode" type="text" class="form-control" placeholder="Captcha" autofocus autocomplete="off" />
                                                    <div class="input-group-append">
                                                        <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                                    </div>
                                                </div>
                                                <a class="text-sm font-bold text-blue-500 underline hover:text-blue-800" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                            </div>
                                        </Transition>
                                        <div id="forgot-password-message"></div>
                                        <button id="btn-forgot" type="button" class="btn btn-primary btn-block text-bold" @click.prevent="forgot_password">Continue</button>
                                    </form>
                                    <div class="row">
                                        <div class="col-12 myadmin_forgotPwd mb-1">
                                            <a id="access_link" href="#" class="float-right inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800" @click.prevent="toggleForgotPass">Login to My Account</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
                <Transition name="fade-slide">
                    <div v-show="!isLogin" class="wrapper-signup mx-auto w-full">
                        <div class="myadmin_login w-full">
                            <div class="login-box m-auto" style="width: 400px">
                                <div class="card card-outline card-primary">
                                    <div class="card-header text-center" style="display: flex">
                                        <i class="fa fa-user-circle text-orange-500" style="font-size: 35px" aria-hidden="true"></i>
                                        <h3 class="card-title text-bold ml-3 mt-2">Create Your Account Now</h3>
                                    </div>
                                    <div class="card-body">
                                        <form class="myadmin_loginForm mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" @submit.prevent="onSignupSubmit">
                                            <div class="input-group mb-3">
                                                <input v-model="login" type="email" class="login_info form-control" placeholder="Email Address" required autofocus autocomplete="off" />
                                                <div class="input-group-append">
                                                    <div class="input-group-text">
                                                        <span class="fas fa-envelope" aria-hidden="true"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="input-group mb-3">
                                                <input id="signuppassword" v-model="password" :type="passwordType" class="form-control" placeholder="Password" autocomplete="off" required @focus="showPasswordInfo = true" @blur="showPasswordInfo = false" />
                                                <div class="input-group-append">
                                                    <div class="input-group-text">
                                                        <button type="button" aria-hidden="true" @click.prevent="isPasswordVisible = !isPasswordVisible"><i class="fa" :class="{ 'fa-eye': !isPasswordVisible, 'fa-eye-slash': isPasswordVisible }"></i></button>
                                                    </div>
                                                </div>
                                                <div v-show="showPasswordInfo" id="pswd_info">
                                                    <p class="pp"><b>Password must have:</b></p>
                                                    <ul>
                                                        <li id="length" class="pass_checks"><i aria-hidden="true" class="fa b-radius mr-2 text-white" :class="passwordRules.length ? validClass : invalidClass"></i>atleast 8 characters</li>
                                                        <li id="capital" class="pass_checks"><i aria-hidden="true" class="fa b-radius mr-2 text-white" :class="passwordRules.letter ? validClass : invalidClass"></i>atleast 1 uppercase</li>
                                                        <li id="letter" class="pass_checks"><i aria-hidden="true" class="fa b-radius mr-2 text-white" :class="passwordRules.capital ? validClass : invalidClass"></i>atleast 1 lowercase</li>
                                                        <li id="number" class="pass_checks"><i aria-hidden="true" class="fa b-radius mr-2 text-white" :class="passwordRules.number ? validClass : invalidClass"></i>atleast 1 number</li>
                                                        <li id="special" class="pass_checks"><i aria-hidden="true" class="fa b-radius mr-2 text-white" :class="passwordRules.special ? validClass : invalidClass"></i>atleast 1 special char</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="signup_toggle twofactorauth mb-6 hidden">
                                                        <div class="input-group my-3">
                                                            <input id="signup_2fa_code" v-model="twoFactorAuthCode" type="text" class="form-control" name="2fa_code" placeholder="Enter Code from Authenticator" autocomplete="off" />
                                                            <div class="input-group-append">
                                                                <div class="input-group-text"><span class="fa fa-lock" aria-hidden="true"></span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Transition name="fade-slide">
                                                        <div v-show="primaryCaptcha" class="captcha_main_signup mb-6">
                                                            <!-- <Checkbox v-model="gresponse" /> -->
                                                            <div id="turnstileDiv" ref="containerRef"></div>
                                                            <div id="gcaptcha-1"></div>
                                                            <a id="captcha_alt_link_signup" href="#" class="text-sm font-bold text-blue-500 underline hover:text-blue-800" @click.prevent="toggleCaptchaMethod">Alternate Captcha</a>
                                                        </div>
                                                    </Transition>
                                                    <Transition name="fade-slide">
                                                        <div v-show="!primaryCaptcha" class="captcha_alt_signup mb-6">
                                                            <div class="flex">
                                                                <img :src="captcha" style="max-width: 75%" alt="" />
                                                                <button class="focus:shadow-outline btn-captcha-reload ml-4 block rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none" type="button" title="Reload Captcha" tabindex="-1" aria-pressed="false" @click="reloadCaptcha">
                                                                    <span class="fa fa-refresh fa-fw"></span>
                                                                </button>
                                                            </div>
                                                            <div class="input-group my-3">
                                                                <input v-model="captchaCode" type="text" class="form-control" placeholder="Captcha" autofocus autocomplete="off" />
                                                                <div class="input-group-append">
                                                                    <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                                                </div>
                                                            </div>
                                                            <a class="text-sm font-bold text-blue-500 underline hover:text-blue-800" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                                        </div>
                                                    </Transition>
                                                </div>
                                                <div class="col-12">
                                                    <div class="icheck-primary">
                                                        <input id="tos" v-model="tos" type="checkbox" required />
                                                        <label for="tos">
                                                            I agree to the
                                                            <span class="text-sm font-bold text-blue-500 underline hover:text-blue-800">
                                                                <a href="https://www.interserver.net/terms-of-service.html" target="_blank">Terms of Service</a>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-12 text-right">
                                                    <button id="" type="submit" class="signupsubmit btn btn-primary btn-block text-bold">Create Account</button>
                                                </div>
                                            </div>
                                            <div class="poppup email_popup fixed inset-0 z-10 flex hidden items-center justify-center">
                                                <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                                <div class="relative z-10 mx-auto w-full max-w-3xl rounded-lg bg-white py-4 shadow-lg">
                                                    <i class="close fa fa-close float-right cursor-pointer px-4 text-lg" @click="closePopup"></i>
                                                    <div class="p-6">
                                                        <h2 class="mb-4 text-center text-2xl font-bold"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                        <p class="mb-8 text-center text-gray-600"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                        <form>
                                                            <div class="mb-4">
                                                                <input id="signup_email_confirmation" v-model="emailCode" type="text" name="email_confirmation" placeholder="Security Code" autocomplete="off" required class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
                                                            </div>
                                                            <div class="mb-4">
                                                                <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                    <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                    <strong class="font-bold">Error!</strong>
                                                                    <span id="signup-error-message" class="block sm:inline"></span>
                                                                    <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none'">
                                                                        <i class="fas fa-times" aria-hidden="true"></i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="text-center">
                                                                <button type="submit" class="signupsubmit rounded-lg bg-indigo-500 px-6 py-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">Create Account</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div class="social-auth-links mb-3 mt-2 text-center">
                                            <h3 class="text-bold text-center text-lg">Sign up using:</h3>
                                            <a href="#" class="btn btn-primary btn-lg" data-toggle="tooltip" title="Sign in using Facebook" @click.prevent="oAuthLogin('Facebook')">
                                                <i class="fab fa-facebook" aria-hidden="true"></i>
                                            </a>
                                            <a href="#" class="btn btn-danger btn-lg" data-toggle="tooltip" title="Sign in using Google+" @click.prevent="oAuthLogin('Google')">
                                                <i class="fab fa-google-plus" aria-hidden="true"></i>
                                            </a>
                                            <a href="#" class="btn btn-secondary btn-lg" data-toggle="tooltip" title="Sign in using Github" @click.prevent="oAuthLogin('GitHub')">
                                                <i class="fab fa-github"></i>
                                            </a>
                                            <a href="#" class="btn btn-info btn-lg" data-toggle="tooltip" title="Sign in using Twitter" @click.prevent="oAuthLogin('Twitter')">
                                                <i class="fab fa-twitter"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
                <div v-show="isLogin && !showForgotPass" class="sign-up-txt signup pb-5 text-center text-gray-600">Don't have an account? <a class="sign-up text-sm font-bold text-blue-500 hover:text-blue-800" @click="isLogin = !isLogin">Sign Up</a></div>
                <div v-show="!isLogin && !showForgotPass" class="sign-up-txt pb-5 text-center text-gray-600">Already have an account? <a class="sign-up text-sm font-bold text-blue-500 hover:text-blue-800" @click="isLogin = !isLogin">Login</a></div>
                <div class="p-1 text-center text-sm text-gray-500">Copyright &copy; {{ new Date().getFullYear() }} - All Rights Reserved.</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/*@tailwind base;
@tailwind components;
@tailwind utilities;*/
/* @import '../assets/node_modules/@fortawesome/fontawesome-free/css/all.min.css'; */
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap';
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '../assets/css/tailwind.min.css';
@import '../assets/css/login_new.css';
body {
    height: 100vh;
}
.marketing-content {
    font-family: 'Bebas Neue', cursive;
    background: url('../assets/images/main.jpg');
}
.alert {
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
}
.alert h4 {
    margin-top: 0;
    color: inherit;
}
.alert .alert-link {
    font-weight: bold;
}
.alert > p,
.alert > ul {
    margin-bottom: 0;
}
.alert > p + p {
    margin-top: 5px;
}
.alert-dismissable,
.alert-dismissible {
    padding-right: 35px;
}
.alert-dismissable .close,
.alert-dismissible .close {
    position: relative;
    top: -15px;
    right: -27px;
    color: inherit;
    float: right;
}
.alert-success {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
}
.alert-success hr {
    border-top-color: #c9e2b3;
}
.alert-success .alert-link {
    color: #2b542c;
}
.alert-info {
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bce8f1;
}
.alert-info hr {
    border-top-color: #a6e1ec;
}
.alert-info .alert-link {
    color: #245269;
}
.alert-warning {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
}
.alert-warning hr {
    border-top-color: #f7e1b5;
}
.alert-warning .alert-link {
    color: #66512c;
}
.alert-danger {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
}
.alert-danger hr {
    border-top-color: #e4b9c0;
}
.alert-danger .alert-link {
    color: #843534;
}
#pswd_info {
    position: absolute;
    width: 100%;
    padding: 5px;
    background: #fefefe;
    font-size: 0.75em;
    border-radius: 5px;
    box-shadow: 0 1px 3px #ccc;
    border: 1px solid #ddd;
    top: 34px;
    display: block;
    z-index: 999;
}
.pass_checks {
    padding-left: 22px;
    line-height: 24px;
    color: #9e9fa1;
}
.pp {
    font-size: 12px;
    font-weight: bold;
}
#pswd_info ul {
    padding: 0;
}
#pswd_info li {
    list-style: none;
}
@media screen and (max-width: 660px) {
    .login-box {
        width: 100% !important;
    }
}
@media screen and (max-width: 390px) {
    .captcha_main iframe,
    .captcha_main_signup iframe,
    #gcaptcha-2 div,
    #gcaptcha-1 div {
        width: 100% !important;
    }
}
@media screen and (max-width: 660px) {
    .container-main {
        min-height: 90vh !important;
    }
}
@media screen and (min-width: 767px) {
    .container-main {
        flex-direction: row !important;
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
