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

Auto generated entity for online_help
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("OnlineHelp", ["rcDateHandler", OnlineHelpFactory])
		.factory("OnlineHelpManager", ["EntityManager", "OnlineHelp", "rcWebservice", "$q", OnlineHelpManagerFactory]);

	function OnlineHelpFactory(rcDateHandler) {

		function OnlineHelp(data) {
			this.online_help_id = data.online_help_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without online_help_id", data);
			})();
			this.page_name = data.page_name || null;
			this.language = data.language || null;
			this.online_help_content = data.online_help_content || null;
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_name = data.replication_name || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return OnlineHelp;

	}

	function OnlineHelpManagerFactory(EntityManager, OnlineHelp, rcWebservice, $q) {

		function OnlineHelpManager() {
		}

		OnlineHelpManager.prototype = Object.create(EntityManager.prototype);
		OnlineHelpManager.prototype.constructor = OnlineHelpManager;

		OnlineHelpManager.prototype._pool = {};
		OnlineHelpManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.online_help_id)) {
				if (update) {
					this._pool[data.online_help_id] = new OnlineHelp(data);
				}
				instance = this._pool[data.online_help_id];
			} else {
				instance = new OnlineHelp(data);
				this._pool[data.online_help_id] = instance;
			}
			return instance;
		};

		OnlineHelpManager.prototype.getByPage = function (pageName) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getByPage, { page_name: pageName }).then(function (response) {
				if (response.data[0])
					deferred.resolve(_this._retrieveInstance(response.data[0], true));
				else
					deferred.reject();
			}, deferred.reject);
			return deferred.promise;
		};

		OnlineHelpManager.prototype.webservices = {};
		OnlineHelpManager.prototype.webservices.action_set = "base/rc_onlinehelp/setOnlineHelp";
		OnlineHelpManager.prototype.webservices.action_recent = "base/rc_onlinehelp/getOnlineHelpRecent";
		OnlineHelpManager.prototype.webservices.action_getAll = "base/rc_onlinehelp/getOnlineHelpList";
		OnlineHelpManager.prototype.webservices.action_search = "base/rc_onlinehelp/searchOnlineHelp";
		OnlineHelpManager.prototype.webservices.action_get = "base/rc_onlinehelp/getOnlineHelp";
		OnlineHelpManager.prototype.webservices.action_del = "base/rc_onlinehelp/delOnlineHelp";
		OnlineHelpManager.prototype.webservices.action_getByPage = "base/rc_onlinehelp/getOnlineHelpByPage";
		OnlineHelpManager.prototype.id_field = "online_help_id";

		return OnlineHelpManager;
	}
})(angular);
