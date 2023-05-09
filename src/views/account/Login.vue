<script setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, computed } from 'vue'
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

const tosCheked = computed(() => {
    return tos == true || login != '';
});

const schema = Yup.object().shape({
    tfa: Yup.string(),
    login: Yup.string().required('Username is required'),
    passwd: Yup.string().required('Password is required')
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
</script>

<template>
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
                                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" method="POST" accept-charset="UTF-8" role="form" id="loginForm" action="https://mystage.interserver.net/ajax_check_login.php" autocomplete="on" enctype="multipart/form-data">
                                        <div class="input-group mb-3">
                                            <input type="text" class="login_info form-control" name="login_id" id="login_id" placeholder="Email Address" required autofocus autocomplete="off" value="{if isset($login) && $login != ''}{$login|htmlentities}{/if}">
                                            <div class="input-group-append">
                                                <div class="input-group-text"><span class="fas fa-envelope" aria-hidden="true"></span></div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="loginpassword" type="password" class="login_info form-control" name="passwd" placeholder="Password" value="{if isset($password) && $password != ''}{$password|htmlentities}{/if}" autocomplete="off" required>
                                            <div class="input-group-append">
                                                <div class="input-group-text"><button type="button" id="show-hide-pass" onclick="togglePasswordVisibility()" aria-hidden="true"><i class="fa fa-eye"></i></button></div>
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
                                                        <img id="captcha-img" style="max-width:75%;" src="{$captcha}" alt="" />
                                                        <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reload" type="button" data-target="#captcha-img" data-toggle="button" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" name="captcha" id="captcha" placeholder="Captcha" autofocus autocomplete="off">
                                                        <div class="input-group-append">
                                                            <div class="input-group-text">
                                                                <span class="fa fa-robot" aria-hidden="true"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" id="captcha_main_link" href="#">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-8">
                                                <div class="icheck-primary">
                                                    <input class="login_info" type="checkbox" id="remember" name="remember" value="yes" />
                                                    <label for="remember">Remember Me</label>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <button id="" type="submit" class="loginsubmit btn btn-primary btn-block text-bold">Sign In</button>
                                            </div>
                                        </div>
                                        <div class="poppup hidden login_email_popup fixed inset-0 z-10 flex items-center justify-center">
                                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                                            <div class="relative bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg z-10 py-4">
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer"></i>
                                                <div class="p-6">
                                                    <h2 class="text-2xl font-bold mb-4 text-center"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                    <p class="text-gray-600 text-center mb-8"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                    <form>
                                                        <div class="mb-4">
                                                            <input type="text" class="border block w-full px-4 py-3 rounded-lg shadow-sm border-gray-300 focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" id="email_confirmation" name="email_confirmation" placeholder="Security Code" value="{if isset($code) && $code != ''}{$code|htmlentities}{/if}" autocomplete="off" required>
                                                        </div>
                                                        <div class="col-8">
                                                            <div class="icheck-primary">
                                                                <input class="login_info" type="checkbox" id="code-remember" name="remember" value="yes" />
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
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer"></i>
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
                                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" accept-charset="UTF-8" role="form" action="https://mystage.interserver.net/password.php" autocomplete="off" method="post" enctype="multipart/form-data">
                                    <div class="input-group mb-3">
                                        <input type="email" class="form-control" name="email" placeholder="Email Address" required>
                                        <div class="input-group-append">
                                            <div class="input-group-text">
                                                <span class="fas fa-envelope" aria-hidden="true"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-6 captcha_main">
                                        <div class="flex">
                                            <img id="captcha-imgFP" src="{$captchaFP}" style="max-width: 75%;" alt="" />
                                            <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reloadFP" type="button" data-target="#captcha-imgFP" data-toggle="button" title="Reload Captcha" tabindex="-1" aria-pressed="false"><span class="fa fa-refresh fa-fw"></span></button>
                                        </div>
                                        <div class="input-group my-3">
                                            <input type="text" class="form-control" name="captcha" id="captchaFP" placeholder="Captcha" autofocus autocomplete="off">
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
                                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 myadmin_loginForm" method="POST" accept-charset="UTF-8" role="form" id="signupForm" action="https://mystage.interserver.net/ajax_check_signup.php" autocomplete="on" enctype="multipart/form-data">
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control" name="login_id" id="signup_login_id" placeholder="Email Address" required autofocus autocomplete="off" value="{if isset($login) && $login != ''}{$login|htmlentities}{/if}">
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <span class="fas fa-envelope" aria-hidden="true"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3">
                                            <input id="signuppassword" type="password" class="form-control" name="passwd" placeholder="Password" value="{if isset($password) && $password != ''}{$password|htmlentities}{/if}" autocomplete="off" required>
                                            <div class="input-group-append">
                                                <div class="input-group-text">
                                                    <button type="button" id="show-hide-pass-signup" onclick="togglePasswordVisibility()" aria-hidden="true"><i class="fa fa-eye"></i></button>
                                                </div>
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
                                                        <img id="captcha-img-signup" style="max-width:75%;" src="{$captchaSignup}" alt="" />
                                                        <button class="block ml-4 bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline btn-captcha-reload" type="button" data-target="#captcha-img-signup" data-toggle="button" title="Reload Captcha" tabindex="-1" aria-pressed="false">
                                                            <span class="fa fa-refresh fa-fw"></span>
                                                        </button>
                                                    </div>
                                                    <div class="input-group my-3">
                                                        <input type="text" class="form-control" name="captcha" id="captcha_signup" placeholder="Captcha" autofocus autocomplete="off">
                                                        <div class="input-group-append">
                                                            <div class="input-group-text"><span class="fa fa-robot" aria-hidden="true"></span></div>
                                                        </div>
                                                    </div>
                                                    <a class="font-bold text-sm text-blue-500 hover:text-blue-800 underline" id="captcha_main_link_signup" href="#">Primary Captcha Method</a>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="icheck-primary">
                                                    <input type="checkbox" id="tos" name="tos" value="yes" required  :v-model="tosChecked">
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
                                                <i class="close text-lg fa fa-close float-right px-4 cursor-pointer"></i>
                                                <div class="p-6">
                                                    <h2 class="text-2xl font-bold mb-4 text-center"><i class="fas fa-envelope mr-2" aria-hidden="true"></i>Email Verification</h2>
                                                    <p class="text-gray-600 text-center mb-8"><i class="fas fa-key mr-2" aria-hidden="true"></i>Enter the security code sent to your email.</p>
                                                    <form>
                                                        <div class="mb-4">
                                                            <input type="text" id="signup_email_confirmation" name="email_confirmation" placeholder="Security Code" value="{if isset($code) && $code != ''}{$code|htmlentities}{/if}" autocomplete="off" required class="border block w-full px-4 py-3 rounded-lg shadow-sm border-gray-300 focus:border-gray-800 focus:ring focus:ring-gray-800 focus:ring-opacity-50" />
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
                <div class="p-1 text-gray-500 text-sm text-center">Copyright &copy {$year} - All Rights Reserved.</div>
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
</style>