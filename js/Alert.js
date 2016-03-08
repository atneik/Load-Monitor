var os = require('os');

var Alert = function(alertInterval, delayInterval) {
  this.alerts = {};
  this.lastNtoCheck = alertInterval / delayInterval;
}

Alert.prototype.getAlerts = function(lastNLoad) {
  var isAlert = true;
  // Check if Alert is active
  for(var i = lastNLoad.length - this.lastNtoCheck; i < lastNLoad.length; i++){
    if(lastNLoad[i].data < os.cpus().length/4){
      isAlert = false;
      break;
    }
  }
  // If Alert is active and alert not defined, define the alert.
  if(isAlert){
    if(this.alerts['highLoad'] == undefined){
      this.alerts['highLoad'] = lastNLoad[lastNLoad.length - 1].time;
    }
  } else {
    this.alerts['highLoad'] = undefined;
  }
  return this.alerts;
}

module.exports = Alert;