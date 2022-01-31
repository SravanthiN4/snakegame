let size = 8;
let snake;
let direction;

let state = {
  score: 0,
  
};


const startButton = document.getElementById("start");

// create a 16*16 board
const board = document.getElementById("board");

function drawBoard() {
  document.getElementById("board").innerHTML = ""
  for(let i = 0; i < size; i++) {
    let row = document.createElement("tr")
    //console.log(row);

    for(let j = 0; j < size; j++) {
      let cell = document.createElement("td");
      //console.log(cell);
      row.appendChild(cell)
    
    }
    document.getElementById("board").appendChild(row);
  }
  
}

startButton.addEventListener("click", function(event){
  drawBoard();
  createSnake();
  createFood();
  startTimer();
})

function reset() {
  state = {
    score: 0,
  };
  drawBoard();
  // createBlock();
  // createFood();
}

reset();

//create a snake
function createSnake() {
  snake = {
    x:size/2,
    y:size/2-1,
    dir:direction
  }
  // console.log(snake['x']);
  // console.log("y",snake['y']);
  drawSnake();
}

function drawSnake(){
  let board = document.getElementById("board");
  // console.log("board",board);
  // console.log("row", board.rows);
  // console.log("cells",board.rows.cells);
  board.rows[snake['y']].cells[snake['x']].style.backgroundColor = "blue";
}


//create food

function createFood(){
  apple = {
    x:Math.floor(Math.random()*size),
    y:Math.floor(Math.random()*size)
  }
  // console.log(apple['x']);
  // console.log(apple['y']);
  drawFood();
}

function drawFood(){
  let board = document.getElementById("board");
  board.rows[apple['y']].cells[apple['x']].style.backgroundColor = "red";
}


//snake moves

function startTimer() {
  document.onkeydown = checkKey;
  
  
  timer = setInterval(function(){
    move();
  },1000)
}

function move() {
    let board = document.getElementById("board");
    board.rows[snake['y']].cells[snake['x']].style.backgroundColor = "gray";

    switch(direction)
    {
        case "up":
        snake.y--;
        break;

        case "down":
        snake.y++;
        break;

        case "left":
        snake.x--;
        break;

        case "right":
        snake.x++;
        break;
    }

    //console.log("afterswitch",snake.y);
    if (snake['x'] < 0 || snake['y'] < 0 || snake['x'] >= size || snake['y'] >= size)
    {
        document.getElementById("message").innerHTML = "Lost";
        clearInterval(timer);
    }

    else
    {
        drawSnake();
    }


   

}
//check if the user input up/down/left/right key
function checkKey(event) {
  console.log(event.key);
  if(event.key === 'ArrowUp') {
    direction = "up";
    
  }
  if(event.key === 'ArrowDown') {
    direction = "down";
    
  }

  if(event.key === "ArrowLeft") {
    direction = "left";
  }

  if(event.key === "ArrowRight") {
    direction = "right";
  }
}