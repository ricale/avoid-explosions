import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image('bomb', 'bomb.png');
    this.load.image('tile01', 'tiles/tile_01.png')
    this.load.image('explosion01', 'explosions/explosion_01.png');
    this.load.image('explosion02', 'explosions/explosion_02.png');
    this.load.image('explosion03', 'explosions/explosion_03.png');
    this.load.image('explosion04', 'explosions/explosion_04.png');
    this.load.image('explosion05', 'explosions/explosion_05.png');
    this.load.image('explosion06', 'explosions/explosion_06.png');
    this.load.image('explosion07', 'explosions/explosion_07.png');
    this.load.image('explosion08', 'explosions/explosion_08.png');
    this.load.image('explosion09', 'explosions/explosion_09.png');
    this.load.image('explosion10', 'explosions/explosion_10.png');
    this.load.image('playerIdle01', 'characters/orc_01/idle/orc_idle_00.png');
    this.load.image('playerIdle02', 'characters/orc_01/idle/orc_idle_01.png');
    this.load.image('playerIdle03', 'characters/orc_01/idle/orc_idle_02.png');
    this.load.image('playerIdle04', 'characters/orc_01/idle/orc_idle_03.png');
    this.load.image('playerIdle05', 'characters/orc_01/idle/orc_idle_04.png');
    this.load.image('playerIdle06', 'characters/orc_01/idle/orc_idle_05.png');
    this.load.image('playerIdle07', 'characters/orc_01/idle/orc_idle_06.png');
    this.load.image('playerIdle08', 'characters/orc_01/idle/orc_idle_07.png');
    this.load.image('playerIdle09', 'characters/orc_01/idle/orc_idle_08.png');
    this.load.image('playerIdle10', 'characters/orc_01/idle/orc_idle_09.png');
    this.load.image('playerIdle11', 'characters/orc_01/idle/orc_idle_10.png');
    this.load.image('playerIdle12', 'characters/orc_01/idle/orc_idle_11.png');
    this.load.image('playerIdle13', 'characters/orc_01/idle/orc_idle_12.png');
    this.load.image('playerIdle14', 'characters/orc_01/idle/orc_idle_13.png');
    this.load.image('playerIdle15', 'characters/orc_01/idle/orc_idle_14.png');
    this.load.image('playerIdle16', 'characters/orc_01/idle/orc_idle_15.png');
    this.load.image('playerIdle17', 'characters/orc_01/idle/orc_idle_16.png');
    this.load.image('playerIdle18', 'characters/orc_01/idle/orc_idle_17.png');

    // this.load.image("logo", "logo.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Game");
  }
}
