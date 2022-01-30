export default class Level {
  constructor(ctx, matrixLevel) {
    this.ctx = ctx;
    this.matrixLevel = matrixLevel;
    this.matrixWidth = matrixLevel[0].length;
    this.matrixHeight = matrixLevel.length;
    this.tileWidth = ctx.canvas.width / this.matrixWidth;
    this.tileHeight = ctx.canvas.height / this.matrixHeight;
    this.tiles = new Image();
    this.tiles.src = "./src/img/walls.png";
  }

  collision(x, y) {
    let collided = false;

    if (this.matrixLevel[y][x] != 0) collided = true;

    return collided;
  }

  getTile(x, y) {
    let tileX = parseInt(x / this.tileWidth);
    let tileY = parseInt(y / this.tileHeight);

    return this.matrixLevel[tileY][tileX];
  }

  draw() {
    const solidTileColor = "#000";
    const noSolidTileColor = "#752300";

    for (let i = 0; i < this.matrixHeight; i++) {
      for (let j = 0; j < this.matrixWidth; j++) {
        const tile = this.matrixLevel[i][j];

        if (tile === 0) {
          this.ctx.fillStyle = noSolidTileColor;
          this.ctx.fillRect(
            j * this.tileWidth,
            i * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }

        if (tile === 1) {
          this.ctx.drawImage(
            this.tiles,
            0,
            0,
            50,
            50,
            j * this.tileWidth,
            i * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }

        if (tile === 2) {
          this.ctx.drawImage(
            this.tiles,
            0,
            64,
            50,
            50,
            j * this.tileWidth,
            i * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }

        if (tile === 3) {
          this.ctx.drawImage(
            this.tiles,
            0,
            128,
            50,
            50,
            j * this.tileWidth,
            i * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }
      }
    }
  }
}
