(function(ng) {
	'use strict';
  	ng.module("rc.services").service("ExportHandler", [ExportHandler]);
		function ExportHandler(settings){
			this._settings = settings || this.default_settings;
		}
		ExportHandler.prototype.default_settings = {
			csv:{
				delimiter:"\t",
				newline:"\n"
			}
		};
		ExportHandler.prototype.csv = function (filename, dataset, headers) {
			var csv, blob;
			if(Object.prototype.toString.call(dataset) === "[object Array]" && dataset.length > 0) {
				csv = this._array_to_csv(dataset);
				blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
				saveAs(blob, filename + ".csv");
			} else if (typeof dataset === "object") {
				csv = this._array_to_csv([dataset]);
				blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
				saveAs(blob, filename + ".csv");
			} else {
				throw new Error("Could not export dataset. Expected dataset to be Object or Array, but got: ", dataset);
			}
			debug.log(csv);
		};
		ExportHandler.prototype._array_to_csv = function (dataset, map) {
			var out = "",
				headers = [],
				delimiter = (this._settings.csv ? this._settings.csv.delimiter : false) || this.default_settings.csv.delimiter,
				newline = (this._settings.csv ? this._settings.csv.newline : false) || this.default_settings.csv.newline
			// To ensure proper order of the elements we need to store them in an array.
			for (var key in dataset[0]) {
				headers.push(key);
				// Also write the header line since we're already here ;)
				out += (map ? map[key] : false || key) + delimiter;
			}
			// Add a new line after the header
			out += newline;
			// Now we have to write all the data lines
			for (var i = 0; i < dataset.length; i++) {
				var row = dataset[i];
				for (var j = 0; j < headers.length; j++) {
					out += row[headers[j]] + delimiter;
				}
				out += newline;
			}
			return out;
		};

		// Export an xml file formatted in Microsoft's SpreadsheetML xml schema.
		ExportHandler.prototype.xml = function (filename, dataset) {
			var blob,
				doc = jQuery.parseXML('<?xml version="1.0"?><Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" id="wb"></ss:Workbook>');
			this._add_sheet(doc, "My sheet");
			debug.log(new XMLSerializer().serializeToString(doc));

			blob = new Blob([new XMLSerializer().serializeToString(doc)], {type: "text/xml;charset=utf-8"});
			saveAs(blob, filename + ".xlsx");
		};
		ExportHandler.prototype._add_sheet = function(doc, sheet_name) {
			var wb = doc.getElementById("wb"),
				sheet = doc.createElement("ss:Worksheet"),
				table = doc.createElement("ss:Table");
			sheet.setAttribute("ss:Name", sheet_name);
			table.setAttribute("id", "table1");

			sheet.appendChild(table);
			wb.appendChild(sheet);
		}

		ExportHandler.prototype._array_to_xml = function(dataset){
			return "xml string";
		};
})(angular);
