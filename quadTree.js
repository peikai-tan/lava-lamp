class QuadTree {
  constructor(x, y, width, height) {
    this.center = createVector(x + width / 2, y + width / 2);
    this.x = x;
    this.y = y;
    this.dim = createVector(width / 2, height / 2);
    this.width = width;
    this.height = height;

    this.particles = [];
    this.divided = false;
    this.capacity = 5;
    this.subtrees = [];
  }

  show() {
    noFill();
    stroke(255);
    rect(this.x, this.y, this.width, this.height);
    for (let tree of this.subtrees) {
      tree.show();
    }
  }

  inside(p) {
    let x = p.pos.x;
    let y = p.pos.y;

    let w = this.width;
    let h = this.height;

    return (
      x - p.radius < this.x + w &&
      x + p.radius >= this.x &&
      y - p.radius < this.y + h &&
      y + p.radius >= this.y
    );
  }

  insert(p) {
    // check if point belongs here
    if (!this.inside(p)) {
      return false;
    }
    if (!this.divided) {
      if (this.particles.length < this.capacity) {
        this.particles.push(p);
      } else {
        // create subtrees
        // top left

        this.subtrees.push(
          new QuadTree(this.x, this.y, this.dim.x, this.dim.y)
        );
        // top right
        this.subtrees.push(
          new QuadTree(this.x + this.dim.x, this.y, this.dim.x, this.dim.y)
        );
        // bottom left
        this.subtrees.push(
          new QuadTree(this.x, this.y + this.dim.y, this.dim.x, this.dim.y)
        );
        // bottom right
        this.subtrees.push(
          new QuadTree(
            this.x + this.dim.x,
            this.y + this.dim.y,
            this.dim.x,
            this.dim.y
          )
        );
        // becomes divided
        this.divided = true;
        // push current particles into subtrees
        for (let existing_point of this.particles) {
          for (let tree of this.subtrees) {
            if (tree.insert(existing_point)) {
              continue;
            }
          }
        }
        // empty out point array
        this.particles.length = 0;
        // DO NOT push new point into subtree
      }
    }
    if (this.divided) {
      // push new point into subtrees
      for (let tree of this.subtrees) {
        tree.insert(p);
      }
    }
    return true;
  }

  empty() {
    this.particles = [];
    this.divided = false;
    this.capacity = 5;
    this.subtrees = [];
  }

  checkCollision() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        if (this.particles[i].collides(this.particles[j])) {
          this.particles[i].resolvePen(this.particles[j]);
          this.particles[i].resolveCollision(this.particles[j]);
        }
      }
    }
    for (let tree of this.subtrees) {
      tree.checkCollision();
    }
  }
}
