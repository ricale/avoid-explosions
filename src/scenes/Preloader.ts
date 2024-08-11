import { Scene } from "phaser";

const EXPLOSION_FRAME_COUNT = 10;
const PLAYER_IDLE_FRAME_COUNT = 18;
const PLAYER_RUNNING_FRAME_COUNT = 12;
const PLAYER_DYING_FRAME_COUNT = 15;

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    const sceneWidth = this.sys.game.canvas.width;
    const x = sceneWidth / 2;
    const y = 384;
    const width = sceneWidth * 0.8;
    const height = 32;
    const padding = 2;

    this.add.rectangle(x, y, width, height)
      .setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(
      sceneWidth * 0.1 + 2,
      y,
      0,
      height - padding * 2,
      0xffffff
    );

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = (width - padding * 2) * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image('bomb01', 'bombs/bomb01.png');
    this.load.image('tile01', 'tiles/tile01.png')
    this.load.image('tile02', 'tiles/tile02.png')

    for(let i = 0; i < EXPLOSION_FRAME_COUNT; i++) {
      const idx = `${i}`.padStart(2, '0');
      this.load.image(
        `explosion01-${idx}`,
        `explosions/explosion01-${idx}.png`
      );
    }
    
    for(let i = 0; i < PLAYER_IDLE_FRAME_COUNT; i++) {
      this.load.image(
        `player01-idle${`${i + 1}`.padStart(2, '0')}`,
        `characters/orc01/idle/orc01-idle${`${i}`.padStart(2, '0')}.png`
      );
    }

    for(let i = 0; i < PLAYER_RUNNING_FRAME_COUNT; i++) {
      this.load.image(
        `player01-running${`${i + 1}`.padStart(2, '0')}`,
        `characters/orc01/running/orc01-running${`${i}`.padStart(2, '0')}.png`
      );
    }

    for(let i = 0; i < PLAYER_DYING_FRAME_COUNT; i++) {
      this.load.image(
        `player01-dying${`${i + 1}`.padStart(2, '0')}`,
        `characters/orc01/dying/orc01-dying${`${i}`.padStart(2, '0')}.png`
      );
    }
  }

  create() {
    this.anims.create({
      key: 'explosion01',
      frames: [...new Array(EXPLOSION_FRAME_COUNT)].map((_, i) => ({
        key: `explosion01-${`${i + 1}`.padStart(2, '0')}`
      })),
      frameRate: 16,
      repeat: 0
    });

    this.anims.create({
      key: 'player01-idle',
      frames: [...new Array(PLAYER_IDLE_FRAME_COUNT)].map((_, i) => ({
        key: `player01-idle${`${i + 1}`.padStart(2, '0')}`
      })),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'player01-running',
      frames: [...new Array(PLAYER_RUNNING_FRAME_COUNT)].map((_, i) => ({
        key: `player01-running${`${i + 1}`.padStart(2, '0')}`
      })),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: 'player01-dying',
      frames: [...new Array(PLAYER_RUNNING_FRAME_COUNT)].map((_, i) => ({
        key: `player01-dying${`${i + 1}`.padStart(2, '0')}`
      })),
      frameRate: 16,
      repeat: 0
    });

    setTimeout(() => {
      this.scene.start("Game");
    }, 500);
  }
}
