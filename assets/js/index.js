server = "http://localhost:5000";
jwt_auth = "foobar";

// Listeners for controls

$(document).ready(function() {
  // Decorative Controls
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

  // Essential Controls
  $("#select-all").change(function() {
    if ($(this).is(':checked')) {
      $(".accept").prop("checked", true);
    } else {
      $(".accept").prop("checked", false);
    }
  })

  $(document).on('click', ".delete-icon > span", function(e) {
    e.preventDefault();
    deleteUser($(this).closest(".attendees-row").attr("data-id"))
    let row = $(this).closest(".attendees-row");
    row.css({"background-color": "#e53935"});
    row.css({"color": "white"});
    row.slideUp(function() {
      row.remove();
    });
  })

  $(document).on('click', ".history-icon > span", function(e) {showHistory(e);});
  $(document).on('click', ".edit-icon > span", function(e) {showEditPanel(e);});

  document.addEventListener('copy', clipboard.hook);
})

function getPanel(panel) {
  $('.panel').css({display: "none"});
  $('#' + panel).css({display: "block"});
  if (panel !== "bulk-acceptance") $("#confirm-acceptance").css({display: "none"});
  else $("#confirm-acceptance").css({display: "block"});
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
      let id = $(element).closest(".attendees-row").attr("data-id");
      accept(id, "queue");
    }
  })
  updateLists();
}

function showHistory(e) {
  var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "history-modal";

  var user_id = $(e.target).closest(".attendees-row").attr("data-id");
  getHistory(user_id).then(function(result) {
    // Do something here
  })
}

function showEditPanel(e) {
  var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "edit-modal";
  document.querySelector("body").appendChild(modal);
}
