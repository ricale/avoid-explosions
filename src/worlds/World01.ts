import { GameObjects, Scene } from "phaser";
import Player from "../characters/Player";
import { Dir } from "../utils/types";

type World01Options = {
  x?: number
  y?: number
  tileSize?: number
  gap?: number
  columnCount?: number
  rowCount?: number
}

class World01 {
  tiles: GameObjects.Image[][]
  character: Player

  private _x: number
  private _y: number
  private _tileSize: number
  private _gap: number
  private _columnCount: number
  private _rowCount: number

  constructor (scene: Scene, options: World01Options = {}) {
    const {
      x = 0,
      y = 0,
      tileSize = 64,
      gap = 4,
      columnCount = 5,
      rowCount = 5,
    } = options;

    this._x = x;
    this._y = y;
    this._tileSize = tileSize;
    this._gap = gap;
    this._columnCount = columnCount;
    this._rowCount = rowCount;

    this.tiles = [...new Array(this._rowCount)].map((_, i) =>
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

  // update (time: number, delta: number) {

  // }
}

export default World01