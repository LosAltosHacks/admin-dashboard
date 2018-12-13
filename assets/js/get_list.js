"use strict";
import { Attendee, AttendeeRenderType } from "./attendee.js";
import { request, getUser } from "./helpers.js"
import { SERVER } from './index.js';


export async function getSubscribedList() {
  $('#email-list ul').empty();
  let response = await request("GET", "/email_list/v1/subscriptions");
  response.forEach(function(email) {
    var element = document.createElement("li");
    element.textContent = email;
    document.querySelector("#email-list ul").appendChild(element);
  })
}

export async function getList() {
  let response = await request("GET", "/registration/v1/list");
  response.forEach(userData => {
    let attendee = new Attendee(userData);
    let element = attendee.getElement(AttendeeRenderType.ATTENDEE_LIST);
    document.getElementById("attendees-list").insertBefore(element, document.getElementById("attendees-list").children[1]);
  })
}

export async function getAcceptedList() {
  let response = await getUser({acceptance_status: "queue"});
  response.forEach(userData => {
    let attendee = new Attendee(userData);
    let element = attendee.getElement(AttendeeRenderType.ACCEPTED_LIST);
    document.getElementById("accepted-list").insertBefore(element, document.getElementById("accepted-list").children[1]);
  })
}

export async function getUnacceptedList() {
  let response = await getUser({acceptance_status: "none"});
  response.forEach(userData => {
    let attendee = new Attendee(userData);
    let element = attendee.getElement(AttendeeRenderType.UNACCEPTED_LIST);
    document.getElementById("unaccepted-list").insertBefore(element, document.getElementById("unaccepted-list").children[1]);
  })
}

// temporary solution to hoist the async to where other modules have been parsed and imported
setTimeout(() => {
getSubscribedList();
getList();
getAcceptedList();
getUnacceptedList();
}, 0);
