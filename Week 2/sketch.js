 function setup()
    {
        createCanvas(500,500);
    }

function draw() {
    // Drawing the map "parchment" and border
  background(112,66,20);
  fill(210,180,140);
  square(15,15,470);
  fill(100,0,0);
  triangle(0,0,0,50,50,0);
  triangle(500,0,450,0,500,50);
  triangle(0,500,0,450,50,500);
  triangle(500,500,450,500,500,450);

  //Water
  fill(187,228,228);
  circle(250,250,450);
  fill(207,248,248);
  circle(250,250,425);
  fill(147,188,188);
  text('Ocean of Coding',90,380);
  
  //Coastline
  noStroke();
  fill(250,250,255,150);
  circle(200,250,215);
  circle(275,150,115);
  circle(250,350,115);
  circle(325,300,190);

  //Beaches
  fill(246,220,189);
  circle(200,250,200);
  circle(275,150,100);
  circle(250,350,100);
  circle(325,300,175);

  //Landmass
  fill(129,134,74);
  circle(200,250,190);
  circle(275,150,90);
  circle(250,350,90);
  circle(325,300,165);

  //BIG MOUNTAIN
  fill(75,75,75);
  triangle(200,250,150,250,175,200);
  text('Mount Java', 145, 190);
  fill(250,250,250);
  triangle(188,225,162,225,175,200);

  //Forests
  fill(95,125,40);
  circle(250,250,25);
  circle(225,225,40);
  circle(200,275,30);
  circle(150,270,25);
  circle(275,350,25);
  circle(325,300,75);
  circle(275,150,50);
  fill(35,65,0);
  text('Creative Forest',233, 155);

  //Lake
  fill(187,228,228);
  circle(250,300,50);
  text('Lake Script', 220,340);

  //Settlement & Name
  fill(0,50,255);
  square(325,205,25);
  text('Assignment Town',290,245);

  fill(0);
  text('Map of MART220 Island', 25,38);

  //Why did I do this to myself lol
}