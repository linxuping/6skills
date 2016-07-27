function getQueryValue(key) {
	var queryStr = location.href.split("?")[1];
	if (queryStr == undefined || queryStr === "") {
		return null;
	}
	var tmpArr = queryStr.split("&");
	var getIt = null;
	tmpArr.map(function(elem, index) {
		var tmp = elem && elem.split("=");
		if (tmp[0] == key) {
			getIt = tmp[1];
		}
	})
	return getIt;
}
