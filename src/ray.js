import { distanceBetween, normalizeAngle } from "../lib/utils.js";

export default class Ray {
  constructor(ctx, ctx2, scenario, x, y, anglePlayer, incrementAngle, column) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.scenario = scenario;
    this.x = x;
    this.y = y;
    this.anglePlayer = anglePlayer;
    this.incrementAngle = incrementAngle;
    this.angle = anglePlayer + incrementAngle;
    this.column = column;
    this.xIntercept = 0;
    this.yIntercept = 0;
    this.xStep = 0;
    this.yStep = 0;
    this.wallHitX = 0;
    this.wallHitY = 0;
    this.wallHitXHorizontal = 0;
    this.wallHitYHorizontal = 0;
    this.wallHitXVertical = 0;
    this.wallHitYVertical = 0;
    this.distance = 0;
    this.pixelTexture = 0;
    this.tiles = new Image();
    this.tiles.src = "./src/img/walls.png";
    this.idTexture = 0;
  }

  cast() {
    this.down = false;
    this.left = false;

    if (this.angle < Math.PI) this.down = true;

    if (this.angle > Math.PI / 2 && this.angle < (3 * Math.PI) / 2)
      this.left = true;

    // Horizontal
    let horizontalCollition = false;

    this.yIntercept =
      Math.floor(this.y / this.scenario.tileHeight) * this.scenario.tileHeight;

    if (this.down) this.yIntercept += this.scenario.tileHeight;

    let adyacent = (this.yIntercept - this.y) / Math.tan(this.angle);
    this.xIntercept = this.x + adyacent;

    // calculate steps
    this.yStep = this.scenario.tileHeight;
    this.xStep = this.yStep / Math.tan(this.angle);

    if (!this.down) this.yStep = -this.yStep;

    if ((this.left && this.xStep > 0) || (!this.left && this.xStep < 0)) {
      this.xStep *= -1;
    }

    let nextXHorizontal = this.xIntercept;
    let nextYHorizontal = this.yIntercept;

    if (!this.down) nextYHorizontal--;

    while (!horizontalCollition) {
      let tileX = parseInt(nextXHorizontal / this.scenario.tileWidth);
      let tileY = parseInt(nextYHorizontal / this.scenario.tileHeight);

      if (this.scenario.collision(tileX, tileY)) {
        horizontalCollition = true;
        this.wallHitXHorizontal = nextXHorizontal;
        this.wallHitYHorizontal = nextYHorizontal;
      } else {
        nextXHorizontal += this.xStep;
        nextYHorizontal += this.yStep;
      }
    }

    // Vertical
    let verticalCollition = false;

    this.xIntercept =
      Math.floor(this.x / this.scenario.tileWidth) * this.scenario.tileWidth;

    if (!this.left) this.xIntercept += this.scenario.tileWidth;

    let opposite = (this.xIntercept - this.x) * Math.tan(this.angle);
    this.yIntercept = this.y + opposite;

    // calculate steps

    this.xStep = this.scenario.tileWidth;

    if (this.left) this.xStep = -this.xStep;

    this.yStep = this.scenario.tileWidth * Math.tan(this.angle);

    if ((!this.down && this.yStep > 0) || (this.down && this.yStep < 0)) {
      this.yStep = -this.yStep;
    }

    let nextXVertical = this.xIntercept;
    let nextYVertical = this.yIntercept;

    if (this.left) nextXVertical--;

    while (
      !verticalCollition &&
      nextXVertical >= 0 &&
      nextYVertical >= 0 &&
      nextXVertical < this.ctx.canvas.width &&
      nextYVertical < this.ctx.canvas.height
    ) {
      let tileX = parseInt(nextXVertical / this.scenario.tileWidth);
      let tileY = parseInt(nextYVertical / this.scenario.tileHeight);

      if (this.scenario.collision(tileX, tileY)) {
        verticalCollition = true;
        this.wallHitXVertical = nextXVertical;
        this.wallHitYVertical = nextYVertical;
      } else {
        nextXVertical += this.xStep;
        nextYVertical += this.yStep;
      }
    }

    let horizontalDistance = 9999;
    let verticalDistance = 9999;

    if (horizontalCollition) {
      horizontalDistance = distanceBetween(
        this.x,
        this.y,
        this.wallHitXHorizontal,
        this.wallHitYHorizontal
      );
    }

    if (verticalCollition) {
      verticalDistance = distanceBetween(
        this.x,
        this.y,
        this.wallHitXVertical,
        this.wallHitYVertical
      );
    }

    if (horizontalDistance < verticalDistance) {
      this.wallHitX = this.wallHitXHorizontal;
      this.wallHitY = this.wallHitYHorizontal;
      this.distance = horizontalDistance;

      let tile = parseInt(this.wallHitX / this.scenario.tileWidth);
      this.pixelTexture = this.wallHitX - tile * this.scenario.tileWidth;
    } else {
      this.wallHitX = this.wallHitXVertical;
      this.wallHitY = this.wallHitYVertical;
      this.distance = verticalDistance;

      let tile = parseInt(this.wallHitY / this.scenario.tileHeight);
      this.pixelTexture = this.wallHitY - tile * this.scenario.tileHeight;
    }

    this.idTexture = this.scenario.getTile(this.wallHitX, this.wallHitY);

    // Fish eye correction
    this.distance = this.distance * Math.cos(this.anglePlayer - this.angle);
  }

  setAngle(angle) {
    this.anglePlayer = angle;
    this.angle = normalizeAngle(angle + this.incrementAngle);
  }

  draw() {
    this.cast();

    let xDestiny = this.wallHitX;
    let yDestiny = this.wallHitY;

    this.ctx2.beginPath();
    this.ctx2.moveTo(this.x, this.y);
    this.ctx2.lineTo(xDestiny, yDestiny);
    this.ctx2.strokeStyle = "#ff0000";
    this.ctx2.stroke();
    this.ctx2.closePath();
  }

  renderWall() {
    this.cast();

    const tileHeight = 500;
    const middleFOV = 30;
    let distancePlaneProyection =
      this.ctx.canvas.width / 2 / Math.tan(middleFOV);
    let wallHeight = (tileHeight / this.distance) * distancePlaneProyection;

    let y0 = parseInt(this.ctx.canvas.height / 2) - parseInt(wallHeight / 2);
    let y1 = y0 + wallHeight;
    let x = this.column;

    // Draw the image
    let heightTexture = 64;
    let heightImage = y0 - y1;

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      this.tiles,
      this.pixelTexture,
      (this.idTexture - 1) * heightTexture,
      1,
      heightTexture,
      this.column,
      y1,
      1,
      heightImage
    );
  }
}
