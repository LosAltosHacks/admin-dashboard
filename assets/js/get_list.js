async function getSubscribedList() {
  $('#email-list ul').remove();
  document.querySelector("#email-list").appendChild(document.createElement("ul"));
  let response = await request("GET", "/email_list/v1/subscriptions");
  response.forEach(function(email) {
    var element = document.createElement("li");
    element.textContent = email;
    document.querySelector("#email-list ul").appendChild(element);
  })
}

async function getList() {
  let response = await request("GET", "/registration/v1/list");
  $('#attendee-list .attendees-row, #attendee-list > p').remove();
  document.getElementById("attendees-count").innerHTML = response.length;
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#attendee-list');
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.acceptance_status == "none" ? "No" : user.acceptance_status.charAt(0).toUpperCase() + user.acceptance_status.slice(1), user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      attendee.querySelector("summary ul").appendChild(element)
    })

    attendee.querySelector("summary").setAttribute("title", user.first_name + " " + user.surname + " <" + user.user_id + ">");

    attendee.querySelector("summary").insertAdjacentHTML('afterbegin',
      "<span class='delete-icon'><span title='Delete Attendee'><img src='/assets/icons/close.svg'></span></span>"
    );

    attendee.querySelector(".attendees-row").setAttribute("data-id", user.user_id);
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender === "" ? "Decline to State" : user.gender));
    attendee.querySelector(".race").appendChild(document.createTextNode(!user.ethnicity || user.ethnicity === "" ? "Decline to State" : user.ethnicity));
    attendee.querySelector(".age").appendChild(document.createTextNode(user.age));
    attendee.querySelector(".school").appendChild(document.createTextNode(user.school));
    attendee.querySelector(".grade").appendChild(document.createTextNode(user.grade));
    attendee.querySelector(".tel").appendChild(document.createTextNode(user.student_phone_number));
    attendee.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    attendee.querySelector(".prev-hack").appendChild(document.createTextNode(user.previous_hackathons));
    attendee.querySelector(".g-name").appendChild(document.createTextNode(user.guardian_name ? user.guardian_name : ""));
    attendee.querySelector(".g-email").appendChild(document.createTextNode(user.guardian_email ? user.guardian_email : ""));
    attendee.querySelector(".g-tel").appendChild(document.createTextNode(user.guardian_phone_number ? user.guardian_phone_number : ""));

    if (user.github_username) {
      var github_link = document.createElement("a");
      github_link.href = !user.github_username.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.github_username : user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = !user.linkedin_profile.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.linkedin_profile : user.linkedin_profile;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    attendee.querySelector(".attendees-details").insertAdjacentHTML('beforeend',
      "<span class='edit-icon'><span title='Edit Attendee Data'><img src='/assets/icons/user-edit.svg'></span></span>"
    )

    attendee.querySelector(".attendees-details").insertAdjacentHTML('beforeend',
      "<span class='history-icon'><span title='View Edit History'><img src='/assets/icons/history.svg'></span></span>"
    )

    document.getElementById("attendees-list").insertBefore(attendee, document.getElementById("attendees-list").children[1]);
  })
}

async function getVIP() {
  let response = await listVIP();
  $('.guest-row, #vip > p').remove();
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#vip');
  response.forEach(function(guest) {
    $("<li data-id='" + guest.guest_id + "' class='guest-row " + guest.kind + "'><span class='edit-guest'><img src='/assets/icons/user-edit.svg'></span><ul><li>" + guest.kind.slice(0, 1).toUpperCase() + guest.kind.slice(1) + "</li><li>" + guest.name + "</li><li>" + guest.phone + "</li><li>" + guest.email + "</li><li>" + (guest.signed_waiver ? "Yes" : "No") + "</li></ul></li>").appendTo('#vip-list > ul');
  })
}

