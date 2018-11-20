var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var template = document.getElementById("attendee-template");
    var response = JSON.parse(this.responseText);
    response.forEach(function(user) {
      var attendee = template.content.cloneNode(true);
      var summary = [user.acceptance_status == "none" ? "No" : "Yes", user.first_name, user.surname, user.email, user.timestamp];

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

      document.getElementById("attendees-list").appendChild(attendee);
    })
  }
}

xhttp.open("GET", "http://localhost:5000/registration/v1/list", true);
xhttp.setRequestHeader("Authorization", "Bearer foobar");
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send();
