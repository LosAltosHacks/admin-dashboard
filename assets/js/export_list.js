async function exportEmails() {
  var copyText = "";
  var users = [];
  $("#accepted-list .attendees-row summary li:nth-child(4)").each(function(i, e) {
    copyText += $(e).text() + "\n";
  })
  $("#accepted-list .attendees-row").each(function(i, e) {
    users.push($(e).attr('data-id'));
  })
  $("<textarea id='copy-text' type='text' style='position:absolute;top:1px;left:1px'></textarea>").appendTo('body');
  $('#copy-text').val(copyText);
  $('#copy-text').select();
  document.execCommand('copy');
  $('#copy-text').remove();
  if (confirm('Emails added to clipboard! Here are the emails you have copied:\n' + copyText + "\nDo you want to remove them from queue?")) {
    users.forEach(function(user) {
      accept(user, "accepted");
    });
  }
}

async function exportWaitlistEmails() {
  var copyText = "";
  var users = [];
  $("#waitlist-queue-list .attendees-row summary li:nth-child(4)").each(function(i, e) {
    copyText += $(e).text() + "\n";
  })
  $("#waitlist-queue-list .attendees-row").each(function(i, e) {
    users.push($(e).attr('data-id'));
  })
  $("<textarea id='copy-text' type='text' style='position:absolute;top:1px;left:1px'></textarea>").appendTo('body');
  $('#copy-text').val(copyText);
  $('#copy-text').select();
  document.execCommand('copy');
  $('#copy-text').remove();
  if (confirm('Emails added to clipboard! Here are the emails you have copied:\n' + copyText + "\nDo you want to remove them from queue?")) {
    users.forEach(function(user) {
      accept(user, "waitlisted");
    });
  }
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
  copyIconWrapper.id = "";
  copyIconWrapper.appendChild(copyIcon);

  modal.content.appendChild(copyField);
  modal.content.appendChild(copyIconWrapper);
  document.body.appendChild(modal.container);
  $(".modal").animate({"height": "toggle"})
}
