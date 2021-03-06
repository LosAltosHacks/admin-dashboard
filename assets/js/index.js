server = "https://api.losaltoshacks.com";

// Listeners for controls
let jwt_auth = localStorage.jwt_auth;
if (window.location.pathname !== "/login.html" && !localStorage.jwt_auth) {
  window.location.href = "/login.html";
}

let edited_fields = {};

$(document).ready(function() {
  if (localStorage.theme) changeTheme(localStorage.theme);
  if (localStorage.panel) getPanel(localStorage.panel);

  // Decorative Controls
  $("#profile > #profile-pic").css({'background-image': "url('" + localStorage.prof_image + "')"});
  $("#profile > span").not("#profile-pic").append("<h4>" + localStorage.name.split(' ')[0] + " " + localStorage.name.split(' ')[1].charAt(0) + ".</h4>");

  $("#profile > #profile-pic").hover(function() {
    $(this).css({'background-image': "url('/assets/icons/sign-out.svg')"});
    $(this).addClass('signout');
  }, function() {
    $(this).css({'background-image': "url('" + localStorage.prof_image + "')"});
    $(this).removeClass('signout');
  });

  $("#profile > #profile-pic").click(function() {
    logout();
  });

  $(document).scroll(function() {
    var height;
    $(".header").each(function() {
      if ($(this).height() > 0) {
        height = $(this).closest('.list').parent().find('h1').height() + 30 + parseFloat($(this).closest('.list').parent().find('h1').css('margin'))
      }
    })
    if ($(window).scrollTop() > height) $('.header').addClass('fix');
    if ($(window).scrollTop() < height) $('.header').removeClass('fix');
  })

  $("#menu-button").click(function() {
    $("#menu-panel").animate({"width": "toggle"});
  })

  $("#add-vip").click(function(e) {
    e.stopPropagation();
    $(".modal").remove();
    addVIPForm()
  });

  $(document).on("click", "#finish-add-vip", function() {
    var type = $(this).closest('.modal').find('select').val();
    var name = $(this).closest('.modal').find('input[name="name"]').val();
    var phone = $(this).closest('.modal').find('input[name="phone"]').val();
    var email = $(this).closest('.modal').find('input[name="email"]').val();
    if (name.trim().length == 0 || phone.trim().length == 0 || email.trim().length == 0) alert("Please complete all fields!")
    else {
      guestSignUp({kind: type, name: name, phone: phone, email: email}).then(function() {
        getVIP();
      });
      $(".modal").animate({"height": "toggle"}, function() {
        $(".modal").remove();
      })
    }
  })

  $("body > div").not("#menu").click(function() {
    if ($("#menu-panel").css("display") === "block" && $("#menu-panel").width() == $("#menu-panel").parent().width()) {
      $("#menu-panel").animate({"width": "toggle"});
    }
  })

  $("body > div").not(".modal").click(function() {
    $(".modal").animate({"height": "toggle"}, function() {
      $(".modal").remove();
    })
  })

  // Essential Controls
  $("#select-all").change(function() {
    if ($(this).is(':checked')) {
      $("#bulk-acceptance .accept").prop("checked", true);
    } else {
      $("#bulk-acceptance .accept").prop("checked", false);
    }
  })

  $("#waitlist-select-all").change(function() {
    if ($(this).is(':checked')) {
      $("#waitlist .accept").prop("checked", true);
    } else {
      $("#waitlist .accept").prop("checked", false);
    }
  })

  $("#mentor-select-all").change(function() {
    if ($(this).is(':checked')) {
      $("#mentor-bulk-acceptance .accept").prop("checked", true);
    } else {
      $("#mentor-bulk-acceptance .accept").prop("checked", false);
    }
  })

  $("#mentor-select-all").change(function() {
    if ($(this).is(':checked')) {
      $("#mentor .accept").prop("checked", true);
    } else {
      $("#mentor .accept").prop("checked", false);
    }
  })

  $("#search-button").click(function() {
    if ($("#search-bar > input").val().trim() === "") cancelSearch();
    searchUpdated($("#search-bar > input").val());
    $("#search-bar > input").select();
  })

  $("#search-bar > input").click(function() {
    $(this).select();
  })

  $("#copy-emails").click(function() {
    exportEmails();
  })

  $("#copy-waitlist-emails").click(function() {
    exportWaitlistEmails();
  })

  $("#mentor-copy-emails").click(function() {
    exportMentorEmails();
  })

  $("#checkin-search > input[type='text']").on("input change keyup", function() {
    let query = $(this).val().toLowerCase();
    if (query.trim().length == 0) {
      $('#checkin-list > figure').show()
      return;
    }
    $('#checkin-list > figure').hide()

    $("#checkin-list > figure .name").each(function(index, e) {
      if ($(e).text().toLowerCase().includes(query)) {
        $(e).closest("figure").show();
      }
    })
  })

  $(document).on('click', ".delete-icon > span", function(e) {
    e.preventDefault();
    if ($(e.target).closest('div')[0].className === "mentor-row") {
      if (confirm("Are you sure you want to delete user " + $(this).closest(".mentor-row").attr("data-id") + "?")) {
        deleteMentor($(this).closest(".mentor-row").attr("data-id"));
        let row = $(this).closest(".mentor-row");
        row.css({"background-color": "#e53935"});
        row.css({"color": "white"});
        row.slideUp(function() {
          row.remove();
        });
      }
    }
    else {
      if (confirm("Are you sure you want to delete user " + $(this).closest(".attendees-row").attr("data-id") + "?")) {
        deleteUser($(this).closest(".attendees-row").attr("data-id"));
        let row = $(this).closest(".attendees-row");
        row.css({"background-color": "#e53935"});
        row.css({"color": "white"});
        row.slideUp(function() {
          row.remove();
        });
      }
    }
  })

  $(document).on('click', ".unaccept-icon > span", function(e) {
    e.preventDefault();
    accept($(this).closest(".attendees-row").attr("data-id"), "none");
    let row = $(this).closest(".attendees-row");
    row.css({"background-color": "#e53935"});
    row.css({"color": "white"});
    row.slideUp(function() {
      row.remove();
    });
  })

  $(document).on('click', ".modal .close-icon", function() {
    $(".modal").animate({"height": "toggle"}, function() {
      $(".modal").remove();
    })
  })
  $(document).on('click', ".history-icon > span", function(e) {showHistory(e);});
  $(document).on('click', ".edit-icon > span", function(e) {showEditPanel(e);});
  $(document).on('click', 'figure > img', function(e) {checkInEdit(e);});

  $(document).on('change', '#attendee-checkin-modal li *, #mentor-checkin-modal li *', function() {
    var field_name = $(this).closest("li").text().split(":")[0];
    let field_val;
    if ($(this).attr('type') === "checkbox") field_val = $(this).is(":checked");
    else field_val = $(this).val();
    edited_fields[field_name] = field_val;
  })

  $(document).on('click', "#finish-checkin-edit", function() {
    // if ($(this).closest('.modal').id === "")
    if ($('#attendee-checkin-modal').length == 0) {
      modifyMentor($(this).closest("#mentor-checkin-modal").attr("data-id"), edited_fields).then(function(result) {
        edited_fields = {};
        $(".modal").animate({"height": "toggle"}, function() {
          $(".modal").remove();
        })
      })
    }
    else {
      modify($(this).closest("#attendee-checkin-modal").attr("data-id"), edited_fields).then(function(result) {
        edited_fields = {};
        $(".modal").animate({"height": "toggle"}, function() {
          $(".modal").remove();
        })
      })
    }
  })

  $(document).on('input change', "#edit-modal li *, #mentor-edit-modal li *", function() {
    var field_name = $(this).closest("li").text().split(":")[0];
    let field_val;
    if ($(this).attr('type') === "checkbox") field_val = $(this).is(":checked");
    else field_val = $(this).val();
    edited_fields[field_name] = field_val;
  })

  $(document).on('input change', "#edit-vip-form li *", function() {
    var field_name = $(this).attr('name');
    var field_val = $(this).attr('type') === "checkbox" ? $(this).is(":checked") : $(this).val();
    edited_fields[field_name] = field_val;
  })

  $(document).on('click', "#finish-edit-icon", function() {
    // if ($(this).closest('.modal').id === "")
    if ($('#edit-modal').length == 0) {
      modifyMentor($(this).closest("#mentor-edit-modal").attr("data-id"), edited_fields).then(function(result) {
        edited_fields = {};
        $(".modal").animate({"height": "toggle"}, function() {
          $(".modal").remove();
          getMentorList();
        })
      })
    }
    else {
      modify($(this).closest("#edit-modal").attr("data-id"), edited_fields).then(function(result) {
        edited_fields = {};
        $(".modal").animate({"height": "toggle"}, function() {
          $(".modal").remove();
        })
      })
    }
  })

  $(document).on('click', "#finish-edit-vip", function() {
    modifyGuest($(this).closest(".modal").attr("data-id"), edited_fields).then(function(result) {
      edited_fields = {};
      $(".modal").animate({"height": "toggle"}, function() {
        $(".modal").remove();
        getVIP();
      })
    })
  })

  $(document).on('click', '.announcement:not(".editing") .edit-announcement', function() {
    if ($('.announcement.edit').length > 0) return;
    $(this).closest(".announcement").addClass("editing");
    var subject = $(this).closest("ul").find(".subject").text();
    var content = $(this).closest("ul").find(".content").text();
    $(this).closest("ul").find(".subject").empty();
    $(`<textarea>${subject}</textarea>`).appendTo($(this).closest("ul").find(".subject"));
    $(this).closest("ul").find(".content").empty();
    $(`<textarea>${content}</textarea>`).appendTo($(this).closest("ul").find(".content"));
  })

  $(document).on('click', '.announcement.editing .edit-announcement', function() {
    if (confirm("Do you wish to publish this announcement?")) {
      var pin = confirm("Pin this message?")
      var id = $(this).closest(".announcement").attr("data-id");
      var subject = $(this).closest("ul").find(".subject > textarea").val();
      var content = $(this).closest("ul").find(".content > textarea").val();
      modifyAnnouncement(id, subject, content, pin);
      getAnnouncementsList();
    }
  })

  $("#announcement-submit").click(function() {
    if ($("#announcement-title").val().trim().length > 0 && $("#announcement-content").val().trim().length > 0 && confirm("Do you wish to send this announcement?")) {
      writeNewPost($("#announcement-title").val(), $("#announcement-content").val(), $("#announcement-pin:checked").length == 1).then(function() {
        alert("Your message has been successfully announced!");
        $("#announcement-title, #announcement-content").val("");
        $("#announcement-pin").prop("checked", false);
        getPanel("edit-announcements");
      });
    }
  })

  $("#acceptance-sort").change(function() {
    if ($("#acceptance-sort").val() === "") {
      getUnacceptedList();
      return;
    }
    bulkAcceptSort($("#acceptance-sort").val());
  })

  $("#themes .slider").click(function() {
    $("body").toggleClass("dark").toggleClass("");
    if ($("body").hasClass("dark")) localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'light');
  });

  var lastChecked = null;

  $(document).on('click', '.accept', function(e) {
    if(!lastChecked) {
          lastChecked = this;
          return;
      }

      if(e.shiftKey) {
        var start = $('.accept').index(this);
        var end = $('.accept').index(lastChecked);

        $('.accept').slice(Math.min(start,end), Math.max(start,end)+ 1).prop('checked', lastChecked.checked);
      }

      lastChecked = this;
    });

  $(document).on('click', 'figure:not(".checked-in") .check-in', function(e) {
    var id = $(this).closest('figure').attr('data-id');
    var name = $(this).closest('figcaption').find('.name').text();
    var first_name = name.split(" ")[0];
    var last_name = name.split(" ")[1];
    var $this = $(this);
    if ($this.closest("figure").find(".waiver").text().trim().length != 0) {
      if (confirm("This person did not sign the waiver yet. Do you still wish to check the person in?")) print(id, first_name, last_name).then(function(result) {
        if (result === "success") {
          if ($this.closest("figure").hasClass("attendee")) modify(id, {signed_waiver: true});
          else if ($this.closest("figure").hasClass("mentor")) modifyMentor(id, {signed_waiver: true});
          else modifyGuest(id, {signed_waiver: true});
          checkin(id).then(function() {
            alert(`${name} has been checked in! The badge should finish printing shortly...`);
            getCheckIn();
          })
        }
      })
    } else {
      print(id, first_name, last_name).then(function(result) {
        if (result === "success") {
          checkin(id).then(function() {
            alert(`${name} has been checked in! The badge should finish printing shortly...`);
            getCheckIn();
          })
        }
      })
    }
  })

  $(document).on('click', '.check-out', function(e) {
    var id = $(this).closest('figure').attr('data-id');
    checkout(id).then(function() {
      $(this).removeClass('check-out');
      $(this).closest('figure').find('img').css("animation", "checkout .8s alternate-reverse");
      $(this).addClass('check-in');
      $(this).text('Check In');
    })
  })

  $(document).on('click', '.edit-guest', function(e) {
    var id = $(this).closest('.guest-row').attr('data-id');
    editVIP(id);
  })

  $(document).on('click', '#delete-guest', function(e) {
    let id = $(this).closest('.modal').attr('data-id');
    if (confirm("Are you sure you want to delete guest <" + id + ">?")) {
      removeGuest(id).then(function() {
        $('.modal').animate({"height": "toggle"}, function() {
          $('.modal').remove();
        })
        $('.guest-row[data-id="' + id + '"]').css({"background-color": "#e53935"});
        $('.guest-row[data-id="' + id + '"]').animate({"height": "toggle"}, function() {
          $('.guest-row[data-id="' + id + '"]').remove();
        })
      })
    }
  })

  $(document).on('click', '.delete-announcement', function(e) {
    let id = $(this).closest('.announcement').attr('data-id');
    if (confirm("Are you sure you want to delete announcement \"" + $(this).closest('.announcement').find('.subject').text() + "\"?")) {
      deleteAnnouncement(id).then(function() {
        getAnnouncementsList();
      });
    }
  })

  $(document).on('click', '.edit-announcement', function(e) {
    let id = $(this).closest('.announcement').attr('data-id');
    console.log(id);
  })
})

