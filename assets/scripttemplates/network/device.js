(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("DeviceController", ["DeviceManager", "rcDevice", "dialogs", "FayeChannel", "$http", "$scope","$timeout", deviceController]);

	function deviceController(DeviceManager, rcDevice, dialogs, FayeChannel, $http, $scope, $timeout) {

		// Faye Communication
		var fayeUrl = "$setting{faye_server}";
		var fayeIdentify;
		var fayeReset;
		var fayeStatus;

		var self = this;

		self.DeviceManager = new DeviceManager();
		self.device = rcDevice.device;

		// Setup the Faye Communicaton that we will use to notify the device when it
		// needs to reset itself.
		fayeReset = new FayeChannel(fayeUrl, '/device/reset');

		// Setup the Faye Communicaton that we will use to retrieve status messages
		// from the devices.
		fayeStatus = new FayeChannel(fayeUrl, '/device/status', function(message) {

			// Look through our device list for a matching device. If we
			// find one then we will update the data.
			if (self.fayeDevice.id === message.id) {
				self.fayeDevice.last_updated = moment(message.last_updated);
				self.fayeDevice.user_id = message.user_id;
				self.fayeDevice.user_name = message.user_name;
				self.fayeDevice.resetting = false;
				$scope.$apply();
			}
		});

		// Setup the Faye Communicaton that we will use to handle the identification of
		// devices.
		fayeIdentify = new FayeChannel(fayeUrl, '/device/identify', function(message) {

			// Look through our device list for a matching device. If we
			// find one then we will update the data.
			for (var device = 0; device < self.deviceList.length; device++) {

				if (self.deviceList[device].device_id === message.id) {

					self.deviceList[device].identifying = true;
					$scope.$apply();

					// After 5 seconds reset all the identifying state on all devices
					$timeout(function() {
						for (var device = 0; device < self.deviceList.length; device++) {
							self.deviceList[device].identifying = false;
						};
					}, 5000);
					break;
				}
			}
		});

		// Send a "self identification" message to the device
		self.identifyDevice = function(device) {
			self.fayeDevice = device;
			fayeIdentify.publish({id: device.device_id});
			device.identifying = true;
			$timeout(function() {
				device.identifying = false;
			}, 5000);
		}

		// Exchange the device id on the current device for one from an existing
		// device.
		self.exchangeDevice = function(device) {
			if (localStorage) {
				self.device.id = device.device_id;
				localStorage.setItem('remek.device', JSON.stringify(self.device));
				// adding device info into session
				$http.post('/session/set', {device_id: device.device_id});
				dialogs.notify("$dict{device_swap}", "$dict{device_exchanged}").result.then(function() {
					window.location = '/index';
				});
			}
		};

		// Ask the device to reset itself. This will force a page reload on the
		// device.
		self.resetDevice = function(device) {
			if (device.device_id)
				device.resetting = true;
			fayeReset.publish({id: device.device_id});
		}

		self.templateAdd = "/base/network/device-parts/add";
		self.templateView = "/base/network/device-parts/view";
		self.templateEdit = "/base/network/device-parts/edit";

		self.columns = [
			{name:"$dict{cinema_name}", heading_class:"", class:"", property:"cinema_name", template: false},
			{name:"$dict{device_name}", heading_class:"", class:"", property:"device_name", template: false},
			{name:"$dict{device_type}", heading_class:"", class:"", property:"device_type_name", template: false},
			{name:"$dict{ip_address}", heading_class:"", class:"", property:"ip_address", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			{name:"$dict{user_name}", heading_class:"", class:"", property:"user_name", template: false}
		];
		self.options = {
			multi_view:				true,
			view_mode:				'grid'
		};
		self.order = [
			"device_type_name"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{device_manager}", "menuNetworkCore", "menuDevice");
	});

})(angular);
