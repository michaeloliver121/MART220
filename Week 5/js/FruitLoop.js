class FruitLoop { // Keeping this as Fruit Loop for my own sanity

  constructor(x, y, size, col, row) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
    this.row = row;

    this.moveTimer = int(random(180, 300)); // 60 frames is equal to 1 second in this scenario, so this is 3-5 second interval
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

    this.col = int(random(0, sheetC));
    this.row = int(random(0, sheetR));

  }
}