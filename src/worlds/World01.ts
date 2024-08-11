import { Actions, Scene, Types } from "phaser";
import Player from "../characters/Player";
import { Dir } from "../utils/types";
import CrossBomb from "../bombs/CrossBomb";
import Timer from "../Timer";

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
  private _player: Player;
  private _bombs: CrossBomb[]
  private _timer: Timer

  private _cursors: Types.Input.Keyboard.CursorKeys | undefined

  private _x: number
  private _y: number
  private _tileSize: number
  private _gap: number
  private _columnCount: number
  private _rowCount: number

  private _pastMsForSetBomb: number;
  private _intervalForSetBomb: number;

  private _state: 'active' | 'inactive';

  constructor (scene: Scene, options: World01Options = {}) {
    const {
      x = 0,
      y = 0,
      tileSize = 64,
      gap = 4,
      columnCount = 5,
      rowCount = 5,
      intervalForSetBomb = 3500,
    } = options;

    this._state = 'active';

    this._x = x + tileSize / 2 + gap;
    this._y = y + tileSize / 2 + gap;
    this._tileSize = tileSize;
    this._gap = gap;
    this._columnCount = columnCount;
    this._rowCount = rowCount;

    this._intervalForSetBomb = intervalForSetBomb;

    const boardWidth = (this._tileSize + this._gap) * (this._columnCount + 1);
    const boardHeight = (this._tileSize + this._gap) * (this._rowCount + 1);
    scene.add
      .image(
        this._x - this._gap - this._tileSize / 2  ,
        this._y - this._gap - this._tileSize / 2  ,
        'tile02'
      )
      .setOrigin(0, 0)
      .setDisplaySize(boardWidth, boardHeight);

    [...new Array(this._rowCount)].map((_, i) =>
      [...new Array(this._columnCount)].map((_, j) => {
        return scene.add
          .image(
            this._x + this._tileSize * j + this._gap * (j),
            this._y + this._tileSize * i + this._gap * (i),
            'tile01'
          )
          .setOrigin(0, 0)
          .setDisplaySize(this._tileSize, this._tileSize)
      })
    );

    const bombCount = Math.min(this._rowCount, this._columnCount) - 2;
    const explosionStep = this._tileSize + this._gap;
    const bombOptions = {
      width: this._tileSize,
      height: this._tileSize,
      explosionStep: this._tileSize + this._gap,
      msToExplosion: this._intervalForSetBomb - 1000,
      explosionCountInDir: Math.max(this._rowCount, this._columnCount),
      explosionMinX: this._x,
      explosionMaxX: this._x + explosionStep * this._columnCount,
      explosionMinY: this._y,
      explosionMaxY: this._y + explosionStep * this._rowCount,
    };
    this._bombs = [...new Array(bombCount)].map(() => {
      return new CrossBomb(scene, bombOptions)
    });

    this._player = new Player(scene, {
      x: this._x,
      y: this._y,
      width: this._tileSize,
      height: this._tileSize,
    });

    this._timer = new Timer(scene, {
      x: boardWidth + 20,
      y: 100,
    })
    this._timer.start();

    this._cursors = scene.input.keyboard?.createCursorKeys();

    this._pastMsForSetBomb = this._intervalForSetBomb - 1000;
  }

  private get _step () {
    return this._tileSize + this._gap
  }

  get isActive () {
    return this._state === 'active';
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

  private _moveCharacterIfPossible (character: Player, dir: Dir) {
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
    if(this._player.isDead) {
      return;
    }

    const colCands = [...new Array(this._columnCount)].map((_, i) => i);
    const rowCands = [...new Array(this._rowCount)].map((_, i) => i);
    
    for(const bomb of this._bombs) {
      const col = this._getRandom(colCands);
      const row = this._getRandom(rowCands);
      bomb.activate(
        col * this._step + this._x,
        row * this._step + this._y
      );
    }
  }

  private _updatePlayer(time: number, delta: number) {
    if(this._cursors) {
      if(this._cursors.left.isDown) {
        this._moveCharacterIfPossible(this._player, Dir.LEFT)
      } else if(this._cursors.right.isDown) {
        this._moveCharacterIfPossible(this._player, Dir.RIGHT)
      } else if(this._cursors.down.isDown) {
        this._moveCharacterIfPossible(this._player, Dir.DOWN)
      } else if(this._cursors.up.isDown) {
        this._moveCharacterIfPossible(this._player, Dir.UP)
      }
    }
    this._player.update(time, delta);
  }

  private _updateBombs(time: number, delta: number) {
    this._pastMsForSetBomb += delta;
    if(this._pastMsForSetBomb > this._intervalForSetBomb) {
      this._pastMsForSetBomb = 0;
      this._putBombs();
    }
    this._bombs.map(bomb => bomb.update(time, delta));
  }

  private _playerDied() {
    this._state = 'inactive';
    this._player.die();
    this._bombs.map(item => item.lockAsExploded())
    this._timer.stop();
  }

  private _checkCollision() {
    for(const bomb of this._bombs) {
      if(bomb.state !== 'exploded') {
        continue;
      }
      const collided = !!Actions.GetFirst(
        bomb.explosionCollisionObjects,
        { x: this._player.x, y: this._player.y },
      )
      if(collided) {
        this._playerDied();
        break;
      }
    }
  }

  restart() {
    if(this.isActive) {
      return;
    }
    this._pastMsForSetBomb = this._intervalForSetBomb - 1000;
    this._bombs.map(item => item.init())
    this._player.init(this._x, this._y);
    this._timer.start();
  }

  update (time: number, delta: number) {
    this._updatePlayer(time, delta);
    this._updateBombs(time, delta)
    this._timer.update(time, delta);

    if(!this._player.isDead) {
      this._checkCollision();
    }
  }
}

export default World01;
