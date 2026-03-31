let gameStarted = false;
let startButton;

let health = 3;

let collectibles;
let particles = [];
let obstacles;

let fruitLoops = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let timerInterval;

//Animation Frame
let currentFrame = 0;
let frameDelay = 10;
let frameCounter = 0;

let hurtCooldown = 0; // Stops from getting instakilled lol


// Food Sheet Sprites
let foodSheet; // Food PNG is 128px, so each individual food item is about 16x16 based on the amount of rows
const tile = 16; // Had to look this [const] up. Apparently it helps because this value should never change since the image is going to remain unchanged itself.
const sheetC = 8; // Columns
const sheetR = 6; // Row 7 and 8 had title text so I am just not using it for now


// Character Sheet Sprites
let charSheet;
const charTile = 32; // These are 32x32 sprites instead of the 16 like the food

//Sounds
var soundBG;
var yaySound;
var ouchSound;
var pearSound;

// Idle Animation Frames
let idleSprites = [
    { col: 0, row: 0 },
    { col: 1, row: 0 }
];

// Move Animation Frame
let moveSprites = [
    { col: 1, row: 4 },
    { col: 3, row: 4 }
];


// Player Position
let playerX = 300;
let playerY = 300;
let speed = 4;


// Preload
function preload() {
    foodSheet = loadImage("images/foods.png");
    charSheet = loadImage("images/prototype_character.png");
    soundBG = loadSound('sounds/lameric.mp3');
    yaySound = loadSound("sounds/yay.mp3");
    ouchSound = loadSound("sounds/ouch.mp3");
    pearSound = loadSound("sounds/pear.mp3");
}




// Setup
function setup() {


    createCanvas(600, 600);

    startButton = createButton("Start Game"); // Thank you Intro to Web Design
    startButton.position(267, 300);
    startButton.mousePressed(startGame);


    // Creating Foods
    for (let i = 0; i < 10; i++) {
        let x = random(60, width - 60); //-60 means keeps away from edge of canvas
        let y = random(60, height - 60);
        let size = random(30, 45); // Sizing. Changed to be a bit smaller since they were way too easy to get
        let col = int(random(0, sheetC)); // Random column in image
        let row = int(random(0, sheetR)); // Random row in image

        fruitLoops.push(new FruitLoop(x, y, size, col, row, "normal"));
    }

    // GOOD MUSHROOM
    for (let i = 0; i < 2; i++) {
        let goodX = random(60, width - 60);
        let goodY = random(60, height - 60);
        fruitLoops.push(new FruitLoop(goodX, goodY, 40, 0, 7, "good"));
    }

    // BAD MUSHROOM
    for (let i = 0; i < 5; i++) {
        let badX = random(60, width - 60);
        let badY = random(60, height - 60);
        fruitLoops.push(new FruitLoop(badX, badY, 40, 1, 7, "bad"));
    }

    // Collectible Pears
    collectibles = new Group();

    for (let i = 0; i < 1; i++) {
        let c = new collectibles.Sprite(
            random(60, width - 60),
            random(60, height - 60),
            40, 40
        );

        c.addAni('spin',
            'images/pear1.png',
            'images/pear2.png',
            'images/pear4.png',
            'images/pear3.png'
        );

        c.ani = 'spin';
        c.animation.frameDelay = 10;
        c.visible = false;
        c.scale = 0.15;
    }


    // Creating Obstacles
    obstacles = new Group();

    for (let i = 0; i < 3; i++) {
        let o = new obstacles.Sprite(
            random(80, width - 80),
            random(80, height - 80),
            60,
            60
        );

        o.color = 'brown';
        o.collider = 'static';
        o.visible = false;
    }

}


// Draw
function draw() {


    background(245);

    if (!gameStarted) {

        textAlign(CENTER, CENTER);
        textSize(20);
        fill(0);
        text("PRESS SPACE TO ATTACK THE BAD MUSHROOMS", width / 2, height / 2 + 40);
        return; // Basically stops everything from running if the game hasn't started yet
    }


    // Basic UI
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Score: " + score, 20, 45);
    text("Time: " + timeLeft, 20, 20);
    drawHealthBar();

    if (hurtCooldown > 0) {
        hurtCooldown--;
    }

    // Food: Stop moving if game over
    for (let loop of fruitLoops) {
        if (!gameOver) {
            loop.update(); // New addition to let it check the position of the fruit loops
        }
        loop.display();
    }


    // Player: Stop moving if game over
    if (!gameOver) { // Now movePlayer is tied to timerInterval
        movePlayer();
    } else {
        drawPlayer(false);
    }


    // Collisions
    if (!gameOver) {
        checkCollisions();

        for (let c of collectibles) {
            let d = dist(playerX, playerY, c.x, c.y);

            if (d < 30) {
                score += 5;
                pearSound.play();
                c.x = random(60, width - 60);
                c.y = random(60, height - 60);
            }
        }
    }

    // PARTICLES
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display(); // Renders

        if (particles[i].isDead()) {
            particles.splice(i, 1); // removes the particles from the array
        }
    }


    // Game Over Pop Up
    if (gameOver) {
        textAlign(CENTER, CENTER);
        textSize(60);
        fill(0);

        let allGone = true;
        for (let loop of fruitLoops) {
            if (loop.type === "bad" && loop.alive) {
                allGone = false;
                break;
            }
        }

        if (health <= 0) {
            text("YOU LOSE", width / 2, height / 2);
        } else if (allGone) {
            text("YOU WIN!", width / 2, height / 2);
        } else if (timeLeft === 0) {
            text("RAN OUT OF TIME!", width / 2, height / 2);
        }
    }

}

