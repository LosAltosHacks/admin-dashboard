server = "http://localhost:5000";
jwt_auth = "foobar";

// Listeners for controls

$(document).ready(function() {
  $("#menu-button").click(function() {
    $("#menu-panel").animate({"width": "toggle"});
  })

  $("body > div").not("#menu").click(function() {
    if ($("#menu-panel").css("display") !== "none") $("#menu-panel").animate({"width": "toggle"});
  })

  $("#select-all").change(function() {
    if ($(this).is(':checked')) {
      $(".accept").prop("checked", true);
    } else {
      $(".accept").prop("checked", false);
    }
  })
})

function getPanel(panel) {
  $('.panel').css({display: "none"});
  $('#' + panel).css({display: "block"});
  if (panel !== "bulk-acceptance") $("#confirm-acceptance").css({display: "none"});
  else $("#confirm-acceptance").css({display: "block"});
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
}
