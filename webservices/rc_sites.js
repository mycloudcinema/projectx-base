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

 Webservice exposure for the back office sites functions
 */
function getSites(connnection, callback, requestData) {
    var query = connnection.query("CALL get_sites(?);", [JSON.stringify(requestData)], callback);
}
exports.getSites = getSites;
function setSites(connnection, callback, requestData) {
    var query = connnection.query("CALL set_sites(?);", [JSON.stringify(requestData)], callback);
}
exports.setSites = setSites;
function delSites(connnection, callback, requestData) {
    var query = connnection.query("CALL del_sites(?);", [JSON.stringify(requestData)], callback);
}
exports.delSites = delSites;
function getSitesList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_sites_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getSitesList = getSitesList;
function getSitesRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_sites_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getSitesRecent = getSitesRecent;
function searchSites(connnection, callback, requestData) {
    var query = connnection.query("CALL search_sites(?);", [JSON.stringify(requestData)], callback);
}
exports.searchSites = searchSites;
