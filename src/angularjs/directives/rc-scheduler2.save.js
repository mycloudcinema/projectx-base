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

Scheduler Directive for drag and drop scheduling of elements utilizing HTML5 drag
and drop techniques.
*/
(function (ng) {

	'use strict';

	ng.module("rc.directives")
		.directive("rcScheduler", [rcScheduler]);

	function rcScheduler() {

		return {
			restrict:					"E",
			require:					"ngModel",
			scope: {
				ngModel:				"=",
				rows:					"=",
				options:				"=",
				collisionDetected:		"="
			},
			replace:					false,
			transclude:					true,
			templateUrl:				"/_templates/base/rc-scheduler2",

			link: function (scope, element, attrs, ctrl) {

				let self = scope;

				// Check to see if we have a model and if we don't then we create
				// an empty array to store all the scheduled items.
				if (!scope.ngModel) {
					scope.ngModel = [];
				}

				// Default options for the scheduler.
				scope.default_options = {

					// NOTE:	If you change grid dimensions then you also need to
					//			change the corresponding CSS so that the grid lines
					//			on the background will match with the actual grid.
					gridHeight:					41,
					gridWidth:					12,

					// The default option is to snap any dropped items to the grid
					snapToGrid:					true,

					// By default we do not allow scheduled items to overlap
					collisionDetection:			true,

					headings: [
						{heading:"00:00"}, {heading:"01:00"}, {heading:"02:00"}, {heading:"03:00"}, {heading:"04:00"}, {heading:"05:00"}, {heading:"06:00"}, {heading:"07:00"}, {heading:"08:00"}, {heading:"09:00"}, {heading:"10:00"}, {heading:"11:00"}, {heading:"12:00"}, {heading:"13:00"}, {heading:"14:00"}, {heading:"15:00"}, {heading:"16:00"}, {heading:"17:00"}, {heading:"18:00"}, {heading:"19:00"}, {heading:"20:00"}, {heading:"21:00"}, {heading:"22:00"}, {heading:"23:00"}
					]
				}

				// Extend the default options with the user supplied options
				scope.options = Object.assign(scope.default_options, scope.options || {});

				// Extract the parent values for the drop target and the scrolling
				// view port.
				const rcSchedule = document.getElementById('mediaSchedule');
				const viewPort = document.getElementById('viewPort');
				const parentLeft = parseInt(mediaSchedule.getBoundingClientRect().left);
				const parentTop = parseInt(mediaSchedule.getBoundingClientRect().top);
				const parentHeight = scope.options.gridHeight * scope.rows.length;
console.log('Parent', parentLeft, parentTop, parentHeight);

				// Working variables used when resizing or dragging elements
				let resizingRight = false;
				let resizingLeft = false;
				let startLeft = 0;
				let startX = 0;
				let resizeElement;
				let originalWidth;

				// Worker functions
				function guid() {
					function s4() {
						return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
					}
					return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
				}

				var addEvent = (function () {
					if (document.addEventListener) {
						return function (el, type, fn) {
							if (el && el.nodeName || el === window) {
								el.addEventListener(type, fn, false);
							} else if (el && el.length) {
								for (var i = 0; i < el.length; i++) {
									addEvent(el[i], type, fn);
								}
							}
						};
					} else {
						return function (el, type, fn) {
							if (el && el.nodeName || el === window) {
								el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
							} else if (el && el.length) {
								for (var i = 0; i < el.length; i++) {
									addEvent(el[i], type, fn);
								}
							}
						};
					}
				})();

				// Add any drag events that are needed to the media schedule element
				addEvent(mediaSchedule, 'mousemove', doResize);
				addEvent(mediaSchedule, 'dragover', dragOver);
				addEvent(mediaSchedule, 'drop', drop);

				// Activate the drag handlers on the source elements
				setTimeout(function() {
					addEvent($('.dragElement'), 'dragstart', dragStart);
				}, 200);

				function dragStart(event) {

					if (!resizingRight && !resizingLeft) {

						const dragSource = document.getElementById(event.target.id);

						// Determine where the user clicked in the drag element. We need this
						// so that we can correctly position the element when it is dropped.
						const elementLeft = parseInt(dragSource.getBoundingClientRect().left);
						const elementTop = parseInt(dragSource.getBoundingClientRect().top);
						// const elementLeft = parseInt(dragSource.offsetLeft);
						// const elementTop = parseInt(dragSource.offsetTop);

						const sourceData = {
							id:				event.target.id,
							left:			event.clientX - (elementLeft),
							top:			event.clientY - (elementTop),
							// left:			event.clientX,
							// top:			event.clientY,
							width:			dragSource.clientWidth,
							height:			dragSource.clientHeight,
							sourceId:		dragSource.getAttribute('data-source') || event.target.id
						};

						event.dataTransfer.setData("text/plain", JSON.stringify(sourceData));
console.log('dragStart', sourceData);
					} else {
						event.preventDefault();
						return false;
					}
				}

				function dragOver(event) {
// console.log('left', event.clientX, 'top', event.clientY, offset_data[0], offset_data[1]);
					event.preventDefault();
					return false;
				}

				function drop(event) {
// console.log(event.dataTransfer.getData("text/plain"));

					// Retrieve the source element information from the transfer data.
					const sourceData = JSON.parse(event.dataTransfer.getData("text/plain"));
					const dropSource = document.getElementById(sourceData.id);

					// Calculate where we would position the element if we weren't snapping
					// it to the grid.
					var elementOffset = {
						left:		(event.clientX - parentLeft) - sourceData.left + viewPort.scrollLeft,
						top:		(event.clientY - parentTop) - sourceData.top,
						width:		parseInt(dropSource.style.width.replace('px', '')) || dropSource.clientWidth,
						height:		parseInt(dropSource.style.height.replace('px', '')) || dropSource.clientHeight
					}
console.log('elementOffset', elementOffset, viewPort.scrollLeft);
					// Now calculate the nearest grid position that we need to snap to
					// and how many pixels we have to add to reach a grid boundary.
					if (self.options.snapToGrid) {

						const offsetLeft = elementOffset.left - (Math.floor(elementOffset.left / scope.options.gridWidth) * scope.options.gridWidth);
						const offsetTop = elementOffset.top - (Math.floor(elementOffset.top / scope.options.gridHeight) * scope.options.gridHeight) - scope.options.gridHeight;

// console.log('dropLeft', event.clientX, parentLeft, elementOffset.left, offsetLeft);
						if (offsetLeft > (scope.options.gridWidth / 2)) {
							elementOffset.left = ((Math.floor(elementOffset.left / scope.options.gridWidth) + 1) * scope.options.gridWidth) + 1;
						} else {
							elementOffset.left = (Math.floor(elementOffset.left / scope.options.gridWidth) * scope.options.gridWidth) + 1;
						}
// console.log('dropTop', event.clientX, event.clientY, parentTop, elementOffset.top, offsetTop, (scope.options.gridHeight / 2));
						if (offsetTop > (scope.options.gridHeight / 2)) {
// console.log('Snapping to next row');
							elementOffset.top = ((Math.floor(elementOffset.top / scope.options.gridHeight) + 1) * scope.options.gridHeight) + 1;
						} else {
// console.log('Snapping to current row');
							elementOffset.top = (Math.floor(elementOffset.top / scope.options.gridHeight) * scope.options.gridHeight) + 1;
						}
						// If the element is going to be dropped outside the boundaries of the
						// grid then we need to adjust for that.
						if (elementOffset.top >= parentHeight) {
console.log('Top Position Check', elementOffset, parentHeight);
							elementOffset.top = parentHeight - scope.options.gridHeight + 1;
						}

						const offsetRight = elementOffset.width - (Math.floor(elementOffset.width / scope.options.gridWidth) * scope.options.gridWidth);
// console.log(elementOffset.width, offsetRight)
						if (offsetRight > (scope.options.gridWidth / 2)) {
							elementOffset.width += (scope.options.gridWidth - offsetRight);
						} else {
							elementOffset.width -= offsetRight;
						}
// console.log(elementOffset.width, offsetRight)

					}

					// Calculate where this element is now positioned on the grid to
					// determine the row and column.
// console.log('Left', Math.floor(elementOffset.left / scope.options.gridWidth), 'Top', Math.floor(elementOffset.top / scope.options.gridHeight));
					elementOffset.column = Math.floor(elementOffset.left / scope.options.gridWidth);
					elementOffset.row = Math.floor(elementOffset.top / scope.options.gridHeight);

					// Determine if this new element is going to collide with an already
					// existing element on the page.
					if (collisionDetected(elementOffset, dropSource)) {
						event.preventDefault();
						return false;
					}

					let dropElement;
					let dropElementText;

					// If we have dragged a scheduled item then we move the original
					// item, otherwise we need to create a new one.
					if (dropSource.getAttribute('data-scheduled') === '1') {

						dropElement = dropSource;
						dropElementText = dropSource.childNodes[0];

						const thisGUID = dropElement.getAttribute('id');

						scope.ngModel.filter(function(thisElement) {
// console.log('Filter', thisElement, thisGUID);
							return thisElement.guid == thisGUID;
						}).forEach(function(thisElement) {
// console.log('ForEach', thisElement);
							thisElement.guid = thisGUID;
							thisElement.left = elementOffset.left;
							thisElement.top = elementOffset.top;
							thisElement.width = elementOffset.width;
							thisElement.column = elementOffset.column;
							thisElement.row = elementOffset.row
						});

					} else {

						const newGUID = guid();

						// Insert a new element into the schedule
						dropElement = document.createElement("div");
						dropElementText = document.createElement("p");
						mediaSchedule.appendChild(dropElement);

						// Set the attributes of the new element to match the attributes of the old
						// element
						dropElement.setAttribute('class', 'scheduledElement');
						dropElement.setAttribute('draggable', 'true');
						dropElement.setAttribute('data-scheduled', '1');
						dropElement.setAttribute('data-source', sourceData.sourceId);
						dropElement.setAttribute('id', newGUID);

						dropElementText.innerHTML = dropSource.innerHTML;
						dropElement.appendChild(dropElementText);

						// Attach the sizing handles needed to resize the element.
						const resizeRight = document.createElement("div");
						resizeRight.setAttribute('class', 'resizeRight');
						dropElement.appendChild(resizeRight);
						addEvent(resizeRight, 'mousedown', initResizeRight);
						addEvent(resizeRight, 'mouseup', stopResize);

						scope.ngModel.push({
							guid:	newGUID,
							left:	elementOffset.left,
							top:	elementOffset.top,
							width:	elementOffset.width,
							column:	elementOffset.column,
							row:	elementOffset.row
						});
					}

					dropElement.style.left = elementOffset.left + 'px';
					dropElement.style.top = elementOffset.top + 'px';
					dropElement.style.width = elementOffset.width + 'px';

					function initResizeRight(event) {
						resizingRight = true;
						startX = event.clientX;
						startLeft = parseInt(dropElement.getBoundingClientRect().left);
						originalWidth = dropElement.style.width;
// console.log('originalWidth', originalWidth);
						resizeElement = dropElement;
// console.log('initResize', startLeft, startX);
					}

					function stopResize(event) {
// console.log('Stop resizing');
						if (resizingRight || resizingLeft) {

							if (resizingRight) {

								let newWidth = parseInt(resizeElement.style.width.replace('px', ''));

								// If we are snapping to the grid then we need to calculate
								// how many pixels we have to add to reach a grid boundary.
								if (self.options.snapToGrid) {
									const offsetRight = newWidth - (Math.floor(newWidth / scope.options.gridWidth) * scope.options.gridWidth);
// console.log(resizeElement.style.width, newWidth, offsetRight);
									if (offsetRight > (scope.options.gridWidth / 2)) {
// console.log(newWidth + (scope.options.gridWidth - offsetRight));
										newWidth += (scope.options.gridWidth - offsetRight);
									} else {
// console.log(newWidth - (scope.options.gridWidth - offsetRight));
										newWidth -= offsetRight;
									}
									var elementOffset = {
										left:		resizeElement.getBoundingClientRect().left - parentLeft,
										top:		resizeElement.getBoundingClientRect().top - parentTop,
										height:		resizeElement.clientHeight,
										width:		newWidth
									};
// console.log(resizeElement.style.width, newWidth, offsetRight);
								}
								if (collisionDetected(elementOffset, resizeElement)) {
									// console.log('Collision detected', originalWidth);
									resizeElement.style.width = originalWidth;
								} else {
									resizeElement.style.width = newWidth + 'px';
								}
							}
							resizingRight = false;
							resizingLeft = false;
							resizeElement = undefined;
						}
					}

					// Attach the drag handler event to the new element
					addEvent(dropElement, 'dragstart', dragStart);

					// Because an HTML5 drop event doesn't fire an digest loop
					// we need to force the digest loop so that the calling
					// software to receive the model.
					scope.$apply();

					event.preventDefault();
					return false;
				}

				function doResize(event) {
					if (resizingRight) {
// console.log('doResize', startLeft, event.clientX, startX);
						let newWidth = (event.clientX - startLeft);
						resizeElement.style.width = newWidth + 'px';
					}
				}

				function collisionDetected(elementOffset, dropSource) {

					var collision = false;

					if (self.options.collisionDetection) {

						[].forEach.call(document.getElementsByClassName('scheduledElement'), function (element) {

							// We can drop ourselves on top of ourselves
							if (element !== dropSource) {

// console.log('Validating Object', element.getBoundingClientRect(), parentTop, element.getBoundingClientRect().top - parentTop, scope.options.gridHeight);
								var offset = {
									// left:		element.getBoundingClientRect().left - parentLeft + viewPort.scrollLeft,
									// top:		element.getBoundingClientRect().top - parentTop - scope.options.gridHeight,
									left:		element.offsetLeft,
									top:		element.offsetTop,
									width:		element.clientWidth,
									height:		element.clientHeight
								};
console.log(elementOffset, offset);
								// Check for a collision and if we have one then we will cancel
								// the drag event.
								if (offset.left < elementOffset.left + elementOffset.width && offset.left + offset.width > elementOffset.left && offset.top < elementOffset.top + elementOffset.height && offset.height + offset.top > elementOffset.top) {
console.log('Collision Detected', 'Drag Element', elementOffset, 'Colliding Object', offset);
									if (typeof self.collisionDetected == 'function') {
										self.collisionDetected(dropSource, element);
									}
									collision = true;
								}
							}
						});
					}

					return collision;

				}
			}
		};
	}

} (angular));
