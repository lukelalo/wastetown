import boot from './scenes/boot.scene'
import menu from './scenes/menu.scene'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [boot, menu]
};

const game = new Phaser.Game(config);
