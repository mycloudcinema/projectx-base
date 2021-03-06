(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "ui.tinymce", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("EmailMessagesController", ["EmailMessagesManager", "$sce", emailMessagesController]);

	function emailMessagesController(EmailMessagesManager, $sce) {

		var self = this;

		self.EmailMessagesManager = new EmailMessagesManager();

		self.templateAdd = "/base/email/emailmessages-parts/add";
		self.templateView = "/base/email/emailmessages-parts/view";
		self.templateEdit = "/base/email/emailmessages-parts/edit";

		self.columns = [
			{name:"", heading_class:"", class:"", property:"", template: '<span class="label label-warning" ng-if="!row.date_sent">$dict{email_queued}</span><button class="btn btn-default btn-sm" ng-if="row.date_sent" ng-click="row.resendMessage(row);$event.stopPropagation();"><i class="fa fa-refresh"></i> $dict{email_resend}</button>'},
			{name:"$dict{date_added}", heading_class:"", class:"", property:"date_added", template: "{{row.date_added | moment:'shortDateTime'}}"},
			{name:"$dict{email_profile_name}", heading_class:"", class:"", property:"email_profile_name", template: false},
			{name:"$dict{email_to}", heading_class:"", class:"", property:"email_to", template: false},
			{name:"$dict{email_subject}", heading_class:"", class:"", property:"email_subject", template: false},
			{name:"$dict{email_priority}", heading_class:"text-center", class:"text-center", property:"email_priority", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.email_priority == true), \"fa fa-circle-o\": (row.email_priority == false)}'></i>"},
			{name:"$dict{date_added}", heading_class:"", class:"", property:"last_updated", template: "{{row.date_added | moment:'shortDateTime'}}"},
			{name:"$dict{date_sent}", heading_class:"", class:"", property:"date_sent", template: "{{row.date_sent | moment:'shortDateTime'}}"}
		];
		self.options = {
		};
		self.order = [
			"email_message_id"
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
		setPageTitle("$dict{email_messages}", "menuEmailCore", "menuEmailMessages");
	});

})(angular);
