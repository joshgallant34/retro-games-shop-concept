const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
let gameInterval;
let gameStarted = false;

// Game variables
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = 'RIGHT';
let score = 0;

// Canvas setup
canvas.width = 400;
canvas.height = 400;
const scale = 20; // size of each cell

// Draw function
function drawGame() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale));

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

// Start button listener
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none'; // hide button
  if (!gameStarted) {
    gameStarted = true;
    gameInterval = setInterval(gameLoop, 175); // change speed here
  }
});

// Game loop
function gameLoop() {
  moveSnake();
  checkCollision();
  drawGame();
}

function moveSnake() {
  // Calculate new head position
  let head = {...snake[0]};
  if (direction === 'RIGHT') head.x += 1;
  if (direction === 'LEFT') head.x -= 1;
  if (direction === 'UP') head.y -= 1;
  if (direction === 'DOWN') head.y += 1;

  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    document.getElementById('score').textContent = score;
    food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
  } else {
    snake.pop();
  }
}

function checkCollision() {
  let head = snake[0];
  // Check wall collisions
  if (head.x < 0 || head.x >= canvas.width/scale || head.y < 0 || head.y >= canvas.height/scale) {
    gameOver();
  }
  // Check self collisions
  for (let i=1; i<snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert(`Game over! Score: ${score}`);
  // Reset game
  snake = [{x: 10, y: 10}];
  direction = 'RIGHT';
  score = 0;
  document.getElementById('score').textContent = score;
  startBtn.style.display = 'block';
  gameStarted = false;
}

let gamePaused = false;
const pauseBtn = document.getElementById('pauseBtn');

function togglePause() {
  if(!gameStarted) return;
  gamePaused = !gamePaused;
  if(gamePaused){
    clearInterval(gameInterval);
    pauseBtn.style.display = 'block';
    pauseBtn.textContent = 'PAUSED';
  } else {
    gameInterval = setInterval(gameLoop, 200);
    pauseBtn.style.display = 'none';  }
}

// Click the pause button
pauseBtn.addEventListener('click', togglePause);

// Space bar toggles pause
document.addEventListener('keydown', (e) => {
  if(e.code === 'Space'){
    e.preventDefault(); // prevent page scroll
    togglePause();
  }
});

// Show pause button once game starts
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'block';
  if(!gameStarted){
    gameStarted = true;
    gameInterval = setInterval(gameLoop, 200);
  }
});


// Optional: Add arrow key controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});
