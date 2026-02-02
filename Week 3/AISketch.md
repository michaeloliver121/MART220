Prompt: Can you create a p5.js sketch of a fantasy map with locations, markers/icons, clouds, and a moveable player character that is stuck within the boundaries of the map?

// Fantasy Map + Clouds + Moveable Player (bounded)
// p5.js sketch by ChatGPT

let locations = [];
let clouds = [];
let player;

const MAP_MARGIN = 60;  // parchment border thickness
const CLOUD_COUNT = 12;

function setup() {
  createCanvas(960, 600);
  textFont('Georgia');
  noiseDetail(4, 0.45);

  // Create locations (fixed for consistency; you can randomize if you want)
  locations = [
    { name: "Brindleford", type: "town", x: 250, y: 210 },
    { name: "Elderfall Ruins", type: "ruins", x: 520, y: 170 },
    { name: "Glimmerpeak", type: "mountain", x: 690, y: 250 },
    { name: "The Whisperwood", type: "forest", x: 360, y: 380 },
    { name: "Saltwind Port", type: "port", x: 180, y: 450 },
    { name: "Sunken Watchtower", type: "ruins", x: 760, y: 410 },
  ];

  // Clouds
  for (let i = 0; i < CLOUD_COUNT; i++) {
    clouds.push(makeCloud());
  }

  // Player starts near center
  player = {
    x: width * 0.52,
    y: height * 0.55,
    speed: 2.6,
    r: 10
  };
}

function draw() {
  drawParchmentBackground();
  drawCoastAndTerrain();
  drawDecorations();

  // Draw locations/icons
  for (const loc of locations) {
    drawLocation(loc);
  }

  // Draw path line (optional flavor)
  drawQuestRoute();

  // Update & draw clouds on top
  updateClouds();
  drawClouds();

  // Update and draw player last so it's visible
  updatePlayer();
  drawPlayer();

  // UI hint
  drawHUD();
}

/* -------------------- MAP BACKGROUND -------------------- */

function drawParchmentBackground() {
  // Base parchment tone
  background(236, 222, 186);

  // Subtle noise texture
  noStroke();
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const n = noise(x * 0.01, y * 0.01);
      const c = lerp(215, 245, n);
      fill(c, c * 0.96, c * 0.82, 28);
      rect(x, y, 3, 3);
    }
  }

  // Darker edges vignette
  for (let i = 0; i < 40; i++) {
    noFill();
    stroke(90, 70, 40, 10);
    rect(i, i, width - i * 2, height - i * 2, 18);
  }

  // Inner border
  noFill();
  stroke(75, 55, 30, 80);
  strokeWeight(2);
  rect(MAP_MARGIN, MAP_MARGIN, width - MAP_MARGIN * 2, height - MAP_MARGIN * 2, 18);

  // Title
  noStroke();
  fill(70, 50, 25, 180);
  textSize(26);
  textAlign(CENTER, TOP);
  text("The Shattered Coast", width / 2, MAP_MARGIN - 40);
}

/* -------------------- COAST / TERRAIN -------------------- */

function drawCoastAndTerrain() {
  const left = MAP_MARGIN;
  const top = MAP_MARGIN;
  const right = width - MAP_MARGIN;
  const bottom = height - MAP_MARGIN;

  // Sea region (right side) + coastline
  // We'll draw a wiggly coastline line and fill ocean to the right.
  const coastPts = [];
  for (let y = top; y <= bottom; y += 14) {
    const t = map(y, top, bottom, 0, 1);
    // Coastline x position: mostly right-ish with noise
    const cx = lerp(width * 0.62, width * 0.75, noise(2.1, y * 0.01)) + sin(t * PI * 2) * 18;
    coastPts.push({ x: cx, y });
  }

  // Ocean fill
  noStroke();
  fill(120, 160, 175, 70);
  beginShape();
  vertex(right, top);
  vertex(right, bottom);
  for (let i = coastPts.length - 1; i >= 0; i--) {
    vertex(coastPts[i].x, coastPts[i].y);
  }
  vertex(right, top);
  endShape(CLOSE);

  // Coastline stroke
  noFill();
  stroke(40, 30, 20, 90);
  strokeWeight(2);
  beginShape();
  for (const p of coastPts) vertex(p.x, p.y);
  endShape();

  // Inland hills shading (soft blobs)
  for (let i = 0; i < 16; i++) {
    const x = random(left + 40, width * 0.68);
    const y = random(top + 40, bottom - 40);
    const w = random(80, 180);
    const h = random(50, 110);
    noStroke();
    fill(120, 95, 60, 22);
    ellipse(x, y, w, h);
  }

  // Ocean wave lines (simple arcs)
  stroke(70, 110, 130, 50);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < 18; i++) {
    const x = random(width * 0.76, right - 20);
    const y = random(top + 20, bottom - 20);
    arc(x, y, random(22, 40), random(10, 18), 0, PI);
  }
}

