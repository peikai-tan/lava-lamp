function vector_abs(p) {
  return createVector(abs(p.x), abs(p.y));
}

function vector_max(q) {
  let x = q.x < 0 ? 0 : q.x;
  let y = q.y < 0 ? 0 : q.y;
  return createVector(x, y);
}

function vector_min(q) {
  let x = q.x > 0 ? 0 : q.x;
  let y = q.y > 0 ? 0 : q.y;
  return createVector(x, y);
}

function vector_maxcomp(q) {
  return max(q.x, q.y);
}
