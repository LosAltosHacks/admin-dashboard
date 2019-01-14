var lah_api = "https://api.losaltoshacks.com";

$(document).ready(function() {
  $('#en-language').tagsInput({
     'interactive':true,
     'defaultText':'Add a Language',
     'delimiter': [',',';',', '],   // Or a string with a single delimiter. Ex: ';'
     'removeWithBackspace' : true,
     'minChars' : 0,
     'maxChars' : 0,
  });

  $('.qGrp').click(function(e) {
    var isFront = $(e.target).closest('.qGrp').hasClass('front-field')
    if (isFront) $('.badge').removeClass('flip');
    else $('.badge').addClass('flip');
  })

  $('input').focus(function(e) {
    if ($(e.target).is('#en-name')) $('.badge').removeClass('flip');
    else $('.badge').addClass('flip');
  })

  $('input[data-mask]').on('input change', function() {
    if ($(this).val()) $(this).setMask("phone-us");
  })

  $('.lahBtn').not('.disabled').click(function() {

    // if (!($('#infoPage').hasClass('unloadedPage'))) {
    //   $('.badge').addClass('flip');
    // }

    var name, email, tel, languages;

    if ($('#en-name').val()) {
      name = $('#en-name').val().trim();
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (name) {
      $('#bdg-name').text(name);
      if($('#bdg-name').width() > $('.badge').width()) {
    		//truncate
    		$('#bdg-name').text(name.match(/\b\w/g).join(". ").toUpperCase() + ".");
    	}
    }
    if ($('#en-email').val()) {
      email = $('#en-email').val().trim();
    }
    if (email) {
      $('#bdg-email').text(email).prop('title', email);
    	//detect clipping
    	if($('#bdg-email')[0].offsetWidth < $('#bdg-email')[0].scrollWidth) {
            $('#bdg-email').text(email.substr(0,6) + '...' + email.substr(email.length-6));
    	}
    }
    if ($('#en-phone').val()) {
      tel = $('#en-phone').val();
    }
    if (tel) {
      $('#bdg-phone').text(tel);
    }
    if ($('.tag').length > 0) {
      languages = [];
      $('.tag').each(function() {
        var text = $(this).text();
        languages.push(text.substring(0, text.length-2));
      })
    }
    if (languages) {
      $('#bdg-languages').html("");
      for (var i=0; i<languages.length; i++) {
        if (i==0) $('#bdg-languages').html(languages[0]);
        else $('#bdg-languages').html($('#bdg-languages').html() + "&middot; " + languages[i]);
      }
    }

  	var allFilled = true;
  	$('.slInp', '#infoPage').each(function() {
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
  			$('#finalPageBtn').removeClass('disabled');
  		else
  			$('#finalPageBtn').addClass('disabled');
  	}
  	else {
  		$('#finalPageBtn').addClass('disabled');
  		$('#en-grade').closest('.qGrp').removeClass('focus');
  		$('#en-grade .radioBox').attr('disabled', '');
  	}
  });

	var email = $('#en-email').val().trim();
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

	$('#bdg-email').text(email).prop('title', email);
	//detect clipping
	if($('#bdg-email')[0].offsetWidth < $('#bdg-email')[0].scrollWidth) {
        $('#bdg-email').text(email.substr(0,6) + '...' + email.substr(email.length-6));
	}

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
$('.qGrp').on('focus', '.slInp, .slSel, #en-language_tag', function() {
  console.log('hi');
	$(this).closest('.qGrp').addClass('focus');
});
$('.qGrp').on('blur', '.slInp, .slSel, #en-language_tag', function() {
	$(this).closest('.qGrp.focus').removeClass('focus');
});
$('.qGrp').on('input change', '.slInp, .radioBox, #en-language_tag', function(e) {
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

  var name, email, tel, languages;

  if ($('#en-name').val()) {
    name = $('#en-name').val().trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (name) {
    $('#bdg-name').text(name);
    if($('#bdg-name').width() > $('.badge').width()) {
      //truncate
      $('#bdg-name').text(name.match(/\b\w/g).join(". ").toUpperCase() + ".");
    }
  }
  if ($('#en-email').val()) {
    email = $('#en-email').val().trim();
  }
  if (email) {
    $('#bdg-email').text(email).prop('title', email);
    //detect clipping
    if($('#bdg-email')[0].offsetWidth < $('#bdg-email')[0].scrollWidth) {
          $('#bdg-email').text(email.substr(0,6) + '...' + email.substr(email.length-6));
    }
  }
  if ($('#en-phone').val()) {
    tel = $('#en-phone').val();
  }
  if (tel) {
    $('#bdg-phone').text(tel);
  }
  if ($('.tag').length > 0) {
    languages = [];
    $('.tag').each(function() {
      var text = $(this).text();
      languages.push(text.substring(0, text.length-2));
    })
  }
  if (languages) {
    $('#bdg-languages').html("");
    for (var i=0; i<languages.length; i++) {
      if (i==0) $('#bdg-languages').html(languages[0]);
      else $('#bdg-languages').html($('#bdg-languages').html() + "&middot; " + languages[i]);
    }
  }
	var allFilled = true;
  if ($('.tag').length == 0 || !$('#en-over18 .radioBox:checked').val() || !$('#en-shirtsize .radioBox:checked').val()) {
    allFilled = false;
    return false;
  }
	$('.slInp').each(function() {
    if ($(this).is('.optional')) return;
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
    $("#finReg").removeClass('disabled');
	} else {
    $("#finReg").addClass('disabled');
  }
});

$('#welcomeProgress').click(function() {
	$('#welcomePage').addClass('pullOffscreen');
	$('#infoPage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#infoPage .slInp')[0].focus();
});

$('#confirmBadge').click(function(e) {
	e.preventDefault();
	$('.badge').toggleClass('flip');
});

$('#finReg').click(function() {
	if($(this).is('.disabled')) return;
  $(this).prop('disabled', true).addClass('disabled');
	var db = {};
  db['name'] = $('#en-name').val().trim();
  db['email'] = $('#en-email').val().trim();
  db['phone'] = $('#en-phone').val().trim();
  db['over_18'] = $('#en-over18 .radioBox:checked').val();
  db['tshirt_size'] = $('#en-shirtsize .radioBox:checked').val();
  if($('#en-allergies').val().trim().length != 0)
		db['dietary_restrictions'] = $('#en-allergies').val().trim();
  if ($('.tag').length > 0) {
    languages = "";
    $('.tag').each(function() {
      var text = $(this).text();
      languages+=text.substring(0, text.length-2)+",";
    })
    db['skillset'] = languages.substring(0, languages.length-1);
  }
  $.post(lah_api+'/mentor/v1/signup', db).done(function() {
		if(smallui) {
			$('#confirmBadge').fadeOut();
			$('#regDone').fadeIn();
			$('.field-sect').fadeOut(function() {
        $('#confirmBadge').remove();
        $('.field-sect').remove();
      })
			$('.badge').fadeIn();
			$('.badge').removeClass('flip');
			$('.bdg-sect').css('width', '100vw').css('flex-basis', 'auto');
			return;
		}

		$('.badge').removeClass('flip');
		$('#regDone').fadeIn();
		$('#confirmBadge').fadeOut(function() {
      $('#confirmBadge').remove();
      $('.field-sect').remove();
    })
		$('.field-sect').removeClass('open');
	}).fail(function(msg) {
		//error handling
	})
});

$('#backHome').click(function() {
	window.location.href = "/";
});
