var canvas = document.getElementById("teaser-animation"),
	ctx = canvas.getContext("2d"),
	startTime = performance.now();

canvas.width = 965;
canvas.height = 600;

ctx.scale(200, 200);

Object.assign(Number.prototype, {
	map(a, b, A = 0, B = 1){
		return A + (this - a) / (b - a) * (B - A)
	},
	normMap(A, B){
		return this.map(0, 1, A, B)
	},
	constrain(){
		return Math.min(Math.max(this, 0), 1)
	}
})


function animate(time) {
	var cycle = (time) / 1000 % 4,
	t;

	if (cycle <= 1) {
		getSlide
	} else if (cycle < 2) {

	} else if (cycle <= 3) {

	} else if (cycle < 4) {

	}

	requestAnimationFrame(animate);
}

function getSlide(i) {
	return $('#sponsor-slide')[i]
}

requestAnimationFrame(animate);

// function animate(time) {
// 	var cycle = (time - startTime) / 1000 % 4,
// 		t;
//
// 	// Loop the animation
// 	if (cycle <= 1) {
// 		t = cycle;
// 	} else if (cycle < 2) {
// 		t = 1;
// 	} else if (cycle <= 3) {
// 		t = 1 - cycle % 1;
// 	} else if (cycle < 4) {
// 		t = 0;
// 	}
//
// 	ctx.clearRect(0, 0, 700, 500);
// 	t = easeInOutCubic(t);
//
//
// 	ctx.save()
// 		ctx.translate(t * 0.35, 0);
//
// 		// Layer 0
// 		ctx.fillStyle = "#2980b9";
// 		drawLHoriz(t.map(0, 0.5).constrain());
// 		drawARight(t);
//
// 		// Layer 1
// 		ctx.fillStyle = "#3498db";
// 		drawLVert(t.map(0.5, 1).constrain());
// 		drawALeft(t);
// 	ctx.restore()
//
// 	requestAnimationFrame(animate);
// }

function drawLVert(t) {
	polygon([
		[0, 0],
		[1, 0],
		[1, 3],
		[1 - 0.005, 3],
		[0, 2 + 0.005],
	]);

	// Half pixel offsets prevent "cracks" from showing between shapes
	transitionedPolygon([
		[0, 2 - 0.005],
		[1 + 0.005, 3],
		[0.5, 4 - 1.5],
	], [
		[0, 2 - 0.005],
		[1 + 0.005, 3],
		[0, 4 - 1],
	], t);
}

function drawLHoriz(t) {
	// Slide in
	// We need a half pixel offset to hide a "crack," but we also don't want
	// this piece to stick out when it is supposed to be fully retracted. So,
	// we need to ease the half pixel too.
	transitionedPolygon([
		[1, 2],
		[2 + 1/6 + 0.005, 2],
		[2 - 1/6 + 0.005, 3],
		[1, 3],
	], [
		[1, 2],
		[1, 2],
		[1, 3],
		[1, 3],
	], t)
}

function drawALeft(t) {
	transitionedPolygon([
		[2 - 1/6, 3],
		[3 - 1/6, 3],
		[4 - 1/6, 0],
		[3 - 1/6, 0],
	], [
		// Skew (+/- 0.5); slide to the right (+ 2/3)
		[2 - 1/6 + 0.5 + 2/3, 3],
		[3 - 1/6 + 0.5 + 2/3, 3],
		[4 - 1/6 - 0.5 + 2/3, 0],
		[3 - 1/6 - 0.5 + 2/3, 0],
	], t)
}

function drawARight(t) {
	transitionedPolygon([
		[4 - 1/6, 0],
		[3 - 1/6, 0],
		[4 - 1/6, 3],
		[5 - 1/6, 3],
	], [
		// Skew (+/- 0.5); slide to the left (- 11/6)
		[4 - 1/6 + 0.5 - 11/6, 0],
		[3 - 1/6 + 0.5 - 11/6, 0],
		[4 - 1/6 - 0.5 - 11/6, 3],
		[5 - 1/6 - 0.5 - 11/6, 3],
	], t)
}

function transitionPoints(pointsFrom, pointsTo, t){
	return pointsFrom.map((from, i) => {
		const to = pointsTo[i]
		return [
			t.normMap(from[0], to[0]),
			t.normMap(from[1], to[1])
		]
	})
}
function polygon(points) {
	ctx.beginPath();
	ctx.moveTo(...points.shift());
	for(const p of points){
		ctx.lineTo(...p);
	}
	ctx.closePath();
	ctx.fill();
}
function transitionedPolygon(...args){
	polygon(transitionPoints(...args))
}

// https://gist.github.com/gre/1650294
function easeInOutCubic(t) {
	return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

requestAnimationFrame(animate);
