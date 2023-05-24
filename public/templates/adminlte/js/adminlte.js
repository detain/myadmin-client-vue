import $ from 'jquery';

$(document).ready(function() {
    /*
    $(".pr-password").passwordRequirements({});
    $('.select2').select2();
    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4',
        closeOnSelect: true
    });
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
    */
    //Onhover add shaddow
    $(".shadow-hover").hover(function() {
        $(this).removeClass('shadow-sm');
        $(this).addClass('shadow').css('cursor', 'pointer');
    }, function() {
        $(this).addClass('shadow-sm');
        $(this).removeClass('shadow');
    });
});
function Previous() {
    window.history.back()
}
$.AdminLTESidebarTweak = {};
$.AdminLTESidebarTweak.options = {
	EnableRemember: true,
	NoTransitionAfterReload: false
	//Removes the transition after page reload.
};
$(".collapse_menu").on("click", function() {
	if ($.AdminLTESidebarTweak.options.EnableRemember) {
		var toggleState = 'closed';
		if ($("body").hasClass('sidebar-collapse')) {
			toggleState = 'opened';
		}
		document.cookie = "toggleState=" + toggleState;
	}
});
if ($.AdminLTESidebarTweak.options.EnableRemember) {
	var re = new RegExp('toggleState' + "=([^;]+)");
	var value = re.exec(document.cookie);
	var toggleState = (value != null) ? unescape(value[1]) : null;
	if (toggleState == 'closed') {
		if ($.AdminLTESidebarTweak.options.NoTransitionAfterReload) {
			$("body").addClass('sidebar-collapse hold-transition').delay(100).queue(function() {
				$(this).removeClass('hold-transition');
			});
		} else {
			$("body").addClass('sidebar-collapse');
		}
	}
};
if (window.location.href.indexOf("view_domains_list") > -1) {
	$("#crud-table th:nth-child(1)").css("display", "none")
	$("#crud-table tbody td:nth-child(1)").css("display", "none")
}
