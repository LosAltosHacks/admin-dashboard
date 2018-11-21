document.addEventListener('copy', clipboard.hook);

async function exportEmails() {
  var copyText = "";

  let result = await request("GET", "/registration/v1/list");
  result.forEach(function(user) {
    copyText += user.email + "\n";
  })

  var copyField = document.createElement("input");
  copyField.setAttribute("type", "text");
  copyField.setAttribute("value", copyText);
  document.querySelector("body").appendChild(modal);
}
