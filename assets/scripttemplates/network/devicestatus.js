(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable"]);
	ng.module("rc")
		.controller("DeviceStatusController", ["DeviceStatusManager", deviceStatusController]);

	function deviceStatusController(DeviceStatusManager) {

		var self = this;

		self.DeviceStatusManager = new DeviceStatusManager();

		self.templateAdd = "/base/network/devicestatus-parts/add";
		self.templateView = "/base/network/devicestatus-parts/view";
		self.templateEdit = "/base/network/devicestatus-parts/edit";

		self.columns = [
			{name:"$dict{device_status_id}", heading_class:"", class:"", property:"device_status_id", template: false},
			{name:"$dict{device_status}", heading_class:"", class:"", property:"device_status_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{device_status}", "menuNetworkCore", "menuDeviceStatuses");
	});

})(angular);
