class Heat {
  constructor(x, y, resolution, magnitude) {
    this.x = x;
    this.y = y;
    this.beginX = x - resolution;
    this.beginY = y - magnitude * resolution;
    this.resolution = resolution;
    this.magnitude = magnitude;

    this.height = this.y - this.beginY;
  }

  contains(p) {
    let x = p.pos.x;
    let y = p.pos.y;
    return x <= this.x && x >= this.beginX && y <= this.y && y >= this.beginY;
  }

  show() {
    stroke(255);
    noFill();
    rect(
      this.beginX,
      this.beginY,
      this.resolution,
      this.magnitude * this.resolution
    );
  }
}

class HeatMap {
  constructor(width, height, resolution) {
    this.width = width;
    this.height = height;

    this.resolution = resolution;
    this.heats = [];
    this.fill();
  }

  fill() {
    let wRes = int(this.width / this.resolution);
    let h = this.height;
    for (let w = 0; w <= wRes; w++) {
      let a = 0.5;
      let x = w - wRes / 2;
      let x2 = x * x;
      let y = a * x2;
      let mag = (100 - y) / this.resolution;
      this.heats.push(new Heat(w * this.resolution, h, this.resolution, mag));
    }
  }

  heatUp(p) {
    for (let heat of this.heats) {
      if (heat.contains(p)) {
        p.changes.y +=
          (((heat.height - p.pos.y) / heat.height) * heat.magnitude) / 120000;
        return;
      }
    }
  }

  show() {
    for (let heat of this.heats) {
      heat.show();
    }
  }
}
