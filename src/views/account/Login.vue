<script setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, onMounted } from 'vue'
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();
const { breadcrums, page_heading, sidemenu, gravatar, opts } = storeToRefs(layoutStore);

const counts = {
    vps: ref(0),
    webhosting: ref(0),
    servers: ref(0),
};
const tos = ref(false);
const login = ref('');

const isTosCheked = computed(() => {
    return tos == true || login != '';
});

const schema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required('Username is required'),
    passwd: Yup.string().required('Password is required')
});

onMounted(function () {
    jQuery(document).ready(function () {
        $("#tosModal .modal-content").load("/templates/modals/tos.html");
        $("#tosModal").on("show.bs.modal", function (e) {
            setModalMaxHeight(this);
            $(this).show();
            setModalMaxHeight(this);
        });
        $("#tosModal").on("shown.bs.modal", function (e) {
            setModalMaxHeight(this);
        });
        jQuery("#tos-txt").click(function () {
            toggleModal("tosModal");
        });
        jQuery(".captcha_alt").css("display", "none");
        jQuery(".captcha_alt_signup").css("display", "none");
        animateValue(document.getElementById("count-v"));
        animateValue(document.getElementById("count-w"));
        animateValue(document.getElementById("count-s"));

        $(window).resize(function () {
            if ($("#tosModal.in").length != 0) {
                setModalMaxHeight($("#tosModal.in"));
            }
        });
        //console.log(qe);
        if (qe != "") {
            $.ajax({
                type: "POST",
                url: "ajax_order_queue_display.php",
                data: qe.substring(1),
                success: function (html) {
                    if (html.trim != "") {
                        jQuery("#order_summary_dropdown").css("display", "inherit");
                        jQuery(".myadmin_login .myadmin_authTitle").css("line-height", "150%");
                    }
                    jQuery("#order_summary").html(html);
                },
                beforeSend: function () {
                    jQuery("#order_summary").html(
                        "<p class='text-center loading-spinner'><img src='images/ajax-loader.gif'></p>"
                    );
                }
            });
        }

        reloadCaptcha(0);

        jQuery(".btn-captcha-reload").click(function (e) {
            e.preventDefault();
            reloadCaptcha();
        });
        jQuery(".btn-captcha-reloadFP").click(function (e) {
            e.preventDefault();
            reloadCaptcha(1);
        });
        jQuery("#captcha_alt_link, #captcha_main_link").click(function (e) {
            e.preventDefault();
            jQuery(".captcha_main, .captcha_alt").toggle(500);
        });
        jQuery("#captcha_alt_link_signup, #captcha_main_link_signup").click(function (
            e
        ) {
            e.preventDefault();
            jQuery(".captcha_main_signup, .captcha_alt_signup").toggle(500);
        });
        jQuery(".signup_toggler").click(function (e) {
            e.preventDefault();
            var pathArray = window.location.pathname.split('/');
            var newPath = "/";
            for (i = 1; i < pathArray.length - 1; i++) {
                newPath += pathArray[i];
                newPath += "/";
            }
            // since its called before the toggle, logic needsd to be backwords
            if (login_type == "signup") {
                login_type = "login";
                jQuery("#loginForm").attr("action", "https://" + window.location.host + newPath + "ajax_check_login.php" + qe);
            } else {
                login_type = "signup";
                jQuery("#loginForm").attr("action", "https://" + window.location.host + newPath + "ajax_check_signup.php" + qe);
            }
            jQuery(".signup_toggle").toggle("500");
            jQuery(".twofactorauth").hide();
        });
        jQuery(".btn-password-show").click(function (e) {
            if (jQuery(e.currentTarget.dataset.target).attr("type") == "password") {
                jQuery(e.currentTarget.dataset.target).attr("type", "text");
            } else {
                jQuery(e.currentTarget.dataset.target).attr("type", "password");
            }
        });
        jQuery("#forgot_link").click(function (e) {
            e.preventDefault();
            jQuery('.sign-up-txt').hide();
            jQuery("div.myadmin_login").toggle("500");
        });
        jQuery("#access_link").click(function (e) {
            e.preventDefault();
            jQuery('.sign-up-txt.signup').show();
            jQuery("div.myadmin_login").toggle("500");
        });
        var rememberMe = localStorage.rememberMe === "true" ? true : false;
        jQuery("#remember").prop("checked", rememberMe || false);
        jQuery("#remember").on("change", function () {
            localStorage.rememberMe = jQuery("#remember").prop("checked");
        });
        jQuery("#loginForm input").keydown(function (e) {
            enter_handler(e);
        });
        jQuery(".loginsubmit").click(function (e) {
            login_handler(e);
            return false;
        });
        jQuery(".signupsubmit").click(function (e) {
            signup_handler(e);
            return false;
        });
        jQuery("#btn-forgot").click(function (e) {
            forgot_password(e);
            return false;
        });
        jQuery("#login_id").on("change", "", function () {
            var login_id_val = jQuery(this).val().toLowerCase();
            login_id_val = login_id_val.trim();
            jQuery(this).val(login_id_val);
        });

        jQuery(".sign-up").on("click", "", function (e) {
            e.preventDefault();
            var pathArray = window.location.pathname.split('/');
            var newPath = "/";
            for (i = 1; i < pathArray.length - 1; i++) {
                newPath += pathArray[i];
                newPath += "/";
            }
            if (login_type == "login") {
                login_type = "signup";
                jQuery("#loginForm").attr("action", "https://" + window.location.host + newPath + "ajax_check_signup.php" + qe);
            } else {
                login_type = "login";
            }
            console.log("Form " + login_type);
            jQuery(".sign-up-txt").toggle();
            jQuery(".wrapper, .wrapper-signup").toggle(100);
        });
        $('input[type=password]').keyup(function () {
            $('#password_confirmation').on('keyup', function () {
                $('#pswd_info').hide();
            });
        });
        $('#signuppassword').keyup(function () {
            // keyup code here
            var pswd = $(this).val();
            //validate the length
            if (pswd.length < 8) {
                $('#length .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1');
            } else {
                $('#length .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
            }

            //validate letter
            if (pswd.match(/[a-z]/)) {
                $('#letter .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
            } else {
                $('#letter .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1')
            }

            //validate capital letter
            if (pswd.match(/[A-Z]/)) {
                $('#capital .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
            } else {
                $('#capital .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1')
            }

            //validate number
            if (pswd.match(/\d/)) {
                $('#number .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
            } else {
                $('#number .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1')
            }
            if (/^[a-zA-Z0-9- ]*$/.test(pswd) == false) {
                $('#special .fa').addClass('fa-check bg-green p-1').removeClass('fa-close bg-red py-1 px-2');
            } else {
                $('#special .fa').addClass('fa-close bg-red px-2 py-1').removeClass('fa-check bg-green p-1')
            }

        }).focus(function () {
            $('#pswd_info').show();
        }).blur(function () {
            $("#pswd_info").hide();

        });
        $('#password_confirmation').on('click', function () {
            $('#pswd_info').hide();
        });
    });
});

async function onSubmit(values) {
    const authStore = useAuthStore();
    const layoutStore = useLayoutStore();
    console.log('Values:');
    console.log(values);
    const loginParams = {
        login: values.login,
        passwd: values.passwd
    };
    if (layoutStore.opts.tfa == true) {
        loginParams.tfa = values.tfa;
    }
    await authStore.login(loginParams);
}

var signup_running = 0;

function reloadCaptcha(fp) {
    if (fp != 0 && fp != "0") {
        fp = 0;
    }
    $.ajax({
        url: "ajax_captcha.php",
        data: "fp=" + fp,
        success: function (src) {
            //if (fp == 1) {
            jQuery("#captcha-imgFP").attr("src", src);
            //} else {
            jQuery("#captcha-img").attr("src", src);
            jQuery("#captcha-img-signup").attr("src", src);
            //}
        }
    });
}

function setModalMaxHeight(element) {
    element = $(element);
    var content = element.find(".modal-content");
    var borderWidth = content.outerHeight() - content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = element.find(".modal-header").outerHeight() || 0;
    var footerHeight = element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);
    content.css({
        overflow: "hidden"
    });
    element.find(".modal-body").css({
        "max-height": maxHeight,
        "overflow-y": "auto"
    });
}

function toggleModal(modalID) {
    document.getElementById(modalID).classList.toggle("hidden");
    document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
    document.getElementById(modalID).classList.toggle("flex");
    document.getElementById(modalID + "-backdrop").classList.toggle("flex");
}

function animateValue(obj, start = 0, end = null, duration = 1000) {
    if (obj) {
        // save starting text for later (and as a fallback text if JS not running and/or google)
        var textStarting = obj.innerHTML;
        // remove non-numeric from starting text if not specified
        end = end || parseInt(textStarting.replace(/\D/g, ""));
        var range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));
        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);
        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;
        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - remaining * range);
            // replace numeric digits only in the original string
            obj.innerHTML = textStarting.replace(/([0-9]+)/g, value);
            if (value == end) {
                clearInterval(timer);
            }
        }
        timer = setInterval(run, stepTime);
        run();
    }
}

