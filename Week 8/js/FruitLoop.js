class FruitLoop { // Keeping this as Fruit Loop for my own sanity

  constructor(x, y, size, col, row, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
    this.row = row;
    this.type = type; // Good, Bad, or Normal fruit

    this.moveTimer = int(random(300, 720)); // 60 frames is equal to 1 second in this scenario, so this is 5-7 interval
  }

  display() {

    imageMode(CENTER); // This is easier than writing the whole / 2 stuff below

    image(
      foodSheet,
      this.x, this.y,                 // Position on canvas
      this.size, this.size,           // Size on the canvas
      this.col * tile, this.row * tile, // The part of the grid on the source image so basically ends up calling a random number in that sprite sheet
      tile, tile                      // Size of the source tile. In this case I think it would remain
    );

    if (this.type === "good") {
      stroke(0, 255, 0);   // Green outline around the good mushroom for better visibility
      strokeWeight(3);
      noFill();
      ellipse(this.x, this.y, this.size + 12);
      noStroke();
    }

    if (this.type === "bad") {
      stroke(255, 0, 0);   // Red outline around the good mushroom for better visibility
      strokeWeight(3);
      noFill();
      ellipse(this.x, this.y, this.size + 12);
      noStroke();
    }

  }

  update() {

    this.moveTimer--; // moveTimer is counting down

    if (this.moveTimer <= 0) { // if it reaches 0 seconds, it randomly adjusts position
      this.x = random(60, width - 60);
      this.y = random(60, height - 60);

      this.moveTimer = int(random(60, 180)); // Basically rests to a random value
    }
  }

  respawn() {
    this.x = random(60, width - 60);
    this.y = random(60, height - 60);

    // This changes the food to be another random choice now!

    if (this.type === "good") {
      this.col = 0;
      this.row = 7;
      this.size = 40;
    } else if (this.type === "bad") {
      this.col = 1;
      this.row = 7;
      this.size = 40;
    } else {
      this.col = int(random(0, sheetC));
      this.row = int(random(0, sheetR));
      this.size = random(30, 45);
    }
  }

}
