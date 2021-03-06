(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("MediaTypesController", ["MediaTypesManager", MediaTypesController]);

	function MediaTypesController(MediaTypesManager) {

		var self = this;

		self.MediaTypesManager = new MediaTypesManager();

		self.templateAdd = "/base/media/mediatypes-parts/add";
		self.templateView = "/base/media/mediatypes-parts/view";
		self.templateEdit = "/base/media/mediatypes-parts/edit";

		self.columns = [
			{name:"$dict{media_type_id}", heading_class:"", class:"", property:"media_type_id", template: false},
			{name:"$dict{media_type}", heading_class:"", class:"", property:"media_type_name", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
		];
		self.options = {
		};
		self.order = [
			"media_type_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{media_types}", "menuMediaCore", "menuMediaTypes");
	});

})(angular);
