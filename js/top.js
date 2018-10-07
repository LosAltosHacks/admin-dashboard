$('.nav-link a').on('click', function(event) {
	var target = $(this.getAttribute('href'));
	if( target.length ) {
		event.preventDefault();
		$('html, body').stop().animate({
			 scrollTop: target.offset().top
		 }, 1000); }
	 }
);
$('details').attr('ontoggle', 'animateOpen(this)');
function animateOpen(ele) {
	if($(ele).is("[open]")) {
		setTimeout(function() {
			var preh = $(ele).outerHeight();
			$(ele).css('height', preh+'px');
		}, 520);
	} else {
		$(ele).removeAttr('style');
	}
}
$('.lah-input-group .inpctrl').keydown(function(e) {
	if(e.which == 13) {
		e.preventDefault();
		$(this).blur();
		$('.reg-button', $(this).closest('.lah-input-group')).click();
	}
});
$('.lah-input-group .reg-button').click(function() {
	if($(this).prop('disabled'))
		return;
	var $parentInp = $(this).closest('.lah-input-group');
	var $input = $('input', $parentInp);
	var value = $input.val();
	//input sanitation
	value = value.trim();
	//i would recommend using an actual mail validator service serverside for this but to be thorough: 
	//https://emailregex.com/
	var regexSafe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	if(value == "" || value == null || !regexSafe) {
		$parentInp.addClass('error');
		setTimeout(function(){ $parentInp.removeClass('error'); }, 1200);
		$input.focus();
		return;
	}
	//insert your generic load indicator here
	$parentInp.addClass('load');
	$(this).prop('disabled', true);
	//insert your generic code-200 placeholder here
	$.post('https://jsonplaceholder.typicode.com/posts', {addr: value}).done(function() {
		$parentInp.addClass('closed').removeClass('load');
		$('.reg-button', $parentInp).text("Registration completed.");
	}).fail(function(msg) {
		$parentInp.addClass('error').removeClass('load');
		setTimeout(function(){ $parentInp.removeClass('error'); }, 1200);
		$input.focus();
		$(this).prop('disabled', false);
	})
});
/*
const registrationEnd = moment('2018-03-18 21:00')
const eventStart = moment('2018-03-24 11:00')
const eventEnd = moment('2018-03-25 8:00')

// Debug
// const registrationEnd = moment().add(5, 's')
// const eventStart = moment().add(10, 's')
// const eventEnd = moment().add(15, 's')

const $topMain = document.querySelector(`#top-main`)
let mode = ''
function update(){
	const now = moment()
	const newMode =
		now.isBefore(registrationEnd) ? 'apply' :
		now.isBefore(eventStart) ? 'countdown' :
		now.isBefore(eventEnd) ? 'event' :
		'post-event'

	if(mode !== newMode){
		mode = newMode

		const $template = document.querySelector(`template#template-${mode}`)
		console.log(mode, $template)
		const $content = document.importNode($template.content, true)
		$topMain.innerText = ''
		$topMain.append($content)
	}


	const $countdown = document.querySelector('#countdown')
	if($countdown){
		const {days, hours, minutes, seconds} = moment.duration(eventStart.diff(moment()))._data
		$countdown.textContent = [
			days && `${days} day${days === 1 ? '' : 's'} ·`,
			hours && `${hours} hour${hours === 1 ? '' : 's'} ·`,
			`${minutes} minute${minutes === 1 ? '' : 's'} ·`,
			`${seconds} second${seconds === 1 ? '' : 's'}`
		].filter(_ => _).join(' ')
	}
}
update()
setInterval(update, 1000)
*/