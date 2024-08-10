import { GameObjects, Scene, Time } from "phaser";

type CrossBombOptions = {
  width?: number
  height?: number
  msToExplosion?: number
  explosionStep?: number
  explosionCountInDir?: number
  explosionDuration?: number
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
  private _explosionCountInDir: number

  constructor(scene: Scene, options: CrossBombOptions = {}) {
    const {
      width = 64,
      height = 64,
      msToExplosion = 4000,
      explosionStep = 64,
      explosionCountInDir = 4,
      explosionDuration = 600,
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
    this._explosionStep = explosionStep;
    this._explosionCountInDir = explosionCountInDir;
    this._explosionDuration = explosionDuration;

    this._explosions = [...new Array(this._explosionCountInDir * 4 + 1)].map(() => {
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
        this._explosions.map(explosion => explosion.setVisible(false).setActive(false))
        this._explosionEffectTimer.remove();
        this._explosionEffectTimer = undefined;
        this._state = 'inactive'
      }
    }
  }

  private _explode() {
    this._body.setVisible(false)
      .setActive(false)
    this._countdown.setVisible(false)
      .setActive(false)

    const countInDirArray = [...new Array(this._explosionCountInDir)];
    const diffs = [
      ...countInDirArray.map((_, i) =>
        [this._explosionStep * (i + 1), 0]
      ),
      ...countInDirArray.map((_, i) =>
        [-this._explosionStep * (i + 1), 0]
      ),
      ...countInDirArray.map((_, i) =>
        [0, this._explosionStep * (i + 1)]
      ),
      ...countInDirArray.map((_, i) =>
        [0, -this._explosionStep * (i + 1)]
      ),
      [0, 0],
    ]

    for(let i = 0; i < this._explosions.length; i++) {
      this._explosions[i].setActive(true)
        .setPosition(
          this._x + diffs[i][0],
          this._y + diffs[i][1]
        )
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
    this._countdown.setActive(false)
      .setPosition(this._x, this._y)
      .setVisible(true)
      .setText(this.getCountdownText())

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
