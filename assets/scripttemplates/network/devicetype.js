(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("DeviceTypeController", ["DeviceTypeManager", deviceTypeController]);

	function deviceTypeController(DeviceTypeManager) {

		var self = this;

		self.DeviceTypeManager = new DeviceTypeManager();

		self.templateAdd = "/base/network/devicetype-parts/add";
		self.templateView = "/base/network/devicetype-parts/view";
		self.templateEdit = "/base/network/devicetype-parts/edit";

		self.columns = [
			{name:"$dict{device_type_id}", heading_class:"", class:"", property:"device_type_id", template: false},
			{name:"$dict{device_type}", heading_class:"", class:"", property:"device_type_name", template: false},
			{name:"$dict{is_printer}", heading_class:"text-center", class:"text-center", property:"is_printer", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.is_printer == true), \"fa fa-circle-o\": (row.is_printer == false)}'></i>"},
			{name:"$dict{create_transactions}", heading_class:"text-center", class:"text-center", property:"create_transactions", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.create_transactions == true), \"fa fa-circle-o\": (row.create_transactions == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"device_type_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{device_type}", "menuNetworkCore", "menuDeviceType");
	});

})(angular);
