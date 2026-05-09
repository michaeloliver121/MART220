class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        // Spritesheet
        this.frameWidth = 96;
        this.frameHeight = 96;
        this.currentFrame = 0;
        this.animationSpeed = 3;

        //Movement
        this.speed = 1.5;
        this.idleFrames = 10; // Sprite Idle
        this.moving = false;
        this.runFrames = 16; // Sprite Run
        this.facingRight = false;

        // Attacking
        this.attacking = false;
        this.attackFrames = 7; // SpriteAttack
        this.attacking = false;

        // Hit & Death
        this.hurt = false; // Checks if hurt
        this.hurtFrames = 4; // Sprite Hurt
        this.attackHit = false; // Did the attack hit
        this.alive = true; // Starts off alive
        this.dying = false; // Basically plays through the hit animation before disappearing completely
    }

    display() {
        if (!this.alive) return; //If the enemy is dead, stop

        this.move();

        // Sprite Sheet collection
        let animation = this.getAnimation();
        let frameX = this.currentFrame * this.frameWidth;

        push();

        translate(this.x, this.y); // Moves to spawning coordinates

        if (!this.facingRight) { // Flips the sprite if it's facing the wrong way
            scale(-1, 1);
        }

        image(
            animation.spriteSheet, // Picks the sprite sheet
            0,
            0,
            this.frameWidth,
            this.frameHeight,
            frameX,
            0,
            this.frameWidth, //Crops
            this.frameHeight
        );

        pop();

        this.animate(animation.totalFrames); // Starts animation
    }

    getAnimation() {
        if (this.hurt) { // If hurt, use hurt animation
            return {
                spriteSheet: enemyHurtSpriteSheet,
                totalFrames: this.hurtFrames
            };
        }

        if (this.attacking) { // If attacking, use attack animation
            return {
                spriteSheet: enemyAttackSpriteSheet,
                totalFrames: this.attackFrames
            };
        }

        if (this.moving) { // If moving, use move animation
            return {
                spriteSheet: enemyRunSpriteSheet,
                totalFrames: this.runFrames
            };
        }

        return { // Else idle animation
            spriteSheet: enemyIdleSpriteSheet,
            totalFrames: this.idleFrames
        };
    }

    move() {
        if (!this.alive || this.hurt) return; // Dead or hurt enemies can't move

        this.moving = false; // Resets frames for moving

        let distance = dist(this.x, this.y, player.x, player.y); // Distance to player

        if (distance <= 50) { // Attack within 50px
            this.startAttack();
            return;
        }

        this.attacking = false; // If not in range, don't attack
        this.moveTowardPlayer(); // Otherwise move toward player
    }

    startAttack() {
        if (!this.attacking) { // Doesn't restart the attack frames
            this.attacking = true; // Enter attack state
            this.attackHit = false; // Allows the attack to damage the player once
            this.currentFrame = 0; // Restart attack ainmation
            enemyAttackSound.play(); // Attack sound plays
        }
    }

    moveTowardPlayer() {
        if (this.x > player.x) { // If right of player, move left
            this.x -= this.speed;
            this.moving = true;
            this.facingRight = false; // Face left
        }

        if (this.x < player.x) { // If left, move right
            this.x += this.speed;
            this.moving = true;
            this.facingRight = true; // Face right
        }
    }

    takeHit() {
        if (this.hurt || !this.alive) return; // Prevents getting hit over and over again

        hitSound.play(); // Ouchie

        for (let i = 0; i < 50; i++) { // MORE BLOOD
            bloodParticles.push(
                new BloodParticle(this.x, this.y)
            );
        }

        this.hurt = true; // Become hurt
        this.dying = true; // Enemy dies after getting hit
        this.attacking = false; // Cancels any attack
        this.moving = false; // Stops moving
        this.currentFrame = 0; // Resets
    }

    animate(totalFrames) {
        if (frameCount % this.animationSpeed !== 0) return; // Animation speed

        this.currentFrame++; // Move to next frame

        if (this.currentFrame >= totalFrames) { // If animatino finishes
            this.currentFrame = 0;

            if (this.hurt) {
                this.finishHurt(); // Finish getting hurt
            }

            if (this.attacking) {
                this.attacking = false; // End attack
            }
        }
    }

    finishHurt() {
        this.hurt = false; // Exit hurt state

        if (this.dying) { // If enemy should be dying
            this.die();
        }
    }

    die() {
        this.alive = false; // Enemy disappears

        if (random() < 0.25) { // 25% chance to drop health orb
            healthDrops.push(
                new HealthDrop(this.x, this.y + 10)
            );
        }

        score++; // Score increase

        if (score > highScore) { // Checks current score against session
            highScore = score;
        }
    }
}