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

Test procedure for the implementation of shared variables and common code.
*/
"use strict";

const fs = require('fs');
const path = require('path');
const net = require('net');
const moment = require.main.require('moment');
const uuid = require.main.require('uuid');
const bwipjs = require.main.require('bwip-js');
const PDFDocument = require.main.require('pdfkit');

const settings = require.main.require('@mycloudcinema/zframework/external/Settings');
const logger = require.main.require('@mycloudcinema/zframework/external/Logger').getLogger("rc_print_common.js", settings);

const _this = this;

const DOCUMENT_OUTPUT_DIRECTORY = "./printed"
const IMAGES_PATH = path.join(process.cwd(), "../public/generated");

// Constants
const ELEMENT_TYPE_TEXT = "text";
const ELEMENT_TYPE_NUMBER = "number";
const ELEMENT_TYPE_BARCODE = "barcode";
const ELEMENT_TYPE_STATIC = "static";
const ELEMENT_TYPE_IMAGE = "image";
const ELEMENT_TYPE_IMAGE_LINK = "image_link";
const ELEMENT_TYPE_LINE = "line";
const ELEMENT_TYPE_DATETIME = "datetime";
const ELEMENT_TYPE_SYSTEM_DATETIME = "systemdatetime";
const ELEMENT_TYPE_ARRAY = "array";

const DEFAULT_ALIGNMENT = "center";

// Conversion constants
const DPI_TO_PIXEL_PER_MM = 0.03937008; // 1 dpi = 0.03937008 pixel/mm
function toPixels(mm, dpi) {
	return Math.floor(mm * dpi * DPI_TO_PIXEL_PER_MM);
}

exports.getCommon = function() {
	return new Common();
}

