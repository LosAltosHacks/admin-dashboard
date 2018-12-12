"use strict";
async function signup(user) {
  if (!user.first_name || !user.surname || !user.email || !user.age || !user.school || !user.grade || !user.student_phone_number || !user.gender || !user.tshirt_size || !user.previous_hackathons) return false;
  else if (user.age < 18 && (!user.guardian_name || !user.guardian_email || !user.guardian_phone_number)) return false;
  let result = await request("POST", "/registration/v1/signup", user);
  return result;
}

async function modify(user_id, params) {
  let result = await request("POST", "/registration/v1/modify/" + user_id, params);
  return result;
}

async function accept(user_id, status) {
  if (status != "none" && status != "waitlisted" && status != "rejected" && status != "queue" && status != "accepted") return false;
  modify(user_id, {acceptance_status: status});
}

async function verify(user_id) {
  modify(user_id, {email_verified: true});
}

async function unverify(user_id) {
  modify(user_id, {email_verified: false});
}

async function deleteUser(user_id) {
  let result = await request("GET", "/registration/v1/delete/" + user_id);
  return result;
}

async function getUser(query) {
  let result = await request("POST", "/registration/v1/search", {query: query});
  return result;
}

async function getHistory(user_id) {
  let result = await request("GET", "/registration/v1/history/" + user_id);
  return result;
}

// For development purposes only
async function populateUsers(n) {
  for (var i=0; i<n; i++) {
    signup({
      first_name: "First",
      surname: "Last",
      email: fakeEmail(),
      age: Math.floor(Math.random() * 20),
      school: "High School",
      grade: Math.floor(Math.random() * 3) + 9,
      student_phone_number: "111111111",
      guardian_name: "Guardian Name",
      guardian_email: fakeEmail(),
      guardian_phone_number: "2222222222",
      gender: "Female",
      tshirt_size: "M",
      previous_hackathons: Math.floor(Math.random()*10),
      github_username: fakeEmail(),
      linkedin_profile: fakeEmail(),
      dietary_restrictions: "None"
    });
  }
  updateLists();
}

function fakeEmail() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i<10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  text += "@gmail.com";
  console.log(text);
  return text;
}

function request(method, url, data) {
  return new Promise(function (resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.open(method, server + url, true);
    if (jwt_auth) xhttp.setRequestHeader("Authorization", "Bearer " + jwt_auth);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        if (this.response.message.description === "Not authorized") {
          jwt_auth = "";
          logout();
        }
        reject({
          status: this.status,
          message: this.response.message
        });
      }
    }

    xhttp.onerror = function() {
      reject({
        status: this.status,
        message: this.statusText
      });
    }

    if (data) xhttp.send(JSON.stringify(data));
    else xhttp.send();
  })
}

function updateLists() {
  $('.list > *').not('.header').remove();
  getList();
  getAcceptedList();
  getUnacceptedList();
  getSubscribedList();
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
  if (gapi.auth2.getAuthInstance()) gapi.auth2.signout(); // Future implementation with scopes
}

function escapeHTML(s) {
  return s.replace(/[&"'<>`]/g, '');
}
