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


        var ball = {
            radius: 0.5,
            pos: { x: 0.2, y: 0.2 },
            vel: { x: 10.0, y: 15.0 },
            savedPos: {x: 0, y: 0} //For saving position before mouse is held to program momentum
        }

		var sprite = new Image();
        sprite.src = 'ball.png';

		var justHeld

        // Mouse functionality added here --------------------------------

        function updatePosition(event) {
            var rect = canvas.getBoundingClientRect();
            ball.pos.x = (event.clientX - rect.left) / cScale;
            ball.pos.y = (canvas.height - (event.clientY - rect.top)) / cScale;
            ball.vel.x = 0;
            ball.vel.y = 0;
            isMouseDown = true;
        }

            // For programming momentum -----------------------------------
           

        function updatePosition(event) {
            var rect = canvas.getBoundingClientRect();
            ball.pos.x = (event.clientX - rect.left) / cScale;
            ball.pos.y = (canvas.height - (event.clientY - rect.top)) / cScale;

            // Store initial position only when mouse is pressed
            if (!isMouseDown) {
                initialPos.x = ball.pos.x;
                initialPos.y = ball.pos.y;
            }

            else; {isMouseDown = true;}
        }


        function releaseMouse(event) {
            isMouseDown = false;

            // Capture the final position when the mouse is released
            var rect = canvas.getBoundingClientRect();
            var finalPos = {
                x: (event.clientX - rect.left) / cScale,
                y: (canvas.height - (event.clientY - rect.top)) / cScale
            };

            // Calculate velocity based on drag distance
            ball.vel.x = (finalPos.x - initialPos.x) * 10; // Scale factor for velocity
            ball.vel.y = (finalPos.y - initialPos.y) * 10;
        }

        // Event listeners
        canvas.addEventListener('mousedown', updatePosition);
        canvas.addEventListener('mousemove', function (event) {
            if (isMouseDown) {
                updatePosition(event);
                ball.vel.x = 0
                ball.vel.y = 0
            }
        });
        canvas.addEventListener('mouseup', releaseMouse);


        // drawing -------------------------------------------------------

        function draw() {
            c.clearRect(0, 0, canvas.width, canvas.height);

            c.fillStyle = "#FF0000";

            c.beginPath();
            c.arc(
                cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0.0, 2.0 * Math.PI);
            c.closePath();
            c.fill();

			if (sprite.complete) { // Ensure the image is fully loaded before drawing
                const spriteWidth = cScale * 2 * ball.radius; // Scale the sprite to match the ball size
                const spriteHeight = spriteWidth * (sprite.height / sprite.width); // Maintain aspect ratio
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
            momentum();
            
            if (isMouseDown == true) { //So ball stays still when mouse is held
                ball.vel.x = 0
                ball.vel.y = 0
        };
        }

        update();
