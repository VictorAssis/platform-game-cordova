import Phaser from 'Phaser'
import Boot from './scenes/boot'
import Play from './scenes/play'

export default class App {
  start () {
    // Game config
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-app',
      width: 640,
      height: 360,
      scene: [
        Boot,
        Play
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      }
    }

    // Create game instance
    this.game = new Phaser.Game(config)
  }
}
