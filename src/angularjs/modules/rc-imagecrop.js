var settings;
var imageUploadIntervalId;

(function (ng) {
	"use strict";
	ng.module("ngInput.multipleImage", [])
		//<editor-fold defaultstate="collapsed" desc="rcImagesController">
		.controller("rcImagesController", ["$scope", "$rootScope", "$dialog", "$ws", function ($scope, $rootScope, $dialog, $ws) {
				var selectedImageFile, imgCropper, cropperCanvas, $image;

				//<editor-fold defaultstate="collapsed" desc="Manage communication with the parent scope">
				$rootScope.$on("open-upload-images", function (event, message) {
					$scope.show = true;
					$scope.containsNotAllowedImages = false;
					// Remove and insert the file/folder inputs to clear them:
					$scope.initInputs();
					settings = message;

					cropperCanvas = $("#cropperCanvas");
					$image = $("#cropperCanvas > img").attr("src", '');
					imgCropper = $image.cropper({
						aspectRatio: settings.aspect_ratio ? settings.aspect_ratio : 16 / 9,
						modal: true,
						autoCropArea: 1,
						done: debounce(function () {
							$scope.saveImage();
							autoSaveFeedback();
							$scope.$apply();
						}, 600),
						dragstart: function () {
							$scope.showAutoSaved = false;
							$scope.$apply();
						}
					});
				});
				$scope.$watch("show", function (value) {
					if (!value) {
						imgCropper.cropper("destroy");
					}
				});
				//</editor-fold>

				$scope.isAllowedImage = function (image) {
					var height_accepted = true, width_accepted = true;
					if (typeof settings.min_height !== "undefined")
						height_accepted = image.height >= settings.min_height;
					if (typeof settings.min_width !== "undefined")
						width_accepted = image.width >= settings.min_width;
					var ret = height_accepted && width_accepted;
					if (!ret)
						$scope.containsNotAllowedImages = true;
					return ret;
				};
				$scope.removeSelected = function () {
					// Reverse loop through the files array, and remove selected files
					for (var i = $scope.files.length - 1; i >= 0; i--) {
						if ($scope.files[i].selected) {
							if ($scope.files[i].name === selectedImageFile.name) {
								selectedImageFile = undefined;
								imgCropper.cropper();
							}
							$scope.files.splice(i, 1);
						}
					}
				};
				$scope.revertSelected = function () {
					for (var i = 0; i < $scope.files.length; i++) {
						if ($scope.files[i].selected) {
							$scope.files[i].data = angular.copy($scope.files[i].original_data);
							$scope.files[i].modified = false;
							$scope.files[i].size = Math.round((($scope.files[i].data.length / 4) * 3) / 1024);
							if ($scope.files[i].name === selectedImageFile.name) {
								// If the currently selected image is loaded into the cropper, then we have to update the cropper with the reverted image.
								$scope.editImage($scope.files[i]);
							}
						}
					}
				};

				function autoSaveFeedback() {
					$scope.showAutoSaved = true;
				}

				$scope.editImage = function (file) {
					try {
					debug.log(selectedImageFile, selectedImageFile.name, file.name);} catch(e){}
					if (typeof selectedImageFile === "undefined" || selectedImageFile.name !== file.name) {
						selectedImageFile = file;
						imgCropper.cropper("replace", file.data);
					}
				};
				//<editor-fold defaultstate="collapsed" desc="Uploading images">
				var index = 0;
				var uploadIndices;
				var containsError;
				
				$scope.uploadImages = function () {
					$scope.uploading = true;
					containsError = false;
					uploadIndices = [];
					index = 0;
					for (var i = 0; i < $scope.files.length; i++) {
						if (($scope.files[i].state === "ready" && $scope.files[i].allowed && $scope.files[i].modified) || $scope.files[i].state === "error") {
							$scope.files[i].state = 'uploading';
							uploadIndices.push(i);
						}
					}
					if (index < uploadIndices.length) {
						if ($scope.files[uploadIndices[index]].state === "uploading")
							uploadSingeImage();
					} else {
						$scope.uploading = false;
					}
				};

				function uploadSingeImage() {
					var file = $scope.files[uploadIndices[index]];
					$ws.post(settings.webservice, {entry: {base64: file.data, key: settings.key, image_type: settings.image_type}}, function (wsResponse) {
						$scope.files[uploadIndices[index]].state = 'success';
						index++;
						if (index < uploadIndices.length) { // Success 
							setTimeout(function () {
								uploadSingeImage();
							}, 400);
						} else {
							uploadFinished();
						}

					}, function (wsResponse) { // Error
						containsError = true;
						$scope.files[uploadIndices[index]].state = 'error';
						index++;
						if (index < uploadIndices.length) {
							setTimeout(function () {
								uploadSingeImage();
							}, 400);
						} else {
							uploadFinished();
						}

					});
				}

				function uploadFinished() {
					$scope.uploading = false;
					if (containsError) {
						$dialog.confirm("<rc:dict key='file_upload_error'/>", function (dialogResult) {
							if (dialogResult === "confirmBtnRetry") {
								$scope.uploadImages();
							}
							else if (dialogResult === "confirmBtnOk") {
								$scope.closeDialog();
								$scope.$apply();
							}
						}, [btn.Cancel, btn.Retry, btn.Ok]);
					} else {
						$scope.closeDialog();
						setTimeout(function () {
							$rootScope.$broadcast("image-upload-finished", settings);
						}, 800);

					}
				}
				//</editor-fold>

				//<editor-fold defaultstate="collapsed" desc="Close the dialog (reset lists, destroy cropper)">
				$scope.closeDialog = function () {
					$("#cropperCanvas > img").attr("src", "");
					//		imgCropper.cropper("destroy");
					$scope.files = [];
					$scope.show = false;
				};
				//</editor-fold>

				$scope.saveImage = function () {
					var base64 = imgCropper.cropper("getDataURL", "image/jpg", 1);
					selectedImageFile.data = base64;
					selectedImageFile.size = Math.round(((base64.length / 4) * 3) / 1024);
					selectedImageFile.modified = true;
					debug.log(selectedImageFile);
				};
				//<editor-fold defaultstate="collapsed" desc="Handle cropper actions">
				$(document).on("click", "[data-method]", function () {
					var data = $(this).data();
					if (data.method) {
						imgCropper.cropper(data.method, data.option);
					}
				});
				//</editor-fold>
			}])
		//</editor-fold>
		//<editor-fold defaultstate="collapsed" desc="rcImages Directive">
		.directive("rcImages", ["$parse", function ($parse) {
				return {
					restrict: 'A', // Restrict the directive to work only as an element or attribute.
					// <rc:dropdown ws="..." key="..." name="" ng-model="model"></rc:dropdown
					controller: "rcImagesController",
					scope: true,
					link: function (scope, element, attrs) {
						scope.show = false;
						scope.filesAreLoading = false;
						//<editor-fold defaultstate="collapsed" desc="Error handler function for file reader">
						function errorHandler(evt) {
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
						}
						//</editor-fold>

						var fileInput = document.getElementById("multipleImageUploadEditModalFileInput");
						var folderInput = document.getElementById("multipleImageUploadEditModalFolderInput");
						scope.files = [];

						function handleFileSelect(evt) {
							var count = 0;
							//scope.filesAreLoading = true;
							var files = evt.target.files; // FileList object

							for (var i = 0, f; f = files[i]; i++) {
								if (f.type.match('image.*')) { // only process image files
									count++;
									var reader = new FileReader();
									reader.onerror = errorHandler;
									reader.onload = (function (theFile) {
										return function (e) {
											var img = new Image;
											img.onload = function () {
												scope.files.push({
													name: theFile.name, size: Math.round(theFile.size / 1024, 3),
													original_data: e.target.result,
													data: e.target.result,
													state: 'ready',
													width: img.width,
													height: img.height,
													allowed: scope.isAllowedImage(img)
												});
												scope.$apply();
												if (count === 1) {
													setTimeout(function () {
														if (scope.files.length === 1) {
															scope.editImage(scope.files[0]);
														}
													}, 600);
												}
											};
											img.src = e.target.result;
											// Push the file into the files array for display
										};
									})(f);
									// Read in the image file as a data URL (Base64).
									reader.readAsDataURL(f);
								}
							}
//							scope.$watch("show", function (value) {
//								debug.log("show", value, imageUploadIntervalId);
//								if (value) {
//									imageUploadIntervalId = setInterval(function () {
//										debug.log(imageUploadIntervalId);
//										if (scope.files.length === 1) {
//											debug.log("interval", scope.files);
//											scope.editImage(scope.files[0]);
//											clearInterval(imageUploadIntervalId);
//										}
//									}, 600);
//								} else {
//									clearInterval(imageUploadIntervalId);
//								}
//							});
							scope.initInputs();
						}
						scope.initInputs = function () {
							//<editor-fold defaultstate="collapsed" desc="jQuery object for inserting the file inputs">
							// To clear an input[type=file] unfortunately we have to remove it, and insert it again
							var $fileInput = $('<label class="btn btn-default" for="multipleImageUploadEditModalFileInput" title="Upload image file"><input class="hide" id="multipleImageUploadEditModalFileInput" name="file" type="file" multiple accept="image/*"><span class="docs-tooltip" data-toggle="tooltip" title="" data-original-title="Import image with FileReader"><i class="fa fa-file-o"></i><i class="fa fa-plus"></i></span></label>');
							var $folderInput = $('<label class="btn btn-default" for="multipleImageUploadEditModalFolderInput" title="Upload image file"><input class="hide" id="multipleImageUploadEditModalFolderInput" name="file" type="file" webkitdirectory directory multiple><span class="docs-tooltip" data-toggle="tooltip" title="" data-original-title="Import image with FileReader"><i class="fa fa-folder-open-o"></i><i class="fa fa-plus"></i></span></label>');
							//</editor-fold>
							$("#fileInputPlaceholder").empty().append($fileInput, $folderInput);
							$fileInput.on("change", handleFileSelect);
							$folderInput.on("change", handleFileSelect);
						};


					}
				};
			}]);
//</editor-fold>

})(angular);
