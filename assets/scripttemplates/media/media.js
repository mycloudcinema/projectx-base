(function(ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable", "rcFilter", "NgSwitchery"]);
	ng.module("rc")
		.controller("MediaController", ["MediaManager", MediaController]);

	function MediaController(MediaManager) {

		var self = this;

		self.MediaManager = new MediaManager();

		self.templateAdd = "/base/media/media-parts/add";
		self.templateView = "/base/media/media-parts/view";
		self.templateEdit = "/base/media/media-parts/edit";

		self.columns = [
			{name:"$dict{site_name}", heading_class:"", class:"", property:"site_name", template: false},
			{name:"$dict{media_type}", heading_class:"", class:"", property:"media_type_name", template: false},
			{name:"$dict{media_desc}", heading_class:"", class:"", property:"media_desc", template: false},
			{name:"$dict{media_size}", heading_class:"", class:"", property:"media_size", template: "{{row.media_size | rcBytes}}"},
			{name:"$dict{last_updated}", heading_class:"", class:"", property:"last_updated", template: "{{row.last_updated | moment:'mediumDateTime'}}"},
			{name:"$dict{last_updated_by}", heading_class:"", class:"", property:"last_updated_by_name", template: false},
		];
		self.options = {
		};
		self.order = [
			"media_id"
		];
	}

	$(document).ready(function() {
		setPageTitle("$dict{media}", "menuMediaCore", "menuMedia");
	});

})(angular);