function getPanel(panel) {
  if (panel === "attendee-list") $("#search-bar").show();
  else $("#search-bar").hide();
  if (panel === "email-list") $("export-sub-emails").show();
  else $("#export-sub-emails").hide();
  $('.panel').hide();
  $('#' + panel).show();
  localStorage.setItem("panel", panel);

  switch(panel) {
    case "vip":
      getVIP();
      break;
    case "email-list":
      getSubscribedList();
      break;
    case "attendee-list":
      getList();
      break;
    case "acceptance-queue":
      getAcceptedList();
      break;
    case "bulk-acceptance":
      getUnacceptedList();
      break;
    case "dayof":
      getCheckIn();
      break;
    case "mentor-list":
      getMentorList();
      break;
    case "rejection-queue":
      getRejectedList();
      break;
    case "waitlist":
      getWaitlist();
      break;
    case "waitlist-queue":
      getWaitlistQueue();
      break;
    case "mentor-bulk-acceptance":
      getMentorBulkAccept();
      break;
    case "mentor-acceptance-queue":
      getMentorAccept();
      break;
    case "edit-announcements":
      getAnnouncementsList();
      break;
    default: break;
  }
}

function expandAll() {
  $("details").attr('open', '');
}

function hideAll() {
  $("details").removeAttr('open');
}

