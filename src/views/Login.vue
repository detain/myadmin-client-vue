<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
//import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useSiteStore } from '@/stores';
import { useRecaptchaProvider, Checkbox } from 'vue-recaptcha';

import $ from 'jquery';
import Swal from 'sweetalert2';

const siteStore = useSiteStore();
const authStore = useAuthStore();
const { logo, captcha, language, counts, opts, remember } = storeToRefs(authStore);
const { breadcrums, page_heading, sidemenu } = storeToRefs(siteStore);

const gresponse = ref('');
const gresponse2 = ref('');
const isLogin = ref(true);
const isPasswordVisible = ref(false);
const login = ref('');
const password = ref('');
const tos = ref(false);
const captchaCode = ref('');
const emailCode = ref('');
const twoFactorAuthCode = ref('');

const isTosCheked = computed(() => {
    return tos.value == true || login.value != '';
});

const passwordType = computed(() => {
    if (isPasswordVisible.value == true) {
        return 'text';
    } else {
        return 'password';
    }
});

const loginSchema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required('Username is required'),
    passwd: Yup.string().required('Password is required'),
});

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
    if (window.location.host != 'cn.interserver.net') {
        loginParams['g-recaptcha-response'] = gresponse.value;
    }
    console.log('Login Params:');
    console.log(loginParams);
    await authStore.login(loginParams).then((response) => {
        Swal.close();
    });
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
        signupParams['g-recaptcha-response'] = gresponse2.value;
    }
    console.log('Signup Params:');
    console.log(signupParams);
    authStore.signup(signupParams).then((response) => {
        Swal.close();
    });
}

function reloadCaptcha() {
    authStore.reloadCaptcha();
}

