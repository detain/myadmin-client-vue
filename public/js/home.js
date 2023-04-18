function copyToClipboard(element) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val($(element).text()).select();
	document.execCommand("copy");
	$temp.remove();
}
$(function () {
	$(".column").sortable({
		connectWith: ".column"
	});
	$(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".portlet-header")
		.addClass("ui-widget-header ui-corner-all")
		.prepend('<span class="float-right glyphicon glyphicon-minus" aria-hidden="true"></span>')
		.end()
		.find(".portlet-content");

	$(".portlet-header .ui-icon").click(function () {
		$(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
		$(this).parents(".portlet:first").find(".portlet-content").toggle();
	});
	$(".portlet-header .glyphicon").click(function () {
		$(this).toggleClass("glyphicon-minus").toggleClass("glyphicon-plus");
		$(this).parents(".portlet:first").find(".portlet-content").toggle();
	});

	$(".column").disableSelection();
});