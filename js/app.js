var getPrettyData = (function() {
	var last;
	return function (fillupData) {
		var prettyData = clone(fillupData);
		if (last) {
			prettyData.days = dayDiff(last.date, fillupData.date);
			prettyData.miles = fillupData.odometer - last.odometer;
			prettyData.MPG = (prettyData.miles / fillupData.gallons).toFixed(2);
			prettyData.dollarsPerMile = '$' + (fillupData.dollars / prettyData.miles).toFixed(2);
		} else {
			prettyData.days =
			prettyData.miles =
			prettyData.MPG = 
			prettyData.dollarsPerMile = 'N/A';
		}
		prettyData.date = formatDate(fillupData.date);
		prettyData.dollars = '$' + fillupData.dollars;
		last = fillupData;
		return prettyData;
	};
})();


// Stick fillup data in a tr:
var fillupTable = qs('.fillup-table');
function renderFillup(fillupData) {
	if (fillupTable.hidden) fillupTable.hidden = false;
	return tmp.fillup(getPrettyData(fillupData), 'tr');
}


// Get fillups from localStorage and add to table:
var fillups = storage.get('mileage_fillups') || [];
var fillupTableBody = qs('tbody', fillupTable);
renderMultiple(fillups, renderFillup, fillupTableBody);


// Handle new fillup entries:
function handleFillup(event) {
	event.preventDefault();
	var formData = {
		date: parseDashDate(this.date.value).getTime(),
		dollars: this.dollars.value,
		gallons: this.gallons.value,
		odometer: this.odometer.value
	};
	fillups.push(formData);
	storage.set('mileage_fillups', fillups);

	// Add to table:
	prependAInB(renderFillup(formData), fillupTableBody);
}

var fillupForm = qs('.fillup-form');
on(fillupForm, 'submit', handleFillup);


// Set date input to defalut to today:
var fillupDate = qs('[name=date]', fillupForm);
fillupDate.value = getDashDate();