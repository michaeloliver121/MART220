class FruitLoop {

  constructor(x, y, size, c) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = c; // Color
  }

  display() {

    // Fruit Loop

    noStroke();
    fill(this.c);
    ellipse(this.x, this.y, this.size);

    // Fruit Loop Hole

    fill(245);
    ellipse(this.x, this.y, this.size * 0.4); // Almost half size , half size looks bad
  }
}