function enter_handler(e) {
    if (e.keyCode == 13) {
        //jQuery('#loginForm').submit();
        e.preventDefault();
        if (login_type == "signup") {
            signup_handler(e);
        } else {
            login_handler(e);
        }
    }
}

function login_handler(e) {
    var loading = Swal.fire({
        title: 'Please wait',
        html: '<i class="fa fa-spinner fa-spin fa-2x"></i><br/>Processing Login Information',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    var username = jQuery("#login_id").val();
    var twofactor = jQuery("#2fa_code").val();
    var password = jQuery("#loginpassword").val();
    var captcha = jQuery("#captcha").val();
    var emailconf = jQuery("input[name=email_confirmation]").val();
    e.preventDefault();
    var remember = localStorage.rememberMe === "true" ? "yes" : "no";
    if (username == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a username',
            html: username
        });
        // jQuery("#message").html(
        //     '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a username (got blank value: ' +
        //         username +
        //         ")</div>"
        // );
    } else if (password == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Please enter a password',
            html: password
        });
        // jQuery("#message").html(
        //     '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a password (got blank value: ' +
        //         password +
        //         ")</div>"
        // );
    } else {
        if (twofactor) {
            var loginCheckData =
                "ajax=1&remember=" +
                remember +
                "&login_id=" +
                encodeURIComponent(username) +
                "&passwd=" +
                encodeURIComponent(password) +
                "&" +
                qe.substring(1) +
                "&captcha=" +
                encodeURIComponent(captcha) +
                "&2fa_code=" +
                encodeURIComponent(twofactor);
        } else {
            var loginCheckData =
                "ajax=1&remember=" +
                remember +
                "&login_id=" +
                encodeURIComponent(username) +
                "&passwd=" +
                encodeURIComponent(password) +
                "&" +
                qe.substring(1) +
                "&captcha=" +
                encodeURIComponent(captcha);
        }
        if (host != "cn.interserver.net") {
            loginCheckData =
                loginCheckData +
                "&g-recaptcha-response=" +
                encodeURIComponent(grecaptcha.getResponse(gcaptchaWidget1));
        }
        if (emailconf != "") {
            loginCheckData = loginCheckData + "&email_confirmation=" + encodeURIComponent(emailconf);
        }
        var pathArray = window.location.pathname.split('/');
        var newPath = "/";
        for (i = 1; i < pathArray.length - 1; i++) {
            newPath += pathArray[i];
            newPath += "/";
        }
        $.ajax({
            type: "POST",
            url: "https://" + window.location.host + newPath + "ajax_check_login.php",
            data: loginCheckData,
            success: function (html) {
                loading.close();
                console.log(loginCheckData);
                // jQuery("#message").html("");
                console.log(html.substring(0, 8) + " got " + html);
                if (html.substring(0, 4) == "true") {
                    if (html.length == 4) {
                        window.location = "index.php";
                    } else {
                        window.location = html.substring(4);
                    }
                } else if (html.substring(0, 8) == "2fa_auth") {
                    // if (host != "cn.interserver.net") {
                    //     grecaptcha.reset(gcaptchaWidget1);
                    // }
                    jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                    jQuery(".twofactorauth").show(500);
                    jQuery(".captcha_main").hide();
                    jQuery(".captcha_alt").hide();
                    if ($('.popup').hasClass('hidden')) {
                        $('.popup').removeClass('hidden');
                    } else {
                        $('.popup .error-box').show();
                        $('.popup #error-message').text('Invalid Code, Please Enter correct code.');
                    }
                    // jQuery("#message").html(
                    //     '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Enter Two Factor Authorization Code!</strong><br>Use your configured Authenticator to get a code and enter it here.</div>'
                    // );
                } else if (html.substring(0, 6) == "verify") {
                    jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                    // jQuery(".confirmrow").show(500);
                    if ($('.login_email_popup').hasClass('hidden')) {
                        $('.login_email_popup').removeClass('hidden');
                    } else {
                        $('.login_email_popup .error-box').show();
                        $('.login_email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                    }
                    // Swal.fire({
                    //     icon: 'warning',
                    //     title: 'Need Email Confirmation Code!',
                    //     html: 'Check your email for the confirmation code to login to your account and fill it in the appropriate field. It may take a few minutes to arrive.  If you are unable to complete the login process or receive the email please contact support@interserver.net for further assistance.'
                    // });
                    // jQuery("#message").html(
                    //     '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Need Email Confirmation Code!</strong><br>Check your email for the confirmation code to login to your account and fill it in the appropriate field. It may take a few minutes to arrive.  If you are unable to complete the login process or receive the email please contact support@interserver.net for further assistance.</div>'
                    // );
                    jQuery(".captcha_main_signup").hide();
                    jQuery(".captcha_alt_signup").hide();
                } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                    jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                    $('.login_email_popup .error-box').show();
                    $('.login_email_popup #error-message').html(html);
                    jQuery(".captcha_main_signup").hide();
                    jQuery(".captcha_alt_signup").hide();
                } else {
                    if (host != "cn.interserver.net") {
                        grecaptcha.reset(gcaptchaWidget1);
                    }
                    reloadCaptcha(0);
                    jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                    // jQuery("#message").html(html);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error',
                        html: html
                    });
                }
            },
            error: function () {
                loading.close();
                jQuery(".loginsubmit, .signupsubmit").prop("disabled", false);
                grecaptcha.reset(gcaptchaWidget1);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error occurred!'
                });
                // jQuery("#message").html(
                //     '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred!</div>'
                // );
            },
            beforeSend: function () {
                jQuery(".loginsubmit, .signupsubmit").attr("disabled", true);
                loading;

            }
        });
    }
    return false;
}

