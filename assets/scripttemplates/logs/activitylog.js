(function(ng) {

    "use strict";

    ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable"]);
    ng.module("rc")
        .controller("ActivityLogController", ["ActivityLogManager", activityLogController]);

    function activityLogController(ActivityLogManager) {

        var self = this;

        self.ActivityLogManager = new ActivityLogManager();

		self.templateAdd = "/logs/activitylog-parts/add";
		self.templateView = "/logs/activitylog-parts/view";
		self.templateEdit = "/logs/activitylog-parts/edit";

		self.options = {
			add_hidden:		true,
			editDisabled:	true,
			deleteDisabled:	true
		};
		self.order = [
			"-activity_log_date"
		];

        self.columns = [
			// {name:"$dict{activity_log_id}", heading_class:"", class:"", property:"activity_log_id", template: false},
			{name:"$dict{activity_log_date}", heading_class:"", class:"", property:"activity_log_date", template: "{{row.activity_log_date | moment:'shortDateTime'}}"},
			{name:"$dict{site_name}", heading_class:"", class:"", property:"site_name", template: false},
			// {name:"$dict{user_id}", heading_class:"", class:"", property:"user_id", template: false},
			{name:"$dict{full_name}", heading_class:"", class:"", property:"user_name", template: false},
			{name:"$dict{user_class}", heading_class:"", class:"", property:"user_class", template: false},
			// {name:"$dict{cinema_id}", heading_class:"", class:"", property:"cinema_id", template: false},
			{name:"$dict{cinema_name}", heading_class:"", class:"", property:"cinema_name", template: false},
			{name:"$dict{function}", heading_class:"", class:"", property:"function", template: false},
			{name:"$dict{action}", heading_class:"", class:"", property:"action", template: false}//,
			// {name:"$dict{log_data}", heading_class:"", class:"", property:"log_data", template: false},
			// {name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
        ];
    }

	$(document).ready(function() {
		setPageTitle("$dict{activity_log}", "menuSuperUser", "menuActivityLog");
	});

})(angular);
