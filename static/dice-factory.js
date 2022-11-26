const radiusDef = 50;
const frictionAirDef = 0.07;
const frictionDef = 0.1;
const restitutionDef = 0.5;
const bodyOptionDef = {
  frictionAir: frictionAirDef,
  friction: frictionDef,
  restitution: restitutionDef
}

function randX() {
  return Math.floor(Math.random()*200 + 100);
}

function randY() {
  return Math.floor(Math.random()*200 + 100);
}

function randXVel() {
  return Math.floor(Math.random()*10 + 10);
}

function randYVel() {
  const val =  Math.floor(Math.random()*10 + 10);
  if (Math.random() > 0.5) { return val; }
  return -val;
}

function randTorque() {
  const val = Math.floor(Math.random()*5);
  if (Math.random() > 0.5) { return val; }
  return -val;
}

function setRandVelocity(body) {
  Matter.Body.setVelocity(body, { x: randXVel(), y: randYVel() });
  body.torque = randTorque();
}

function newD4() {
  const d4 = Matter.Bodies.polygon(randX(), randY(), 3,
                                   radiusDef,
                                   bodyOptionDef);
  d4.render.sprite.texture = './dice-pics/d4-blank.png'
  setRandVelocity(d4);
  return d4;
}

function newD6() {
  const d6 = Matter.Bodies.polygon(randX(), randY(), 4,
                                   radiusDef,
                                   bodyOptionDef);
  d6.render.sprite.texture = './dice-pics/d6-blank.png'
  setRandVelocity(d6);
  return d6;
}

function newD8() {
  const d8 = Matter.Bodies.polygon(randX(), randY(), 6,
                                   radiusDef,
                                   bodyOptionDef);

  d8.render.sprite.texture = './dice-pics/d8-blank.png'
  setRandVelocity(d8);
  return d8;
}

function newD10() {
  const d10Vertices = [
    { x: 52, y: 0 },
    { x: 95, y: 38 },
    { x: 95, y: 56 },
    { x: 52, y: 100 },
    { x: 5, y: 56 },
    { x: 5, y: 38 },
  ]
  const d10 = Matter.Bodies.fromVertices(randX(), randY(), d10Vertices,
                                         bodyOptionDef);
  d10.render.sprite.texture = './dice-pics/d10-blank.png'
  setRandVelocity(d10);
  return d10;
}

function newD12() {
  const d12 = Matter.Bodies.polygon(randX(), randY(), 10,
                                    radiusDef,
                                    bodyOptionDef);
  d12.render.sprite.texture = './dice-pics/d12-blank.png'
  setRandVelocity(d12);
  return d12;
}

function newD20() {
  const d20 = Matter.Bodies.polygon(randX(), randY(), 6,
                                    radiusDef,
                                    bodyOptionDef);
  d20.render.sprite.texture = './dice-pics/d20-blank.png'
  setRandVelocity(d20);
  return d20;
}