onMounted(function () {
    $(document).ready(function () {
        $('#tosModal').on('shown.bs.modal', function (e) {
            setModalMaxHeight(this);
        });
        animateValue(document.getElementById('count-v'));
        animateValue(document.getElementById('count-w'));
        animateValue(document.getElementById('count-s'));
        //reloadCaptcha(0);
        $('#captcha_alt_link, #captcha_main_link').click(function (e) {
            e.preventDefault();
            $('.captcha_main, .captcha_alt').toggle(500);
        });
        $('#captcha_alt_link_signup, #captcha_main_link_signup').click(function (e) {
            e.preventDefault();
            $('.captcha_main_signup, .captcha_alt_signup').toggle(500);
        });
        $('#forgot_link').click(function (e) {
            e.preventDefault();
            $('.sign-up-txt').hide();
            $('div.myadmin_login').toggle('500');
        });
        $('#access_link').click(function (e) {
            e.preventDefault();
            $('.sign-up-txt.signup').show();
            $('div.myadmin_login').toggle('500');
        });
        $('#btn-forgot').click(function (e) {
            forgot_password(e);
            return false;
        });
        $('input[type=password]').keyup(function () {
            $('#password_confirmation').on('keyup', function () {
                $('#pswd_info').hide();
            });
        });
        $('#signuppassword')
            .keyup(function () {
                // keyup code here
              //validate the length
                if (password.value.length < 8) {
                    $('#length .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
                } else {
                    $('#length .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
                }
                //validate letter
                if (password.value.match(/[a-z]/)) {
                    $('#letter .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
                } else {
                    $('#letter .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
                }
                //validate capital letter
                if (password.value.match(/[A-Z]/)) {
                    $('#capital .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
                } else {
                    $('#capital .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
                }
                //validate number
                if (password.value.match(/\d/)) {
                    $('#number .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
                } else {
                    $('#number .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
                }
                if (/^[a-zA-Z0-9- ]*$/.test(password.value) == false) {
                    $('#special .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
                } else {
                    $('#special .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
                }
            })
            .focus(function () {
                $('#pswd_info').show();
            })
            .blur(function () {
                $('#pswd_info').hide();
            });
        $('#password_confirmation').on('click', function () {
            $('#pswd_info').hide();
        });
    });
});

let signup_running = 0;

function setModalMaxHeight(element: HTMLElement | JQuery<HTMLElement>) {
    element = $(element);
  const content = element.find('.modal-content');
  const borderWidth = content.outerHeight() - content.innerHeight();
  const dialogMargin = $(window).width() < 768 ? 20 : 60;
  const contentHeight = $(window).height() - (dialogMargin + borderWidth);
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
    document.getElementById(modalID + '-backdrop')?.classList.toggle('hidden');
    document.getElementById(modalID)?.classList.toggle('flex');
    document.getElementById(modalID + '-backdrop')?.classList.toggle('flex');
}

function animateValue(obj, start = 0, end: null | number = null, duration = 1000) {
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
      let timer;
      const run = () => {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - remaining * range);
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

function login_handler(e) {
  const username = $('#login_id').val();
  const twofactor = twoFactorAuthCode.value;
  const password = $('#loginpassword').val();
  const captcha = $('#captcha').val();
  const emailconf = $('input[name=email_confirmation]').val();
  e.preventDefault();
  const remember = localStorage.rememberMe === 'true' ? 'yes' : 'no';
  if (username == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a username',
            html: username,
        });
    } else if (password == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a password',
            html: password,
        });
    } else {
      let loginCheckData = 'ajax=1&remember=' + remember + '&login_id=' + encodeURIComponent(username) + '&passwd=' + encodeURIComponent(password) + '&captcha=' + encodeURIComponent(captcha);
      if (twofactor) {
            loginCheckData = loginCheckData + '&2fa_code=' + encodeURIComponent(twofactor);
        }
        if (emailconf != '') {
            loginCheckData = loginCheckData + '&email_confirmation=' + encodeURIComponent(emailconf);
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
            url: 'https://' + window.location.host + newPath + 'ajax_check_login.php',
            data: loginCheckData,
            success: function (html) {
                console.log(loginCheckData);
                console.log(html.substring(0, 8) + ' got ' + html);
                if (html.substring(0, 4) == 'true') {
                    if (html.length == 4) {
                        window.location = 'index.php';
                    } else {
                        window.location = html.substring(4);
                    }
                } else if (html.substring(0, 8) == '2fa_auth') {
                    $('.loginsubmit, .signupsubmit').attr('disabled', false);
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
                    $('.loginsubmit, .signupsubmit').attr('disabled', false);
                    if ($('.login_email_popup').hasClass('hidden')) {
                        $('.login_email_popup').removeClass('hidden');
                    } else {
                        $('.login_email_popup .error-box').show();
                        $('.login_email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                    }
                    $('.captcha_main_signup').hide();
                    $('.captcha_alt_signup').hide();
                } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                    $('.loginsubmit, .signupsubmit').attr('disabled', false);
                    $('.login_email_popup .error-box').show();
                    $('.login_email_popup #error-message').html(html);
                    $('.captcha_main_signup').hide();
                    $('.captcha_alt_signup').hide();
                } else {
                    if (window.location.host != 'cn.interserver.net') {
                        gresponse.value = '';
                        gresponse2.value = '';
                    }
                    reloadCaptcha(0);
                    $('.loginsubmit, .signupsubmit').attr('disabled', false);
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
                gresponse2.value = '';
                Swal.fire({
                    icon: 'warning',
                    title: 'Error occurred!',
                });
            },
            beforeSend: function () {
                $('.loginsubmit, .signupsubmit').attr('disabled', true);
            },
        });
    }
    return false;
}

function forgot_password(e) {
    e.preventDefault();
  const username = $("input[name='email']").val();
  const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const captcha = $('#captchaFP').val();
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
            url: 'https://' + window.location.host + newPath + 'password.php',
            data: 'ajax=1&email=' + encodeURIComponent(username) + '&g-recaptcha-response=' + encodeURIComponent(gresponse) + '&captcha=' + encodeURIComponent(captcha),
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

function signup_handler(e) {
    e.preventDefault();
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
                errors = errors + '<strong>Error!</strong> Please enter an email address<br>';
            } else if (items[i].name == 'passwd' || items[i].name == 'password') {
                errors = errors + '<strong>Error!</strong> Please enter a password<br>';
            } else if (items[i].name == 'giftcard_number') {
                errors = errors + '<strong>Error!</strong> Please enter a giftcard number<br>';
            } else if (items[i].name == '2fa_code') {
                // do something
            } else if (items[i].name == 'captcha' || items[i].name == 'g-recaptcha-response') {
                // do something
            } else {
                errors = errors + '<strong>Error!</strong> Please enter a ' + items[i].name + ' (got a blank value)<br>';
            }
        }
        if (items[i].value != '' && items[i].name != 'captcha' && items[i].name != 'g-recaptcha-response') {
            data_string = data_string + '&' + items[i].name + '=' + encodeURIComponent(items[i].value);
        }
    }
    if (errors != '') {
        Swal.fire({
            icon: 'warning',
            html: errors,
        });
    } else {
        if (email_conf == '') {
            data_string = data_string + '&captcha=' + encodeURIComponent(captchaSignup) + '&g-recaptcha-response=' + encodeURIComponent(gresponse2.value);
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
                            window.location = 'index.php';
                        } else {
                            window.location = html.substring(4);
                        }
                    } else if (html.substring(0, 6) == 'verify') {
                        $('.loginsubmit, .signupsubmit').attr('disabled', false);
                        if ($('.email_popup').hasClass('hidden')) {
                            $('.email_popup').removeClass('hidden');
                        } else {
                            $('.email_popup .error-box').show();
                            $('.email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                        }
                        $('.captcha_main_signup').hide();
                        $('.captcha_alt_signup').hide();
                    } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                        $('.loginsubmit, .signupsubmit').attr('disabled', false);
                        $('.email_popup .error-box').show();
                        $('.email_popup #error-message').html(html);
                    } else {
                        $('.loginsubmit, .signupsubmit').attr('disabled', false);
                        gresponse.value = '';
                        gresponse2.value = '';
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
                    gresponse2.value = '';
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error occurred!',
                    });
                },
                beforeSend: function () {
                    $('.loginsubmit, .signupsubmit').attr('disabled', true);
                    Swal.close();
                },
            });
        }
    }
    return false;
}

useRecaptchaProvider();
authStore.load();
</script>

<template>
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" />
    <link rel="stylesheet" href="/css/tailwind.min.css" />
    <link rel="stylesheet" href="/node_modules/@fortawesome/fontawesome-free/css/all.min.css" />
    <link rel="stylesheet" href="/css/login_new.css" />
    <link rel="stylesheet" href="/node_modules/admin-lte/dist/css/adminlte.min.css" />
    <link rel="stylesheet" href="/templates/adminlte/custom_styles.css" />
    <div class="bg-black p-3 px-3"><img src="/images/logo_new.png" alt="" /></div>
    <div class="container-main flex min-h-screen flex-grow flex-col-reverse lg:flex-row">
        <div class="marketing-content min-h-full w-full bg-blue-700 lg:block lg:w-5/12">
            <h1 class="mt-5 w-full text-center text-3xl uppercase tracking-widest text-white">Welcome back to our growing Community</h1>
            <div class="mt-24 flex">
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/vps.png" alt="" /></div>
                    <div class="text-center text-4xl tracking-widest text-white" id="count-v">{{ counts.vps }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">VPS</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/website.png" alt="" /></div>
                    <div class="text-center text-4xl tracking-widest text-white" id="count-w">{{ counts.websites }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">Websites</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/servers.png" alt="" /></div>
                    <div class="text-center text-4xl tracking-widest text-white" id="count-s">{{ counts.servers }}</div>
                    <div class="text-center text-3xl uppercase tracking-widest text-yellow-600">Servers</div>
                </div>
            </div>
        </div>
        <div class="w-full lg:w-7/12">
            <div class="p-2"></div>
            <div class="mx-auto block lg:my-auto">
                <div class="wrapper w-full" v-show="isLogin">
                    <div class="myadmin_login w-full">
                        <div class="login-box m-auto" style="width: 400px">
                            <div class="card card-outline card-primary">
                                <div class="card-header text-center" style="display: flex">
                                    <i class="fa fa-user-circle text-orange-500" style="font-size: 35px" aria-hidden="true"></i>
                                    <h3 class="card-title text-bold ml-3 mt-2">Sign in to start your session</h3>
                                </div>
                                <div class="card-body">
                                    <form class="myadmin_loginForm mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" @submit.prevent="onLoginSubmit" :validation-schema="loginSchema">
                                        <div class="input-group mb-3">
                                            <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off" />
                                            <div class="input-group-append">
                                                <div class="input-group-text"><span class="fas fa-envelope" aria-hidden="true"></span></div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="loginpassword" :type="passwordType" class="login_info form-control" v-model="password" placeholder="Password" autocomplete="off" required />
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <button type="button" @click.prevent="isPasswordVisible = !isPasswordVisible" aria-hidden="true"><i class="fa" :class="{ 'fa-eye': !isPasswordVisible, 'fa-eye-slash': isPasswordVisible }"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 mb-1">
                                                <a class="float-right inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800" href="#" id="forgot_link">I forgot my password</a>
                                            </div>
                                            <div class="col-12">
                                                <div class="captcha_main mb-6">
                                                    <Checkbox v-model="gresponse" />
                                                    <div id="gcaptcha-1"></div>
                                                    <a href="#" class="text-sm font-bold text-blue-500 underline hover:text-blue-800" id="captcha_alt_link">Alternate Captcha</a>
                                                </div>
                                                <div class="captcha_alt mb-6">
                                                    <div class="flex">
                                                        <img :src="captcha" style="max-width: 75%" alt="" />
                                                        <button class="focus:shadow-outline btn-captcha-reload ml-4 block rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off" />
                                                        <div class="input-group-append">
                                                            <div class="input-group-text">
                                                                <span class="fa fa-robot" aria-hidden="true"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a class="text-sm font-bold text-blue-500 underline hover:text-blue-800" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-8">
                                                <div class="icheck-primary">
                                                    <input class="login_info" type="checkbox" id="remember" v-model="remember" />
                                                    <label for="remember">Remember Me</label>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <button id="" type="submit" class="loginsubmit btn btn-primary btn-block text-bold" @click.prevent="onLoginSubmit">Sign In</button>
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
                                                            <input type="text" class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" id="email_confirmation" name="email_confirmation" placeholder="Security Code" v-model="emailCode" autocomplete="off" required />
                                                        </div>
                                                        <div class="col-8">
                                                            <div class="icheck-primary">
                                                                <input class="login_info" type="checkbox" id="code-remember" v-model="remember" />
                                                                <label for="remember">Remember Me</label>
                                                            </div>
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="error-message"></span>
                                                                <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none';"><i class="fas fa-times" aria-hidden="true"></i></span>
                                                            </div>
                                                        </div>
                                                        <div class="text-center">
                                                            <button type="submit" @click.prevent="onLoginSubmit" class="loginsubmit rounded-lg bg-indigo-500 px-6 py-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">Sign In</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="poppup popup fixed inset-0 z-10 flex items-center justify-center" v-if="opts.tfa">
                                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                            <div class="relative z-10 mx-auto w-full max-w-3xl rounded-lg bg-white py-4 shadow-lg">
                                                <i class="close fa fa-close float-right cursor-pointer px-4 text-lg" @click="closePopup"></i>
                                                <div class="p-6">
                                                    <h2 class="mb-4 text-center text-2xl font-bold"><i class="fas fa-shield-alt mr-2" aria-hidden="true"></i>Enter Two Factor Authorization Code!</h2>
                                                    <p class="mb-8 text-center text-gray-600"><i class="fas fa-info-circle mr-2" aria-hidden="true"></i>Use your configured Authenticator to get a code and enter it here.</p>
                                                    <form>
                                                        <div class="signup_toggle twofactorauth mb-4">
                                                            <input type="text" v-model="twoFactorAuthCode" placeholder="Enter Code from Authenticator" class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="2fa-error-message"></span>
                                                                <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none';">
                                                                    <i class="fas fa-times" aria-hidden="true"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="mb-4">
                                                            <label class="flex items-center">
                                                                <input type="checkbox" name="remember" id="2fa-remember" class="form-checkbox h-4 w-4 rounded-sm text-indigo-500" v-model="remember" />
                                                                <span class="ml-2 text-gray-800">Remember me</span>
                                                            </label>
                                                        </div>
                                                        <div class="text-center">
                                                            <button type="submit" @click.prevent="onLoginSubmit" class="loginsubmit rounded-lg bg-indigo-500 px-6 py-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">Sign In</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="social-auth-links mb-3 mt-2 text-center">
                                        <h3 class="text-bold text-center text-lg">Sign in using:</h3>
                                        <a href="#" class="btn btn-primary btn-lg" data-toggle="tooltip" title="Sign in using Facebook" onclick="window.open('oauth/callback.php?provider=Facebook', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fab fa-facebook" aria-hidden="true"></i></a>
                                        <a href="#" class="btn btn-danger btn-lg" data-toggle="tooltip" title="Sign in using Google+" onclick="window.open('oauth/callback.php?provider=Google', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fab fa-google-plus" aria-hidden="true"></i></a>
                                        <a href="#" class="btn btn-secondary btn-lg" data-toggle="tooltip" title="Sign in using Github" onclick="window.open('oauth/callback.php?provider=GitHub', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fa fa-github"></i></a>
                                        <a href="#" class="btn btn-info btn-lg" data-toggle="tooltip" title="Sign in using Twitter" onclick="window.open('oauth/callback.php?provider=Twitter', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fa fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="myadmin_login w-full p-4" style="display: none">
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
                                        <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off" />
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fas fa-envelope" aria-hidden="true"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="captcha_main mb-6">
                                        <div class="flex">
                                            <img :src="captcha" style="max-width: 75%" alt="" />
                                            <button class="focus:shadow-outline btn-captcha-reloadFP ml-4 block rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false"><span class="fa fa-refresh fa-fw"></span></button>
                                        </div>
                                        <div class="input-group my-3">
                                            <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off" />
                                            <div class="input-group-append">
                                                <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="forgot-password-message"></div>
                                    <button id="btn-forgot" type="submit" class="btn btn-primary btn-block text-bold">Continue</button>
                                </form>
                                <div class="row">
                                    <div class="col-12 myadmin_forgotPwd mb-1">
                                        <a id="access_link" href="#" class="float-right inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800">Login to My Account</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrapper-signup mx-auto w-full" v-show="!isLogin">
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
                                            <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off" />
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <span class="fas fa-envelope" aria-hidden="true"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="signuppassword" :type="passwordType" class="form-control" v-model="password" placeholder="Password" autocomplete="off" required />
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <button type="button" @click.prevent="isPasswordVisible = !isPasswordVisible" aria-hidden="true"><i class="fa" :class="{ 'fa-eye': !isPasswordVisible, 'fa-eye-slash': isPasswordVisible }"></i></button>
                                                </div>
                                            </div>
                                            <div id="pswd_info">
                                                <p class="pp"><b>Password must have:</b></p>
                                                <ul>
                                                    <li id="length" class="pass_checks"><i aria-hidden="true" class="fa fa-close bg-red b-radius mr-2 px-2 py-1 text-white"></i>atleast 8 characters</li>
                                                    <li id="capital" class="pass_checks"><i aria-hidden="true" class="fa fa-close bg-red b-radius mr-2 px-2 py-1 text-white"></i>atleast 1 uppercase</li>
                                                    <li id="letter" class="pass_checks"><i aria-hidden="true" class="fa fa-close bg-red b-radius mr-2 px-2 py-1 text-white"></i>atleast 1 lowercase</li>
                                                    <li id="number" class="pass_checks"><i aria-hidden="true" class="fa fa-close bg-red b-radius mr-2 px-2 py-1 text-white"></i>atleast 1 number</li>
                                                    <li id="special" class="pass_checks"><i aria-hidden="true" class="fa fa-close bg-red b-radius mr-2 px-2 py-1 text-white"></i>atleast 1 special char</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="signup_toggle twofactorauth mb-6 hidden">
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" id="signup_2fa_code" name="2fa_code" v-mode="twoFactorAuthCode" placeholder="Enter Code from Authenticator" autocomplete="off" />
                                                        <div class="input-group-append">
                                                            <div class="input-group-text"><span class="fa fa-lock" aria-hidden="true"></span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="captcha_main_signup mb-6">
                                                    <Checkbox v-model="gresponse2" />
                                                    <div id="gcaptcha-2"></div>
                                                    <a href="#" class="text-sm font-bold text-blue-500 underline hover:text-blue-800" id="captcha_alt_link_signup">Alternate Captcha</a>
                                                </div>
                                                <div class="captcha_alt_signup mb-6">
                                                    <div class="flex">
                                                        <img :src="captcha" style="max-width: 75%" alt="" />
                                                        <button class="focus:shadow-outline btn-captcha-reload ml-4 block rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off" />
                                                        <div class="input-group-append">
                                                            <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                                        </div>
                                                    </div>
                                                    <a class="text-sm font-bold text-blue-500 underline hover:text-blue-800" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="icheck-primary">
                                                    <input type="checkbox" id="tos" required v-model="tos" />
                                                    <label for="tos"
                                                        >I agree to the <span class="text-sm font-bold text-blue-500 underline hover:text-blue-800"><a href="https://www.interserver.net/terms-of-service.html" target="_blank" @click.prevent="toggleModal('tosModal')">Terms of Service</a></span></label
                                                    >
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
                                                            <input type="text" id="signup_email_confirmation" name="email_confirmation" placeholder="Security Code" v-model="emailCode" autocomplete="off" required class="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert" style="display: none">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="signup-error-message"></span>
                                                                <span class="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3" onclick="document.querySelector('.error-box').style.display = 'none';">
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
                                        <a href="#" class="btn btn-primary btn-lg" data-toggle="tooltip" title="Sign up using Facebook" onclick="window.open('oauth/callback.php?provider=Facebook', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fab fa-facebook" aria-hidden="true"></i></a>
                                        <a href="#" class="btn btn-danger btn-lg" data-toggle="tooltip" title="Sign up using Google+" onclick="window.open('oauth/callback.php?provider=Google', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fab fa-google-plus" aria-hidden="true"></i></a>
                                        <a href="#" class="btn btn-secondary btn-lg" data-toggle="tooltip" title="Sign up using Github" onclick="window.open('oauth/callback.php?provider=GitHub', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fa fa-github"></i></a>
                                        <a href="#" class="btn btn-info btn-lg" data-toggle="tooltip" title="Sign up using Twitter" onclick="window.open('oauth/callback.php?provider=Twitter', 'authWindow', 'width=600,height=600,scrollbars=yes'); return false;"><i class="fa fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sign-up-txt signup pb-5 text-center text-gray-600" v-show="isLogin">Don't have an account? <a class="sign-up text-sm font-bold text-blue-500 hover:text-blue-800" @click="isLogin = !isLogin">Sign Up</a></div>
                <div class="sign-up-txt pb-5 text-center text-gray-600" v-show="!isLogin">Already have an account? <a class="sign-up text-sm font-bold text-blue-500 hover:text-blue-800" @click="isLogin = !isLogin">Login</a></div>
                <div class="p-1 text-center text-sm text-gray-500">Copyright &copy; {{ new Date().getFullYear() }} - All Rights Reserved.</div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="h-128 fixed inset-0 z-50 hidden items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none" id="tosModal">
        <div class="relative mx-auto my-6 w-auto max-w-3xl">
            <!--content-->
            <div class="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between rounded-t border-b border-solid border-gray-300 p-5">
                    <h3 class="text-3xl font-semibold">Terms of Service</h3>
                    <button class="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none" onclick="toggleModal('tosModal')">
                        <span class="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">×</span>
                    </button>
                </div>
                <!--body-->
                <div class="relative flex-auto p-6">
                    <div class="modal-content my-4 h-64 overflow-y-auto text-lg leading-relaxed text-gray-600">
                        <div class="modal-body text-black">
                            <div class="clear container" style="display: inline">
                                <div class="other_main">
                                    <p class="common_paragraph pt-3">InterServer's terms of service applies to all content, domains and clients with in the InterServer network.</p>
                                    <div class="press_details bg-gray-200 bg-gray-200 p-3 p-3">
                                        <p class="font-semibold text-black">Ordering</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Please read the following Terms Of Service agreement before proceeding, then continue ordering. These policies are designed to protect the best interests of our customers as a whole. Interserver's policy is to act as a neutral provider of access to the global Internet. We reserve the right to suspend or cancel a customer's access to any or all services provided by us if it is decided that the account has been inappropriately used.</p>
                                    <p class="common_paragraph pt-3">All shared hosting services are intended for the end user only and may not be subleased, sold or given to third parties.</p>
                                    <p class="common_paragraph pt-3">Any products and services to be provided to Client will be at a professional level of quality conforming to generally accepted industry standards and in compliance in all material respect with all applicable laws and regulations. Except as otherwise expressly provided in this agreement, Interserver does not make, and hereby disclaims any and all other warranties, expressed or implied including any and all warranties of merchantability or fitness for a particular purpose.</p>
                                    <p class="common_paragraph pt-3">Clients are responsible for frequently backing up their files on our system. Interserver cannot be held responsible for the deletion of users' files, whether intentional or unintentional.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Authorization of Charges</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">InterServer will bill for services rendered which are due with in seven (7) days. Client authorizes InterServer to charge credit card supplied by Client if stored with in our billing system. Paypal or check/money order are also accepted if client chooses not to store a credit card.</p>
                                    <p class="common_paragraph pt-3">Interserver may discontinue service for failure to make payment for initial fees or for any re-occuring fees thereafter. Interserver reserves the right to refuse, suspend, or cancel service pending receipt of a valid payment.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Content Restrictions</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">All services provided by Interserver may be used for lawful purposes only. Transmission, storage, or presentation of any information, data, or material in violation of any United States federal, state, or local law is strictly prohibited. This includes but is not limited to copyrighted or trademarked material and material protected by trade secret.</p>
                                    <p class="common_paragraph pt-3">Warez Policy: Actual files, including but not limited to pirated software, hacker programs, cracks, and MP3 files, are strictly prohibited from being stored on any Interserver servers.</p>
                                    <p class="common_paragraph pt-3">Examples of unacceptable content include, but are not limited to the following: Pirated software, Hacker programs or archives, illegal audio files or archives.</p>
                                    <p class="common_paragraph pt-3">IRC and camfrog servers are strictly prohibited.</p>
                                    <p class="common_paragraph pt-3">Interserver reserves the right to disable any material from Client's web space that is reasonably deemed unacceptable.</p>
                                    <p class="common_paragraph pt-3">Interserver reserves the right to suspend Client's account our discretion if said material is discovered.</p>
                                    <p class="common_paragraph pt-3">Interserver is the sole arbiter as to what constitutes a violation of the above provisions.</p>
                                    <p class="common_paragraph pt-3">Interserver reserves the right to suspend any client which violates section 3 of our Terms Of Service.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Shared Hosting Application Restrictions</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">VPS servers are not permitted to run CPU mining programs. Shared Webhosting Restrictions: The Client is allowed to freely install CGI/PHP applications; however, Interserver reserves the right to disable any application that unreasonably effects or interferes with normal server operations. Said situation is highly unlikely. Some scripts and sites are not allowed on shared hosting: *Tube / youtube clone sites, adult content, file archives, mirror sites, image and file upload sites. No single shared hosting account is permitted to use more that 20% of the server resources at a time. A single account is limited to 250,000 inodes at any given time. Clients on the Unlimited SSD shared hosting platform using more than 1GB of space will be moved to SATA.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Spam Policy</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Interserver servers may not be the source, intermediary, or destination address involved in the transmission of Spam, Spamware and other Spam Software or misuse of SMTP. Client's domain or IP may not be referenced as originator or intermediary in any of the above.</p>
                                    <p class="common_paragraph pt-3">Interserver considers Spam to be any mass unsolicited message in the mediums of newsgroups and e-mail.</p>
                                    <p class="common_paragraph pt-3">The actions stated above will not be tolerated. Violation will result in the immediate deactivation of services without refund of any kind. Furthermore, a fine of one-hundred (100) US dollars will be imposed for each spam policy violation. Interserver is the sole arbiter as to what constitutes a violation of the above provisions.</p>
                                    <p class="common_paragraph pt-3">InterServer IP blocks may not be used for the purposes of IP rotation while sending email. InterServer may, through feedback loop monitoring, block SMTP traffic on a server found to be sending email through multiple IP addresses. Failure to respond to SPAM complaints will result in a block against SMTP traffic and may result in account termination. Further mailing list policies are included in the Email / Mailing List Policy.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Server Abuse</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Any attempt to undermine or cause harm to a Interserver server or another Interserver Client is strictly prohibited.</p>
                                    <p class="common_paragraph pt-3">Any attempt to undermine any Interserver web site or a web site of another Interserver Client is strictly prohibited and may result in immediate termination of services rendered by Interserver without refund. Interserver is the sole arbiter as to what constitutes a violation of the above provisions. A fine of two-hundred (200) USD may be implemented for intentional server abuse.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Indemnification</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Client agrees that it will defend, indemnify, and hold harmless Interserver from any and all demands, fines, liabilities, losses, costs, claims, and expenses, including attorney's fees, asserted against Interserver, its employees, officers, agents, and directors that may arise or result from any service provided or performed, or agreed to be performed, or any product sold by Client, its employees, officers, agents, and directors.</p>
                                    <p class="common_paragraph pt-3">The Client agrees that it will defend, indemnify, and hold harmless Interserver against any liabilities, including but not limited to, those arising out of (1) any injury to person or property caused by any product sold or service rendered or otherwise distributed in connection with Interserver's servers; (2) any material supplied by the Client infringing upon or allegedly infringing upon the proprietary rights of a third party; (3) copyright infringement; and (4) any defective products sold to the Client's customer from Interserver's servers.</p>
                                    <p class="common_paragraph pt-3">Interserver assumes no liability of the Client for failure to follow this Agreement and any results caused by the acts, omissions or negligence of the Client, sub-contractor or an agent of Client or an employee of any one to them, including, but not limited to, claims of third parties arising out of or resulting from or in connection with the Client's products, messages, programs, caller contracts, promotions, advertising, infringement or any claim for libel or slander or for violation of copyright, trademark or other intellectual property rights. Any attempt to undermine any Interserver web site or a web site of another Interserver Client is strictly prohibited and may result in immediate termination of services rendered by Interserver without refund. Interserver is the sole arbiter as to what constitutes a violation of the above provisions. A fine of two-hundred (200) USD may be implemented for intentional server abuse.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Disclaimer</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Interserver wll not be held responsible for any damages you or your business may suffer. Interserver makes no warranties of any kind, expressed or implied, for services rendered. Interserver disclaims any warranty or merchantability or fitness for a particular purpose. Interserver assumes no liability for disruptions or improper operation of its equipment or software for any reason, including, but not limited to, vandalism, theft, phone service outages, Internet disruptions, human error, extreme or severe weather conditions or any other causes in the nature of "Acts of God" or force majeure. Interserver will not be responsible for consequential damages or punitive or exemplary damages under any circumstances. In no case will Client be entitled to recover damages from Interserver.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Term</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph first_cap pt-3">A The term of this Agreement will continue until a notice of cancellation by Interserver or Client is given, or until terminated under other provisions of this Agreement. Interserver reserves the right to terminate this Agreement with cause upon notification to the Client. Interserver may further terminate this Agreement immediately without notice at any time the Client breaches any part of this Agreement, or if any program or facility used by Interserver to implement this Agreement is disrupted or terminated for any reason.</p>
                                    <p class="common_paragraph first_cap pt-3">B 9.b is only applicable to Shared Hosting Accounts (package IS 1.0-3.0). CLIENT may request Interserver refunds money within 30 days after sign up has taken place. CLIENT will be refunded the full amount they have paid. If 30 days have past CLIENT may cancel contract, however, CLIENT forfeits monies paid to Interserver. CLIENT may cancel account with Interserver and be removed from billing, thereby stopping all future charges.</p>
                                    <p class="common_paragraph first_cap pt-3">C 9.c is only applicable to Dedicated/Colocation and IP Transit accounts. Refunds will be issued to any order prior to service turn up at CLIENT's request. Refunds are not offered on Dedicated servers, colocation space, VPS, licencing or IP transit after service has started.</p>
                                    <p class="common_paragraph first_cap pt-3">D These policies may be modified or changed by Interserver. Interserver will inform client of any major policy changes.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Presumption of Agreement</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">By signing up with Interserver, be it using Interserver's online sign up form or contacting in any way an employee, officer, agent, and director with request for Interserver to provide Client services, Client (1) authorizes Interserver to take the actions necessary in order to setup Client's account, including charging credit card, if applicable, supplied by Client at time of sign up; and (2) agrees to each and every provision set forth in this Agreement and shall hold to said Agreement in the court of law.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Default</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">In the event Client defaults in any provision or fails to perform pursuant to this Agreement, Interserver will be entitled to damages, costs, and attorney's fees from the Client.</p>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Invalid or Non-enforeable Provisions</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">The invalidity or non-enforceability of any provision of this Agreement, as so determined by a court of competent jurisdiction, will not affect the other provisions hereof, and in any such occasion this Agreement will be construed in all respects as if such invalid or non-enforceable provision were omitted. This agreement constitutes the entire agreement between the parties hereto.</p>
                                    <div class="press_details bg-gray-200 p-3"><p class="font-semibold text-black">Choice of Law / Venue</p></div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">This Agreement will be construed and enforced in accordance with the laws of the State of NJ and the venue for any action, dispute or proceeding with respect to this Agreement will be NJ.</p>
                                    <div class="press_details bg-gray-200 p-3"><p class="font-semibold text-black">Domain Agreement</p></div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Interserver may provide new top level domain name for new clients as requested by them, on packages with specifically state this. These domain names carry no charge for renewals thereafter to the client while client remains hosted at Interserver. The client is responsible for renewing domain name by contacting the sales department. Should client decide to switch hosting providers, client agrees to pay yearly fee listed on the Interserver website for domain name registrations.</p>
                                    <div class="press_details bg-gray-200 p-3"><p class="font-semibold text-black">Email / Mailing List Policy</p></div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">Server's which are for mailing only are disallowed on InterServer's network. A mailing only server is defined as any any shared/vps/dedicated/colocated server who's primary purpose is sending email over SMTP. Interserver's network is monitored through multiple feedback loops and may terminate, with out prior warning, a server which has a high complaint ratio including servers that may be CAN-SPAM compliant. Running a single opt in, opt out only, or any other non double opt in mailing list will result in server termination.</p>
                                    <ul class="other_Ulist list-disc">
                                        <li>Mailing lists must be double opt in lists.</li>
                                        <li>Messages must have clear removal instructions and valid headers.</li>
                                        <li>Removal requests must be completed with in 24 hours.</li>
                                        <li>Messages must include details on how the user subscribed. These details must be provided to Interserver on our request.</li>
                                        <li>Excessive complaints may result in account termination.</li>
                                        <li>Interserver reserves the right to charge $100 fee for IPs which are blacklisted due to failing to adhere to Interserver policies.</li>
                                        <li>Operating an account on behalf of, or in connection with, or reselling any
                                          service to, persons or firms listed in the Spamhaus Register of Known Spam
                                          Operations (ROKSO) database at: https://www.spamhaus.org will result in
                                          immediate account termination.</li>
                                    </ul>
                                    <div class="press_details bg-gray-200 p-3">
                                        <p class="font-semibold text-black">Abuse Complaints</p>
                                    </div>
                                    <div class="bottom_hrline bottom_adjust"></div>
                                    <p class="common_paragraph pt-3">All abuse complaints must be responded to no later than 48 hours after the complaint is made. Failure to reply may result in account termination. Interserver reserves the right to remove files which do not adhere to our terms of service, local, state, or federal laws.</p>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--footer-->
                <div class="flex items-center justify-end rounded-b border-t border-solid border-gray-300 p-6">
                    <button class="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none focus:outline-none" type="button" style="transition: all 0.15s ease" @click.prevent="toggleModal('tosModal')">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="fixed inset-0 z-40 hidden bg-black opacity-25" id="tosModal-backdrop"></div>
</template>

<style scoped>
/*@tailwind base;
@tailwind components;
@tailwind utilities;*/
body {
    height: 100vh;
}
.marketing-content {
    font-family: 'Bebas Neue', cursive;
    background: url('/images/main.jpg');
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
    display: none;
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
</style>
