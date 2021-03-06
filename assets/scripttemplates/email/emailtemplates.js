(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "ui.tinymce", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("EmailTemplatesController", ["EmailTemplatesManager", EmailTemplatesController]);

	function EmailTemplatesController(EmailTemplatesManager) {

		var self = this;

		self.EmailTemplatesManager = new EmailTemplatesManager();

		self.templateAdd = "/base/email/emailtemplates-parts/add";
		self.templateView = "/base/email/emailtemplates-parts/view";
		self.templateEdit = "/base/email/emailtemplates-parts/edit";

		self.columns = [
			{name:"$dict{email_template_id}", heading_class:"", class:"", property:"email_template_id", template: false},
			{name:"$dict{email_event_type}", heading_class:"", class:"", property:"event_type", template: false},
			{name:"$dict{language}", heading_class:"", class:"", property:"language_name", template: false},
			{name:"$dict{email_subject}", heading_class:"", class:"", property:"subject", template: false},
			{name:"$dict{email_template}", heading_class:"", class:"", property:"template", template: false},
			{name:"$dict{bcc_addresses}", heading_class:"", class:"", property:"bcc_addresses", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"email_template_id"
		];

		self.tinymceOptions = {
			menubar:		false,
			convert_urls:	0,
			plugins:		'textcolor colorpicker table code link hr lists image',
			toolbar:		'undo redo | styleselect | bold italic | link | hr | image | alignleft aligncenter alignright | numlist bullist | forecolor backcolor | table | code'
		};

		self.trustAsHtml = function(string) {
			return $sce.trustAsHtml(string);
		};

	}

	$(document).ready(function() {
		setPageTitle("$dict{email_templates}", "menuEmailCore", "menuEmailTemplates");
	});

})(angular);
