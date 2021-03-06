(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable"]);
	ng.module("rc")
		.controller("PrintDefinitionFormatsController", ["PrintDefinitionFormatsManager", printDefinitionFormatsController]);

	function printDefinitionFormatsController(PrintDefinitionFormatsManager) {

		var self = this;

		self.PrintDefinitionFormatsManager = new PrintDefinitionFormatsManager();

		self.templateAdd = "/base/printing/printdefinitionformats-parts/add";
		self.templateView = "/base/printing/printdefinitionformats-parts/view";
		self.templateEdit = "/base/printing/printdefinitionformats-parts/edit";

		self.columns = [
			{name:"$dict{print_definition_format_id}", heading_class:"", class:"", property:"print_definition_format_id", template: false},
			// {name:"$dict{dictionary_key}", heading_class:"", class:"", property:"dictionary_key", template: false},
			{name:"$dict{print_definition_format_name}", heading_class:"", class:"", property:"print_definition_format_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
			// {name:"$dict{replication_source}", heading_class:"", class:"", property:"replication_source", template: false},
			// {name:"$dict{replication_id}", heading_class:"", class:"", property:"replication_id", template: false},
			// {name:"$dict{replication_name}", heading_class:"", class:"", property:"replication_name", template: false},
			// {name:"$dict{deleted}", heading_class:"text-center", class:"text-center", property:"deleted", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.deleted == true), \"fa fa-circle-o\": (row.deleted == false)}'></i>"}
		];
		self.options = {
		};
		self.order = [
			"print_definition_format_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{print_definition_formats}", "menuPrintingCore", "menuPrintDefinitionFormats");
	});

})(angular);
