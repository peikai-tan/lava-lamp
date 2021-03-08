function mod(n, m) {
  return ((n % m) + m) % m;
}

class Particle {
  constructor(x, y, diameter, gravity, friction) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.diameter = diameter;
    this.radius = diameter / 2;
    this.gravity = gravity;
    this.changes = createVector(0, 0);
    this.friction = friction;
    this.elasticity = elasticity;

    this.atWall = false;
  }

  rotate(velocity, angle) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };
    return rotatedVelocities;
  }

  collides(p) {
    return this.pos.dist(p.pos) < this.radius + p.radius;
  }

  resolvePen(p) {
    let dist = p5.Vector.sub(this.pos, p.pos);
    let depth = this.radius + p.radius - dist.mag();

    if (this.atFloor) {
      dist.normalize().mult(depth);
      p.pos.add(dist.mult(-1));
    } else if (p.atFloor) {
      dist.normalize().mult(depth);
      this.pos.add(dist);
    } else {
      dist.normalize().mult(depth / 2);
      this.pos.add(dist);
      p.pos.add(dist.mult(-1));
    }
  }

  resolveCollision(p) {
    // Grab angle between the two colliding thiss
    const angle = -Math.atan2(p.pos.y - this.pos.y, p.pos.x - this.pos.x);

    // Velocity before equation
    const u1 = this.rotate(this.vel, angle);
    const u2 = this.rotate(p.vel, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: u2.x,
      y: u1.y,
    };

    const v2 = {
      x: u1.x,
      y: u2.y,
    };

    // Final vel after rotating axis back to original location
    const vFinal1 = this.rotate(v1, -angle);
    const vFinal2 = this.rotate(v2, -angle);

    // Swap this velocities for realistic bounce effect
    this.vel.x = vFinal1.x * this.elasticity;
    this.vel.y = vFinal1.y * this.elasticity;

    p.vel.x = vFinal2.x * this.elasticity;
    p.vel.y = vFinal2.y * this.elasticity;
  }

  show() {
    fill(0);
    circle(this.pos.x, this.pos.y, this.diameter);
  }

  move() {
    // at floor
    if (this.pos.y >= height - this.radius) {
      this.atFloor = true;
    } else {
      this.atFloor = false;
      this.vel.add(this.gravity);
      // at ceil
    }
    // keeping between width and height
    this.pos.x = max(this.radius, min(this.pos.x, width - this.radius));
    this.pos.y = max(this.radius, min(this.pos.y, height - this.radius));

    if (this.changes.mag() < 0.0001) {
      this.changes.mult(0);
    }

    this.changes.mult(0.9994);

    this.acc.add(this.changes);
    this.acc.mult(1 - this.friction);

    this.vel = this.vel.add(this.acc);
    this.vel.mult(1 - this.friction);

    if (this.vel.mag() < 0.1) {
      this.vel.mult(0);
      return;
    }
    this.pos = this.pos.add(this.vel);
  }
}
