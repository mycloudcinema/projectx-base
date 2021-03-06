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

Auto generated entity for location_status
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("LocationStatus", ["rcDateHandler", LocationStatusFactory])
		.factory("LocationStatusManager", ["EntityManager", "LocationStatus", LocationStatusManagerFactory]);

	function LocationStatusFactory(rcDateHandler) {

		function LocationStatus(data) {
			this.location_status_id = data.location_status_id || 0;
			this.dictionary_key = data.dictionary_key || null;
			this.location_status_name = data.location_status_name || null;
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return LocationStatus;

	}

	function LocationStatusManagerFactory(EntityManager, LocationStatus) {

		function LocationStatusManager() {
		}

		LocationStatusManager.prototype = Object.create(EntityManager.prototype);
		LocationStatusManager.prototype.constructor = LocationStatusManager;

		LocationStatusManager.prototype._pool = {};
		LocationStatusManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.location_status_id)) {
				if (update) {
					this._pool[data.location_status_id] = new LocationStatus(data);
				}
				instance = this._pool[data.location_status_id];
			} else {
				instance = new LocationStatus(data);
				this._pool[data.location_status_id] = instance;
			}
			return instance;
		};

		LocationStatusManager.prototype.webservices = {};
		LocationStatusManager.prototype.webservices.action_set = "base/rc_locationstatus/setLocationStatus";
		LocationStatusManager.prototype.webservices.action_recent = "base/rc_locationstatus/getLocationStatusRecent";
		LocationStatusManager.prototype.webservices.action_getAll = "base/rc_locationstatus/getLocationStatusList";
		LocationStatusManager.prototype.webservices.action_search = "base/rc_locationstatus/searchLocationStatus";
		LocationStatusManager.prototype.webservices.action_get = "base/rc_locationstatus/getLocationStatus";
		LocationStatusManager.prototype.webservices.action_del = "base/rc_locationstatus/delLocationStatus";
		LocationStatusManager.prototype.id_field = "location_status_id";

		return LocationStatusManager;

	}

})(angular);
