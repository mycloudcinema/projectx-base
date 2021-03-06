(function (ng) {

    "use strict";

    ng.module("rc.directives").directive("rcCropperMini", ["$uibModal", "rcWebservice", rcCropperMini]);

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

    function rcCropperMini($uibModal, rcWebservice) {

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
                    throw new Error("rcCropperMini cannot be used without the [options] attribute set.");
                }
                if (!setAttribute(attrs, "options").webservice) {
                    scope.disabled = true;
                    throw new Error("rcCropperMini cannot be used without the [webservice] attribute set.");
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
                        windowClass:	"rc-dialog loading",
                        backdrop:		false,
                        controller:		cropperMiniController,
                        templateUrl:	"/_templates/base/rc-cropper-mini",
                        size:			"lg",
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

    function cropperMiniController($scope, $uibModalInstance, rcWebservice, webservice, info, options, broadcastId) {

        $scope.images = [];

        var fileInput;

        $scope.close = $uibModalInstance.close;
		$scope.options = options;
        $scope.saving = false;

        $uibModalInstance.rendered.then(function (response) {
            fileInput = document.getElementById('file');
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
		var saveResults = null;

		// Because the software needs to wait for the webservice call to finish
		// we call this function and then it calls itself recursively after each
		// web service call until all the images have been processed.
        $scope.save = function () {
            hasError = false;
            $scope.saving = true;
            saveImage();
            $scope.saving = false;
        };
        function saveImage() {

            var image = $scope.image;

            if (typeof image !== "undefined") {

                image.saving = true;
                image.success = false;
                image.error = false;

                rcWebservice.post(webservice, {
                    image: image,
                    info: info
                }).then(function (response) {

                    image.saving = false;
                    image.success = true;

					// If the image was saved successfully then we keep the results
					// of this webservice call to be passed back to the calling software
					// when the user closes the dialog.
					debug.log('Directive', response);
					$scope.$parent.$broadcast(broadcastId, response);
					$scope.close();

				}, function (reason) {
					image.saving = false;
					image.error = true;
                });
            }
        }

        function handleFileSelect(event) {

            var files = event.target.files;
			var index = 0;
			var f = files[index];

			//Only process image files
			if (f.type.match("image.*")) {

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

                $scope.image = {
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

                $scope.$apply();

                reader.onload = (function (theFile) {
                    return function (e) {
                        var img = new Image();
                        img.onload = function (event) {
                            $scope.image.name = theFile.name;
                            $scope.image.size = theFile.size;
                            $scope.image.lastModified = theFile.lastModified;
                            $scope.image.original = e.target.result;
                            $scope.image.edit = null;
                            $scope.image.data = ng.copy(e.target.result);
                            $scope.image.cropBoxData = null;
                            $scope.image.type = e.target.result.substring(5, 17).split(";")[0].split("/")[1];
                            $scope.image.loading = true;
                            $scope.image.naturalHeight = img.naturalHeight;
                            $scope.image.naturalWidth = img.naturalWidth;
                            $scope.image.loading = false;
                            index++;
                            $scope.$apply();
                        };
                        img.src = e.target.result;
                    };
                })(f);

                reader.readAsDataURL(f);
			}
			$scope.editImage($scope.image);
        }
    }
})(angular);
