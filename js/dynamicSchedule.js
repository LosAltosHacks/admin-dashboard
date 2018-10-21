//initial state data.  update/delete as you please. 
var dayKey = 0;
var days = ["March 23","March 24"];
var eventDay = days[dayKey];
var scheduleData = Schedules[eventDay].sched;

//important dom elements refrenced early on.
var line = document.getElementById("line");
var schedList = document.getElementById("schedListData");

//fill in the list on the right.
function initSideList() {
  schedList.innerHTML = "";
  scheduleData.map(function (event, i) {
    schedList.insertAdjacentHTML("beforeend",'<tr id="listItem'+i+'" data-linkTo="'+i+'" class="scheduleLink"><td>'+event.time+'</td><td>'+event.name+'</td></tr>');
  });
  var formattedDay = moment(eventDay, "MMMM DD").format("dddd");
  $("#schedDayLarge").text(eventDay + " - " + formattedDay);
}
initSideList();


//create an "active list"
//find time closest to now (based on momentjs) and set that as active.
var activeTracker;
var closestEvent;
function initTracker() {
  activeTracker = [];
  closestEvent = {index : null, diff: null};
  for (var eventKey in scheduleData) {
  var event = scheduleData[eventKey];
  var eventTime = moment(eventDay + " " + event.time, "MMMM DD hh:mm A");
  var now = moment();
  var diff = eventTime.diff(now);
  if (closestEvent.diff == null || closestEvent.diff > diff) {
    closestEvent.index = eventKey;
    closestEvent.diff = diff;
  }
  activeTracker.push(false);
}
activeTracker[closestEvent.index] = true;
}
initTracker();


//a few functions that will be used later on.
function findActiveEvent() {
  for (var key in activeTracker) {
    if (activeTracker[key]) {
      return {
        key : key,
        event : scheduleData[key]
      };
    }
  }
  return null;
}
function updateActiveEvent(key) {
  var currEvent = findActiveEvent();
  activeTracker[currEvent.key] = false;
  activeTracker[key] = true;
  displayDynamicSchedule();
}
function reInitSchedule() {
  //reinit tracker and sidelist.
  initSideList();
  initTracker();
  displayDynamicSchedule();
}


//handle displaying the active event. 
var timeline_displayedEvents = [];
function displayDynamicSchedule() {
  //get the active schedule item
  var activeEvent = findActiveEvent();
  
  //create some variables for manipulated dom elements.
  var displayNameNode = document.getElementById("schedName");
  var displayTimeNode = document.getElementById("schedTime");
  var displayLocationNode = document.getElementById("schedLocation");

  //reset some text
  displayNameNode.innerHTML = activeEvent.event.name;
  displayTimeNode.innerHTML = activeEvent.event.time;
  displayLocationNode.innerHTML = activeEvent.event.location;

  
  //change the timeline navigation buttons (the arrows)
  var nextKey = scheduleData[(activeEvent.key * 1) + 1] ? (activeEvent.key * 1) + 1 : 0;
  var prevKey = scheduleData[(activeEvent.key * 1) - 1] ? (activeEvent.key * 1) - 1 : scheduleData.length - 1;
  $('#schedIncrease').attr('data-linkTo',nextKey);
  $('#schedDecrease').attr('data-linkTo',prevKey);
  
  //change the day displayed
  var formattedDay = moment(eventDay, "MMMM DD").format("dddd");
  $("#schedDay").text(formattedDay);
  
  //display the new timeline. 
  //first find the active event in the currently displayed timeline. 
  var displayedEventsKey = null;
  for (var key in timeline_displayedEvents) {
    if (timeline_displayedEvents[key] == activeEvent.key) {
      displayedEventsKey = key;
      break;
    }
  }
  //if the element exists in the timeline list, don't recreate it. If not, create a new timeline. 
  if (!displayedEventsKey) {
    timeline_displayedEvents = [];
    line.innerHTML = "";
    for (var i = activeEvent.key; i < (activeEvent.key * 1) + 4; i ++) {
      timeline_displayedEvents.push(i);
      var time = scheduleData[i] ? scheduleData[i].time : "...";
      var elem = '<div id="timelineItem'+i+'" data-linkTo="'+ (scheduleData[i] ? i : null) +'" class="scheduleLink">'+time+'</div>';
      line.insertAdjacentHTML('beforeend',elem);
    }
  }
  
  
  //bold the item in the schedule list. 
  $(".scheduleLink.active").removeClass("active");
  $("#listItem"+activeEvent.key).addClass("active");
  $("#timelineItem"+activeEvent.key).addClass("active");
}

displayDynamicSchedule();


//bind some event listeners. 
$('#schedule').on('click','.scheduleLink',function(){
  var nextActiveEventKey = $(this).attr('data-linkTo');
  if (nextActiveEventKey != "null") {
    updateActiveEvent(nextActiveEventKey);
  }
});

$("#toggleDay").click(function(){
  if (dayKey == 0) {
    dayKey = 1;
    $("#toggleDay").html("View Saturday");
  }
  else {
    dayKey = 0;
    $("#toggleDay").html("View Sunday");
  }
  eventDay = days[dayKey];
  scheduleData = Schedules[eventDay].sched;
  reInitSchedule()
});