function confirmAccept() {
  let user_ids = [];
  let names = [];
  let select_status = $("#select-status").val();
  $("#unaccepted-list .accept").each(function(index, element) {
    if ($(element).is(":checked")) {
      let row = $(element).closest(".attendees-row");
      row.css({"background-color": "#66bb6a"});
      row.css({"color": "white"});
      row.slideUp(function() {
        row.remove();
      });
      let id = row.attr("data-id");
      user_ids.push(id);
      names.push($(element).closest("ul").find("li:nth-child(2)").text() + " " + $(element).closest("ul").find("li:nth-child(3)").text())
    }
  })
  if (user_ids.length !== 0) if (confirm("Do you want to change the status of " + names.join(", ") + " to " + select_status + "?")) {
    user_ids.forEach(function(id) {
      console.log(id);
      accept(id, select_status);
    });
  }
}

function confirmMentorAccept() {
  let user_ids = [];
  let names = [];
  let select_status = $("#select-status").val();
  $("#mentor-bulk-list .accept").each(function(index, element) {
    if ($(element).is(":checked")) {
      let row = $(element).closest(".mentor-row");
      row.css({"background-color": "#66bb6a"});
      row.css({"color": "white"});
      row.slideUp(function() {
        row.remove();
      });
      let id = row.attr("data-id");
      user_ids.push(id);
      names.push($(element).closest("ul").find("li:nth-child(2)").text())
    }
  })
  if (user_ids.length !== 0) if (confirm("Do you want to change the status of " + names.join(", ") + " to queue?")) {
    user_ids.forEach(function(id) {
      console.log(id);
      acceptMentor(id, "queue").then(result => console.log(result));
    });
  }
}

