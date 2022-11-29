const radiusDef = 50;
const frictionAirDef = 0.07;
const frictionDef = 0.1;
const restitutionDef = 0.5;
const bodyOptionDef = {
  frictionAir: frictionAirDef,
  friction: frictionDef,
  restitution: restitutionDef
}

// Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function randX() {
  const canvas = document.getElementById('dice-canvas');
  return getRandomInt(radiusDef*2, canvas.width - radiusDef*2);
}

function randY() {
  const canvas = document.getElementById('dice-canvas');
  return getRandomInt(radiusDef*2, canvas.height - radiusDef*2);
}

function randXVel() {
  const val = Math.floor(Math.random()*10 + 10);
  if (Math.random() > 0.5) { return val; }
  return -val;
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

function newD4(role) {
  if (role < 1 || role > 4) { role = 'blank'; }
  const d4 = Matter.Bodies.polygon(randX(), randY(), 3,
                                   radiusDef,
                                   bodyOptionDef);
  d4.render.sprite.texture = `./dice-pics/d4-${role}.png`
  setRandVelocity(d4);
  return d4;
}

function newD6(role) {
  if (role < 1 || role > 6) { role = 'blank'; }
  const d6 = Matter.Bodies.polygon(randX(), randY(), 4,
                                   radiusDef,
                                   bodyOptionDef);
  d6.render.sprite.texture = `./dice-pics/d6-${role}.png`
  setRandVelocity(d6);
  return d6;
}

function newD8(role) {
  if (role < 1 || role > 8) { role = 'blank'; }
  const d8 = Matter.Bodies.polygon(randX(), randY(), 6,
                                   radiusDef,
                                   bodyOptionDef);

  d8.render.sprite.texture = `./dice-pics/d8-${role}.png`
  setRandVelocity(d8);
  return d8;
}

function newD10(role) {
  if (role < 1 || role > 10) { role = 'blank'; }
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
  d10.render.sprite.texture = `./dice-pics/d10-${role}.png`
  setRandVelocity(d10);
  return d10;
}

function newD12(role) {
  if (role < 1 || role > 12) { role = 'blank'; }
  const d12 = Matter.Bodies.polygon(randX(), randY(), 10,
                                    radiusDef,
                                    bodyOptionDef);
  d12.render.sprite.texture = `./dice-pics/d12-${role}.png`
  setRandVelocity(d12);
  return d12;
}

function newD20(role) {
  if (role < 1 || role > 20) { role = 'blank'; }
  const d20 = Matter.Bodies.polygon(randX(), randY(), 6,
                                    radiusDef,
                                    bodyOptionDef);
  d20.render.sprite.texture = `./dice-pics/d20-${role}.png`
  setRandVelocity(d20);
  return d20;
}

function newDice(diceType) {
  let role = 0;
  let diceBody = null;
  if (diceType == "d4") {
    roll = getRandomInt(1, 5);
    diceBody = newD4(roll);
  } else if (diceType == "d6") {
    roll = getRandomInt(1, 7);
    diceBody = newD6(roll);
  } else if (diceType == "d8") {
    roll = getRandomInt(1, 9);
    diceBody = newD8(roll);
  } else if (diceType == "d10") {
    roll = getRandomInt(1, 11);
    diceBody = newD10(roll);
  } else if (diceType == "d12") {
    roll = getRandomInt(1, 13);
    diceBody = newD12(roll);
  } else if (diceType == "d20") {
    roll = getRandomInt(1, 21);
    diceBody = newD20(roll);
  } else {
    return null;
  }

  return {
    roll: roll,
    diceBody: diceBody
  }
}
