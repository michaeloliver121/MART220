let font;

function preload() {
    font = loadFont('font/Metamorphous-Regular.ttf');
}

function setup() {
    createCanvas(800, 800, WEBGL);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(32);
}

function draw() {
    background(10);
    ambientLight(60);
    directionalLight(255, 255, 255, 1, 1, 0);


    // Project Name
    push();
    translate(0, -350, 0);
    fill(255);
    text("Solar System", 0, 0);
    pop();


    // My Name
    push();
    translate(0, -300, 0);
    fill(255);
    textSize(20);
    text("Michael Oliver", 0, 0);
    pop();


    // Sun Sphere
    push();
    rotateY(frameCount * 0.01);
    ambientMaterial(255, 180, 50);
    sphere(100);
    pop();


    // Planet Sphere
    push();
    translate(260, -240, -200);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    normalMaterial();
    sphere(35);
    pop();


    // Planet 2 Sphere
    push();
    translate(-280, -80, -50);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    specularMaterial(100, 150, 255);
    sphere(50);
    pop();


    // Ringed planet
    push();
    translate(-200, 250, -100);
    rotateY(frameCount * 0.01);
    // Planet Sphere
    push();
    ambientMaterial(180, 120, 255);
    sphere(50);
    pop();
    // Ring Torus
    push();
    rotateX(frameCount * 0.01);
    ambientMaterial(255, 255, 255);
    torus(80, 8);
    pop();

    pop();

    // Rocket/Satellite/Looks a litte wierd lol (Box, Cylinder, Cone)
    push();
    translate(160, 150, 200);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.01);
    // Body
    push();
    ambientMaterial(220, 220, 230);
    cylinder(20, 90);
    pop();
    // Rocket Thruster
    push();
    translate(0, -55, 0);
    specularMaterial(255, 80, 80);
    cone(20, 40);
    pop();
    // Wing 1
    push();
    translate(-18, 25, 0);
    specularMaterial(100, 180, 255);
    box(25, 25, 30);
    pop();
    // Wing 2
    push();
    translate(18, 25, 0);
    specularMaterial(100, 180, 255);
    box(25, 25, 30);
    pop();

    pop();

}
