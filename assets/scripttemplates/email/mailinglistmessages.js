(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("MailingListMessagesController", ["MailingListMessagesManager", MailingListMessagesController]);

	function MailingListMessagesController(MailingListMessagesManager) {

		var self = this;

		self.MailingListMessagesManager = new MailingListMessagesManager();

		self.templateAdd = "/base/email/mailinglistmessages-parts/add";
		self.templateView = "/base/email/mailinglistmessages-parts/view";
		self.templateEdit = "/base/email/mailinglistmessages-parts/edit";

		self.columns = [
			{name:"$dict{mailing_list_message_id}", heading_class:"", class:"", property:"mailing_list_message_id", template: false},
			{name:"$dict{mailing_list_id}", heading_class:"", class:"", property:"mailing_list_id", template: false},
			{name:"$dict{mailing_list_name}", heading_class:"", class:"", property:"mailing_list_name", template: false},
			{name:"$dict{mailing_list_member_id}", heading_class:"", class:"", property:"mailing_list_member_id", template: false},
			{name:"$dict{mailing_list_member_name}", heading_class:"", class:"", property:"mailing_list_member_name", template: false},
			{name:"$dict{message_status}", heading_class:"text-center", class:"text-center", property:"message_status", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.message_status == true), \"fa fa-circle-o\": (row.message_status == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			{name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];
		self.options = {
		};
		self.order = [
			"mailing_list_message_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{mailing_list_messages}", "menuEmailCore", "menuMailingListMessages");
	});

})(angular);
