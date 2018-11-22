async function exportEmails() {
  var copyText = "";

  let result = await request("GET", "/registration/v1/list");
  result.forEach(function(user) {
    copyText += user.email + "\n";
  })

  var modal = createModal();

  var copyField = document.createElement("textarea");
  copyField.id = "copy-field";
  copyField.value = copyText;
  var copyIcon = document.createElement("img");
  copyIcon.src = "/assets/icons/copy.svg";
  var copyIconWrapper = document.createElement("span");
  copyIconWrapper.id = "copy-icon";
  copyIconWrapper.appendChild(copyIcon);

  modal.content.appendChild(copyField);
  modal.content.appendChild(copyIconWrapper);
  document.body.appendChild(modal.container);
  $(".modal").animate({"height": "toggle"})
}
