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

Auto generated entity for users
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Users", ["rcDateHandler", UsersFactory])
		.factory("UsersManager", ["EntityManager", "Users", "rcWebservice", "$q", UsersManagerFactory]);

	function UsersFactory(rcDateHandler) {

		function Users(data) {
			this.user_id = data.user_id || 0;
			this.login = data.login || null;
			this.password = null;
			this.first_name = data.first_name || null;
			this.last_name = data.last_name || null;
			this.full_name = data.full_name || null;
			this.internal_id = data.internal_id || null;
			this.employee_id = data.employee_id || null;
			this.email = data.email || null;
			this.phone = data.phone || null;

			this.email_confirmed = (data.email_confirmed == 1 ? true : false);
			this.phone_confirmed = (data.phone_confirmed == 1 ? true : false);
			this.active = (data.active == 1 ? true : false);
			this.include_in_working_hours = (data.include_in_working_hours == 1 ? true : false);
			this.deleted = (data.deleted == 1 ? true : false);

			this.email_confirmation_code = data.email_confirmation_code || null;
			this.phone_confirmation_code = data.phone_confirmation_code || null;

			this.user_class = data.user_class || null;
			this.user_roles = data.user_roles || null;
			this.user_role_names = data.user_role_names || null;

			this.last_login = rcDateHandler.fromDB(data.last_login);
			this.last_activity = rcDateHandler.fromDB(data.last_activity);
			this.default_page = data.default_page || null;

			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;

			this.deleted = (data.deleted == 1 ? true : false);
		}

		return Users;

	}

	function UsersManagerFactory(EntityManager, Users, rcWebservice, $q) {

		function UsersManager() {
		}

		UsersManager.prototype = Object.create(EntityManager.prototype);
		UsersManager.prototype.constructor = UsersManager;
 		UsersManager.prototype._pool = {};
		UsersManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.user_id)) {
				if (update) {
					this._pool[data.user_id] = new Users(data);
				}
				instance = this._pool[data.user_id];
			} else {
				instance = new Users(data);
				this._pool[data.user_id] = instance;
			}
			return instance;
		};

		UsersManager.prototype.getUsersShortcuts = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getUsersShortcuts).then(function (response) {
				deferred.resolve(response.data[0]);
			}, deferred.reject);
			return deferred.promise;
		};
		UsersManager.prototype.setUsersShortcuts = function (userShortcuts) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.post(_this.webservices.action_setUsersShortcuts, {user_shortcuts: userShortcuts}).then(function (response) {
				deferred.resolve(response.data[0]);
			}, deferred.reject);
			return deferred.promise;
		};

		UsersManager.prototype.webservices = {};
		UsersManager.prototype.webservices.action_set = "base/rc_users/setUsers";
		UsersManager.prototype.webservices.action_recent = "base/rc_users/getUsersRecent";
		UsersManager.prototype.webservices.action_getAll = "base/rc_users/getUsersList";
		UsersManager.prototype.webservices.action_search = "base/rc_users/searchUsers";
		UsersManager.prototype.webservices.action_get = "base/rc_users/getUsers";
		UsersManager.prototype.webservices.action_del = "base/rc_users/delUsers";
		UsersManager.prototype.webservices.action_getUsersShortcuts = "base/rc_users/getUsersShortcuts";
		UsersManager.prototype.webservices.action_setUsersShortcuts = "base/rc_users/setUsersShortcuts";
		UsersManager.prototype.id_field = "user_id";

		return UsersManager;
	}

})(angular);
