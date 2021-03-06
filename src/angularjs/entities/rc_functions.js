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

Auto generated entity for functions
*/

(function (ng) {
	"use strict";
	ng.module("rc.entities")
	.factory("Functions", [FunctionsFactory])
	.factory("FunctionsManager", ["EntityManager", "Functions", FunctionsManagerFactory]);

	function FunctionsFactory() {
		function Functions(data) {
			this.function_id = data.function_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without function_id", data);
			})();
			this.site_name = data.site_name || null;
			this.function_name = data.function_name || null;
			this.public_function = (data.public_function == 1 ? true : false);
			this.deleted = (data.deleted == 1 ? true : false);
		}
		return Functions;
	}

	function FunctionsManagerFactory(EntityManager, Functions) {

		function FunctionsManager() {
		}

		FunctionsManager.prototype = Object.create(EntityManager.prototype);
		FunctionsManager.prototype.constructor = FunctionsManager;
		FunctionsManager.prototype._pool = {};
		FunctionsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.function_id)) {
				if (update) {
					this._pool[data.function_id] = new Functions(data);
				}
				instance = this._pool[data.function_id];
			} else {
				instance = new Functions(data);
				this._pool[data.function_id] = instance;
			}
			return instance;
		};

		FunctionsManager.prototype.webservices = {};
		FunctionsManager.prototype.webservices.action_set = "base/rc_functions/setFunctions";
		FunctionsManager.prototype.webservices.action_recent = "base/rc_functions/getFunctionsRecent";
		FunctionsManager.prototype.webservices.action_getAll = "base/rc_functions/getFunctionsList";
		FunctionsManager.prototype.webservices.action_search = "base/rc_functions/searchFunctions";
		FunctionsManager.prototype.webservices.action_get = "base/rc_functions/getFunctions";
		FunctionsManager.prototype.webservices.action_del = "base/rc_functions/delFunctions";
		FunctionsManager.prototype.id_field = "function_id";

		return FunctionsManager;
	}

})(angular);
