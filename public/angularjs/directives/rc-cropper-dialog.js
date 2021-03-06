(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcCropperDialog", ["$uibModal", "rcWebservice", rcCropperDialog]);

	function setAttribute(attrs, key) {
		if (attrs[key]) {
			try {
				return JSON.parse(attrs[key]);
			} catch (e) {
				console.error(e);
			}
		} else {
			debug.log(key + " not found in attributes", attrs);
		}
		return null;
	}

	function rcCropperDialog($uibModal, rcWebservice) {

		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: "<button class='btn btn-cropper {{class}}' ng-disabled='ngDisabled || disabled' ng-click='open()'><ng-transclude/></button>",
			scope:{
				class:		"@",
				ngDisabled: "=rcDisabled",
				rcMediaKey: "="
			},
			link: function (scope, element, attrs, controller) {

				// Validate the required attributes have been set
				if (!("options" in attrs)) {
					scope.disabled = true;
					throw new Error("rcCropperDialog cannot be used without the [options] attribute set.");
				}
				if (!setAttribute(attrs, "options").webservice) {
					scope.disabled = true;
					throw new Error("rcCropperDialog cannot be used without the [webservice] attribute set.");
				}

				if (window.File && window.FileReader && window.FileList && window.Blob) {
					// Do something here if you want
					debug.log();
				} else {
					throw new Error('The File APIs are not fully supported in this browser.');
				}

				scope.open = function () {

					// Setup the supplied attributes and attach watchers to look for
					// changes in the directives attributes.
					var info = setAttribute(attrs, "info");
					var options = setAttribute(attrs, "options");
					var broadcastId = attrs.id;

					var instance = $uibModal.open({
						windowClass: "rc-dialog loading",
						backdrop: false,
						controller: cropperDialogController,
						templateUrl: "/_templates/base/rc-cropper-dialog",
						size: "lg",
						resolve: {
							rcWebservice: function() {
								return rcWebservice;
							},
							webservice: function() {
								return options.webservice;
							},
							info: function() {
								return info;
							},
							options: function() {
								return options;
							},
							broadcastId: function() {
								return broadcastId;
							}
						}
					});
				};
			}
		};
	}

	function cropperDialogController($scope, $uibModalInstance, rcWebservice, webservice, info, options, broadcastId) {

		$scope.images = [];

		var fileInput, directoryInput;

		$scope.close = $uibModalInstance.close;
		$scope.options = options;

		$uibModalInstance.rendered.then(function (response) {
			fileInput = document.getElementById('file');
			directoryInput = document.getElementById('directory');
			fileInput.addEventListener('change', handleFileSelect, false);
		});
		$scope.resetImage = function (image) {
			$scope.currentlyEditedImage = null;
			image.cropbox = null;
			image.data = ng.copy(image.original);
			$scope.editImage(image);
		};
		$scope.removeImage = function (index) {
			$scope.images.splice(index, 1);
			$scope.currentlyEditedImage = null;
		};
		$scope.currentlyEditedImage = null;
		$scope.editImage = function (image) {
			image.data = ng.copy(image.original);
			$scope.currentlyEditedImage = image;
		};

		var hasError = false;
		var saveResults = [];

		// Because the software needs to wait for the webservice call to finish
		// we call this function and then it calls itself recursively after each
		// web service call until all the images have been processed.
		$scope.save = function () {
			hasError = false;
			saveImage(0);
		};
		function saveImage(index) {

			var image = $scope.images[index];

			if (typeof image !== "undefined") {

				image.saving = true;
				image.success = false;
				image.error = false;

				rcWebservice.post(webservice, {image: image, info: info}).then(response => {

					image.saving = false;
					image.success = true;

					// If the image was saved successfully then we keep the results
					// of this webservice call to be passed back to the calling software
					// when the user closes the dialog.
					saveResults.push(response);

					// Now call ourself recursively until all images have been saved.
					saveImage(++index);

				}, function (reason) {
					hasError = true;
					image.saving = false;
					image.error = true;
					saveImage(++index);
				});

			} else {

				// At least one image failed to upload. --> keep the dialog open and remove successful uploads
				if (hasError) {
					//   dcDialog.error("There was an error while saving the images. You can try to upload them again");
					for (var i = $scope.images.length - 1; i >= 0; i--) {
						if ($scope.images[i].success) {
							$scope.images.splice(i, 1);
						}
					}
				} else {
					// Broadcast to the id of the directive to let it know that all
					// the selected images have now been processed successfully.
					$scope.$parent.$broadcast(broadcastId, saveResults);
					$scope.close();
				}
				setTimeout(function () {
				}, 2000);

			}

		}

		function handleFileSelect(event) {

			var files = event.target.files;
			var index = 0;
			if ($scope.images.length > 0) {
				index = $scope.images.length;
			}

			for (var i = 0, f; f = files[i]; i++) {

				//Only process image files
				if (!f.type.match("image.*")) {
					continue;
				}
				var reader = new FileReader();

				reader.onerror = function (evt) {
					switch (evt.target.error.code) {
						case evt.target.error.NOT_FOUND_ERR:
							alert('File Not Found!');
							break;
						case evt.target.error.NOT_READABLE_ERR:
							alert('File is not readable');
							break;
						case evt.target.error.ABORT_ERR:
							break; // noop
						default:
							alert('An error occurred reading this file.');
					}
				};

				var image = {
					name: null,
					size: null,
					lastModified: null,
					original: null,
					edit: null,
					data: null,
					cropBoxData: null,
					naturalWidth: null,
					naturalHeight: null,
					type: null,
					loading: true
				};

				$scope.images.push(image);
				$scope.$apply();

				reader.onload = (function (theFile) {
					return function (e) {
						var img = new Image();
						img.onload = function (event) {
							$scope.images[index].name = theFile.name;
							$scope.images[index].size = theFile.size;
							$scope.images[index].lastModified = theFile.lastModified;
							$scope.images[index].original = e.target.result;
							$scope.images[index].edit = null;
							$scope.images[index].data = ng.copy(e.target.result);
							$scope.images[index].cropBoxData = null;
							$scope.images[index].naturalWidth = null;
							$scope.images[index].naturalHeight = null;
							$scope.images[index].type = e.target.result.substring(5, 17).split(";")[0].split("/")[1];
							$scope.images[index].loading = true;
							$scope.images[index].naturalHeight = img.naturalHeight;
							$scope.images[index].naturalWidth = img.naturalWidth;
							$scope.images[index].loading = false;
							index++;
							$scope.$apply();
						};
						img.src = e.target.result;
					};
				})(f);

				reader.readAsDataURL(f);
			}
		}
	}
})(angular);
