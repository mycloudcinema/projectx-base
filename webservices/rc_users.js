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

Webservice exposure for the back office users functions
*/

const settings = require.main.require('@mycloudcinema/zframework/external/Settings');
const logger = require.main.require('@mycloudcinema/zframework/external/Logger').getLogger("base/rc_users.js", settings);

var sjcl = require.main.require("sjcl-full");
var crypto = require('crypto');

exports.getUsers = function(connnection, callback, requestData) {
	const { sql } = connnection.query("CALL get_users(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.setUsers = function(connnection, callback, requestData) {

	// We want to keep a full logging of any changes to the movies made through
	// the system.
	requestData.activity_log = true;
	requestData.activity_log_function = 'Users';

	// If the user has supplied a password then we encrypt and salt it
	// and that will be stored in the database.
	if (requestData.payload.password) {
		requestData.payload.password = generatePwd(requestData.payload.password);
	}
	const { sql } = connnection.query("CALL set_users(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.delUsers = function(connnection, callback, requestData) {

	// We want to keep a full logging of any changes to the movies made through
	// the system.
	requestData.activity_log = true;
	requestData.activity_log_function = 'Users';

	const { sql } = connnection.query("CALL del_users(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.getUsersList = function(connnection, callback, requestData) {
	const { sql } = connnection.query("CALL get_users_list(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.getUsersRecent = function(connnection, callback, requestData) {
	const { sql } = connnection.query("CALL get_users_recent(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.searchUsers = function(connnection, callback, requestData) {
	const { sql } = connnection.query("CALL search_users(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}

exports.getUsersShortcuts = function(connection, callback, requestData) {
	const { sql } = connection.query("CALL get_users_shortcuts(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}
exports.setUsersShortcuts = function(connection, callback, requestData) {
	const { sql } = connection.query("CALL set_users_shortcuts(?);", [JSON.stringify(requestData)], callback);
	logger.debug(sql);
}

// Functions for generating salted passwords. Keep them as function and export
// declarations as they are also used internally.
function generatePwd(pwd) {
	var passHash = sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(pwd));
	var passSalt = generateSalt(63);
	return sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(passHash + passSalt)) + passSalt;
}
exports.generatePwd = generatePwd;
function generateSalt(bytes) {
    var buffer = crypto.randomBytes(bytes), hexa = "";
    for (var i = 0; i < buffer.length; i++) {
        var byte = buffer[i].toString(16);
        if (byte.length === 1) {
            byte = "0" + byte;
        }
        hexa += byte;
    }
    return hexa;
}
exports.generateSalt = generateSalt;