var Common = (function () {

	function Common() {
		logger.info('Initializing the class');
		// We store the definitions for each type in an object array so that we can have
		// some definitions already loaded while others will be loaded on demand.
		_this.definitions = {};
	}

	function getTemplate(definition_key, print_definition_id, definition_field) {

		var templateDefinition, type;

		// Attempt to find a definition that matches with the printer type that
		// they are using. If that doesn't work then we will take the first entry
		// from the definition list.
		try {
			templateDefinition = _this.definitions[definition_key].definitionList.filter(function(definition) {
				return definition[definition_key] == print_definition_id;
			})[0];
			type = templateDefinition.template_type;
			templateDefinition = templateDefinition[definition_field];
		} catch (ex) {
			logger.error(ex);
			type = [0].template_type;
			templateDefinition = [0].print_definition;
		}

		return {
			type: type,
			definition: (type === 'PDFKit' ? JSON.parse(templateDefinition) : templateDefinition)
		};

	}
	Common.prototype.getTemplate = getTemplate;

	// Separate task for inserting definition into the document to be printed
	function processDocument(templateDefinition, document, payload, callback) {

		logger.message(`Generating document ${templateDefinition.type}`);
		// logger.message(`Generating document for ${data.products.length} products`);

		try {

			return generateDocument(templateDefinition, document, payload, true).then(() => {
				callback();
			}).catch((error) => {
				callback(true);
			});

		} catch (ex) {
			logger.error(ex);
			callback(true);
		}

	}

	function generateDocument(templateDefinition, document, payload, first) {

		// logger.info('templateDefinition: ' + JSON.stringify(templateDefinition));
		// logger.info('payload: ' + payload);
		// logger.info('payload.documentData: ' + payload.documentData);

		let documentData = payload.documentData;
		let definition = templateDefinition.definition;

		const dpi = definition.document.resolution.dpi;

		return new Promise((resolve, reject) => {

			let parsedTemplate = parsePageElements(definition, payload, documentData);

			logger.debug(`Templates parsed: ${JSON.stringify(parsedTemplate)}`);
			// Lets generate the all barcodes of the document first
			generateBarcodes(getBarcodes(parsedTemplate)).then(() => {

				logger.info(`Returning from generateBarcodes`);

				// All barcodes are generated successfully. Time to assemble the document
				// Register fonts to the document from the template
				try {
					for (let key in parsedTemplate.resources) {
						if (parsedTemplate.resources.hasOwnProperty(key)) {
							document.registerFont(key, path.join(process.cwd(), definition.resources[key]));
						}
					}
				} catch (ex) {
					logger.error(ex);
					reject(ex);
				}

				// Set the default font
				if (parsedTemplate.document.font && parsedTemplate.document.font.name) {
					document.font(parsedTemplate.document.font.name);
				}

				parsedTemplate.pages.forEach((page, index) => {
					// The PDFDocument constructor creates a page as well, so for the
					// first page we don't have to add a new one.
					if (!(index === 0 && first)) {
						logger.info(`GenerateDocument - Debug Point #3`);
						logger.debug("Adding page to the document", index);
						document.addPage();
					}
					renderPage(document, page, documentData, dpi);
				});

				resolve();

			}).catch(error => {
				reject(error);
			})

		});

	}

	/**
	 * Renders a page based on  elements array
	 */
	function renderPage(document, page, data, dpi) {

		var topOffset = 0;

		page.elements.forEach(element => {

			logger.debug(`GenerateDocument - PageElement ${JSON.stringify(element)}`);

			// Adjust the element top position based on the current top offset
			element.position.top += topOffset;

			try {
				if (element.type === ELEMENT_TYPE_BARCODE) {
					document.image(
						path.join(IMAGES_PATH, element.data + ".png"),
						element.position.margin,
						element.position.top, {
							width: element.position.width
						})
				} else if (element.type === ELEMENT_TYPE_IMAGE) {
					document.image(
						path.join(process.cwd(), element.src),
						element.position.margin,
						element.position.top, {
							width: element.position.width,
							height: element.position.height,
							align: element.position.align
						})
				} else if (element.type === ELEMENT_TYPE_IMAGE_LINK) {
					try {
						document.image(
							path.join(process.cwd(), element.data),
							element.position.margin,
							element.position.top, {
								width: element.position.width,
								height: element.position.height,
								align: element.position.align
							})
					} catch (ex) {
						logger.error(`Error linking image: ${ex}`);
						logger.info(element.data);
					}

				} else if (element.type === ELEMENT_TYPE_LINE) {
					document.moveTo(element.position.margin, element.position.top)
							.lineTo(element.position.width, element.position.top)
							.stroke();

				} else if (element.type === ELEMENT_TYPE_TEXT || element.type === ELEMENT_TYPE_NUMBER || element.type === ELEMENT_TYPE_STATIC || element.type === ELEMENT_TYPE_DATETIME || element.type === ELEMENT_TYPE_SYSTEM_DATETIME || element.type === ELEMENT_TYPE_ARRAY) {

					if (element.font && typeof element.font.size === "number") {
						document.fontSize(element.font.size);
					}
					if (element.font && typeof element.font.name === "string") {
						document.font(element.font.name)
					}

					if (element.type === ELEMENT_TYPE_DATETIME || element.type === ELEMENT_TYPE_SYSTEM_DATETIME) {
						try {
							if (element.interval) {
								if (element.type === ELEMENT_TYPE_DATETIME) {
									element.data = moment(element.data).add(element.interval, 'days').format(element.format || "DD.MM.YYYY HH:mm");
								} else {
									element.data = moment().add(element.interval, 'days').format(element.format || "DD.MM.YYYY HH:mm");
								}
							} else {
								if (element.type === ELEMENT_TYPE_DATETIME) {
									element.data = moment(element.data).format(element.format || "DD.MM.YYYY HH:mm");
								} else {
									element.data = moment().format(element.format || "DD.MM.YYYY HH:mm");
								}
							}
						} catch (ex) {
							logger.error(`Date handling error: ${ex}`);
							logger.info(element.data);
						}

					// An array can be any array in the data which the user can loop through
					} else if (element.type === ELEMENT_TYPE_ARRAY) {

						try {

							data[element.property].forEach(function(textLine) {

								// Process the individual line template
								processTemplate(document, textLine, element, dpi);

								topOffset += element.row_height;
								element.position.top += element.row_height;

							});

						} catch (ex) {
							logger.error(`Error handling array element: ${ex}`);
							logger.info(element.data);
						}

					} else {

						try {
							// console.log(element);
							document.text(element.data, element.position.margin, element.position.top, {
								width: element.position.width,
								align: element.position.align
							})
						} catch (ex) {
							logger.error(`Error handling default type: ${ex}`);
							logger.info(element.data);
						}
					}

				}
			} catch (ex) {
				logger.error(`Error rendering page: ${ex}`);
			}

		});

	}

	function processTemplate(document, data, element, dpi) {

		element.template.forEach(function(thisElement) {

			// Create a deep copy of this element so that we don't
			// mess up the original object.
			let templateElement = JSON.parse(JSON.stringify(thisElement));
			let printData;

			try {
				if (templateElement.type === ELEMENT_TYPE_STATIC || templateElement.type == ELEMENT_TYPE_IMAGE) {
					printData = templateElement.data || '';
				} else {
					if (templateElement.type === ELEMENT_TYPE_DATETIME || templateElement.type === ELEMENT_TYPE_SYSTEM_DATETIME) {
						if (templateElement.interval) {
							if (templateElement.type === ELEMENT_TYPE_DATETIME) {
								printData = moment(data[templateElement.property]).add(templateElement.interval, 'days').format(templateElement.format || "DD.MM.YYYY HH:mm");
							} else {
								printData = moment().add(templateElement.interval, 'days').format(templateElement.format || "DD.MM.YYYY HH:mm");
							}
						} else {
							if (templateElement.type === ELEMENT_TYPE_DATETIME) {
								printData = moment(data[templateElement.property]).format(templateElement.format || "DD.MM.YYYY HH:mm");
							} else {
								printData = moment().format(templateElement.format || "DD.MM.YYYY HH:mm");
							}
						}
					} else {
						if (templateElement.type === ELEMENT_TYPE_NUMBER) {
							printData = data[templateElement.property].toFixed(templateElement.decimals || 0);
						} else {
							printData = getPropertyValue(data, [], templateElement.property) || '';
						}
					}
				}
			} catch (ex) {
				logger.error(ex);
				logger.error(templateElement);
				printData = '%' + templateElement.property + '%';
			}

			// Convert the JSON object to a Position instance
			templateElement.position = new Position(templateElement.position, dpi);
			templateElement.position.top = element.position.top;

			document.text(printData, templateElement.position.margin, templateElement.position.top, {
				width: templateElement.position.width,
				align: templateElement.position.align
			});

		});

	}

	/**
	 * Parses the template object and loads all barcode elements from it.
	 *
	 */
	function getBarcodes(template) {
		let tmp = []
		template.pages.forEach(page => {
			tmp = tmp.concat(page.elements.filter(element => element.type === "barcode"))
		});
		logger.debug(`Extracted the following barcodes ${JSON.stringify(tmp)}`);
		return tmp
	}

	/**
	 * Because barcodes can only be generated asynchronously we have to generate them before touching the document
	 */
	function generateBarcodes(barcodes) {
		if (!barcodes || barcodes.length == 0) {
			logger.info(`No barcodes to generate - returning from generateBarcodes`);
			return Promise.resolve();
		} else {
			logger.info(`barcodes ${JSON.stringify(barcodes)}`);
			return Promise.all(
				barcodes.map(generateBarcode)
			);
		}
	}

	/**
	 * Generates a barcode image based on the data.
	 * Returns a promise.
	 */
	function generateBarcode(barcode_element) {

		// The barcode element data needs to be a string so if it isn't we convert it
		barcode_element.data = String(barcode_element.data);

		// Return a promise which will be resolved when the barcode is saved to the filesystem.
		return new Promise(function(resolve, reject) {

			try {

				const outfile = path.join(IMAGES_PATH, barcode_element.data + '.png');
				logger.message(`Generate barcode: ${outfile}`);

				if (barcode_element.barcode_type == 'qrcode') {

					bwipjs.toBuffer({
						bcid: barcode_element.barcode_type,	// Barcode type
						text: barcode_element.data			// Text to encode
					}, function(err, png) {
						if (err) {
							logger.error(`There was an error while generating the barcode ${err}`);
							reject(err);
						} else {
							fs.writeFileSync(outfile, png);
							logger.message(`Barcode successfully generated. type: ${barcode_element.barcode_type} data: ${barcode_element.data}`);
							resolve();
						}
					});

				} else {

					bwipjs.toBuffer({
						bcid: barcode_element.barcode_type,			// Barcode type
						text: barcode_element.data,					// Text to encode
						scale: barcode_element.scale || 1,
						height: barcode_element.height || 10,		// Bar height, in millimeters
						includetext: (typeof barcode_element.include_text === "boolean") ? barcode_element.include_text : true, // Show human-readable text
						textxalign: 'center',						// Always good to set this
						textsize: barcode_element.font_size || 10	// Font size, in points
					}, function(err, png) {
						if (err) {
							logger.error(`There was an error while generating the barcode ${err}`);
							reject(err);
						} else {
							fs.writeFileSync(outfile, png);
							logger.message(`Barcode successfully generated. type: ${barcode_element.barcode_type} data: ${barcode_element.data}`);
							resolve();
						}
					});

				}

			} catch (ex) {
				console.error(ex);
				reject(err);
			}

		});

	}

	/**
	 * Parses every page in the template object.
	 * Goes through every element in every page and saves the replacement datas for each element on the element itself in a new 'data' property
	 * The function also converts every position data from mm to pixels based on the dpi.
	 */
	function parsePageElements(templateDefinition, payload, documentData) {

		// Create a deep clone of the template object (no references at all ;) )
		// (This object can be constant since they are reference types. This means that the reference cannot be changed but the value it's pointing to can.)
		const tmp = JSON.parse(JSON.stringify(templateDefinition));
		const dpi = templateDefinition.document.resolution.dpi;

		// Go through every page
		tmp.pages.forEach(page => {

			logger.debug(`Processing template page: ${JSON.stringify(page)}`);

			// For each element in each page assign the replacement value to the element's data property
			page.elements.map(element => {
				logger.debug(`element - before ${JSON.stringify(element)}`);
				if (element.type === ELEMENT_TYPE_SYSTEM_DATETIME) {
				} else if (element.type === ELEMENT_TYPE_TEXT || element.type === ELEMENT_TYPE_DATETIME || element.type === ELEMENT_TYPE_SYSTEM_DATETIME || element.type === ELEMENT_TYPE_BARCODE || element.type === ELEMENT_TYPE_IMAGE_LINK) {
					element.data = getPropertyValue(payload, documentData, element.property);
				} else if (element.type === ELEMENT_TYPE_NUMBER) {
					element.data = getPropertyValue(payload, documentData, element.property).toFixed(element.decimals || 0);
				// Element types handled differently but still value
				} else if (element.type === ELEMENT_TYPE_STATIC || element.type === ELEMENT_TYPE_IMAGE || element.type === ELEMENT_TYPE_LINE || element.type === ELEMENT_TYPE_ARRAY) {
				} else {
					logger.error(`Unknown Element Type: ${element.type}`);
				}

				// Parse the position object.
				if (element.position) {
					element.position = new Position(element.position, dpi);
				} else {
					// If the position of an element is not specified, then fall back to a valid position. (Avoid silent crashing)
					element.position = new Position({});
				}
				logger.debug(`element - after ${JSON.stringify(element)}`);
			})

		})

		return tmp;

	}

	/**
	 * The getProperty value can receive a single property name, an multiple level
	 * object name or a string of names and constants separated by a | character.
	 * The software then tries to extract the data from the payload or from the
	 * Document level data and inject that into the document.
	 */
	function getPropertyValue(payload, documentData, property) {

		if (typeof property == 'object') {
			logger.debug(`Object value field loaded ${JSON.stringify(property)}`);
			try {

				let propertyValue = '';

				property.forEach(propertyElement => {

					try {
						if (propertyElement.type == ELEMENT_TYPE_MOMENT) {
							propertyValue += moment(getPropertyValue(payload, documentData, propertyElement.value)).format(propertyElement.format || "DD.MM.YYYY HH:mm");
						} else if (propertyElement.type == ELEMENT_TYPE_NUMBER) {
							propertyValue += getPropertyValue(payload, documentData, propertyElement.value).toFixed(propertyElement.decimals || 0);
						} else if (propertyElement.type == ELEMENT_TYPE_TEXT) {
							propertyValue += getPropertyValue(payload, documentData, propertyElement.value)
						} else if (propertyElement.type == ELEMENT_TYPE_STATIC || propertyElement.type == ELEMENT_TYPE_IMAGE) {
							propertyValue += propertyElement.value;
						} else {
							propertyValue += '%' + propertyElement.value + '|' + propertyElement.value + '%';
						}
					} catch (ex) {
						logger.error(ex);
						propertyValue += '%' + propertyElement + '%';
					}

				});

				return propertyValue;

			} catch (ex) {
				logger.error(ex);
				return '%' + property + '%';
			}

		} else {
			logger.debug(`Other value field loaded ${JSON.stringify(property)}`);

			// Check if we are looking for a single level or multiple level object
			// value in the JSON.
			if (property.includes('.')) {
				var main = property.substring(0, property.indexOf('.'));
				var second = property.substring(property.indexOf('.') + 1);
				return getPropertyValue(payload, documentData[main], second);
			} else {
				try {
					return payload[property] || documentData[property];
				} catch (ex) {
					return '%' + property + '%';
				}
			}

		}

	}

	function logPrintRequest(messageText) {
		var stream1 = fs.createWriteStream("printing-log" + moment().format("YYYY-MM-DD") + ".sql", {'flags': 'a'});
		if (typeof messageText === 'object') {
			stream1.write(moment().format("YYYY-MM-DD HH:mm:ss.SSS") + "\t" + JSON.stringify(messageText) + "\n");
		} else {
			stream1.write(moment().format("YYYY-MM-DD HH:mm:ss.SSS") + "\t" + messageText + "\n");
		}
		stream1.end();
	}

	/**
	 * A class for element positions to safely fall back every option to a valid option if there is nothing provided by the template
	 * It's easier to work with a class then call if statements every time an element's position is used.
	 */
	class Position {

		get top() {
			return this._top
		}
		set top(v) {
			this._top = v;
		}
		get width() {
			return this._width
		}
		get height() {
			return this._height
		}
		get margin() {
			return this._margin
		}
		get align() {
			return this._align
		}

		constructor(position, dpi) {
			if (position.top) {
				this._top = toPixels(position.top, dpi)
			} else {
				this._top = 0
			}

			if (position.width) {
				this._width = toPixels(position.width, dpi)
			} else {
				this._width = 0
			}

			if (position.height) {
				this._height = toPixels(position.height, dpi)
			} else {
				this._height = 0
			}

			if (position.margin) {
				this._margin = toPixels(position.margin, dpi)
			} else {
				this._margin = 0
			}

			if (position.align) {
				this._align = position.align
			} else {
				this._align = DEFAULT_ALIGNMENT
			}

		}
	}

	class Font {
		constructor(font) {
			if (font.fontSize) {
				this._fontSize = font.fontSize
			} else {
				this._fontSize = 18
			}
		}
	}

	const template = {

	}

	Common.prototype.print = function(requestData) {

		const printServerIp = requestData.payload.printer_ip_address;
		const printServerPort = requestData.payload.printer_port;

		let payload = requestData.payload;
		let templateDefinition;

		return new Promise(function(resolve, reject) {

			try {

				// If the user has supplied a print definition then we will use that
				// otherwise we will try and pull a print definition from the ones
				// that we loaded.
				if (requestData.payload.definition_data && requestData.payload.definition_data !== '') {
					templateDefinition = requestData.payload.definition_data;
				} else {
					templateDefinition = getTemplate(requestData.payload.definition_key, requestData.payload.print_definition_id, requestData.payload.definition_field);
				}

				if (templateDefinition) {

					// Make sure that the output directory for the pdf document exists.
					if (!fs.existsSync(DOCUMENT_OUTPUT_DIRECTORY)) {
						fs.mkdirSync(DOCUMENT_OUTPUT_DIRECTORY);
					}

					const documentSettings = templateDefinition.definition.document;
					const documentOptions = {
						margins: {
							top:	documentSettings.margins.top,
							left:	documentSettings.margins.left,
							right:	documentSettings.margins.right,
							bottom:	documentSettings.margins.bottom
						}
					};

					// Only set the page height if that is supplied
					if (documentSettings.resolution.height) {
						documentOptions.size = [
							toPixels(documentSettings.resolution.width, documentSettings.resolution.dpi), // Width
							toPixels(documentSettings.resolution.height, documentSettings.resolution.dpi) // Height
						]
					} else {
						documentOptions.size = [
							toPixels(documentSettings.resolution.width, documentSettings.resolution.dpi) // Width
						]
					}

					let document = new PDFDocument(documentOptions);

					let printJobId = uuid.v4();
					let pdfFileName = `${printJobId}.pdf`;
					let pdfFilePath = `${DOCUMENT_OUTPUT_DIRECTORY}/${pdfFileName}`;
					let writeStream = document.pipe(fs.createWriteStream(pdfFilePath));

					logger.info(`Creating document ${path.resolve(pdfFilePath)}`);

					writeStream.on("finish", function() {

						// Do something after the write stream closed
						logger.info(`Document created ${path.resolve(pdfFilePath)}`);

						// var client = net.connect(5100, '192.168.0.60');
						logger.info(`Connecting to Print Server ${printServerIp} on port ${printServerPort}`);
						var client = net.connect(printServerPort, printServerIp);

						//send a file to the server
						var readStream = fs.createReadStream(pdfFilePath);
						readStream.on('error', function(err) {
							logPrintRequest(err);
							logger.error("There was an error sending the generated file to the server", err);
						})
						readStream.on('open', function() {
							readStream.pipe(client);
						});
						client.on("data", function (data) {
							logger.message(`Data received from the Print Server: ${data.toString()}`)
							client.destroy();
							if (data.toString() === 'ACK') {
								logPrintRequest(data.toString());
								logger.info(`Successfully printed document ${data.toString()}`);
								// Remove the working file from the disk
								if (!settings.app.save_printed_documents) {
									logger.info(`Removing temporary print file: ${pdfFilePath}`);
									fs.unlink(pdfFilePath);
									logger.message(`Temporary print file removed: ${pdfFilePath}`);
								}
								resolve({document_printed: true});
							} else {
								logPrintRequest(data.toString());
								logger.error("There was an error printing to the printer", data);
								reject({document_printed: false});
							}
						});
						client.on("error", function(error) {
							logPrintRequest(error);
							logger.error("There was an error connecting to the printer #3", error);
							reject({document_printed: false, message: error.message, data: error});
							return;
						});

					});

					logger.message(`Processing Document.`);
					processDocument(templateDefinition, document, payload, (error) => {
						if (error) {
							// console.log('processDocument', error);
						}
						document.end();
					})

				} else {
					logger.error('No definition found');
					reject();
				}
			} catch (ex) {
				reject(ex);
			}
		});
	}

	Common.prototype.init = function(connection, requestData) {

		let storedProcedure = requestData.payload.stored_procedure;
		let definition_key = requestData.payload.definition_key;
		let definition_field = requestData.payload.definition_field;
		let initialized = _this.definitions && _this.definitions[definition_key] && _this.definitions[definition_key].initialized;

		return new Promise(function(resolve, reject) {

			// If the definitions are already initialized then we skip the loading
			// of the definitions files.
			if (initialized) {
				resolve();

			// A user can supply their own definition without a stored procedure so we need
			// to ignore the loading from the db.
			} else if (!storedProcedure) {
				logger.message("Initialising webservice");
				logger.message(`User supplied their own definition. Loading has been skipped.`);
				resolve();

			// Otherwise we need to call the stored procedure and load all the definitions
			// into memory.
			} else {

				logger.message("Initialising webservice");
				logger.message(`Loading definition list from the DB [${storedProcedure}]`);

				var query = connection.query(`CALL ${storedProcedure}(?);`, [JSON.stringify(requestData)], function(error, rows, fields) {
					// console.log(query.sql);

					if (error) {
						logger.error(`Failed to load definition list from the DB: ${error}`);
						reject(error);
					} else {

						_this.definitions[definition_key] = {
							initialized:	false,
							definitionList:	[]
						};

						if (rows) {
							try {
								_this.definitions[definition_key].definitionList = rows[0].map(function(definition) {
									definition.definition_data = definition[definition_field];
									return definition;
								});
							} catch (ex) {
								logger.error('Failed to load definition list');
								logger.error(ex);
								reject(ex);
							}
						}

						_this.definitions[definition_key].initialized = true;
						logger.message(`Loaded ${_this.definitions[definition_key].definitionList.length} definitions from the DB [${definition_key}/${definition_field}]`);
						resolve();

					}
				});
			}
		});
	};

	// If we are reloading the definitions then we check to see if they are already
	// initialised and if they are then we reset the flag so that the next print request
	// will force the templates to be reloaded.
	Common.prototype.reload = function(requestData) {

		let definition_key = requestData.payload.definition_key;
		let initialized = _this.definitions && _this.definitions[definition_key] && _this.definitions[definition_key].initialized;

		return new Promise(function(resolve, reject) {

			if (initialized) {
				_this.definitions[definition_key].initialized = false;
			}

			resolve();

		});

	};

	return Common;

})();
