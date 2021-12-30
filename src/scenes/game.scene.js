import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants/game.constants';
import Player from '../actors/player.actor'

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.player = new Player(this, { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 })
        this.player.scale = 2;
        this.start();
    }

    start() {
        this.player.start();
    }
}