/* -------------------- DECORATIONS -------------------- */

function drawDecorations() {
  const left = MAP_MARGIN;
  const top = MAP_MARGIN;
  const right = width - MAP_MARGIN;
  const bottom = height - MAP_MARGIN;

  // Compass rose (bottom-left)
  push();
  translate(left + 55, bottom - 60);
  stroke(55, 40, 20, 180);
  fill(85, 65, 35, 45);
  circle(0, 0, 52);
  line(0, -24, 0, 24);
  line(-24, 0, 24, 0);
  triangle(0, -28, -6, -16, 6, -16); // north pointer
  noStroke();
  fill(55, 40, 20, 180);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("N", 0, -38);
  pop();

  // Simple scale (bottom-right)
  push();
  stroke(55, 40, 20, 160);
  strokeWeight(2);
  const sx = right - 150;
  const sy = bottom - 55;
  line(sx, sy, sx + 120, sy);
  for (let i = 0; i <= 6; i++) {
    line(sx + i * 20, sy - 6, sx + i * 20, sy + 6);
  }
  noStroke();
  fill(55, 40, 20, 160);
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text("0            10            20 leagues", sx + 60, sy - 10);
  pop();
}

/* -------------------- LOCATIONS -------------------- */

function drawLocation(loc) {
  // label shadow
  const labelColor = color(45, 32, 18, 190);
  const labelShadow = color(255, 245, 220, 160);

  // Icon
  push();
  translate(loc.x, loc.y);
  stroke(40, 28, 16, 180);
  strokeWeight(2);

  if (loc.type === "town") {
    fill(80, 60, 30, 60);
    circle(0, 0, 12);
    fill(40, 28, 16, 200);
    circle(0, 0, 4);
  } else if (loc.type === "ruins") {
    noFill();
    line(-7, -7, 7, 7);
    line(-7, 7, 7, -7);
    strokeWeight(1);
    circle(0, 0, 14);
  } else if (loc.type === "mountain") {
    fill(80, 60, 30, 35);
    triangle(-12, 8, 0, -12, 12, 8);
    triangle(-6, 10, 6, -8, 18, 10);
  } else if (loc.type === "forest") {
    fill(80, 60, 30, 35);
    triangle(-10, 10, 0, -10, 10, 10);
    triangle(-22, 12, -12, -6, -2, 12);
    triangle(2, 12, 12, -6, 22, 12);
    strokeWeight(3);
    line(0, 10, 0, 16);
  } else if (loc.type === "port") {
    // anchor-ish symbol
    noFill();
    arc(0, 2, 18, 18, 0, PI);
    line(0, -10, 0, 10);
    line(-7, 10, 7, 10);
    circle(0, -12, 4);
  }
  pop();

  // Label
  push();
  textSize(14);
  textAlign(LEFT, CENTER);
  noStroke();
  fill(labelShadow);
  text(loc.name, loc.x + 14 + 1, loc.y - 14 + 1);
  fill(labelColor);
  text(loc.name, loc.x + 14, loc.y - 14);
  pop();
}

