(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("MailingListMembersController", ["MailingListMembersManager", MailingListMembersController]);

	function MailingListMembersController(MailingListMembersManager) {

		var self = this;

		self.MailingListMembersManager = new MailingListMembersManager();

		self.templateAdd = "/base/email/mailinglistmembers-parts/add";
		self.templateView = "/base/email/mailinglistmembers-parts/view";
		self.templateEdit = "/base/email/mailinglistmembers-parts/edit";

		self.columns = [
			{name:"$dict{mailing_list_member_id}", heading_class:"", class:"", property:"mailing_list_member_id", template: false},
			{name:"$dict{email_address}", heading_class:"", class:"", property:"email_address", template: false},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			{name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];
		self.options = {
		};
		self.order = [
			"mailing_list_member_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{mailing_list_members}", "menuEmailCore", "menuMailingListMembers");
	});

})(angular);
