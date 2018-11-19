var clipboard = {
  data: '',
  intercept: false,
  hook: function(e) {
    console.log('hooked');
    if (clipboard.intercept) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', clipboard.data);
      console.log('hi');
      clipboard.intercept = false;
      clipboard.data = '';
    }
  }
}

document.addEventListener('copy', clipboard.hook);

function exportEmails() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var copyText = "";
      var response = JSON.parse(this.responseText);
      response.forEach(function(user) {
        copyText += user.email + "\n";
      })

      clipboard.data = copyText;
      clipboard.intercept = true;

      console.log(clipboard.data);
      document.execCommand('copy');
      // this.responseText
    }
  }

  xhttp.open("GET", "http://localhost:5000/registration/v1/list", true);
  xhttp.setRequestHeader("Authorization", "Bearer foobar");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}
