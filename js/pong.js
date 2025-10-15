const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;

let playerY = canvas.height / 2 - paddleHeight / 2;
let cpuY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

const paddleSpeed = 6;
const cpuSpeed = 4;

let upPressed = false;
let downPressed = false;

let playerScore = 0;
let cpuScore = 0;

let gameStarted = false;
let gamePaused = false;

let gameInterval;

// -------------------- Event Listeners --------------------

// Player paddle movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
  if (e.code === 'Space') togglePause();
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

// Start button
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  gameStarted = true;
  gameInterval = setInterval(gameLoop, 1000/60);
});

// -------------------- Game Functions --------------------

function gameLoop() {
  if (!gamePaused && gameStarted) {
    update();
  }
  draw();
}

// Update game state
function update() {
  // Player paddle
  if (upPressed) playerY -= paddleSpeed;
  if (downPressed) playerY += paddleSpeed;
  playerY = Math.max(Math.min(playerY, canvas.height - paddleHeight), 0);

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top/bottom walls
  if (ballY <= 0 || ballY >= canvas.height - ballSize) ballSpeedY = -ballSpeedY;

  // Ball collision with paddles
  if (ballX <= paddleWidth && ballY + ballSize >= playerY && ballY <= playerY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    // Optional: add slight Y variation
    ballSpeedY += (Math.random() - 0.5) * 2;
  }
  if (ballX >= canvas.width - paddleWidth - ballSize && ballY + ballSize >= cpuY && ballY <= cpuY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Scoring
  if (ballX < 0) { cpuScore++; resetBall(); }
  if (ballX > canvas.width) { playerScore++; resetBall(); }

  // CPU paddle movement (beatably)
  const cpuCenter = cpuY + paddleHeight / 2;
  if (Math.abs(cpuCenter - ballY) > 5) {
    if (cpuCenter < ballY) cpuY += cpuSpeed;
    if (cpuCenter > ballY) cpuY -= cpuSpeed;
    cpuY = Math.max(Math.min(cpuY, canvas.height - paddleHeight), 0);
  }
}

// Draw game
function draw() {
  // Background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paddles
  ctx.fillStyle = '#0ff';
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, cpuY, paddleWidth, paddleHeight);

  // Ball
  ctx.fillRect(ballX, ballY, ballSize, ballSize);

  // Scores
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('cpuScore').textContent = cpuScore;
}

// Reset ball to center
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Pause toggle
function togglePause() {
  if (!gameStarted) return;
  gamePaused = !gamePaused;
  pauseBtn.style.display = gamePaused ? 'block' : 'none';
}
