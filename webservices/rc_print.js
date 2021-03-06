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

// Include the common printing functionality
const PrintingCommon = require('./rc_print_common.js').getCommon();

const settings = require.main.require('@mycloudcinema/zframework/external/Settings');
const logger = require.main.require('@mycloudcinema/zframework/external/Logger').getLogger("rc_print.js", settings);

async function getPrintDefinitionId(connection, print_definition_type_id, printer_ip_address, printer_port) {
	return new Promise((resolve, reject) => {
		logger.message("Looking for print definition by the format of the printer device and print definition type.")
		const query = connection.query(`SELECT fn_get_print_definition_id(?, ?, ?) AS print_definition_id;`, [print_definition_type_id, printer_ip_address, printer_port], (error, rows) => {
			console.log(query.sql);
			if (error) {
				return reject(error);
			}
			if (Array.isArray(rows) && rows.length > 0) {
				logger.info(`Print definition found: ${rows[0].print_definition_id}`)
				return resolve({
					print_definition_id: rows[0].print_definition_id
				});
			}
			return reject(new Error("No print definition found."));
		});
		logger.debug(query.sql);
	})
}

exports.printDocument = async (connection, callback, requestData) => {

	// Initialization is called the first time the user tries to print a document
	// and loads the definitions from the database. It is also called after the
	// user forces a reload of the defintions.
	logger.info('Initializing');

	// Determine the correct print definition id based on the type of the print
	// request and format of the printer it is being printed on.
	if (!requestData.payload.print_definition_id) {
		try {
			const definition = await getPrintDefinitionId(connection, requestData.payload.print_definition_type_id, requestData.payload.printer_ip_address, requestData.payload.printer_port);
			requestData.payload.print_definition_id = definition.print_definition_id;
		} catch (error) {
			logger.error(error);
			return callback(error);
		}
	}

	logger.info('requestData.payload');
	logger.info(requestData.payload);

	PrintingCommon.init(connection, requestData).then(async response => {

		logger.info('Initialized');

		let dataEntries = requestData.payload.documentData.map(dataEntry => {
			let newDataEntry = JSON.parse(JSON.stringify(requestData));
			newDataEntry.payload.documentData = dataEntry;
			return newDataEntry;
		});

		// If the request is to skip the printing then we can execute the callback
		// immediately.
		if (requestData.payload.documentData[0].skip_printing) {
			callback(false, [], []);
		} else {

			processPrintJobs(dataEntries).then((response) => {
				logger.info(`Print Task Successful: ${JSON.stringify(response)}`);
				callback(false, [], []);
			}).catch((error) => {
				if (error) {
					error.code = 91;
				} else {
					error = {
						code: 91
					}
				}
				logger.info(`Print Task Failed: ${JSON.stringify(error)}`);
				callback({ message: error });
			});

		}

	}).catch((error) => {
		logger.error(error);
		error.code = 90;
		callback({ message: error });
	});

};

exports.reload = (connection, callback, requestData) => {
	PrintingCommon.reload(requestData).then((response) => {
		logger.info('Reload Successful:' + response);
		callback(false, [response], []);
	}).catch((error) => {
		error.code = 92;
		logger.info(`Reload Failed: ${JSON.stringify(error)}`);
		callback({ message: error });
	});
}

function processPrintJobs(dataEntries) {
	return Promise.all(
		dataEntries.map(processPrintJob)
	);
}

function processPrintJob(printJob) {
	logger.info(`processPrintJob: ${JSON.stringify(printJob)}`);
	return new Promise((resolve, reject) => {
		PrintingCommon.print(printJob).then((response) => {
			logger.info(`Print Job Successful: ${JSON.stringify(response)}`);
			resolve(response);
		}).catch((error) => {
			logger.info(`Print Job Failed: ${JSON.stringify(error)}`);
			reject(error);
		})
	})
}
