"use strict";
(() => {
  class drawPuzzle {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.ctx = canvas.getContext("2d");
      this.img = document.createElement("img");
      this.img.src = "https://atsushi-cr.github.io/15Puzzle/img/15puzzle.png";
      this.TILE_SIZE = 70;
      this.img.addEventListener("load", () => {
        this.render();
      });

      canvas.addEventListener("click", (e) => {
        if (this.puzzle.getIsCompleted()) {
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        this.puzzle.swapTile(col, row);
        this.render();

        if (this.puzzle.isCleared()) {
          this.puzzle.setIsCompleted(true);
          this.gameClear();
        }
      });
    }

    gameClear() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "28px Arial";
      this.ctx.fillText("GAME CLEAR!!", 40, 150);
    }

    render() {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          this.puzzleRender(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    puzzleRender(n, col, row) {
      this.ctx.drawImage(
        this.img,
        (n % 4) * this.TILE_SIZE,
        Math.floor(n / 4) * this.TILE_SIZE,
        this.TILE_SIZE,
        this.TILE_SIZE,
        col * this.TILE_SIZE,
        row * this.TILE_SIZE,
        this.TILE_SIZE,
        this.TILE_SIZE
      );
    }
  }

  class Puzzle {
    constructor(level) {
      this.level = level;
      this.tiles = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];
      this.UDLR = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      this.isCompleted = false;
      do {
        this.shuffle(this.level);
      } while (this.isCleared());
    }

    getTile(row, col) {
      return this.tiles[row][col];
    }

    getIsCompleted() {
      return this.isCompleted;
    }

    setIsCompleted(value) {
      this.isCompleted = value;
    }

    shuffle(n) {
      let blankCol = 3;
      let blankRow = 3;

      for (let i = 0; i < n; i++) {
        let destCol, destRow;
        do {
          const dir = Math.floor(Math.random() * 4);
          destCol = blankCol + this.UDLR[dir][0];
          destRow = blankRow + this.UDLR[dir][1];
        } while (this.destRule(destCol, destRow));

        [this.tiles[blankRow][blankCol], this.tiles[destRow][destCol]] = [
          this.tiles[destRow][destCol],
          this.tiles[blankRow][blankCol],
        ];
        [blankCol, blankRow] = [destCol, destRow];
      }
    }

    swapTile(col, row) {
      if (this.tiles[row][col] === 15) {
        return;
      }
      for (let i = 0; i < 4; i++) {
        const destCol = col + this.UDLR[i][0];
        const destRow = row + this.UDLR[i][1];

        if (this.destRule(destCol, destRow)) {
          continue;
        }

        if (this.tiles[destRow][destCol] === 15) {
          [this.tiles[row][col], this.tiles[destRow][destCol]] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
          break;
        }
      }
    }

    destRule(destCol, destRow) {
      return destCol < 0 || destCol > 3 || destRow < 0 || destRow > 3;
    }

    isCleared() {
      let i = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.tiles[row][col] !== i++) {
            return false;
          }
        }
      }
      return true;
    }
  }

  const canvas = document.querySelector("canvas");
  if (typeof canvas.getContext === "undefined") {
    return;
  }

  new drawPuzzle(new Puzzle(1000), canvas);
})();
