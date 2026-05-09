let gameStarted = false;
let gameOver = false;

// HUD
let font;
let heartImage;
let score = 0;
let highScore = 0;

//Audio
let ambientTrack;
let footstepSound;
let attackSound;
let enemyAttackSound;
let hitSound;
let pickupSound;

// Player Sprite
let player;
let playerIdleSpriteSheet;
let playerRunSpriteSheet;
let playerAttackSpriteSheet;
let playerHurtSpriteSheet;

// Enemy Sprite
let enemies = [];
let enemyIdleSpriteSheet;
let enemyRunSpriteSheet;
let enemyAttackSpriteSheet;
let enemyHurtSpriteSheet;

//Enemy Spawning
let enemySpawnTimer = 0;
let spawnInterval = 300;
let enemiesPerWave = 1;
let enemiesLeftToSpawn = 0;
let enemySpawnDelay = 25;
let enemySpawnDelayTimer = 0;

//Drops
let healthDropSpriteSheet;
let healthDrops = [];
let bloodParticles = [];

function preload() {

    //Font
    font = loadFont("font/pixelify.ttf");

    // Player
    heartImage = loadImage("assets/HEART.png");
    playerIdleSpriteSheet = loadImage("assets/idle.png");
    playerRunSpriteSheet = loadImage("assets/run.png");
    playerAttackSpriteSheet = loadImage("assets/attack.png");
    playerHurtSpriteSheet = loadImage("assets/hurt.png");

    //Enemy 
    enemyIdleSpriteSheet = loadImage("assets/idlebad.png");
    enemyRunSpriteSheet = loadImage("assets/runbad.png");
    enemyAttackSpriteSheet = loadImage("assets/attackbad.png");
    enemyHurtSpriteSheet = loadImage("assets/HURTBAD.png");

    // Audio
    ambientTrack = loadSound("sounds/ambienttrack.wav");
    footstepSound = loadSound("sounds/footsteps.wav");
    attackSound = loadSound("sounds/attack.wav");
    enemyAttackSound = loadSound("sounds/attackbad.wav");
    hitSound = loadSound("sounds/HIT.wav");
    pickupSound = loadSound("sounds/pickup.wav");

    // Drop
    healthDropSpriteSheet = loadImage("assets/healthdrop.png");
}

function setup() {

    createCanvas(800, 300);
    imageMode(CENTER);

    // Create Player
    player = new Player(100, height - 35);

    // Create Enemies
    enemies.push(
        new Enemy(650, height - 35)
    );

    // Audio
    ambientTrack.setLoop(true);
    ambientTrack.setVolume(0.3);
    footstepSound.setLoop(true);
    attackSound.setVolume(0.4);
    enemyAttackSound.setVolume(0.2);
    hitSound.setVolume(0.4);
    pickupSound.setVolume(0.4);
}

function draw() {

    background(225);

    if (!gameStarted) { // Start screen shows
        drawStartScreen();
        return;
    }

    if (gameOver) { // End game shows
        drawGameOverScreen();
        return;
    }
    // Essentially arranging them like in adobe
    updateBloodParticles();
    updateHealthDrops();
    drawHUD();
    player.display();
    for (let enemy of enemies) {
        enemy.display();
    }
    spawnEnemies();
    checkPlayerAttack();
    checkEnemyAttack();

    if (!player.alive) { // Checks player state, if dead, game over!
        gameOver = true;
        ambientTrack.stop();

    }
}

function drawStartScreen() { // Draws the start up screen

    background(225);
    fill(0);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("PRESS SPACE TO ATTACK", width / 2, height / 2);
}

function keyPressed() { // This is all space key activated

    if (!gameStarted && key === ' ') {
        gameStarted = true;
        ambientTrack.play();
        return;
    }

    if (gameOver && key === ' ') {
        restartGame();
    }
}

function drawHUD() {

    let heartSize = 32;

    for (let i = 0; i < player.health; i++) { // Basically just the heart sprite on the hud being drawn
        image(
            heartImage,
            30 + (i * 40),
            30,
            heartSize,
            heartSize
        );
    }

    // Other hud content
    fill(0);
    textFont(font);
    textAlign(CENTER, TOP);
    textSize(20);
    text("KILLS: " + score, width / 2, 20);

    textAlign(RIGHT, TOP);
    text("HIGH SCORE: " + highScore, width - 20, 20);
}

