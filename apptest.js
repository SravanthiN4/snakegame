// As a user playing the game I want to:
// start the game by pressing a Start button
// use my arrow keys to change the direction of the snake
// have the game end if the snake runs into a wall

// have the snake grow correctly when it eats the apple
// have the game end if the snake tries to eat itself

// see how long my snake was when the game ended - length of snake
//length of snake === display on screen

// start the game over without having to reset the browser

// Your code here

let size = 8;
let direction;
let x = 0,
	y = 1;
let snake = [];
let apple = {};
let score = 0;

const startButton = document.getElementById('start');
const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const slider = document.getElementById('myRange');
const output = document.getElementById('demo');

function drawBoard() {
	document.getElementById('board').innerHTML = '';
	for (let i = 0; i < size; i++) {
		let row = document.createElement('tr');
		//console.log(row);
		for (let j = 0; j < size; j++) {
			let cell = document.createElement('td');
			row.appendChild(cell);
		}
		document.getElementById('board').appendChild(row);
	}
}
drawBoard();

//RESET

//START BUTTON
startButton.addEventListener('click', function(event) {
	drawBoard();
	createSnake();
	createFood();
	startTimer();
	score = 0;
});

//CREATE SNAKE
function createSnake() {
	snake = [ [ size / 2, size / 2 ] ];
	drawSnake();
}
function drawSnake() {
	board.rows[snake[0][y]].cells[snake[0][x]].style.backgroundColor = 'blue';
}

//CREATE FOOD

function createFood() {
	apple = {
		x: Math.abs(Math.floor(Math.random() * size - 1)),
		y: Math.abs(Math.floor(Math.random() * size - 1))
	};

	for (let i = 1; i < snake.length; i++) {
		if (apple['x'] === snake[i][x] && apple['y'] === snake[i][y]) {
			apple['x'] = Math.abs(Math.floor(Math.random() * size - 1));
			apple['y'] = Math.abs(Math.floor(Math.random() * size - 1));
			i = 0;
		}
	}
	drawFood();
	//console.log("createFood",createFood());
}

function drawFood() {
	board.rows[apple['y']].cells[apple['x']].style.backgroundColor = 'red';
}

//Function to make sure Snake moves
output.innerHTML = slider.value;
slider.oninput = function() {
	output.innerHTML = this.value;
};

function startTimer() {
	document.onkeydown = checkKey;
	timer = setInterval(function() {
		move();
		tick();
	}, slider.value);
}

function move() {
	let nextHead = [ snake[0][x], snake[0][y] ];
	// console.log('first', nextHead);
	// console.log('last', snake[snake.length - 1]);
	board.rows[snake[0][y]].cells[snake[0][x]].style.backgroundColor = 'blue';
	board.rows[snake[snake.length - 1][y]].cells[snake[snake.length - 1][x]].style.backgroundColor = '';

	snake.pop();

	switch (direction) {
		case 'up':
			nextHead[y]--;
			break;

		case 'down':
			nextHead[y]++;
			break;

		case 'left':
			nextHead[x]--;
			break;

		case 'right':
			nextHead[x]++;
			break;
	}

	snake.unshift(nextHead);

	loose();

	document.getElementById('snakelength').innerText = snake.length;
}

//check if the user input up/down/left/right key
function checkKey(event) {
	//console.log(event.key);
	if (event.key === 'ArrowUp') {
		direction = 'up';
	}
	if (event.key === 'ArrowDown') {
		direction = 'down';
	}

	if (event.key === 'ArrowLeft') {
		direction = 'left';
	}

	if (event.key === 'ArrowRight') {
		direction = 'right';
	}
}

//have the snake grow correctly when it eats the apple
//if the current position of snake === current position of apple
function tick() {
	let xPosition = snake[0][x];
	let yPosition = snake[0][y];

	let xPositionApple = apple['x'];
	let yPositionApple = apple['y'];

	if (xPosition === xPositionApple && yPosition === yPositionApple) {
		let newTail = [ snake[snake.length - 1][x], snake[snake.length - 1][y] ];
		if (newTail[0] === 0 && newTail[1] === 0) {
			newTail[0]++;
		} else if (newTail[0] === 0) {
			newTail[1]--;
		} else {
			newTail[0]--;
		}

		snake.push(newTail);

		createFood();
		console.log(apple);

		score++;

		document.getElementById('score').innerText = score;
	} else {
		//do nothing
	}
}
function loose() {
	if (snake[0][x] < 0 || snake[0][y] < 0 || snake[0][x] >= size || snake[0][y] >= size) {
		document.getElementById('message').innerText = 'Oh no! You hit the wall!';
		clearInterval(timer);
	} else {
		drawSnake();
	}

	//head of the snake === any other cell in the array
	//it is hitting itself
	for (let i = 1; i <= snake.length - 1; i++) {
		if (snake[0][x] === snake[i][0] && snake[0][y] === snake[i][1]) {
			document.getElementById('message').innerText = 'Oh no! You ate yourself!';
			clearInterval(timer);
		}
	}
}

resetButton.addEventListener('click', function(event) {
	score = 0;
	drawBoard();
	document.getElementById('message').innerText = '';
	document.getElementById('score').innerText = '';
	document.getElementById('snakelength').innerText = '';
});
