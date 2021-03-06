(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("EmailProfilesController", ["EmailProfilesManager", EmailProfilesController]);

	function EmailProfilesController(EmailProfilesManager) {

		var self = this;

		self.EmailProfilesManager = new EmailProfilesManager();

		self.templateAdd = "/base/email/emailprofiles-parts/add";
		self.templateView = "/base/email/emailprofiles-parts/view";
		self.templateEdit = "/base/email/emailprofiles-parts/edit";

		self.columns = [
			{name:"$dict{email_profile_id}", heading_class:"", class:"", property:"email_profile_id", template: false},
			{name:"$dict{email_profile_name}", heading_class:"", class:"", property:"email_profile_name", template: false},
			{name:"$dict{smtp_address}", heading_class:"", class:"", property:"smtp_address", template: false},
			{name:"$dict{smtp_port_number}", heading_class:"", class:"", property:"smtp_port_number", template: false},
			{name:"$dict{smtp_login}", heading_class:"", class:"", property:"smtp_login", template: false},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"email_profile_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{email_profiles}", "menuEmailCore", "menuEmailProfiles");
	});

})(angular);
