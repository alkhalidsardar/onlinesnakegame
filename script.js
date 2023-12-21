// Define HTML elements
const board = document.getElementById('game-board'); // game board container
const instructionText = document.getElementById('instructions'); // instructions text
const logo = document.getElementById('logo'); // game logo
const score = document.getElementById('score'); // current score display
const highScoreText = document.getElementById('highScore'); // high score display

// Define game variables
const gridSize = 20; // size of the game grid
let snake = [{ x: 10, y: 10 }]; // initial position of the snake
let food = generateFood(); // initial position of the food
let highScore = 0; // high score
let direction = 'right'; // initial direction of the snake
let gameInterval; // variable to hold the setInterval function for the game loop
let gameSpeedDelay = 200; // initial speed of the game in milliseconds
let gameStarted = false; // flag to track whether the game is currently running

// Draw game map, snake, food
function draw() {
  board.innerHTML = ''; // clear the board
  drawSnake(); // draw the snake
  drawFood(); // draw the food
  updateScore(); // update the score display
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake'); // create a snake segment element
    setPosition(snakeElement, segment); // set the position of the snake segment
    board.appendChild(snakeElement); // append the snake segment to the board
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag); // create an HTML element
  element.className = className; // set the class of the element
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x; // set the column position of the element
  element.style.gridRow = position.y; // set the row position of the element
}

// Testing draw function
// draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food'); // create a food element
    setPosition(foodElement, food); // set the position of the food element
    board.appendChild(foodElement); // append the food element to the board
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1; // generate a random x-coordinate
  const y = Math.floor(Math.random() * gridSize) + 1; // generate a random y-coordinate
  return { x, y }; // return an object representing the food position
}

// Moving the snake
function move() {
  const head = { ...snake[0] }; // create a new object representing the head of the snake
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head); // add the new head to the front of the snake

  if (head.x === food.x && head.y === food.y) {
    // if the snake eats the food
    food = generateFood(); // generate a new position for the food
    increaseSpeed(); // increase the game speed
    clearInterval(gameInterval); // clear the previous interval
    gameInterval = setInterval(() => {
      move(); // move the snake
      checkCollision(); // check for collisions
      draw(); // draw the updated state
    }, gameSpeedDelay);
  } else {
    snake.pop(); // remove the last segment of the snake
  }
}

// Test moving
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200);

// Start game function
function startGame() {
  gameStarted = true; // set the game as started
  instructionText.style.display = 'none'; // hide the instructions
  logo.style.display = 'none'; // hide the logo
  gameInterval = setInterval(() => {
    move(); // move the snake
    checkCollision(); // check for collisions
    draw(); // draw the updated state
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Enter') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame(); // start the game on Enter or Space key press if not already started
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress); // add keydown event listener

function increaseSpeed() {
  // Increase game speed within certain limits
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0]; // get the head of the snake

  // Check for collision with walls
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame(); // reset the game if the snake hits the walls
  }

  // Check for collision with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame(); // reset the game if the snake collides with itself
    }
  }
}

function resetGame() {
  updateHighScore(); // update the high score
  stopGame(); // stop the game
  snake = [{ x: 10, y: 10 }]; // reset the snake to its initial position
  food = generateFood(); // generate a new position for the food
  direction = 'right'; // reset the direction
  gameSpeedDelay = 200; // reset the game speed
  updateScore(); // update the score display
}

function updateScore() {
  const currentScore = snake.length - 1; // calculate the current score
  score.textContent = currentScore.toString().padStart(3, '0'); // update the score display
}

function stopGame() {
  clearInterval(gameInterval); // clear the game interval
  gameStarted = false; // set the game as not started
  instructionText.style.display = 'block'; // display the instructions
  logo.style.display = 'block'; // display the logo
}

function updateHighScore() {
  const currentScore = snake.length - 1; // calculate the current score
  if (currentScore > highScore) {
    highScore = currentScore; // update the high score if the current score is higher
    highScoreText.textContent = highScore.toString().padStart(3, '0'); // update the high score display
  }
  highScoreText.style.display = 'block'; // display the high score
}
