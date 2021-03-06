(function (ng) {

	/**
	 * Amount of selected seats required to send the seatLock requests in one request;
	 */
	var SINGLE_REQUEST_BARRIER = 1;

	/**
	 * Number of milliseconds to wait before a mousedown event becomes a long press event.
	 */
	var LONG_PRESS_DELAY = 600;

	ng.module('rc.directives').directive('rcSeatplanScroller', ['$q', '$timeout', '$interval', '$rootScope', '$window', function ($q, $timeout, $interval, $rootScope, $window) {

		var self = {};

		// Static variables
		const cmsSeatNoStatus = 0;
		const cmsSeatOwnLock = 1;
		const cmsSeatLocked = 2;
		const cmsSeatReserved = 3;
		const cmsSeatSold = 4;
		const cmsSeatReservedForPayment = 5;

		const cmsSeatTypeAisle = 0;
		const cmsSeatTypeNormal = 1;
		const cmsSeatTypeMobility = 2;
		const cmsSeatTypeBroken = 3;
		const cmsSeatTypeManager = 4;
		const cmsSeatTypeLoveLeft = 5;
		const cmsSeatTypeLoveRight = 6;
		const cmsSeatTypeLoveMiddle = 10;
		const cmsSeatTypeDBox = 7;
		const cmsSeatType4D = 8;
		const cmsSeatTypePremier = 9;
		const cmsSeatTypeTableSquare = 97;
		const cmsSeatTypeTableCircle = 98;
		const cmsSeatTypeRowLabel = 99;

		const MOBILITY_ICON = 0;
		const SOLD_ICON = 1;
		const RESERVED_ICON = 2;
		const LOCKED_ICON = 3;
		const OWNLOCK_ICON = 4;
		const NORMAL_ICON = 5;
		const BROKEN_ICON = 6;
		const MANAGER_ICON = 7;
		const LOVE_LEFT_ICON = 8;
		const LOVE_MIDDLE_ICON = 9;
		const LOVE_RIGHT_ICON = 10;
		const LOVE_LEFT_LOCKED_ICON = 11;
		const LOVE_MIDDLE_LOCKED_ICON = 12;
		const LOVE_RIGHT_LOCKED_ICON = 13;
		const LOVE_LEFT_OWNLOCK_ICON = 14;
		const LOVE_MIDDLE_OWNLOCK_ICON = 15;
		const LOVE_RIGHT_OWNLOCK_ICON = 16;
		const DBOX_ICON = 17;
		const FOUR_D_ICON = 18;
		const PREMIER_ICON = 19;

		var previousSection;
		var seatIcon;

		// Holds the index of the last seat the mouse was over so that we don't flood
		// the controller with mouse move events.
		self.lastOverIndex = null;

		return {

			restrict:			"E",
			templateUrl:		"/_templates/base/rc-seatplan-scroller",
			transclude:			false,

			scope: {
				id: "@rcId",
				data: "=",
				show: "=",
				options: "=",
				sectionDrawMode: "=",
				sections: "=",
				mobileDeviceId: "=",
				overrideShowLock: "=",
				rcSelectedSeats: "=",
				rcSeatSelect: "=",
				rcSeatSecondarySelect: "=",
				rcSeatOver: "=",
				rcSeatPlanError: "=",
				rcSeatPlanRefresh: "=",
				rcSectionSelect: "=",
				rcSectionDeselect: "=",
				// rcLockedSeats: "=",
				rcLockedSeatsChange: "="
			},

			link: function (scope, element, attrs) {

				var self = {};

				var hasTables = false;
				let firstThrough;
				let gridHeight;
				let gridWidth;
				let gridHeightMultiplier;
				let gridWidthMultiplier;
				let recalculateSize;
				let drawingSeatPlan;

				var seatGraphics = [];
				var responses = []
				var longPressTimer;
				var imagesLoaded = 0;

				// rcSeatLock.mobile_device_id = self.mobileDeviceId;
				// rcSeatLock.override_show_lock = self.overrideShowLock || false;

				const DEFAULT_OPTIONS = {
					gridZoom:				1,
					maxGridZoom:			5,
					zoomControls:			false,
					rowStyle:				'round',
					seatStyle:				'round',
					mobilityIcons:			true,
					mobilityIconBorder:		0.2,
					selectManager:			false,
					selectBroken:			false,
					drawAisle:				false,
					drawSeatNames:			true,
					rowLabelFont:			"10px Verdana",
					seatLabelFont:			[
						"10px Verdana",
						"20px Verdana",
						"30px Verdana",
						"40px Verdana",
						"50px Verdana",
					],
					override_show_lock:		false,
					colorScheme: {
						seatOverlayColor:	"#BBB",
						gridColor:			"#EAEAEA",
						sold:				"#C00",
						reserved:			"#F90",
						locked:				"#777",
						ownlock:			"gold",
						seatNormal:			"#EAEAEA",
						seatMobility:		"#89b4f9",
						seatBroken:			"#C00",
						seatManager:		"#800",
						seatLoveLeft:		"#EAD5E8",
						seatLoveMiddle:		"#DFC1DB",
						seatLoveRight:		"#D0A7CB",
						seatDBox:			"limegreen",
						seat4D:				"limegreen",
						seatPremier:		"indigo",
						aisle:				"white",
						table:				"#CC6600",
						rowLabelsBG:		"black",
						rowLabelsFG:		"white",
						seatLabelFG:		"#666",
						seatLabelFGAlt:		"white",
						seatLabelAisleFG:	'black'
					},
					svgFiles: {
						mobility_icon:				'/public/images/base/seat_svgs/seat_mobility.svg',
						sold_icon:					'/public/images/base/seat_svgs/seat_sold.svg',
						reserved_icon:				'/public/images/base/seat_svgs/seat_reserved.svg',
						locked_icon:				'/public/images/base/seat_svgs/seat_locked.svg',
						ownlock_icon:				'/public/images/base/seat_svgs/seat_ownlock.svg',
						normal_icon:				'/public/images/base/seat_svgs/seat_normal.svg',
						broken_icon:				'/public/images/base/seat_svgs/seat_broken.svg',
						manager_icon:				'/public/images/base/seat_svgs/seat_manager.svg',
						love_left_icon:				'/public/images/base/seat_svgs/seat_loveleft.svg',
						love_middle_icon:			'/public/images/base/seat_svgs/seat_lovemiddle.svg',
						love_right_icon:			'/public/images/base/seat_svgs/seat_loveright.svg',
						love_left_locked_icon:		'/public/images/base/seat_svgs/seat_loveleft_locked.svg',
						love_middle_locked_icon:	'/public/images/base/seat_svgs/seat_lovemiddle_locked.svg',
						love_right_locked_icon:		'/public/images/base/seat_svgs/seat_loveright_locked.svg',
						love_left_ownlock_icon:		'/public/images/base/seat_svgs/seat_loveleft_ownlock.svg',
						love_middle_ownlock_icon:	'/public/images/base/seat_svgs/seat_lovemiddle_ownlock.svg',
						love_right_ownlock_icon:	'/public/images/base/seat_svgs/seat_loveright_ownlock.svg',
						dbox_icon:					'/public/images/base/seat_svgs/seat_dbox.svg',
						four_d_icon:				'/public/images/base/seat_svgs/seat_4d.svg',
						premier_icon:				'/public/images/base/seat_svgs/seat_premier.svg'
					}
				};
				scope.seatplan_options = ng.extend(DEFAULT_OPTIONS, scope.options || {});

				// Dynamically load the SVG images that we use on the seat plan
				var svgFileCount = Object.keys(scope.seatplan_options.svgFiles).length;
				for (source in scope.seatplan_options.svgFiles) {
					loadSVGImage(source);
				}

				function loadSVGImage(source) {
					var svgImage = new Image();
					svgImage.src = scope.seatplan_options.svgFiles[source];
					svgImage.onload = function() {
						imagesLoaded++
					};
					seatGraphics.push(svgImage)
				}

				// self.seatPlanCanvas.id = scope.id;
				self.seatPlanCanvasId = scope.id;
				self.seatPlanCanvas = ng.element(element.find('canvas')[0]);
				self.seatPlanContext = element.find('canvas')[0].getContext('2d');
/*
				if (typeof scope.rcLockedSeats === 'undefined') {
					debug.log('rcLockedSeats is undefined');
					scope.rcLockedSeats = [];
				}
*/
				var seatUnlocked = false

				// Code added to handle the zooming of the seat plan
				const scroller = document.getElementById('seatPlanScroller');
				const scrollerCanvas = ng.element(scroller)[0];
				const scrollerContainer = document.getElementById('seatPlanContainer');

				// debug.log('init', 'scrollerContainer.clientWidth', scrollerContainer.clientWidth, 'scrollerCanvas.clientWidth', scrollerCanvas.clientWidth);

				scope.setZoom = function(increment) {

					if (increment > 0 && scope.seatplan_options.gridZoom < scope.seatplan_options.maxGridZoom) {
						scope.seatplan_options.gridZoom++;
					} else if (increment < 0 && scope.seatplan_options.gridZoom > 1) {
						scope.seatplan_options.gridZoom--;
					} else if (increment == 0) {
						scope.seatplan_options.gridZoom = 1;
					}

					if (scope.seatplan_options.gridZoom == 1) {
						scroller.scrollLeft = 0;
						scroller.scrollTop = 0;
					}

					$('#' + scope.id).height(gridHeight * scope.seatplan_options.gridZoom).width(gridWidth * scope.seatplan_options.gridZoom);
					$('#' + scope.id).attr('height', gridHeight * scope.seatplan_options.gridZoom).attr('width', gridWidth * scope.seatplan_options.gridZoom);

					// After resizing a canvas element, it is necessary to redraw as the browser clears its content
					if (!drawingSeatPlan) {
						debug.log('scope.setZoom');
						drawSeatPlan();
					}

					debug.log('setZoom', increment, 'gridZoom', scope.seatplan_options.gridZoom, 'height', gridHeight * scope.seatplan_options.gridZoom, 'width', gridWidth * scope.seatplan_options.gridZoom);
				}

				scope.resizeDirective = function() {

					recalculateSize = true;

					// If the seat plan container is visible then we can calculate the
					// width of it. Otherwise we have to wait until it is visible and
					// then calculate the width.
					if ($('#seatPlanContainer').is(":visible")) {

						// Calculate the necessary width to apply to the scroller container
						$(scroller).height((scrollerCanvas.clientWidth / 2));
						if (scope.seatplan_options.zoomControls) {
							$(scrollerContainer).height(scrollerCanvas.offsetHeight + (scope.seatplan_options.largeButtons ? 70 : 50));
						} else {
							$(scrollerContainer).height(scrollerCanvas.offsetHeight);
						}

						gridHeight = scrollerCanvas.offsetHeight;
						gridWidth = scrollerCanvas.clientWidth;

						// Calculate the grid multiplier to be used based on the original grid coordinates
						// that we calculated on the 800 x 600 grid.
						gridWidthMultiplier = gridWidth / 800;
						gridHeightMultiplier = gridHeight / 400;

						recalculateSize = false;
						debug.log('resizeDirective', 'gridZoom', scope.seatplan_options.gridZoom, 'gridHeight', gridHeight, 'gridWidth', gridWidth, 'gridHeightMultiplier', gridHeightMultiplier, 'gridWidthMultiplier', gridWidthMultiplier);

						if (!drawingSeatPlan) {
							debug.log('scope.resizeDirective');
							scope.setZoom(0);
							drawSeatPlan();
						}
					}
				}
				scope.resizeDirective();

				scope.scrollSeatPlan = function(scrollDirection) {

					let self = this;
					const scrollIncrement = 100 * scope.seatplan_options.gridZoom;

					if (scrollDirection == 1) {
						scroller.scrollLeft -= scrollIncrement;
					} else if (scrollDirection == 2) {
						scroller.scrollTop += scrollIncrement;
					} else if (scrollDirection == 3) {
						scroller.scrollTop -= scrollIncrement;
					} else if (scrollDirection == 4) {
						scroller.scrollLeft += scrollIncrement;
					}

				}

				function getLuminance(colour) {

					var colour = colour.substring(1);	// strip #
					var rgb = parseInt(colour, 16);		// convert rrggbb to decimal
					var r = (rgb >> 16) & 0xff;			// extract red
					var g = (rgb >>  8) & 0xff;			// extract green
					var b = (rgb >>  0) & 0xff;			// extract blue

					return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

				}

				function drawSeatPlan() {

					if (!drawingSeatPlan) {
						$timeout(function() {
							// Only load the seat plan once all the SVG images are loaded
							if (imagesLoaded >= svgFileCount) {
								debug.log('All SVG images loaded');
								drawTheSeatPlan();
							} else {
								debug.log('Waiting for SVG images to load');
								drawSeatPlan()
							}
						}, 200);
					}

				}

				function drawTheSeatPlan() {

					// Flag to prevent a double draw when the directive is being
					// resized.
					drawingSeatPlan = true;
					debug.log('Draw Seat Plan');

					if (recalculateSize) {
						scope.resizeDirective();
					}

					if (self.seatPlanData) {

						firstThrough = true;
						debug.log('drawSeatPlan', scope.seatplan_options.gridZoom, 'height', gridHeight * scope.seatplan_options.gridZoom, 'width', gridWidth * scope.seatplan_options.gridZoom);

						// Clear the currently drawn seat plan
						// self.seatPlanContext.clearRect(0, 0, gridWidth * scope.seatplan_options.gridZoom, gridHeight * scope.seatplan_options.gridZoom);
						self.seatPlanContext.clearRect(0, 0, document.getElementById(self.seatPlanCanvasId).width, document.getElementById(self.seatPlanCanvasId).height);

						// Because the canvas doesn't use co-ordinates that match the exact pixels
						// on the screen then we have to offset everything by 0.5 because we are
						// only drawing 1 pixel width lines. See the following link for more:
						// http://www.mobtowers.com/html5-canvas-crisp-lines-every-time/
						self.seatPlanContext.save();
						self.seatPlanContext.lineWidth = 1;
						self.seatPlanContext.translate(0.5, 0.5);
						self.seatPlanContext.imageSmoothingEnabled = false;

						for (var seatNumber in self.seatPlanData) {
							drawSeat(seatNumber);
						}

						self.seatPlanContext.restore();
						// Uncomment for intelligent seat suggestions:
						//	getHighestValueSelectableGroup(scope.options.selectMode).forEach(function (seat) {
						//		drawSeat(seat, true);
						//	});
					}

					drawingSeatPlan = false;

				}

				function drawSeat(seatNumber, highlight) {

					var seatData = ng.copy(self.seatPlanData[seatNumber]);
					var seatType = seatData.seat_type;
					var seatStatus = seatData.seat_status;

					// Calculate the center and radius needed to draw circles
					var centerX = Math.floor(seatData.position_left) + (Math.floor(seatData.width) / 2);
					var centerY = Math.floor(seatData.position_top) + (Math.floor(seatData.height) / 2);
					var radiusX = (Math.floor(seatData.width) / 2);
					var radiusY = (Math.floor(seatData.height) / 2);

					centerX = centerX * scope.seatplan_options.gridZoom * gridWidthMultiplier;
					centerY = centerY * scope.seatplan_options.gridZoom * gridHeightMultiplier;
					radiusX = radiusX * scope.seatplan_options.gridZoom * gridWidthMultiplier;
					radiusY = radiusY * scope.seatplan_options.gridZoom * gridHeightMultiplier;

					seatData.position_left = Math.floor(seatData.position_left * scope.seatplan_options.gridZoom * gridWidthMultiplier);
					seatData.position_top = Math.floor(seatData.position_top * scope.seatplan_options.gridZoom * gridHeightMultiplier);
					seatData.width = Math.floor(seatData.width * scope.seatplan_options.gridZoom * gridWidthMultiplier);
					seatData.height = Math.floor(seatData.height * scope.seatplan_options.gridZoom * gridHeightMultiplier);

					if (firstThrough) {
						debug.log('drawSeat', 'centerX', centerX, 'centerY', centerY, 'radiusX', radiusX, 'radiusY', radiusY);
					}
					if (seatType === cmsSeatTypeAisle) {

						if (scope.seatplan_options.drawAisle) {

							self.seatPlanContext.beginPath();
							self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.aisle;
							self.seatPlanContext.fillRect(Math.floor(seatData.position_left), Math.floor(seatData.position_top), Math.floor(seatData.width), Math.floor(seatData.height));
							self.seatPlanContext.closePath();
							self.seatPlanContext.stroke();

							// If the Seat Name starts with a * then we will display
							// the seat name on the seat plan even though it's an aisle.
							// This can be used to differentiate a Balconey from the rest
							// of the seats in the screen.
							if (seatData.seat_name && seatData.seat_name.indexOf('*') == 0) {
								var seatName = seatData.seat_name.substring(1);
								drawSeatName(seatData, seatName)
							}

						}

					// Tables are drawn as circles or squares depending on the type
					} else if (seatType === cmsSeatTypeTableCircle) {

						self.seatPlanContext.beginPath();
						self.seatPlanContext.strokeStyle = scope.seatplan_options.colorScheme.table;
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.table;
						try {
							self.seatPlanContext.ellipse(centerX, centerY, radiusX, radiusY, 0, 2 * Math.PI, false);
						} catch (ex) {
							self.seatPlanContext.arc(centerX, centerY, radiusX, 0, 2 * Math.PI, false);
						}
						self.seatPlanContext.fill();
						self.seatPlanContext.closePath();
						self.seatPlanContext.stroke();

						// If the Seat Name starts with a * then we will display
						// the seat name on the seat plan even though it's an aisle.
						// This can be used to differentiate a Balconey from the rest
						// of the seats in the screen.
						if (seatData.seat_name && seatData.seat_name.indexOf('*') == 0) {
							var seatName = seatData.seat_name.substring(1);
							drawSeatName(seatData, seatName, true)
						}

					// Tables are drawn as circles or squares depending on the type
					} else if (seatType === cmsSeatTypeTableSquare) {

						self.seatPlanContext.beginPath();
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.gridColor;
						self.seatPlanContext.rect(seatData.position_left, seatData.position_top, seatData.width, seatData.height);
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.table;
						self.seatPlanContext.fillRect(Math.floor(seatData.position_left), Math.floor(seatData.position_top), Math.floor(seatData.width), Math.floor(seatData.height));
						self.seatPlanContext.closePath();
						self.seatPlanContext.stroke();

						// If the Seat Name starts with a * then we will display
						// the seat name on the seat plan even though it's an aisle.
						// This can be used to differentiate a Balconey from the rest
						// of the seats in the screen.
						if (seatData.seat_name && seatData.seat_name.indexOf('*') == 0) {
							var seatName = seatData.seat_name.substring(1);
							drawSeatName(seatData, seatName, true)
						}

					} else if (seatType === cmsSeatTypeRowLabel) {

						// Row Name Label
						self.seatPlanContext.beginPath();
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.rowLabelsBG;
						self.seatPlanContext.strokeStyle = scope.seatplan_options.colorScheme.rowLabelsBG;

						if (scope.seatplan_options.rowStyle == 'square') {
							self.seatPlanContext.fillRect(Math.floor(seatData.position_left), Math.floor(seatData.position_top), Math.floor(seatData.width), Math.floor(seatData.height));
							self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.rowLabelsFG;
							self.seatPlanContext.closePath();
							self.seatPlanContext.stroke();
						} else {
							try {
								self.seatPlanContext.ellipse(centerX, centerY, radiusX, radiusY, 0, 2 * Math.PI, false);
							} catch (ex) {
								self.seatPlanContext.arc(centerX, centerY, radiusX, 0, 2 * Math.PI, false);
							}
							self.seatPlanContext.fill();
						}

						// Row Name Label Text
						drawSeatName(seatData, seatData.row_name)

					} else {

						if (scope.seatplan_options.seatStyle == 'seat_svg' && seatData.seat_type !== cmsSeatTypeMobility) {

							if (seatStatus === cmsSeatSold || seatStatus === cmsSeatReservedForPayment || (!scope.seatplan_options.selectBroken && (seatType === cmsSeatTypeBroken))) {
								seatIcon = seatGraphics[SOLD_ICON];
							} else if (seatStatus === cmsSeatReserved) {
								seatIcon = seatGraphics[RESERVED_ICON];
							} else if (seatStatus === cmsSeatLocked) {
								if (seatType === cmsSeatTypeLoveLeft) {
									seatIcon = seatGraphics[LOVE_LEFT_LOCKED_ICON];
								} else if (seatType === cmsSeatTypeLoveMiddle) {
									seatIcon = seatGraphics[LOVE_MIDDLE_LOCKED_ICON];
								} else if (seatType === cmsSeatTypeLoveRight) {
									seatIcon = seatGraphics[LOVE_RIGHT_LOCKED_ICON];
								} else {
									seatIcon = seatGraphics[LOCKED_ICON];
								}
							} else if (seatStatus === cmsSeatOwnLock) {
								if (seatType === cmsSeatTypeLoveLeft) {
									seatIcon = seatGraphics[LOVE_LEFT_OWNLOCK_ICON];
								} else if (seatType === cmsSeatTypeLoveMiddle) {
									seatIcon = seatGraphics[LOVE_MIDDLE_OWNLOCK_ICON];
								} else if (seatType === cmsSeatTypeLoveRight) {
									seatIcon = seatGraphics[LOVE_RIGHT_OWNLOCK_ICON];
								} else {
									seatIcon = seatGraphics[OWNLOCK_ICON];
								}
							} else if (seatType === cmsSeatTypeNormal || (!scope.seatplan_options.selectManager && (seatType === cmsSeatTypeManager))) {
								seatIcon = seatGraphics[NORMAL_ICON];
							} else if (seatType === cmsSeatTypeBroken) {
								seatIcon = seatGraphics[BROKEN_ICON];
							} else if (seatType === cmsSeatTypeManager) {
								seatIcon = seatGraphics[MANAGER_ICON];
							} else if (seatType === cmsSeatTypeLoveLeft) {
								seatIcon = seatGraphics[LOVE_LEFT_ICON];
							} else if (seatType === cmsSeatTypeLoveMiddle) {
								seatIcon = seatGraphics[LOVE_MIDDLE_ICON];
							} else if (seatType === cmsSeatTypeLoveRight) {
								seatIcon = seatGraphics[LOVE_RIGHT_ICON];
							} else if (seatType === cmsSeatTypeDBox) {
								seatIcon = seatGraphics[DBOX_ICON];
							} else if (seatType === cmsSeatType4D) {
								seatIcon = seatGraphics[FOUR_D_ICON];
							} else if (seatType === cmsSeatTypePremier) {
								seatIcon = seatGraphics[PREMIER_ICON];
							}

							try {
								self.seatPlanContext.drawImage(seatIcon, Math.round(seatData.position_left), Math.round(seatData.position_top), Math.round(seatData.width), Math.round(seatData.height));
							} catch (ex) {
								console.log('Seat plan drawing failed due to an exception: ' + ex);
							}

						} else {

							self.seatPlanContext.beginPath();
							self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.gridColor;

							if (scope.sectionDrawMode) {

								if (!seatData.cinema_screen_section_id) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatNormal;
								} else {
									self.seatPlanContext.fillStyle = scope.sections.find(function(section) {
										return section.cinema_screen_section_id == seatData.cinema_screen_section_id;
									}).cinema_screen_section_colour;
								}

							} else {

								if (seatStatus === cmsSeatSold || seatStatus === cmsSeatReservedForPayment || (!scope.seatplan_options.selectBroken && (seatType === cmsSeatTypeBroken))) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.sold;
								} else if (seatStatus === cmsSeatReserved) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.reserved;
								} else if (seatStatus === cmsSeatLocked) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.locked;
								} else if (seatStatus === cmsSeatOwnLock) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.ownlock;
								} else if (seatType === cmsSeatTypeNormal || (!scope.seatplan_options.selectManager && (seatType === cmsSeatTypeManager))) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatNormal;
								} else if (seatType === cmsSeatTypeMobility) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatMobility;
								} else if (seatType === cmsSeatTypeBroken) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatBroken;
								} else if (seatType === cmsSeatTypeManager) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatManager;
								} else if (seatType === cmsSeatTypeLoveLeft) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLoveLeft;
								} else if (seatType === cmsSeatTypeLoveMiddle) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLoveMiddle;
								} else if (seatType === cmsSeatTypeLoveRight) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLoveRight;
								} else if (seatType === cmsSeatTypeDBox) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatDBox;
								} else if (seatType === cmsSeatType4D) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seat4D;
								} else if (seatType === cmsSeatTypePremier) {
									self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatPremier;
								}
								if (highlight)
									self.seatPlanContext.fillStyle = '#bde0ff';
							}

							// Seat Place Marker
							if (scope.seatplan_options.seatStyle == 'square' || scope.seatplan_options.seatStyle == 'seat' || scope.seatplan_options.seatStyle == 'seat_svg') {

								self.seatPlanContext.fillRect(Math.floor(seatData.position_left), Math.floor(seatData.position_top), Math.floor(seatData.width), Math.floor(seatData.height));
								self.seatPlanContext.closePath();
								self.seatPlanContext.stroke();

								if (scope.seatplan_options.seatStyle == 'seat' && seatData.seat_type !== cmsSeatTypeMobility) {
									drawSeatOverlay(seatData, seatType);
								}

							} else {

								if (scope.seatplan_options.seatStyle == 'round_noborder') {
									self.seatPlanContext.strokeStyle = self.seatPlanContext.fillStyle;
								} else {
									self.seatPlanContext.strokeStyle = '#000000';
								}

								try {
									self.seatPlanContext.ellipse(centerX, centerY, radiusX, radiusY, 0, 2 * Math.PI, false);
								} catch (ex) {
									self.seatPlanContext.arc(centerX, centerY, radiusX, 0, 2 * Math.PI, false);
								}
								self.seatPlanContext.fill();

								self.seatPlanContext.closePath();
								self.seatPlanContext.stroke();

							}

							if (seatData.seat_type === cmsSeatTypeMobility && scope.seatplan_options.mobilityIcons) {
								// Calculate a position that will place the icon inside the
								// seat with some border.
								let borderLeft = Math.floor(seatData.width * scope.seatplan_options.mobilityIconBorder);
								let borderTop = Math.floor(seatData.height * scope.seatplan_options.mobilityIconBorder);
								self.seatPlanContext.drawImage(seatGraphics[MOBILITY_ICON], Math.floor(seatData.position_left + borderLeft), Math.floor(seatData.position_top + borderTop), Math.floor(seatData.width - (borderLeft * 2)), Math.floor(seatData.height - (borderTop * 2)));
							} else {
								if (scope.seatplan_options.drawSeatNames) {
									drawSeatName(seatData, seatData.seat_name);
								}
							}

						}

					}
					firstThrough = false;
				}
				function calculateFontSize(width, height, contentLength) {
					var area = width * height;
					// Provides the font-size in points scaled tp 75%.
					return Math.sqrt(area / contentLength) * 0.75;
				}
				function drawSeatName(seatData, seatName, luminosity) {

					var fontSize = calculateFontSize(seatData.width, seatData.height, 3);
					var elementWidth = scope.seatplan_options.gridZoom * gridWidthMultiplier;

					self.seatPlanContext.beginPath();

					if (seatData.seat_type === cmsSeatTypeRowLabel) {
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.rowLabelsFG;
					} else if (seatData.seat_type === cmsSeatTypeAisle) {
						self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLabelAisleFG;
					} else {
						if (scope.sectionDrawMode || luminosity) {
							// Determine if we are working with a dark colour and set the
							// text colour appropriately.
							if (getLuminance(self.seatPlanContext.fillStyle) < 128) {
								self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLabelFGAlt;
							} else {
								self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLabelFG;
							}
						} else {
							if (seatData.seat_type === cmsSeatTypeManager || seatData.seat_type === cmsSeatTypePremier || seatData.seat_type === cmsSeatTypeBroken) {
								self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLabelFGAlt;
							} else {
								self.seatPlanContext.fillStyle = scope.seatplan_options.colorScheme.seatLabelFG;
							}
						}
					}

					self.seatPlanContext.font = fontSize + 'pt Verdana';
					self.seatPlanContext.textBaseline = "middle";
					var textWidth = self.seatPlanContext.measureText(seatName).width * elementWidth;
					var textPosition = {
						left:	(Math.floor(seatData.position_left) + Math.floor(seatData.width / 2)) - (textWidth / (2 * elementWidth)),
						top:	(Math.floor(seatData.position_top) + Math.floor(seatData.height / 2))
					}
					self.seatPlanContext.fillText(seatName, textPosition.left, textPosition.top);
					self.seatPlanContext.closePath();
					self.seatPlanContext.stroke();

				}

				function drawSeatOverlay(seatData, seatType) {

					// For all seat types we will draw a "seat" overlay. First we
					// calculate the 4 points for the seat dimensions.
					var offsetLeft = Math.floor(seatData.width / 6);
					var offsetTop = Math.floor(seatData.height / 6);
					var overlay = {
						top_left: {
							x: Math.floor(seatData.position_left + offsetLeft),
							y: Math.floor(seatData.position_top + offsetTop)
						},
						top_right: {
							x: Math.floor(seatData.position_left + seatData.width - offsetLeft),
							y: Math.floor(seatData.position_top + offsetTop)
						},
						bottom_left: {
							x: Math.floor(seatData.position_left + offsetLeft),
							y: Math.floor(seatData.position_top + seatData.height - offsetTop)
						},
						bottom_right: {
							x: Math.floor(seatData.position_left + seatData.width - offsetLeft),
							y: Math.floor(seatData.position_top + seatData.height - offsetTop)
						}
					};

					self.seatPlanContext.beginPath();
					self.seatPlanContext.strokeStyle = scope.seatplan_options.colorScheme.seatOverlayColor;

					// Draw a line starting at the top left of the seat and go all the way around
					// so that we close the path for the gradient fill.
					if (seatType === cmsSeatTypeLoveLeft) {
						self.seatPlanContext.moveTo(seatData.position_left, seatData.position_top);
						self.seatPlanContext.lineTo(overlay.top_left.x, overlay.top_left.y);
						self.seatPlanContext.lineTo(overlay.bottom_left.x, overlay.bottom_left.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, overlay.bottom_right.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top);

					} else if (seatType === cmsSeatTypeLoveMiddle) {

						self.seatPlanContext.moveTo(seatData.position_left, overlay.bottom_left.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, overlay.bottom_left.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top + seatData.height);

					} else if (seatType === cmsSeatTypeLoveRight) {
						self.seatPlanContext.moveTo(seatData.position_left, seatData.position_top + seatData.height - offsetTop);
						self.seatPlanContext.lineTo(overlay.bottom_right.x, overlay.bottom_right.y);
						self.seatPlanContext.lineTo(overlay.top_right.x, overlay.top_right.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top + seatData.height - offsetTop);

					} else {
						self.seatPlanContext.moveTo(seatData.position_left, seatData.position_top);
						self.seatPlanContext.lineTo(overlay.top_left.x, overlay.top_left.y);
						self.seatPlanContext.lineTo(overlay.bottom_left.x, overlay.bottom_left.y);
						self.seatPlanContext.lineTo(overlay.bottom_right.x, overlay.bottom_right.y);
						self.seatPlanContext.lineTo(overlay.top_right.x, overlay.top_right.y);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top);
						self.seatPlanContext.lineTo(seatData.position_left + seatData.width, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top + seatData.height);
						self.seatPlanContext.lineTo(seatData.position_left, seatData.position_top);
					}

					self.seatPlanContext.closePath();

					// Now create a graident fill using the seat colour and a 20%
					// darker colour as the starting point.
					var grd = self.seatPlanContext.createLinearGradient(seatData.position_left + (seatData.width / 2), seatData.position_top + seatData.height, seatData.position_left + (seatData.width / 2), seatData.position_top);

					grd.addColorStop(0, ColorLuminance(self.seatPlanContext.fillStyle, -0.2));
					grd.addColorStop(1, self.seatPlanContext.fillStyle);
					self.seatPlanContext.fillStyle = grd;

					self.seatPlanContext.fill();
					self.seatPlanContext.stroke();

				}

				function seatOver(element) {

					var thisSeat = getSeat(element.offsetX, element.offsetY);
					// debug.log('seatOver', thisSeat);
					if (thisSeat) {

						if (self.lastOverIndex !== thisSeat.cinema_seatplan_id) {
							self.lastOverIndex !== thisSeat.cinema_seatplan_id;
							// debug.log("Mouse over seat " + seatIndex + " (" + element.offsetX + "," + element.offsetY + ") in directive");
							if (typeof (scope.rcSeatOver) === 'function') {
								scope.rcSeatOver(element, thisSeat);
							}
							if (thisSeat.seat_type !== 0 && thisSeat.seat_type !== 99) {
								$('#' + self.seatPlanCanvasId).addClass('pointer');
							} else {
								$('#' + self.seatPlanCanvasId).removeClass('pointer');
							}
						}

					} else {
						$('#' + self.seatPlanCanvasId).removeClass('pointer');
					}
				}

				function seatSelect(element) {
					//				debug.log("Seat " + element.offsetX + "," + element.offsetY + " selected in directive");
					var thisSeat = getSeat(element.offsetX, element.offsetY);

					if (thisSeat) {
						debug.log(thisSeat, "(" + element.offsetX + "," + element.offsetY + ")", "Seat selected in directive");
						if (scope.options.lockSeats) {
							var thisLockStatus = seatSelected(element, thisSeat);
						}
						if (typeof (scope.rcSeatSelect) === 'function') {
							debug.log('Raising seat select event');
							scope.rcSeatSelect(element, thisSeat, thisLockStatus);
						}
					}
				}

				// This function uses the x and y co-ordinates to determine where on the
				// canvas the user clicked and if that is a valid seat or not. If the user
				// clicks in the aisles then that will be ignored but every other seat can
				// be selected.
				function getSeat(x, y) {

					// Calculate the scaled offset depending on the scaling of the original
					// canvas that we used.
					var offsetX = ((x / gridWidthMultiplier) / self.seatPlanCanvas.width()) * gridWidth;
					var offsetY = ((y / gridHeightMultiplier) / self.seatPlanCanvas.height()) * gridHeight;

					var thisSeat = null;

					for (var seatNumber in self.seatPlanData) {

						var seatData = self.seatPlanData[seatNumber];
						var left = seatData.position_left, right = seatData.position_left + seatData.width;
						var top = seatData.position_top, bottom = seatData.position_top + seatData.height;

						if (right >= offsetX && left <= offsetX && bottom >= offsetY && top <= offsetY) {
							return seatData;
						}
					}

					return thisSeat;

				}

				// This functions takes the information from the seatSelect function and work out which seats needs to be locked
				function seatSelected(element, seatData) {

					debug.log("Seat selected in the seatplan directive", seatData);
					var seatIndex;
					if (seatData.seat_type !== cmsSeatTypeAisle && seatData.seat_type !== cmsSeatTypeBroken && seatData.seat_type !== cmsSeatTypeTableCircle && seatData.seat_type !== cmsSeatTypeTableSquare) {
						seatIndex = (function (arr, data) {
							for (var i = 0; i < arr.length; i++) {
								if (arr[i].cinema_seatplan_id === data.cinema_seatplan_id) {
									return i;
								}
							}
						})(scope.data, seatData);

						var thisRowName = seatData.row_name;

						if (!isValidSection(seatData)) {
							debug.log("Seat selected is not in a previously selected Section", seatData, previousSection);
							if (typeof scope.rcSeatPlanError === "function") {
								scope.rcSeatPlanError("$dict{seat_section_invalid}");
							}
						} else {
							if (isSeatAvailable(seatData, cmsSeatLocked)) {

								let selectedSeat = scope.data[seatIndex];
								let requiredSeats = scope.options.selectMode;

								// If the selected seat is locked by the user, then we have to set the lock mode to unlock
								if (selectedSeat.seat_status === cmsSeatOwnLock) {
									unlockSeats(selectedSeat, thisRowName, requiredSeats);

								} else {
									lockSeats(selectedSeat, thisRowName, requiredSeats);
								}
							}
						}
					}
					//TODO: uncomment scope.$apply() if needed.
					// Because this function was called from the Directive, it was outside
					// the scope, so we need to call $apply to get the scope to update.
					//scope.$apply();

				}

				/**
				 * Returns an array of seats that are selectable based on the selectedSeatIndex in the current row.
				 * TODO: Use this function for intelligent seat suggestion highlighting.
				 */
				function getSelectableRegion(rowName, seat, ownLocks) {

					// Boolean flag for efficient 'contains null item' check. When we set an item to null, then we know there is at least on null item in the array. (no need for another loop ;) )
					var hasNullItem = false;

					// Clear the indicator that determines if there are tables in
					// the region.
					hasTables = false;

					// Filter the original data by row name.
					var row = scope.data.filter(function (item) {
						return item.row_name == rowName;
						// Set all non/selectable items to null for easier filtering later.
					}).map(function (item) {
						if (!ownLocks) {
							if (item.seat_status !== cmsSeatNoStatus) {
								if (!hasNullItem) hasNullItem = true;
								return null;
							}
						} else {
							if (item.seat_status !== cmsSeatNoStatus && item.seat_status !== cmsSeatOwnLock) {
								if (!hasNullItem) hasNullItem = true;
								return null;
							}
						}
						if (item.seat_type === cmsSeatTypeAisle || item.seat_type === cmsSeatTypeRowLabel || item.seat_type === cmsSeatTypeBroken) {
							if (!hasNullItem) hasNullItem = true;
							return null;
						}
						if (item.seat_type === cmsSeatTypeTableCircle || item.seat_type === cmsSeatTypeTableSquare) {
							hasTables = true;
						}
						return item;
					});
					// console.log('Calculated Row', row);

					// When the row has no null items, the whole row is selectable. No need for further calculations.
					if (!hasNullItem) {
						// console.log('No null items - Row selectable');
						return row;
					}

					// Remove any tables from the seat plan as they don't break
					// the seat selection, but they are not lockable as seats.
					row = row.filter(function(item) {
						// console.log(item);
						return !item || (item.seat_type !== cmsSeatTypeTableCircle && item.seat_type !== cmsSeatTypeTableSquare);
					})

					// Get the index of the selected seat in the row.
					var seatIndex = row.findIndex(function (item) {
						return item && (item.cinema_seatplan_id === seat.cinema_seatplan_id)
					})
					// Set left to seatIndex, so we can start going left from the selected seat.
					var left = seatIndex;

					if (seatIndex >= 0 && seatIndex < row.length) {
						// Move the left pointer to the left until we find a null item.
						while (row[left] !== null && left >= 0) left--;
						// Remove all items to the left from the first null that is left of the selected seat.
						row.splice(0, left + 1);
						// Now the array starts with a selectable (not null) item and that item is part of the region.
						// Now we have to remove all items from the first null item to get the actual region.
						row.splice(row.indexOf(null), row.length);
					}
					// console.log('Calculated Region', row);
					return row;
				}

				/**
				 * WARN: Only use for single seat locking (One seat locking attempt / request)
				 */
				function callAddSeatLock(index, items, requiredSeats) {
/*
					if (index < items.length && responses.length < requiredSeats) {

						rcSeatLock.lock(scope.show.show_time_id, [items[index]]).then(function (response) {
							if (Array.isArray(response) && response.length === 1) {
								if (response[0].seat_lock_id !== 0) {
									responses.push(response);

								} else {
									// There was an error locking seats.
									console.error("Failed to lock seats", typeof scope.rcSeatPlanError === "function");
									if (typeof scope.rcSeatPlanError === "function")
										scope.rcSeatPlanError(response[0]);
								}
							}
							// Move to the next seat as quickly as possible.
							// (Updates the statuses from the last successful lock to the first one)
							callAddSeatLock(++index, items, requiredSeats);
							// Move to the next
						}).catch(function (error) {
							console.warn("Seat lock failed: " + error);
						});
					} else {
						// TODO: display warning message if needed.
						responses.forEach(function (response) {
							updateSeatStatuses(response, cmsSeatOwnLock);
						});
						// We have to give angular time to execute a digest loop, so the locked seats are updated everywhere ;)
						updateLockedSeats();
						$timeout(function () {
							dataSetChanged();
							scope.rcLockedSeatsChange(responses.length, 0);
						});
					}
*/
				}

				/**
				 * Create seatlocks for multiple seats in one transaction.
				 * More efficient then callAddSeatLock
				 */
				function callAddSeatLocksBulk(items, requiredSeats) {
/*
					// console.log('Attempt to lock ' + items + ' items');
					// console.log('Attempt to lock ' + requiredSeats + ' seats');
					rcSeatLock.lock(scope.show.show_time_id, items).then(function (response) {

						let numberOfLockedSeats = 0;

						if (Array.isArray(response)) {
							// updateSeatStatuses(response, cmsSeatOwnLock);
							response.forEach(function (thisSeat) {
								if (thisSeat.seat_lock_id !== 0) {
									numberOfLockedSeats++;
								}
							})
						}
						// console.log('Locked ' + numberOfLockedSeats + ' seats');

						if (numberOfLockedSeats !== requiredSeats) {
							console.error("Failed to lock seats");
							if (typeof scope.rcSeatPlanError === "function") {
								scope.rcSeatPlanError(response);
							}
						} else {
							updateSeatStatuses(response, cmsSeatOwnLock);
							updateLockedSeats();
							dataSetChanged();
							$timeout(function () {
								scope.rcLockedSeatsChange(response.length, 0);
							});
						}

					}).catch(function (error) {
						console.warn("Seat lock failed: " + error);
					});
*/
				}

				function handleSeatLocks(items, requiredSeats) {
					responses = [];

					// If requiredSeats is greater than the single request barrier, then try and add the locks in one transaction.
					if (requiredSeats >= SINGLE_REQUEST_BARRIER) {
						callAddSeatLocksBulk(items, requiredSeats);
					} else {
						callAddSeatLock(0, items, requiredSeats);
					}

				}

				function validateSeatIndex(region, seatIndex, requiredSeats) {
					/*
					Pseudo Logic
					------------

					- Check to see if there is more than one seat free on either
					  side of the selected region. If there are two or more seats
					  free on either side the selection is valid
					- If there is one seat on one side, and two or more seats
					  free on the other side then we move the index to the side
					  with one seat
					- If there is one seat on one side and one seat on the other
					  side then move the index to the side with one seat.

					*/
					// console.log('region', region, 'seatIndex', seatIndex, 'region.length', region.length, 'requiredSeats', requiredSeats);
					// Check to see if the user selected a seat at either end of
					// the available region
					if (seatIndex === 0 || seatIndex === (region.length - 1) || (seatIndex + (requiredSeats - 1)) === (region.length - 1)) {
						// console.log('User selected seat at region end - Valid')
						if (seatIndex === 0) {
							return seatIndex;
						} else {
							return region.length - requiredSeats;
						}
					// Check if the user selected a seat in the middle of the
					// available region and leaves at least two seats on either side.
					} else if ((seatIndex >= 2 && seatIndex + (requiredSeats - 1) <= region.length - 3)) {
						// console.log('User selected seat in the middle of the region - Valid')
						return seatIndex;

					// If any seat on either side of the selection is a different
					// type then this is a valid selection.
					} else if ((region[seatIndex].seat_type !== region[seatIndex - 1].seat_type) || (region[seatIndex].seat_type !== region[seatIndex + 1].seat_type)) {
						// console.log('User selected seat with a different type to one of the neighbours - Valid')
						return seatIndex;

					// If there are any tables in the region then we allow any
					// seat to be selected.
					} else if (hasTables) {
						// console.log('Region has tables')
						return seatIndex;

					// The is an invalid selection so we have to move the selection
					// to the leftmost position
					} else {
						// console.log('Invalid selection');
						// If the user selection would extend past the end of the region
						// then we put it to the left until it will fit in the gap.
						if ((seatIndex + (requiredSeats - 1)) >= region.length) {
							// If there are odd number of free seats available in the region
							// then we just move the seatIndex to a position where
							// it can fill the number of required seats from the left.
							while (seatIndex + (requiredSeats - 1) >= region.length) {
								seatIndex--;
							}
						// Otherwise we just shift it to the start/end of the region
						} else {
							if (seatIndex < (region.length / 2)) {
								seatIndex = 0;
							} else {
								seatIndex = region.length - requiredSeats;
							}
						}
						return seatIndex;
					}

				}

				/**
				 * Called when the seatplan is in lock mode.
				 */
				function lockSeats(selectedSeat, thisRowName, requiredSeats) {
					// Get the selectable region.
					var region = getSelectableRegion(thisRowName, selectedSeat);

					// Only allow the selection of the same seat type. Prevent selection
					// of mobility place when selecting a normal seat.
					region = region.filter(function(item, index) {
						return 	item.seat_type === selectedSeat.seat_type ||
								item.seat_type === cmsSeatTypeLoveLeft && (selectedSeat.seat_type === cmsSeatTypeLoveRight || selectedSeat.seat_type === cmsSeatTypeLoveLeft || selectedSeat.seat_type === cmsSeatTypeLoveMiddle) ||
								item.seat_type === cmsSeatTypeLoveMiddle && (selectedSeat.seat_type === cmsSeatTypeLoveRight || selectedSeat.seat_type === cmsSeatTypeLoveLeft || selectedSeat.seat_type === cmsSeatTypeLoveMiddle) ||
								item.seat_type === cmsSeatTypeLoveRight && (selectedSeat.seat_type === cmsSeatTypeLoveRight || selectedSeat.seat_type === cmsSeatTypeLoveLeft || selectedSeat.seat_type === cmsSeatTypeLoveMiddle)
						;
					})
					// console.log('lockableRegion', region);

					// Calculate the index of the selectedSeat inside the region.
					var selectedSeatIndex = region.findIndex(function (seat) {
						return seat.cinema_seatplan_id === selectedSeat.cinema_seatplan_id;
					});
					// console.log('Required seats:', requiredSeats, 'Region length:' + region.length);
					if (requiredSeats >= region.length) {
						if (requiredSeats > region.length) {
							if (typeof scope.rcSeatPlanError === "function") {
								scope.rcSeatPlanError();
							}
						}
						// start at the first position inside the region and try and fill those.
						handleSeatLocks(region.map(function (item) { return item.cinema_seatplan_id }), region.length);
					} else {
						selectedSeatIndex = validateSeatIndex(region, selectedSeatIndex, requiredSeats);
						handleSeatLocks(region.filter(function (item, index) {
							return (!((index < selectedSeatIndex) || (index > selectedSeatIndex + requiredSeats - 1)));
						}).map(function (item) { return item.cinema_seatplan_id }), requiredSeats);
						// Validate selectedSeatIndex
					}
				}

				function unlockSeats(selectedSeat, thisRowName, requiredSeats) {

					// console.log('unlockSeats', selectedSeat, thisRowName, requiredSeats);

					// An array to hold the seats for unlocking
					var seatsToUnlock;

					// If the select mode is greater than 1, then do the ping-pong selection.
					if (scope.options.selectMode > 1) {

						// Get the current row we're working with
						var row = scope.data.filter(function (seat, index, self) {
							return seat.row_name === selectedSeat.row_name;
						}).map(function (seat) {
							// Set not own locked seats and not tables to null to be
							// easier to work with.
							if (seat.seat_status !== cmsSeatOwnLock && seat.seat_type !== cmsSeatTypeTableCircle && seat.seat_type !== cmsSeatTypeTableSquare)
								return null;
							return seat;
						// Remove any tables that might be inserted between seats.
						}).filter(function(item) {
							return !item || (item.seat_type !== cmsSeatTypeTableCircle && item.seat_type !== cmsSeatTypeTableSquare);
						})

						// Add a null element at the start and end of the array, because the ping-pong algorithm using null checks to detect if it needs to stop
						row.unshift(null);
						row.push(null);

						// Get the index of the selected seat inside the row.
						var selectedSeatIndex = row.findIndex(function (seat) {
							return seat && (seat.cinema_seatplan_id === selectedSeat.cinema_seatplan_id);
						});

						// Get the locked seats group from the row based on the selectedSeatIndex group;
						var group;
						var left = selectedSeatIndex, right = selectedSeatIndex;
						while (row[left - 1] !== null || row[right + 1] !== null) {
							if (row[left - 1] !== null) left--;
							if (row[right + 1] !== null) right++;
						}
						group = row.filter(function (seat, index, self) {
							return index >= left && index <= right
						});
						selectedSeatIndex = group.findIndex(function (seat) {
							return seat && (seat.cinema_seatplan_id === selectedSeat.cinema_seatplan_id);
						});

						// Based on the position of the selected seat we move the selection to the start or the end
						if (selectedSeatIndex + 1 > Math.round(group.length / 2)) {
							selectedSeatIndex = group.length - scope.options.selectMode;
						} else {
							selectedSeatIndex = 0;
						}

						// If the selectMode is bigger than the group;
						if (selectedSeatIndex < 0) {
							selectedSeatIndex = 0;
						}
						var end = selectedSeatIndex;
						while (end - selectedSeatIndex < scope.options.selectMode - 1 && end < group.length - 1) {
							end++;
						}
						//console.log('end', end);
						//console.log('group', group);
						//console.log('selectedSeatIndex', selectedSeatIndex);

						// Filter out the selection from the row.
						seatsToUnlock = group.filter(function (seat, index) {
							return index >= selectedSeatIndex && index <= end;
						});

						// If we remove all seat locks then the previously selected section is reset to null
/*
						if (scope.options.selectMode >= scope.rcLockedSeats.length) {
							if (previousSection && typeof scope.rcSectionDeselect == 'function') {
								scope.rcSectionDeselect();
							}
							previousSection = null;
						}
*/
					} else {

						// When the selection mode is 1 then we need to check that
						// the user is not going to unlock seats that would leave
						// us with a single seat on either side

						// Get the selectable region.
						var region = getSelectableRegion(thisRowName, selectedSeat, true);

						// Get the index where the user has selected and the first
						// and last locked seats.
						var seatIndex, firstLock, lastLock;
						var regionLength = region.length;

						for (var seatLock = 0; seatLock < regionLength; seatLock++) {

							var seat = region[seatLock];
							// console.log(seat);
							// This seat is locked so assign the first and lock
							// locked seat indexes.
							if (seat.seat_lock_id) {
								if (firstLock === undefined) {
									firstLock = seatLock;
									// console.log('Seat first lock to ' + firstLock);
								} else {
									lastLock = seatLock;
								}
								if (seat.cinema_seatplan_id === selectedSeat.cinema_seatplan_id) {
									seatIndex = seatLock;
								}
							// This seat is not locked so if we are beyond the
							// selected seat index then we can break out, otherwise
							// the user has multiple seat locks in this region and
							// we can reset the first and last lock ids.
							} else {
								if (seatIndex === undefined) {
									firstLock = undefined;
									lastLock = undefined;
								} else {
									break;
								}

							}

						}

						// If we remove all seat locks then the previously selected section is reset to null
/*
						if (!lastLock && scope.rcLockedSeats.length == 1) {
							previousSection = null;
							if (typeof scope.rcSectionDeselect == 'function') {
								scope.rcSectionDeselect();
							}
						}
*/
						// If the user selected the last seat in the region and
						// there are spare seats at the beginning then we use the
						// first locked seat. If they chose the first seat in the
						// region and there are spare seats at the end then we use
						// the last seat in the region, otherwise use the first
						// locked seat.
						// console.log('Unlock', 'seatIndex', seatIndex, 'firstLock', firstLock, 'lastLock', lastLock);
						if (lastLock === (regionLength - 1) && firstLock > 0) {
							// console.log('Last lock is the last seat in the region, will use the first lock');
							seatIndex = firstLock;
						} else if (firstLock === 0 && lastLock < (regionLength - 1)) {
							// console.log('First lock is the first seat in the region, will use the last lock');
							seatIndex = lastLock;
						} else {
							// console.log('User selected a locked seat, will use the first available lock');
							if (seatIndex !== lastLock) {
								seatIndex = firstLock;
							}
						}

						seatsToUnlock = [region[seatIndex]];
					}

					let ids = seatsToUnlock.map(function (seat) {
						return seat.seat_lock_id;
					});
/*
					// var tmp = angular.copy(seatsToUnlock);
					// Unlock the selection and redraw the seatplan.
					rcSeatLock.unlockSeats(ids).then(function (response) {
						debug.log("Unlocking response", response);
						//if (response[0].rows_affected == seatsToUnlock.length) {
						// The request removed locks for all the seats that were requested
						//} else {
						// One or more seatlocks were not released. TODO: some kind of error handling ;)
						//}
						$timeout(function () {
							var eventData = angular.copy(seatsToUnlock);
							// console.info('$timeout scope.rcLockedSeatsChange', response, response[0].rows_affected);
							updateSeatStatuses(seatsToUnlock, cmsSeatNoStatus);
							updateLockedSeats();
							scope.rcLockedSeatsChange(0, response[0].rows_affected, eventData);
							dataSetChanged();
						})
					}).catch(function (reason) {
						console.warn("Seat unlock failed: " + reason);
					});
					//console.log(//console.log("unlocking", row, selectedSeatIndex))
*/
				}

				function isValidSection(seatData) {
					// If the user currently has a locked seat and that seat is in
					// a defined section, then the user may only select seats in the
					// same section.
					if (previousSection && seatData.cinema_screen_section_id == previousSection) {
						return true;
					} else if (!previousSection) {
						if (seatData.cinema_screen_section_id) {
							previousSection = seatData.cinema_screen_section_id;
							if (typeof scope.rcSectionSelect == 'function') {
								scope.rcSectionSelect(previousSection);
							}
						}
						return true;
					}

					// If there are no locked seats in the shopping cart then we can
					// skip the section check.
/*
					if (scope.rcLockedSeats.length > 0) {
						return false;
					} else {
						previousSection = seatData.cinema_screen_section_id;
						if (typeof scope.rcSectionSelect == 'function') {
							scope.rcSectionSelect(previousSection);
						}
						return true;
					}
*/
				}

				function isSeatAvailable(seatData, minStatus) {
					if (seatData.seat_type !== cmsSeatTypeAisle && seatData.seat_type !== cmsSeatTypeRowLabel && seatData.seat_type !== cmsSeatTypeBroken && seatData.seat_type !== cmsSeatTypeTableCircle && seatData.seat_type !== cmsSeatTypeTableSquare) {
						return !(seatData.seat_status >= minStatus);
					}
					return false;
				}

				function updateSeatStatuses(seats, status) {
					for (var i = 0; i < seats.length; i++) {
						var seat = seats[i];
						for (var j = 0; j < scope.data.length; j++) {
							if (seat.cinema_seatplan_id === scope.data[j].cinema_seatplan_id) {
								scope.data[j].seat_status = status;
								if (status === cmsSeatNoStatus) {
									scope.data[j].seat_lock_id = null;
									//scope.data[j].ticket_id = null;
								} else {
									scope.data[j].seat_lock_id = seats[i].seat_lock_id;
								}
							}
						}
					}
				}

				function updateLockedSeats() {
					if (scope.data) {
						var tmp = [];
						scope.data.forEach(function(seat) {
							if (seat.seat_lock_id && seat.seat_status === cmsSeatOwnLock) {
								tmp.push(seat);
							}
						})
						// scope.rcLockedSeats = tmp;
					}
				}

				/**
				 * SEAT SUGGESTIONS
				 * Based on the select mode (1, 2, 4, 6, etc..) returns the highest value group available for locking in the screen.
				 * Value is a calculated weight of a seat.
				 */
				function getHighestValueSelection() {
					var max_value = -Infinity;
					var max_index = 0;
					var seats = scope.data.map(function (item) {
						// set not selectable seats to null;
						if (item.seat_status !== cmsSeatNoStatus)
							return null;
						if (item.seat_type === cmsSeatTypeAisle || item.seat_type === cmsSeatTypeRowLabel)
							return null;
						return item;
					})

					var index = 0;
					while (index < seats.length - scope.options.selectMode) {
						if (seats[index] === null) {
							index++;
							continue;
						}
						var j = index + 1;
						var sub_max = seats[index].value;
						while (seats[j] !== null && j - index + 1 === scope.options.selectMode) {
							sub_max += seats[j].value;
							j++;
						}

						if (j - index + 1 === scope.options.selectMode) {
							index++;
							continue;
						}
						if (sub_max >= max_value) {
							max_value = sub_max;
							max_index = index;
						}
						index++;
					}
					return max_index;
				}

				/**
				 * Calculates the highest value selectable group in the seatplan
				 * @param numberOfSeats {number} Number of seats required in the suggestion. Specifies the size of the selectable group
				 * @returns {Array[number]} An array of indices of neighbouring seats from the seatplan data array.
				 */
				function getHighestValueSelectableGroup(numberOfSeats) {
					var maximumGroupValue = -Infinity;
					var groups = getAllSelectableGroup(numberOfSeats);
					var max = -1;

					groups.forEach(function (group, index) {
						if (getGroupValue(group) > maximumGroupValue) {
							max = index;
						}
					})

					return groups[max];
				}
				/**
				 * Returns all possible selectable groups from the seatplan.
				 * @returns Array[Array[number]]
				 */
				function getAllSelectableGroup(numberOfSeats) {
					var selectableGroups = [];

					scope.data.forEach(function (item, index) {
						var group = getGroupIfSelectable(index, numberOfSeats);
						if (group !== null) {
							selectableGroups.push(group);
						}
					});

					return selectableGroups;
				}

				function getGroupValue(group) {
					var value = 0;

					group.forEach(function (seatIndex) {
						value += (scope.data[seatIndex] ? scope.data[seatIndex].value : 0);
					})

					return value;
				}
				function getGroupIfSelectable(index, numberOfSeats) {
					var group = [];
					// First check that we have enough seat left in the data :)
					if (scope.data.length > index + numberOfSeats - 1) {
						var i = index;
						while (isSeatSelectable(i) && i < (index + numberOfSeats)) {
							group.push(i);
							i++;
						}
						if (group.length === numberOfSeats) {
							return group;
						}
						return null;
					}
					return null;
				}

				function isSeatSelectable(index) {
					var seat = scope.data[index];

					if (seat) {
						return (
							(seat.seat_status === cmsSeatNoStatus) &&
							(seat.seat_type === cmsSeatTypeNormal || seat.seat_type === cmsSeatTypeLoveLeft || seat.seat_type === cmsSeatTypeLoveRight || seat.seat_type === cmsSeatTypeLoveMiddle)
						);
					}
					return false;
				}

				// On a change of the seat plan options change the settings
				scope.$watch("overrideShowLock", function (value) {
					debug.log("Seat plan directive show lock override changed", value);
					// rcSeatLock.override_show_lock = value || false;
				}, true);

				scope.$watch("mobileDeviceId", function (value) {
					debug.log("Seat plan directive mobile device id changed", value);
					// rcSeatLock.mobile_device_id = value;
				}, true);

				// On a change of the seat plan options change the settings
				scope.$watch("options", function (value) {
					debug.log("Seat plan directive options changed", value);
					if (value) {
						if (value.hasOwnProperty('gridZoom')) {
							scope.seatplan_options.gridZoom = value.gridZoom;
						}
						if (value.hasOwnProperty('zoomControls')) {
							scope.seatplan_options.zoomControls = value.zoomControls;
						}
						if (value.hasOwnProperty('rowStyle')) {
							scope.seatplan_options.rowStyle = value.rowStyle;
						}
						if (value.hasOwnProperty('seatStyle')) {
							scope.seatplan_options.seatStyle = value.seatStyle;
						}
						if (value.hasOwnProperty('drawSeatNames')) {
							scope.seatplan_options.drawSeatNames = value.drawSeatNames;
						}
						if (value.hasOwnProperty('mobilityIcons')) {
							scope.seatplan_options.mobilityIcons = value.mobilityIcons;
						}
						if (value.hasOwnProperty('largeButtons')) {
							scope.seatplan_options.largeButtons = value.largeButtons;
						}
						if (value.hasOwnProperty('colorScheme')) {
							scope.seatplan_options.colorScheme = value.colorScheme;
						}
						if (value.hasOwnProperty('selectManager')) {
							scope.seatplan_options.selectManager = value.selectManager;
						}
						if (value.hasOwnProperty('selectBroken')) {
							scope.seatplan_options.selectBroken = value.selectBroken;
						}
					}
					if (scope.data) {
						if (!drawingSeatPlan) {
							debug.log('scope.data has changed');
							drawSeatPlan();
						}
					}
				}, true);

				var unregisterDataWatcher = scope.$watchCollection('data', function (value) {
					if (Array.isArray(value)) {
						scope.setZoom(0);
						dataSetChanged();
						if (!scope.options.retainWatcher) {
							unregisterDataWatcher();
						}
					}
				})
				function dataSetChanged() {

					if (Array.isArray(scope.data)) {

						// TODO: Check wether we need to keep a reference to scope.data.
						self.seatPlanData = scope.data;

						// Check to see if we have an existing lock in a defined
						// section of the screen.
						self.seatPlanData.forEach(function(seatData) {
							if (seatData.seat_status == cmsSeatOwnLock && seatData.cinema_screen_section_id) {
								previousSection = seatData.cinema_screen_section_id;
							}
						})

						// debug.log('Show Plan Data Changed', scope.rcLockedSeats);
						drawSeatPlan();

						if (typeof (scope.rcLockedSeatsChange) === 'function' && seatUnlocked) {
							try {
								$timeout(function () {
									scope.rcLockedSeatsChange();
								})
							} catch (ex) {

							}
						}

						seatUnlocked = false;

					}

				}

				// Insert any clean-up code required in here
				element.on('$destroy', function () {
					unregisterDataWatcher();
				});

				/**
				 * Timeout handle for detecting long press events.
				 * On mousedown we setup a timeout with the LONG_PRESS_DELAY
				 * If the mouseup event fires befor that, then we cancel the timeout,
				 * and register it as a click event. Otherwise it's a long press.
				 */

				self.seatPlanCanvas.bind('mousedown', function (event) {
					longPressTimer = setTimeout(function () {
						longPressTimer = null;
						// Long-press event
						if (typeof scope.rcSeatSecondarySelect === "function") {
							scope.rcSeatSecondarySelect(getSeat(event.offsetX, event.offsetY));
						}
					}, LONG_PRESS_DELAY);
				});

				self.seatPlanCanvas.bind('mouseup', function (event) {
					if (longPressTimer !== null) {
						clearTimeout(longPressTimer);
						// Click event
						seatSelect(event);
					}
				});

				self.seatPlanCanvas.bind('mousemove', seatOver);

				/**
				 * Register a change listener, so the seatplan can be refreshed from outside.
				 * This way we can avoid using watchers wich would have a high cost for this kind of data.
				 * (deep watch on a large collection with complex objects)
				 */
				var removeRefreshListener = $rootScope.$on('refresh-seatplan', function () {
					$timeout(function () {
						updateLockedSeats();
						dataSetChanged();
					});
				});

				// We have to unregister the listener when the scope is destroyed
				scope.$on('$destroy', function () {
					removeRefreshListener();
				});

				// Handle zoom messages sent from the
				scope.$on('seatplan_zoom', function (event, data) {
					if (data.mode == 'in') {
						scope.setZoom(1);
					} else if (data.mode == 'out') {
						scope.setZoom(-1);
					} else if (data.mode == 'left') {
						scope.scrollSeatPlan(1);
					} else if (data.mode == 'down') {
						scope.scrollSeatPlan(2);
					} else if (data.mode == 'up') {
						scope.scrollSeatPlan(3);
					} else if (data.mode == 'right') {
						scope.scrollSeatPlan(4);
					} else if (data.mode == 'reset') {
						debug.log('Zoom mode reset');
						scope.setZoom(0);
					}
				});

				ng.element($window).bind('resize', function(){
					scope.resizeDirective()
					scope.$digest();
				});
			},
			controller: function () {
			}
		};
	}])

})(angular);

// Code to generate a lighter/darker color taken from http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00" + c).substr(c.length);
	}

	return rgb;
}
