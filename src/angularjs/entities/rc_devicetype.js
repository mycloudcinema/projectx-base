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

Auto generated entity for device_type
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("DeviceType", ["rcDateHandler", DeviceTypeFactory])
		.factory("DeviceTypeManager", ["EntityManager", "DeviceType", DeviceTypeManagerFactory]);

	function DeviceTypeFactory(rcDateHandler) {

		function DeviceType(data) {
			this.device_type_id = data.device_type_id;
			this.dictionary_key = data.dictionary_key || null;
			this.device_type_name = data.device_type_name || null;
			this.is_printer = (data.is_printer == 1 ? true : false);
			this.create_transactions = (data.create_transactions == 1 ? true : false);
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_name = data.replication_name || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return DeviceType;

	}

	function DeviceTypeManagerFactory(EntityManager, DeviceType) {

		function DeviceTypeManager() {
		}

		DeviceTypeManager.prototype = Object.create(EntityManager.prototype);
		DeviceTypeManager.prototype.constructor = DeviceTypeManager;

		DeviceTypeManager.prototype._pool = {};
		DeviceTypeManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.device_type_id)) {
				if (update) {
					this._pool[data.device_type_id] = new DeviceType(data);
				}
				instance = this._pool[data.device_type_id];
			} else {
				instance = new DeviceType(data);
				this._pool[data.device_type_id] = instance;
			}
			return instance;
		};

		DeviceTypeManager.prototype.webservices = {};
		DeviceTypeManager.prototype.webservices.action_set = "base/rc_devicetype/setDeviceType";
		DeviceTypeManager.prototype.webservices.action_recent = "base/rc_devicetype/getDeviceTypeRecent";
		DeviceTypeManager.prototype.webservices.action_getAll = "base/rc_devicetype/getDeviceTypeList";
		DeviceTypeManager.prototype.webservices.action_search = "base/rc_devicetype/searchDeviceType";
		DeviceTypeManager.prototype.webservices.action_get = "base/rc_devicetype/getDeviceType";
		DeviceTypeManager.prototype.webservices.action_del = "base/rc_devicetype/delDeviceType";
		DeviceTypeManager.prototype.id_field = "device_type_id";

		return DeviceTypeManager;
	}

})(angular);
