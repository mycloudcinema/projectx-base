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

Auto generated entity for print_definition_formats
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("PrintDefinitionFormats", ["rcDateHandler", PrintDefinitionFormatsFactory])
		.factory("PrintDefinitionFormatsManager", ["EntityManager", "PrintDefinitionFormats", PrintDefinitionFormatsManagerFactory]);

	function PrintDefinitionFormatsFactory(rcDateHandler) {

		function PrintDefinitionFormats(data) {

			this.print_definition_format_id = data.print_definition_format_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without print_definition_format_id", data);
			})();
			this.dictionary_key = data.dictionary_key || null;
			this.print_definition_format_name = data.print_definition_format_name || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'print_definition_format_id');

		}

		return PrintDefinitionFormats;

	}

	function PrintDefinitionFormatsManagerFactory(EntityManager, PrintDefinitionFormats) {

		function PrintDefinitionFormatsManager() {
		}

		PrintDefinitionFormatsManager.prototype = Object.create(EntityManager.prototype);
		PrintDefinitionFormatsManager.prototype.constructor = PrintDefinitionFormatsManager;

		PrintDefinitionFormatsManager.prototype._pool = {};
		PrintDefinitionFormatsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.print_definition_format_id)) {
				if (update) {
					this._pool[data.print_definition_format_id] = new PrintDefinitionFormats(data);
				}
				instance = this._pool[data.print_definition_format_id];
			} else {
				instance = new PrintDefinitionFormats(data);
				this._pool[data.print_definition_format_id] = instance;
			}
			return instance;
		};

		PrintDefinitionFormatsManager.prototype.webservices = {};
		PrintDefinitionFormatsManager.prototype.webservices.action_set = "base/rc_printdefinitionformats/setPrintDefinitionFormats";
		PrintDefinitionFormatsManager.prototype.webservices.action_recent = "base/rc_printdefinitionformats/getPrintDefinitionFormatsRecent";
		PrintDefinitionFormatsManager.prototype.webservices.action_getAll = "base/rc_printdefinitionformats/getPrintDefinitionFormatsList";
		PrintDefinitionFormatsManager.prototype.webservices.action_search = "base/rc_printdefinitionformats/searchPrintDefinitionFormats";
		PrintDefinitionFormatsManager.prototype.webservices.action_get = "base/rc_printdefinitionformats/getPrintDefinitionFormats";
		PrintDefinitionFormatsManager.prototype.webservices.action_del = "base/rc_printdefinitionformats/delPrintDefinitionFormats";
		PrintDefinitionFormatsManager.prototype.id_field = "print_definition_format_id";

		return PrintDefinitionFormatsManager;

	}

})(angular);
