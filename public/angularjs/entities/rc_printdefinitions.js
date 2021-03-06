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

Auto generated entity for print_definitions
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("PrintDefinitions", ["rcDateHandler", PrintDefinitionsFactory])
		.factory("PrintDefinitionsManager", ["EntityManager", "PrintDefinitions", PrintDefinitionsManagerFactory]);

	function PrintDefinitionsFactory(rcDateHandler) {

		function PrintDefinitions(data) {

			this.print_definition_id = data.print_definition_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without print_definition_id", data);
			})();

			this.print_definition_type_id = data.print_definition_type_id || null;
			this.print_definition_type_name = data.print_definition_type_name || null;
			this.print_definition_format_id = data.print_definition_format_id || null;
			this.print_definition_format_name = data.print_definition_format_name || null;

			// The definition contains information that we need to extract
			// for syntax hilighting, then we revert it back to the source
			// data so that it can be edited in the forms.
			try {
				this.print_definition = JSON.parse(data.print_definition || '{}');
				this.print_definition_syntax = syntaxHighlight(this.print_definition);
				this.print_definition = JSON.stringify(this.print_definition, undefined, 2);
			} catch (ex) {
				this.print_definition = {};
				this.print_definition_syntax = "";
			}
			this.template_type = data.template_type || null;
			this.template_definition = data.template_definition || null;

			this.note = data.note || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'print_definition_id');

		}

		return PrintDefinitions;

	}

	function PrintDefinitionsManagerFactory(EntityManager, PrintDefinitions) {

		function PrintDefinitionsManager() {
		}

		PrintDefinitionsManager.prototype = Object.create(EntityManager.prototype);
		PrintDefinitionsManager.prototype.constructor = PrintDefinitionsManager;

		PrintDefinitionsManager.prototype._pool = {};
		PrintDefinitionsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.print_definition_id)) {
				if (update) {
					this._pool[data.print_definition_id] = new PrintDefinitions(data);
				}
				instance = this._pool[data.print_definition_id];
			} else {
				instance = new PrintDefinitions(data);
				this._pool[data.print_definition_id] = instance;
			}
			return instance;
		};

		PrintDefinitionsManager.prototype.webservices = {};
		PrintDefinitionsManager.prototype.webservices.action_set = "base/rc_printdefinitions/setPrintDefinitions";
		PrintDefinitionsManager.prototype.webservices.action_recent = "base/rc_printdefinitions/getPrintDefinitionsRecent";
		PrintDefinitionsManager.prototype.webservices.action_getAll = "base/rc_printdefinitions/getPrintDefinitionsList";
		PrintDefinitionsManager.prototype.webservices.action_search = "base/rc_printdefinitions/searchPrintDefinitions";
		PrintDefinitionsManager.prototype.webservices.action_get = "base/rc_printdefinitions/getPrintDefinitions";
		PrintDefinitionsManager.prototype.webservices.action_del = "base/rc_printdefinitions/delPrintDefinitions";
		PrintDefinitionsManager.prototype.id_field = "print_definition_id";

		return PrintDefinitionsManager;

	}

})(angular);
