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

 Lightbox pop-up display with embedded image gallery. All controlled through the options.
*/

(function (ng) {

    "use strict";

    ng.module("rc.directives").directive("rcLightbox", ["$document", rcLightbox]);

    function rcLightbox($document) {

    	var keys_codes = {
    		enter : 13,
    		esc   : 27,
    		left  : 37,
    		right : 39
    	};

        return {
            restrict:		"E",
            template:		'<div class="ng-overlay" ng-show="opened"></div>' +
                            '<div class="ng-gallery-content" ng-click="closeLightbox()" ng-show="opened">' +
                            '   <div class="uil-ring-css" ng-show="loading"><div></div></div>' +
                            '   <a class="close-popup" ng-click="closeLightbox()"><i class="fa fa-close"></i></a>' +
                            '   <a ng-if="options.hasPrev" class="nav-left" ng-click="prevImage(); $event.stopPropagation()"><i class="fa fa-angle-left"></i></a>' +
                            '   <img ng-src="{{image.src}}" ng-show="!loading" ng-click="imageClicked(); $event.stopPropagation()" class="effect" />' +
                            '   <a ng-if="options.hasNext" class="nav-right" ng-click="nextImage(); $event.stopPropagation()"><i class="fa fa-angle-right"></i></a>' +
                            '   <span ng-if="options.hasInfo" class="info-text">{{ index + 1 }}/{{ images.length }} - {{ description }}</span>' +
                            '   <div ng-if="options.hasThumbnails" class="ng-thumbnails-wrapper">' +
                            '       <div class="ng-thumbnails slide-left">' +
                            '           <div ng-repeat="i in images">' +
                            '               <img ng-src="{{ i.thumb }}" ng-class="{\'active\': index === $index}" ng-click="changeImage($index); $event.stopPropagation();" />' +
                            '           </div>' +
                            '       </div>' +
                            '   </div>' +
                            '</div>',
            scope: {
				opened:	    "=",
				options:	"=",
                images:	    "="
            },

            link: function (scope, element, attrs, controller) {

                var imageIndex = 0;
                var $body = $document.find('body');

                debug.log('Directive initialized');
                debug.log('Directive images', scope.images);
                debug.log('Directive options', scope.options);

                scope.closeLightbox = function() {
                    debug.log('Lightbox Closing');
                    scope.opened = false;
                }
                scope.imageClicked = function() {
                    if (scope.options.hasNext || scope.options.hasPrev) {
                        nextImage();
                    } else {
                        scope.opened = false;
                    }
                }
                scope.nextImage = function() {
                    debug.log('Next Image');
                    imageIndex++;
                    scope.selectImage();
                }
                scope.prevImage = function() {
                    debug.log('Previous Image');
                    imageIndex--;
                    scope.selectImage();
                }
                scope.changeImage = function(newIndex) {
                    debug.log('Direct selection', newIndex);
                    imageIndex = newIndex;
                    scope.selectImage();
                }
                scope.selectImage = function() {
                    if (scope.images) {
                        if (imageIndex >= scope.images.length || imageIndex < 0) {
                            imageIndex = 0;
                        }
                        scope.image = scope.images[imageIndex];
                        debug.log("Image selected", scope.image);
                    }
                }

                scope.$watch("images", function (val) {
                    scope.images = val;
                });
                scope.$watch("options", function (val) {
                    scope.options = val;
                });
                scope.$watch("opened", function (val) {
                    if (val) {
                        scope.selectImage();
                    }
                });

    			$body.bind('keydown', function(event) {
    				if (!scope.opened) {
    					return;
    				}
    				var which = event.which;
    				if (which === keys_codes.esc) {
    					scope.closeLightbox();
    				} else if (which === keys_codes.right || which === keys_codes.enter) {
    					scope.nextImage();
    				} else if (which === keys_codes.left) {
    					scope.prevImage();
    				}

    				scope.$apply();
    			});

                scope.selectImage();
            }
        };
    }
})(angular);
