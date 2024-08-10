import { Scene, Types } from 'phaser';
import Player from '../characters/Player';
import World01 from '../worlds/World01';
import { Dir } from '../utils/types';

export class Game extends Scene {
  player: Player
  world: World01
  cursors?: Types.Input.Keyboard.CursorKeys
  // background: Phaser.GameObjects.Image;
  // msg_text : Phaser.GameObjects.Text;

  constructor () {
    super('Game');
  }

  create () {
    this.cursors = this.input.keyboard?.createCursorKeys();

    this.world = new World01(this, { x: 100, y: 100 });
    this.player = new Player(this, { x: 100, y: 100 });
  }

  update(time: number, delta: number) {
    if(this.cursors) {
      if(this.cursors.left.isDown) {
        this.world.moveCharacterIfPossible(this.player, Dir.LEFT)
      } else if(this.cursors.right.isDown) {
        this.world.moveCharacterIfPossible(this.player, Dir.RIGHT)
      } else if(this.cursors.down.isDown) {
        this.world.moveCharacterIfPossible(this.player, Dir.DOWN)
      } else if(this.cursors.up.isDown) {
        this.world.moveCharacterIfPossible(this.player, Dir.UP)
      }
    }

    this.world.update(time, delta);
    this.player.update(time, delta);
  }
}
