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

Webservice exposure for the back office email_attachments functions
*/
exports.getEmailAttachments = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_attachments(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setEmailAttachments = function(connection, callback, requestData) {
    var query = connection.query("CALL set_email_attachments(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delEmailAttachments = function(connection, callback, requestData) {
    var query = connection.query("CALL del_email_attachments(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailAttachmentsList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_attachments_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getEmailAttachmentsRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_email_attachments_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchEmailAttachments = function(connection, callback, requestData) {
    var query = connection.query("CALL search_email_attachments(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
