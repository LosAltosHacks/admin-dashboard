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
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender));
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
      github_link.href = user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = user.github_username;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));
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

async function getAcceptedList() {
  let response = await getUser({acceptance_status: "queue"});
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
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender));
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
      github_link.href = user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = user.github_username;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("accepted-list").insertBefore(attendee, document.getElementById("accepted-list").children[1]);
  })
}

async function getUnacceptedList() {
  let response = await getUser({acceptance_status: "none"});
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
    attendee.querySelector(".gender").appendChild(document.createTextNode(user.gender));
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
      github_link.href = user.github_username;
      github_link.appendChild(document.createTextNode(user.github_username.substring(user.github_username.indexOf('.com/')+5).replace(/[/]/g, "")));
      attendee.querySelector(".github-user").appendChild(github_link);
    }
    else attendee.querySelector(".github-user").appendChild(document.createTextNode("Not Given"));

    if (user.linkedin_profile) {
      var linkedin_link = document.createElement("a");
      linkedin_link.href = user.github_username;
      linkedin_link.appendChild(document.createTextNode(user.linkedin_profile.substring(user.linkedin_profile.indexOf('/in/')+4).replace(/[/]/g, "")));
      attendee.querySelector(".linkedin-prof").appendChild(linkedin_link);
    }
    else attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode("Not Given"));

    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));
    attendee.querySelector(".email-verified").appendChild(document.createTextNode(user.email_verified ? "Verified" : "Not Verified"));
    attendee.querySelector(".signed-waiver").appendChild(document.createTextNode(user.signed_waiver ? "Signed" : "Not Signed"));

    document.getElementById("unaccepted-list").insertBefore(attendee, document.getElementById("unaccepted-list").children[1]);
  })
}

getSubscribedList();
getList();
getAcceptedList();
getUnacceptedList();
