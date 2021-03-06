(function (ng) {

	"use strict";

	ng.module("rc.directives").directive("rcCropper", ["$timeout", rcCropper]);

	function rcCropper($timeout) {

		return {
			restrict:				"E",
			templateUrl:			"/_templates/base/rc-cropper",
			replace:				true,
			scope: {
				ngModel:			"=",
				aspectRatio:		"=",
				cropperControls:	"=",
				cropBoxData:		"=",
				autoCrop:			"=",
				busy:				"="
			},
			link: function (scope, element, attrs, controller) {

				var image = document.querySelector('.img-container > img');
				var local_change = false, local_change_cropbox = false;
				var aspect_ratio;

				if (scope.aspectRatio) {
					try {
						aspect_ratio = parseFloat(scope.aspectRatio);
					} catch (e) {
						aspect_ratio = 1;
					}
				} else {
					aspect_ratio = 1;
				}

				var options = {
					aspectRatio:	aspect_ratio,
					zoomable:		false,
					build: function () {
						//debug.log('build');
					},
					built: function () {
						debug.log('built');
						if (scope.autoCrop) {
							debug.log('crop data', scope.cropBoxData);
							if (scope.cropBoxData) {
								cropper.setCropBoxData(scope.cropBoxData);
							}
							local_change = true;
							local_change_cropbox = true;
							scope.ngModel = cropper.getCroppedCanvas().toDataURL();
							scope.cropBoxData = cropper.getCropBoxData();
						}
						scope.$apply();
					},
					cropstart: function (data) {
						//debug.log('cropstart', data.action);
					},
					cropmove: function (data) {
						//debug.log('cropmove', data.action);
					},
					cropend: function (data) {
						debug.log("cropend");
						local_change = true;
						local_change_cropbox = true;
						$timeout(function () {
							scope.ngModel = cropper.getCroppedCanvas().toDataURL();
							scope.busy = false;
						});
						scope.cropBoxData = cropper.getCropBoxData();
						scope.busy = true;
						scope.$apply();
					},
					crop: function (data) {
						debug.log('crop');
					},
					zoom: function (data) {
						//debug.log('zoom', data.ratio);
					}
				};

				function isDataURL(s) {
					return isDataURL.regex.test(s);
				}

				isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
				var cropper;
				scope.cropperControls = {
					rotate: function (deg) {
						cropper.rotate(deg);
					},
					flip: function (direction) {
						if (direction > 0) {
							cropper.scale(cropper.getData().scaleX * -1, cropper.getData().scaleY);
						} else {
							cropper.scale(cropper.getData().scaleX, cropper.getData().scaleY * -1);
						}
					}
				};
				scope.$watch("cropBoxData", function (val) {
					if (!local_change_cropbox) {
						if (scope.cropBoxdata) {
							cropper.setCropBoxData(scope.cropBoxData);
						}
					}
				});
				scope.$watch("aspectRatio", function (val) {
console.log('aspectRatio changed', val);
					if (val) {
						try {
							options.aspect_ratio = parseFloat(val);
						} catch (e) {
							options.aspect_ratio = 1;
						}
					} else {
						options.aspect_ratio = 1;
					}
					if (cropper) {
						cropper.setAspectRatio(options.aspect_ratio);
					}

				});
				scope.$watch("ngModel", function (val) {
					if (!local_change) {
						scope.error = false;
						if (scope.ngModel) {
							scope.loading = true;
							scope.noimg = false;
							if (isDataURL(scope.ngModel)) {
								image.setAttribute("src", scope.ngModel);
								image.onload = function () {
									cropper ? cropper.destroy() : null;
									scope.loading = false;
									scope.$apply();
									cropper = new Cropper(image, options);
								};
							} else {
								scope.loading = false;
								scope.error = true;
								console.warn("Model is not a data uri.");
							}
						} else {
							// No image set
							scope.noimg = true;
						}
					}
					local_change = false;
				});
			}
		};
	}
})(angular);
