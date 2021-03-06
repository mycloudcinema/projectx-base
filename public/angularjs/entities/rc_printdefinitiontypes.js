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

Auto generated entity for print_definition_types
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("PrintDefinitionTypes", ["rcDateHandler", PrintDefinitionTypesFactory])
		.factory("PrintDefinitionTypesManager", ["EntityManager", "PrintDefinitionTypes", PrintDefinitionTypesManagerFactory]);

	function PrintDefinitionTypesFactory(rcDateHandler) {

		function PrintDefinitionTypes(data) {

			this.print_definition_type_id = data.print_definition_type_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without print_definition_type_id", data);
			})();
			this.dictionary_key = data.dictionary_key || null;
			this.print_definition_type_name = data.print_definition_type_name || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'print_definition_type_id');

		}

		return PrintDefinitionTypes;

	}

	function PrintDefinitionTypesManagerFactory(EntityManager, PrintDefinitionTypes) {

		function PrintDefinitionTypesManager() {
		}

		PrintDefinitionTypesManager.prototype = Object.create(EntityManager.prototype);
		PrintDefinitionTypesManager.prototype.constructor = PrintDefinitionTypesManager;

		PrintDefinitionTypesManager.prototype._pool = {};
		PrintDefinitionTypesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.print_definition_type_id)) {
				if (update) {
					this._pool[data.print_definition_type_id] = new PrintDefinitionTypes(data);
				}
				instance = this._pool[data.print_definition_type_id];
			} else {
				instance = new PrintDefinitionTypes(data);
				this._pool[data.print_definition_type_id] = instance;
			}
			return instance;
		};

		PrintDefinitionTypesManager.prototype.webservices = {};
		PrintDefinitionTypesManager.prototype.webservices.action_set = "base/rc_printdefinitiontypes/setPrintDefinitionTypes";
		PrintDefinitionTypesManager.prototype.webservices.action_recent = "base/rc_printdefinitiontypes/getPrintDefinitionTypesRecent";
		PrintDefinitionTypesManager.prototype.webservices.action_getAll = "base/rc_printdefinitiontypes/getPrintDefinitionTypesList";
		PrintDefinitionTypesManager.prototype.webservices.action_search = "base/rc_printdefinitiontypes/searchPrintDefinitionTypes";
		PrintDefinitionTypesManager.prototype.webservices.action_get = "base/rc_printdefinitiontypes/getPrintDefinitionTypes";
		PrintDefinitionTypesManager.prototype.webservices.action_del = "base/rc_printdefinitiontypes/delPrintDefinitionTypes";
		PrintDefinitionTypesManager.prototype.id_field = "print_definition_type_id";

		return PrintDefinitionTypesManager;

	}

})(angular);
