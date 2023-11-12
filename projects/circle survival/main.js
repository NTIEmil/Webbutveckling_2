var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var projectileSpeed = 5;
var playerMaxSpeed = 5;
var MovingObject = /** @class */ (function () {
    function MovingObject(x, y, radius, colour, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity;
    }
    MovingObject.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.colour;
        ctx.fill();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    return MovingObject;
}());
var player = new MovingObject(centerX, centerY, 10, "white", { x: 0, y: 0 });
var projectiles = [];
var enemies = [];
// let particles: Particle[] = [];
var pressedKeys = [];
function projectilesOffScreen() {
    projectiles.forEach(function (projectile, projectileIndex) {
        projectile.draw();
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(function () {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });
}
function playerKeyboardInput() {
    var moveUp = pressedKeys.includes("w") || pressedKeys.includes("ArrowUp");
    var moveDown = pressedKeys.includes("s") || pressedKeys.includes("ArrowDown");
    var moveLeft = pressedKeys.includes("a") || pressedKeys.includes("ArrowLeft");
    var moveRight = pressedKeys.includes("d") || pressedKeys.includes("ArrowRight");
    if (moveUp && !moveDown) {
        player.velocity.y = -playerMaxSpeed;
    }
    else if (!moveUp && moveDown) {
        player.velocity.y = playerMaxSpeed;
    }
    else {
        player.velocity.y = 0;
    }
    if (moveLeft && !moveRight) {
        player.velocity.x = -playerMaxSpeed;
    }
    else if (!moveLeft && moveRight) {
        player.velocity.x = playerMaxSpeed;
    }
    else {
        player.velocity.x = 0;
    }
}
var animationID;
function animate() {
    animationID = requestAnimationFrame(animate);
    playerKeyboardInput();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectilesOffScreen();
    console.log(pressedKeys);
}
function createProjectile(event) {
    var angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    var velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed,
    };
    projectiles.push(new MovingObject(player.x, player.y, 5, "white", velocity));
}
addEventListener("click", createProjectile);
addEventListener("keydown", function (event) {
    if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key);
    }
});
addEventListener("keyup", function (event) {
    return pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
});
animate();