function acceptWaitlist() {
  $("#waitlist-list .accept").each(function(index, element) {
    if ($(element).is(":checked")) {
      let row = $(element).closest(".attendees-row");
      row.css({"background-color": "#66bb6a"});
      row.css({"color": "white"});
      row.slideUp(function() {
        row.remove();
      });
      let id = row.attr("data-id");
      accept(id, "queue");
    }
  })
}

function createModal() {
  var modal = document.createElement("div");
  modal.classList.add("modal");
  var content = document.createElement("div");
  content.classList.add("modal-content");
  modal.appendChild(content);
  var closeSpan = document.createElement("span");
  closeSpan.setAttribute("title", "Close Modal");
  closeSpan.classList.add("close-icon")
  var closeIcon = document.createElement("img");
  closeIcon.src = "/assets/icons/close.svg";
  closeSpan.appendChild(closeIcon);
  modal.appendChild(closeSpan);

  modal.style.display = "none";
  if ($('.modal').length) $('.modal').remove();
  return {container: modal, content: content};
}

function addVIPForm() {
  var $modal = $("<div class='modal' style='display:none'><div class='modal-content'><h2>Add Guest</h2><form id='add-vip-form'><ul><li>Type: <select id='guest-type'><option value='judge'>Judge</option><option value='chaperone'>Chaperone</option><option value='sponsor'>Sponsor</option></select></li><li>Name: <input type='text' name='name'></li><li>Phone: <input type='tel' name='phone'></li><li>Email: <input type='email' name='email'></li></ul></form></div><span class='close-icon' title='Close Modal'><img src='/assets/icons/close.svg'></span><span id='finish-add-vip' title='Complete Guest Signup'><img src='/assets/icons/check.svg'></span></div>")
  $modal.appendTo('body');
  $(".modal").animate({"height": "toggle"})
}

