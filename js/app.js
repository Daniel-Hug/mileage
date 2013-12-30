// Easy looping:
function each(arr, fn, scope) {
	for (var i = 0, l = arr.length; i < l; i++) {
		fn.call(scope, arr[i], i, arr);
	}
}
function map(arr, fn, scope) {
	var newArr = [];
	for (var i = 0, l = arr.length; i < l; i++) {
		newArr[i] = fn.call(scope, arr[i], i, arr);
	}
	return newArr;
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

// localStorage wrapper:
var storage = {
	get: function(prop) {
		return JSON.parse(localStorage.getItem(prop));
	},
	set: function(prop, val) {
		localStorage.setItem(prop, JSON.stringify(val));
	},
	has: function(prop) {
		return localStorage.hasOwnProperty(prop);
	},
	remove: function(prop) {
		localStorage.removeItem(prop);
	},
	clear: function() {
		localStorage.clear();
	}
};

// Templating:
var tmp = {};
(function(open, close) {
	each(qsa('script[type=tmp]'), function(el) {
		var src = el.innerHTML;
		tmp[el.id] = function(data) {
			var result = src,
				key;
			for (key in data) {
				result = result.split(open + key + close).join(data[key]);
			}
			return result;
		};
	});
})('{{', '}}');


// Render fillups to table:
function renderFillup(fillupData) {
		var tr = document.createElement('tr');
		tr.innerHTML = tmp.fillup(fillupData);
		return tr;
}

var fillups = storage.get('mileage_fillups') || [];
var fillupRows = map(fillups, renderFillup);
var fillupRowsDocFrag = document.createDocumentFragment();
each(fillupRows, function(fillupRow) {
	fillupRowsDocFrag.appendChild(fillupRow);
});
var fillupTableBody = qs('.fillup-table tbody');
fillupTableBody.appendChild(fillupRowsDocFrag);


// Handle new fillup entries:
function handleFillup(event) {
	event.preventDefault();
	var formData = {
		date: this.date.value,
		cost: this.cost.value,
		gallons: this.gallons.value,
		odometer: this.odometer.value
	};
	fillups.push(formData);
	storage.set('mileage_fillups', fillups);

	// Render to table:
	fillupTableBody.appendChild(renderFillup(formData));
}

var fillupForm = qs('.fillup-form');
on(fillupForm, 'submit', handleFillup);


// Set date input to defalut to today:
var fillupDate = qs('[name=date]', fillupForm);
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