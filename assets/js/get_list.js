async function getList() {
  let response = await request("GET", "/registration/v1/list");
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    var summary = [user.acceptance_status == "none" ? "No" : user.acceptance_status.charAt(0).toUpperCase() + user.acceptance_status.slice(1), user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    summary.forEach(function(data) {
      var element = document.createElement("li");
      var node = document.createTextNode(data);
      element.append(node);
      attendee.querySelector("summary ul").appendChild(element)
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
    attendee.querySelector(".github-user").appendChild(document.createTextNode(user.github_username ? user.github_username : ""));
    attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode(user.linkedin_profile ? user.linkedin_profile : ""));
    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));

    document.getElementById("attendees-list").insertBefore(attendee, document.getElementById("attendees-list").children[1]);
  })
}

async function getAcceptedList() {
  let response = await request("GET", "/registration/v1/list");
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    if (user.acceptance_status === "none") return;
    var summary = [user.acceptance_status.charAt(0).toUpperCase() + user.acceptance_status.slice(1), user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    summary.forEach(function(data) {
      var element = document.createElement("li");
      var node = document.createTextNode(data);
      element.append(node);
      attendee.querySelector("summary ul").appendChild(element)
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
    attendee.querySelector(".github-user").appendChild(document.createTextNode(user.github_username ? user.github_username : ""));
    attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode(user.linkedin_profile ? user.linkedin_profile : ""));
    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));

    document.getElementById("accepted-list").insertBefore(attendee, document.getElementById("accepted-list").children[1]);
  })
}

async function getUnacceptedList() {
  let response = await request("GET", "/registration/v1/list");
  response.forEach(function(user) {
    var template = document.getElementById("attendee-template");
    var attendee = template.content.cloneNode(true);
    if (user.acceptance_status !== "none") return;
    var summary = [user.first_name, user.surname, user.email, (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString()];

    var checkbox = document.createElement("input");
    checkbox.classList.add("accept");
    var type = document.createAttribute("type");
    type.value = "checkbox";
    checkbox.setAttributeNode(type);
    attendee.querySelector("summary ul").appendChild(checkbox);

    summary.forEach(function(data) {
      var element = document.createElement("li");
      var node = document.createTextNode(data);
      element.append(node);
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
    attendee.querySelector(".github-user").appendChild(document.createTextNode(user.github_username ? user.github_username : ""));
    attendee.querySelector(".linkedin-prof").appendChild(document.createTextNode(user.linkedin_profile ? user.linkedin_profile : ""));
    attendee.querySelector(".diet-restrict").appendChild(document.createTextNode(user.dietary_restrictions ? user.dietary_restrictions : ""));

    document.getElementById("unaccepted-list").insertBefore(attendee, document.getElementById("unaccepted-list").children[1]);
  })
}

getList();
getAcceptedList();
getUnacceptedList();
