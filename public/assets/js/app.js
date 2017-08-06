  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDbD25_dRT6Lm9fwk-iOrJCdYsdoLWvK7Y",
    authDomain: "train-scheduler-8938f.firebaseapp.com",
    databaseURL: "https://train-scheduler-8938f.firebaseio.com",
    projectId: "train-scheduler-8938f",
    storageBucket: "",
    messagingSenderId: "604795417499"
  };
  firebase.initializeApp(config);

var trainDatabase = firebase.database();
var timeReg = new RegExp("^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
var freqReg = new RegExp("^[0-9]{1,10}$");

$("#add-train-btn").on("click", function(e) {
  e.preventDefault();
  var traName = $("#name-input").val().trim();
  var traDest = $("#dest-input").val().trim();
  var traTime = $("#time-input").val().trim();
  var traFreq = $("#freq-input").val().trim();

  if(timeReg.exec(traTime) != null && freqReg.exec(traFreq) != null){
    var employeeData = {
      name: traName,
      dest: traDest,
      time: traTime,
      freq: traFreq
    };
    trainDatabase.ref().push(employeeData);

    $("#name-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");

    alert("Train successfully added");
  }
  else{
    alert("Please Input Valid Time");
  };
});
var today = new Date();
trainDatabase.ref().on("child_added", function(childSnapshot){
  var name = childSnapshot.val().name;
  var dest = childSnapshot.val().dest;
  var hourMinArr = childSnapshot.val().time.split(":");
  var freq = parseInt(childSnapshot.val().freq);
  var hour = parseInt(hourMinArr[0]);
  var min = parseInt(hourMinArr[1]);
  var deparTime = moment().hour(hour).minute(min);
  var now = moment();

  while(moment(now).isAfter(deparTime) === true){
    deparTime = moment(deparTime).add(freq, "m");
  }
$("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" +
  freq + "</td><td>" + moment(deparTime).format("h:mm a") + "</td><td>" + moment(deparTime).diff(moment(now),'m') + "</td></tr>");

});  