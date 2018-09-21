// For debugging only
const X = console.log

const $ = s => document.querySelector.call(document, s)

// Returns a version of func that won't be executed more than once in a given interval of time.
function throttle(func, time = 200){
	let shouldWait = false
	let later
	return function(){
		if (!shouldWait) {
			func.apply(this, arguments)
			shouldWait = true
			setTimeout(() => {
				shouldWait = false
				if(later){
					later()
					later = undefined
				}
			}, time)
		}else{
			later = () => {
				func.apply(this, arguments)
			}
		}
	}
}

// Canvas animation by Darryl Yeo (darryl-yeo.com)
{
	const canvas = $('#top-canvas')

	let width, height
	const resize = () => {
		width = window.innerWidth, height = window.innerHeight
		Object.assign(canvas, {width, height})
	}
	resize()
	window.addEventListener('resize', throttle(resize))

	const context = canvas.getContext('2d')

	function bindMethods(object) {
		const boundMethods = {}
		for (const method in object) {
			if (typeof object[method] === 'function') {
				boundMethods[method] = object[method].bind(object)
			} else {
				boundMethods['$' + method] = v => object[method] = v
			}
		}
		return boundMethods
	}

	const {fill, fillRect, save, restore, resetTransform, translate, rotate, $fillStyle, $globalAlpha, $globalCompositeOperation} = bindMethods(context)
	const random = (a = -1, b = 1) => a + Math.random() * (b - a)
	const DEG = Math.PI / 180

	let mouse = {x: width / 2, y: height / 2, xPercent: 0, yPercent: 0}
	window.addEventListener('mousemove', e => {
		mouse.x = e.clientX
		mouse.y = e.clientY
		mouse.xPercent = mouse.x / (width / 2) - 1
		mouse.yPercent = mouse.y / (height / 2) - 1
	})

	let isInteractive = true

	const draw = () => {
		resetTransform()
		save()
			let
				hue = 204 + mouse.xPercent * 80 + random() * 100,
				saturation = .69 + mouse.yPercent * .2,
				lightness = .49

			$fillStyle(`hsla(${hue % 360}, ${saturation * 100}%, ${lightness * 100}%, 0.5)`)
			$globalAlpha(random(0, 0.3))
			$globalCompositeOperation('source-over')
			//const compositeModes = [/*'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop',*/ 'lighter', /*'copy',*/ 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'color', 'luminosity']
			//$globalCompositeOperation(compositeModes[Math.round(random(0, compositeModes.length))])

			// Random rectangles anywhere
			save()
				translate(random(0, width), random(0, height))
				//translate(mouse.x + random() * 200, mouse.y + random() * 200)
				rotate(random() * 60 * DEG)
				for(const c of ":)"){
					fillRect(0, 0, random(-100, 100), random(-100, 100))
				}
			restore()

			// Random rectangles centered around mouse
			if(isInteractive){
				save()
					translate(mouse.x + random() * 100, mouse.y + random() * 100)
					rotate(random() * 60 * DEG)
					for(const c of 'sely'){
						fillRect(0, 0, random(-100, 100), random(-100, 100))
					}
				restore()
			}
		restore()

		//$globalCompositeOperation('multiply')
		if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS')){
			$fillStyle('rgba(255, 255, 255, 0.01)')
		}else{
			$fillStyle('rgba(255, 255, 255, 0.002)')
		}
		fillRect(20, 20, width - 40, height - 40)
	}

	let animationID
	const loop = () => {
		isInteractive = window.innerWidth >= 800
		if(isInteractive){
			draw()
			timeout = setTimeout(() => {
				animationID = requestAnimationFrame(loop)
			}, 400)
		}else{
			for(let i = 0; i < 400; i++){
				draw()
			}
		}
	}
	loop()
	window.addEventListener('resize', throttle(() => {
		cancelAnimationFrame(animationID)
		loop()
	}), {
		passive: true
	})
}
