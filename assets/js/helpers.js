async function signup(user) {
  if (!user.first_name || !user.surname || !user.email || !user.age || !user.school || !user.grade || !user.student_phone_number || !user.gender || !user.tshirt_size || !user.previous_hackathons) return false;
  else if (user.age < 18 && (!user.guardian_name || !user.guardian_email || !user.guardian_phone_number)) return false;
  let result = await request("POST", "/registration/v1/signup", user);
  return result;
}

async function guestSignUp(guest) {
  if (!guest.kind || !guest.name || !guest.phone || !guest.email) return false;
  let result = await request("POST", "/guest/v1/signup", guest);
  return result;
}

async function getGuest(query) {
  let result = await request("POST", "/guest/v1/search", {query: query});
  return result;
}

async function modifyGuest(guest_id, params) {
  let result = await request("POST", "/guest/v1/modify/" + guest_id, params);
  return result;
}

async function removeGuest(guest_id) {
  let result = await request("GET", "/guest/v1/delete/" + guest_id);
  return result;
}

async function checkin(user_id) {
  let result = await request("POST", "/registration/v1/sign-in", {user_id: user_id, badge_data: user_id});
  return result;
}

async function checkout(user_id) {
  let result = await request("POST", "/registration/v1/sign-out", {badget_data: user_id});
  return result;
}

async function getMeal(badge_data, meal_number, allowed_servings) {
  let result = await request("POST", "/registration/v1/meal", {badge_data: badge_data, meal_number: meal_number, allowed_servings: allowed_servings});
  return result;
}

async function modify(user_id, params) {
  let result = await request("POST", "/registration/v1/modify/" + user_id, params);
  return result;
}

async function modifyMentor(mentor_id, params) {
  let result = await request("POST", "/mentor/v1/modify/" + mentor_id, params);
  return result;
}

async function acceptMentor(mentor_id, status) {
  if (status != "none" && status != "waitlisted" && status != "rejected" && status != "queue" && status != "accepted" && status != "waitlist_queue") return false;
  let result = await request("POST", "/mentor/v1/modify/" + mentor_id, {acceptance_status: status});
  return result;
}

async function accept(user_id, status) {
  if (status != "none" && status != "waitlisted" && status != "rejected" && status != "queue" && status != "accepted" && status != "waitlist_queue") return false;
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

async function deleteMentor(mentor_id) {
  let result = await request("GET", "/mentor/v1/delete/" + mentor_id);
  return result;
}

async function getUser(query) {
  let result = await request("POST", "/registration/v1/search", {query: query});
  return result;
}

async function getMentor(query) {
  let result = await request("POST", "/mentor/v1/search", {query: query});
  return result;
}

async function listVIP() {
  let result = await request("GET", "/guest/v1/list");
  return result;
}

async function getHistory(user_id) {
  let result = await request("GET", "/registration/v1/history/" + user_id);
  return result;
}

async function getMentorHistory(mentor_id) {
  let result = await request("GET", "/mentor/v1/history/" + mentor_id);
  return result;
}

// function addTestEntry(type, n) {
//   switch(n) {
//     case "attendee":
//       for (var i=0; i<n; i++) {
//         signup({
//           first_name: "TestEntryFirst" + i,
//           surname: "TestEntryLast" + i,
//           email: fakeEmail(),
//           age: Math.floor(Math.random() * 6) + 13,
//           school: "Test High School",
//           grade: Math.floor(Math.random() * r) + 9,
//           student_phone_number: "1111111111",
//           guardian_name: "TestGuardian",
//           guardian_email: fakeEmail(),
//           guardian_phone_number: "1111111111",
//           gender: "Male",
//           tshirt_size: "M",
//           previous_hackathons: Math.floor(Math.random()*8),
//           github_username: "testgithub",
//           linkedin_profile: "https://www.linkedin.com/in/test-linkedin/",
//           diestary_restrictions: "None"
//         })
//       }
//
//   }
// }

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
        logout();
        reject({
          status: this.status,
          message: this.response.message
        });
      }
    }

    xhttp.onerror = function() {
      logout();
      reject({
        status: this.status,
        message: this.statusText
      });
    }

    if (data) xhttp.send(JSON.stringify(data));
    else xhttp.send();
  })
}

function logout() {
  localStorage.removeItem('jwt_auth');
  localStorage.removeItem('name');
  localStorage.removeItem('prof_image');
  window.location.href = "/login.html";
  if (gapi.auth2.getAuthInstance()) gapi.auth2.signout(); // Future implementation with scopes
}

function escapeHTML(s) {
  return s.replace(/[&"'<>`]/g, '');
}

async function writeNewPost(subject, content, pinned) {
  let result = await db.collection("events").add({
    name: subject,
    content: content,
    isPinned: pinned ? true : false
  })
  return result;
}

async function getAnnouncements() {
  let result = db.collection("events").get();
  return result;
}

async function deleteAnnouncement(id) {
  let result = db.collection("events").doc(id).delete();
  return result;
}

async function modifyAnnouncement(id, subject, content, pinned) {
  let result = db.collection("events").doc(id).set({
    name: subject,
    content: content,
    isPinned: pinned ? true : false
  })
  return result;
}

function print(id, first_name, last_name) {
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/print",
    contentType: "application/json",
    data: JSON.stringify({id: id, first_name: first_name, last_name: last_name})
  }).done(function(result) {
    console.log(result);
  })
}
