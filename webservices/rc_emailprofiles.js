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

Webservice exposure for the back office email_profiles functions
*/
exports.getEmailProfiles = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_profiles(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setEmailProfiles = function(connection, callback, requestData) {
    var query = connection.query("CALL set_email_profiles(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delEmailProfiles = function(connection, callback, requestData) {
    var query = connection.query("CALL del_email_profiles(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailProfilesList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_profiles_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailProfilesRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_profiles_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchEmailProfiles = function(connection, callback, requestData) {
    var query = connection.query("CALL search_email_profiles(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
