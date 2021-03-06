(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "ui.tinymce", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("OnlineHelpController", ["OnlineHelpManager", "$sce", onlineHelpController]);

	function onlineHelpController(OnlineHelpManager, $sce) {

		var self = this;

		self.OnlineHelpManager = new OnlineHelpManager();

		self.templateAdd = "/base/setup/onlinehelp-parts/add";
		self.templateView = "/base/setup/onlinehelp-parts/view";
		self.templateEdit = "/base/setup/onlinehelp-parts/edit";

		self.columns = [
			{name:"$dict{page_name}", heading_class:"", class:"", property:"page_name", template: false},
			{name:"$dict{language}", heading_class:"", class:"", property:"language", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
		];

		self.options = {
		};
		self.order = [
			"online_help_id"
		];

		self.tinymceOptions = {
			menubar:		false,
			convert_urls:	0,
			plugins:		'textcolor colorpicker table code link hr lists image',
			toolbar:		'undo redo | styleselect | bold italic | link | hr | image | alignleft aligncenter alignright | numlist bullist | forecolor backcolor | table | code',
			body_class:		'mceBlackBody',
			content_css:	'/public/css/projectx-mce.min.css'
		};

		self.trustAsHtml = function(string) {
			return $sce.trustAsHtml(string);
		};

	}

	$(document).ready(function() {
		setPageTitle("$dict{online_help}", "menuApplicationCore", "menuOnlineHelp");
	});

})(angular);
