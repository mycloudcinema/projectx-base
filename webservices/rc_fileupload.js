/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Webservice for handling file uploads
*/
const path = require('path');
const fs = require.main.require('fs-extra');
const mkdirp = require.main.require('mkdirp');
const uuid = require.main.require('uuid');

const settings = require.main.require('@mycloudcinema/zframework/external/Settings');
const logger = require.main.require('@mycloudcinema/zframework/external/Logger').getLogger("fileupload.js", settings);

exports.uploadImage = function(connection, callback, requestData) {
	handleUpload(connection, callback, requestData, "", settings.resource.mediaFolderPath + "/images/", "/media/images/");
}
exports.uploadVideo = function(connection, callback, requestData) {
	handleUpload(connection, callback, requestData, "", settings.resource.mediaFolderPath + "/videos/", "/media/videos/");
}

function handleUpload(connection, callback, requestData, basePath, directory, linkdir) {
console.log(requestData.payload.image);
    var base64data = requestData.payload.image.data.split("base64,")[1];

	var imageDirectory = directory;
	var linkDirectory = linkdir;
	var thumbnailsList = [];

	var responseData = {
		basePath:	basePath,
		filePath:	imageDirectory,
		fileName:	uuid.v4() + "." + requestData.payload.image.type,
		mediaId:	0,
		status:		0,
		message:	''
	};

	try {
		// Set the source path which is the location where the image will be saved
		var sourcePath = responseData.basePath + imageDirectory;

		// Attempt to write a file to the file system. If this fails then we stop
		// processing an return a failure to the user.
		mkdirp(sourcePath, err => {

			if (err) {
				responseData.status = 99;
				responseData.message = err;
				callback(responseData, []);
			} else {

				fs.writeFileSync(sourcePath + responseData.fileName, base64data, "base64");

				// If the file was written to the disk then we create an entry in the
				// media table and return the id back in the response.
				var mediaRequest = {
					cinema_id:		requestData.cinema_id,
					user_id:		requestData.user_id,
					site_name:		requestData.site_name,
					language:		requestData.language,
					query: {},
					payload: {
						site_name:			requestData.payload.info.site_name,
						media_type_id:		requestData.payload.info.media_type_id || 0,
						media_desc:			requestData.payload.image.name,
						media_name:			responseData.fileName,
						media_directory:	linkDirectory,
						media_height:		requestData.payload.image.naturalHeight,
						media_width:		requestData.payload.image.naturalWidth,
						media_size:			requestData.payload.image.size,
						uploaded_by:		requestData.user_id
					}
				};

				var query = connection.query("CALL set_media(?);", [JSON.stringify(mediaRequest)], callback);
				console.log(query.sql);

			}

		});

	} catch (ex) {

		responseData.status = 99;
		responseData.message = ex;

		logger.error(`There was an error writing files`, ex);

		callback(responseData, []);
	}
}