async function getAcceptedList() {
  let response = await getUser({acceptance_status: "accepted"});
  $('#acceptance-queue .attendees-row, #acceptance-queue > p').remove();
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#acceptance-queue')
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.acceptance_status.charAt(0).toUpperCase() + user.acceptance_status.slice(1), user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      attendee.querySelector("summary ul").appendChild(element)
    })

    attendee.querySelector("summary").insertAdjacentHTML('afterbegin',
      "<span class='unaccept-icon'><span title='Remove Attendee From Queue'><img src='/assets/icons/user-unaccept.svg'></span></span>"
    );

    attendee.querySelector(".attendees-row").setAttribute("data-id", user.user_id);
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender === "" ? "Decline to State" : user.gender));
    attendee.querySelector(".race").appendChild(document.createTextNode(!user.ethnicity || user.ethnicity === "" ? "Decline to State" : user.ethnicity));
    attendee.querySelector(".age").appendChild(document.createTextNode(user.age));
    attendee.querySelector(".school").appendChild(document.createTextNode(user.school));
    attendee.querySelector(".grade").appendChild(document.createTextNode(user.grade));
    attendee.querySelector(".tel").appendChild(document.createTextNode(user.student_phone_number));
    attendee.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    attendee.querySelector(".prev-hack").appendChild(document.createTextNode(user.previous_hackathons));
    attendee.querySelector(".g-name").appendChild(document.createTextNode(user.guardian_name ? user.guardian_name : ""));
    attendee.querySelector(".g-email").appendChild(document.createTextNode(user.guardian_email ? user.guardian_email : ""));
    attendee.querySelector(".g-tel").appendChild(document.createTextNode(user.guardian_phone_number ? user.guardian_phone_number : ""));

    if (user.github_username) {
      var github_link = document.createElement("a");
      github_link.href = !user.github_username.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.github_username : user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = !user.linkedin_profile.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.linkedin_profile : user.linkedin_profile;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("accepted-list").insertBefore(attendee, document.getElementById("accepted-list").children[1]);
  })
}

async function getUnacceptedList() {
  let response = await getUser({acceptance_status: "none"});
  $('#bulk-acceptance .attendees-row, #bulk-acceptance > p').remove();
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#bulk-acceptance');
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    var wrapper = document.createElement("li");
    wrapper.classList.add("acceptance-checkbox");
    var checkbox = document.createElement("input");
    checkbox.classList.add("accept");
    var type = document.createAttribute("type");
    type.value = "checkbox";
    checkbox.setAttributeNode(type);
    wrapper.appendChild(checkbox);
    attendee.querySelector("summary ul").appendChild(wrapper);

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      attendee.querySelector("summary ul").appendChild(element);
    })

    attendee.querySelector(".attendees-row").setAttribute("data-id", user.user_id);
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender === "" ? "Decline to State" : user.gender));
    attendee.querySelector(".race").appendChild(document.createTextNode(!user.ethnicity || user.ethnicity === "" ? "Decline to State" : user.ethnicity));
    attendee.querySelector(".age").appendChild(document.createTextNode(user.age));
    attendee.querySelector(".school").appendChild(document.createTextNode(user.school));
    attendee.querySelector(".grade").appendChild(document.createTextNode(user.grade));
    attendee.querySelector(".tel").appendChild(document.createTextNode(user.student_phone_number));
    attendee.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    attendee.querySelector(".prev-hack").appendChild(document.createTextNode(user.previous_hackathons));
    attendee.querySelector(".g-name").appendChild(document.createTextNode(user.guardian_name ? user.guardian_name : ""));
    attendee.querySelector(".g-email").appendChild(document.createTextNode(user.guardian_email ? user.guardian_email : ""));
    attendee.querySelector(".g-tel").appendChild(document.createTextNode(user.guardian_phone_number ? user.guardian_phone_number : ""));

    if (user.github_username) {
      var github_link = document.createElement("a");
      github_link.href = !user.github_username.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.github_username : user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = !user.linkedin_profile.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.linkedin_profile : user.linkedin_profile;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("unaccepted-list").insertBefore(attendee, document.getElementById("unaccepted-list").children[1]);
  })
}

