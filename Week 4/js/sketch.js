let tacoImg;
let sushiImg;
let chatImg;
let chaty = 250;
let step = 250;

function preload(){
    tacoImg = loadImage('images/bigbeantz.jpeg');
    chatImg = loadImage('images/chatgpt.png');
    sushiImg = loadImage('images/sushi.jpeg');
    theFont = loadFont('assets/CSSanford.otf');

}

function setup(){
    createCanvas(750,750);
    setInterval(updown, 3000);

 }


 function draw(){
    background(25);

    image(tacoImg, 0, 500, 250, 250);
    image(chatImg, 250, chaty, 250, 250);
    image(sushiImg, 500, 0, 250, 250);

    textFont(theFont);
    textSize(64);
    fill(255);
    text('Guisadas', 35, 475);
    text('Sushi', 575, 325);
 }

function updown(){

    chaty += step;

    if (chaty <= 0 || chaty >= height - 250){
        step *= -1; // I had to look this one up, but seemed helpful for this since it basically automatically switches based on canvas size if I'm learning correctly.
    }
}