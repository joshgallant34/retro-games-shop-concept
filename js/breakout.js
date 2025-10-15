const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 8;
let x = canvas.width/2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 15;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let rightPressed = false;
let leftPressed = false;
let gameStarted = false;
let gamePaused = false;
let score = 0;

// Create bricks
let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(let r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 = visible
  }
}

// Event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if(e.key === "ArrowRight") rightPressed = true;
  if(e.key === "ArrowLeft") leftPressed = true;
  if(e.code === "Space") togglePause();
}

function keyUpHandler(e) {
  if(e.key === "ArrowRight") rightPressed = false;
  if(e.key === "ArrowLeft") leftPressed = false;
}

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  gameStarted = true;
  requestAnimationFrame(draw);
});

// Pause toggle
function togglePause() {
  if (!gameStarted) return;
  gamePaused = !gamePaused;
  pauseBtn.style.display = gamePaused ? 'inline-block' : 'none';
  if (!gamePaused) requestAnimationFrame(draw);
}

// Draw functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0ff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0ff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status === 1) {
        let brickX = c*(brickWidth+brickPadding) + brickOffsetLeft;
        let brickY = r*(brickHeight+brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#f0f";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  document.getElementById("score").textContent = score;
}

function collisionDetection() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status === 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
        }
      }
    }
  }
}

// Draw everything
function draw() {
  if(gamePaused) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Ball movement
x += dx;
y += dy;

// Left/right walls
if (x + ballRadius > canvas.width || x - ballRadius < 0) {
    dx = -dx;
}

// Top wall
if (y - ballRadius < 0) {
    dy = -dy;
}

// Bottom (paddle) collision
if (y + ballRadius > canvas.height - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy; // bounce off paddle
    } else {
        // Missed paddle
        // Instead of alert, you can reset game smoothly
        alert("GAME OVER");
      document.location.reload();
}}


  // Paddle movement
const paddleSpeed = 3;

if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
if(leftPressed && paddleX > 0) paddleX -= paddleSpeed;

  requestAnimationFrame(draw);
}
