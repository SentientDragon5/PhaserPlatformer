// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 600,
    height: 400,
    fps:30,
    scene: [Load, Platformer]
}

var cursors;
const SCALE = 2.0;
const PPU = 16;
var my = {sprite: {}, text: {}};
var world=0;
var respawnX=0;
var respawnY=0;

const game = new Phaser.Game(config);