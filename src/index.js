import Level from "./level.js";
import Player from "./player.js";

const canvas = document.getElementById("canvas");
const secondCanvas = document.getElementById("canvas2");
const ctx = canvas.getContext("2d");
const ctx2 = secondCanvas.getContext("2d");
let FPS = 60;
const widthCanvas = 500;
const heightCanvas = 500;
let lastLoop = Date.now();

canvas.width = widthCanvas;
canvas.height = heightCanvas;
secondCanvas.width = widthCanvas;
secondCanvas.height = heightCanvas;

// Levels
const level1 = [
  [1, 3, 3, 3, 3, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 3, 3, 3, 0, 0, 0, 0, 1],
  [1, 3, 3, 3, 3, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 3, 3, 3, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const scenario = new Level(ctx2, level1);

const player = new Player(ctx, ctx2, scenario, 100, 100);

function init() {
  setInterval(() => {
    main();
  }, 1000 / FPS);
}

function drawCeilFloor() {
  ctx.fillStyle = "#666";
  ctx.fillRect(0, 0, widthCanvas, heightCanvas / 2);
  ctx.fillStyle = "#752300";
  ctx.fillRect(0, heightCanvas / 2, widthCanvas, heightCanvas / 2);
}

function clearCanvas() {
  canvas.width = widthCanvas;
  canvas.height = heightCanvas;
}

function update() {
  player.update();
}

function main() {
  console.log(Math.round(countFPS()));
  clearCanvas();
  update();
  draw();
}

function countFPS() {
  let thisLoop = Date.now();
  let fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;

  return fps;
}

function draw() {
  drawCeilFloor();
  scenario.draw();
  player.draw();
}

window.onload = init;
