class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 3500;
        this.DRAG = 7000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -600;
        this.MAX_SPEED = 350;

        this.dead = false;
        score = 0;

        this.frame = 0;
    }

    restart(){
        respawnX=game.config.width/4;
        respawnY=game.config.height/4;
    }
    
    handlePlayerPlatformCollision(obj1, obj2)
    {
        this.time.delayedCall(700,()=>{
            if(obj != null){
                obj2.destroy();
            }
        });
    }

    create() {
        this.physics.world.drawDebug = false;
        let mapW = 102;
        let mapH = 12;
        this.map = this.add.tilemap("lvl1", 16, 16, mapW, mapH);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "tilemap_packed");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.groundLayer.setScale(SCALE);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // set up player avatar
        console.log("load respawn "+respawnX + " " + respawnY);
        my.sprite.player = this.physics.add.sprite(respawnX, respawnY, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);


        this.gems = this.map.createFromObjects("Gems", {
            name: "Gem",
            key: "tilemap_sheet",
            frame: 62
        });
        this.gems.map((obj) => {
            obj.x *= SCALE;
            obj.y *= SCALE;
            obj.setScale(SCALE);
        });
        this.physics.world.enable(this.gems, Phaser.Physics.Arcade.STATIC_BODY);
        this.gemGroup = this.add.group(this.gems);
        this.physics.add.overlap(my.sprite.player, this.gemGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            score++;
        });


        this.platforms = this.map.createFromObjects("Platforms", {
            name: "Platform",
            key: "tilemap_sheet",
            frame: 103
        });
        this.platforms.map((obj) => {
            obj.x *= SCALE;
            obj.y *= SCALE;
            obj.setScale(SCALE);
        });

        this.physics.world.enable(this.platforms, Phaser.Physics.Arcade.STATIC_BODY);
        this.platformGroup = this.add.group(this.platforms);
        this.physics.add.collider(my.sprite.player, this.platformGroup);

        this.doors = this.map.createFromObjects("Door", {
            name: "Door",
            key: "tilemap_sheet",
            frame: 56
        });
        this.doors.map((obj) => {
            obj.x *= SCALE;
            obj.y *= SCALE;
            obj.setScale(SCALE);
        });
        this.physics.world.enable(this.doors, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorGroup = this.add.group(this.doors);
        this.physics.add.overlap(my.sprite.player, this.doorGroup, (obj1, obj2) => {
            //win
             this.scene.start("Win");
        });
        
        this.groundLayer.forEachTile((tile) => {
            if (tile.properties.platform) {
                tile.setCollision(false, false, true, false);
            }
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.input.keyboard.on('keydown-R', () => {
            this.death();
        }, this);

        //let bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        //Align.scaleToGameW(bg, 2);

        this.cameras.main.setBounds(0, 0, PPU*mapW*SCALE, PPU*mapH*SCALE);
        this.physics.world.setBounds(0,0,PPU*mapW*SCALE,PPU*mapH*SCALE);

        this.cameras.main.startFollow(my.sprite.player);

        //Debug particle
        // this.poof(100,100);

        my.vfx_walking = this.add.particles(0,0,'moveFX',{
            scale: 1,
            alpha: {start: 1, end:0},
            lifespan: 500,
            frequency: 5,
            speedY: {min:0,max:10},
            speedX: {min:-50,max:50},
            anim: ["particles0","particles1","particles2","particles3"]
        });


        this.jumpsfx = this.sound.add('jumpsfx', {
            volume: 0.5,
            loop: false
        });
        this.music = this.sound.add('music', {
            volume: 0.7,
            loop: true
        });
        this.music.play();
    }

    death(){
        if(!this.dead){
            this.poof(my.sprite.player.x,my.sprite.player.y);
            this.dead= true;
            this.time.delayedCall(200,()=>this.scene.start("platformerScene"));
            deaths++;
        }
    }

    poof(x,y){
        var p = this.add.particles(x,y,'particles',{
            scale: {start: 0, end:4*2},
            alpha: {start: 1, end:0},
            lifespan: 500,
            frequency: 5,
            speedY: {min:-50,max:10},
            maxParticles: 5,
            speedX: {min:-50,max:50},
            // maxVelocityX: 200,
            // maxVelocityY: 200,
            anim: ["particles0","particles1","particles2","particles3"]
        });

        p.start();
    }

    update() {
        if(!this.dead){
            if(cursors.left.isDown) {
                // TODO: have the player accelerate to the left
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
                if(my.sprite.player.body.velocity.x < -this.MAX_SPEED) my.sprite.player.setVelocity(-this.MAX_SPEED,my.sprite.player.body.velocity.y);
                
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);


                my.vfx_walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                my.vfx_walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx_walking.start();
                }
    
            } else if(cursors.right.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);
                if(my.sprite.player.body.velocity.x > this.MAX_SPEED) my.sprite.player.setVelocity(this.MAX_SPEED,my.sprite.player.body.velocity.y);
    
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);

                my.vfx_walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                my.vfx_walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx_walking.start();
                }
    
            } else {
                // TODO: set acceleration to 0 and have DRAG take over
                my.sprite.player.body.setAccelerationX(0);
                my.sprite.player.body.setDragX(this.DRAG);
    
                my.sprite.player.anims.play('idle');

                my.vfx_walking.stop();
            }
    
            // player jump
            // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');

                my.vfx_walking.stop();
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

                this.jumpsfx.play();
            }
        }

        var tile = this.groundLayer.getTileAtWorldXY(my.sprite.player.x,my.sprite.player.y);
        if(tile != null){
            if(tile.properties.gem){
                this.gems++;
                this.groundLayer.removeTileAtWorldXY(my.sprite.player.x,my.sprite.player.y);
            }
            if(tile.properties.danger){
                this.death();
            }

            if(tile.properties.respawn){
                var pos = this.cameras.main.getWorldPoint(my.sprite.player.x,my.sprite.player.y);
                if(respawnX != tile.getCenterX(this.cameras.main) && respawnY != tile.getCenterY(this.cameras.main)){
                    respawnX = tile.getCenterX(this.cameras.main);
                    respawnY = tile.getCenterY(this.cameras.main);
                    console.log("set respawn "+respawnX + " " + respawnY);
                    this.poof(respawnX,respawnY);
                }
            }
        }

        this.frame++;
    }
}