function checkPlayerAttack() {

    for (let enemy of enemies) {

        // Checks for location of enemy and player
        let distance = dist(player.x, player.y, enemy.x, enemy.y);
        let enemyIsToRight = enemy.x > player.x;
        let enemyIsToLeft = enemy.x < player.x;
        let playerFacingEnemy =
            (player.facingRight && enemyIsToRight) ||
            (!player.facingRight && enemyIsToLeft);

        if ( // If player attacks within certain distance, enemy takes a hit which leads to death
            player.attacking &&
            distance < 80 && // Player can attack from further
            playerFacingEnemy &&
            enemy.alive &&
            !enemy.hurt
        ) {
            enemy.takeHit();
        }
    }
}

function checkEnemyAttack() { // Same thing as above but swapped to check for enemy attacks.

    for (let enemy of enemies) {

        let distance = dist(enemy.x, enemy.y, player.x, player.y);
        let playerIsToRight = player.x > enemy.x;
        let playerIsToLeft = player.x < enemy.x;
        let enemyFacingPlayer =
            (enemy.facingRight && playerIsToRight) ||
            (!enemy.facingRight && playerIsToLeft);

        if (
            enemy.attacking &&
            !enemy.attackHit &&
            distance < 55 && // Enemy has to be a bit closer
            enemyFacingPlayer
        ) {
            player.takeHit();
            enemy.attackHit = true;
        }
    }
}

function updateBloodParticles() { // BLOOD

    for (let i = bloodParticles.length - 1; i >= 0; i--) {
        let particle = bloodParticles[i];
        particle.update();
        particle.display();
        if (particle.isDead()) {
            bloodParticles.splice(i, 1);
        }
    }
}

function spawnEnemies() { // Spawns in enemies at set intervals

    enemySpawnTimer++; // Spawn timer counts down
    if (enemySpawnTimer >= spawnInterval && enemiesLeftToSpawn === 0) {
        enemiesLeftToSpawn = enemiesPerWave;
        enemySpawnTimer = 0;
        if (spawnInterval > 90) {
            spawnInterval -= 20;
        }
        if (enemiesPerWave < 4) { // Basically continuously adds waves of guys, which increase as the interval passes
            enemiesPerWave++; // MORE ENEMIES
        }
    }
    if (enemiesLeftToSpawn > 0) { // If all enemies are dead, spawn enemies, BUT add a delay so they don't spawn at the exact same time.
        enemySpawnDelayTimer++;
        if (enemySpawnDelayTimer >= enemySpawnDelay) {
            let spawnX; // Decides where to spawn enemy... Left or right side. 50/50 chance
            if (random() < 0.5) {
                spawnX = -50;
            } else {
                spawnX = width + 50;
            }
            enemies.push(
                new Enemy(spawnX, height - 35)
            );
            enemiesLeftToSpawn--;
            enemySpawnDelayTimer = 0;
        }
    }
}

function updateHealthDrops() { // Same exact info as blood, but applies to the health orbs

    for (let i = healthDrops.length - 1; i >= 0; i--) {
        let drop = healthDrops[i]; // Animated
        drop.display();
        drop.checkPickup(); // Check if picked up
        if (drop.pickedUp) {
            healthDrops.splice(i, 1);
        }
    }
}

function drawGameOverScreen() { // Self explanatory

    background(20);
    textFont(font);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    textSize(48);
    text("YOU DIED", width / 2, height / 2 - 60);
    fill(255);
    textSize(24);
    text("KILLS: " + score, width / 2, height / 2);
    text("HIGH SCORE: " + highScore, width / 2, height / 2 + 40);
    textSize(20);
    text("PRESS SPACE TO RESTART", width / 2, height / 2 + 90);
}

function restartGame() { // Resets everything to baseline, making it a simple loop!

    gameOver = false;
    score = 0;
    enemies = [];
    bloodParticles = [];
    enemySpawnTimer = 0;
    enemiesPerWave = 1;
    spawnInterval = 300;
    player = new Player(100, height - 35);
    enemies.push(
        new Enemy(650, height - 35)
    );
    ambientTrack.play();
}


