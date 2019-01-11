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

  $('input[data-mask]').on('input change', function() {
    if ($(this).val()) $(this).setMask("phone-us");
  })

  $('.lahBtn').not('.disabled').click(function() {

    // if (!($('#infoPage').hasClass('unloadedPage'))) {
    //   $('.badge').addClass('flip');
    // }

    var name, email;

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
$('.slInp, .radioBox', '#infoPage').on('input change', function(e) {
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

  var name;

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
	$('#infoPage').removeClass('unloadedPage');
	$(window).scrollTop(0);
	$('#infoPage .slInp')[0].focus();
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

const map = (typeof Map === "function") ? new Map() : (function () {
	const keys = [];
	const values = [];

	return {
		has(key) {
			return keys.indexOf(key) > -1;
		},
		get(key) {
			return values[keys.indexOf(key)];
		},
		set(key, value) {
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				values.push(value);
			}
		},
		delete(key) {
			const index = keys.indexOf(key);
			if (index > -1) {
				keys.splice(index, 1);
				values.splice(index, 1);
			}
		},
	}
})();

let createEvent = (name)=> new Event(name, {bubbles: true});
try {
	new Event('test');
} catch(e) {
	// IE does not support `new Event()`
	createEvent = (name)=> {
		const evt = document.createEvent('Event');
		evt.initEvent(name, true, false);
		return evt;
	};
}

function assign(ta) {
	if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

	let heightOffset = null;
	let clientWidth = null;
	let cachedHeight = null;

	function init() {
		const style = window.getComputedStyle(ta, null);

		if (style.resize === 'vertical') {
			ta.style.resize = 'none';
		} else if (style.resize === 'both') {
			ta.style.resize = 'horizontal';
		}

		if (style.boxSizing === 'content-box') {
			heightOffset = -(parseFloat(style.paddingTop)+parseFloat(style.paddingBottom));
		} else {
			heightOffset = parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
		}
		// Fix when a textarea is not on document body and heightOffset is Not a Number
		if (isNaN(heightOffset)) {
			heightOffset = 0;
		}

		update();
	}

	function changeOverflow(value) {
		{
			// Chrome/Safari-specific fix:
			// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
			// made available by removing the scrollbar. The following forces the necessary text reflow.
			const width = ta.style.width;
			ta.style.width = '0px';
			// Force reflow:
			/* jshint ignore:start */
			ta.offsetWidth;
			/* jshint ignore:end */
			ta.style.width = width;
		}

		ta.style.overflowY = value;
	}

	function getParentOverflows(el) {
		const arr = [];

		while (el && el.parentNode && el.parentNode instanceof Element) {
			if (el.parentNode.scrollTop) {
				arr.push({
					node: el.parentNode,
					scrollTop: el.parentNode.scrollTop,
				})
			}
			el = el.parentNode;
		}

		return arr;
	}

	function resize() {
		if (ta.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			return;
		}

		const overflows = getParentOverflows(ta);
		const docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

		ta.style.height = '';
		ta.style.height = (ta.scrollHeight+heightOffset)+'px';

		// used to check if an update is actually necessary on window.resize
		clientWidth = ta.clientWidth;

		// prevents scroll-position jumping
		overflows.forEach(el => {
			el.node.scrollTop = el.scrollTop
		});

		if (docTop) {
			document.documentElement.scrollTop = docTop;
		}
	}

	function update() {
		resize();

		const styleHeight = Math.round(parseFloat(ta.style.height));
		const computed = window.getComputedStyle(ta, null);

		// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
		var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

		// The actual height not matching the style height (set via the resize method) indicates that
		// the max-height has been exceeded, in which case the overflow should be allowed.
		if (actualHeight < styleHeight) {
			if (computed.overflowY === 'hidden') {
				changeOverflow('scroll');
				resize();
				actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
			}
		} else {
			// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
			if (computed.overflowY !== 'hidden') {
				changeOverflow('hidden');
				resize();
				actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
			}
		}

		if (cachedHeight !== actualHeight) {
			cachedHeight = actualHeight;
			const evt = createEvent('autosize:resized');
			try {
				ta.dispatchEvent(evt);
			} catch (err) {
				// Firefox will throw an error on dispatchEvent for a detached element
				// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
			}
		}
	}

	const pageResize = () => {
		if (ta.clientWidth !== clientWidth) {
			update();
		}
	};

	const destroy = (style => {
		window.removeEventListener('resize', pageResize, false);
		ta.removeEventListener('input', update, false);
		ta.removeEventListener('keyup', update, false);
		ta.removeEventListener('autosize:destroy', destroy, false);
		ta.removeEventListener('autosize:update', update, false);

		Object.keys(style).forEach(key => {
			ta.style[key] = style[key];
		});

		map.delete(ta);
	}).bind(ta, {
		height: ta.style.height,
		resize: ta.style.resize,
		overflowY: ta.style.overflowY,
		overflowX: ta.style.overflowX,
		wordWrap: ta.style.wordWrap,
	});

	ta.addEventListener('autosize:destroy', destroy, false);

	// IE9 does not fire onpropertychange or oninput for deletions,
	// so binding to onkeyup to catch most of those events.
	// There is no way that I know of to detect something like 'cut' in IE9.
	if ('onpropertychange' in ta && 'oninput' in ta) {
		ta.addEventListener('keyup', update, false);
	}

	window.addEventListener('resize', pageResize, false);
	ta.addEventListener('input', update, false);
	ta.addEventListener('autosize:update', update, false);
	ta.style.overflowX = 'hidden';
	ta.style.wordWrap = 'break-word';

	map.set(ta, {
		destroy,
		update,
	});

	init();
}

function destroy(ta) {
	const methods = map.get(ta);
	if (methods) {
		methods.destroy();
	}
}

function update(ta) {
	const methods = map.get(ta);
	if (methods) {
		methods.update();
	}
}

let autosize = null;

// Do nothing in Node.js environment and IE8 (or lower)
if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
	autosize = el => el;
	autosize.destroy = el => el;
	autosize.update = el => el;
} else {
	autosize = (el, options) => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], x => assign(x, options));
		}
		return el;
	};
	autosize.destroy = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], destroy);
		}
		return el;
	};
	autosize.update = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], update);
		}
		return el;
	};
}
