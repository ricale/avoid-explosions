import { GameObjects, Scene, Time } from "phaser";

type CrossBombOptions = {
  width?: number
  height?: number
  msToExplosion?: number
  explosionStep?: number
  explosionDuration?: number
  explosionMinX: number
  explosionMaxX: number
  explosionMinY: number
  explosionMaxY: number
}

class CrossBomb {
  private _clock: Time.Clock
  private _body: GameObjects.Image
  private _countdown: GameObjects.Text
  private _explosions: GameObjects.Image[]
  
  private _x: number
  private _y: number

  private _state: 'active' | 'exploded' | 'inactive' = 'inactive'
  private _msToExplosion: number
  private _remainingMs: number
  private _explosionEffectTimer: Time.TimerEvent | undefined
  private _explosionDuration: number

  private _explosionStep: number
  private _explosionMinX: number
  private _explosionMaxX: number
  private _explosionMinY: number
  private _explosionMaxY: number

  constructor(scene: Scene, options: CrossBombOptions) {
    const {
      width = 64,
      height = 64,
      msToExplosion = 4000,
      explosionStep = 64,
      explosionDuration = 600,
      explosionMinX,
      explosionMaxX,
      explosionMinY,
      explosionMaxY,
    } = options;

    this._clock = scene.time

    this._body = scene.add.image(0, 0, 'bomb01')
      .setOrigin(0, 0)
      .setDisplaySize(width, height)
      .setVisible(false)
      .setActive(false);

    this._countdown = scene.add.text(0, 0, '0')
      .setOrigin(0, 0)
      .setVisible(false)
      .setActive(false);

    this._msToExplosion = msToExplosion;
    this._explosionDuration = explosionDuration;
    this._explosionStep = explosionStep;
    this._explosionMinX = explosionMinX;
    this._explosionMaxX = explosionMaxX;
    this._explosionMinY = explosionMinY;
    this._explosionMaxY = explosionMaxY;

    const explosionCountInColumn = Math.floor(
      (this._explosionMaxY - this._explosionMinY) / this._explosionStep
    );
    const explosionCountInRow = Math.floor(
      (this._explosionMaxX - this._explosionMinX) / this._explosionStep
    );
    const explosionCount = explosionCountInColumn + explosionCountInRow - 1;
    this._explosions = [...new Array(explosionCount)].map(() => {
      return scene.add.image(0, 0, 'explosion01-06')
        .setOrigin(0, 0)
        .setDisplaySize(width, height)
        .setVisible(false)
        .setActive(false);
    });
  }

  get state () {
    return this._state;
  }

  get explosionCollisionObjects() {
    return this._explosions;
  }

  private getCountdownText() {
    return (this._remainingMs / 1000).toFixed(1)
  }

  private _deactivateExplosionsIfNeeded (options: {force?: boolean} = {}) {
    if(this._explosionEffectTimer) {
      const explosionProgress = this._explosionEffectTimer.getProgress();
      if(explosionProgress === 1 || options.force) {
        this._body.clearTint().setVisible(false).setActive(false);
        this._explosions.map(explosion => explosion.setVisible(false).setActive(false))
        this._explosionEffectTimer.remove();
        this._explosionEffectTimer = undefined;
        this._state = 'inactive'
      }
    }
  }

  private _explode() {
    this._body.setTint(0xff0000);
    this._countdown.setVisible(false)
      .setActive(false)

    const coords: [number, number][] = [[this._x, this._y]];
    for(let x = this._explosionMinX; x < this._explosionMaxX; x += this._explosionStep) {
      if(x !== this._x) {
        coords.push([x, this._y]);
      }
    }
    for(let y = this._explosionMinX; y < this._explosionMaxX; y += this._explosionStep) {
      if(y !== this._y) {
        coords.push([this._x, y]);
      }
    }

    for(let i = 0; i < this._explosions.length; i++) {
      this._explosions[i].setActive(true)
        .setPosition(coords[i][0], coords[i][1])
        .setVisible(true);
    }

    this._explosionEffectTimer = new Time.TimerEvent({
      delay: this._explosionDuration,
    });
    this._clock.addEvent(this._explosionEffectTimer)
    this._state = 'exploded';
  }

  activate(x: number, y: number) {
    this._deactivateExplosionsIfNeeded({ force: true });

    this._x = x;
    this._y = y;
    this._state = 'active';

    this._body.setActive(true)
      .setPosition(this._x, this._y)
      .setVisible(true);

    this._remainingMs = this._msToExplosion;
    this._countdown.setActive(true)
      .setPosition(this._x, this._y)
      .setVisible(true)
      .setText(this.getCountdownText())
  }

  init() {
    this._body.clearTint().setVisible(false).setActive(false);
    this._explosions.map(explosion => explosion.setVisible(false).setActive(false))
    this._state = 'inactive';
  }

  lockAsExploded() {
    if(this._state !== 'exploded') {
      return;
    }
    if(this._explosionEffectTimer) {
      this._explosionEffectTimer.remove();
      this._explosionEffectTimer = undefined;
    }
  }

  update(_time: number, delta: number) {
    this._deactivateExplosionsIfNeeded();
    
    if(this._state === 'active') {
      this._remainingMs -= delta;
      if(this._remainingMs > 0) {
        this._countdown.setText(this.getCountdownText())
      } else {
        this._explode()
      }
    }
  }
}

export default CrossBomb;