function forgot_password(e) {
    e.preventDefault();
    var username = jQuery("input[name='email']").val();
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var captcha = jQuery("#captchaFP").val();
    if (username == "") {
        jQuery("#forgot-password-message").html(
            '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a email address.</div>'
        );
    } else if (regex.test(username) == false) {
        jQuery("#forgot-password-message").html(
            '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Please enter a valid email address.</div>'
        );
    } else {
        var pathArray = window.location.pathname.split('/');
        var newPath = "/";
        for (i = 1; i < pathArray.length - 1; i++) {
            newPath += pathArray[i];
            newPath += "/";
        }
        $.ajax({
            type: "POST",
            url: "https://" + window.location.host + newPath + "password.php",
            data:
                "ajax=1&email=" +
                encodeURIComponent(username) +
                "&" +
                qe.substring(1) +
                "&g-recaptcha-response=" +
                encodeURIComponent(grecaptcha.getResponse()) +
                "&captcha=" +
                encodeURIComponent(captcha),
            success: function (html) {
                jQuery("#forgot-password-message").html("");
                /*jQuery("#btn-forgot").attr('disabled', true);*/
                jQuery("#forgot-password-message").html(html);
                /*if (html.substring(0, 4) == 'true') {
                    jQuery("#forgot-password-message").html(html);
                    if (html.length == 4) {
                        //window.location = "password_reset.php";
                    } else {
                        //window.location = html.substring(4);
                    }
                } else {
                    jQuery("#btn-forgot").attr('disabled', false);
                    jQuery("#forgot-password-message").html(html);
                }*/
            },
            error: function () {
                jQuery("#btn-forgot").prop("disabled", false);
                // Swal.fire({
                //     icon: 'warning',
                //     title: 'Error occurred!'
                // });
                jQuery("#forgot-password-message").html(
                    '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred!</div>'
                );
            },
            beforeSend: function () {
                /*jQuery("#btn-forgot").attr('disabled', true);*/
                jQuery("#forgot-password-message").html(
                    '<div style="margin: 15px; text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i> <span style="margin-left: 10px;font-size: 18px;">Processing Information</span></div>'
                );
            }
        });
    }
}

