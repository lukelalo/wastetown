import Phaser from 'phaser';
import logoImg from '../assets/logo.png';

export default class Boot extends Phaser.Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.loadText = this.add.text(200, 250, 'Loading ...', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.load.image('logo', logoImg);
    }
      
    create ()
    {
        
        this.scene.start('MainMenu');
    }
}
