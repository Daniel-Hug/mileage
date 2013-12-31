// Easy looping:
function each(arr, fn, scope) {
	for (var i = 0, l = arr.length; i < l; i++) {
		fn.call(scope, arr[i], i, arr);
	}
}
function map(arr, fn, scope) {
	var l = arr.length, newArr = [];
	for (var i = 0; i < l; i++) {
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
		tmp[el.id] = function(data, elName) {
			var newSrc = src,
				key;
			for (key in data) {
				newSrc = newSrc.split(open + key + close).join(data[key]);
			}
			if (elName) {
				var el = document.createElement(elName);
				el.innerHTML = newSrc;
				return el;
			}
			return newSrc;
		};
	});
})('{{', '}}');


function prependAInB(newChild, parent) {
	parent.insertBefore(newChild, parent.firstChild);
}


// Loop through arr of data objects,
// render each data object as an element with data inserted using the renderer,
// append each element to a documentFragment, and return the documentFragment:
function renderMultiple(arr, renderer) {
	var renderedEls = map(arr, renderer);
	var docFrag = document.createDocumentFragment();
	each(renderedEls, function(renderedEl) {
		prependAInB(renderedEl, docFrag);
	});
	return docFrag;
}

function absRound(number) {
	return Math[number < 0 ? 'ceil' : 'floor'](number);
}

function parseDashDate(str) {
	return new Date(str.split('-').join('/'))
}

function dayDiff(first, second) {
	first = parseDashDate(first);
	second = parseDashDate(second);
    return absRound( (second - first) / (1000*60*60*24) );
}

var getPrettyData = (function() {
	var last;
	return function (fillupData) {
		var prettyData = fillupData;
		if (last) {
			prettyData['days'] = dayDiff(last.date, prettyData.date);
			prettyData['miles'] = prettyData.odometer - last.odometer;
		} else {
			prettyData['days'] = 'N/A';
			prettyData['miles'] = 'N/A';
		}
		last = fillupData;
		return prettyData;
	};
})();


// Stick fillup data in a tr:
function renderFillup(fillupData) {
	return tmp.fillup(getPrettyData(fillupData), 'tr');
}


// Get fillups from localStorage and add to table:
var fillups = storage.get('mileage_fillups') || [];
var fillupTableBody = qs('.fillup-table tbody');
fillupTableBody.appendChild(renderMultiple(fillups, renderFillup));


// Handle new fillup entries:
function handleFillup(event) {
	event.preventDefault();
	var formData = {
		date: this.date.value,
		dollars: this.dollars.value,
		gallons: this.gallons.value,
		odometer: this.odometer.value
	};
	fillups.push(formData);
	storage.set('mileage_fillups', fillups);

	// Render to table:
	prependAInB(renderFillup(formData), fillupTableBody);
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