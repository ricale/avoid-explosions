import { Scene } from 'phaser';
import World01 from '../worlds/World01';

export class Game extends Scene {
  private _world: World01
  private _keys: Record<string, { isDown: boolean }> | undefined;

  constructor () {
    super('Game');
  }

  create () {
    this._world = new World01(this, {
      x: 1,
      y: 1,
      columnCount: 8,
      rowCount: 8,
      tileSize: 60,
    });
    this._keys = this.input.keyboard?.addKeys('R') as typeof this._keys;
  }

  update(time: number, delta: number) {
    this._world.update(time, delta);

    if(this._keys?.R.isDown) {
      this._world.restart();
    }
  }
}
