let fruitLoops = [];
let score = 0;
let timeLeft = 30;
let gameOver = false;
let timerInterval;

//Animation Frame
let currentFrame = 0;
let frameDelay = 10;
let frameCounter = 0;


// Food Sheet Sprites
let foodSheet; // Food PNG is 128px, so each individual food item is about 16x16 based on the amount of rows
const tile = 16; // Had to look this [const] up. Apparently it helps because this value should never change since the image is going to remain unchanged itself.
const sheetC = 8; // Columns
const sheetR = 6; // Row 7 and 8 had title text so I am just not using it for now


// Character Sheet Sprites
let charSheet;
const charTile = 32; // These are 32x32 sprites instead of the 16 like the food

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


// Image Preload
function preload() {
    foodSheet = loadImage("images/foods.png");
    charSheet = loadImage("images/prototype_character.png");
}


// Setup
function setup() {


    createCanvas(600, 600);


    // Creating Foods
    for (let i = 0; i < 10; i++) {
        let x = random(60, width - 60); //-60 means keeps away from edge of canvas
        let y = random(60, height - 60);
        let size = random(30, 45); // Sizing. Changed to be a bit smaller since they were way too easy to get
        let col = int(random(0, sheetC)); // Random column in image
        let row = int(random(0, sheetR)); // Random row in image

        fruitLoops.push(new FruitLoop(x, y, size, col, row));
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

}


// Draw
function draw() {


    background(245);


    // Basic UI
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Score: " + score, 20, 45);
    text("Time: " + timeLeft, 20, 20);


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
    }


    // Game Over Pop Up
    if (gameOver) {
        textAlign(CENTER, CENTER);
        textSize(60);
        fill(0);
        text("GAME OVER", width / 2, height / 2); // Right in the Middle
    }
}



// Player Movement - Arrow keys!
function movePlayer() {

    let moving = false;

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
        let d = dist(playerX, playerY, loop.x, loop.y);

        if (d < 32 + loop.size / 2) { // Player sprite halved from the size I made it above
            score++;
            loop.respawn();
        }
    }
}


// Thank god for Shift + Alt + F