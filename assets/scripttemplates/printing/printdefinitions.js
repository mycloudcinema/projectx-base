(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("PrintDefinitionsController", ["DeviceManager", "PrintDefinitionsManager", "PrintManager", "dialogs", "rcDevice", printDefinitionsController]);

	function printDefinitionsController(DeviceManager, PrintDefinitionsManager, PrintManager, dialogs, rcDevice) {

		var self = this;

		self.device = rcDevice.device;
		self.DeviceManager = new DeviceManager();
		self.PrintDefinitionsManager = new PrintDefinitionsManager();

		self.templateAdd = "/base/printing/printdefinitions-parts/add";
		self.templateView = "/base/printing/printdefinitions-parts/view";
		self.templateEdit = "/base/printing/printdefinitions-parts/edit";

		self.columns = [
			{name:"$dict{print_definition_id}", heading_class:"", class:"", property:"print_definition_id", template: false},
			// {name:"$dict{print_definition_type_id}", heading_class:"", class:"", property:"print_definition_type_id", template: false},
			{name:"$dict{print_definition_type}", heading_class:"", class:"", property:"print_definition_type_name", template: false},
			// {name:"$dict{print_definition_format_id}", heading_class:"", class:"", property:"print_definition_format_id", template: false},
			{name:"$dict{print_definition_format}", heading_class:"", class:"", property:"print_definition_format_name", template: false},
			{name:"$dict{print_definition_template_type}", heading_class:"", class:"", property:"template_type", template: false},
			// {name:"$dict{print_definition}", heading_class:"", class:"", property:"print_definition", template: false},
			{name:"$dict{note}", heading_class:"", class:"", property:"note", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			// {name:"$dict{replication_source}", heading_class:"", class:"", property:"replication_source", template: false},
			// {name:"$dict{replication_id}", heading_class:"", class:"", property:"replication_id", template: false},
			// {name:"$dict{replication_name}", heading_class:"", class:"", property:"replication_name", template: false},
			// {name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];

		// If this device has a printer attached then we can include the test print function
		if (self.device.config && self.device.config.printer_id) {
			self.columns.push({name:"$dict{test_print}", heading_class:"", class:"", property:"", template: '<button class="btn btn-sm btn-default" ng-disabled="row.printing" ng-click="$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.con.testPrint(row); $event.stopPropagation();"><i class="fa" ng-class="{\'fa-print\': !row.printing, \'fa-spin fa-refresh\': row.printing}"></i></button>'});
		}

		self.testPrint = function(printDefinition) {

			printDefinition.printing = true;

			new DeviceManager().getDevice(self.device.config.printer_id).then(function (printerData) {

				let testPrintDocument = {
					documentTitle:			'Document Title',
					documentSubTitle:		'Document Subtitle',
					dataArray:				[
						{alphaField: 'Alpha Field', numericField: 12345, decimalField: 123.45, dateField: '1967-09-05', dateTimeField: '1967-09-05 10:00'},
						{alphaField: 'Alpha Field', numericField: 67890, decimalField: 678.90, dateField: '2007-12-14', dateTimeField: '2007-12-14 06:00'}
					]
				};

				new PrintManager().printDefinitionById(printerData.config_json.printer_ip_address, printerData.config_json.printer_port, printDefinition.print_definition_id, [testPrintDocument], null).then(function (response) {
					printDefinition.printing = false;
					dialogs.notify("$dict{success}", "$dict{print_definition_queued_for_printing}");
				}, function (error) {
					printDefinition.printing = false;
				});

			}, function (error) {
				self.dialogs.error('$dict{printing_error}', '$dict{no_printing_message}');
			});

		};

		self.reloadDefinitions = function() {
			new PrintManager().reloadPrintDefinitions().then(function(response) {
				dialogs.notify("$dict{success}", "$dict{print_definitions_will_be_reloaded}");
			});
		};

		self.options = {
		};

		self.order = [
			"print_definition_id"
		];

	}

	$(document).ready(function() {
		setPageTitle("$dict{print_definitions}", "menuPrintingCore", "menuPrintDefinitions");
	});

})(angular);
