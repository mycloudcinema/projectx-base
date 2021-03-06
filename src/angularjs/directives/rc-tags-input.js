/**
 * Created by Forisz on 14/09/15.
 */
(function (ng) {
    "use strict";
    ng.module("rc.directives").directive("rcTags", ["$parse", "rcWebservice", rcTagsDirective]);
    function rcTagsDirective($parse, rcWebservice) {
        return {
            restrict: 'EA',
			require: 'ngModel',
            //controller: 'tagsController',
            templateUrl: '/_templates/base/rc-tags-input',
            replace: true,
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs, controller) {
                var elements = element[0].childNodes;
                var input;
                scope.label = attrs.label;
                scope.value = attrs.value;
                scope.selected_item = "";
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].nodeName === "INPUT") {
                        input = $(elements[i]);
                    }
                }
                $(element).click(function (event) {
                    input.show(0);
                    input.focus();
                    $(element).addClass("focus");
                    event.stopPropagation();
                });
                $('html').click(function () {
                    $(element).removeClass("focus");
                    input.hide(0);
                    scope.$apply(scope.deleteIndex = -1);
                });
                rcWebservice.get(attrs.webservice).then(function (response) {
                    scope.typeahead_options = response.data;
                    // Initiate the existing tabs
                    if (scope.ngModel) {
                        if (typeof scope.ngModel === "string") {
                            local_change = true;
                            scope.ngModel = JSON.parse(scope.ngModel);
                        }
                        for (var i = 0; i < scope.ngModel.length; i++) {
                            for (var j = 0; j < scope.typeahead_options.length; j++) {
                                if (scope.ngModel[i] === scope.typeahead_options[j][attrs.value]) {
                                    scope.tags.push(scope.typeahead_options[j]);
                                }
                            }
                        }
                    }
                });
                scope.onSelect = function ($item) {
                    var duplicate_found = false;
                    for (var i = 0; i < scope.tags.length; i++) {
                        if (scope.tags[i][attrs.value] === $item[attrs.value]) {
                            scope.containsIndex = i;
                            duplicate_found = true;
                            break;
                        }
                    }
                    if (!duplicate_found) {
                        scope.tags.push($item);
                        scope.selected_item = "";
                        onTagsChange();
                    }
                };
                scope.tags = [];
                var local_change = false;
                function onTagsChange() {
                    local_change = true;
                    var tmp = [];
                    for (var i = 0; i < scope.tags.length; i++) {
                        tmp.push(scope.tags[i][attrs.value]);
                    }
                    scope.ngModel = tmp;
                }
                scope.removeTag = function (index) {
                    scope.tags.splice(index, 1);
                    onTagsChange();
                };

                scope.$watch("ngModel", function(newVal, oldVal) {
                    if (!local_change) {
						scope.tags = [];
						if (scope.ngModel && scope.typeahead_options) {
							for (var i = 0; i < scope.ngModel.length; i++) {
								var item = scope.ngModel[i];
								for (var j = 0; j < scope.typeahead_options.length; j++) {
									var option = scope.typeahead_options[j];
									if (option[attrs.value] === item) {
										scope.tags.push(option);
										break;
									}
								}
							}
						}
					}
                    local_change = false;
                });

                scope.deleteIndex = -1;
                scope.handleKeypress = function ($event) {
                    var keycode = $event.keyCode;
                    switch (keycode) {
                        case 8: // BACKSPACE
                            // Handle deleting tags from the list.
                            if (typeof scope.selected_item === "string") {
                                if (scope.selected_item.length === 0) {
                                    if (scope.deleteIndex === -1) {
                                        scope.deleteIndex = scope.tags.length - 1;
                                    } else {
                                        scope.removeTag(scope.deleteIndex);
                                        scope.deleteIndex = -1;
                                    }
                                }
                            }
                            scope.containsIndex = -1;
                            break;
                        case 9: // TAB
                            // Disable highlight when tabbed out of the input
                            scope.deleteIndex = -1;
                            element.removeClass("focus");
                            break;
                        case 13: // ENTER
                            $event.preventDefault();
                            break;
                        default:
                            // Reset the delete index to remove highlight of the last item
                            scope.deleteIndex = -1;
                            scope.containsIndex = -1;
                            break;
                    }
                };

            }
        };
    }
})(angular);
