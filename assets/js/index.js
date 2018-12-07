server = "https://www.losaltoshacks.com/registration";

// Listeners for controls
let jwt_auth = localStorage.jwt_auth;
// jwt_auth = "foobar";
if (window.location.pathname !== "/login.html" && !localStorage.jwt_auth) {
  window.location.href = "/login.html";
}

let edited_fields = {};

$(document).ready(function() {
  // Decorative Controls
  $("#profile > #profile-pic").css({'background-image': "url('" + localStorage.prof_image + "')"});
  $("#profile > span").not("#profile-pic").append("<h4>" + localStorage.name + "</h4>");
  $("#profile > span").not("#profile-pic").append("<p>" + localStorage.email + "</p>");

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

  let origin = $('.header').offset().top;
  $(document).scroll(function() {
    if ($(window).scrollTop() > origin) $('.header').addClass('fix');
    if ($(window).scrollTop() < origin) $('.header').removeClass('fix');
  })

  $("#menu-button").click(function() {
    $("#menu-panel").animate({"width": "toggle"});
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
      $(".accept").prop("checked", true);
    } else {
      $(".accept").prop("checked", false);
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

  $(document).on('click', ".delete-icon > span", function(e) {
    e.preventDefault();
    deleteUser($(this).closest(".attendees-row").attr("data-id"));
    let row = $(this).closest(".attendees-row");
    row.css({"background-color": "#e53935"});
    row.css({"color": "white"});
    row.slideUp(function() {
      row.remove();
    });
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

  $(document).on('click', "#confirm-accept-icon", function(e) {
    e.preventDefault();
    // $("#copy-field").val().split("\n") // for more robust implementation
    $("#accepted-list .attendees-row").each(function() {
      accept($(this).attr("data-id"), "accepted");
    })
    $(".modal").animate({"height": "toggle"}, function() {
      $(".modal").remove();
    })
  })

  $(document).on('click', ".modal .close-icon", function() {
    $(".modal").animate({"height": "toggle"}, function() {
      $(".modal").remove();
    })
  })
  $(document).on('click', ".history-icon > span", function(e) {showHistory(e);});
  $(document).on('click', ".edit-icon > span", function(e) {showEditPanel(e);});
  $(document).on('click', "#copy-icon", function() {
    $("#copy-field").select();
    document.execCommand('copy', true);
  });

  $(document).on('change', "#edit-modal li *", function() {
    var field_name = $(this).closest("li").text().split(":")[0];
    let field_val;
    if ($(this).attr('type') === "checkbox") field_val = $(this).is(":checked");
    else field_val = $(this).val();
    edited_fields[field_name] = field_val;
  })

  $(document).on('click', "#finish-edit-icon", function() {
    modify($(this).closest("#edit-modal").attr("data-id"), edited_fields).then(function(result) {
      edited_fields = {};
      $(".modal").animate({"height": "toggle"}, function() {
        $(".modal").remove();
        updateLists();
      })
    })
  })

  $("#themes .slider").click(function() {
    $("body").toggleClass("dark").toggleClass("");
  });

  var lastChecked = null;

  $(document).on('click', '.accept', function(e) {
    if(!lastChecked) {
          lastChecked = this;
          return;
      }

      if(e.shiftKey) {
        console.log(this);
        var start = $('.accept').index(this);
        var end = $('.accept').index(lastChecked);

        $('.accept').slice(Math.min(start,end), Math.max(start,end)+ 1).prop('checked', lastChecked.checked);
      }

      lastChecked = this;
    });
})

function getPanel(panel) {
  if (panel === "email-list") $("#search-bar").show();
  else $("#search-bar").hide();
  if (panel === "acceptance-queue") $("#export-emails").show();
  else $("#export-emails").hide();
  $('.panel').hide();
  $('#' + panel).show();
  updateLists();
}

function expandAll() {
  $("details").attr('open', '');
}

function hideAll() {
  $("details").removeAttr('open');
}

function confirmAccept() {
  $("#unaccepted-list .accept").each(function(index, element) {
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

function showHistory(e) {
  var modal = createModal();
  modal.container.id = "history-modal";

  var user_id = $(e.target).closest(".attendees-row").attr("data-id");
  getHistory(user_id).then(function(result) {
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode("Attendee <" + user_id + ">"));
    modal.content.appendChild(header);
    var wrapper = document.createElement("div");
    result.forEach(function(entry) {
      var details = "";
      for (var i=0; i<Object.keys(entry).length; i++) {
        details += "<li><b>" + Object.keys(entry)[i] + ":</b> " + Object.values(entry)[i] + "</li>";
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

function showEditPanel(e) {
  var modal = createModal();
  modal.container.id = "edit-modal";
  var user_id = $(e.target).closest(".attendees-row").attr("data-id");
  modal.container.setAttribute("data-id", user_id);

  getUser({query: user_id}).then(function(result) {
    var attendee = result[result.length-1];
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode("Attendee <" + user_id + ">"));
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

    modal.content.insertAdjacentHTML('afterbegin',
      "<span id='finish-edit-icon' title='Finish Edits'><img src='/assets/icons/check.svg'></span>"
    );

    wrapper.appendChild(list);
    modal.content.appendChild(wrapper);
    document.body.appendChild(modal.container);
    $(".modal").animate({"height": "toggle"})
  })
}

function searchUpdated(query) {
  getUser(query).then(function(result) {
    var ids = result.map(function(item) { return item.user_id });
    $("#email-list .attendees-row").each(function() {
      if (ids.includes($(this).attr('data-id'))) {
        return;
      } else {
        $(this).css({"display": "none"});
      }
    });
  })
}

function cancelSearch() {
  $("#email-list .attendees-row").each(function() {
    $(this).css({"display": "block"});
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
  if (gapi.auth2.getAuthInstance()) gapi.auth2.signout(); // Future implementation with scopes
}

function changeTheme(theme) {
  if (theme === "dark") {
    $('body').addClass('dark');
  } else {
  }
}
