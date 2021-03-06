(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("EmailAttachmentsController", ["EmailAttachmentsManager", EmailAttachmentsController]);

	function EmailAttachmentsController(EmailAttachmentsManager) {

		var self = this;

		self.EmailAttachmentsManager = new EmailAttachmentsManager();

		self.templateAdd = "/base/email/emailattachments-parts/add";
		self.templateView = "/base/email/emailattachments-parts/view";
		self.templateEdit = "/base/email/emailattachments-parts/edit";

		self.columns = [
			{name:"$dict{email_attachment_id}", heading_class:"", class:"", property:"email_attachment_id", template: false},
			{name:"$dict{email_message_id}", heading_class:"", class:"", property:"email_message_id", template: false},
			{name:"$dict{attachment_file_name}", heading_class:"", class:"", property:"attachment_file_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			{name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];
		self.options = {
			default_entity: {
				active:			true
			}
		};
		self.order = [
			"email_attachment_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{email_attachments}", "menuEmailCore", "menuEmailAttachments");
	});

})(angular);
