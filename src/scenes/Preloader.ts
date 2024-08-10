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

    this.load.image('bomb01', 'bombs/bomb01.png');
    this.load.image('tile01', 'tiles/tile01.png')
    this.load.image('explosion01-01', 'explosions/explosion01-01.png');
    this.load.image('explosion01-02', 'explosions/explosion01-02.png');
    this.load.image('explosion01-03', 'explosions/explosion01-03.png');
    this.load.image('explosion01-04', 'explosions/explosion01-04.png');
    this.load.image('explosion01-05', 'explosions/explosion01-05.png');
    this.load.image('explosion01-06', 'explosions/explosion01-06.png');
    this.load.image('explosion01-07', 'explosions/explosion01-07.png');
    this.load.image('explosion01-08', 'explosions/explosion01-08.png');
    this.load.image('explosion01-09', 'explosions/explosion01-09.png');
    this.load.image('explosion01-10', 'explosions/explosion01-10.png');
    this.load.image('player01-idle01', 'characters/orc01/idle/orc01-idle00.png');
    this.load.image('player01-idle02', 'characters/orc01/idle/orc01-idle01.png');
    this.load.image('player01-idle03', 'characters/orc01/idle/orc01-idle02.png');
    this.load.image('player01-idle04', 'characters/orc01/idle/orc01-idle03.png');
    this.load.image('player01-idle05', 'characters/orc01/idle/orc01-idle04.png');
    this.load.image('player01-idle06', 'characters/orc01/idle/orc01-idle05.png');
    this.load.image('player01-idle07', 'characters/orc01/idle/orc01-idle06.png');
    this.load.image('player01-idle08', 'characters/orc01/idle/orc01-idle07.png');
    this.load.image('player01-idle09', 'characters/orc01/idle/orc01-idle08.png');
    this.load.image('player01-idle10', 'characters/orc01/idle/orc01-idle09.png');
    this.load.image('player01-idle11', 'characters/orc01/idle/orc01-idle10.png');
    this.load.image('player01-idle12', 'characters/orc01/idle/orc01-idle11.png');
    this.load.image('player01-idle13', 'characters/orc01/idle/orc01-idle12.png');
    this.load.image('player01-idle14', 'characters/orc01/idle/orc01-idle13.png');
    this.load.image('player01-idle15', 'characters/orc01/idle/orc01-idle14.png');
    this.load.image('player01-idle16', 'characters/orc01/idle/orc01-idle15.png');
    this.load.image('player01-idle17', 'characters/orc01/idle/orc01-idle16.png');
    this.load.image('player01-idle18', 'characters/orc01/idle/orc01-idle17.png');

    // this.load.image("logo", "logo.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Game");
  }
}
