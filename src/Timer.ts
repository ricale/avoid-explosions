import { GameObjects, Scene } from "phaser";

type TimerOptions = {
  x?: number
  y?: number
}

class Timer {
  private _display: GameObjects.Text

  private _x: number
  private _y: number

  private _state: 'active' | 'inactive' | 'hide' = 'inactive';
  private _pastMs = 0;

  constructor(scene: Scene, options: TimerOptions = {}) {
    const {
      x = 0,
      y = 0,
    } = options;

    this._x = x;
    this._y = y;

    this._display = scene.add.text(this._x, this._y, '00:00')
      .setVisible(false)
      .setActive(false)
  }

  get state () {
    return this._state;
  }

  get currentTime() {
    return this._pastMs;
  }

  private _getTimeText() {
    const ms = Math.floor(this._pastMs % 1000)
    const seconds = Math.floor(this._pastMs / 1000) % 60
    const minutes = Math.floor(Math.floor(this._pastMs / 1000) / 60)

    return (
      `${minutes}`.padStart(2, '0')
      + ':'
      + `${seconds}`.padStart(2, '0')
      + '.'
      + `${ms}`.padStart(3, '0')
    );
  }

  start() {
    this._pastMs = 0;
    this._state = 'active'
    this._display.setActive(true)
      .setVisible(true)
      .setText(this._getTimeText())
  }

  stop() {
    this._state = 'inactive'
    this._display.setActive(true)
      .setVisible(true)
  }

  hide() {
    this._state = 'hide'
    this._display.setVisible(false)
      .setActive(false)
  }

  update(_time: number, delta: number) {
    if(this._state !== 'active') {
      return;
    }

    this._pastMs += delta;
    this._display.setText(this._getTimeText())
  }
}

export default Timer;
