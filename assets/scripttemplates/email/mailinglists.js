(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("MailingListsController", ["MailingListsManager", MailingListsController]);

	function MailingListsController(MailingListsManager) {

		var self = this;

		self.MailingListsManager = new MailingListsManager();

		self.templateAdd = "/base/email/mailinglists-parts/add";
		self.templateView = "/base/email/mailinglists-parts/view";
		self.templateEdit = "/base/email/mailinglists-parts/edit";

		self.columns = [
			{name:"$dict{mailing_list_id}", heading_class:"", class:"", property:"mailing_list_id", template: false},
			{name:"$dict{mailing_list_name}", heading_class:"", class:"", property:"mailing_list_name", template: false},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			{name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];
		self.options = {
		};
		self.order = [
			"mailing_list_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{mailing_lists}", "menuEmailCore", "menuMailingLists");
	});

})(angular);
