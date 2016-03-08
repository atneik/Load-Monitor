var Alert = (function () {

	var data;
	var alertStatus = false;
	var outputDiv = null;

	function HighLoad(initData, div) {
		data = initData.lastNLoad;
		outputDiv = document.querySelector(div);
		// Clear the outputDiv
		while (outputDiv.firstChild) {
			outputDiv.removeChild(outputDiv.firstChild);
		}
		data.forEach(checkData);
	}
	
	// Append p node with alert to outputDiv
	function  sendAlert(status, msg){
		var node = document.createElement('p');
		node.className = 'alert ' + (status ? 'start' : 'end');
		node.textContent = msg;
		console.log(msg);
		outputDiv.appendChild(node);
	}

	// Check data point for alerts and use sendAlert to output alert.
	function checkData(value) {
		var alerts = value.alerts && JSON.parse(value.alerts);
		var timeFormat = d3.time.format("%I:%M %p");
		if(alerts){
			if(alertStatus == false && alerts['highLoad']){
				alertStatus = true;
				sendAlert(alertStatus, "High load generated an alert - load = " + value.data + ", triggered at " + timeFormat(new Date(value.time)));
			}
			if(alertStatus == true && alerts['highLoad'] == undefined){
				alertStatus = false;
				sendAlert(alertStatus, "Load normal - load = " + value.data + ", triggered at " + timeFormat(new Date(value.time)));
			}
		}
	}

	HighLoad.prototype = {
		constructor: HighLoad,
		checkData: checkData
	}

	return {
		HighLoad: HighLoad
	}
}());