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

Image Selection Directive
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcImageSelect", ["$uibModal", "MediaManager", rcImageSelect]);

	function setAttribute(attrs, key) {
		if (attrs[key]) {
			try {
				return JSON.parse(attrs[key]);
			} catch (e) {
				console.error(e);
			}
		}
		return null;
	}

	function rcImageSelect($uibModal, MediaManager) {

		return {

			restrict: "E",
			replace: true,
			templateUrl: '/_templates/base/rc-image-select',
			scope: {
				type:		"@",
				ngModel:	"="
			},

			link: function(scope, element, attrs, ctrl) {

				var mediaManager = new MediaManager();

				// Validate the required attributes have been set
				if (!("options" in attrs)) {
					scope.disabled = true;
					throw new Error("rcImageSelect cannot be used without the [options] attribute set.");
				}

				scope.selectImage = function() {

					var options = setAttribute(attrs, "options");
					var broadcastId = attrs.id;

					/* Open the image selection dialog */
					var modalInstance = $uibModal.open({
						windowClass:	"rc-dialog loading",
						backdrop:		false,
						controller:		imageSelectDialogController,
						templateUrl:	"/_templates/base/rc-image-select-dialog",
						size:			"lg",
						resolve: {
							mediaManager: function() {
								return mediaManager;
							},
							options: function() {
								return options;
							},
							broadcastId: function() {
								return broadcastId;
							}
						}
					});

					// When the user has selected an image it will be broadcast back to this
					// Directive and we can update the model.
					scope.$on(broadcastId, function(event, data) {
						scope.ngModel = data.media_directory + data.media_name;
					});

				};
			}
		};
	}

	function imageSelectDialogController($scope, $uibModalInstance, mediaManager, options, broadcastId) {

		$scope.options = options;
		$scope.selectedMedia = null;

		// Dialog Actions
		$scope.close = $uibModalInstance.close;

		var columns = [
			{name:"$dict{media_desc}", heading_class:"", class:"", property:"media_desc", template: false},
			{name:"$dict{media_width}", heading_class:"text-right", class:"text-right", property:"media_width", template: "{{row.media_width}}px"},
			{name:"$dict{media_height}", heading_class:"text-right", class:"text-right", property:"media_height", template: "{{row.media_height}}px"},
			{name:"$dict{media_size}", heading_class:"text-right", class:"text-right", property:"media_size", template: "{{row.media_size | rcBytes}}"},
			{name:"", heading_class:"", class:"", property:"", template: "<button ng-click=\"$parent.$parent.$parent.$parent.$parent.$parent.selectPreview(row)\"><span class=\"fa fa-search\"></span> $dict{preview}</button>"}
		];

		$scope.select = function() {

			// Update the parent scope model with the media description which is
			// the user readable part.
			$scope.$parent.ngModel = $scope.selectedMedia.media_desc;

			// Broadcast to the id of the directive to let it know that an image
			// has been selected and close the dialog.
			$scope.$parent.$broadcast(broadcastId, $scope.selectedMedia);
			$scope.close();

		};

		// Set the preview file value so that the image will be loaded
		$scope.selectPreview = function(media) {
			$scope.selectedMedia = media;
			$scope.previewFile = media.media_directory + media.media_name;
		};

		// Occurs when the user filters the media list
		$scope.$watch("searchText", function (value) {
			var regex = new RegExp( value, 'gi' );
			if ($scope.mediaList && value) {
				$scope.mediaData.rows = $scope.mediaList.filter(item => {return item.media_desc.match(regex)});
			}
		});

		// Initialization
		$scope.init = function() {
			console.log('$scope.$parent.ngModel', $scope);
			mediaManager.getMediaByMediaType($scope.options.media_type_id).then(function (mediaList) {
				$scope.mediaList = mediaList;
				$scope.mediaData = {
					rows:		mediaList,
					columns:	columns,
					limit:		$scope.options.limit || 5,
					limits:	$scope.options.limits || []
				};
			});
		};

		$scope.init();

	}

})(angular);
