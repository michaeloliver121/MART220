let fruitLoops = [];

// Boat Position

let boatX = 300;
let boatY = 300;
let speed = 3;

// Boat Frames

let idleFrames = [0, 2, 0, -2];   // Bobbing less when not moving
let moveFrames = [0, 5, 0, -5];   // Bobbing more when moving

// Animation

let currentFrame = 0;
let frameDelay = 10; // If 10 frames go by, move forward pretty much. If not, do nothing
let frameCounter = 0;

// Setup

function setup() {
    createCanvas(600, 600);

    // Creating Fruit Loops

    for (let i = 0; i < 10; i++) {
        let x = random(60, width - 60); //-60 means keeps away from edge of canvas
        let y = random(60, height - 60);
        let size = random(40, 70);
        let c = color(random(190, 240), random(140, 200), random(100, 160));

        fruitLoops.push(new FruitLoop(x, y, size, c));
    }
}

// Draw

function draw() {

    background(245);

    for (let loop of fruitLoops) { // Had to look this up. Very confusing for me, but after some digging it does make sense.

        loop.display();
    }

    moveBoat();
}

// Boat Movement

function moveBoat() {

    let moving = false;

    if (keyIsDown(LEFT_ARROW)) {
        boatX -= speed;
        moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        boatX += speed;
        moving = true;
    }
    if (keyIsDown(UP_ARROW)) {
        boatY -= speed;
        moving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        boatY += speed;
        moving = true;
    }

    // Frame Checker Part

    frameCounter++;

    if (frameCounter > frameDelay) { // Basically what I said above. If Frame Counter goes past the 10 value, it does the animation below.
        frameCounter = 0;
        currentFrame++;

        // Animation Loop

        if (moving) {
            if (currentFrame >= moveFrames.length) { // Basically this is checking my variables up top to see if the LENGTH moves past its value of 4. If it does, it resets back to zero.
                currentFrame = 0;
            }
        } else {
            if (currentFrame >= idleFrames.length) {
                currentFrame = 0;
            }
        }
    }

    // Actual Animation Itself

    let bob; // Water (Milk) Bobbing

    if (moving) {
        bob = moveFrames[currentFrame]; // Basically whatever frame is being loaded in the array is going to be the one effecting the boat.
    } else {
        bob = idleFrames[currentFrame]; // Switch from move to idle is dependent on the above variables, so it choooses either value based on its current state.
    }

    // Actual Function to Draw the Boat

    drawBoat(bob, moving);
}


// Drawing the Boat

function drawBoat(bob, moving) {

    // Adding a Wake if Boat is Moving

    if (moving) {
        stroke(200); // Lighter gray color because Milk
        line(boatX - 25, boatY, boatX - 40, boatY);
    }

    // Boat

    noStroke();
    fill(180); // Gray Boat
    ellipse(boatX, boatY + bob, 50, 25); // BoatY + Bob is there to work with the animation. Adding Bob to the Y makes it function properly.
}