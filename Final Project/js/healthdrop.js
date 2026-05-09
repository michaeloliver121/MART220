class HealthDrop {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Sprite Sheet
        this.frameWidth = 32;
        this.frameHeight = 32;
        this.currentFrame = 0;
        this.totalFrames = 3;

        this.animationSpeed = 10; // Player and enemies are 3, but this is fine

        this.size = 32; //32x32
        this.pickedUp = false; // Starts not picked up
    }

    display() {
        let frameX = this.currentFrame * this.frameWidth;

        image(
            healthDropSpriteSheet, // SPRITE
            this.x,
            this.y,
            this.size,
            this.size,
            frameX,
            0,
            this.frameWidth,
            this.frameHeight
        );

        if (frameCount % this.animationSpeed === 0) { // Checks animation
            this.currentFrame++;

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }
    }

    checkPickup() { // Exactly what it says. Checks distance and if plater has less than 3 health
        let distance = dist(this.x, this.y, player.x, player.y);

        if (distance < 35 && player.health < 3) {

            pickupSound.play(); // Play health sound

            player.health++; // Increase health up to 3

            this.pickedUp = true; // if it's picked up, it's gone!
        }
    }
}