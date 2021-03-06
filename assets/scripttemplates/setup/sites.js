(function(ng) {

	"use strict";

	ng.module("rc.external", ["NgSwitchery", "ui.bootstrap", "angular.filter", "rcTable"]);

	ng.module("rc")
		.controller("SitesController", ["SitesManager", sitesController]);

	function sitesController(SitesManager) {

		var self = this;

		self.SitesManager = new SitesManager();

		self.templateAdd = "/base/setup/sites-parts/add";
		self.templateView = "/base/setup/sites-parts/view";
		self.templateEdit = "/base/setup/sites-parts/edit";

		self.columns = [
			{name:"$dict{site_name}", heading_class:"", class:"", property:"site_name", template: false},
			{name:"$dict{active}", heading_class:"text-center", class:"text-center", property:"active", template: "<i ng-class='{\"fa fa-check-circle-o\": (row.active == true), \"fa fa-circle-o\": (row.active == false)}'></i>"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{sites}", "menuApplicationCore", "menuSites");
	});

})(angular);
