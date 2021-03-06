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

 Scheduler Directive for drag and drop scheduling of elements.
 */
(function (ng) {

	'use strict';

	ng.module("rc.directives").directive("rcScheduler", ["rcShortcut", "rcState", "rcDateHandler", "$q", directive]);

	function directive(rcShortcut, rcState, rcDateHandler, $q) {

		return {
			restrict: "E",
			require: "ngModel",
			scope: {
				ngModel: "=",
				rows: "=",
				options: "="
			},
			replace: false,
			transclude: true,
			templateUrl: "/_templates/base/rc-scheduler-directive",

			link: function (scope, element, attrs, ctrl) {

				const gridCells = 288;
				const gridCellWidth = 10;
				const gridCellHeight = 51;

				// debug.log("OPTIONS",scope.options);
				var stopPropagation = false;
				element.on("mousedown", function (event) {
					if (stopPropagation) {
						event.stopImmediatePropagation();
						event.stopPropagation();
						stopPropagation = false;
					}
				});

				/**
				 * Called on mousedown on a gridster li item. To prevent moving of the item, set the first param to true
				 */
				scope.catch = function (prevent, $event) {
					// Tells the scheduler directive to stop propogation of the mousedown event
					// so clicking on an item won't close panels, but clicking on the schedule (outside of an item) will.
					if (prevent) {
						$event.stopImmediatePropagation();
					} else {
						stopPropagation = true
					}
				}
				var state = new rcState(15);

				scope.default_options = {

					copy_space:			1,
					title_field:		"title",
					monochrome:			false,
					compact_view:		false,
					enabled_time_slots:	[20, 260],
					dragging_enabled:	true,
					view_mode:			false,

					beforeElementAdded:	ng.noop,
					updateCoordinatesWidth:	ng.noop,
					onNewElementAdded:	ng.noop,
					onElementSelected:	ng.noop,
					onElementUnselected:	ng.noop,
					onDragging:				ng.noop,
					onItemMoved:			ng.noop,
					onDelete:				ng.noop,
					onClearRow:				ng.noop
				};

				if (!scope.options) {
					scope.options = {};
				}
				if (!scope.options.view_mode) {
					scope.options.view_mode = scope.default_options.view_mode;
				}
				if (!scope.options.enabled_time_slots) {
					scope.options.enabled_time_slots = scope.default_options.enabled_time_slots;
				}
				if (!scope.options.dragging_enabled) {
					scope.options.dragging_enabled = scope.default_options.dragging_enabled;
				}
				if (!scope.options.beforeElementAdded) {
					scope.options.beforeElementAdded = scope.default_options.beforeElementAdded;
				}
				if (!scope.options.updateCoordinatesWidth) {
					scope.options.updateCoordinatesWidth = scope.default_options.updateCoordinatesWidth;
				}
				if (!scope.options.onNewElementAdded) {
					scope.options.onNewElementAdded = scope.default_options.onNewElementAdded;
				}
				if (!scope.options.onElementSelected) {
					scope.options.onElementSelected = scope.default_options.onElementSelected;
				}
				if (!scope.options.onElementUnselected) {
					scope.options.onElementUnselected = scope.default_options.onElementUnselected;
				}
				if (!scope.options.onDragging) {
					scope.options.onDragging = scope.default_options.onDragging;
				}
				if (!scope.options.onItemMoved) {
					scope.options.onItemMoved = scope.default_options.onItemMoved;
				}

				// Prevent scrolling viewports with arrow keys, so when you move a schedule item with arrow keys, only the item moves ;)
				window.addEventListener("keydown", function (e) {
					// space and arrow keys
					if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
						e.preventDefault();
					}
				}, false);

				// This array is used for generating the table grid behind gridster. TODO: replace ng-repeat to get rid of it's overhead. Since tableWidth is not likely to change.
				scope.tableWidth = [];

				// Fill the array with items.
				for (var i = 0; i < gridCells; i++) scope.tableWidth.push(i);

				// We will keep a reference to the currently selected item here.
				scope.schedule_item = null;
				// TODO remove this testing code!

				// ngModel must be an array otherwise the scheduler directive wont work. So if its not set, then we have to do it here.
				if (!scope.ngModel) {
					//	scope.ngModel = [];
				}

				function assignIds() {
					for (var i = 0; i < scope.ngModel.length; i++) {
						if (!scope.ngModel[i].schedule.uuid) {
							scope.ngModel[i].schedule.uuid = guid();
						}
					}
				}
				function guid() {
					function s4() {
						return Math.floor((1 + Math.random()) * 0x10000)
								.toString(16)
								.substring(1);
					}
					return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
							s4() + '-' + s4() + s4() + s4();
				}

				// Setting up key bindings for the scheduler
				var handler = new rcShortcut({
					"left": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule)
							coordinates.x--;
							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.x--;
								// scrollToScheduleItem(scope.selected_item, true);
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply(); // Apply is needed because the callback happens out of angular's ecosystem.
							}
						}
					},
					"shift+left": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule)
							coordinates.x -= 6;
							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.x -= 6;
								// scrollToScheduleItem(scope.selected_item, true);

								//(typeof options.onScheduleChange === "function") && (options.onScheduleChange(ng.copy(scope.selected_item)));
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply(); // Apply is needed because the callback happens out of angular's ecosystem.
							} else {
								for (var i = 5; i > 0; i--) {
									var coordinates = ng.copy(scope.selected_item.schedule)
									coordinates.x -= i;
									if (!collisionDetection(coordinates)) {
										scope.selected_item.schedule.x -= i;
										// scrollToScheduleItem(scope.selected_item, true);
										//		(typeof options.onScheduleChange === "function") && (options.onScheduleChange(ng.copy(scope.selected_item)));
										state.update(scope.ngModel);
										scope.options.onItemMoved(scope.selected_item);
										scope.$apply(); // Apply is needed because the callback happens out of angular's ecosystem.
									}
								}
							}
						}
					},
					"shift+ctrl+left": function () {
						var coordinates;
						if (scope.selected_item !== null) {
							coordinates = ng.copy(scope.selected_item.schedule);
							while (!collisionDetection(coordinates) && coordinates.x > 0) {
								coordinates.x -= 1;
							};
							if (coordinates.x === 0) {
								scope.selected_item.schedule.x = 0;
							} else {
								scope.selected_item.schedule.x = coordinates.x + 1;
							}
							// scrollToScheduleItem(scope.selected_item, true);
							state.update(scope.ngModel);
							scope.options.onItemMoved(scope.selected_item);
							scope.$apply();
						}
					},
					"right": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule)
							coordinates.x++;
							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.x++;
								// scrollToScheduleItem(scope.selected_item, true)
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply();
							}
						}
					},
					"shift+right": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule)
							coordinates.x += 6;
							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.x += 6;
								// scrollToScheduleItem(scope.selected_item, true);
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply(); // Apply is needed because the callback happens out of angular's ecosystem.
							} else {
								for (var i = 5; i > 0; i--) {
									var coordinates = ng.copy(scope.selected_item.schedule)
									coordinates.x += i;
									if (!collisionDetection(coordinates)) {
										scope.selected_item.schedule.x += i;
										// scrollToScheduleItem(scope.selected_item, true);
										state.update(scope.ngModel);
										scope.$apply(); // Apply is needed because the callback happens out of angular's ecosystem.
									}
								}
							}
						}
					},
					"shift+ctrl+right": function () {
						var coordinates;
						if (scope.selected_item !== null) {
							coordinates = ng.copy(scope.selected_item.schedule);
							while (!collisionDetection(coordinates) && coordinates.x + coordinates.width < scope.tableWidth.length) {
								coordinates.x += 1;
							};
							if (coordinates.x + coordinates.width === scope.tableWidth.length) {
								scope.selected_item.schedule.x = coordinates.x;
							} else {
								scope.selected_item.schedule.x = coordinates.x - 1;
							}
							// scrollToScheduleItem(scope.selected_item, true);
							state.update(scope.ngModel);
							scope.options.onItemMoved(scope.selected_item);
							scope.$apply();
						}
					},
					"up": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule);
							scope.options.updateCoordinatesWidth(coordinates, scope.selected_item.running_time, --coordinates.y);

							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.y--;
								scope.options.beforeElementAdded(scope.selected_item);
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply();
							}
						}
					},
					"down": function () {
						if (scope.selected_item !== null) {
							var coordinates = ng.copy(scope.selected_item.schedule);
							scope.options.updateCoordinatesWidth(coordinates, scope.selected_item.running_time, ++coordinates.y);

							if (!collisionDetection(coordinates)) {
								scope.selected_item.schedule.y++;
								scope.options.beforeElementAdded(scope.selected_item);
								state.update(scope.ngModel);
								scope.options.onItemMoved(scope.selected_item);
								scope.$apply();
							}
						}
					},
					"alt+right": function () {
						// Copy schedule item right
						var new_item = copyItemInRow(scope.selected_item, true);
						// If the copy was successful
						if (new_item) {
							scope.selected_item.selected = false;
							scope.selected_item = null;
							scope.selected_item = new_item;
							state.update(scope.ngModel);
							scope.options.onNewElementAdded(new_item);
							scope.$apply();
							// scrollToScheduleItem(scope.selected_item, true);
						}
					},
					"alt+left": function (event) {
						// Copy schedule item left
						var new_item = copyItemInRow(scope.selected_item, false);
						// If the copy was successful
						if (new_item) {
							scope.selected_item.selected = false;
							scope.selected_item = null;
							scope.selected_item = new_item;
							state.update(scope.ngModel);
							scope.options.onNewElementAdded(new_item);
							scope.$apply();
							// scrollToScheduleItem(scope.selected_item, true);
						}
					},
					"tab": function (event) {
						if (scope.selected_item !== null) {

							var next = findNextElement(scope.selected_item, false);
							//		debug.log(next);
							if (next !== null) {
								for (var i = 0; i < scope.ngModel.length; i++) {
									scope.ngModel[i].selected = false;
								}
								next.selected = true;
								scope.selected_item = next;
								// scrollToScheduleItem(scope.selected_item, true);
								scope.$apply();
							}

							event.preventDefault(); // Prevent tabbing into another element
						}
					},
					"shift+tab": function (event) {
						if (scope.selected_item !== null) {

							var next = findNextElement(scope.selected_item, true);
							//				debug.log(next);
							if (next !== null) {
								for (var i = 0; i < scope.ngModel.length; i++) {
									scope.ngModel[i].selected = false;
								}
								next.selected = true;
								scope.selected_item = next;
								// scrollToScheduleItem(scope.selected_item, true);
								scope.$apply();
							}
							event.preventDefault(); // Prevent tabbing into another element
						}
					},
					"ctrl+d": function (event) {
						//event.stopPropagation();
						//event.preventDefault();
						if (scope.selected_item !== null) {
							var next = findNextElement(scope.selected_item, true);
							//			debug.log(next);
							if (next !== null) {
								for (var i = 0; i < scope.ngModel.length; i++) {
									scope.ngModel[i].selected = false;
								}
								next.selected = true;
								scope.removeScheduleItem(scope.selected_item);
								scope.selected_item = next;
								// scrollToScheduleItem(scope.selected_item, true);
							} else {
								scope.removeScheduleItem(scope.selected_item);
								scope.selected_item = null;
							}
							scope.$apply();
						}
					},
					"ctrl+z": function (event) {
						debug.log('User requested an undo');
						var tmp = state.undo();
						if (tmp) {
							scope.ngModel = tmp;
							scope.$apply();
						}
					},
					"ctrl+y": function (event) {
						debug.log('User requested an redo');
						var tmp = state.redo();
						if (tmp) {
							scope.ngModel = tmp;
							scope.$apply();
						}
					}

				});

				// This function is called when a user drops an rc-schedule-item inside gridster. It handles the insert of the new item.
				scope.addNewElement = function ($data, $event, row, column) {
					if ($data.item) {

						let item = ng.copy($data.item);
						item.selected = true;
						item.schedule = {
							x: column - $data.offset_x,
							y: row,
							width: $data.width,
							id: guid(),
							color: $data.color
						};

						scope.options.beforeElementAdded(item);

						// Only add the element if its not colliding with others. So it wont push other items away.
						if (!collisionDetection(item.schedule)) {
							scope.selected_item = item;
							scope.ngModel.push(item);
							state.update(scope.ngModel);
							scope.options.onNewElementAdded(item);
						}
					}
				};

				function findNextElement(current_element, previous) {
					var arr = [];
					for (var i = 0; i < scope.ngModel.length; i++) {
						var tmp = scope.ngModel[i]
						arr.push({ sort: { x: tmp.schedule.x, y: tmp.schedule.y }, item: tmp })
					}
					arr.sort(function (a, b) {
						if (a.sort.y < b.sort.y) {
							return -1
						} else if (a.sort.y === b.sort.y) {
							return a.sort.x - b.sort.x;
						}
						return 1;
					});
					if (previous) {
						arr.reverse();
					}
					for (var i = 0; i < arr.length - 1; i++) {
						if (current_element.schedule.id === arr[i].item.schedule.id) {
							return arr[i + 1].item;
						}
					}
					return null;
				}

				/*
				NOTE:

				The current scheduler software is creating the schedule object for
				each item in the template script file and then passing the already
				calculated values to the directive. This needs to be changed so that
				the calculations all happen in the Scheduler directive.
				*/
				var firstThrough = true;
				var init_listener = scope.$watch("ngModel", function (value) {

					if (value) {

						//assignIds();
						// init_listener();

						// Save the current state of the model so that we can have
						// undo and redo functionality.
						state.update(scope.ngModel);

						// Calculate the earliest available show so that we can automatically
						// scroll it into view.
						var earliestShow;
						for (var i = 0; i < scope.ngModel.length; i++) {

							if (!earliestShow || scope.ngModel[i].show_time < earliestShow.show_time) {
								earliestShow = scope.ngModel[i];
							}
						}

						// If an earliest show was found then we tell the scheduler
						// to position the schedule so that the earliest show is
						// displayed onscreen.
						if (earliestShow && firstThrough) {
							setTimeout(function () {
								scrollToScheduleItem(earliestShow, false, true);
								firstThrough = false;
							}, 100);
						}
					}
				})

				// If we move an element outside of the viewport, then we have to scroll to that element.
				function scrollToScheduleItem(item, outOfViewport, firstPosition) {

					// We need the actual element here.
					var element = document.getElementById(item.schedule.id),
							rect = element.getBoundingClientRect(),
							container = findAncestor(element, "gr-container");

					// If outOfViewport is set to true, then only scroll if the item is out of the viewport.
					var scroll = outOfViewport ? !isElementInViewport(container, element, item.schedule) : true;
					if (scroll) {
						if (!firstPosition) {
							$(container).animate({ scrollLeft: (item.schedule.x * 10) + (item.schedule.width * 5) - container.offsetWidth / 2 }, 300);
						} else {
							$(container).animate({ scrollLeft: (item.schedule.x * 10) }, 300);
						}
					}

				}

				// Find the first ancestor that has class (cls)
				function findAncestor(el, cls) {
					while ((el = el.parentElement) && !el.classList.contains(cls));
					return el;
				}

				function isElementInViewport(container, element, item_coordinates) {
					var itemOffsetLeft = (item_coordinates.x * 10);
					return !(((container.scrollLeft + container.offsetWidth) < itemOffsetLeft + (item_coordinates.width * 10)) ||
							(container.scrollLeft > itemOffsetLeft)
					);
				}
				// Detect if a position overlaps with another item.
				function collisionDetection(schedule_item) {
					for (var i = 0; i < scope.ngModel.length; i++) {
						var coordinates = scope.ngModel[i].schedule;
						// If the two coordinates are in collision then return true;
						if (isInCollision(schedule_item, coordinates)) {
							console.log('isInCollision', schedule_item, coordinates);
							return true;
						}
					}
					return false;
				}
				function isInCollision(item_a, item_b) {
					// If the two items are in a different row, then they are definitely not colliding.
					if (item_a.y !== item_b.y) return false;
					// If the two coordinates are belong to the same item, then they are not in collision.
					if (item_a.id === item_b.id) return false;
					// Now we know that the two coordinates are in the same row and they are belong to different items. So we have to calculate their boundaries.
					let a = {
						start: item_a.x,
						end: item_a.x + item_a.width
					};
					let b = {
						start: item_b.x,
						end: item_b.x + item_b.width
					};
					// Check the the two boundaries are overlapping or not
					if (!(a.end <= b.start || a.start >= b.end)) {
						debug.log('Item is in collision');
						return true;
					}
				}
				function copyItemInRow(item, copy_to_right) {
					// Copy the item by value to avoid changing the model.
					var new_item = ng.copy(item),
							additionalSpace = scope.default_options.copy_space;
					if (scope.options && typeof scope.options.copy_space === "number") {
						additionalSpace = scope.options.copy_space;
					}
					// Set the newItem's position.
					if (copy_to_right) {
						new_item.schedule.x += new_item.schedule.width + additionalSpace;
					} else { // Copy to the left.
						new_item.schedule.x -= new_item.schedule.width + additionalSpace;
					}
					// Now ve have to check two things. 1. Collision with other items. 2. Do we have enough space to fit the element (happens if the item is close to container borders)
					if (!collisionDetection(new_item.schedule) && new_item.schedule.x + new_item.schedule.width <= scope.tableWidth.length && new_item.schedule.x >= 0) {
						// We have to assign a new unique id for the new element, because if you have more than 1 item with the same id, it will break the whole thing ;)
						new_item.schedule.id = guid();
						scope.ngModel.push(new_item);
						return new_item;
					} else {
						alert('Shows colliding');
						console.log('Show dragging', new_item);
					}
				}

				scope.headers = [{ title: "asd" }];
				var id = Math.random();
				var client = new Faye.Client("$setting{faye_server}", { timeout: 120 });
				var subscription = client.subscribe('/scheduler-test', function (message) {
					if (message.id !== id) {
						for (var i = 0; i < scope.ngModel.length; i++) {
							var item = scope.ngModel[i];
							if (item.schedule.uuid === message.data.uuid) {
								item.schedule = message.data;
								scope.$apply();
								return;
							}
						}
					}
				});

				scope.gridsterOptions = {
					columns: gridCells,					// the width of the grid, in columns
					pushing: false,						// whether to push other items out of the way on move or resize
					floating: false,					// whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
					swapping: false,					// whether or not to have items of the same size switch places instead of pushing down if they are the same size
					width: (gridCells * gridCellWidth),	// can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
					colWidth: gridCellWidth,			// can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
					rowHeight: gridCellHeight,			// can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
					margins: [1, 0],					// the pixel distance between each widget
					outerMargin: true,					// whether margins apply to outer edges of the grid
					isMobile: false,					// stacks the grid items if true
					mobileBreakPoint: 600,				// if the screen is not wider that this, remove the grid layout and stack the items
					mobileModeEnabled: true,			// whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
					minColumns: gridCells,					// the minimum columns the grid must have
					minRows: scope.rows.length,			// the minimum height of the grid, in rows
					maxRows: scope.rows.length,			// the maximum height o
					defaultSizeX: 1,					// the default width of a gridster item, if not specifed
					defaultSizeY: 1,					// the default height of a gridster item, if not specified
					minSizeX: 1,						// minimum column width of an item
					maxSizeX: null,						// maximum column width of an item
					minSizeY: 1,						// minumum row height of an item
					maxSizeY: 1,						// maximum row height of an item
					resizable: {
						enabled: false,
						handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
						start: function (event, $element, widget) {
						}, // optional callback fired when resize is started,
						resize: function (event, $element, widget) {
						}, // optional callback fired when item is resized,
						stop: function (event, $element, widget) {
						} // optional callback fired when item is finished resizing
					},
					draggable: {

						enabled: scope.options.dragging_enabled,	// whether dragging items is supported
						handle: '.handle-drag',					// optional selector for resize handle

						start: function (event, $element, widget) {
							scope.draggedObjectOriginalCoordinates = ng.copy(scope.selected_item.schedule);
						},
						drag: function (event, $element, widget) {
							scope.options.onDragging(scope.selected_item); // Call the drag callback function with the currently selected item.
						},
						stop: function (event, $element, widget, originalPosition) {

							// Because we are using nested callbacks we create a promise that
							// will resolve once the calling software responds.
							if (typeof scope.options.beforeItemMoved === 'function') {
								return $q(function(resolve, reject) {
									let item = scope.selected_item;
									scope.options.beforeItemMoved(item, originalPosition).then(function(data) {

										// Was calling "beforeElementAdded" callback here, but moved it inside  "beforeItemMoved"
										// because it because it needed to be called  conditionally by this directive client
										// (when show is moved between rows) - may need to be brought back

// console.log('Item Movement Allowed - Promise', originalPosition);
										scope.options.onItemMoved(item);
										resolve(data);

									}, function (data) {
// console.log('Item Movement Rejected - Promise', originalPosition);
										reject(data);
									});
								});
							} else {
// console.log('Item Movement Rejected', originalPosition);
								return false;
							}
						},
						collision: function(collisionObjects) {

							// TODO: Check that the overlapping items will fit if they are swapped with each other. Important
							// when one of the items is longer than the other and there might be overlapping items after.

							// TODO overlap on swap check was added in client that uses this directive (movie.js). Should be moved here?

							try {

								// Find the colliding item to see if we need to perform
								// a show swap.
								let collisionObject = scope.ngModel.filter(function(scheduleItem) {
									return scheduleItem.schedule.x === collisionObjects[0].col
											&& scheduleItem.schedule.y === collisionObjects[0].row
											&& scheduleItem.schedule.width === collisionObjects[0].sizeX;
								});

								// console.log('collisionObject', collisionObject);
								if (scope.options.onCollision && typeof scope.options.onCollision === 'function') {
									scope.options.onCollision(
											scope.selected_item, collisionObject[0], scope.draggedObjectOriginalCoordinates
									);
								}

							} catch (ex) {
								console.log('Collision', ex);
							}
						}
					}
				};

				scope.hasClass = function (node, className, searchDepth, searchCurrentLevel) {
					if (node && node.classList.contains(className)) {
						return true;

					} else if (!node || searchDepth === searchCurrentLevel) {
						return false;

					} else {
						return scope.hasClass(node.parentNode, className, searchDepth, searchCurrentLevel + 1);
					}
				};

				// If the user clicks in the schedule, but not on a show then we
				// need to hide the show information panel.
				element.on("click", function (event) {
					// We have to check the target element and it's parent as well, because div.middle has childs that are chaching
					if (scope.hasClass(event.target, "handle", 3, 0)) {
						return;
					}
					for (var i = 0; i < scope.ngModel.length; i++) {
						scope.ngModel[i].selected = false;
					}
					scope.options.onElementUnselected(scope.selected_item);
					scope.selected_item = null;
					scope.$apply();
				});

				scope.pixels = function (steps) {
					let pixels = steps * gridCellWidth;
					return pixels + 'px';
				};
			},
			controller: function ($scope, $timeout) {

				$scope.customItemMap = {
					sizeX: 'item.schedule.width',
					sizeY: 1,
					row: 'item.schedule.y',
					col: 'item.schedule.x',
					minSizeY: 1,
					maxSizeY: 1
				};

				$scope.removeScheduleItem = function (item) {
					for (var i = 0; i < $scope.ngModel.length; i++) {
						if ($scope.ngModel[i].schedule.id === item.schedule.id) {
							$scope.options.onDelete(item.schedule.id, function (deleteConfirmed) {
								if (deleteConfirmed) {
									$scope.ngModel.splice(i, 1);
								}
							});
							return;
						}
					}
				};

				$scope.selectScheduleItem = function (item, $index, $event) {
					//console.log("selectScheduleItem", $event);
					//$event.stopPropagation();
					//$event.stopImmediatePropagation();
					//$event.preventDefault();
					// Remove any selected flags from other schedule items.
					for (var i = 0; i < $scope.ngModel.length; i++) {
						$scope.ngModel[i].selected = false;
					}
					// This selected flag responsible for applying the selected class on the element
					item.selected = true;
					// Keep a reference to the selected item
					$scope.selected_item = item;
					$scope.options.onElementSelected(item);
				};

				$scope.clearRow = function (index) {

					let elementList = $scope.ngModel.filter(function(showTime) {
						return index == showTime.schedule.y;
					})

					$scope.options.onClearRow(elementList, function (deleteConfirmed, processedList) {
						if (deleteConfirmed) {
							for (var i = $scope.ngModel.length - 1; i >= 0; i--) {
								var row_index = $scope.ngModel[i].schedule.y;
								if (row_index === index) {
									// If the element exists in the processed list
									// then it can be removed.
									let list = processedList.filter(function (element) {
										return element.schedule.id == $scope.ngModel[i].schedule.id;
									});
									if (list.length > 0) {
										$scope.ngModel.splice(i, 1);
									}
								}
							}
						}
					});

				}

				$scope.calculateStartTime = function (x) {
					return rcDateHandler.getUIStartOfScheduleDay().add(x * 5, "minutes").format('HH:mm');
					// var startDate = rcDateHandler.getUIStartOfScheduleDay();
					// var minutes_from_6am = x * 5;
					// startDate = startDate.add(minutes_from_6am, "minutes");
					// return startDate.format("HH:mm");
				}

				$scope.calculateEndTime = function (item) {
					var showTime = rcDateHandler.getUIStartOfScheduleDay().add(item.schedule.x * 5, "minutes");
					if (item.running_time > 0) {
						showTime.add(item.running_time, "minutes");
					}
					if (item.preshow_length > 0) {
						showTime.add(item.preshow_length, "minutes");
					}
					if (item.postshow_length > 0) {
						showTime.add(item.postshow_length, "minutes");
					}
					if (item.break_length > 0) {
						showTime.add(item.break_length, "minutes");
					}
					return showTime.format('HH:mm');
				}
			}
		};
	}

} (angular));

(function (ng) {

	'use strict';

	ng.module("rc.directives").directive("rcScheduleItem", [directive]);

	function directive() {

		return {
			restrict: "E",
			template: '<div ng-drag="true" ng-drag-data="data" data-allow-transform="true" class="rc-schedule-item" draggable="false"><div class="left"></div><div class="middle"><ng-transclude/></div><div class="right"></div></div>',
			transclude: true,
			replace: true,
			scope: {
				data: "="
			},
			link: function (scope, element, attrs, ctrl) {
				var $element = $(element)
				element.on("mousedown", function (event) { //Relative ( to its parent) mouse position
					var posX = $(this).position().left;
					posX = event.pageX - $element.offset().left;
					scope.data.offset_x = (Math.floor(posX / 10))
					scope.$apply();
				})
			}
		};
	}
} (angular));