function signup_handler(e) {
    e.preventDefault();
    var loading = Swal.fire({
        title: 'Please wait',
        html: '<i class="fa fa-spinner fa-spin fa-2x"></i><br/>Processing Signup Information',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    var items = jQuery(
        "#loginForm input:not(.login_info), #loginForm select:not(.login_info)"
    ).serializeArray();
    var email_conf = jQuery("input[name=email_confirmation]").val();
    var captchaSignup = jQuery("#captcha_signup").val();
    var data_string = "ajax=1";
    var errors = "";
    for (i = 0, n = items.length; i < n; i++) {
        if (
            items[i].name != "remember" &&
            items[i].name != "email_confirmation" &&
            items[i].name != "captcha" &&
            items[i].value == ""
        ) {
            if (items[i].name == "login_id") {
                errors =
                    errors + "<strong>Error!</strong> Please enter an email address<br>";
            } else if (items[i].name == "passwd" || items[i].name == "password") {
                errors = errors + "<strong>Error!</strong> Please enter a password<br>";
            } else if (items[i].name == "giftcard_number") {
                errors =
                    errors + "<strong>Error!</strong> Please enter a giftcard number<br>";
            } else if (items[i].name == "2fa_code") {
            } else if (
                items[i].name == "captcha" ||
                items[i].name == "g-recaptcha-response"
            ) {
            } else {
                errors =
                    errors +
                    "<strong>Error!</strong> Please enter a " +
                    items[i].name +
                    " (got a blank value)<br>";
            }
        }
        if (
            items[i].value != "" &&
            items[i].name != "captcha" &&
            items[i].name != "g-recaptcha-response"
        ) {
            data_string =
                data_string +
                "&" +
                items[i].name +
                "=" +
                encodeURIComponent(items[i].value);
        }
    }
    if (errors != "") {
        Swal.fire({
            icon: 'warning',
            html: errors
        })
        // jQuery("#message").html(
        //     '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
        //         errors +
        //         "</div>"
        // );
    } else {
        if (email_conf == "") {
            data_string =
                data_string + "&captcha=" +
                encodeURIComponent(captchaSignup) +
                "&g-recaptcha-response=" +
                encodeURIComponent(grecaptcha.getResponse(gcaptchaWidget2));
        }
        if (signup_running == 0) {
            signup_running = 1;
            $.ajax({
                type: "POST",
                url: jQuery("#loginForm").attr("action"),
                data: data_string,
                success: function (html) {
                    loading.close();
                    // jQuery("#message").html("");
                    if (html.substring(0, 4) == "true") {
                        if (html.length == 4) {
                            window.location = "index.php";
                        } else {
                            window.location = html.substring(4);
                        }
                    } else if (html.substring(0, 6) == "verify") {
                        jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                        // jQuery(".confirmrow").show(500);
                        if ($('.email_popup').hasClass('hidden')) {
                            $('.email_popup').removeClass('hidden');
                        } else {
                            $('.email_popup .error-box').show();
                            $('.email_popup #error-message').text('Invalid Code, Please Enter correct code.');
                        }
                        // Swal.fire({
                        //     icon: 'success',
                        //     title: 'Need Email Confirmation Code!',
                        //     html: 'Check your email for the confirmation code to activate your account and fill it in the appropriate field. It may take a few minutes to arrive.  If you are unable to complete the signup process or receive the email please contact support@interserver.net for further assistance.'
                        // });
                        // jQuery("#message").html(
                        //     '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Need Email Confirmation Code!</strong><br>Check your email for the confirmation code to activate your account and fill it in the appropriate field. It may take a few minutes to arrive.  If you are unable to complete the signup process or receive the email please contact support@interserver.net for further assistance.</div>'
                        // );
                        jQuery(".captcha_main_signup").hide();
                        jQuery(".captcha_alt_signup").hide();
                    } else if (html.indexOf('Max Tries') !== -1 || html.indexOf('Invalid Email Confirmation') !== -1) {
                        jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                        $('.email_popup .error-box').show();
                        $('.email_popup #error-message').html(html);
                    } else {
                        jQuery(".loginsubmit, .signupsubmit").attr("disabled", false);
                        grecaptcha.reset(gcaptchaWidget2);
                        Swal.fire({
                            icon: 'warning',
                            html: html
                        })
                        // jQuery("#message").html(html);
                    }
                    signup_running = 0;
                },
                error: function () {
                    loading.close();
                    jQuery(".loginsubmit, .signupsubmit").prop("disabled", false);
                    grecaptcha.reset(gcaptchaWidget2);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error occurred!'
                    });
                    // jQuery("#message").html(
                    //     '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred!</div>'
                    // );
                },
                beforeSend: function () {
                    jQuery(".loginsubmit, .signupsubmit").attr("disabled", true);
                    loading;
                    // jQuery("#message").html(
                    //     '<div style="margin: 15px; text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i> <span style="margin-left: 10px;font-size: 18px;">Processing Information</span></div>'
                    // );
                }
            });
        }
    }
    return false;
}

