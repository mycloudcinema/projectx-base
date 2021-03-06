/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Service for handling the printing of PDF documents to the Print Server
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("PrintManager", ["rcWebservice", "$http", "$q", PrintManagerFactory]);

	function PrintManagerFactory(rcWebservice, $http, $q) {

		function PrintManager() {
		}

		PrintManager.prototype.constructor = PrintManager;

		PrintManager.prototype.printDefinitionById = function(printerIpAddress, printerPort, printDefinitionId, documentData, definitionData, customMessages) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.post('base/rc_print/printDocument', { printer_ip_address: printerIpAddress, printer_port: printerPort, print_definition_id: printDefinitionId, documentData: documentData, definition_data: definitionData, definition_key: 'print_definition_id', definition_field: 'template_definition', stored_procedure: 'get_print_definitions_list' }, { customMessages: customMessages }).then(function (response) {
				deferred.resolve(response);
			}, deferred.reject);
			return deferred.promise;
		};

		PrintManager.prototype.printDefinition = function(printerIpAddress, printerPort, printDefinitionTypeId, documentData, definitionData, customMessages) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.post('base/rc_print/printDocument', { printer_ip_address: printerIpAddress, printer_port: printerPort, print_definition_type_id: printDefinitionTypeId, documentData: documentData, definition_data: definitionData, definition_key: 'print_definition_id', definition_field: 'template_definition', stored_procedure: 'get_print_definitions_list' }, { customMessages: customMessages }).then(function (response) {
				deferred.resolve(response);
			}, deferred.reject);
			return deferred.promise;
		};

		PrintManager.prototype.reloadPrintDefinitions = function(customMessages) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.post('base/rc_print/reload', { definition_key: 'print_definition_id' }, { customMessages: customMessages }).then(function (response) {
				// Check to see if there are any linked sites and if there are
				// then force the reload on those print definitions too.
				const linkedSites = '$setting{linked_sites}'.split(',');
				console.log('linkedSites', linkedSites);
				linkedSites.forEach(function (site) {
					var thisPrintDefinitionURL = (site + '/webservices/base/rc_print/reload');
					console.log('site', site, thisPrintDefinitionURL);
					$http({
						method:	'GET',
						url:	thisPrintDefinitionURL
					});
				})
				deferred.resolve(response);
			}, deferred.reject);
			return deferred.promise;
		};

		return PrintManager;
	}

})(angular);
