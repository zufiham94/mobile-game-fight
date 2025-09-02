const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load characters
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

// Characters
const player = {
  x: 150,
  y: 320,
  width: 100,
  height: 150,
  health: 100,
  attack: false,
  color: "#00eaff",
  isMovingLeft: false,
  isMovingRight: false
};

const enemy = {
  x: 750,
  y: 320,
  width: 100,
  height: 150,
  health: 100,
  attack: false,
  color: "#ff4f81",
  isMovingLeft: false,
  isMovingRight: false
};

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Health Bars
  ctx.fillStyle = "#222";
  ctx.fillRect(40, 20, 400, 25);
  ctx.fillRect(560, 20, 400, 25);

  ctx.fillStyle = player.color;
  ctx.fillRect(40, 20, player.health * 4, 25);

  ctx.fillStyle = enemy.color;
  ctx.fillRect(960 - enemy.health * 4, 20, enemy.health * 4, 25);

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Enemy
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // Attack effects
  if (player.attack) {
    ctx.fillStyle = "rgba(0,234,255,0.3)";
    ctx.fillRect(player.x + player.width, player.y, 40, player.height);
  }
  if (enemy.attack) {
    ctx.fillStyle = "rgba(255,79,129,0.3)";
    ctx.fillRect(enemy.x - 40, enemy.y, 40, enemy.height);
  }
}

// Collision
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Update
function update() {
  if (player.isMovingLeft) player.x -= 5;
  if (player.isMovingRight) player.x += 5;
  if (enemy.isMovingLeft) enemy.x -= 5;
  if (enemy.isMovingRight) enemy.x += 5;

  if (player.attack && isColliding(player, enemy)) {
    enemy.health = Math.max(0, enemy.health - 1);
  }
  if (enemy.attack && isColliding(enemy, player)) {
    player.health = Math.max(0, player.health - 1);
  }

  if (player.health <= 0 || enemy.health <= 0) {
    setTimeout(() => {
      alert(player.health <= 0 ? "Enemy Wins!" : "Player Wins!");
      player.health = 100;
      enemy.health = 100;
    }, 100);
  }
}

// Touch Controls
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touches = e.touches;

  for (let i = 0; i < touches.length; i++) {
    const touchX = touches[i].clientX;
    const touchY = touches[i].clientY;

    // Player 1 (Left side of screen)
    if (touchX < canvas.width / 2) {
      if (touchY > canvas.height / 2) {
        player.isMovingRight = true;
        player.isMovingLeft = false;
      } else {
        player.isMovingLeft = true;
        player.isMovingRight = false;
      }
      player.attack = true;
    }

    // Player 2 (Right side of screen)
    if (touchX > canvas.width / 2) {
      if (touchY > canvas.height / 2) {
        enemy.isMovingRight = true;
        enemy.isMovingLeft = false;
      } else {
        enemy.isMovingLeft = true;
        enemy.isMovingRight = false;
      }
      enemy.attack = true;
    }
  }
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  player.isMovingLeft = false;
  player.isMovingRight = false;
  enemy.isMovingLeft = false;
  enemy.isMovingRight = false;
  player.attack = false;
  enemy.attack = false;
});

// Game loop
function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();