// Easy looping:
function each(arr, fn, scope) {
	for (var i = 0, l = arr.length; i < l; i++) {
		fn.call(scope, arr[i], i, arr);
	}
}

// Get elements by CSS selector:
function qs(selector, scope) {
	return (scope || document).querySelector(selector);
}
function qsa(selector, scope) {
	return (scope || document).querySelectorAll(selector);
}

// addEventListener wrapper:
function on(target, type, callback) {
	target.addEventListener(type, callback, false);
}


function handleFillup(event) {
	event.preventDefault();
}

var fillupForm = qs('.fillup-form');
on(fillupForm, 'submit', handleFillup);

// Set date input to defalut to today:
var fillupDate = qs('.fillup-form .date');
function getDashDate() {
	var date = new Date();

	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	return year + "-" + month + "-" + day;
}
fillupDate.value = getDashDate();