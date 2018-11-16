function exportCSV() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // this.responseText
    }
  }

  xhttp.open("GET", "http://localhost:5000/registration/v1/list", true);
  xhttp.setRequestHeader("Authorization", "Bearer foobar");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}
