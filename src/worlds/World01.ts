import { GameObjects, Scene } from "phaser";
import Player from "../characters/Player";
import { Dir } from "../utils/types";
import CrossBomb from "../bombs/CrossBomb";

type World01Options = {
  x?: number
  y?: number
  tileSize?: number
  gap?: number
  columnCount?: number
  rowCount?: number
  intervalForSetBomb?: number
}

class World01 {
  private _tiles: GameObjects.Image[][]
  private _bombs: CrossBomb[]

  private _x: number
  private _y: number
  private _tileSize: number
  private _gap: number
  private _columnCount: number
  private _rowCount: number

  private _pastMsForSetBomb: number;
  private _intervalForSetBomb: number;

  constructor (scene: Scene, options: World01Options = {}) {
    const {
      x = 0,
      y = 0,
      tileSize = 64,
      gap = 4,
      columnCount = 5,
      rowCount = 5,
      intervalForSetBomb = 4000,
    } = options;

    this._x = x;
    this._y = y;
    this._tileSize = tileSize;
    this._gap = gap;
    this._columnCount = columnCount;
    this._rowCount = rowCount;

    this._intervalForSetBomb = intervalForSetBomb;

    this._tiles = [...new Array(this._rowCount)].map((_, i) =>
      [...new Array(this._columnCount)].map((_, j) => {
        return scene.add.image(
          this._x + this._tileSize * j + this._gap * (j),
          this._y + this._tileSize * i + this._gap * (i),
          'tile01'
        )
          .setOrigin(0, 0)
          .setDisplaySize(this._tileSize, this._tileSize)
      })
    );

    const bombCount = Math.min(this._rowCount, this._columnCount) - 1;
    this._bombs = [...new Array(bombCount)].map(() => {
      return new CrossBomb(scene, {
        explosionStep: this._tileSize + this._gap,
        msToExplosion: this._intervalForSetBomb - 1000,
        explosionCountInDir: 4,
      })
    })

    this._pastMsForSetBomb = this._intervalForSetBomb - 1000;
  }

  private get _step () {
    return this._tileSize + this._gap
  }

  private _isValidToMove (character: Player, dir: Dir) {
    const pos = {
      x: (character.x - this._x) / this._step,
      y: (character.y - this._y) / this._step,
    }

    switch(dir) {
      case Dir.UP:
        return {
          isValid: pos.y > 0,
          target: (pos.y - 1) * this._step + this._y,
        };
      case Dir.DOWN:
        return {
          isValid: pos.y < this._rowCount - 1,
          target: (pos.y + 1) * this._step + this._y,
        };
      case Dir.LEFT:
        return {
          isValid: pos.x > 0,
          target: (pos.x - 1) * this._step + this._x,
        };
      case Dir.RIGHT:
        return {
          isValid: pos.x < this._columnCount - 1,
          target: (pos.x + 1) * this._step + this._x,
        };
      default:
        return {
          isValid: false,
          target: 0
        };
    }
  }

  moveCharacterIfPossible (character: Player, dir: Dir) {
    const { isValid, target } = this._isValidToMove(character, dir);
    if(!isValid) {
      return;
    }
    character.faceTo(dir, target);
  }

  private _getRandom(cands: number[]) {
    const random = Math.floor(Math.random() * cands.length);
    return cands.splice(random, 1)[0];
  }

  private _putBombs() {
    const colCands = [...new Array(this._columnCount)].map((_, i) => i);
    const rowCands = [...new Array(this._rowCount)].map((_, i) => i);
    
    for(const bomb of this._bombs) {
      const col = this._getRandom(colCands);
      const row = this._getRandom(rowCands);
      bomb.activate(
        col * this._step + this._x,
        row * this._step + this._x
      );
    }
  }

  update (_time: number, delta: number) {
    this._pastMsForSetBomb += delta;
    if(this._pastMsForSetBomb > this._intervalForSetBomb) {
      this._pastMsForSetBomb = 0;
      this._putBombs();
    }
    this._bombs.map(bomb => bomb.update(_time, delta));
  }
}

export default World01;
