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

Auto generated entity for user_role_function_groups
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("UserRoleFunctionGroups", [UserRoleFunctionGroupsFactory])
		.factory("UserRoleFunctionGroupsManager", ["EntityManager", "UserRoleFunctionGroups", UserRoleFunctionGroupsManagerFactory]);

	function UserRoleFunctionGroupsFactory() {

		function UserRoleFunctionGroups(data) {
			this.user_role_function_groups_id = data.user_role_function_groups_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without user_role_function_groups_id", data);
			})();
			this.user_role_id = data.user_role_id || null;
			this.user_role_name = data.user_role_name || null;
			this.function_group_id = data.function_group_id || null;
			this.function_group_name = data.function_group_name || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return UserRoleFunctionGroups;

	}

	function UserRoleFunctionGroupsManagerFactory(EntityManager, UserRoleFunctionGroups) {

		function UserRoleFunctionGroupsManager() {
		}

		UserRoleFunctionGroupsManager.prototype = Object.create(EntityManager.prototype);
		UserRoleFunctionGroupsManager.prototype.constructor = UserRoleFunctionGroupsManager;
		UserRoleFunctionGroupsManager.prototype._pool = {};
		UserRoleFunctionGroupsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.user_role_function_groups_id)) {
				if (update) {
					this._pool[data.user_role_function_groups_id] = new UserRoleFunctionGroups(data);
				}
				instance = this._pool[data.user_role_function_groups_id];
			} else {
				instance = new UserRoleFunctionGroups(data);
				this._pool[data.user_role_function_groups_id] = instance;
			}
			return instance;
		};

		UserRoleFunctionGroupsManager.prototype.webservices = {};
		UserRoleFunctionGroupsManager.prototype.webservices.action_set = "base/rc_userrolefunctiongroups/setUserRoleFunctionGroups";
		UserRoleFunctionGroupsManager.prototype.webservices.action_recent = "base/rc_userrolefunctiongroups/getUserRoleFunctionGroupsRecent";
		UserRoleFunctionGroupsManager.prototype.webservices.action_getAll = "base/rc_userrolefunctiongroups/getUserRoleFunctionGroupsList";
		UserRoleFunctionGroupsManager.prototype.webservices.action_search = "base/rc_userrolefunctiongroups/searchUserRoleFunctionGroups";
		UserRoleFunctionGroupsManager.prototype.webservices.action_get = "base/rc_userrolefunctiongroups/getUserRoleFunctionGroups";
		UserRoleFunctionGroupsManager.prototype.webservices.action_del = "base/rc_userrolefunctiongroups/delUserRoleFunctionGroups";
		UserRoleFunctionGroupsManager.prototype.id_field = "user_role_function_groups_id";

		return UserRoleFunctionGroupsManager;
	}

})(angular);
