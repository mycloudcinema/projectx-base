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

 Webservice exposure for the back office languages functions
 */
exports.getLanguages = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_languages(?);", [JSON.stringify(requestData)], callback);
}
exports.setLanguages = function(connnection, callback, requestData) {
	var query = connnection.query("CALL set_languages(?);", [JSON.stringify(requestData)], callback);
}
exports.delLanguages = function(connnection, callback, requestData) {
	var query = connnection.query("CALL del_languages(?);", [JSON.stringify(requestData)], callback);
}
exports.getLanguagesList = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_languages_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getLanguagesRecent = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_languages_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchLanguages = function(connnection, callback, requestData) {
	var query = connnection.query("CALL search_languages(?);", [JSON.stringify(requestData)], callback);
}
