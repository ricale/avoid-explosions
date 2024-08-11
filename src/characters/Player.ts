import { GameObjects, Scene } from "phaser";
import { Dir } from "../utils/types";

type PlayerOptions = {
  x?: number
  y?: number
  originX?: number
  originY?: number
  width?: number
  height?: number
  showDebugArea?: boolean
}

class Player {
  private _body: GameObjects.Sprite
  private _bodyArea: GameObjects.Rectangle
  private _collisionArea: GameObjects.Rectangle

  private _x: number
  private _y: number
  private _offset: number
  private _width: number
  private _height: number

  private _speed = 0.3;
  private _state: 'idle' | 'running' | 'dead' = 'idle';
  private _moveState?: { dir: Dir, target: number }

  private _showDebugArea: boolean

  constructor (scene: Scene, options: PlayerOptions = {}) {
    const {
      x = 0,
      y = 0,
      originX = 0,
      originY = 0,
      width = 64,
      height = 64,
      showDebugArea = false
    } = options;
    
    this._offset = 15;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._showDebugArea = showDebugArea;

    this._collisionArea = scene.add
      .rectangle(
        this._x,
        this._y,
        this._width,
        this._height,
        0x0000ff,
        0.3,
      )
      .setOrigin(originX, originY);

    this._bodyArea = scene.add
      .rectangle(
        this._bodyX,
        this._bodyY,
        this._bodyWidth,
        this._bodyHeight,
        0xff0000,
        0.3,
      )
      .setOrigin(originX, originY);
    
    if(!this._showDebugArea) {
      this._collisionArea.setVisible(false);
      this._bodyArea.setVisible(false).setActive(false);
    }

    this._body = scene.add.sprite(this._bodyX, this._bodyY, 'player01-idle01')
      .setDisplaySize(this._bodyWidth, this._bodyHeight)
      .setOrigin(originX, originY)

    this.init();
  }

  private get _bodyX () {
    return this._x - this._offset
  }

  private get _bodyY () {
    return this._y - this._offset
  }

  private get _bodyWidth () {
    return this._width + this._offset * 2;
  }

  private get _bodyHeight () {
    return this._height + this._offset * 2;
  }

  get x () {
    return this._x;
  }

  get y () {
    return this._y;
  }

  get collisionObject () {
    return this._collisionArea
  }

  get isDead() {
    return this._state === 'dead';
  }

  private _setPosition() {
    this._body.setPosition(this._bodyX, this._bodyY);
    this._collisionArea.setPosition(this._x, this._y);
    if(this._showDebugArea) {
      this._bodyArea.setPosition(this._bodyX, this._bodyY);
    }
  }

  private _setState(newState: typeof this._state) {
    if(this._state === newState) {
      return;
    }

    this._state = newState;
    switch(this._state) {
      case 'idle':
        this._body.play('player01-idle');
        break;
      case 'running':
        this._body.play('player01-running');
        break;
      case 'dead':
        this._body.play('player01-dying');
        // this._body.setTint(0x000000);
        break;
    }
  }

  private _moveIfNeeded(delta: number) {
    if(this.isDead) {
      return;
    }
    if(!this._moveState) {
      this._setState('idle');
      return;
    }

    this._setState('running');

    const { dir, target } = this._moveState;

    const moveDelta = this._speed * delta;
    
    switch(dir) {
      case Dir.UP:
        this._y = Math.max(this._y - moveDelta, target)
        break;
      case Dir.DOWN:
        this._y = Math.min(this._y + moveDelta, target)
        break;
      case Dir.LEFT:
        this._x = Math.max(this._x - moveDelta, target)
        break;
      case Dir.RIGHT:
        this._x = Math.min(this._x + moveDelta, target)
        break;
    }
    
    switch(dir) {
      case Dir.UP:
      case Dir.DOWN:
        if(this._y === target) {
          this._moveState = undefined;
        }
        break;
      case Dir.LEFT:
      case Dir.RIGHT:
        if(this._x === target) {
          this._moveState = undefined;
        }
        break;
    }

    this._setPosition()
  }

  init(x = this._x, y = this._y) {
    this._setState('idle');
    this._x = x;
    this._y = y;
    this._setPosition();
    this._body.clearTint();
    this._body.play('player01-idle');
  }

  faceTo(dir: Dir, target: number) {
    if(this.isDead) {
      return;
    }
    if(this._moveState) {
      return;
    }
    this._moveState = { dir: dir, target };
  }

  die() {
    this._setState('dead');
  }

  update (_time: number, delta: number) {
    this._moveIfNeeded(delta)
  }
}

export default Player;
