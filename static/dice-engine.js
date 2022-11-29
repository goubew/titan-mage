let canvasWidth = 600;
if (window.innerWidth && window.innerWidth < canvasWidth) {
  canvasWidth = window.innerWidth * 0.9;
}

let canvasHeight = 400;
if (canvasWidth < 600) {
  canvasHeight = canvasWidth;
}

function runMatter() {
  // module aliases
  var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create({
    enableSleeping: true
  });
  engine.gravity.y = 0;

  // create a renderer
  var render = Render.create({
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
  const topWall = Bodies.rectangle(canvasWidth/2, -24, canvasWidth, 50, wallOptions);
  const rightWall = Bodies.rectangle(canvasWidth + 24, canvasHeight/2, 50, canvasHeight + 100, wallOptions);
  const bottomWall = Bodies.rectangle(canvasWidth/2, canvasHeight + 24, canvasWidth, 50, wallOptions);
  const leftWall = Bodies.rectangle(-24, canvasHeight/2, 50, canvasHeight + 100, wallOptions);

  Composite.add(engine.world, [
    topWall,
    rightWall,
    bottomWall,
    leftWall
  ]);

  Render.run(render);

  var runner = Runner.create();

  Runner.run(runner, engine);
  document.getElementById('roll-button').addEventListener("click", () => {
    const equation = document.getElementById('dice-equation').value;
    if (equation != null && equation != "") {
      const equationResults = extractEquationDice(equation);

      Composite.clear(engine.world, true);
      if (equationResults.dice.length <= 10) {
        Composite.add(engine.world, equationResults.dice);
        document.getElementById('dice-roll-result').textContent = equationResults.value;
      } else {
        document.getElementById('dice-roll-result').textContent = `${equationResults.value} (Too many dice to render!)`;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", runMatter)
