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

 Webservice exposure for the back office email_messages functions
 */
function getEmailMessages(connnection, callback, requestData) {
    var query = connnection.query("CALL get_email_messages(?);", [JSON.stringify(requestData)], callback);
}
exports.getEmailMessages = getEmailMessages;
function setEmailMessages(connnection, callback, requestData) {
    var query = connnection.query("CALL set_email_messages(?);", [JSON.stringify(requestData)], callback);
}
exports.setEmailMessages = setEmailMessages;
function delEmailMessages(connnection, callback, requestData) {
    var query = connnection.query("CALL del_email_messages(?);", [JSON.stringify(requestData)], callback);
}
exports.delEmailMessages = delEmailMessages;
function getEmailMessagesList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_email_messages_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getEmailMessagesList = getEmailMessagesList;
function getEmailMessagesRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_email_messages_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getEmailMessagesRecent = getEmailMessagesRecent;
function searchEmailMessages(connnection, callback, requestData) {
    var query = connnection.query("CALL search_email_messages(?);", [JSON.stringify(requestData)], callback);
}
exports.searchEmailMessages = searchEmailMessages;
