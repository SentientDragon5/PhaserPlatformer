class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "sprites_packed.png", "sprites_packed.json");

        // Load tilemap information
        this.load.image("tilemap_packed", "monochrome_tilemap_transparent_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("lvl1", "lvl1.tmj");   // Tilemap in JSON

        // this.load.image("particles", "particles.png");  
        this.load.atlas("particles", "particles.png", "particles.json");

        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 241,
                end: 244,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0240.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0244.png" }
            ],
        });

        // Particle config

        this.anims.create({
            key: 'particles0',
            frames: this.anims.generateFrameNames('particles', {
                prefix: "tile_",
                start: 0,
                end: 3,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        }); 

        this.anims.create({
            key: 'particles1',
            frames: this.anims.generateFrameNames('particles', {
                prefix: "tile_",
                start: 4,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        }); 

        this.anims.create({
            key: 'particles2',
            frames: this.anims.generateFrameNames('particles', {
                prefix: "tile_",
                start: 8,
                end: 11,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        }); 

        this.anims.create({
            key: 'particles3',
            frames: this.anims.generateFrameNames('particles', {
                prefix: "tile_",
                start: 11,
                end: 15,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
        }); 
        
         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}