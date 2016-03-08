var assert = require('assert');
var os = require('os');
var Alert = require('../js/Alert');

describe('Alert', function() {
	var highLoad15secs;
	var date;

	beforeEach(function () {
		highLoad15secs = new Alert(15000, 5000);
		date = new Date();
	});

	it('has a getAlerts function', function () {
		assert.equal(typeof highLoad15secs.getAlerts, 'function');
	});

	it('get a valid highLoad alert', function () {
		
		var highSampleData = Array.apply(null, Array(3)).map(function(val, i){
			return {
		    data: Math.random() + os.cpus().length/4,
		    time: date
		  }
		});
		assert.equal(highLoad15secs.getAlerts(highSampleData).highLoad === date, true);
	});

	it('do not get a valid highLoad alert', function () {
		var lowSampleData = Array.apply(null, Array(3)).map(function(val, i){
			return {
		    data: Math.random(),
		    time: date
		  }
		});
		assert.equal(highLoad15secs.getAlerts(lowSampleData).highLoad === date, false);
	});
});