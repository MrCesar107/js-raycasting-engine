import Ray from "./ray.js";
import { degreesToRadians, normalizeAngle } from "../lib/utils.js";

export default class Player {
  constructor(ctx, ctx2, scenario, x, y) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.scenario = scenario;
    this.x = x;
    this.y = y;
    this.onGoing = 0;
    this.onTurn = 0;
    this.rotationAngle = 0;
    this.spinSpeed = 3 * (Math.PI / 180); // degrees;
    this.speed = 3;
    this.raysNumber = ctx.canvas.width;
    this.rays = [];
    this.FOV = 60;
    this.createFOV();
  }

  createFOV() {
    let middleFOV = this.FOV / 2;
    let incrementAngle = degreesToRadians(this.FOV / this.raysNumber);
    let initialAngle = degreesToRadians(this.rotationAngle - middleFOV);
    let rayAngle = initialAngle;

    for (let i = 0; i < this.raysNumber; i++) {
      let ray = new Ray(
        this.ctx,
        this.ctx2,
        this.scenario,
        this.x,
        this.y,
        this.rotationAngle,
        rayAngle,
        i
      );
      this.rays.push(ray);
      rayAngle += incrementAngle;
    }
  }

  update() {
    this.move();
    this.updateRaysPosition();
  }

  move() {
    addEventListener("keydown", (e) => {
      if (e.code == "ArrowUp" || e.code == "KeyW") this.moveUp();
      if (e.code == "ArrowDown" || e.code == "KeyS") this.moveDown();
      if (e.code == "ArrowLeft" || e.code == "KeyA") this.moveLeft();
      if (e.code == "ArrowRight" || e.code == "KeyD") this.moveRight();
    });

    addEventListener("keyup", (e) => {
      if (e.code == "ArrowUp" || e.code == "KeyW") this.stopMove();
      if (e.code == "ArrowDown" || e.code == "KeyS") this.stopMove();
      if (e.code == "ArrowLeft" || e.code == "KeyA") this.stopSpin();
      if (e.code == "ArrowRight" || e.code == "KeyD") this.stopSpin();
    });

    this.updatePosition();
  }

  updatePosition() {
    let newX =
      this.x + this.onGoing * Math.cos(this.rotationAngle) * this.speed;
    let newY =
      this.y + this.onGoing * Math.sin(this.rotationAngle) * this.speed;

    this.rotationAngle += this.onTurn * this.spinSpeed;
    this.rotationAngle = normalizeAngle(this.rotationAngle);

    if (!this.collision(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  updateRaysPosition() {
    for (let i = 0; i < this.raysNumber; i++) {
      this.rays[i].x = this.x;
      this.rays[i].y = this.y;
      this.rays[i].setAngle(this.rotationAngle);
    }
  }

  collision(x, y) {
    let colliding = false;

    let currentTileX = parseInt(x / this.scenario.tileWidth);
    let currentTileY = parseInt(y / this.scenario.tileHeight);

    if (this.scenario.collision(currentTileX, currentTileY)) {
      colliding = true;
    }

    return colliding;
  }

  moveUp() {
    this.onGoing = 1;
  }

  moveDown() {
    this.onGoing = -1;
  }

  moveLeft() {
    this.onTurn = -1;
  }

  moveRight() {
    this.onTurn = 1;
  }

  stopMove() {
    this.onGoing = 0;
  }

  stopSpin() {
    this.onTurn = 0;
  }

  draw() {
    this.ctx2.fillStyle = "#fff";
    this.ctx2.fillRect(this.x - 3, this.y - 3, 6, 6);
    this.drawDirectionLine();

    for (let i = 0; i < this.raysNumber; i++) {
      this.rays[i].renderWall();
      this.rays[i].draw();
    }
  }

  drawDirectionLine() {
    let xDestiny = this.x + Math.cos(this.rotationAngle) * 20;
    let yDestiny = this.y + Math.sin(this.rotationAngle) * 20;

    this.ctx2.beginPath();
    this.ctx2.moveTo(this.x, this.y);
    this.ctx2.lineTo(xDestiny, yDestiny);
    this.ctx2.strokeStyle = "#00ff00";
    this.ctx2.stroke();
    this.ctx2.closePath();
  }
}
