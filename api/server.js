let gpio = require('gpio')
let keypress = require('keypress')
let process = require('process')
let sleep = require('thread-sleep')

let gp24 = gpio.export(2, { direction: 'out', interval: 50 })
let gp26 = gpio.export(3, { direction: 'out', interval: 50 })

let gp19 = gpio.export(27, { direction: 'out', interval: 50 })
let gp21 = gpio.export(17, { direction: 'out', interval: 50 })

let state = {
	forward: false,
	backwards: false,
	right: false,
	left: false
}

let forwardLeft = () => {
	gp19.set(0)
	gp21.set(1)
}

let forwardRight = () => {
	gp24.set(1)
	gp26.set(0)
}

let reverseLeft = () => {
	gp19.set(1)
	gp21.set(0)
}

let reverseRight = () => {
	gp24.set(0)
	gp26.set(1)
}

let forward = () => {
	if(state.backwards) {
		halt()
	}

	forwardLeft()
	forwardRight()

	state.forward = true
	console.log(state)
}

let backwards = () => {
	if(state.forward) {
		halt()
	}

	reverseLeft()
	reverseRight()

	state.backwards = true
	console.log(state)
}

let right = () => {
	if(state.left) {
		halt()
	}

	reverseRight()
	forwardLeft()

	state.right = true
	console.log(state)
}

let left = () => {
	if(state.right) {
		halt()
	}

	reverseLeft()
	forwardRight()

	state.left = true
	console.log(state)
}

let halt = () => {
	gp19.set(0)
	gp21.set(0)
	gp24.set(0)
	gp26.set(0)

	state.backwards = false
	state.forward = false
	state.left = false
	state.right = false

	console.log(state)
	console.log('halt')
}

keypress(process.stdin)

process.stdin.on('keypress', function (ch, key) {
	if (key && key.ctrl && key.name == 'c') {
	  	process.stdin.pause()
	}
	if(key && key.name == 'up' || key.name == 'w') {
		forward()
		console.log('forward')
	}
	if(key && key.name == 'down' || key.name == 's') {
		backwards()
		console.log('backwards')
	}
	if(key && key.name == 'left' || key.name == 'a') {
		left()
		console.log('left')
	}
	if(key && key.name == 'right' || key.name == 'd') {
		right()
		console.log('right')
	}
	if(key && key.name == 'space') {
		halt()
	}
	if(key && key.name == 'u') {
		forwardRight()
	}
	if(key && key.name == 'j') {
		reverseRight()
	}
	if(key && key.name == 'h') {
		reverseLeft()
	}
	if(key && key.name == 'y') {
		forwardLeft()
	}
})

process.stdin.setRawMode(true)
process.stdin.resume()