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

Auto generated entity for user_roles
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("UserRoles", ["rcDateHandler", UserRolesFactory])
		.factory("UserRolesManager", ["EntityManager", "UserRoles", UserRolesManagerFactory]);

	function UserRolesFactory(rcDateHandler) {

		function UserRoles(data) {

			this.user_role_id = data.user_role_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without user_role_id", data);
			})();
			this.site_name = data.site_name || null;
			this.user_role_name = data.user_role_name || null;
			this.user_role_level = data.user_role_level || 0;
			this.default_role = (data.default_role == 1 ? true : false);
			this.function_group_ids = data.function_group_ids || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'user_role_id');

		}

		return UserRoles;

	}

	function UserRolesManagerFactory(EntityManager, UserRoles) {

		function UserRolesManager() {
		}

		UserRolesManager.prototype = Object.create(EntityManager.prototype);
		UserRolesManager.prototype.constructor = UserRolesManager;
 		UserRolesManager.prototype._pool = {};
		UserRolesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.user_role_id)) {
				if (update) {
					this._pool[data.user_role_id] = new UserRoles(data);
				}
				instance = this._pool[data.user_role_id];
			} else {
				instance = new UserRoles(data);
				this._pool[data.user_role_id] = instance;
			}
			return instance;
		};

		UserRolesManager.prototype.webservices = {};
		UserRolesManager.prototype.webservices.action_set = "base/rc_userroles/setUserRoles";
		UserRolesManager.prototype.webservices.action_recent = "base/rc_userroles/getUserRolesRecent";
		UserRolesManager.prototype.webservices.action_getAll = "base/rc_userroles/getUserRolesList";
		UserRolesManager.prototype.webservices.action_search = "base/rc_userroles/searchUserRoles";
		UserRolesManager.prototype.webservices.action_get = "base/rc_userroles/getUserRoles";
		UserRolesManager.prototype.webservices.action_del = "base/rc_userroles/delUserRoles";
		UserRolesManager.prototype.id_field = "user_role_id";

		return UserRolesManager;
	}

})(angular);
