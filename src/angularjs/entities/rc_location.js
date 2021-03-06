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

Auto generated entity for location
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Location", ["rcDateHandler", LocationFactory])
		.factory("LocationManager", ["EntityManager", "Location", LocationManagerFactory]);

	function LocationFactory(rcDateHandler) {

		function Location(data) {
			this.location_id = data.location_id || 0;
			this.location_name = data.location_name || null;
			this.description = data.description || null;
			this.location_status_id = data.location_status_id || null;
			this.location_status_name = data.location_status_name || null;
			this.active = (data.active == 1 ? true : false);
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return Location;

	}

	function LocationManagerFactory(EntityManager, Location) {

		function LocationManager() {
		}

		LocationManager.prototype = Object.create(EntityManager.prototype);
		LocationManager.prototype.constructor = LocationManager;

		LocationManager.prototype._pool = {};
		LocationManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.location_id)) {
				if (update) {
					this._pool[data.location_id] = new Location(data);
				}
				instance = this._pool[data.location_id];
			} else {
				instance = new Location(data);
				this._pool[data.location_id] = instance;
			}
			return instance;
		};

		LocationManager.prototype.webservices = {};
		LocationManager.prototype.webservices.action_set = "base/rc_location/setLocation";
		LocationManager.prototype.webservices.action_recent = "base/rc_location/getLocationRecent";
		LocationManager.prototype.webservices.action_getAll = "base/rc_location/getLocationList";
		LocationManager.prototype.webservices.action_search = "base/rc_location/searchLocation";
		LocationManager.prototype.webservices.action_get = "base/rc_location/getLocation";
		LocationManager.prototype.webservices.action_del = "base/rc_location/delLocation";
		LocationManager.prototype.id_field = "location_id";

		return LocationManager;

	}

})(angular);
