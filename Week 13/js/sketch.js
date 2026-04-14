let mammoth;
let iceTextures = [];
let icicles = [];

function preload() {
    font = loadFont('assets/Metamorphous-Regular.ttf');
    mammoth = loadModel('assets/mammoth.obj', true);
    iceTextures[0] = loadImage('assets/ice1.jpg');
    iceTextures[1] = loadImage('assets/ice2.jpg');
    iceTextures[2] = loadImage('assets/ice3.jpg');
    iceTextures[3] = loadImage('assets/ice4.jpg');
    iceTextures[4] = loadImage('assets/ice5.jpg');
}

function setup() {
    createCanvas(800, 800, WEBGL);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(32);

    icicles[0] = { x: 220, y: 60, z: 0, tex: iceTextures[0], speed: 0.01 };
    icicles[1] = { x: -220, y: 60, z: 0, tex: iceTextures[1], speed: 0.005 };
    icicles[2] = { x: 0, y: 60, z: 220, tex: iceTextures[2], speed: 0.02 };
    icicles[3] = { x: 0, y: 60, z: -220, tex: iceTextures[3], speed: 0.04 };
    icicles[4] = { x: 150, y: -60, z: 150, tex: iceTextures[4], speed: 0.03 };
}

function draw() {
    background(150);
    ambientLight(50);
    directionalLight(255, 255, 255, 0, 0, -1);

    // Project Name
    push();
    translate(0, -350, 0);
    fill(255);
    text("Mammoth Casts Ice Spike!", 0, 0);
    pop();


    // My Name
    push();
    translate(0, -300, 0);
    fill(255);
    textSize(20);
    text("Michael Oliver", 0, 0);
    pop();

    //Mammoth
    push();
    rotateX(PI); // Flips the model. Took way too long to figure out
    rotateY(frameCount * 0.005);
    normalMaterial();
    scale(2);
    model(mammoth);
    pop();


    // Icicles + Loop
    for (let i = 0; i < icicles.length; i++) {
        push();
        rotateY(frameCount * icicles[i].speed);
        translate(icicles[i].x, icicles[i].y, icicles[i].z);
        rotateX(frameCount * icicles[i].speed);
        rotateY(frameCount * icicles[i].speed);
        noStroke();
        specularMaterial(255);
        texture(icicles[i].tex);
        cone(40, 70);
        pop();
    }
}

function mousePressed() {
    let a = int(random(icicles.length));
    let b = int(random(icicles.length));

    while (b === a) {
        b = int(random(icicles.length));
    }

    icicles[a].x = random(-250, 250);
    icicles[a].y = random(-150, 150);
    icicles[a].z = random(-250, 250);

    icicles[b].x = random(-250, 250);
    icicles[b].y = random(-150, 150);
    icicles[b].z = random(-250, 250);
}