import $ from 'jquery';

/**
 * Plugin options interface
 */
export interface PasswordRequirementsOptions {
    numCharacters?: number;
    useLowercase?: boolean;
    useUppercase?: boolean;
    useNumbers?: boolean;
    useSpecial?: boolean;
    matchPass?: boolean;
    infoMessage?: string;
    style?: 'light' | 'dark';
    fadeTime?: number;
}

/**
 * jQuery plugin definition
 */
($.fn as any).passwordRequirements = function (options?: PasswordRequirementsOptions): JQuery {
    const defaults: Required<PasswordRequirementsOptions> = {
        numCharacters: 8,
        useLowercase: true,
        useUppercase: true,
        useNumbers: true,
        useSpecial: true,
        matchPass: true,
        infoMessage: '',
        style: 'light',
        fadeTime: 300,
    };

    const settings = $.extend({}, defaults, options);

    return this.each(function (this: HTMLElement) {
        const o = settings;

        o.infoMessage = `The minimum password length is ${o.numCharacters} characters and must contain ` + `at least 1 lowercase letter, 1 capital letter, 1 number, and 1 special character.`;

        const numCharactersUI = '<li class="pr-numCharacters"><span></span># of characters</li>';

        let useLowercaseUI = '';
        let useUppercaseUI = '';
        let useNumbersUI = '';
        let matchPassUI = '';
        let useSpecialUI = '';

        if (o.useLowercase) {
            useLowercaseUI = '<li class="pr-useLowercase"><span></span>Lowercase letter</li>';
        }
        if (o.matchPass) {
            matchPassUI = '<li class="pr-matchPassUI"><span></span>Both Passwords Match</li>';
        }
        if (o.useUppercase) {
            useUppercaseUI = '<li class="pr-useUppercase"><span></span>Capital letter</li>';
        }
        if (o.useNumbers) {
            useNumbersUI = '<li class="pr-useNumbers"><span></span>Number</li>';
        }
        if (o.useSpecial) {
            useSpecialUI = '<li class="pr-useSpecial"><span></span>Special character</li>';
        }

        const messageDiv = `<div id="pr-box"><i></i>` + `<div id="pr-box-inner"><p>${o.infoMessage}</p>` + `<ul>${numCharactersUI}${useLowercaseUI}${matchPassUI}${useUppercaseUI}${useNumbersUI}${useSpecialUI}</ul>` + `</div></div>`;

        let numCharactersDone = true;
        let useLowercaseDone = true;
        let useUppercaseDone = true;
        let useNumbersDone = true;
        let matchPassDone = true;
        let useSpecialDone = true;

        const showMessage = () => {
            if (!numCharactersDone || !matchPassDone || !useLowercaseDone || !useUppercaseDone || !useNumbersDone || !useSpecialDone) {
                $('.pr-password').each(function () {
                    const $el = $(this);
                    const offset = $el.offset();
                    if (!offset) return;

                    const totalH = offset.top + $el.innerHeight()!;
                    const itemL = offset.left;

                    $('body').append(messageDiv);
                    $('#pr-box').addClass(o.style).fadeIn(o.fadeTime).css({ top: totalH, left: itemL });
                });
            }
        };

        const deleteMessage = () => {
            $('#pr-box').fadeOut(o.fadeTime, function () {
                $(this).remove();
            });
        };

        const checkCompleted = () => {
            if (numCharactersDone && matchPassDone && useLowercaseDone && useUppercaseDone && useNumbersDone && useSpecialDone) {
                deleteMessage();
            } else {
                showMessage();
            }
        };

        const lowerCase = /[a-z]/;
        const upperCase = /[A-Z]/;
        const numbers = /[0-9]/;
        const specialCharacter = /[!,%&@#$^*?_~]/;

        const $input = $(this);

        $input.on('focus', showMessage);
        $input.on('blur', deleteMessage);

        $input.on('keyup focus', function (this: HTMLElement) {
            const thisVal = String($input.val() ?? '');

            checkCompleted();

            if ($('#password').val() === $('#password2').val()) {
                $('.pr-matchPassUI span').addClass('pr-ok');
                matchPassDone = true;
            } else {
                $('.pr-matchPassUI span').removeClass('pr-ok');
                matchPassDone = false;
            }

            if (thisVal.length >= o.numCharacters) {
                $('.pr-numCharacters span').addClass('pr-ok');
                numCharactersDone = true;
            } else {
                $('.pr-numCharacters span').removeClass('pr-ok');
                numCharactersDone = false;
            }

            if (o.useLowercase) {
                useLowercaseDone = lowerCase.test(thisVal);
                $('.pr-useLowercase span').toggleClass('pr-ok', useLowercaseDone);
            }

            if (o.useUppercase) {
                useUppercaseDone = upperCase.test(thisVal);
                $('.pr-useUppercase span').toggleClass('pr-ok', useUppercaseDone);
            }

            if (o.useNumbers) {
                useNumbersDone = numbers.test(thisVal);
                $('.pr-useNumbers span').toggleClass('pr-ok', useNumbersDone);
            }

            if (o.useSpecial) {
                useSpecialDone = specialCharacter.test(thisVal);
                $('.pr-useSpecial span').toggleClass('pr-ok', useSpecialDone);
            }
        });
    });
};

export {};
