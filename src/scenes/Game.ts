import { Scene } from 'phaser';
import World01 from '../worlds/World01';

export class Game extends Scene {
  world: World01

  constructor () {
    super('Game');
  }

  create () {
    this.world = new World01(this, { x: 100, y: 100 });
  }

  update(time: number, delta: number) {
    this.world.update(time, delta);
  }
}
