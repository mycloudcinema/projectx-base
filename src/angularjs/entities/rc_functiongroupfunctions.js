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

Auto generated entity for function_group_functions
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("FunctionGroupFunctions", [FunctionGroupFunctionsFactory])
		.factory("FunctionGroupFunctionsManager", ["EntityManager", "FunctionGroupFunctions", "rcWebservice", "$q", FunctionGroupFunctionsManagerFactory]);

	function FunctionGroupFunctionsFactory() {
		function FunctionGroupFunctions(data) {
			this.function_group_functions_id = data.function_group_functions_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without function_group_functions_id", data);
			})();
			this.function_group_id = data.function_group_id || null;
			this.function_group_name = data.function_group_name || null;
			this.function_id = data.function_id || null;
			this.function_name = data.function_name || null;
			this.not_for_replication = data.not_for_replication || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}
		FunctionGroupFunctions.prototype = {
			function_group_functions_id: null,
			function_group_id: null,
			function_group_name: null,
			function_id: null,
			function_name: null,
			not_for_replication: null,
			deleted: null
		};
		return FunctionGroupFunctions;
	}

	function FunctionGroupFunctionsManagerFactory(EntityManager, FunctionGroupFunctions, rcWebservice, $q) {

		function FunctionGroupFunctionsManager() {
		}

		FunctionGroupFunctionsManager.prototype = Object.create(EntityManager.prototype);
		FunctionGroupFunctionsManager.prototype.constructor = FunctionGroupFunctionsManager;
		FunctionGroupFunctionsManager.prototype._pool = {};
		FunctionGroupFunctionsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.function_group_functions_id)) {
				if (update) {
					this._pool[data.function_group_functions_id] = new FunctionGroupFunctions(data);
				}
				instance = this._pool[data.function_group_functions_id];
			} else {
				instance = new FunctionGroupFunctions(data);
				this._pool[data.function_group_functions_id] = instance;
			}
			return instance;
		};
		FunctionGroupFunctionsManager.prototype.getFunctionsByFunctionGroup = function (function_group_id) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAll, {id: function_group_id}).then(function (response) {
				var entities = [];
				for (var i = 0; i < response.data.length; i++) {
					entities.push(_this._retrieveInstance(response.data[i], true));
				}
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};

		FunctionGroupFunctionsManager.prototype.webservices = {};
		FunctionGroupFunctionsManager.prototype.webservices.action_set = "base/rc_functiongroupfunctions/setFunctionGroupFunctions";
		FunctionGroupFunctionsManager.prototype.webservices.action_recent = "base/rc_functiongroupfunctions/getFunctionGroupFunctionsRecent";
		FunctionGroupFunctionsManager.prototype.webservices.action_getAll = "base/rc_functiongroupfunctions/getFunctionGroupFunctionsList";
		FunctionGroupFunctionsManager.prototype.webservices.action_search = "base/rc_functiongroupfunctions/searchFunctionGroupFunctions";
		FunctionGroupFunctionsManager.prototype.webservices.action_get = "base/rc_functiongroupfunctions/getFunctionGroupFunctions";
		FunctionGroupFunctionsManager.prototype.webservices.action_del = "base/rc_functiongroupfunctions/delFunctionGroupFunctions";
		FunctionGroupFunctionsManager.prototype.id_field = "function_group_functions_id";

		return FunctionGroupFunctionsManager;
	}

})(angular);