function editVIP(id) {
  var $modal = $("<div class='modal' style='display:none' data-id='" + id + "'><div class='modal-content'><h2>Modify Guest</h2><form id='edit-vip-form'><ul><li>Type: <select id='guest-type' name='kind'><option value='judge'>Judge</option><option value='chaperone'>Chaperone</option><option value='sponsor'>Sponsor</option></select></li><li>Name: <input type='text' name='name'></li><li>Phone: <input type='tel' name='phone'></li><li>Email: <input type='email' name='email'></li><li>Waiver Signed: <input type='checkbox' name='signed_waiver'></li></ul></form><span id='delete-guest'>Delete</span></div><span class='close-icon' title='Close Modal'><img src='/assets/icons/close.svg'></span><span id='finish-edit-vip' title='Finish Editing Guest Info'><img src='/assets/icons/check.svg'></span></div>")
  getGuest(id).then(function(guests) {
    guest = guests[0];
    $modal.find("select").val(guest.kind);
    $modal.find("input[name='name']").val(guest.name);
    $modal.find("input[name='email']").val(guest.email);
    $modal.find("input[name='phone']").val(guest.phone);
    // $modal.find("input[name='signed_waiver']")
    $modal.appendTo('body');
    $(".modal").animate({"height": "toggle"});
  });

}

function bulkAcceptSort(field) {
  var values = [];
  $("#unaccepted-list .attendees-row").each(function(index, e) {
    values.push([$(e).find('.' + field).text().replace(/^(.*?)\: /, ""), $(e).attr('data-id')]);
  })
  values.sort();
  var elems = [];
  values.forEach(function(value) {
    elems.push($("#unaccepted-list").find(".attendees-row[data-id='" + value[1] + "']"));
  })
  $("#unaccepted-list .attendees-row").remove();
  elems.forEach(function($elem) {
    $elem.appendTo("#unaccepted-list");
  })
}

