(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("LocationStatusController", ["LocationStatusManager", LocationStatusController]);

	function LocationStatusController(LocationStatusManager) {

		var self = this;

		self.LocationStatusManager = new LocationStatusManager();

		self.templateAdd = "/base/network/locationstatus-parts/add";
		self.templateView = "/base/network/locationstatus-parts/view";
		self.templateEdit = "/base/network/locationstatus-parts/edit";

		self.columns = [
			{name:"$dict{location_status_id}", heading_class:"", class:"", property:"location_status_id", template: false},
			{name:"$dict{location_status}", heading_class:"", class:"", property:"location_status_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"location_status_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{location}", "menuNetworkCore", "menuLocationStatus");
	});

})(angular);
