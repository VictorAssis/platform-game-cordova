import Phaser from 'Phaser'

class Boot extends Phaser.Scene {
  constructor () {
    super({ key: 'Boot', active: true })
  }

  create () {
    // Resize screen
    window.addEventListener('resize', this.resize)
    this.resize()

    this.scene.start('Play')
  }

  resize () {
    let canvas = this.game.canvas
    let width = window.innerWidth
    let height = window.innerHeight
    let wratio = width / height
    let ratio = canvas.width / canvas.height

    if (wratio < ratio) {
      canvas.style.width = width + 'px'
      canvas.style.height = (width / ratio) + 'px'
    } else {
      canvas.style.width = (height * ratio) + 'px'
      canvas.style.height = height + 'px'
    }
  }
}

export default Boot