async function getWaitlist() {
  let response = await getUser({acceptance_status: "waitlisted"});
  $('#waitlist .attendees-row, #waitlist > p').remove();
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#waitlist');
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    var wrapper = document.createElement("li");
    wrapper.classList.add("waitlist-checkbox");
    var checkbox = document.createElement("input");
    var type = document.createAttribute("type");
    type.value = "checkbox";
    checkbox.setAttributeNode(type);
    checkbox.classList.add("accept");
    wrapper.appendChild(checkbox);
    attendee.querySelector("summary ul").appendChild(wrapper);

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      attendee.querySelector("summary ul").appendChild(element);
    })

    attendee.querySelector(".attendees-row").setAttribute("data-id", user.user_id);
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender === "" ? "Decline to State" : user.gender));
    attendee.querySelector(".race").appendChild(document.createTextNode(!user.ethnicity || user.ethnicity === "" ? "Decline to State" : user.ethnicity));
    attendee.querySelector(".age").appendChild(document.createTextNode(user.age));
    attendee.querySelector(".school").appendChild(document.createTextNode(user.school));
    attendee.querySelector(".grade").appendChild(document.createTextNode(user.grade));
    attendee.querySelector(".tel").appendChild(document.createTextNode(user.student_phone_number));
    attendee.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    attendee.querySelector(".prev-hack").appendChild(document.createTextNode(user.previous_hackathons));
    attendee.querySelector(".g-name").appendChild(document.createTextNode(user.guardian_name ? user.guardian_name : ""));
    attendee.querySelector(".g-email").appendChild(document.createTextNode(user.guardian_email ? user.guardian_email : ""));
    attendee.querySelector(".g-tel").appendChild(document.createTextNode(user.guardian_phone_number ? user.guardian_phone_number : ""));

    if (user.github_username) {
      var github_link = document.createElement("a");
      github_link.href = !user.github_username.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.github_username : user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = !user.linkedin_profile.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.linkedin_profile : user.linkedin_profile;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("waitlist-list").insertBefore(attendee, document.getElementById("waitlist-list").children[1]);
  })
}

async function getRejectedList() {
  let response = await getUser({acceptance_status: "rejected"});
  $('#rejection-queue .attendees-row, #rejection-queue > p').remove();
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#rejection-queue');
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    var wrapper = document.createElement("li");
    wrapper.classList.add("rejected-checkbox");
    var checkbox = document.createElement("input");
    var type = document.createAttribute("type");
    type.value = "checkbox";
    checkbox.setAttributeNode(type);
    checkbox.classList.add("checkbox");
    wrapper.appendChild(checkbox);
    attendee.querySelector("summary ul").appendChild(wrapper);

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      attendee.querySelector("summary ul").appendChild(element);
    })

    attendee.querySelector(".attendees-row").setAttribute("data-id", user.user_id);
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender === "" ? "Decline to State" : user.gender));
    attendee.querySelector(".race").appendChild(document.createTextNode(!user.ethnicity || user.ethnicity === "" ? "Decline to State" : user.ethnicity));
    attendee.querySelector(".age").appendChild(document.createTextNode(user.age));
    attendee.querySelector(".school").appendChild(document.createTextNode(user.school));
    attendee.querySelector(".grade").appendChild(document.createTextNode(user.grade));
    attendee.querySelector(".tel").appendChild(document.createTextNode(user.student_phone_number));
    attendee.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    attendee.querySelector(".prev-hack").appendChild(document.createTextNode(user.previous_hackathons));
    attendee.querySelector(".g-name").appendChild(document.createTextNode(user.guardian_name ? user.guardian_name : ""));
    attendee.querySelector(".g-email").appendChild(document.createTextNode(user.guardian_email ? user.guardian_email : ""));
    attendee.querySelector(".g-tel").appendChild(document.createTextNode(user.guardian_phone_number ? user.guardian_phone_number : ""));

    if (user.github_username) {
      var github_link = document.createElement("a");
      github_link.href = !user.github_username.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.github_username : user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = !user.linkedin_profile.match(/^[a-zA-Z]+:\/\//) ? 'https://' + user.linkedin_profile : user.linkedin_profile;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("rejected-list").insertBefore(attendee, document.getElementById("waitlist-list").children[1]);
  })
}

