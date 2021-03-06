(function(ng){

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable"]);

	ng.module("rc")
	.controller("MediaManagerController", ["MediaManager", "$scope", mediaManagerController]);

	function mediaManagerController(MediaManager, $scope) {

		var self = this;

		var mediaManager = new MediaManager();

		self.info = {
			site_name:			null,
			media_type_id:		1,
			media_key:			null
		};
		self.options = {
			aspect_ratios: [
				{aspect_ratio:	1, ratio_name: '1:1'},
				{aspect_ratio:	(4 / 3), ratio_name: '4:3'},
				{aspect_ratio:	(16 / 9), ratio_name: '16:9'}
			],
			aspect_ratio:		1,
			dialog_title:		'$dict{upload_image}',
			webservice:			'base/rc_fileupload/uploadImage',
			uploadAllowed:		true
		};
		self.upload_enabled = false;

		self.imageSelectOptions = {
			media_type_id:	1,
			dialog_title:	"$dict{select_image}",
			placeholder:	"$dict{select_file}"
		};
		self.fileName;

		self.columns = [
			{name:"$dict{media_type}", heading_class:"", class:"", property:"media_type_name", template: false},
			{name:"$dict{media_desc}", heading_class:"", class:"", property:"media_desc", template: false},
			{name:"$dict{media_size}", heading_class:"text-right", class:"text-right", property:"media_size", template: "{{row.media_size | rcBytes}}"},
			{name:"", heading_class:"", class:"", property:"", template: "<button ng-click=\"$parent.$parent.$parent.$parent.$parent.$parent.con.previewMedia(row)\"><span class=\"fa fa-search\"></span> $dict{preview}</button>"}
		];

		self.init = function() {
			getMediaList();
			$(document).ready(function() {
			});
		};

		self.setMediaType = function() {
			if (self.info.media_type_id === 1) {
				self.options = {
					aspect_ratios: [
						{aspect_ratio:	1, ratio_name: '1:1'},
						{aspect_ratio:	(4 / 3), ratio_name: '4:3'},
						{aspect_ratio:	(16 / 9), ratio_name: '16:9'}
					],
					aspect_ratio:		1,
					dialog_title:		'$dict{upload_image}',
					webservice:			'base/rc_fileupload/uploadImage',
					uploadAllowed:		true
				};
			} else if (self.info.media_type_id === 2) {
				self.options = {
					aspect_ratios: [
						{aspect_ratio:	1, ratio_name: '1:1'},
						{aspect_ratio:	(4 / 3), ratio_name: '4:3'},
						{aspect_ratio:	(16 / 9), ratio_name: '16:9'}
					],
					aspect_ratio:		1,
					dialog_title:		'$dict{upload_video}',
					webservice:			'base/rc_fileupload/uploadVideo',
					uploadAllowed:		true
				};
			} else if (self.info.media_type_id === 3) {
				self.options = {
					aspect_ratios: [
						{aspect_ratio:	1, ratio_name: '1:1'},
						{aspect_ratio:	(4 / 3), ratio_name: '4:3'},
						{aspect_ratio:	(16 / 9), ratio_name: '16:9'}
					],
					aspect_ratio:		1,
					dialog_title:		'$dict{upload_image}',
					webservice:			'base/rc_fileupload/uploadImage',
					uploadAllowed:		true
				};
			}
			self.imageSelectOptions.media_type_id = self.info.media_type_id;
			getMediaList();
		};

		// After a successful upload and cropping the directive will broadcast a
		// message back to us to let us know it's all done.
		$scope.$on("cropper1", function(event, data) {
			debug.log("Crop Data", data);
			getMediaList();
		});

		// Once an image is selected the directive will broadcast a message back
		// to us to let us know it's all done.
		$scope.$on("imageselect1", function(event, data) {
			debug.log("Image Selection", data);
			self.fileName = data.media_name;
		});

		self.mediaData = {
			rows:			[],
			columns:		self.columns,
			limit:			10,
			limits:			[10, 20, 50],
			group_by: {
				property:	false,
				template:	false
			}
		};

		function getMediaList() {
			mediaManager.getMediaByMediaType(self.info.media_type_id).then(function(mediaList) {
				self.mediaData.rows = mediaList;
				bootstrapEqualizer();
			});
		}

		self.previewMedia = function(mediaRow) {
			debug.log(mediaRow);
			self.previewFile = mediaRow.media_directory + mediaRow.media_name;
		};

		// Setup the initial display
		self.init();
	}

	$(document).ready(function() {
		setPageTitle("$dict{media_manager}", "menuMediaCore", "menuMediaManager");
	});

})(angular);

function bootstrapEqualizer() {

	$(".equalizer").each(function() {

		var heights = $(this).find(".watch").map(function() {
			return $(this).height();
		}).get(),

		minHeight = Math.max.apply(null, heights);

		$(".watch").css('min-height', minHeight);
	});
}
