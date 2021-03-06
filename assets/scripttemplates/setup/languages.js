(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("LanguagesController", ["LanguagesManager", languagesController]);

	function languagesController(LanguagesManager) {

		var self = this;

		self.LanguagesManager = new LanguagesManager();

		self.templateAdd = "/base/setup/languages-parts/add";
		self.templateView = "/base/setup/languages-parts/view";
		self.templateEdit = "/base/setup/languages-parts/edit";

		self.columns = [
			{name:"$dict{language}", heading_class:"", class:"", property:"language", template: false},
			{name:"$dict{display_name}", heading_class:"", class:"", property:"language_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false}
		];
		self.options = {
		};
		self.order = [
			"language"
		];

		// Load a list of supported languages
		self.LanguagesManager.getSupported().then(function (supportedLanguages) {
			self.supportedLanguages = supportedLanguages
		});
	}

	$(document).ready(function() {
		setPageTitle("$dict{languages}", "menuApplicationCore", "menuLanguages");
	});

})(angular);
