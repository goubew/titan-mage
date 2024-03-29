const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

let engine, runner, render;

const defaultCanvasWidth = 600
let canvasWidth = defaultCanvasWidth;
if (window.innerWidth && window.innerWidth < canvasWidth) {
  canvasWidth = window.innerWidth * 0.9;
}

let canvasHeight = canvasWidth * 0.7;
let diceEquations = [];

function scaleBody(body) {
  Matter.Body.scale(body, 0.8, 0.8);
  body.render.sprite.xScale = 0.8;
  body.render.sprite.yScale = 0.8;
  body.torque = body.torque / 5;
}

function historySelected() {
  const diceInput = document.getElementById("dice-equation");
  diceInput.value = this.value;
}

function equationHandler() {
  Composite.clear(engine.world, true);

  const equation = document.getElementById('dice-equation').value;
  if (equation != null && equation != "") {
    const equationResults = extractEquationDice(equation);

    if (equationResults == null) {
      document.getElementById('dice-roll-result').textContent = "My brain is too small for this equation!";
      return;
    }

    const prettyEquation = prettyDiceEquation(equation);
    if (!diceEquations.includes(prettyEquation)) {
      diceEquations.push(prettyEquation);

      const opt = document.createElement('option');
      opt.value = prettyEquation;
      opt.innerHTML = prettyEquation;

      const equationSelection = document.getElementById("dice-equation-selection");
      equationSelection.append(opt);
    } 

    const critDiceResults = newDice("d20");
    const shouldRollCritDiceCheckbox = document.getElementById("crit-checkbox");
    const critDiceMessage = shouldRollCritDiceCheckbox.checked ? `(Crit ${critDiceResults.roll})`:"";
    if (shouldRollCritDiceCheckbox.checked) {
      equationResults.dice.push(critDiceResults.diceBody);
    }

    if (equationResults.dice.length <= 10) {
      if (canvasWidth < defaultCanvasWidth) {
        equationResults.dice.forEach((body) => {
          scaleBody(body);
        });
      }
      Composite.add(engine.world, equationResults.dice);

      document.getElementById('dice-roll-result').textContent = `${equationResults.value} ${critDiceMessage}`;
    } else {
      document.getElementById('dice-roll-result').textContent = `${equationResults.value} ${critDiceMessage} (Too many dice to render!)`;
    }
  }
}

function runMatter() {
  // create an engine
  engine = Engine.create({
    enableSleeping: true
  });
  engine.gravity.y = 0;

  // create a renderer
  render = Render.create({
    canvas: document.getElementById("dice-canvas"),
    engine: engine,
    options: {
      background: "transparent",
      height: canvasHeight,
      showAngleIndicator: false,
      showSleeping: false,
      showVelocity: false,
      width: canvasWidth,
      wireframes: false
    }
  });

  const wallOptions = {
    isStatic: true,
    render: {
      visible: false
    }
  }
  const wallWidth = 50;
  const wallOffset = wallWidth/2 - 1;
  const topWall = Bodies.rectangle(canvasWidth/2, -wallOffset, canvasWidth, wallWidth, wallOptions);
  const rightWall = Bodies.rectangle(canvasWidth + wallOffset, canvasHeight/2, wallWidth, canvasHeight + wallWidth*2, wallOptions);
  const bottomWall = Bodies.rectangle(canvasWidth/2, canvasHeight + wallOffset, canvasWidth, wallWidth, wallOptions);
  const leftWall = Bodies.rectangle(-wallOffset, canvasHeight/2, wallWidth, canvasHeight + wallWidth*2, wallOptions);

  Composite.add(engine.world, [
    topWall,
    rightWall,
    bottomWall,
    leftWall
  ]);

  Render.run(render);

  runner = Runner.create();

  Runner.run(runner, engine);
  document.getElementById('roll-button').addEventListener("click", equationHandler);
  document.getElementById('dice-equation-selection').addEventListener("change", historySelected);
}

document.addEventListener("DOMContentLoaded", runMatter)
