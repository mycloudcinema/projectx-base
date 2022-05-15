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

Auto generated entity for sites
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Sites", ["rcDateHandler", SitesFactory])
		.factory("SitesManager", ["EntityManager", "Sites", "rcWebservice", "$q", SitesManagerFactory]);

	function SitesFactory(rcDateHandler) {

		function Sites(data) {
			this.site_name = data.site_name || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without site_name", data);
			})();
			this.site_options = JSONTryParse(data.site_options);
			this.active = (data.active == 1 ? true : false);

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'site_name');
		}

		return Sites;

	}

	function SitesManagerFactory(EntityManager, Sites, rcWebservice, $q) {

		function SitesManager() {
		}

		SitesManager.prototype = Object.create(EntityManager.prototype);
		SitesManager.prototype.constructor = SitesManager;
		SitesManager.prototype._pool = {};

		SitesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.site_name)) {
				if (update) {
					this._pool[data.site_name] = new Sites(data);
				}
				instance = this._pool[data.site_name];
			} else {
				instance = new Sites(data);
				this._pool[data.site_name] = instance;
			}
			return instance;
		};

		// Sites are added by the user who supplies the key field value so we
		// need to override the standard entity logic.
		SitesManager.prototype.set = function (data, newEntity) {
			var deferred = $q.defer(), _this = this;
			// If the webservice action is not defined, then this function could not work at all.
			if (_this.webservices.action_set === null) {
				throw new Error("The set function is not implemented on this entity", _this.webservices);
			}
			var postData = {};
			for (var key in data) {
				if (data[key] !== null) {
					postData[key] = ng.copy(data[key]);
				}
			}
			rcWebservice.post(_this.webservices.action_set, postData, {privilegeElevation: this._privilegeElevation, authorisationMessage: this._authorisationMessage}).then(function (response) {
				// The set functions in the DB are returning the updated entity if the update was successful. So we have to update the _pool as well
				deferred.resolve(_this._retrieveInstance(response.data[0], true));
				// since deferred.reject is a function that takes exactly one argument there is no need to define an anonymous function to call deferred.reject(); --> less code and it's faster
			}, deferred.reject);
			return deferred.promise;
		};

		SitesManager.prototype.webservices = {};
		SitesManager.prototype.webservices.action_set = "base/rc_sites/setSites";
		SitesManager.prototype.webservices.action_recent = "base/rc_sites/getSitesRecent";
		SitesManager.prototype.webservices.action_getAll = "base/rc_sites/getSitesList";
		SitesManager.prototype.webservices.action_search = "base/rc_sites/searchSites";
		SitesManager.prototype.webservices.action_get = "base/rc_sites/getSites";
		SitesManager.prototype.webservices.action_del = "base/rc_sites/delSites";
		SitesManager.prototype.id_field = "site_name";

		return SitesManager;
	}

})(angular);
