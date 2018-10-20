//initial state data.  update/delete as you please. 
var eventDay = "March 24";
var scheduleData = [
  {
    time: "10 AM",
    name: "Check In",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "10:30 AM",
    name: "Waitlist Check In",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "11 AM",
    name: "Opening Ceremony",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "12 PM",
    name: "Lunch; Hacking Begins",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "12:30 PM",
    name: "Team Mixer",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "1 PM",
    name: "Make Your Own Website Workshop.",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "4 PM",
    name: "Hack the Hackers",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "5 PM",
    name: "1517 Social",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "7 PM",
    name: "Dinner",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "9 PM",
    name: "Cup Stacking",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  },
  {
    time: "10 PM",
    name: "Capture The Flag",
    location: "Juniper Aspiration Dome",
    info: "Where we will collect all your information and make sure you know what you are getting into!"
  }, 
]

//important dom elements refrenced early on.
var line = document.getElementById("line");
var schedList = document.getElementById("schedList");

//fill in the list on the right.
scheduleData.map(function (event, i) {
  schedList.insertAdjacentHTML("beforeend",'<tr id="listItem'+i+'" data-linkTo="'+i+'" class="scheduleLink"><td>'+event.time+'</td><td>'+event.name+'</td></tr>');
});

//create an "active list"
//find time closest to now (based on momentjs) and set that as active. 
var activeTracker = [];
var closestEvent = {index : null, diff: null};
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

//handle displaying the active event. 
var timeline_displayedEvents = [];
function displayDynamicSchedule() {
  //get the active schedule item
  var activeEvent = findActiveEvent();
  
  //create some variables for manipulated dom elements.
  var displayNameNode = document.getElementById("schedName");
  var displayTimeNode = document.getElementById("schedTime");
  var displayLocationNode = document.getElementById("schedLocation");
  var displayInfoNode = document.getElementById("schedInfo");

  //reset some text
  displayNameNode.innerHTML = activeEvent.event.name;
  displayTimeNode.innerHTML = activeEvent.event.time;
  displayInfoNode.innerHTML = activeEvent.event.info;
  displayLocationNode.innerHTML = activeEvent.event.location;

  
  //change the timeline navigation buttons (the arrows)
  var nextKey = scheduleData[(activeEvent.key * 1) + 1] ? (activeEvent.key * 1) + 1 : 0;
  var prevKey = scheduleData[(activeEvent.key * 1) - 1] ? (activeEvent.key * 1) - 1 : scheduleData.length - 1;
  $('#schedIncrease').attr('data-linkTo',nextKey);
  $('#schedDecrease').attr('data-linkTo',prevKey);
  
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