async function getMentorList() {
  let response = await request("GET", "/mentor/v1/list");
  $('.mentor-row, #mentor-list > p').remove();
  document.getElementById("mentors-count").innerHTML = response.length;
  if (response.length == 0) $('<p style="text-align:center;color:rgba(0,0,0,0.5);margin-top:50px">There is nothing to show!</p>').appendTo('#mentor-list');
  response.forEach(function(user) {
    var template = document.getElementById("mentor-template");
    var mentor = template.content.cloneNode(true);
    var summary = [user.acceptance_status == "none" ? "No" : user.acceptance_status.charAt(0).toUpperCase() + user.acceptance_status.slice(1), user.name, user.phone, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    summary.forEach(function(data) {
      var element = document.createElement("li");
      element.textContent = data;
      mentor.querySelector("summary ul").appendChild(element)
    })

    mentor.querySelector("summary").setAttribute("title", user.name + " <" + user.mentor_id + ">");

    mentor.querySelector("summary").insertAdjacentHTML('afterbegin',
      "<span class='delete-icon'><span title='Delete Mentor'><img src='/assets/icons/close.svg'></span></span>"
    );

    mentor.querySelector(".mentor-row").setAttribute("data-id", user.mentor_id);
    mentor.querySelector(".over-18").appendChild(document.createTextNode(user.over_18 ? "Yes" : "No"));
    mentor.querySelector(".t-shirt").appendChild(document.createTextNode(user.tshirt_size));
    mentor.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : "Not Specified"));
    mentor.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    mentor.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));
    mentor.querySelector(".skillset").appendChild(document.createTextNode(user.skillset.split(',').join(', ')));

    mentor.querySelector(".mentor-details").insertAdjacentHTML('beforeend',
      "<span class='edit-icon'><span title='Edit Mentor Data'><img src='/assets/icons/user-edit.svg'></span></span>"
    )

    mentor.querySelector(".mentor-details").insertAdjacentHTML('beforeend',
      "<span class='history-icon'><span title='View Edit History'><img src='/assets/icons/history.svg'></span></span>"
    )

    document.getElementById("mentors-list").insertBefore(mentor, document.getElementById("mentors-list").children[1]);
  })
}

async function getCheckIn() {
  let attendees = await getUser({"acceptance_status": "accepted"});
  let waitlisted_attendees = await getUser({"acceptance_status": "waitlisted"})
  attendees = attendees.concat(waitlisted_attendees);
  $("#checkin-list figure").remove();
  attendees.forEach(function(user) {
    $figure = $('<figure><span class="checkin-accept-status" title="' + (user.acceptance_status === "accepted" ? "This attendee has been accepted." : "This attendee is in the waitlist") + '"><img src="/assets/icons/' + user.acceptance_status + '.svg"></span><img src="/assets/icons/attendee.svg"><figcaption><p><b>Name</b>: <span class="name"></span><p><b>Age</b>: <span class="age"></span></p><p><b>Waiver</b>: <span class="waiver"></span></p><div class="check-in">Check In</div></figcaption></figure>');
    $figure.addClass('attendee');
    $figure.attr('data-id', user.user_id);
    $figure.find('.name').text(user.first_name + " " + user.surname);
    $figure.find('.age').text(user.age);
    $figure.find('.waiver').text(user.signed_waiver ? "Signed" : "Not Signed");
    $figure.appendTo("#checkin-list");
  })
  let mentors = await getMentor({"acceptance_status": "accepted"});
  mentors.forEach(function(user) {
    $figure = $('<figure><img src="/assets/icons/mentor.svg"><figcaption><p><b>Name</b>: <span class="name"></span><p><b>Age</b>: <span class="age"></span></p><p><b>Waiver</b>: <span class="waiver"></span></p><div class="check-in">Check In</div></figcaption></figure>');
    $figure.addClass('mentor');
    $figure.attr('data-id', user.mentor_id);
    $figure.find('.name').text(user.name);
    $figure.find('.age').text(user.over_18 ? "Over 18" : "Under 18");
    $figure.find('.waiver').text(user.signed_waiver ? "Signed" : "Not Signed");
    $figure.appendTo("#checkin-list");
  })
  let guests = await request("GET", "/guest/v1/list");
  guests.forEach(function(user) {
    $figure = $('<figure><img src="/assets/icons/' + user.kind + '.svg"><figcaption><p><b>Name</b>: <span class="name"></span><p><b>Age</b>: <span class="guest-type"></span></p><p><b>Waiver</b>: <span class="waiver"></span></p><div class="check-in">Check In</div></figcaption></figure>');
    $figure.addClass(user.kind);
    $figure.attr('data-id', user.guest_id);
    $figure.find('.name').text(user.name);
    $figure.find('.guest-type').text(user.kind.slice(0, 1).toUpperCase() + user.kind.slice(1));
    $figure.find('.waiver').text(user.signed_waiver ? "Signed" : "Not Signed");
    $figure.appendTo("#checkin-list");
  })
}
