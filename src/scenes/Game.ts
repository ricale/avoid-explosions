import { GameObjects, Scene } from 'phaser';
import World01 from '../worlds/World01';
import Timer from '../Timer';

export class Game extends Scene {
  private _world: World01
  private _timer: Timer
  private _restartMessage: GameObjects.Text
  private _keys: Record<string, { isDown: boolean }> | undefined;

  private _state: 'playing' | 'idle'

  constructor () {
    super('Game');
  }

  private _setState(newState: typeof this._state) {
    if(this._state === newState) {
      return;
    }

    this._state = newState;

    switch(this._state) {
      case 'idle':
        this._restartMessage.setVisible(true);
        break;
      case 'playing':
        this._restartMessage.setVisible(false);
        break;
    }
  }

  private _onChangeWorldState = (state: World01['_state']) => {
    console.log('_onChangeWorldState', state)
    switch(state) {
      case 'active':
        this._timer.start();
        this._setState('playing');
        break;
      case 'inactive':
        this._timer.stop();
        this._setState('idle');
        break;
    }
  }

  create () {
    this._world = new World01(this, {
      x: 1,
      y: 1,
      columnCount: 8,
      rowCount: 8,
      tileSize: 60,
      onChangeState: this._onChangeWorldState
    });

    this._timer = new Timer(this, {
      x: this._world.x + this._world.width  + 20,
      y: 100,
    });
    
    this._restartMessage = this.add.text(
      this._world.x + this._world.width  + 20,
      140,
      "Press 'R' to restart"
    ).setVisible(false);

    this._world.start();

    this._keys = this.input.keyboard?.addKeys('R') as typeof this._keys;
  }

  update(time: number, delta: number) {
    this._world.update(time, delta);
    this._timer.update(time, delta);

    if(this._state === 'idle' && this._keys?.R.isDown) {
      this._world.start();
    }
  }
}
