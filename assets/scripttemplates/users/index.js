(function(ng) {

    "use strict";

    ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "NgSwitchery"]);
    ng.module("rc")
        .controller("UsersController", ["UsersManager", usersController]);

    function usersController(UsersManager) {

        var self = this;

        self.UsersManager = new UsersManager();

		self.templateAdd = "/base/users/users-parts/add";
		self.templateView = "/base/users/users-parts/view";
		self.templateEdit = "/base/users/users-parts/edit";

        self.columns = [
			{name:"$dict{first_name}", heading_class:"", class:"", property:"first_name", template: false},
			{name:"$dict{last_name}", heading_class:"", class:"", property:"last_name", template: false},
			{name:"$dict{login}", heading_class:"", class:"", property:"login", template: false},
			// {name:"$dict{email}", heading_class:"", class:"", property:"email", template: false},
			{name:"$dict{internal_id}", heading_class:"", class:"", property:"internal_id", template: false},
			// {name:"$dict{employee_id}", heading_class:"", class:"", property:"employee_id", template: false},
			{name:"$dict{user_roles}", heading_class:"", class:"", property:"user_role_names", template: false},
			// {name:"$dict{user_cinemas}", heading_class:"", class:"", property:"user_cinemas_disp", template: false},
			{name:"$dict{last_activity}", heading_class:"text-right", class:"text-right", property:"last_activity", template: "<span class='label label-warning' ng-if='!row.active && !row.deleted'>$dict{inactive}</span><span class='label label-danger' ng-if='row.deleted'>$dict{deleted}</span><span ng-if='!row.deleted && row.active'>{{row.last_activity | moment:'shortDate'}} {{row.last_activity | moment:'shortTime'}}</span>"},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
];
		self.order = [
			"first_name", "last_name"
		]
    }

	$(document).ready(function() {
		$('#menu-users').addClass('active');
		setPageTitle("$dict{users}", "menuSecurityCore", "menuUsers");
	});

})(angular);
