/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Service to manage the configuration of devices on the network and to link
primary and secondary displays.
*/

(function () {

	"use strict";

	angular.module("rc.services")
		.service("rcDevice", ["rcDateHandler", "rcGuid", "rcUserPreferences", "DeviceManager", "FayeChannel", "$rootScope", "$interval", "$http", DeviceManager]);

	function DeviceManager(rcDateHandler, rcGuid, rcUserPreferences, DeviceManager, FayeChannel, $rootScope, $interval, $http) {

		var self = this;
		var fayeUrl = "$setting{faye_server}";

		self.device = self.getDevice(rcUserPreferences, rcGuid);

		self.DeviceManager = new DeviceManager();
		self.rcDateHandler = rcDateHandler;
		self.$http = $http;

		// Make the device available at the rootScope level so that we avoid the
		// possibility of circular references between the rcWebservice service
		// and the Entity Manager.
		$rootScope.device = self.device;

		// Faye channel to communicate the device status
		self.fayeStatus = new FayeChannel(fayeUrl, '/device/status');

		// Faye channel opened to be able to send reset messages to a device and
		// force it to reload the current page (or the login page if the session
		// has timed out).
		self.fayeReset = new FayeChannel(fayeUrl, '/device/reset', function(message) {

			// Ony handle messages destined for this device, otherwise we'd be
			// rebooting the entire network :)
			if (message.id === self.device.id) {

				// Check to see if we have been passed a new device id. If we
				// have then we need to change the device id on this station
				// before we reset it.
				if (message.new_id) {
					self.device.id = message.new_id;
					setDevice(rcUserPreferences, self.device);
				}
				location.reload();

			};

		});

		self.getConfig(rcUserPreferences, $interval);
	}

	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}

	function setDevice(rcUserPreferences, device) {
		rcUserPreferences.setPreferences('remek.device', device);
		console.log(`Setting device cookie for ${device.id}`);
		setCookie('remek.device', device.id);
	}

	// Initialization. Called once and determines the UUID and configuration
	// for the device. If not found in local storage then a new UUID will
	// created and the device will ask for configuration information from
	// the webservice.
	DeviceManager.prototype.getDevice = function (rcUserPreferences, rcGuid) {

		// Look in local storage to see if we already have an entry. If we don't
		// then we create one and store it in local storage.
		var thisDevice = {
			id: new rcGuid().newGuid()
		};
		return rcUserPreferences.getPreferences('remek.device', thisDevice);
	};

	// Setup an interval to look for the configuration of the station.
	// Once the configuration is loaded this interval will be cancelled.
	DeviceManager.prototype.getConfig = function (rcUserPreferences, $interval) {

		var self = this;

		// If the first request returned a configuration then this timer will
		// never be fired.
		var thisInterval = $interval(getNew, 30000);

		function getNew(rcUserPreferences) {

			// Make a call to the DB to either retrieve the configuration for this
			// screen or create a new record in the DB so that the station can be
			// configured.
			self.DeviceManager.getNew(self.device.id, true).then(function (response) {

				if (response) {

					if (thisInterval) {
						$interval.cancel(thisInterval);
					}

					// Use the basic JSON configuration as the base
					self.device.config = response.config_json;

					// Then extend that with other attributes that come from the
					// device record.
					// self.device.config.device_id = response.device_id;
					self.device.config.device_type_id = response.device_type_id;
					self.device.config.device_status_id = response.device_status_id;
					self.device.config.sales_channel_id = response.sales_channel_id;
					self.device.config.printer_id = response.printer_id;
					self.device.config.receipt_printer_id = response.receipt_printer_id;
					self.device.config.faye_channel = response.faye_channel;

					setDevice(rcUserPreferences, self.device);

					// Now start sending alive messages every 5 minutes via Faye
					// to notify anyone watching that this station is alive and
					// who is logged in to it.
					self.isAlive($interval);
				}
			});
		}
		getNew(rcUserPreferences);
	};

	// Setup an interval to send out isAlive messages over the faye channel to
	// anyone who is monitoring on the Device Status screen.
	DeviceManager.prototype.isAlive = function ($interval) {

		var self = this;
		var thisInterval = $interval(sendAlive, 300000);

		function sendAlive() {
			var fayeMessage = {
				id:				self.device.id,
				last_updated:	self.rcDateHandler.getUIDate().format("YYYY-MM-DD HH:mm"),
				user_name:		"$user{first_name} $user{last_name}"
			};
			self.fayeStatus.publish(fayeMessage);
		}
		sendAlive();
	};

})();