function startGame() {
    gameStarted = true;
    startButton.hide();
    for (let c of collectibles) {
        c.visible = true;
    }
    for (let o of obstacles) {
        o.visible = true;
    }

    // Timer
    timerInterval = setInterval(function () {

        if (!gameOver) {
            timeLeft--;

            if (timeLeft <= 0) {
                timeLeft = 0;
                gameOver = true;
                clearInterval(timerInterval); // Completely stop the timer
            }
        }

    }, 1000); // This makes it run every one second. Got caught up on this because it looked so weird, but basically it's just a part of the setInterval function and is equal to 1 sec or 1000 milliseconds.

    if (!soundBG.isPlaying()) {
        soundBG.loop();
    }
}



// Player Movement - Arrow keys!
function movePlayer() {

    let moving = false;
    let oldX = playerX;
    let oldY = playerY;

    if (keyIsDown(LEFT_ARROW)) {
        playerX -= speed;
        moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        playerX += speed;
        moving = true;
    }
    if (keyIsDown(UP_ARROW)) {
        playerY -= speed;
        moving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        playerY += speed;
        moving = true;
    }

    // Keep player on canvas | 16x16px
    playerX = constrain(playerX, 16, width - 16);
    playerY = constrain(playerY, 16, height - 16);

    // Obstacle Collisions
    for (let o of obstacles) {
        let d = dist(playerX, playerY, o.x, o.y);

        if (d < 40) { // tweak this if needed
            playerX = oldX;
            playerY = oldY;
        }
    }


    // Frame Checker Part
    frameCounter++;

    if (frameCounter > frameDelay) { // Basically what I said above. If Frame Counter goes past the 10 value, it does the animation below.
        frameCounter = 0;
        currentFrame++;
    }

    if (currentFrame >= 2) {
        currentFrame = 0;
    }

    drawPlayer(moving);
}


function drawPlayer(moving) {
    imageMode(CENTER);

    let frame;

    if (moving) {
        frame = moveSprites[currentFrame];
    } else {
        frame = idleSprites[currentFrame];
    }

    image( // Losing my mind with this one lol. It's (img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight)... Basically (what image, what x, what y, width, height, CROP X, CROP Y, CROP width, CROP height)
        charSheet,
        playerX, playerY,                 // Where the player is being drawn
        64, 64,                           // This is double the size since the sprite is way too small on the canvas
        frame.col * charTile, frame.row * charTile, // Basucally segments out the image based on the charTile size of 32. Where does the cropping start! Luckily seems like sprite sheets are set up properly for this to be easy maths
        charTile, charTile // This is the same as the sprite size, so I could eben just put 32 here
    );

    imageMode(CORNER);
}


// Collisions | Just moved down what I had before into its own function
function checkCollisions() {
    for (let loop of fruitLoops) {
        if (!loop.alive) continue;
        let d = dist(playerX, playerY, loop.x, loop.y);

        if (d < 20 + loop.size / 2) { // 32 distance was way too lenient points-wise
            if (loop.type === "good") {
                score += 2; // Get 2 points if you get the GOOD MUSHROOM
                yaySound.play();
                loop.respawn();

            } else if (loop.type === "bad") {
                if (hurtCooldown <= 0) { // Check if hurt cooldown is over
                    health--; // Lose 1 point of health if you get the BAD MUSHROOM
                    ouchSound.play();
                    hurtCooldown = 60; // 60 frames so you get a second pf invincibiility
                }

                if (health <= 0) { // Simple end game health part
                    health = 0;
                    gameOver = true;
                    clearInterval(timerInterval);
                }
            } else {
                score += 1; // Only get 1 point for all other fruit/veggies
                loop.respawn();
            }
        }
    }
}



function drawHealthBar() {

    let barW = 30;
    let barH = 20;

    let barX = width - 120;
    let barY = 20;

    textSize(20);
    fill(0);
    noStroke();
    textAlign(RIGHT, TOP);
    text("Health:", width - 20, barY);

    for (let i = 0; i < 3; i++) {

        if (i < health) {
            fill(0, 200, 0); // Green Healh
        } else {
            fill(220); // Greys out if you get hurt
        }

        rect(barX + i * 35, barY + 25, barW, barH);
    }
}



function attackBadFruit() {
    for (let loop of fruitLoops) {
        if (loop.type !== "bad" || !loop.alive) continue;

        let d = dist(playerX, playerY, loop.x, loop.y);

        if (d < 60) {
            loop.takeDamage(1);
            ouchSound.play();

            for (let i = 0; i < 12; i++) {
                particles.push(new Particle(loop.x, loop.y));
            }

            break;
        }
    }
    checkBadFruitWin(); // Checks the amount of bad fruit left (function)
}



function keyPressed() {
    if (!gameOver && gameStarted && key === ' ') { // SPACE
        attackBadFruit();
    }
}



function checkBadFruitWin() {
    let allGone = true;

    for (let loop of fruitLoops) {
        if (loop.type === "bad" && loop.alive) {
            allGone = false;
            break;
        }
    }

    if (allGone) {
        gameOver = true;
        clearInterval(timerInterval);
    }
}






// PARTICLES | Easier rn to just keep it here instead of in its own js file.

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);
        this.size = random(4, 8);
        this.life = 30;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    display() {
        noStroke();
        fill(255, 100, 0, this.life * 8);
        ellipse(this.x, this.y, this.size);
    }

    isDead() {
        return this.life <= 0;
    }
}