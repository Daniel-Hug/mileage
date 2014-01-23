function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function absRound(number) {
	return Math[number < 0 ? 'ceil' : 'floor'](number);
}

// get a Date object from an input[type=date] value:
function parseDashDate(str) {
	return new Date(str.split('-').join('/'));
}

// Difference between two timestamps in days:
function dayDiff(first, second) {
    return absRound( (second - first) / (1000*60*60*24) );
}

// Convert timestamp into a date string looking like this: "Wed, Jun 5, 2013":
function formatDate(date) {
	var parts = new Date(date).toDateString().split(' '); // ["Thu", "Jan", "01", "1970"]
	parts.shift(); // ["Jan", "01", "1970"]
	parts[1] = +parts[1]; // ["Jan", 1, "1970"]
	var isCurrentYear = parts[2] == new Date().getFullYear();
	if (isCurrentYear) parts.pop(); // ["Jan", 1]
	else parts[1] += ', '; // ["Jan", "1, ", "1970"]
	return parts.join(' ');
}

function getDashDate() {
	var date = new Date();

	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	return year + "-" + month + "-" + day;
}