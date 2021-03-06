function Key(data) {

	if (typeof data === "object") {

		if (typeof data.char === "number") {
			this.char = data.char;
		} else {
			this.char = data.char;
			this.shift_char = data.char.toUpperCase();
			this.shift_char = data.shift_char;
			this.alt_char = data.alt_char;
			this.shift_alt_char = data.shift_alt_char;
		}
		this.modifier = false;

	} else if (typeof data === "string") {
		this.modifier = true; // Set the modifier property to true.
		switch (data) {
			case "backspace":
				this.char = "backspace"
				this.keyClass = "backspace"
				this.template = "<i class='fa fa-long-arrow-left'></i>"
				break;
			case "shift":
				this.char = "shift"
				this.keyClass = "shift"
				this.template = "<i class='fa fa-arrow-up'></i>"
				break;
			case "enter":
				this.char = "enter"
				this.keyClass = "enter"
				break;
			case "alt":
				this.char = "alt"
				this.keyClass = "alt"
				break;
			case "space":
				this.char = "space"
				this.keyClass = "spacebar"
				break;
		}
	}
}

Key.prototype.getCharacter = function (shift, alt) {
	if (this.modifier) {
		return this.char;
	}

	if (shift && alt) {
		return this.shift_alt_char;
	}
	if (shift) {
		return this.shift_char;
	}
	if (alt) {
		return this.alt_char;
	}
	return this.char;
}

function setCursor(node, pos) {

    var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

    if (!node) {
        return false;
    } else if (node.createTextRange) {
        var textRange = node.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
        return true;
    } else if (node.setSelectionRange) {
        node.setSelectionRange(pos, pos);
        return true;
    }

    return false;
}

(function (ng) {
	"use strict";
	ng.module("rc.keybr", []);
})(angular);

(function (ng) {

	"use strict";

	ng.module("rc.keybr").directive("rcKeybr", ["$compile", "$rootScope", directive])

	function directive($compile, $rootScope) {

		return {

			restrict: "A", // Only work as an attribute
			require: "^ngModel", // In order to work the directive requires the ngModelController to be present

			link: function (scope, parentElement, attrs, ctrl) {

				var keyboard, open = false;

				var element = parentElement.find("input");
				debug.log("rcKeyboard", element)

				element.bind("click", function (event) {
					event.stopPropagation(); // TODO: Check if this code is needed or not
				})

				// Open the keyboard when the input field focused
				element.bind('focus', function () {

					var layout;

					if (typeof attrs.layout === "string") {
						layout = attrs.layout.toUpperCase();
					} else if (attrs.type === "number") {
						layout = "NUMERIC";
					} else {
						layout = "CS"
					}
					// Create and $compile the keyboard element
					keyboard = $compile("<rc-keybr-dropdown rc-id='" + attrs.id + "' ng-model='rcKeyboardModel' layout='" + layout + "'></rc-keybr-dropdown>")(scope);

					var tmp = document.getElementsByTagName("rc-keybr-dropdown");
					for (var index = tmp.length - 1; index >= 0; index--) {
						tmp[index].parentNode.removeChild(tmp[index]);
					}

					// Insert the keyboard element after the input element
					element.after(keyboard);
					open = true;
					// Attach event listeners to the keyboard. Since they are removed every time the keyboard closes.
					openKeyboard();
				});

				function openKeyboard() {

					/**
					 * If the user clicks on the keyboard but not on a clickable key, then we have to capture that event
					 * So the input field won't lose its focus and the keyboard stays open.
					 */
					keyboard.bind("click", function (event) {
						event.stopPropagation();
						debug.log("keyboard click");
					})

					angular.element(document).bind("click", function () {
						debug.log("document click");
						keyboard.remove();
						open = false;
					});

					element.bind('blur', function () {
						return false;
						element[0].focus();
						setCursor(element[0], element[0].value.length);
					})
				}
				// Watch the keyboards model for changes

				var decimalPoint = false;
				var zeros = [];

				$rootScope.$on("rcKeyboardKeypress", function (event, message) {

					var val = message.value;
					debug.log(message);

					if (message.id === attrs.id) {

						if (typeof val === "number" || typeof val === "string") {

							if (attrs.type === "number") {

								if (val === "backspace" || val === "bksp") {

                           var modelValue = ctrl.$modelValue.toString().slice(0, -1);
                           var floatValue = parseFloat(modelValue);
                           if (isNaN(floatValue)) {
                              floatValue = "";
                           }
                           ctrl.$setViewValue(floatValue);

								// } else if (val === 0) {
									// zeros.push(0);
									// return;
								} else if (val === ".") {
									decimalPoint = true;
									return;
								} else {
									// Value is a number
									if (!ctrl.$modelValue)
										ctrl.$modelValue = "";
									if (decimalPoint) {
										ctrl.$setViewValue(
											parseFloat(
												ctrl.$modelValue.toString() + "." + zeros.join("") + val.toString()
												)
											);
										decimalPoint = false;
									} else {
										ctrl.$setViewValue(
											parseFloat(
												ctrl.$modelValue.toString() + zeros.join("") + val.toString()
											)
										);
									}
									zeros = [];
								}
							} else {
								if (val === "backspace" || val === "bksp") {
									ctrl.$setViewValue(ctrl.$modelValue.toString().slice(0, -1));
								} else if (val === "del") {

								} else if (val === "enter") {
									keyboard.remove();

								} else if (val === "space") {
									ctrl.$setViewValue(ctrl.$modelValue + " ");
								} else {
									ctrl.$modelValue = ctrl.$modelValue ? ctrl.$modelValue : "";
									ctrl.$setViewValue(ctrl.$modelValue + val);
								}
							}
							ctrl.$render();
						}
					}
				});
			}
		}
	}
})(angular);

