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

Webservice exposure for the back office dictionary functions
*/
exports.getDictionary = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary(?);", [JSON.stringify(requestData)], callback);
}
exports.setDictionary = function(connnection, callback, requestData) {
	var query = connnection.query("CALL set_dictionary(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.setDictionaryItem = function(connnection, callback, requestData) {
	var query = connnection.query("CALL set_dictionary_item(?);", [JSON.stringify(requestData)], callback);
}
exports.delDictionary = function(connnection, callback, requestData) {
	var query = connnection.query("CALL del_dictionary(?);", [JSON.stringify(requestData)], callback);
}
exports.getDictionaryList = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getDictionaryByCategory = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary_by_category(?);", [JSON.stringify(requestData)], callback);
}
exports.getDictionaryNeedsUpdate = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary_needs_update(?);", [JSON.stringify(requestData)], callback);
}
exports.getDictionaryCategories = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary_categories(?);", [JSON.stringify(requestData)], callback);
}
exports.getDictionaryRecent = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_dictionary_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchDictionary = function(connnection, callback, requestData) {
	var query = connnection.query("CALL search_dictionary(?);", [JSON.stringify(requestData)], callback);
}
