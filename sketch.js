let blurH, blurV, contrast;
let blurLevel = 2;
let particleSize = 20;

let width = 400;
let height = 800;
let resolution = 10;

let gravity;
let friction;
let elasticity;

let fr = 30;
let cnv;

let particles = [];
let quadTree;
let heatMap;

function preload() {
  // load the shaders, we will use the same vertex shader and frag shaders for both passes
  blurH = loadShader("shaders/base.vert", "shaders/blur.frag");
  blurV = loadShader("shaders/base.vert", "shaders/blur.frag");
  contrast = loadShader("shaders/base.vert", "shaders/contrast.frag");
}

function setup() {
  frameRate(fr);

  gravity = createVector(0, 0.35);
  friction = 0.3;
  elasticity = 0.9;

  cnv = createCanvas(width, height);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  quadTree = new QuadTree(0, 0, width, height);

  for (let y = height - particleSize; y > height / 2; y -= particleSize) {
    let xRandom = random(0, particleSize);
    for (let x = xRandom; x < width; x += particleSize) {
      particles.push(
        new Particle(x, y, particleSize, gravity, friction, elasticity)
      );
    }
  }

  pg = createGraphics(width, height);

  noStroke();

  pass1 = createGraphics(width, height, WEBGL);
  pass2 = createGraphics(width, height, WEBGL);
  pass3 = createGraphics(width, height, WEBGL);

  pass1.noStroke();
  pass2.noStroke();
  pass3.noStroke();

  // particles.push(
  //   new Particle(width / 2, height, particleSize, gravity, friction)
  // );

  heatMap = new HeatMap(width, height, resolution);
}

function draw() {
  background(255);
  pg.background(255);

  noStroke();
  for (let p of particles) {
    quadTree.insert(p);
    heatMap.heatUp(p);
    p.move();
    // p.show();
    pg.fill(0);
    pg.ellipse(p.pos.x, p.pos.y, p.diameter);
  }
  quadTree.checkCollision();

  quadTree.empty();
  // heatMap.show();

  // set the shader for our first pass
  pass1.shader(blurH);

  // send the camera texture to the horizontal blur shader
  // send the size of the texels
  // send the blur direction that we want to use [1.0, 0.0] is horizontal
  blurH.setUniform("tex0", pg);
  blurH.setUniform("texelSize", [blurLevel / width, 0.7 / height]);
  blurH.setUniform("direction", [1.0, 0.0]);

  // we need to make sure that we draw the rect inside of pass1
  pass1.rect(0, 0, width, height);

  pass2.shader(blurV);

  // instead of sending the webcam, we will send our first pass to the vertical blur shader
  // texelSize remains the same as above
  // direction changes to [0.0, 1.0] to do a vertical pass
  blurV.setUniform("tex0", pass1);
  blurV.setUniform("texelSize", [blurLevel / width, blurLevel / height]);
  blurV.setUniform("direction", [0.0, 1.0]);

  // again, make sure we have some geometry to draw on in our 2nd pass
  pass2.rect(0, 0, width, height);

  pass3.shader(contrast);

  contrast.setUniform("tex0", pass2);

  // rect gives us some geometry on the screen
  pass3.rect(0, 0, width, height);

  image(pass3, 0, 0, width, height);
  // draw the second pass to the screen
}
