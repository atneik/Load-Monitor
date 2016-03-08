var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var os = require('os');
var exec = require('child_process').exec;

var port = process.env.PORT || 8080;
var loadCmd = "yes > /dev/null &";
var killLoadCmd = "killall yes";
var totalTime = 600000 // in millisecs
var delayInterval = 5000; // in millisecs
var n = totalTime/delayInterval;

var Alert = require('./js/Alert');
var alertInterval = 120000; // in millisecs
var highLoad2Min = new Alert(alertInterval, delayInterval);

// lastNLoad maintains previous n number of data points. Init lastNLoad with data as zero and date in past.
var lastNLoad = Array.apply(null, Array(n)).map(function(val, i){
  return {
    data: 0, 
    time: new Date(Date.now() + (delayInterval * (i - n - 1)))
  }
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, function () {
    console.log('Listening on localhost:' + port);
});

// Poll os for load average data and push it to lastNLoad
setInterval(function(){
    lastNLoad.push({
        data: os.loadavg()[0], 
        time: new Date(), 
        alerts: JSON.stringify(highLoad2Min.getAlerts(lastNLoad))
    });
    lastNLoad.shift();
}, delayInterval);

// Upon connection of a client with socket.io socket
io.on('connection', function(socket) { 
    console.log('connected: ', socket.id);
    
    // Send init data upon connection, which contains lasNLoad
    getLoadCount().then(function(count){
        console.log('init: ', socket.id);
        socket.emit('init', {
            lastNLoad: lastNLoad,
            type: os.type(), 
            cpu: os.cpus(),
            currentLoad: count,
            clientCount: io.engine.clientsCount
        });
    });
    
    // After set interval get lastest value from lastNLoad and emit it to client
    var timer = setInterval(function(){
        getLoadCount().then(function(count){
            console.log('stats: ', socket.id);
            socket.emit('stats', {
                loadAvg: lastNLoad[lastNLoad.length - 1], 
                currentLoad: count,
                clientCount: io.engine.clientsCount
            });
        });
    }, delayInterval);

    // If Add task button is pressed on client, we add more load by exec a yes command
    socket.on('addButton', function(data){
        console.log('event: addButton', data);
        addLoad();
    });

    // If kill all Tasks button is pressed on client, we run a command to kill all yes commands running
    socket.on('killButton', function(data){
        console.log('event: killButton', data);
        killLoad();
    });

    // Clear the set interval timer upon being disconnected
    socket.on('disconnect', function(){
        console.log('disconnect: ', socket.id);
        clearTimeout(timer);
    });
});

// Get number of yes commands running using ps
function getLoadCount() {
    return new Promise(function (resolve, reject){
        exec("ps", function (error, stdout, stderr) {
            if(error){
                reject(error);
            }
            var output = stdout.split('\n').filter(function(elem){
                var elem = elem.split(' ').filter(function(i){
                    return i.length > 0;
                });
                return elem[3] === 'yes';
            });   
            resolve(output.length);
        }.bind(this));
    });
}

function addLoad() {
    console.log('addLoad');
    exec(loadCmd);
}

function killLoad() {
    console.log('killLoad');
    exec(killLoadCmd);
}

process.on('SIGINT', function() {
    killLoad();
    process.exit();
});

