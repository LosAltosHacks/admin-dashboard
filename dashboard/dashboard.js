const $announcements = document.querySelector('#announcements')

const notifiedAnnouncementIDs = new Set(
	(localStorage.getItem('notifiedAnnouncementIDs') || '').split(',')
)

async function update(){
	const data = await fetch('https://api.airtable.com/v0/app5T2bTt9ZPoK4U5/Announcements?api_key=keykXpACZKknGof6z&view=Grid%20view&filterByFormula={Published}').then(data => data.json())
	const announcements = data.records
	console.log(announcements)

	const mNow = moment()

	$announcements.innerHTML = ''

	for(const announcement of announcements){
		const {
			'Title': title = '',
			'Time': time = '',
			'Announcement': text = '',
			'Pinned': pinned = false
		} = announcement.fields

		if(!text) continue

		const mTime = moment(time)
		if(mTime.isAfter(mNow)) continue

		$announcements.insertAdjacentHTML('afterbegin', `
			<div class="announcement ${pinned ? 'pinned' : ''}">
				<h3>${title}</h3>
				<p>${text.replace(/\n\n/g, '</p><p>')}</p>
				<footer><span class="pinned-label">Pinned</span><date>${mTime.calendar()} (${mTime.fromNow()})</date></footer>
			</div>
		`)

		const textStripped = new DOMParser().parseFromString(text, 'text/html').body.innerText

		if(Notification.permission === 'granted'){
			const id = announcement.id
			if(!notifiedAnnouncementIDs.has(id)){
				notifiedAnnouncementIDs.add(id)

				new Notification(title, {
					body: textStripped,
					tag: id,
					icon: '../favicon.png',
					badge: '../favicon.png',
					renotify: true
				})
			}
		}
	}

	localStorage.setItem('notifiedAnnouncementIDs', [...notifiedAnnouncementIDs].join(','))
}
update()
setInterval(() => update(), 10000)

const $notificationsButton = document.querySelector('#request-notifications')
function updateNotificationsButton(){
	const granted = Notification.permission === 'granted'
	$notificationsButton.disabled = granted
	$notificationsButton.textContent = granted ? 'Subscribed ✓' : 'Get Desktop Notifications'
}
updateNotificationsButton()
$notificationsButton.addEventListener('click', () => {
	Notification.requestPermission().then(updateNotificationsButton)
})