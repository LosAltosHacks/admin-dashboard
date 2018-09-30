$('.nav-link a').on('click', function(event) {
	var target = $(this.getAttribute('href'));
	if( target.length ) {
		event.preventDefault();
		$('html, body').stop().animate({
			 scrollTop: target.offset().top
		 }, 1000); }
	 }
);

// const registrationEnd = moment('2018-03-18 21:00')
// const eventStart = moment('2018-03-24 11:00')
// const eventEnd = moment('2018-03-25 8:00')
//
// // Debug
// // const registrationEnd = moment().add(5, 's')
// // const eventStart = moment().add(10, 's')
// // const eventEnd = moment().add(15, 's')
//
// const $topMain = document.querySelector(`#top-main`)
// let mode = ''
// function update(){
// 	const now = moment()
// 	const newMode =
// 		now.isBefore(registrationEnd) ? 'apply' :
// 		now.isBefore(eventStart) ? 'countdown' :
// 		now.isBefore(eventEnd) ? 'event' :
// 		'post-event'
//
// 	if(mode !== newMode){
// 		mode = newMode
//
// 		const $template = document.querySelector(`template#template-${mode}`)
// 		console.log(mode, $template)
// 		const $content = document.importNode($template.content, true)
// 		$topMain.innerText = ''
// 		$topMain.append($content)
// 	}
//
//
// 	const $countdown = document.querySelector('#countdown')
// 	if($countdown){
// 		const {days, hours, minutes, seconds} = moment.duration(eventStart.diff(moment()))._data
// 		$countdown.textContent = [
// 			days && `${days} day${days === 1 ? '' : 's'} ·`,
// 			hours && `${hours} hour${hours === 1 ? '' : 's'} ·`,
// 			`${minutes} minute${minutes === 1 ? '' : 's'} ·`,
// 			`${seconds} second${seconds === 1 ? '' : 's'}`
// 		].filter(_ => _).join(' ')
// 	}
// }
// update()
// setInterval(update, 1000)