</script>

<template>
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" rel="stylesheet">
    <link href="/css/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/node_modules/@fortawesome/fontawesome-free/css/all.min.css">
    <link href="/css/login_new.css" rel="stylesheet">
    <link rel="stylesheet" href="/node_modules/admin-lte/dist/css/adminlte.min.css">
    <link rel="stylesheet" type="text/css" href="/templates/adminlte/custom_styles.css">
    <div class="p-3 px-3 bg-black"><img src="/images/logo_new.png" alt=""></div>
    <div class="flex flex-grow flex-col-reverse lg:flex-row min-h-screen container-main">
        <div class="w-full lg:w-5/12 lg:block  min-h-full bg-blue-700 marketing-content">
            <h1 class="text-3xl text-white tracking-widest w-full mt-5 text-center uppercase"> Welcome back to our growing Community</h1>
            <div class="flex mt-24">
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/vps.png" alt=""></div>
                    <div class="text-white tracking-widest text-4xl text-center" id="count-v">{{ counts.vps }}</div>
                    <div class="text-3xl text-yellow-600 tracking-widest text-center uppercase">VPS</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/website.png" alt=""></div>
                    <div class="text-white tracking-widest text-4xl text-center" id="count-w">{{ counts.webhosting }}</div>
                    <div class="text-3xl text-yellow-600 tracking-widest text-center uppercase">Websites</div>
                </div>
                <div class="mx-auto">
                    <div class="mb-1"><img src="/images/servers.png" alt=""></div>
                    <div class="text-white tracking-widest text-4xl text-center" id="count-s">{{ counts.servers }}</div>
                    <div class="text-3xl text-yellow-600 tracking-widest text-center uppercase">Servers</div>
                </div>
            </div>
        </div>
        <div class="w-full lg:w-7/12">
            <div class="p-2"></div>
            <div class="block mx-auto lg:my-auto">
                <div class="w-full wrapper">
                    <div class="w-full myadmin_login">
                        <div class="login-box m-auto" style="width: 400px;">
                            <div class="card card-outline card-primary">
                                <div class="card-header text-center" style="display: flex;">
                                    <i class="fa fa-user-circle text-orange-500" style="font-size: 35px;" aria-hidden="true"></i>
                                    <h3 class="card-title ml-3 mt-2 text-bold">Sign in to start your session</h3>
                                </div>
                                <div class="card-body">
                                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" @submit.prevent="submitForm">>
                                        <div class="input-group mb-3">
                                            <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off">
                                            <div class="input-group-append">
                                                <div class="input-group-text"><span class="fas fa-envelope" aria-hidden="true"></span></div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="loginpassword" type="password" class="login_info form-control" v-model="password" placeholder="Password" autocomplete="off" required>
                                            <div class="input-group-append">
                                                <div class="input-group-text"><button type="button" @click="togglePasswordVisibility" aria-hidden="true"><i class="fa fa-eye"></i></button></div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 mb-1">
                                                <a class="float-right inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#" id="forgot_link">I forgot my password</a>
                                            </div>
                                            <div class="col-12">
                                                <div class="mb-6 captcha_main">
                                                    <div id="gcaptcha-1"></div>
                                                    <a href="#" class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" id="captcha_alt_link">Alternate Captcha</a>
                                                </div>
                                                <div class="mb-6 captcha_alt">
                                                    <div class="flex">
                                                        <img :src="captcha" style="max-width:75%;" alt="" />
                                                        <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reload" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off">
                                                        <div class="input-group-append">
                                                            <div class="input-group-text">
                                                                <span class="fa fa-robot" aria-hidden="true"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-8">
                                                <div class="icheck-primary">
                                                    <input class="login_info" type="checkbox" id="remember" v-model="remember" />
                                                    <label for="remember">Remember Me</label>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <button id="" type="submit" class="loginsubmit btn btn-primary btn-block text-bold" @click.prevent="signIn">Sign In</button>
                                            </div>
                                        </div>
                                        <div class="poppup hidden login_email_popup fixed inset-0 z-10 flex items-center justify-center">
                                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                            <div class="relative bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg z-10 py-4">
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer" @click="closePopup"></i>
                                                <div class="p-6">
                                                    <h2 class="text-2xl font-bold mb-4 text-center"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                    <p class="text-gray-600 text-center mb-8"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                    <form>
                                                        <div class="mb-4">
                                                            <input type="text" class="border block w-full px-4 py-3 rounded-lg shadow-sm border-gray-300 focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" id="email_confirmation" name="email_confirmation" placeholder="Security Code" v-model="emailCode" autocomplete="off" required>
                                                        </div>
                                                        <div class="col-8">
                                                            <div class="icheck-primary">
                                                                <input class="login_info" type="checkbox" id="code-remember" v-model="remember" />
                                                                <label for="remember">Remember Me</label>
                                                            </div>
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" style="display:none;">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="error-message"></span>
                                                                <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="document.querySelector('.error-box').style.display = 'none';"><i class="fas fa-times" aria-hidden="true"></i></span>
                                                            </div>
                                                        </div>
                                                        <div class="text-center">
                                                            <button id="" type="submit" class="loginsubmit bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">Sign In</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="poppup hidden popup fixed inset-0 z-10 flex items-center justify-center">
                                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                            <div class="relative bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg z-10 py-4">
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer" @click="closePopup"></i>
                                                <div class="p-6">
                                                    <h2 class="text-2xl font-bold mb-4 text-center">
                                                        <i class="fas fa-shield-alt mr-2" aria-hidden="true"></i>Enter Two Factor Authorization Code!
                                                    </h2>
                                                    <p class="text-gray-600 text-center mb-8">
                                                        <i class="fas fa-info-circle mr-2" aria-hidden="true"></i>Use your configured Authenticator to get a code and enter it here.
                                                    </p>
                                                    <form>
                                                        <div class="mb-4 signup_toggle twofactorauth">
                                                            <input type="text" id="2fa_code" name="2fa_code" placeholder="Enter Code from Authenticator" class="border block w-full px-4 py-3 rounded-lg shadow-sm border-gray-300 focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50">
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" style="display:none;">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="2fa-error-message"></span>
                                                                <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="document.querySelector('.error-box').style.display = 'none';">
                                                                    <i class="fas fa-times" aria-hidden="true"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="mb-4">
                                                            <label class="flex items-center">
                                                                <input type="checkbox" name="remember" id="2fa-remember" class="form-checkbox rounded-sm text-indigo-500 h-4 w-4">
                                                                <span class="ml-2 text-gray-800">Remember me</span>
                                                            </label>
                                                        </div>
                                                        <div class="text-center">
                                                            <button id="" type="submit" class="loginsubmit bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">
                                                                Sign In
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="social-auth-links text-center mt-2 mb-3">
                                        <h3 class="text-lg text-center text-bold">Sign in using:</h3>
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
                <div class="w-full p-4 myadmin_login" style="display: none;">
                    <div class="login-box m-auto" style="width: 400px;">
                        <div class="card card-outline card-primary">
                            <div class="card-header text-center">
                                <h3 class="card-title ml-3 mt-1">Forgot your Password?</h3>
                            </div>
                            <div class="card-body">
                                <div class="text-yellow-700">
                                    Enter the Email address you use to log in to your account<br>
                                    We'll send you an email with instructions to choose a new password.
                                </div>
                                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" @submit.prevent="submitForgotPassForm">
                                    <div class="input-group mb-3">
                                        <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off">
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fas fa-envelope" aria-hidden="true"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-6 captcha_main">
                                        <div class="flex">
                                            <img :src="captcha" style="max-width: 75%;" alt="" />
                                            <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reloadFP" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false"><span class="fa fa-refresh fa-fw"></span></button>
                                        </div>
                                        <div class="input-group my-3">
                                            <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off">
                                            <div class="input-group-append">
                                                <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="forgot-password-message"></div>
                                    <button id="btn-forgot" type="submit" class="btn btn-primary btn-block text-bold">Continue</button>
                                </form>
                                <div class="row">
                                    <div class="col-12 mb-1 myadmin_forgotPwd">
                                        <a id="access_link" href="#" class="float-right inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Login to My Account</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full mx-auto wrapper-signup hidden">
                    <div class="w-full myadmin_login">
                        <div class="login-box m-auto" style="width: 400px;">
                            <div class="card card-outline card-primary">
                                <div class="card-header text-center" style="display: flex;">
                                    <i class="fa fa-user-circle text-orange-500" style="font-size: 35px;" aria-hidden="true"></i>
                                    <h3 class="card-title ml-3 mt-2 text-bold">Create Your Account Now</h3>
                                </div>
                                <div class="card-body">
                                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" @submit.prevent="signupForm">
                                        <div class="input-group mb-3">
                                            <input type="email" class="login_info form-control" v-model="login" placeholder="Email Address" required autofocus autocomplete="off">
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <span class="fas fa-envelope" aria-hidden="true"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="signuppassword" type="password" class="form-control" v-model="password" placeholder="Password" autocomplete="off" required>
                                            <div class="input-group-append">
                                                <div class="input-group-text"><button type="button" @click="togglePasswordVisibility" aria-hidden="true"><i class="fa fa-eye"></i></button></div>
                                            </div>
                                            <div id="pswd_info">
                                                <p class="pp"><b>Password must have:</b></p>
                                                <ul>
                                                    <li id="length" class="pass_checks"><i aria-hidden="true" class="fa fa-close text-white py-1 px-2 bg-red b-radius mr-2"></i>atleast 8 characters</li>
                                                    <li id="capital" class="pass_checks"><i aria-hidden="true" class="fa fa-close text-white py-1 px-2 bg-red b-radius mr-2"></i>atleast 1 uppercase</li>
                                                    <li id="letter" class="pass_checks"><i aria-hidden="true" class="fa fa-close text-white py-1 px-2 bg-red b-radius mr-2"></i>atleast 1 lowercase</li>
                                                    <li id="number" class="pass_checks"><i aria-hidden="true" class="fa fa-close text-white py-1 px-2 bg-red b-radius mr-2"></i>atleast 1 number</li>
                                                    <li id="special" class="pass_checks"><i aria-hidden="true" class="fa fa-close text-white py-1 px-2 bg-red b-radius mr-2"></i>atleast 1 special char</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="mb-6 signup_toggle twofactorauth hidden">
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" id="signup_2fa_code" name="2fa_code" placeholder="Enter Code from Authenticator" value="" autocomplete="off">
                                                        <div class="input-group-append">
                                                            <div class="input-group-text"><span class="fa fa-lock" aria-hidden="true"></span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-6 captcha_main_signup">
                                                    <div id="gcaptcha-2"></div>
                                                    <a href="#" class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" id="captcha_alt_link_signup">Alternate Captcha</a>
                                                </div>
                                                <div class="mb-6 captcha_alt_signup">
                                                    <div class="flex">
                                                        <img :src="captcha" style="max-width:75%;" alt="" />
                                                        <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reload" type="button" @click="reloadCaptcha" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" v-model="captchaCode" placeholder="Captcha" autofocus autocomplete="off">
                                                        <div class="input-group-append">
                                                            <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                                        </div>
                                                    </div>
                                                    <a class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" href="#" @click.prevent="toggleCaptchaMethod">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="icheck-primary">
                                                    <input type="checkbox" id="tos" name="tos" value="yes" required :checked="isTosChecked" @change="toggleTosCheck">
                                                    <label for="tos">I agree to the <span class="underline font-bold text-sm text-blue-500 hover:text-blue-800"><a href="https://www.interserver.net/terms-of-service.html" target="_blank">Terms of Service</a></span></label>
                                                </div>
                                            </div>
                                            <div class="col-12 text-right">
                                                <button id="" type="submit" class="signupsubmit btn btn-primary btn-block text-bold">Create Account</button>
                                            </div>
                                        </div>
                                        <div class="poppup hidden email_popup fixed inset-0 z-10 flex items-center justify-center">
                                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                            <div class="relative bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg z-10 py-4">
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer" @click="closePopup"></i>
                                                <div class="p-6">
                                                    <h2 class="text-2xl font-bold mb-4 text-center"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                    <p class="text-gray-600 text-center mb-8"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                    <form>
                                                        <div class="mb-4">
                                                            <input type="text" id="signup_email_confirmation" name="email_confirmation" placeholder="Security Code" v-model="emailCode" autocomplete="off" required class="border block w-full px-4 py-3 rounded-lg shadow-sm border-gray-300 focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
                                                        </div>
                                                        <div class="mb-4">
                                                            <div class="error-box bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" style="display:none;">
                                                                <i class="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
                                                                <strong class="font-bold">Error!</strong>
                                                                <span class="block sm:inline" id="signup-error-message"></span>
                                                                <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="document.querySelector('.error-box').style.display = 'none';">
                                                                    <i class="fas fa-times" aria-hidden="true"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="text-center">
                                                            <button id="" type="submit" class="signupsubmit bg-indigo-500 text-white py-2 px-6 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-700 focus:ring-opacity-50">Create Account</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="social-auth-links text-center mt-2 mb-3">
                                        <h3 class="text-lg text-center text-bold">Sign up using:</h3>
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
                <div class="text-center text-gray-600 sign-up-txt signup pb-5">Don't have an account? <a class="sign-up font-bold text-sm text-blue-500 hover:text-blue-800" href="#">Sign Up</a></div>
                <div class="text-center text-gray-600 sign-up-txt pb-5 hidden">Already have an account? <a class="sign-up font-bold text-sm text-blue-500 hover:text-blue-800" href="#">Login</a></div>
                <div class="p-1 text-gray-500 text-sm text-center">Copyright &copy {{ year }} - All Rights Reserved.</div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="hidden overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center h-128" id="tosModal">
        <div class="relative w-auto my-6 mx-auto max-w-3xl">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                    <h3 class="text-3xl font-semibold">Terms of Service</h3>
                    <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onclick="toggleModal('tosModal')">
                        <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                    </button>
                </div>
                <!--body-->
                <div class="relative p-6 flex-auto">
                    <p class="my-4 text-gray-600 text-lg leading-relaxed h-64 modal-content overflow-y-auto"></p>
                </div>
                <!--footer-->
                <div class="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                    <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1" type="button" style="transition: all .15s ease" onclick="toggleModal('tosModal')">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="hidden opacity-25 fixed inset-0 z-40 bg-black" id="tosModal-backdrop"></div>
</template>

<style scoped>
/*@tailwind base;
@tailwind components;
@tailwind utilities;*/
body {
    height: 100vh;
}
@media screen and (max-width:390px) {
    .captcha_main iframe,
    .captcha_main_signup iframe,
    #gcaptcha-2 div,
    #gcaptcha-1 div {
        width: 100% !important;
    }
}
@media screen and (max-width:660px) {
    .container-main {
        min-height: 90vh !important;
    }
}
@media screen and (min-width:767px) {
    .container-main {
        flex-direction: row !important;
    }
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
    font-size: .750em;
    border-radius: 5px;
    box-shadow: 0 1px 3px #ccc;
    border: 1px solid #ddd;
    top: 34px;
    display:none;
    z-index: 999;
}
.pass_checks {
    padding-left:22px;
    line-height:24px;
    color:#9e9fa1;
}
.pp{
    font-size: 12px;
    font-style: bold;
}
#pswd_info ul{
  padding: 0px;
}
#pswd_info li{
    list-style: none;
}
@media screen and (max-width:660px) {
    .login-box {
        width:100% !important;
    }
}
</style>