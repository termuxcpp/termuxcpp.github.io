const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");

const paddleWidth = 14;
const paddleHeight = 110;
const paddleSpeed = 7;
const ballRadius = 9;
const maxBallSpeed = 11;

const state = {
  playerScore: 0,
  computerScore: 0,
  keys: {
    ArrowUp: false,
    ArrowDown: false,
  },
  mouseY: canvas.height / 2,
};

const leftPaddle = {
  x: 30,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: paddleSpeed,
};

const rightPaddle = {
  x: canvas.width - 30 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  vx: 5,
  vy: 3,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetBall(direction = 1) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  const angle = (Math.random() * 1.2 - 0.6);
  const speed = 5;

  ball.vx = direction * speed * Math.cos(angle);
  ball.vy = speed * Math.sin(angle);
}

function updateScore() {
  playerScoreEl.textContent = state.playerScore;
  computerScoreEl.textContent = state.computerScore;
}

function moveLeftPaddle() {
  let targetY = state.mouseY - leftPaddle.height / 2;

  if (state.keys.ArrowUp) targetY -= 20;
  if (state.keys.ArrowDown) targetY += 20;

  leftPaddle.y = clamp(targetY, 0, canvas.height - leftPaddle.height);
}

function moveComputerPaddle() {
  const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
  const targetY = ball.y - rightPaddle.height / 2;
  const difference = targetY - paddleCenter;

  if (Math.abs(difference) > 3) {
    rightPaddle.y += Math.sign(difference) * rightPaddle.speed;
  }

  rightPaddle.y = clamp(rightPaddle.y, 0, canvas.height - rightPaddle.height);
}

function checkWallCollision() {
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }

  if (ball.y + ball.radius >= canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= -1;
  }
}

function checkPaddleCollision() {
  const leftCollision =
    ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
    ball.x + ball.radius >= leftPaddle.x &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height;

  if (leftCollision) {
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    const impact = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
    ball.vx = Math.abs(ball.vx) + 0.4;
    ball.vy = impact * 5;
    if (Math.abs(ball.vx) > maxBallSpeed) {
      ball.vx = maxBallSpeed;
    }
  }

  const rightCollision =
    ball.x + ball.radius >= rightPaddle.x &&
    ball.x - ball.radius <= rightPaddle.x + rightPaddle.width &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height;

  if (rightCollision) {
    ball.x = rightPaddle.x - ball.radius;
    const impact = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
    ball.vx = -(Math.abs(ball.vx) + 0.4);
    ball.vy = impact * 5;
    if (Math.abs(ball.vx) > maxBallSpeed) {
      ball.vx = -maxBallSpeed;
    }
  }
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius <= 0) {
    state.computerScore += 1;
    updateScore();
    resetBall(1);
  }

  if (ball.x + ball.radius >= canvas.width) {
    state.playerScore += 1;
    updateScore();
    resetBall(-1);
  }

  checkWallCollision();
  checkPaddleCollision();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddle(paddle) {
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#facc15";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  drawBackground();
  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();
}

function gameLoop() {
  moveLeftPaddle();
  moveComputerPaddle();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") state.keys.ArrowUp = true;
  if (event.key === "ArrowDown") state.keys.ArrowDown = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") state.keys.ArrowUp = false;
  if (event.key === "ArrowDown") state.keys.ArrowDown = false;
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const relativeY = event.clientY - rect.top;
  state.mouseY = clamp(relativeY, 0, canvas.height);
});

updateScore();
resetBall(1);
requestAnimationFrame(gameLoop);
