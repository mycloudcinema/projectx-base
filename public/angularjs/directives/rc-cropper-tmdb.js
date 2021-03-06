(function (ng) {

    "use strict";

    ng.module("rc.directives").directive("rcCropperTmdb", ["$uibModal", "rcWebservice", rcCropperTmdb]);

	function getAttribute(attrs, key) {
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

    function rcCropperTmdb($uibModal, rcWebservice) {

		return {
            restrict: "E",
            transclude: true,
            replace: true,
            template: "<button class='btn {{class}}' ng-disabled='ngDisabled || disabled' ng-click='open()'><ng-transclude/></button>",
			scope:{
                class:		"@",
                ngDisabled: "=rcDisabled",
				rcMediaKey: "="
            },
            link: function (scope, element, attrs, controller) {

				// Validate the required attributes have been set
                if (!("options" in attrs)) {
                    scope.disabled = true;
                    throw new Error("rcCropperTmdb cannot be used without the [options] attribute set.");
                }
                if (!getAttribute(attrs, "options").webservice) {
                    scope.disabled = true;
                    throw new Error("rcCropperTmdb cannot be used without the [webservice] attribute set.");
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
					var info = getAttribute(attrs, "info");
					var options = getAttribute(attrs, "options");
					var broadcastId = attrs.id;
					var data = getAttribute(attrs, "data");

                    var instance = $uibModal.open({
                        windowClass: "rc-dialog loading",
                        backdrop: false,
                        controller: cropperTmdbController,
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
							},
							data: function() {
								return data;
							}
                        }
                    });
                };
            }
        };
    }

    function cropperTmdbController($scope, $uibModalInstance, rcWebservice, webservice, info, options, broadcastId, data) {

        // $scope.images = [];

        var fileInput, directoryInput;

		$scope.options = options;
		$scope.info = info;
		$scope.data = data;

        $scope.loading = true;

        $scope.close = $uibModalInstance.close;
        $uibModalInstance.rendered.then(function (response) {
			handleFileSelect();
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
            $scope.saving = true;
            saveImage(0);
        };
        function saveImage(index) {

            var image = $scope.images[index];

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

        function handleFileSelect() {

            $scope.images = [];
            $scope.loading = true;

            var index = 0;
            var remainingCount = 0;

            for (var i = 0; i < data.length; i++) {

                var f = data[i];

                if (f.selected) {

                    remainingCount++;

                    var image = {
                        name:           null,
                        original:       null,
                        edit:           null,
                        data:           null,
                        cropBoxData:    null,
                        naturalWidth:   null,
                        naturalHeight:  null,
                        type:           null,
                        loading:        true
                    };

                    $scope.images.push(image);

    				var posterImage = new Image();
    				posterImage.crossOrigin = 'anonymous';
                    posterImage.setAttribute("data-index", i);

                    posterImage.onload = function() {

                        var sourcePoster = data[this.getAttribute("data-index")];

                        var canvas = document.getElementById("transferCanvas");
                        var canvasContext = canvas.getContext("2d");

                        // Resize the Canvas context to allow the image to be loaded;
                        canvasContext.canvas.height = sourcePoster.height;
                        canvasContext.canvas.width = sourcePoster.width;

                        canvasContext.drawImage(this, 0, 0);

        				$scope.images[index].name = sourcePoster.file_path;
        				$scope.images[index].original = canvas.toDataURL();
        				$scope.images[index].edit = null;
        				$scope.images[index].data = ng.copy(canvas.toDataURL());
        				$scope.images[index].cropBoxData = null;
        				$scope.images[index].type = 'jpg';
        				$scope.images[index].loading = true;
        				$scope.images[index].naturalHeight = sourcePoster.height;
        				$scope.images[index].naturalWidth = sourcePoster.width;
        				$scope.images[index].loading = false;

                        index++;
                        remainingCount--;
                        if (remainingCount === 0) {
                            $scope.loading = false;
                        }
                        $scope.$apply();
                    }
                    posterImage.onerror = function() {
                        $scope.images[index].error = true;
                        $scope.images[index].loading = false;
                        index++;
                        remainingCount--;
                        if (remainingCount === 0) {
                            $scope.loading = false;
                        }
                        $scope.$apply();
                    };
    				posterImage.src = f.original_src;
                }
            }
        }
    }
})(angular);
