function signup(user) {
  if (!user.first_name || !user.surname || !user.email || !user.age || !user.school || !user.grade || !user.student_phone_number || !user.gender || !user.tshirt_size || !user.previous_hackathons) return false;
  else if (user.age < 18 && (!user.guardian_name || !user.guardian_email || !user.guardian_phone_number)) return false;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    return JSON.parse(this.responseText);
  }

  xhttp.open("POST", server + "/registration/v1/signup", true);
  xhttp.setRequestHeader("Authorization", "Bearer foobar");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(user));
}

function modify(user_id, params) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    return JSON.parse(this.responseText);
  }

  xhttp.open("POST", server + "/registration/v1/signup/" + user_id, true);
  xhttp.setRequestHeader("Authorization", "Bearer foobar");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(params));
}

function accept(user_id, status) {
  if (status != "none" && status != "waitlisted" && status != "rejected" && status != "queue" && status != "accepted") return false;
  modify(user_id, {acceptance_status: status});
}

function verify(user_id) {
  if (status != "none" && status != "waitlisted" && status != "rejected" && status != "queue" && status != "accepted") return false;
  modify(user_id, {email_verified: true});
}

function getUser(user_id) {

}
