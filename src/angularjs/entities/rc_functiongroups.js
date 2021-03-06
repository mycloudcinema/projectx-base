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

Auto generated entity for function_groups
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("FunctionGroups", [FunctionGroupsFactory])
		.factory("FunctionGroupsManager", ["EntityManager", "FunctionGroups", "rcWebservice", "$q", FunctionGroupsManagerFactory]);

	function FunctionGroupsFactory() {

		function FunctionGroups(data) {
			this.function_group_id = data.function_group_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without function_group_id", data);
			})();
			this.site_name = data.site_name || null;
			this.function_group_name = data.function_group_name || null;
			this.function_group_category = data.function_group_category || null;
			this.not_for_replication = data.not_for_replication || null;
			this.editable = data.editable || null;
			this.deleted = (typeof data.deleted === "number") ? (!!(data.deleted)) : (function() {
				console.warn("Expected number 0 or 1, but got: " + typeof data.deleted + " when setting boolean_field. It was resolved to false. Please check the database function");
				return false;
			})();
		}

		return FunctionGroups;

	}

	function FunctionGroupsManagerFactory(EntityManager, FunctionGroups, rcWebservice, $q) {

		function FunctionGroupsManager() {
		}

		FunctionGroupsManager.prototype = Object.create(EntityManager.prototype);
		FunctionGroupsManager.prototype.constructor = FunctionGroupsManager;
 		FunctionGroupsManager.prototype._pool = {};
		FunctionGroupsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.function_group_id)) {
				if (update) {
					this._pool[data.function_group_id] = new FunctionGroups(data);
				}
				instance = this._pool[data.function_group_id];
			} else {
				instance = new FunctionGroups(data);
				this._pool[data.function_group_id] = instance;
			}
			return instance;
		};

		FunctionGroupsManager.prototype.getAllAvailable = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAllAvailable).then((response) => {
				var entities = [];
				for (var i = 0; i < response.data.length; i++) {
					entities.push(_this._retrieveInstance(response.data[i], true));
				}
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};

		FunctionGroupsManager.prototype.webservices = {};
		FunctionGroupsManager.prototype.webservices.action_set = "base/rc_functiongroups/setFunctionGroups";
		FunctionGroupsManager.prototype.webservices.action_recent = "base/rc_functiongroups/getFunctionGroupsRecent";
		FunctionGroupsManager.prototype.webservices.action_getAll = "base/rc_functiongroups/getFunctionGroupsList";
		FunctionGroupsManager.prototype.webservices.action_getAllAvailable = "base/rc_functiongroups/getAllAvailable";
		FunctionGroupsManager.prototype.webservices.action_search = "base/rc_functiongroups/searchFunctionGroups";
		FunctionGroupsManager.prototype.webservices.action_get = "base/rc_functiongroups/getFunctionGroups";
		FunctionGroupsManager.prototype.webservices.action_del = "base/rc_functiongroups/delFunctionGroups";
		FunctionGroupsManager.prototype.id_field = "function_group_id";

		return FunctionGroupsManager;

	}

})(angular);
