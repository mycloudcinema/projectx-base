(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "ui.tinymce", "angular.filter", "rcTable", "NgSwitchery"]);
	ng.module("rc")
		.controller("TourStepsController", ["TourStepsManager", "$sce", TourStepsController]);

	function TourStepsController(TourStepsManager, $sce) {

		var self = this;

		self.TourStepsManager = new TourStepsManager();

		self.templateAdd = "/base/setup/toursteps-parts/add";
		self.templateView = "/base/setup/toursteps-parts/view";
		self.templateEdit = "/base/setup/toursteps-parts/edit";

		self.columns = [
			{name:"$dict{tour_step_page}", heading_class:"", class:"", property:"tour_step_page", template: false},
			{name:"$dict{tour_step_order}", heading_class:"", class:"", property:"tour_step_order", template: false},
			{name:"$dict{tour_language}", heading_class:"", class:"", property:"tour_language_name", template: false},
			{name:"$dict{tour_step_title}", heading_class:"", class:"", property:"tour_step_title", template: false},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'shortDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
		];
		self.options = {
		};
		self.order = [
			"tour_step_page", "tour_step_order"
		];

		self.tinymceOptions = {
			menubar:	false,
			plugins:	'textcolor colorpicker table code link image',
			toolbar:	'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | forecolor backcolor | table | code'
		};

		self.trustAsHtml = function(string) {
			return $sce.trustAsHtml(string);
		};

	}

	$(document).ready(function() {
		setPageTitle("$dict{tour_steps}", "menuApplicationCore", "menuTourSteps");
	});

})(angular);
