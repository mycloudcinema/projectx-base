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

Implements a Media Player that can be scheduled with playlists that use many different
options.
 */
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcMediaPlayer", ["$interval", "$timeout", rcMediaPlayer]);

	function rcMediaPlayer($interval, $timeout) {

		return {
			restrict:				"E",
			transclude:				true,
			replace:				true,
			template:				"<div id='rcMediaPlayerContainer' class='{{class}}'><video id='rcMediaPlayer' preload='auto' poster='{{poster}}'></video><img id='rcImageOverlay1'/><img id='rcImageOverlay2'/></div>",
			scope:{
				class:				"@",
				poster:				"@",
				data:				"=",
				muted:				"=",
				rcLoadPlaylists:	"=",
				rcLogPlayoutStart:	"=",
				rcLogPlayoutEnd:	"=",
				rcPlayoutCheck:		"="
			},
			link: function (scope, element, attrs, ctrl) {

				const _this = scope;
				const videoPlayer = document.getElementById("rcMediaPlayer");
				const videoSource = document.createElement("source");

				videoPlayer.appendChild(videoSource);

				// We use two image overlays so that we can cross fade between them
				// when the playlist has multiple images
				const imageOverlay1 = document.getElementById("rcImageOverlay1");
				const imageOverlay2 = document.getElementById("rcImageOverlay2");

				// Define the playlist to be used
				let currentPlaylist = 0;
				let playlistIndex = 0;
				let playing = false;

				let thisOverlay = 1;

				// These variables hold timers that may be set by the software
				// and need to be cancelled later.
				let interruptTimer;
				let preLoadInterval;

				// Holds a reference to the currently playing media element. We need this
				// so that we can accurately record the start and end time the element was
				// displayed and write that to the audit trail.
				let playlistElement;

				videoPlayer.addEventListener('play', function() {
// console.log('Video playing');
					playing = true;
					_this.$apply();
				});

				videoSource.addEventListener('error', function(event) {

console.log('Video error', event);
/*
					if (event && event.target && event.target.error) {

						console.log('Error: ' + event.target.error.code, playlistElement, event);

						// video playback failed - show a message saying why
						switch (event.target.error.code) {
							case event.target.error.MEDIA_ERR_ABORTED:
								console.log('You aborted the video playback.');
								break;
							case event.target.error.MEDIA_ERR_NETWORK:
								console.log('A network error caused the video download to fail part-way.');
								break;
							case event.target.error.MEDIA_ERR_DECODE:
								console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
								break;
							case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
								console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
								break;
							default:
								console.log('An unknown error occurred.');
								break;
						}

					}
*/
					// Wait for the video to pause before continuing. We only do
					// this if we were playing a video, otherwise the error came
					// from the empty source element that we inserted into the
					// video tag.
					if (playing) {
						setTimeout(function() {
							playing = false;
							selectMediaToPlay('Video Error');
						}, 200);
					}

				});

				videoSource.addEventListener('abort', function(event) {
console.log('Aborted', playlistElement, event);
					// Wait for the video to pause before continuing. We only do
					// this if we were playing a video, otherwise the error came
					// from the empty source element that we inserted into the
					// video tag.
					if (playing) {
						setTimeout(function() {
							playing = false;
							selectMediaToPlay('Video Abort');
						}, 200);
					}
				});

				videoPlayer.addEventListener('ended', function() {
// console.log('Video playout complete');

					if (playlistElement) {
						// Set the end time that this element was displayed and then log
						// the audit event.
						playlistElement.playoutFinished = moment();
						if (typeof (_this.rcLogPlayoutEnd) === 'function') {
// console.log('Video playout logged');
							_this.rcLogPlayoutEnd(playlistElement);
						};
					}

					// Wait for the video to pause before continuing.
					setTimeout(function() {
						playing = false;
						selectMediaToPlay('Video Ended');
					}, 200);

				});

				function selectMediaToPlay(source) {
console.log('selectMediaToPlay - Function Called', source);

					let findingMedia = true;
					let skipElement;

					while (findingMedia) {

						skipElement = false;

						// If there is currently an interrupt timer then we need to cancel
						// it to prevent multiple loops from running.
						if (interruptTimer) {
							$timeout.cancel(interruptTimer);
							interruptTimer = undefined;
						}

						// If there is no play list loaded then don't bother processing
						if (!_this.playlists) {

							// Now wait 30 seconds before we look for a new playlist that we
							// can work with.
// console.log('Waiting 30 seconds for an available playlist');
							$timeout(function() {
								// Look for any new playlists in case something has changed.
// console.log('No available playlists, looking for changes');
								if (typeof (_this.rcLoadPlaylists) === 'function') {
// console.log('Calling webservice for available playlists');
									_this.rcLoadPlaylists();
								};
							}, 30000);

							findingMedia = false;
							return;

						} else {

							// Firstly we need to determine if the current playlist is still valid.
							// We check to see if the current time is within the playlist times and
							// if not then we switch to the next available playlist (if available).
							const playlistStartTime = moment(_this.playlists[currentPlaylist].startTime);
							const playlistEndTime = moment(_this.playlists[currentPlaylist].endTime);

							if (!moment().isBetween(playlistStartTime, playlistEndTime)) {
// console.log('Current playlist is not playable - Looking for a valid playlist');
								// Try and get the next available playlist. If there isn't one
								// then we set a timeout for 30 seconds and wait until a new
								// playlist is available.
								currentPlaylist++;

								// No more valid playlists so we have to wait for one to become
								// active.
								if (currentPlaylist >= _this.playlists.length) {

									// Set the "Waiting for a playlist" poster on the Image
									// Overlay as we can't use a poster without a video source.
									imageOverlay1.setAttribute('src', _this.poster);
									imageOverlay1.style.opacity = 1;

									// Hide the images
									imageOverlay2.style.opacity = 0;

									// Reset the indexes so that we start looking for a new playlist from the beginning
									currentPlaylist = 0;
									playlistIndex = 0;

									// Look for any new playlists in case something has changed.
// console.log('No available playlists, looking for changes');
									if (typeof (_this.rcLoadPlaylists) === 'function') {
// console.log('Calling webservice for available playlists');
										_this.rcLoadPlaylists();
									};

									// Now wait 30 seconds before we look for a new playlist that we
									// can work with.
// console.log('Waiting 30 seconds for an available playlist');
									$timeout(function() {
										selectMediaToPlay('Playlist Check 1');
									}, 30000);

									findingMedia = false;
									skipElement = true;
									return;

								} else {
// console.log('Next playlist is playable - Selecting media');
									// selectMediaToPlay();
									skipElement = true;
									// return;
								}

							} else {

								// Check to see if the current playlist is going to expire within
								// the next 5 minutes. If it is then we will set an interrupt timeout
								// to stop any currently playing video and call for the new playlist.
								if (playlistEndTime.diff(moment(), 'minutes') < 5) {

									interruptTimer = $timeout(function() {
// console.log('Interrupting playout due to timed playlist change');

										// Force the check to start from the first element in the playlist
										// so that we don't accidentally start in the middle.
										playlistIndex = 0;

										// If there is currently a video playing then stop it.
										if (playing) {
											videoPlayer.pause();
										}

										// Now ask the software to find the next valid playlist to use.
										// skipElement = true;
										selectMediaToPlay('Playlist Interrupt');

									}, playlistEndTime.diff(moment()))

								}

							}

							if (!skipElement) {

								playlistElement = _this.playlists[currentPlaylist].playlist[playlistIndex];

								// If this element has a play count limit then we check that it hasn't
								// already passed the limit. If it has then we will skip it and load
								// the next item in the playlist.
								if (playlistElement.playCount) {

									if (playlistElement.played) {

										if (playlistElement.played >= playlistElement.playCount) {

											playlistIndex++;

											if (playlistIndex >= _this.playlists[currentPlaylist].playlist.length) {
												playlistIndex = 0;
											}
// console.log('Interrupting playout - Past maximum play count');
											findingMedia = true;
											skipElement = true;
											// selectMediaToPlay();
											// return;

										} else {
											playlistElement.played++;
										}

									} else {
										playlistElement.played = 1;
									}

								}

								// If this element requires a playout check, and we have
								// a playout check function defined, then we make the call
								// to see if this element can be played.
								if (playlistElement.playoutCheck) {
									if (typeof (_this.rcPlayoutCheck) === 'function') {
										_this.rcPlayoutCheck(playlistElement, function(playlistElement, result) {
											if (!result) {
												playlistIndex++;
												if (playlistIndex >= _this.playlists[currentPlaylist].playlist.length) {
													playlistIndex = 0;
												}
// console.log('Interrupting playout - Play Check Failed');
												// selectMediaToPlay();
												// return;
											} else {
												playlistElement = playlistElement;
											}
										});
									};
								}

								// Only start this playout if the element is still
								// valid for playout.
								if (!skipElement) {

									// Set the start time that this element was displayed
									playlistElement.playoutStarted = moment();

									if (typeof (_this.rcLogPlayoutStart) === 'function') {
										_this.rcLogPlayoutStart(playlistElement);
									};

									switch (playlistElement.type) {

										case 'video':

											// Set the type and attribute of the source video to be played. If
											// the source is a file then we create an object URL to use in place
											// of a normal URL.
											videoSource.setAttribute('src', playlistElement.src.file);
											videoSource.setAttribute('type', playlistElement.src.type);

											// Check to see if we are playing this video with any audio
											if (playlistElement.muted || _this.playlists[currentPlaylist].muted || _this.muted) {
												videoPlayer.muted = true;
											} else {
												videoPlayer.muted = false;
											}

											// Force the file to load as dynamically changing the source
											// does not ensure that this happens.
											// if (playing) {
												// console.log('Pausing the video player to switch playlist');
												// videoPlayer.pause();
											// }

											// Set a short timeout to give the events to fire before starting
											// the video. We also fade out the image overlays.
// console.log('Loading new video', playlistElement);
// console.log('videoPlayer.paused', videoPlayer.paused);
											setTimeout(function() {

												// Wait for the video to pause before continuing.
												try {
													// if (videoPlayer.playing && videoPlayer.paused) {
														imageOverlay1.style.opacity = 0;
														imageOverlay2.style.opacity = 0;

														// Remove the poster from the video player to prevent it from
														// flickering between plays.
														videoPlayer.setAttribute('poster', null);
														videoPlayer.load();
														videoPlayer.currentTime = playlistElement.startOffset;
														videoPlayer.play();
														videoPlayer.style.opacity = 1;
													// }
												} catch (ex) {
													console.log("Video Load Exception", ex);
												}
											}, 500);

											findingMedia = false;
											break;

										case 'image':
// console.log('Loading new image', playlistElement);

											// Place the static image into the video player poster and then
											// after the duration has expired we can load the next element
											// from the playlist.
											if (thisOverlay === 1) {
												imageOverlay1.setAttribute('src', playlistElement.src.file);
												imageOverlay1.style.opacity = 1;
												imageOverlay2.style.opacity = 0;
												thisOverlay = 2;
											} else if (thisOverlay === 2) {
												imageOverlay2.setAttribute('src', playlistElement.src.file);
												imageOverlay2.style.opacity = 1;
												imageOverlay1.style.opacity = 0;
												thisOverlay = 1;
											}
											videoPlayer.style.opacity = 0;

											let imageDuration;
											// To prevent the signage from crashing the browser, there is a
											// minimum duration of 3 seconds for image playback. So if the
											// duration is not defined, or is less than 3 seconds, we will
											// override it here.
											try {
												imageDuration = Math.floor(playlistElement.duration * 1000) >= 3000 ? Math.floor(playlistElement.duration * 1000) : 3000;
											} catch (ex) {
												imageDuration = 3000;
											}
// console.log('Image playout for ' + imageDuration + ' milliseconds');

											// $timeout(function() {
											setTimeout(function() {

												// Set the end time that this element was displayed and
												// then log the audit event.
												playlistElement.playoutFinished = moment();

												if (typeof (_this.rcLogPlayoutEnd) === 'function') {
// console.log('Image playout logged', playlistElement);
													_this.rcLogPlayoutEnd(playlistElement);
												};

// console.log('Image playout complete - Selecting next element');
												selectMediaToPlay('Image Playout Complete');

											}, imageDuration);

											findingMedia = false;
											break;
									}

								}

							}

							// Set the element that will be used in the next pass. If we are past
							// the end of the elements in the playlist then we start over from the
							// first one.
							playlistIndex++;

							if (playlistIndex >= _this.playlists[currentPlaylist].playlist.length) {
/*
console.log('End of current playlist, looking for changes');
							if (typeof (_this.rcLoadPlaylists) === 'function') {
								_this.rcLoadPlaylists();
							};
*/
								playlistIndex = 0;
							}
// console.log('Found media to display - exiting');
							if (!findingMedia) {
								break;
							}
						}

					}
// console.log('selectMediaToPlay - Function Exited');
				}

				// On a change of the data we need to take a copy of it (otherwise
				// we get into an endless loop when we update it) and then tell the
				// directive to start processing the next element;
				scope.$watch("data", function (value) {

					if (value) {
console.log('scope.$watch has been fired with a data change')
						// NOTE:	There is no guarantee that the same media will not
						//			be played on the more than one monitor, randomPlay
						//			just trys to avoid it. To prevent it the individual
						//			monitors would need to be in constant communication
						//			and maintain a pool of who is playing what.
						_this.playlists = ng.copy(value).map(function(thisPlaylist) {

							// Take the input data and insert a random value into each
							// playlist media element, then sort the playlist by this
							// random number to help prevent the same media being played
							// at the same time on more than one monitor.
							if (thisPlaylist.randomPlay) {
								thisPlaylist.playlist = thisPlaylist.playlist.map(function(mediaElement) {
									mediaElement.random = Math.floor(Math.random() * (65535 - 1)) + 1;
									return mediaElement;
								}).sort(function(a, b) {
									return a.random - b.random;
								});
							}
							return thisPlaylist;

						});

						selectMediaToPlay('Source Data Changed');

					}

				}, true);

			}

		};

	}

})(angular);
