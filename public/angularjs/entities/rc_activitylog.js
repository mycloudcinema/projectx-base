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

Auto generated entity for activity_log
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
	.factory("ActivityLog", ["rcDateHandler", ActivityLogFactory])
	.factory("ActivityLogManager", ["EntityManager", "ActivityLog", ActivityLogManagerFactory]);

	function ActivityLogFactory(rcDateHandler) {

		function ActivityLog(data) {

			this.activity_log_id = data.activity_log_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without activity_log_id", data);
			})();
			this.activity_log_date = rcDateHandler.fromDB(data.activity_log_date);
			this.site_name = data.site_name || null;
			this.user_id = data.user_id || null;
			this.user_name = data.user_name || null;
			this.user_class = data.user_class || null;
			this.cinema_id = data.cinema_id || 0;
			this.cinema_name = data.cinema_name || 0;
			this.function = data.function || null;
			this.action = data.action || null;
			try {
				this.log_data = JSON.parse(data.log_data);
				this.log_data = syntaxHighlight(this.log_data);
			} catch (ex) {
				this.log_data = data.log_data.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
			}

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'activity_log_id');

		}

		return ActivityLog;

	}

	function ActivityLogManagerFactory(EntityManager, ActivityLog) {

		function ActivityLogManager() {
		}

		ActivityLogManager.prototype = Object.create(EntityManager.prototype);

		ActivityLogManager.prototype.constructor = ActivityLogManager;

		ActivityLogManager.prototype._retrieveInstance = function (data, update) {
			debug.log("_retrieveInstance", data, update);
			var instance;
			if (this._pool.hasOwnProperty(data.activity_log_id)) {
				if (update) {
					this._pool[data.activity_log_id] = new ActivityLog(data);
				}
				instance = this._pool[data.activity_log_id];
			} else {
				instance = new ActivityLog(data);
				this._pool[data.activity_log_id] = instance;
			}
			return instance;
		};

		ActivityLogManager.prototype.webservices = {};
		ActivityLogManager.prototype.webservices.action_set = "activitylog/setActivityLog";
		ActivityLogManager.prototype.webservices.action_recent = "activitylog/getActivityLogRecent";
		ActivityLogManager.prototype.webservices.action_getAll = "activitylog/getActivityLogList";
		ActivityLogManager.prototype.webservices.action_search = "activitylog/searchActivityLog";
		ActivityLogManager.prototype.webservices.action_get = "activitylog/getActivityLog";
		ActivityLogManager.prototype.webservices.action_del = "activitylog/delActivityLog";
		ActivityLogManager.prototype.id_field = "activity_log_id";

		return ActivityLogManager;
	}

})(angular);
