async function exportEmails() {
  var copyText = "";

  let result = await getUser({acceptance_status: "queue"});
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
  var confirmIcon = document.createElement("img");
  confirmIcon.src = "/assets/icons/check.svg";
  var confirmIconWrapper = document.createElement("span");
  confirmIconWrapper.id = "confirm-accept-icon";
  confirmIconWrapper.appendChild(confirmIcon);

  modal.content.appendChild(copyField);
  modal.content.appendChild(copyIconWrapper);
  modal.content.appendChild(confirmIconWrapper);
  document.body.appendChild(modal.container);
  $(".modal").animate({"height": "toggle"})
}

async function exportSubEmails() {
  var copyText = "";

  let result = await request("get", "/email_list/v1/subscriptions");
  result.forEach(function(user) {
    copyText += user + "\n";
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
  modal.content.appendChild(confirmIconWrapper);
  document.body.appendChild(modal.container);
  $(".modal").animate({"height": "toggle"})
}