(function (ng) {

	"use strict";

	ng.module("rc.keybr").constant("KEYBOARD_LAYOUTS", {

		"NUMERIC": [
			[
				new Key({ char: 7 }),
				new Key({ char: 8 }),
				new Key({ char: 9 })
			],
			[
				new Key({ char: 4 }),
				new Key({ char: 5 }),
				new Key({ char: 6 })
			],
			[
				new Key({ char: 1 }),
				new Key({ char: 2 }),
				new Key({ char: 3 })
			],
			[
				new Key({ char: 0 }),
				new Key({ char: "." }),
				new Key({ char: "bksp" })
			]
		],
		"EN": [
			[
				new Key({ char: "\u00A7", shift_char: "\u00B1", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// §
				new Key({ char: "1", shift_char: "!", alt_char: "\u00A1", shift_alt_char: "\u2044" }),				// 1
				new Key({ char: "2", shift_char: "@", alt_char: "\u2122", shift_alt_char: "\u20AC" }),				// 2
				new Key({ char: "3", shift_char: "#", alt_char: "\u00A3", shift_alt_char: "\u2039" }),				// 3
				new Key({ char: "4", shift_char: "$", alt_char: "\u00A2", shift_alt_char: "\u203A" }),				// 4
				new Key({ char: "5", shift_char: "%", alt_char: "\u221E", shift_alt_char: "\uFB01" }),				// 5
				new Key({ char: "6", shift_char: "^", alt_char: "\u00A7", shift_alt_char: "\uFB02" }),				// 6
				new Key({ char: "7", shift_char: "&", alt_char: "\u00B6", shift_alt_char: "\u2021" }),				// 7
				new Key({ char: "8", shift_char: "*", alt_char: "\u2022", shift_alt_char: "\u00B0" }),				// 8
				new Key({ char: "9", shift_char: "(", alt_char: "\u00AA", shift_alt_char: "\u00B7" }),				// 9
				new Key({ char: "0", shift_char: ")", alt_char: "\u00BA", shift_alt_char: "\u201A" }),				// 0
				new Key({ char: "-", shift_char: "_", alt_char: "\u2013", shift_alt_char: "\u2014" }),				// -
				new Key({ char: "=", shift_char: "+", alt_char: "\u2260", shift_alt_char: "\u00B1" }),				// =
				new Key("backspace")
			],
			[
				new Key({ char: "q", shift_char: "Q", alt_char: "\u0153", shift_alt_char: "\u0152" }),	// q
				new Key({ char: "w", shift_char: "W", alt_char: "\u2211", shift_alt_char: "\u201E" }),	// w
				new Key({ char: "e", shift_char: "E", alt_char: "\u00B4", shift_alt_char: "\u00B4" }),	// e
				new Key({ char: "r", shift_char: "R", alt_char: "\u00AE", shift_alt_char: "\u2030" }),	// r
				new Key({ char: "t", shift_char: "T", alt_char: "\u2020", shift_alt_char: "\u02C7" }),	// t
				new Key({ char: "y", shift_char: "Y", alt_char: "\u00A5", shift_alt_char: "\u00C1" }),	// y
				new Key({ char: "u", shift_char: "U", alt_char: "\u00A8", shift_alt_char: "\u00A8" }),	// u
				new Key({ char: "i", shift_char: "I", alt_char: "\u02C6", shift_alt_char: "\u02C6" }),	// i
				new Key({ char: "o", shift_char: "O", alt_char: "\u00F8", shift_alt_char: "\u00D8" }),	// o
				new Key({ char: "p", shift_char: "P", alt_char: "\u03C0", shift_alt_char: "\u220F" }),	// p
				new Key({ char: "[", shift_char: "{", alt_char: "\u201C", shift_alt_char: "\u201D" }),	// [
				new Key({ char: "]", shift_char: "}", alt_char: "\u2018", shift_alt_char: "\u2019" })	// ]
			],
			[
				new Key({ char: "a", shift_char: "A", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// a
				new Key({ char: "s", shift_char: "S", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// s
				new Key({ char: "d", shift_char: "D", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// d
				new Key({ char: "f", shift_char: "F", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// f
				new Key({ char: "g", shift_char: "G", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// g
				new Key({ char: "h", shift_char: "H", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// h
				new Key({ char: "j", shift_char: "J", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// j
				new Key({ char: "k", shift_char: "K", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// k
				new Key({ char: "l", shift_char: "L", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// l
				new Key({ char: ";", shift_char: ":", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// ;
				new Key({ char: "'", shift_char: "\"", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// '
				new Key({ char: "\\", shift_char: "|", alt_char: "\u00A7", shift_alt_char: "\u00B1" })	// \
				// new Key("enter")
			],
			[
				new Key("shift"),
				new Key({ char: "`", shift_char: "~", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// `
				new Key({ char: "z", shift_char: "Z", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// z
				new Key({ char: "x", shift_char: "X", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// x
				new Key({ char: "c", shift_char: "C", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// c
				new Key({ char: "v", shift_char: "V", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// v
				new Key({ char: "b", shift_char: "B", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// b
				new Key({ char: "n", shift_char: "N", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// n
				new Key({ char: "m", shift_char: "M", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// m
				new Key({ char: ",", shift_char: "<", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// ,
				new Key({ char: ".", shift_char: ">", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// .
				new Key({ char: "/", shift_char: "?", alt_char: "\u00A7", shift_alt_char: "\u00B1" })	// /
			//	new Key("shift")
			],
			[
				new Key("alt"),
				new Key("space"),
				new Key("alt")
			]
		],
		"CS": [
			[
				new Key({ char: "\u00A7", shift_char: "\u00B1", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// §
				new Key({ char: "+", shift_char: "1", alt_char: "\u00A1", shift_alt_char: "\u2044" }),				// 1
				new Key({ char: "ě", shift_char: "2", alt_char: "\u2122", shift_alt_char: "\u20AC" }),				// 2
				new Key({ char: "š", shift_char: "3", alt_char: "\u00A3", shift_alt_char: "\u2039" }),				// 3
				new Key({ char: "č", shift_char: "4", alt_char: "\u00A2", shift_alt_char: "\u203A" }),				// 4
				new Key({ char: "ř", shift_char: "5", alt_char: "\u221E", shift_alt_char: "\uFB01" }),				// 5
				new Key({ char: "ž", shift_char: "6", alt_char: "\u00A7", shift_alt_char: "\uFB02" }),				// 6
				new Key({ char: "ý", shift_char: "7", alt_char: "\u00B6", shift_alt_char: "\u2021" }),				// 7
				new Key({ char: "á", shift_char: "8", alt_char: "\u2022", shift_alt_char: "\u00B0" }),				// 8
				new Key({ char: "í", shift_char: "9", alt_char: "\u00AA", shift_alt_char: "\u00B7" }),				// 9
				new Key({ char: "é", shift_char: "0", alt_char: "\u00BA", shift_alt_char: "\u201A" }),				// 0
				new Key({ char: "=", shift_char: "%", alt_char: "\u2013", shift_alt_char: "\u2014" }),				// -
				new Key({ char: "'", shift_char: "ˇ", alt_char: "\u2260", shift_alt_char: "\u00B1" }),				// =
				new Key("backspace")
			],
			[
				new Key({ char: "q", shift_char: "Q", alt_char: "\u0153", shift_alt_char: "\u0152" }),	// q
				new Key({ char: "w", shift_char: "W", alt_char: "\u2211", shift_alt_char: "\u201E" }),	// w
				new Key({ char: "e", shift_char: "E", alt_char: "\u00B4", shift_alt_char: "\u00B4" }),	// e
				new Key({ char: "r", shift_char: "R", alt_char: "\u00AE", shift_alt_char: "\u2030" }),	// r
				new Key({ char: "t", shift_char: "T", alt_char: "\u2020", shift_alt_char: "\u02C7" }),	// t
				new Key({ char: "z", shift_char: "Z", alt_char: "\u00A5", shift_alt_char: "\u00C1" }),	// y
				new Key({ char: "u", shift_char: "U", alt_char: "\u00A8", shift_alt_char: "\u00A8" }),	// u
				new Key({ char: "i", shift_char: "I", alt_char: "\u02C6", shift_alt_char: "\u02C6" }),	// i
				new Key({ char: "o", shift_char: "O", alt_char: "\u00F8", shift_alt_char: "\u00D8" }),	// o
				new Key({ char: "p", shift_char: "P", alt_char: "\u03C0", shift_alt_char: "\u220F" }),	// p
				new Key({ char: "ú", shift_char: "/", alt_char: "\u201C", shift_alt_char: "\u201D" }),	// [
				new Key({ char: ")", shift_char: "(", alt_char: "\u2018", shift_alt_char: "\u2019" })	// ]
			],
			[
				new Key({ char: "a", shift_char: "A", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// a
				new Key({ char: "s", shift_char: "S", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// s
				new Key({ char: "d", shift_char: "D", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// d
				new Key({ char: "f", shift_char: "F", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// f
				new Key({ char: "g", shift_char: "G", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// g
				new Key({ char: "h", shift_char: "H", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// h
				new Key({ char: "j", shift_char: "J", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// j
				new Key({ char: "k", shift_char: "K", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// k
				new Key({ char: "l", shift_char: "L", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// l
				new Key({ char: "ů", shift_char: "\"", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// ;
				new Key({ char: "§", shift_char: "!", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// '
				new Key({ char: "\\", shift_char: "|", alt_char: "\u00A7", shift_alt_char: "\u00B1" })	// \
				// new Key("enter")
			],
			[
				new Key("shift"),
				new Key({ char: "`", shift_char: "~", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// `
				new Key({ char: "y", shift_char: "Y", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// z
				new Key({ char: "x", shift_char: "X", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// x
				new Key({ char: "c", shift_char: "C", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// c
				new Key({ char: "v", shift_char: "V", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// v
				new Key({ char: "b", shift_char: "B", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// b
				new Key({ char: "n", shift_char: "N", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// n
				new Key({ char: "m", shift_char: "M", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// m
				new Key({ char: ",", shift_char: "?", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// ,
				new Key({ char: ".", shift_char: ":", alt_char: "\u00A7", shift_alt_char: "\u00B1" }),	// .
				new Key({ char: "-", shift_char: "_", alt_char: "\u00A7", shift_alt_char: "\u00B1" })	// /
			//	new Key("shift")
			],
			[
				new Key("alt"),
				new Key("space"),
				new Key("alt")
			]
		]
	})
})(angular);

(function (ng) {

	ng.module("rc.keybr").directive("rcKeybrDropdown", ["KEYBOARD_LAYOUTS", "$timeout", "$rootScope", directive]);

	function directive(KEYBOARD_LAYOUTS, $timeout, $rootScope) {

		//console.log('Keyboard directive initialized');
		return {
			restrict: "E",
			require: "^ngModel",
			replace: false,
			template: '<div class="rc-keybr"><ul><li class="rc-keyboard-row" ng-repeat="row in rows"><ul><li class="{{key.keyClass}}" ng-repeat="key in row" ng-class="{pressed:key.pressed}" ng-click="onKeyClick(key, $event);"><span ng-if="!key.template" ng-bind="key.getCharacter(shiftPressed, altPressed, capsPressed);"></span><span ng-if="key.template" ng-bind-html="key.template"></span></li></ul></li></ul></div>',
			scope: {
				ngModel: "=",
				layout: "@",
				id: "@rcId"
			},

			link: function (scope, element, attrs, ctrl) {

				scope.rows = KEYBOARD_LAYOUTS[attrs.layout];

				scope.shiftPressed = false;
				scope.altPressed = false;
				scope.capsPressed = false;

				scope.onShiftClick = function ($event) {
					$event.stopPropagation();
					scope.shiftPressed = !scope.shiftPressed;
				}
				scope.onAltClick = function ($event) {
					$event.stopPropagation();
					scope.altPressed = !scope.altPressed;
				}
				scope.onBackspaceClick = function ($event) {
					$event.stopPropagation();
					applyValue("backspace", false);
				}
				scope.onSpaceClick = function ($event) {
					$event.stopPropagation();
					applyValue("space", false);
				}

				scope.onKeyClick = function (key, $event) {

					$event.stopPropagation();

					switch (key.char) {
						case "alt":
							scope.altPressed = !scope.altPressed;
							key.pressed = scope.altPressed;
							break;
						case "shift":
							scope.shiftPressed = !scope.shiftPressed;
							key.pressed = scope.shiftPressed;
							break;
						case "enter":
							console.log('Enter key pressed');
							var event = jQuery.Event("keypress");
							event.which = 13; //choose the one you want
							event.keyCode = 13;
							element.trigger(event);
							break;
						default:
							key.pressed = true;
							applyValue(key.getCharacter(ng.copy(scope.shiftPressed), scope.altPressed, scope.capsPressed), true, function () {
								debug.log(key);
								key.pressed = false;
							});
							break;
					}
				}

				function resetKeys() {
					scope.rows.forEach(function (row) {
						row.forEach(function (key) {
							if (key.char === "alt" || key.char === "shift") {
								key.pressed = false;
							}
						});
					})
				}

				function applyValue(value, reset, callback) {
					debug.log("applyValue", value);
					$rootScope.$broadcast("rcKeyboardKeypress", {
						value: value,
						id: scope.id
					});
					$timeout(function () {
						if (reset) {
							resetKeys();
						}
						if (typeof callback === "function") {
							callback();
						}
					}, 200);
				}
			}
		}
	}
})(angular);
