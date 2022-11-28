const canvasWidth = 600;
const canvasHeight = 400;

function runMatter() {
  // module aliases
  var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();
  engine.gravity.y = 0;

  // create a renderer
  var render = Render.create({
    canvas: document.getElementById("dice-canvas"),
    engine: engine,
    options: {
      width: canvasWidth,
      height: canvasHeight,
      showVelocity: false,
      showAngleIndicator: false,
      wireframes: false,
      background: "transparent"
    }
  });

  const wallOptions = {
    isStatic: true,
    render: {
      visible: false
    }
  }
  // add all of the bodies to the world
  Composite.add(engine.world, [
    //Dice
    newD20(20),
    newD12(12),
    newD10(10),
    newD8(8),
    newD6(6),
    newD4(4),

    // Walls
    Bodies.rectangle(canvasWidth/2, -25, canvasWidth, 50, wallOptions),
    Bodies.rectangle(canvasWidth + 25, canvasHeight/2, 50, canvasHeight + 100, wallOptions),
    Bodies.rectangle(canvasWidth/2, canvasHeight + 25, canvasWidth, 50, wallOptions),
    Bodies.rectangle(-25, canvasHeight/2, 50, canvasHeight + 100, wallOptions)
  ]);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
  setTimeout(() => {
    Runner.stop(runner);
  }, 5000);

  document.getElementById('roll-button').addEventListener("click", () => {
    const equation = document.getElementById('dice-equation').value;
    if (equation != null && equation != "") {
      const equationResults = extractEquationDice(equation);
      document.getElementById('dice-roll-result').textContent = equationResults.value;
    }
  });
}

document.addEventListener("DOMContentLoaded", runMatter)
