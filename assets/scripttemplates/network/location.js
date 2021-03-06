(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("LocationController", ["LocationManager", LocationController]);

	function LocationController(LocationManager) {

		var self = this;

		self.LocationManager = new LocationManager();

		self.templateAdd = "/base/network/location-parts/add";
		self.templateView = "/base/network/location-parts/view";
		self.templateEdit = "/base/network/location-parts/edit";

		self.columns = [
			{name:"$dict{location_id}", heading_class:"", class:"", property:"location_id", template: false},
			{name:"$dict{location_name}", heading_class:"", class:"", property:"location_name", template: false},
			{name:"$dict{description}", heading_class:"", class:"", property:"description", template: false},
			{name:"$dict{location_status_id}", heading_class:"", class:"", property:"location_status_id", template: false},
			{name:"$dict{location_status}", heading_class:"", class:"", property:"location_status_name", template: false},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"location_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{location}", "menuNetworkCore", "menuLocation");
	});

})(angular);
