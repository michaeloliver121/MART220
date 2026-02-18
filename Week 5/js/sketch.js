//After changing the color, apparently I created Fruit Loops instead of Bagels, so we're going to roll with it even if my variables are still called Bagels..

let bagelX = [];
let bagelY = [];
let bagelColor = [];

function setup() {
    createCanvas(600,600);

    for (let i = 0; i < 30; i++) {
        bagelX[i] = random(60, width - 50);
        bagelY[i] = random(60, height - 50)
        bagelColor[i] = color(random(190,240), random(140,200), random(100,160)); //Was going for toasty, but apparently I created Fruit Loops
    }
}

function draw() {
    background(245); //Changed to Milk

    for (let i = 0; i < bagelX.length; i++) {
    drawBagel(bagelX[i], bagelY[i], bagelColor[i]);
    }
}

function drawBagel(x, y, bagelColor) {

    // I think this is correct baseline for some sort of milk ripple effect animation, but honestly I am unsure. Obviously it isn't moving or anything yet.
    for (let i = 0; i < 2; i++) {
    noFill();
    stroke(230);
    ellipse(x, y, 60 + i * 10);
    }

    fill (bagelColor);
    noStroke();
    ellipse(x, y, 50, 50); //Bagel/Fruit Loop

    fill(255);
    ellipse(x, y, 20, 20);  //Bagel/Fruit Loop Hole
}