function drawQuestRoute() {
  // A dashed route from Brindleford -> Whisperwood -> Watchtower
  const a = locations[0];
  const b = locations[3];
  const c = locations[5];

  stroke(60, 40, 20, 120);
  strokeWeight(2);
  drawingContext.setLineDash([8, 8]);
  noFill();
  beginShape();
  curveVertex(a.x, a.y);
  curveVertex(a.x, a.y);
  curveVertex(b.x, b.y);
  curveVertex(c.x, c.y);
  curveVertex(c.x, c.y);
  endShape();
  drawingContext.setLineDash([]);
}

/* -------------------- CLOUDS -------------------- */

function makeCloud() {
  const left = MAP_MARGIN;
  const top = MAP_MARGIN;
  const right = width - MAP_MARGIN;
  const bottom = height - MAP_MARGIN;

  return {
    x: random(left, right),
    y: random(top, bottom),
    s: random(0.8, 1.9),
    vx: random(0.15, 0.45),
    alpha: random(35, 75),
    wobble: random(1000)
  };
}

function updateClouds() {
  const left = MAP_MARGIN;
  const right = width - MAP_MARGIN;

  for (const c of clouds) {
    c.x += c.vx;
    c.y += sin((frameCount * 0.01) + c.wobble) * 0.08;

    if (c.x > right + 120) {
      c.x = left - 120;
      c.y = random(MAP_MARGIN, height - MAP_MARGIN);
      c.s = random(0.8, 1.9);
      c.vx = random(0.15, 0.45);
      c.alpha = random(35, 75);
      c.wobble = random(1000);
    }
  }
}

function drawClouds() {
  const left = MAP_MARGIN, top = MAP_MARGIN, right = width - MAP_MARGIN, bottom = height - MAP_MARGIN;

  push();
  noStroke();
  for (const c of clouds) {
    // keep clouds inside map visual area (but allow slight overlap)
    if (c.y < top - 60 || c.y > bottom + 60) continue;

    fill(245, 245, 245, c.alpha);
    const x = c.x, y = c.y, s = c.s;

    // layered cloud puffs
    ellipse(x, y, 70 * s, 36 * s);
    ellipse(x - 28 * s, y + 6 * s, 46 * s, 28 * s);
    ellipse(x + 30 * s, y + 8 * s, 52 * s, 30 * s);
    ellipse(x + 6 * s, y - 10 * s, 56 * s, 30 * s);
  }
  pop();
}

/* -------------------- PLAYER -------------------- */

function updatePlayer() {
  let dx = 0, dy = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) dx -= 1;  // A
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) dx += 1; // D
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) dy -= 1;    // W
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) dy += 1;  // S

  // Normalize diagonal movement
  if (dx !== 0 || dy !== 0) {
    const mag = Math.sqrt(dx * dx + dy * dy);
    dx /= mag;
    dy /= mag;
  }

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  // Clamp to map boundaries (inner parchment border)
  const minX = MAP_MARGIN + 8;
  const maxX = width - MAP_MARGIN - 8;
  const minY = MAP_MARGIN + 8;
  const maxY = height - MAP_MARGIN - 8;

  player.x = constrain(player.x, minX, maxX);
  player.y = constrain(player.y, minY, maxY);
}

function drawPlayer() {
  // Draw as a small "adventurer arrow" marker with a halo
  push();
  translate(player.x, player.y);

  // halo
  noStroke();
  fill(255, 255, 255, 110);
  circle(0, 0, 26);

  // marker
  stroke(25, 15, 8, 220);
  strokeWeight(2);
  fill(150, 40, 30, 160);

  // Point toward movement direction (optional): use mouse angle as a vibe
  const ang = atan2(mouseY - player.y, mouseX - player.x);
  rotate(ang + PI / 2);

  beginShape();
  vertex(0, -12);
  vertex(8, 10);
  vertex(0, 6);
  vertex(-8, 10);
  endShape(CLOSE);

  // center dot
  noStroke();
  fill(30, 20, 12, 190);
  circle(0, 2, 4);

  pop();
}

function drawHUD() {
  const left = MAP_MARGIN;
  const top = MAP_MARGIN;

  push();
  noStroke();
  fill(50, 35, 18, 160);
  textSize(12);
  textAlign(LEFT, TOP);
  text("Move: WASD / Arrow keys • Player is bounded to the map", left, top + 6);
  pop();
}
