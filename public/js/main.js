var socket = io();
var lineChart = null;
var highLoadAlert = null;

// Init the lineChart and highLoadAlert with inital data received upon connection
socket.on('init', function(initData){
  console.log(initData);
  initData.loadAvg = initData.lastNLoad[initData.lastNLoad.length - 1];
  updateInfo(initData);
  lineChart = new Viz.LineChart(initData);
  highLoadAlert = new Alert.HighLoad(initData, "#log");
});

// Add data points being received to lineChart and pass through highLoadAlert
socket.on('stats', function(msg){
  console.log('stats: ', msg);
  updateInfo(msg);
  lineChart.addPoint(msg.loadAvg);
  highLoadAlert.checkData(msg.loadAvg);
});

socket.on('disconnect', function(msg){
  console.log('disconnect', msg);
});

// Attach click event handlers to all the buttons and emit their ids to server upon click
var buttons = Array.prototype.slice.call(document.getElementsByTagName('button'));
buttons.forEach(function(button){
  button.addEventListener('click', function(e){
    socket.emit(e.target.id, {'date': new Date()});
  });
});

//Update the info box 
function updateInfo(updateObj){
	var timeFormat = d3.time.format("%I:%M:%S %p - %x");
	if(updateObj.cpu != undefined){
		document.querySelector('#info .cpu-model').textContent = updateObj.cpu[0].model;
		document.querySelector('#info .cpu-num').textContent = updateObj.cpu.length;
	}
	if(updateObj.type != undefined){
		document.querySelector('#info .os-type').textContent = updateObj.type;
	}
	if(updateObj.loadAvg != undefined){
		document.querySelector('#info .time').textContent = timeFormat(new Date(updateObj.loadAvg.time));
		document.querySelector('#info .value').textContent = updateObj.loadAvg.data;
	}
	if(updateObj.currentLoad != undefined){
		document.querySelector('#info .currentLoad').textContent = updateObj.currentLoad;
	}
	if(updateObj.clientCount != undefined){
		document.querySelector('#info .clientCount').textContent = updateObj.clientCount;
	}
}

