(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
	.controller("UserRolesController", ["UserRolesManager", userRolesController]);

	function userRolesController(UserRolesManager) {

		var self = this;

		self.UserRolesManager = new UserRolesManager();

		self.templateAdd = "/base/users/userroles-parts/add";
		self.templateView = "/base/users/userroles-parts/view";
		self.templateEdit = "/base/users/userroles-parts/edit";

		self.columns = [
			{name:"$dict{user_role_id}", heading_class:"", class:"", property:"user_role_id", template: false},
			{name:"$dict{site_name}", heading_class:"", class:"", property:"site_name", template: false},
			{name:"$dict{user_role}", heading_class:"", class:"", property:"user_role_name", template: false},
			{name:"$dict{default_role}", heading_class:"text-center", class:"text-center", property:"default_role", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.default_role == true), \"fa fa-circle-o\": (row.default_role == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{user_roles}", "menuSecurityCore", "menuUserRoles");
	});

})(angular);
