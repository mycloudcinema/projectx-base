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

Auto generated entity for device_status
*/

(function (ng) {
	"use strict";
	ng.module("rc.entities")
		.factory("DeviceStatus", ["rcDateHandler", DeviceStatusFactory])
		.factory("DeviceStatusManager", ["EntityManager", "DeviceStatus", DeviceStatusManagerFactory]);

	function DeviceStatusFactory(rcDateHandler) {

		function DeviceStatus(data) {
			this.device_status_id = data.device_status_id || 0;
			this.dictionary_key = data.dictionary_key || null;
			this.device_status_name = data.device_status_name || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'device_status_id');
		}

		return DeviceStatus;

	}

	function DeviceStatusManagerFactory(EntityManager, DeviceStatus) {

		function DeviceStatusManager() {
		}

		DeviceStatusManager.prototype = Object.create(EntityManager.prototype);
		DeviceStatusManager.prototype.constructor = DeviceStatusManager;
		DeviceStatusManager.prototype._pool = {};
		DeviceStatusManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.device_status_id)) {
				if (update) {
					this._pool[data.device_status_id] = new DeviceStatus(data);
				}
				instance = this._pool[data.device_status_id];
			} else {
				instance = new DeviceStatus(data);
				this._pool[data.device_status_id] = instance;
			}
			return instance;
		};

		DeviceStatusManager.prototype.webservices = {};
		DeviceStatusManager.prototype.webservices.action_set = "base/rc_devicestatus/setDeviceStatus";
		DeviceStatusManager.prototype.webservices.action_recent = "base/rc_devicestatus/getDeviceStatusRecent";
		DeviceStatusManager.prototype.webservices.action_getAll = "base/rc_devicestatus/getDeviceStatusList";
		DeviceStatusManager.prototype.webservices.action_search = "base/rc_devicestatus/searchDeviceStatus";
		DeviceStatusManager.prototype.webservices.action_get = "base/rc_devicestatus/getDeviceStatus";
		DeviceStatusManager.prototype.webservices.action_del = "base/rc_devicestatus/delDeviceStatus";
		DeviceStatusManager.prototype.id_field = "device_status_id";

		return DeviceStatusManager;
	}
})(angular);
