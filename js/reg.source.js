var lah_api = "https://api.losaltoshacks.com";

$(document).ready(function() {
  var file = new XMLHttpRequest();
  file.open("GET", "docs/schools.csv", true);
  file.onreadystatechange = function() {
    var response = file.responseText;
    var schools = response.split(/\r\n|\n/).splice(1);
    schools.forEach(function(school) {
      school = school.replace(/['"]+/g, '');
    })
    $("#en-school").autocomplete({source: function(request, response) {
        var results = $.ui.autocomplete.filter(schools, request.term);
        response(results.slice(0, 5));
    }});
  }
  file.send();

  $('input[data-mask]').on('input change', function() {
    if ($(this).val()) $(this).setMask("phone-us");
  })

  $('.lahBtn').not('.disabled').click(function() {

    if (!($('#contactPage').hasClass('pullOffscreen') || $('#contactPage').hasClass('unloadedPage')) || !($('#HDPage').hasClass('pullOffscreen') || $('#HDPage').hasClass('unloadedPage'))) {
      $('.badge').addClass('flip');
    }

    var first, last, age, school, grade, ageAddon;

    if ($('#en-first').val()) {
      first = $('#en-first').val().trim();
      first = first.charAt(0).toUpperCase() + first.slice(1);
    }
    if ($('#en-last').val()) {
      last = $('#en-last').val().trim();
      last = last.charAt(0).toUpperCase() + last.slice(1);
    }
    if (first && last) {
      $('#bdg-name').text(first + " " + last);
      if($('#bdg-name').width() > $('.badge').width()) {
    		//truncate
    		$('#bdg-name').text(first.charAt(0) + ". " + last);
    	}
    }
    if ($('#en-age').val()) {
      age = $('#en-age').val().trim();
      ageAddon = (age > 0) ? " ("+age+")" : "";
    }
    if ($('#en-school').val()) {
      school = $('#en-school').val().trim();
      if(school != "") {
        var abbrev = school.match(/\b(\w)/g).join('').toUpperCase();
        if (school.split(" ").length === 1 && school.length <= 4) $('#bdg-school').text(school.toUpperCase());
        else if (abbrev.length > 4) $('#bdg-school').text(abbrev.substring(0, 4));
        else $('#bdg-school').text(abbrev);
      }
    }
    if ($('#en-grade .radioBox:checked').val()) {
      var grade = $('#en-grade .radioBox:checked').val();
      if(grade > 0 && ageAddon)
    		$('#bdg-grade-age').text(grade+'th' + ageAddon);
    	else
    		$('#bdg-grade-age').text('');
    }

  	var allFilled = true;
  	$('.slInp', '#namePage').each(function() {
      if (!$(this).val()) {
        allFilled = false;
        return false;
      }
  		if($(this).val().trim() == "" || $(this).is('.invalidInp')) {
  			allFilled = false;
  			return false;
  		}
  	});
  	if(allFilled) {
  		$('#en-grade .radioBox').removeAttr('disabled');
  		$('#en-grade').closest('.qGrp').addClass('focus');

  		if($('#en-grade .radioBox:checked').val() && $('#en-grade .radioBox:checked').val().trim() != "")
  			$('#contactPageBtn').removeClass('disabled');
  		else
  			$('#contactPageBtn').addClass('disabled');
  	}
  	else {
  		$('#contactPageBtn').addClass('disabled');
  		$('#en-grade').closest('.qGrp').removeClass('focus');
  		$('#en-grade .radioBox').attr('disabled', '');
  	}
  });
	if($(this).is('#en-genderSelect')) {
		//we're really just shadow-inputting into #en-gender
		var value = $(this).val();
		if(value == "Other") {
			//show the value field
			$('#en-gender').removeClass('hidden').val("");
		} else {
			$('#en-gender').val(value).addClass('hidden');
		}
    if (value == "decline") {
      $('#en-gender').val("");
    }
	}
  if($(this).is('#en-raceSelect')) {
		//we're really just shadow-inputting into #en-race
		var value = $(this).val();
		if(value == "Other") {
			//show the value field
			$('#en-race').removeClass('hidden').val("");
		} else {
			$('#en-race').val(value).addClass('hidden');
		}
    if (value == "decline" || value == "select") {
      $('#en-race').val("");
    }
	}
	var gender = $('#en-gender').val().trim();
  var race = $('#en-race').val().trim();
	var email = $('#en-email').val().trim();
	var phone = $('#en-phone').val().trim();
	var parname = $('#en-par-name').val().trim();
	var paremail = $('#en-par-email').val().trim();
	var parphone = $('#en-par-phone').val().trim();
	var tshirt = $('#en-shirtsize .radioBox:checked').val();
	if($(this).is('.slInp.email')) {
		var value = $(this).val();
		var result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
		if(!result) {
			var $parentHolster = $(this).closest('.qGrp');
			$(this).addClass('invalidInp');
		}
		else {
			$(this).removeClass('invalidInp');
		}
	}
	if($(this).is('.slInp.phone')) {
		var value = $(this).val();
		var result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
		if(!result) {
			var $parentHolster = $(this).closest('.qGrp');
			$(this).addClass('invalidInp');
		}
		else {
			$(this).removeClass('invalidInp');
		}
	}

	$('#bdg-email').text(email).prop('title', email);
	//detect clipping
	if($('#bdg-email')[0].offsetWidth < $('#bdg-email')[0].scrollWidth) {
        $('#bdg-email').text(email.substr(0,6) + '...' + email.substr(email.length-6));
	}
	if(phone.length == 0 && parphone.length != 0 && parphone != "n/a")
		$('#bdg-phone').text(parphone);
	else
		$('#bdg-phone').text(phone);
	$('#bdg-parent-name').text(parname);
	$('#bdg-parent-email').text(paremail);
	$('#bdg-shirt').text(tshirt);

	var allFilled = true;
	$('.slInp', '#contactPage').each(function() {
		if($(this).val().trim() == "" || $(this).is('.invalidInp')) {
			if($(this).is('.optional')) return true;
			allFilled = false;
			return false;
		}
	});
	if(allFilled) {
		$('#en-shirtsize .radioBox').removeAttr('disabled');
		$('#en-shirtsize').closest('.qGrp').addClass('focus');

		if($('#en-shirtsize .radioBox:checked').val() && $('#en-shirtsize .radioBox:checked').val().trim() != "")
			$('#hackerBGBtn').removeClass('disabled');
		else
			$('#hackerBGBtn').addClass('disabled');
	}
	else {
		$('#hackerBGBtn').addClass('disabled');
		$('#en-shirtsize').closest('.qGrp').removeClass('focus');
		$('#en-shirtsize .radioBox').attr('disabled', '');
	}

  var linkedin = $('#en-linkedin').val().trim();
	//
	var github = $('#en-github').val().trim();
	var attended = $('#en-attendednum .radioBox:checked').val();

	if($(this).is('.slInp.social')) {
		var value = $(this).val();
		var result = (value.length > 0 && (value.indexOf('linkedin.com/in/') == -1  && value.indexOf('github.com/') == -1));
		if(result)
			$(this).addClass('invalidInp');
		else
			$(this).removeClass('invalidInp');
	}
	if(linkedin.length > 0) {
		if(linkedin.indexOf('linkedin.com/in/') != -1) {
			if(linkedin.substr(-9, 1) == "-") {
				//no profile url
				$('#bdg-linkedin').text( ($('#en-first').val().trim() + $('#en-last').val().trim()).toLowerCase());
			} else {
				$('#bdg-linkedin').text(linkedin.substring(linkedin.indexOf('/in/')+4));
			}
		} else {
			$('#bdg-linkedin').text('');
		}
	}
	if(github.length > 0 && github.indexOf('github.com/') != -1)
		$('#bdg-github').text(github.substring(github.indexOf('.com/')+5));
	else
		$('#bdg-github').text('');
	$('#bdg-exp').text(attended);
	var allFilled = true;
	$('.slInp', '#HDPage').each(function() {
		if($(this).is('.invalidInp')) {
			allFilled = false;
			return false;
		}
	});
	if($('#en-attendednum .radioBox:checked').val().trim() == "") {
		allFilled = false;
	}
	if(allFilled)
		$('#finReg').removeClass('disabled');
	else
		$('#finReg').addClass('disabled');
})

var smallui = false;
if($(window).width() > 700) {
	var screenHeight = $(window).height();
	var badgeHeight = $('.badge').height();
	$('.badge').css('margin-top', (screenHeight/2 - badgeHeight/2)+'px');
	$('.gradient-drop').css('opacity', 1);
	setTimeout(function() {
		$('.field-sect').addClass('open');
	}, 1500)
} else {
	redrawWindow();
}
$(window).resize(function() {
	redrawWindow();
});
function redrawWindow() {
	if($(window).width() <= 700)
		smallui = true;
	else
		smallui = false;

	var screenHeight = $(window).height();
	var badgeHeight = $('.badge').height();
	$('.badge').css('margin-top', (screenHeight/2 - badgeHeight/2)+'px');
	$('.gradient-drop').css('opacity', 1);
	$('.field-sect').addClass('open');
}
$('.slInp, .slSel').focus(function() {
	$(this).closest('.qGrp').addClass('focus');
});
$('.slInp, .slSel').blur(function() {
	$(this).closest('.qGrp.focus').removeClass('focus');
});
$('.slInp, .radioBox', '#namePage').on('input change', function(e) {
	if($(this).is('.slInp.num')) {
		var value = $(this).val();
		var altVal = value.replace(/[^0-9]/g, "");
		if(altVal != value) {
			$(this).val(altVal);
			var $parentHolster = $(this).closest('.qGrp');
			if(!$parentHolster.is(':animated')) {
				$parentHolster.animate({'margin-left': '-20px'}, 200, function() {
					$parentHolster.animate({'margin-left': '20px'}, 200, function() {
						$parentHolster.animate({'margin-left': '0px'}, 200);
					});
				});
			}
		}
	}

  var first, last, age, school, grade, ageAddon;

  if ($('#en-first').val()) {
    first = $('#en-first').val().trim();
    first = first.charAt(0).toUpperCase() + first.slice(1);
  }
  if ($('#en-last').val()) {
    last = $('#en-last').val().trim();
    last = last.charAt(0).toUpperCase() + last.slice(1);
  }
  if (first && last) {
    $('#bdg-name').text(first + " " + last);
    if($('#bdg-name').width() > $('.badge').width()) {
  		//truncate
  		$('#bdg-name').text(first.charAt(0) + ". " + last);
  	}
  }
  if ($('#en-age').val()) {
    age = $('#en-age').val().trim();
    ageAddon = (age > 0) ? " ("+age+")" : "";
  }
  if ($('#en-school').val()) {
    school = $('#en-school').val().trim();
    if(school != "") {
      var abbrev = school.match(/\b(\w)/g).join('').toUpperCase();
      if (school.split(" ").length === 1 && school.length <= 4) $('#bdg-school').text(school.toUpperCase());
      else if (abbrev.length > 4) $('#bdg-school').text(abbrev.substring(0, 4));
      else $('#bdg-school').text(abbrev);
    }
  }
  if ($('#en-grade .radioBox:checked').val()) {
    var grade = $('#en-grade .radioBox:checked').val();
    if(grade > 0 && ageAddon)
  		$('#bdg-grade-age').text(grade+'th' + ageAddon);
  	else
  		$('#bdg-grade-age').text('');
  }

	var allFilled = true;
	$('.slInp', '#namePage').each(function() {
    if (!$(this).val()) {
      allFilled = false;
      return false;
    }
		if($(this).val().trim() == "" || $(this).is('.invalidInp')) {
			allFilled = false;
			return false;
		}
	});
	if(allFilled) {
		$('#en-grade .radioBox').removeAttr('disabled');
		$('#en-grade').closest('.qGrp').addClass('focus');

		if($('#en-grade .radioBox:checked').val() && $('#en-grade .radioBox:checked').val().trim() != "")
			$('#contactPageBtn').removeClass('disabled');
		else
			$('#contactPageBtn').addClass('disabled');
	}
	else {
		$('#contactPageBtn').addClass('disabled');
		$('#en-grade').closest('.qGrp').removeClass('focus');
		$('#en-grade .radioBox').attr('disabled', '');
	}
});
$('.slInp, .radioBox, .slSel', '#contactPage').on('input change', function() {
	if($(this).is('#en-genderSelect')) {
		//we're really just shadow-inputting into #en-gender
		var value = $(this).val();
		if(value == "Other") {
			//show the value field
			$('#en-gender').removeClass('hidden').val("");
		} else {
			$('#en-gender').val(value).addClass('hidden');
		}
    if (value == "decline") {
      $('#en-gender').val("");
    }
	}
  if($(this).is('#en-raceSelect')) {
		//we're really just shadow-inputting into #en-race
		var value = $(this).val();
		if(value == "Other") {
			//show the value field
			$('#en-race').removeClass('hidden').val("");
		} else {
			$('#en-race').val(value).addClass('hidden');
		}
    if (value == "decline") {
      $('#en-race').val("");
    }
	}
	var gender = $('#en-gender').val().trim();
	var email = $('#en-email').val().trim();
	var phone = $('#en-phone').val().trim();
	var parname = $('#en-par-name').val().trim();
	var paremail = $('#en-par-email').val().trim();
	var parphone = $('#en-par-phone').val().trim();
	var tshirt = $('#en-shirtsize .radioBox:checked').val();
	if($(this).is('.slInp.email')) {
		var value = $(this).val();
		var result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
		if(!result) {
			var $parentHolster = $(this).closest('.qGrp');
			$(this).addClass('invalidInp');
		}
		else {
			$(this).removeClass('invalidInp');
		}
	}
	if($(this).is('.slInp.phone')) {
		var value = $(this).val();
		var result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
		if(!result) {
			var $parentHolster = $(this).closest('.qGrp');
			$(this).addClass('invalidInp');
		}
		else {
			$(this).removeClass('invalidInp');
		}
	}

	$('#bdg-email').text(email).prop('title', email);
	//detect clipping
	if($('#bdg-email')[0].offsetWidth < $('#bdg-email')[0].scrollWidth) {
        $('#bdg-email').text(email.substr(0,6) + '...' + email.substr(email.length-6));
	}
	if(phone.length == 0 && parphone.length != 0 && parphone != "n/a")
		$('#bdg-phone').text(parphone);
	else
		$('#bdg-phone').text(phone);
	$('#bdg-parent-name').text(parname);
	$('#bdg-parent-email').text(paremail);
	$('#bdg-shirt').text(tshirt);

	var allFilled = true;
	$('.slInp', '#contactPage').each(function() {
		if($(this).val().trim() == "" || $(this).is('.invalidInp')) {
			if($(this).is('.optional')) return true;
			allFilled = false;
			return false;
		}
	});
	if(allFilled) {
		$('#en-shirtsize .radioBox').removeAttr('disabled');
		$('#en-shirtsize').closest('.qGrp').addClass('focus');

		if($('#en-shirtsize .radioBox:checked').val() && $('#en-shirtsize .radioBox:checked').val().trim() != "")
			$('#hackerBGBtn').removeClass('disabled');
		else
			$('#hackerBGBtn').addClass('disabled');
	}
	else {
		$('#hackerBGBtn').addClass('disabled');
		$('#en-shirtsize').closest('.qGrp').removeClass('focus');
		$('#en-shirtsize .radioBox').attr('disabled', '');
	}

});
$('.slInp, .radioBox', '#HDPage').on('input change', function() {
	//https://www.linkedin.com/in/somename or https://www.linkedin.com/in/first-last-12345678
	var linkedin = $('#en-linkedin').val().trim();
	//
	var github = $('#en-github').val().trim();
	var attended = $('#en-attendednum .radioBox:checked').val();

	if($(this).is('.slInp.social')) {
		var value = $(this).val();
		var result = (value.length > 0 && (value.indexOf('linkedin.com/in/') == -1  && value.indexOf('github.com/') == -1));
		if(result)
			$(this).addClass('invalidInp');
		else
			$(this).removeClass('invalidInp');
	}
	if(linkedin.length > 0) {
		if(linkedin.indexOf('linkedin.com/in/') != -1) {
			if(linkedin.substr(-9, 1) == "-") {
				//no profile url
				$('#bdg-linkedin').text( ($('#en-first').val().trim() + $('#en-last').val().trim()).toLowerCase());
			} else {
				$('#bdg-linkedin').text(linkedin.substring(linkedin.indexOf('/in/')+4));
			}
		} else {
			$('#bdg-linkedin').text('');
		}
	}
	if(github.length > 0 && github.indexOf('github.com/') != -1)
		$('#bdg-github').text(github.substring(github.indexOf('.com/')+5));
	else
		$('#bdg-github').text('');
	$('#bdg-exp').text(attended);
	var allFilled = true;
	$('.slInp', '#HDPage').each(function() {
		if($(this).is('.invalidInp')) {
			allFilled = false;
			return false;
		}
	});
	if($('#en-attendednum .radioBox:checked').val().trim() == "") {
		allFilled = false;
	}
	if(allFilled)
		$('#finReg').removeClass('disabled');
	else
		$('#finReg').addClass('disabled');
});
$('#welcomeProgress').click(function() {
	$('#welcomePage').addClass('pullOffscreen');
	$('#namePage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#namePage .slInp')[0].focus();
});

$('#contactPageBtn').click(function() {
	if($(this).is('.disabled')) return;
	var age = $('#en-age').val().trim();
	if(parseInt(age) >= 18) {
		$('.grdn').hide();
		$('#en-par-name').val('n/a').prop('disabled', true);
		$('#en-par-email').val('n/a').prop('disabled', true);
		$('#en-par-phone').val('n/a').prop('disabled', true);
		$('#bdg-parent-name').text('n/a');
		$('#bdg-parent-email').text('n/a');
	} else {
		$('.grdn').show();
		$('#en-par-name').prop('disabled', false);
		$('#en-par-email').prop('disabled', false);
		$('#en-par-phone').prop('disabled', false);
	}

	$('#namePage').addClass('pullOffscreen');
	$('.badge').addClass('flip');
	$('#contactPage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#contactPage .slInp')[0].focus();
});
$('#hackerBGBack').click(function() {
	$('#namePage').removeClass('unloadedPage').removeClass('pullOffscreen');;
	$('#contactPage').addClass('unloadedPage')
	$('.badge').removeClass('flip');
	$('#namePage .slInp')[0].focus();
});

$('#hackerBGBtn').click(function() {
	if($(this).is('.disabled')) return;
	$('#contactPage').addClass('pullOffscreen');
	$('#HDPage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#HDPage .slInp')[0].focus();
});
$('#finRegBack').click(function() {
	$('#contactPage').removeClass('unloadedPage').removeClass('pullOffscreen');;
	$('#HDPage').addClass('unloadedPage')
	$('#contactPage .slInp')[0].focus();
})
$('#finReg').click(function() {
	if($(this).is('.disabled')) return;
	$('#HDPage').addClass('pullOffscreen');
	$('#finalizePage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#confirmBadge').fadeTo(300, 1);
});
$('#confirmBadge').click(function(e) {
	e.preventDefault();
	$('.badge').toggleClass('flip');
});
$('#sendRegBack').click(function() {
	$('#HDPage').removeClass('unloadedPage').removeClass('pullOffscreen');;
	$('#finalizePage').addClass('unloadedPage')
	$('#confirmBadge').fadeTo(300, 0);
})
$('#sendReg').click(function() {
	if($(this).is('.disabled')) return;
	$(this).prop('disabled', true).addClass('disabled');
	var db = {};
	db['first_name'] = $('#en-first').val().trim();
	db['surname'] = $('#en-last').val().trim();
	db['email'] = $('#en-email').val().trim();
	db['age'] = parseInt($('#en-age').val().trim());
	db['school'] = $('#en-school').val().trim();
	db['grade'] = parseInt($('#en-grade .radioBox:checked').val());
	db['student_phone_number'] = $('#en-phone').val().trim();
	db['gender'] = $('#en-gender').val().trim();
	db['tshirt_size'] = $('#en-shirtsize .radioBox:checked').val();
	db['previous_hackathons'] = $('#en-attendednum .radioBox:checked').val();
  if ($('#en-race').val().trim().length != 0) db['ethnicity'] = $('#en-race').val().trim();

	if(db['age'] < 18) {
		db['guardian_name'] = $('#en-par-name').val().trim();
		db['guardian_email'] = $('#en-par-email').val().trim();
		db['guardian_phone_number'] = $('#en-par-phone').val().trim();
	}
	if($('#en-github').val().trim().length != 0)
		db['github_username'] = $('#en-github').val().trim();
	if($('#en-linkedin').val().trim().length != 0)
		db['linkedin_profile'] = $('#en-linkedin').val().trim();
	if($('#en-allergies').val().trim().length != 0)
		db['dietary_restrictions'] = $('#en-allergies').val().trim();
	$.post(lah_api+'/registration/v1/signup', db).done(function() {
		if(smallui) {
			$('#confirmBadge').fadeOut();
			$('#regDone').fadeIn();
			$('.field-sect').fadeOut();
			$('.badge').fadeIn();
			$('.badge').removeClass('flip');
			$('.bdg-sect').css('width', '100vw').css('flex-basis', 'auto');
			return;
		}


		$('.badge').removeClass('flip');
		$('#regDone').fadeIn();
		$('#confirmBadge').fadeOut();
		$('.field-sect').removeClass('open');
	}).fail(function(msg) {
		//error handling
	})
});
$('#backHome').click(function() {
	window.location.href = "/";
});
$('.termsCheck', '#finalizePage').on('change', function() {
	var $thisQGroup = $(this).closest('.qGrp');
	var $nextQGroup = $thisQGroup.nextAll();
	if($('.termsCheck:not(:checked)', '#finalizePage').length == 0)
		$('#sendReg').removeClass('disabled');
	else
		$('#sendReg').addClass('disabled');
});
