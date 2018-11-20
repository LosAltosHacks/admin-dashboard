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
})

function getPanel(panel) {
  $('.panel').css({display: "none"});
  if (panel === "email-list") {
    $('#email-list').css({display: "block"})
  }
  if (panel === "acceptance-queue") {
    $('#acceptance-queue').css({display: "block"})
  }
  if (panel === "bulk-acceptance") {
    $('#bulk-acceptance').css({display: "block"})
  }
  if (panel === "check-in") {
    $('#check-in').css({display: "block"})
  }
}
