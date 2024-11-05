function cX(pos) {
    return pos.x * cScale;
}

function cY(pos) {
    return canvas.height - pos.y * cScale;
}

// scene -------------------------------------------------------
var gravity = { x: 0.0, y: -10.0 };
var timeStep = 1.0 / 60.0;
var isMouseDown = false;
var initialPos = { x: 0, y: 0 };

var ball = {
    radius: 0.5,
    pos: { x: 0.2, y: 0.2 },
    vel: { x: 10.0, y: 15.0 }
}

var sprite = new Image();
sprite.src = 'ball.png';

// Mouse functionality added here --------------------------------

function updatePosition(event) {
    var rect = canvas.getBoundingClientRect();
    ball.pos.x = (event.clientX - rect.left) / cScale;
    ball.pos.y = (canvas.height - (event.clientY - rect.top)) / cScale;

    if (!isMouseDown) {
        initialPos.x = ball.pos.x;
        initialPos.y = ball.pos.y;
    }
    isMouseDown = true;
}

function releaseMouse(event) {
    isMouseDown = false;
    var rect = canvas.getBoundingClientRect();
    var finalPos = {
        x: (event.clientX - rect.left) / cScale,
        y: (canvas.height - (event.clientY - rect.top)) / cScale
    };

    ball.vel.x = (finalPos.x - initialPos.x) * 5; // Scale factor for velocity
    ball.vel.y = (finalPos.y - initialPos.y) * 5;
}

// Event listeners
canvas.addEventListener('mousedown', updatePosition);
canvas.addEventListener('mousemove', function (event) {
    if (isMouseDown) {
        updatePosition(event);
    }
});
canvas.addEventListener('mouseup', releaseMouse);

// drawing -------------------------------------------------------
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#FF0000";
    c.beginPath();
    c.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
    c.closePath();
    c.fill();

    if (sprite.complete) {
        const spriteWidth = cScale * 2 * ball.radius;
        const spriteHeight = spriteWidth * (sprite.height / sprite.width);
        c.drawImage(sprite, cX(ball.pos) - spriteWidth / 2, cY(ball.pos) - spriteHeight / 2, spriteWidth, spriteHeight);
    }
}

// simulation ----------------------------------------------------
function simulate() {
    if (!isMouseDown) {
        ball.vel.x += gravity.x * timeStep;
        ball.vel.y += gravity.y * timeStep;
        ball.pos.x += ball.vel.x * timeStep;
        ball.pos.y += ball.vel.y * timeStep;

        if (ball.pos.x < 0.0) {
            ball.pos.x = 0.0;
            ball.vel.x = -ball.vel.x - 1;
        }
        if (ball.pos.x > simWidth) {
            ball.pos.x = simWidth;
            ball.vel.x = -ball.vel.x + 1;
        }
        if (ball.pos.y < 0.0) {
            ball.pos.y = 0.0;
            ball.vel.y = -ball.vel.y;
            gravity.y = gravity.y - 2;
        }
    }
}

// make browser call us repeatedly -----------------------------------
function update() {
    simulate();
    draw();
    requestAnimationFrame(update);
}

update();
