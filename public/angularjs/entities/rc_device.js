/*
 ____                     _
|  _ \ ___ _ __ ___   ___| | __
| |_) / _ \ '_ ` _ \ / _ \ |/ /
|  _ <  __/ | | | | |  __/   <
|_| \_\___|_| |_| |_|\___|_|\_\
  ____                      _ _   _
 / ___|___  _ __  ___ _   _| | |_(_)_ __   __ _
| |   / _ \| '_ \/ __| | | | | __| | '_ \ / _` |
| |__| (_) | | | \__ \ |_| | | |_| | | | | (_| |
 \____\___/|_| |_|___/\__,_|_|\__|_|_| |_|\__, |
                                          |___/

Auto generated entity for device
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Device", ["rcDateHandler", DeviceFactory])
		.factory("DeviceManager", ["EntityManager", "Device", "rcWebservice", "$q", DeviceManagerFactory]);

	function DeviceFactory(rcDateHandler) {

		function Device(data) {

			this.device_id = data.device_id || null;
			this.linked_device_id = data.linked_device_id || null;
			this.linked_device_name = data.linked_device_name || null;
			this.printer_id = data.printer_id || null;
			this.printer_name = data.printer_name || null;
			this.device_name = data.device_name || null;
			this.description = data.description || null;
			this.device_type_id = data.device_type_id || 0;
			this.device_type_name = data.device_type_name || null;
			this.device_status_id = data.device_status_id || null;
			this.device_status_name = data.device_status_name || null;
			this.ip_address = data.ip_address || null;
			this.location_id = data.location_id || 0;
			this.location_name = data.location_name || null;
			try {
				if (data.config_json) {
					this.config_json = JSON.parse(data.config_json);
				} else {
					this.config_json = {};
				}
			} catch (ex) {
				this.config_json = {};
			}
			try {
				if (data.browser_config) {
					this.browser_config = JSON.parse(data.browser_config);
					this.browser_config_syntax = syntaxHighlight(this.browser_config);
				} else {
					this.browser_config = {};
					this.browser_config_syntax = {};
				}
			} catch (ex) {
				this.browser_config = {};
				this.browser_config_syntax = {};
			}
			this.faye_channel = data.faye_channel || null;
			this.user_id = data.user_id || null;
			this.user_name = data.user_name || null;

			// Limit active devices to those who have been accessed in the last
			// 24 hours.
			if (!this.last_updated || rcDateHandler.diffMins(this.last_updated) > 1440) {
				this.active = false;
			} else {
				this.active = true;
			}

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'device_id');

		}

		return Device;

	}

	function DeviceManagerFactory(EntityManager, Device, rcWebservice, $q) {

		function DeviceManager() {
		}

		DeviceManager.prototype = Object.create(EntityManager.prototype);
		DeviceManager.prototype.constructor = DeviceManager;

 		DeviceManager.prototype._pool = {};
		DeviceManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.device_id)) {
				if (update) {
					this._pool[data.device_id] = new Device(data);
				}
				instance = this._pool[data.device_id];
			} else {
				instance = new Device(data);
				this._pool[data.device_id] = instance;
			}
			return instance;
		};

		DeviceManager.prototype.getNew = function (device_id) {

			var deferred = $q.defer(), _this = this;

			// Collect specific information about the users environment
			var browser_config = {
				appCodeName:		navigator.appCodeName,
				appName:			navigator.appName,
				appVersion:			navigator.appVersion,
				cookieEnabled:		navigator.cookieEnabled,
				language:			navigator.language,
				languages:			navigator.languages,
				onLine:				navigator.onLine,
				platform:			navigator.platform,
				product:			navigator.product,
				productSub:			navigator.productSub,
				userAgent:			navigator.userAgent,
				vendor:				navigator.vendor,
				vendorSub:			navigator.vendorSub,
				browserHeight:		window.screen.availHeight,
				browserWidth:		window.screen.availWidth
			};

			rcWebservice.post(_this.webservices.action_getNew, {id: device_id, browser_config: browser_config}, {customMessages: true}).then(function (response) {
				if (response.data[0])
					deferred.resolve(_this._retrieveInstance(response.data[0], true));
				else
					deferred.reject;
			}, deferred.reject);

			return deferred.promise;

		};

		DeviceManager.prototype.getReportPrinters = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAll).then(function (response) {
				var entities = response.data.filter(function(printer) {
					return printer.device_type_id === 14 || printer.device_type_id === 15;
				});
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};

		DeviceManager.prototype.getDevice = function (device_id) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_get, {id: device_id}).then(function (response) {
				if (response.data[0]) {
					deferred.resolve(_this._retrieveInstance(response.data[0], true));
				} else {
					deferred.reject();
				}
			}, deferred.reject);
			return deferred.promise;
		};
		DeviceManager.prototype.getDeviceListPos = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAllPos, {}).then(function (response) {
				if (response.data[0]) {
					deferred.resolve(_this._retrieveInstance(response.data[0], true));
				} else {
					deferred.reject();
				}
			}, deferred.reject);
			return deferred.promise;
		};

		DeviceManager.prototype.getWorking = function (workingDate) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getWorking, {working_date: workingDate}).then(function (response) {
				var entities = [];
				for (var i = 0; i < response.data.length; i++) {
					entities.push(_this._retrieveInstance(response.data[i], true));
				}
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};
		DeviceManager.prototype.getWorkingRange = function (date_start, date_end) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getWorking, {date_start: date_start, date_end: date_end}).then(function (response) {
				var entities = [];
				for (var i = 0; i < response.data.length; i++) {
					entities.push(_this._retrieveInstance(response.data[i], true));
				}
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};

		DeviceManager.prototype.webservices = {};
		DeviceManager.prototype.webservices.action_set = "base/rc_device/setDevice";
		DeviceManager.prototype.webservices.action_recent = "base/rc_device/getDeviceRecent";
		DeviceManager.prototype.webservices.action_getAll = "base/rc_device/getDeviceList";
		DeviceManager.prototype.webservices.action_getAllPos = "base/rc_device/getDeviceListPos";
		DeviceManager.prototype.webservices.action_search = "base/rc_device/searchDevice";
		DeviceManager.prototype.webservices.action_get = "base/rc_device/getDevice";
		DeviceManager.prototype.webservices.action_getNew = "base/rc_device/getDeviceNew";
		DeviceManager.prototype.webservices.action_getWorking = "base/rc_device/getDeviceWorking";
		DeviceManager.prototype.webservices.action_del = "base/rc_device/delDevice";
		DeviceManager.prototype.id_field = "device_id";

		return DeviceManager;
	}
})(angular);