function showHistory(e) {
  var modal = createModal();
  modal.container.id = "history-modal";

  if ($(e.target).closest('div')[0].className === "mentor-details") {
    var mentor_id = $(e.target).closest(".mentor-row").attr("data-id");
    getMentorHistory(mentor_id).then(function(result) {
      var header = document.createElement("h3");
      header.textContent = mentor_id;
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      result.forEach(function(entry) {
        var details = "";
        for (var i=0; i<Object.keys(entry).length; i++) {
          details += "<li><b>" + escapeHTML(String(Object.keys(entry)[i])) + ":</b> " + escapeHTML(String(Object.values(entry)[i])) + "</li>";
        }
        wrapper.insertAdjacentHTML('afterbegin',
          "<details><summary>" + (new Date(entry.timestamp.replace(" ", "T") + "Z")) + "</summary><div class='history-details'><ul>" + details + "</ul></div></details>"
        );
      })
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
  else {
    var user_id = $(e.target).closest(".attendees-row").attr("data-id");
    getHistory(user_id).then(function(result) {
      var header = document.createElement("h3");
      header.textContent = user_id;
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      result.forEach(function(entry) {
        var details = "";
        for (var i=0; i<Object.keys(entry).length; i++) {
          details += "<li><b>" + escapeHTML(String(Object.keys(entry)[i])) + ":</b> " + escapeHTML(String(Object.values(entry)[i])) + "</li>";
        }
        wrapper.insertAdjacentHTML('afterbegin',
          "<details><summary>" + (new Date(entry.timestamp.replace(" ", "T") + "Z")) + "</summary><div class='history-details'><ul>" + details + "</ul></div></details>"
        );
      })
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
}

function checkInEdit(e) {
  var modal = createModal();

  if ($(e.target).closest('figure')[0].className === "mentor") {
    modal.container.id = "mentor-checkin-modal";
    var mentor_id = $(e.target).closest('figure').attr('data-id');
    modal.container.setAttribute("data-id", mentor_id);

    getMentor(mentor_id).then(function(result) {
      var mentor = result[result.length-1];
      var header = document.createElement("h3");
      header.textContent = "Mentor <" + mentor_id + ">";
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      var list = document.createElement("ul");
      for (var i=0; i<Object.keys(mentor).length; i++) {
        var key = Object.keys(mentor)[i];
        var value = Object.values(mentor)[i];
        var option = document.createElement("li");
        option.appendChild(document.createTextNode(key + ": "))
        option.setAttribute("data-edit", key);
        var edit = document.createElement("input");

        if (key === "tshirt_size") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='S'>S</option><option value='M'>M</option><option value='L'>L</option><option value='XL'>XL</option>"
          )
          switch (value) {
            case "S":
              selection.options[0].selected = true;
              break;
            case "M":
              selection.options[1].selected = true;
              break;
            case "L":
              selection.options[2].selected = true;
              break;
            case "XL":
              selection.options[3].selected = true;
              break;
            default:
              selection.options[1].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "acceptance_status") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='none'>None</option><option value='waitlisted'>Waitlisted</option><option value='rejected'>Rejected</option><option value='queue'>Queue</option><option value='accepted'>Accepted</option>"
          )
          switch (value) {
            case "none":
              selection.options[0].selected = true;
              break;
            case "waitlisted":
              selection.options[1].selected = true;
              break;
            case "rejected":
              selection.options[2].selected = true;
              break;
            case "queue":
              selection.options[3].selected = true;
              break;
            case "accepted":
              selection.options[4].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        else if (key === "email") edit.type = "email";
        else if (key === "phone") edit.type = "tel";
        else if (key === "email_verified" || key === "signed_waiver") {
          edit.type = "checkbox";
          edit.checked = value;
        }
        else edit.type = "text";
        edit.value = value;
        option.appendChild(edit);
        list.appendChild(option);
      }

      modal.container.insertAdjacentHTML('afterbegin',
        "<span id='finish-checkin-edit' title='Finish Edits'><img src='/assets/icons/check.svg'></span>"
      );

      wrapper.appendChild(list);
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
  else {
    modal.container.id = "attendee-checkin-modal";
    var user_id = $(e.target).closest("figure").attr("data-id");
    modal.container.setAttribute("data-id", user_id);

    getUser(user_id).then(function(result) {
      var attendee = result[result.length-1];
      var header = document.createElement("h3");
      header.textContent = "User <" + user_id + ">";
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      var list = document.createElement("ul");
      for (var i=0; i<Object.keys(attendee).length; i++) {
        var key = Object.keys(attendee)[i];
        var value = Object.values(attendee)[i];
        var option = document.createElement("li");
        option.appendChild(document.createTextNode(key + ": "))
        option.setAttribute("data-edit", key);

        var edit = document.createElement("input");
        if (key === "user_id" || key === "timestamp") continue;
        if (key === "tshirt_size") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='S'>S</option><option value='M'>M</option><option value='L'>L</option><option value='XL'>XL</option>"
          )
          switch (value) {
            case "S":
              selection.options[0].selected = true;
              break;
            case "M":
              selection.options[1].selected = true;
              break;
            case "L":
              selection.options[2].selected = true;
              break;
            case "XL":
              selection.options[3].selected = true;
              break;
            default:
              selection.options[1].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "gender") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='Male'>Male</option><option value='Female'>Female</option>"
          )
          switch (value) {
            case "Male":
              selection.options[0].selected = true;
              break;
            case "Female":
              selection.options[1].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "acceptance_status") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='none'>None</option><option value='waitlisted'>Waitlisted</option><option value='rejected'>Rejected</option><option value='queue'>Queue</option><option value='accepted'>Accepted</option>"
          )
          switch (value) {
            case "none":
              selection.options[0].selected = true;
              break;
            case "waitlisted":
              selection.options[1].selected = true;
              break;
            case "rejected":
              selection.options[2].selected = true;
              break;
            case "queue":
              selection.options[3].selected = true;
              break;
            case "accepted":
              selection.options[4].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }

        else if (key === "age" || key === "grade" || key === "previous_hackathons") edit.type = "number";
        else if (key === "email" || key === "guardian_email") edit.type = "email";
        else if (key === "student_phone_number" || key === "guardian_phone_number") edit.type = "tel";
        else if (key === "email_verified" || key === "signed_waiver") {
          edit.type = "checkbox";
          edit.checked = value;
        }
        else edit.type = "text";
        edit.value = value;
        option.appendChild(edit);
        list.appendChild(option);
      }

      modal.container.insertAdjacentHTML('afterbegin',
        "<span id='finish-checkin-edit' title='Finish Edits'><img src='/assets/icons/check.svg'></span>"
      );

      wrapper.appendChild(list);
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
}

function showEditPanel(e) {
  var modal = createModal();

  if ($(e.target).closest('div')[0].className === "mentor-details") {
    modal.container.id = "mentor-edit-modal";
    var mentor_id = $(e.target).closest(".mentor-row").attr("data-id")
    modal.container.setAttribute("data-id", mentor_id);

    getMentor(mentor_id).then(function(result) {
      var mentor = result[result.length-1];
      var header = document.createElement("h3");
      header.textContent = "Mentor <" + mentor_id + ">";
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      var list = document.createElement("ul");
      for (var i=0; i<Object.keys(mentor).length; i++) {
        var key = Object.keys(mentor)[i];
        var value = Object.values(mentor)[i];
        var option = document.createElement("li");
        option.appendChild(document.createTextNode(key + ": "))
        option.setAttribute("data-edit", key);
        var edit = document.createElement("input");

        if (key === "tshirt_size") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='S'>S</option><option value='M'>M</option><option value='L'>L</option><option value='XL'>XL</option>"
          )
          switch (value) {
            case "S":
              selection.options[0].selected = true;
              break;
            case "M":
              selection.options[1].selected = true;
              break;
            case "L":
              selection.options[2].selected = true;
              break;
            case "XL":
              selection.options[3].selected = true;
              break;
            default:
              selection.options[1].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "acceptance_status") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='none'>None</option><option value='waitlisted'>Waitlisted</option><option value='rejected'>Rejected</option><option value='queue'>Queue</option><option value='accepted'>Accepted</option>"
          )
          switch (value) {
            case "none":
              selection.options[0].selected = true;
              break;
            case "waitlisted":
              selection.options[1].selected = true;
              break;
            case "rejected":
              selection.options[2].selected = true;
              break;
            case "queue":
              selection.options[3].selected = true;
              break;
            case "accepted":
              selection.options[4].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        else if (key === "email") edit.type = "email";
        else if (key === "phone") edit.type = "tel";
        else if (key === "email_verified" || key === "signed_waiver") {
          edit.type = "checkbox";
          edit.checked = value;
        }
        else edit.type = "text";
        edit.value = value;
        option.appendChild(edit);
        list.appendChild(option);
      }

      modal.container.insertAdjacentHTML('afterbegin',
        "<span id='finish-edit-icon' title='Finish Edits'><img src='/assets/icons/check.svg'></span>"
      );

      wrapper.appendChild(list);
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
  else {
    modal.container.id = "edit-modal";
    var user_id = $(e.target).closest(".attendees-row").attr("data-id");
    modal.container.setAttribute("data-id", user_id);

    getUser(user_id).then(function(result) {
      var attendee = result[result.length-1];
      var header = document.createElement("h3");
      header.textContent = "User <" + user_id + ">";
      modal.content.appendChild(header);
      var wrapper = document.createElement("div");
      var list = document.createElement("ul");
      for (var i=0; i<Object.keys(attendee).length; i++) {
        var key = Object.keys(attendee)[i];
        var value = Object.values(attendee)[i];
        var option = document.createElement("li");
        option.appendChild(document.createTextNode(key + ": "))
        option.setAttribute("data-edit", key);

        var edit = document.createElement("input");
        if (key === "user_id" || key === "timestamp") continue;
        if (key === "tshirt_size") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='S'>S</option><option value='M'>M</option><option value='L'>L</option><option value='XL'>XL</option>"
          )
          switch (value) {
            case "S":
              selection.options[0].selected = true;
              break;
            case "M":
              selection.options[1].selected = true;
              break;
            case "L":
              selection.options[2].selected = true;
              break;
            case "XL":
              selection.options[3].selected = true;
              break;
            default:
              selection.options[1].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "gender") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='Male'>Male</option><option value='Female'>Female</option>"
          )
          switch (value) {
            case "Male":
              selection.options[0].selected = true;
              break;
            case "Female":
              selection.options[1].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }
        if (key === "acceptance_status") {
          var selection = document.createElement("select");
          selection.insertAdjacentHTML('beforeend',
            "<option value='none'>None</option><option value='waitlisted'>Waitlisted</option><option value='rejected'>Rejected</option><option value='queue'>Queue</option><option value='accepted'>Accepted</option>"
          )
          switch (value) {
            case "none":
              selection.options[0].selected = true;
              break;
            case "waitlisted":
              selection.options[1].selected = true;
              break;
            case "rejected":
              selection.options[2].selected = true;
              break;
            case "queue":
              selection.options[3].selected = true;
              break;
            case "accepted":
              selection.options[4].selected = true;
              break;
            default:
              selection.options[0].selected = true;
              break;
          }
          option.appendChild(selection);
          list.appendChild(option);
          continue;
        }

        else if (key === "age" || key === "grade" || key === "previous_hackathons") edit.type = "number";
        else if (key === "email" || key === "guardian_email") edit.type = "email";
        else if (key === "student_phone_number" || key === "guardian_phone_number") edit.type = "tel";
        else if (key === "email_verified" || key === "signed_waiver") {
          edit.type = "checkbox";
          edit.checked = value;
        }
        else edit.type = "text";
        edit.value = value;
        option.appendChild(edit);
        list.appendChild(option);
      }

      modal.container.insertAdjacentHTML('afterbegin',
        "<span id='finish-edit-icon' title='Finish Edits'><img src='/assets/icons/check.svg'></span>"
      );

      wrapper.appendChild(list);
      modal.content.appendChild(wrapper);
      document.body.appendChild(modal.container);
      $(".modal").animate({"height": "toggle"})
    })
  }
}

function searchUpdated(query) {
  getUser(query).then(function(result) {
    var ids = result.map(function(item) { return item.user_id });
    $("#attendee-list .attendees-row").each(function() {
      if (ids.includes($(this).attr('data-id'))) {
        return;
      } else {
        $(this).css({"display": "none"});
      }
    });
  })
}

function cancelSearch() {
  $("#attendee-list .attendees-row").each(function() {
    $(this).css({"display": "block"});
  });
}

function changeTheme(theme) {
  if (theme === "dark") {
    $("#themes .switch > input").prop('checked', true);
    $('body').addClass('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    $("#themes .switch > input").prop('checked', false);
    $('body').removeClass('dark');
    localStorage.setItem('theme', 'light');
  }
}

$(window).resize(function() {
  drawChart();
})

google.charts.load('current', {'packages': ['bar', 'corechart', 'controls', 'charteditor'], 'callback': drawChart});

// Draw the chart and set the chart values
function drawChart() {
  getUser("").then(function(result) {
    var genders = {"Decline to State": 0};
    var races = {"Did Not State": 0};
    var ages = {"21+": 0};
    var dates = {};
    var grades = {};
    if (result.length == 0) return;

    result.forEach(function(user) {
      if (user.gender === "decline") genders["Decline to State"]++;
      else if (genders[user.gender]) genders[user.gender]++;
      else genders[user.gender] = 1;
      if (!user.ethnicity || user.ethnicity.trim().length == 0) races["Did Not State"]++;
      else if (races[user.ethnicity]) races[user.ethnicity]++;
      else races[user.ethnicity] = 1;
      if (user.age >= 21) ages["21+"]++;
      else if (ages[user.age]) ages[user.age]++;
      else ages[user.age] = 1;
      var date = (new Date(user.timestamp.replace(" ", "T") + "Z")).toDateString();
      if (dates[date]) dates[date]++;
      else dates[date] = 1;
      if (grades[user.grade]) grades[user.grade]++;
      else grades[user.grade] = 1;
    })

    var genderData = new google.visualization.DataTable();
    genderData.addColumn('string', 'Gender');
    genderData.addColumn('number', 'Count');

    for (var i=0; i<Object.keys(genders).length; i++) {
      genderData.addRow([Object.keys(genders)[i], Object.values(genders)[i]]);
    }

    var ethnicityData = new google.visualization.DataTable();
    ethnicityData.addColumn('string', 'Ethnicity');
    ethnicityData.addColumn('number', 'Count');

    for (var i=0; i<Object.keys(races).length; i++) {
      ethnicityData.addRow([Object.keys(races)[i], Object.values(races)[i]]);
    }

    var ageData = new google.visualization.DataTable();
    ageData.addColumn('string', 'Age');
    ageData.addColumn('number', 'Count');

    for (var i=0; i<Object.keys(ages).length; i++) {
      ageData.addRow([Object.keys(ages)[i].toString(), Object.values(ages)[i]]);
    }

    var gradeData = new google.visualization.DataTable();
    gradeData.addColumn('string', 'Grade');
    gradeData.addColumn('number', 'Count');

    for (var i=0; i<Object.keys(grades).length; i++) {
      gradeData.addRow([Object.keys(grades)[i].toString(), Object.values(grades)[i]]);
    }

    var applyData = new google.visualization.DataTable();
    applyData.addColumn('date', 'Date');
    applyData.addColumn('number', 'Number of Applications');

    for (var i=0; i<Object.keys(dates).length; i++) {
      applyData.addRow([new Date(Object.keys(dates)[i]), Object.values(dates)[i]]);
    }

    var genderColors = {
      'Male': '#90caf9',
      'Female': '#f48fb1',
      'Other': '#90a4ae'
    }

    var genderSlices = [];
    for (var i=0; i<genderData.getNumberOfRows(); i++) {
      if (genderColors[genderData.getValue(i, 0)]) genderSlices.push({
        color: genderColors[genderData.getValue(i, 0)]
      })
      else genderSlices.push({});
    }

    var genderOptions = {
      sliceVisibilityThreshold: .1,
      fontName: 'Poppins',
      slices: genderSlices
    };

    var ethnicityOptions = {
      sliceVisibilityThreshold: .05,
      fontName: 'Poppins'
    };
    var ageOptions = {
      legend: {
        position: 'none'
      },
      fontName: 'Poppins'
    };
    var gradeOptions = {
      legend: {
        position: 'none'
      },
      fontName: 'Poppins'
    };

    var genderChart = new google.visualization.PieChart(document.getElementById('gender-demo'));
    var ethnicityChart = new google.visualization.PieChart(document.getElementById('race-demo'));
    var ageChart = new google.charts.Bar(document.getElementById('age-demo'));
    var gradeChart = new google.charts.Bar(document.getElementById('grade-demo'));

    genderChart.draw(genderData, genderOptions);
    ethnicityChart.draw(ethnicityData, ethnicityOptions);
    ageChart.draw(ageData, google.charts.Bar.convertOptions(ageOptions));
    gradeChart.draw(gradeData, google.charts.Bar.convertOptions(gradeOptions));

    var dashboard = new google.visualization.Dashboard(document.getElementById('timeline'));
    var controls = new google.visualization.ControlWrapper({
      controlType: 'ChartRangeFilter',
      containerId: 'controls',
      options: {
        fontName: 'Poppins',
        filterColumnIndex: 0,
        ui: {
          chartOptions: {
            height: 50,
            width: 600,
            chartArea: {
              width: '80%'
            }
          }
        }
      }
    })
    var chart = new google.visualization.ChartWrapper({
        chartType: 'LineChart',
        containerId: 'chart',
        options: {
          fontName: 'Poppins',
          legend: 'none'
        }
    });

    function setOptions (wrapper) {

        wrapper.setOption('width', 620);
        wrapper.setOption('chartArea.width', '80%');

    }

    setOptions(chart);


    dashboard.bind([controls], [chart]);
    dashboard.draw(applyData);
  })
}
