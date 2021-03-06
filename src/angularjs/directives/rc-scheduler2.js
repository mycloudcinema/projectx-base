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
				dragStart:				"=",
				dragEnd:				"=",
				collisionDetected:		"="
			},
			replace:					false,
			transclude:					true,
			templateUrl:				"/_templates/base/rc-scheduler2",

			link: function (scope, element, attrs, ctrl) {

				let self = scope;

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
// console.log('Parent', parentLeft, parentTop, parentHeight);

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

						const sourceData = {
							id:				event.target.id,
							left:			event.clientX - (elementLeft),
							top:			event.clientY - (elementTop),
							width:			dragSource.clientWidth,
							height:			dragSource.clientHeight,
							sourceId:		dragSource.getAttribute('data-source') || event.target.id
						};

						event.dataTransfer.setData("text/plain", JSON.stringify(sourceData));

						if (typeof scope.dragStart === 'function') {
							scope.dragStart(event.target.id);
						}
// console.log('dragStart', sourceData);
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

					var isNewElement = true;

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
// console.log('elementOffset', elementOffset, viewPort.scrollLeft);
					// Now calculate the nearest grid position that we need to snap to
					// and how many pixels we have to add to reach a grid boundary.
					if (self.options.snapToGrid) {

						const offsetLeft = elementOffset.left - (Math.floor(elementOffset.left / scope.options.gridWidth) * scope.options.gridWidth);
						const offsetTop = elementOffset.top - (Math.floor(elementOffset.top / scope.options.gridHeight) * scope.options.gridHeight);
// console.log(offsetLeft, offsetTop)

						if (offsetLeft > (scope.options.gridWidth / 2)) {
							elementOffset.left = ((Math.floor(elementOffset.left / scope.options.gridWidth) + 1) * scope.options.gridWidth) + 1;
						} else {
							elementOffset.left = (Math.floor(elementOffset.left / scope.options.gridWidth) * scope.options.gridWidth) + 1;
						}

						if (offsetTop > (scope.options.gridHeight / 2)) {
							elementOffset.top = ((Math.floor(elementOffset.top / scope.options.gridHeight) + 1) * scope.options.gridHeight) + 1;
						} else {
							elementOffset.top = (Math.floor(elementOffset.top / scope.options.gridHeight) * scope.options.gridHeight) + 1;
						}
						// Don't allow the element to dropped outside the limits
						// of the grid.
						if (elementOffset.top > self.rows.length * self.options.gridHeight) {
							elementOffset.top = ((self.rows.length - 1) * self.options.gridHeight);
						}

						const offsetRight = elementOffset.width - (Math.floor(elementOffset.width / scope.options.gridWidth) * scope.options.gridWidth);
// console.log(offsetRight)
						if (offsetRight > (scope.options.gridWidth / 2)) {
							elementOffset.width += (scope.options.gridWidth - offsetRight);
						} else {
							elementOffset.width -= offsetRight;
						}
// console.log(elementOffset.width, offsetRight)

					}

					// Determine if this element is going to collide with an already
					// existing element on the page.
					if (collisionDetected(elementOffset, dropSource)) {
						event.preventDefault();
						return false;
					}

					let dropElement;
					let dropElementId;
					let dropElementText;

					// If we are adding a new element to the schedule then we
					// create the DOM elements to be inserted, otherwise we are
					// just going to use the existing element and move it around.
					if (dropSource.getAttribute('data-scheduled') !== '1') {
						// Insert a new element into the schedule
						dropElementId = guid();
						dropElement = document.createElement("div");
						dropElementText = document.createElement("p");
						mediaSchedule.appendChild(dropElement);
						// Attach the drag handler event to the new element
						addEvent(dropElement, 'dragstart', dragStart);
					} else {
						dropElementId = dropSource.getAttribute('id');
						dropElement = dropSource
						isNewElement = false;
					}

					// Set the attributes of the new element to match the attributes of the old
					// element
					dropElement.setAttribute('class', 'scheduledElement');
					dropElement.setAttribute('draggable', 'true');
					dropElement.setAttribute('data-scheduled', '1');
					dropElement.setAttribute('data-source', sourceData.sourceId);
					dropElement.setAttribute('id', dropElementId);

					dropElement.style.left = elementOffset.left + 'px';
					dropElement.style.top = elementOffset.top + 'px';
					dropElement.style.width = elementOffset.width + 'px';

					if (dropSource.getAttribute('data-scheduled') !== '1') {
						dropElementText.innerHTML = dropSource.innerHTML;
						dropElement.appendChild(dropElementText);
					}

					// Attach the sizing handles needed to resize the element.
					const resizeRight = document.createElement("div");
					resizeRight.setAttribute('class', 'resizeRight');
					dropElement.appendChild(resizeRight);
					addEvent(resizeRight, 'mousedown', initResizeRight);
					addEvent(resizeRight, 'mouseup', stopResize);

					if (typeof scope.dragEnd === 'function') {
						scope.dragEnd(dropElementId);
					}

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

									var elementIndex = self.ngModel.find(function(element) {
										return element.id === dropElementId;
									})
									if (elementIndex) {
										elementIndex.duration = Math.floor(newWidth / self.options.gridWidth) + 1;
									} else {
										console.log('Resize element id was not found', dropElementId, elementIndex);
									}

									// Because the resize event happens outside of the angular
									// scope we need to force an apply so that the controller
									// we get the update too.
									self.$apply();
								}
							}
							resizingRight = false;
							resizingLeft = false;
							resizeElement = undefined;
						}
					}
					// Update the model with this new/changed element
					if (isNewElement) {
						self.ngModel.push({
							id:				dropElementId,
							column:			Math.floor(elementOffset.left / self.options.gridWidth) + 1,
							row:			Math.floor(elementOffset.top / self.options.gridHeight) + 1,
							duration:		Math.floor(elementOffset.width / self.options.gridWidth) + 1,
						});
					} else {
						var elementIndex = self.ngModel.find(function(element) {
							return element.id === dropElementId;
						})
						if (elementIndex) {
							elementIndex.column = Math.floor(elementOffset.left / self.options.gridWidth) + 1;
							elementIndex.row = Math.floor(elementOffset.top / self.options.gridHeight) + 1;
							elementIndex.duration = Math.floor(elementOffset.width / self.options.gridWidth) + 1;
						} else {
							console.log('Drop element id was not found', dropElementId, elementIndex);
						}
					}

					// Because the drop event happens outside of the angular
					// scope we need to force an apply so that the controller
					// we get the update too.
					self.$apply();

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
// console.log(element.getBoundingClientRect().top, parentTop, element);
console.log(parseInt(element.style.top.replace('px', '')))
								var offset = {
									// left:		element.getBoundingClientRect().left - parentLeft + viewPort.scrollLeft,
									// top:		element.getBoundingClientRect().top - parentTop,
									left:		parseInt(element.style.left.replace('px', '')),
									top:		parseInt(element.style.top.replace('px', '')),
									width:		element.clientWidth,
									height:		element.clientHeight
								};
// console.log(elementOffset, offset);
								// Check for a collision and if we have one then we will cancel
								// the drag event.
								if (offset.left < elementOffset.left + elementOffset.width && offset.left + offset.width > elementOffset.left && offset.top < elementOffset.top + elementOffset.height && offset.height + offset.top > elementOffset.top) {
console.log('Collision detected', offset, elementOffset);
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
