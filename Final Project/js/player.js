class Player {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Sprite Sheet
        this.frameWidth = 96;
        this.frameHeight = 96;
        this.currentFrame = 0;
        this.animationSpeed = 3; // 3 is fast, but it works well
        this.idleFrames = 10;
        this.runFrames = 16;
        this.attackFrames = 7;

        // Movement
        this.speed = 3;
        this.moving = false;
        this.facingRight = true;

        // Attacking
        this.attacking = false;
        this.attackHit = false;

        //Health & Death
        this.hurt = false;
        this.hurtFrames = 4;
        this.health = 3;
        this.alive = true;
        this.dying = false;
        this.invincible = false; // gives the player invicincibility so they don't get stunlocked.
        this.invincibleTimer = 0;
    }

    display() {

        if (this.invincible) { // Checks the invincible timer and then resets if it's not active
            this.invincibleTimer--;

            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        if (!this.alive) {
            return;
        }

        this.move();

        let currentSpriteSheet;
        let totalFrames;

        // Like the enemy, just checks which sprite sheet is needed
        if (this.hurt) {

            currentSpriteSheet = playerHurtSpriteSheet;
            totalFrames = this.hurtFrames;

        } else if (this.attacking) {

            currentSpriteSheet = playerAttackSpriteSheet;
            totalFrames = this.attackFrames;

        } else if (this.moving) {

            currentSpriteSheet = playerRunSpriteSheet;
            totalFrames = this.runFrames;

        } else {

            currentSpriteSheet = playerIdleSpriteSheet;
            totalFrames = this.idleFrames;
        }

        let frameX = this.currentFrame * this.frameWidth;

        push();

        translate(this.x, this.y); // Where is the player?

        if (!this.facingRight) { // Allows for rotation
            scale(-1, 1);
        }

        image( // SPRITES
            currentSpriteSheet,
            0,
            0,
            this.frameWidth,
            this.frameHeight,
            frameX,
            0,
            this.frameWidth,
            this.frameHeight
        );

        pop();

        this.animate(totalFrames);
    }

    move() {

        if (!this.alive || this.hurt) {
            return;
        }

        this.moving = false;

        if (keyIsDown(32) && !this.attacking) { // Space Bar Attack
            this.attacking = true;
            this.attackHit = false;
            this.currentFrame = 0;
            attackSound.play();
            return;
        }

        if (this.attacking) {
            return;
        }

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // Move left
            this.x -= this.speed;
            this.moving = true;
            this.facingRight = false;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // Move right
            this.x += this.speed;
            this.moving = true;
            this.facingRight = true;
        }

        this.x = constrain( // Don't go out of bounds!
            this.x,
            this.frameWidth / 2,
            width - this.frameWidth / 2
        );

        if (this.moving && !footstepSound.isPlaying()) { // Walkin and stuff
            footstepSound.play();
        } else if (!this.moving && footstepSound.isPlaying()) {
            footstepSound.stop();
        }
    }

    animate(totalFrames) { // Exactly the same as the enemy
        if (frameCount % this.animationSpeed === 0) {
            this.currentFrame++;

            if (this.currentFrame >= totalFrames) {
                this.currentFrame = 0;
                if (this.hurt) {
                    this.hurt = false;
                    if (this.dying) {
                        this.alive = false;
                    }
                }
                if (this.attacking) {
                    this.attacking = false;
                }
            }
        }
    }

    takeHit() {
        if (!this.hurt && this.alive && !this.invincible) { // Chceck all of these

            hitSound.play(); // Ouch

            for (let i = 0; i < 50; i++) { // MORE BLOOD
                bloodParticles.push(
                    new BloodParticle(this.x, this.y)
                );
            }

            this.health--; // If hit, lose health
            this.hurt = true;
            this.invincible = true; // Start invincible
            this.invincibleTimer = 60;
            this.attacking = false;
            this.moving = false;
            this.currentFrame = 0;

            if (this.health <= 0) { // If health reaches zero, you're dead
                this.dying = true;
            }
        }
    }
}