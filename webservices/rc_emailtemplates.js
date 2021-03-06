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

Webservice exposure for the back office email_templates functions
*/
exports.getEmailTemplates = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_templates(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setEmailTemplates = function(connection, callback, requestData) {
    var query = connection.query("CALL set_email_templates(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delEmailTemplates = function(connection, callback, requestData) {
    var query = connection.query("CALL del_email_templates(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailTemplatesList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_templates_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailTemplatesRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_templates_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchEmailTemplates = function(connection, callback, requestData) {
    var query = connection.query("CALL search_email_templates(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
