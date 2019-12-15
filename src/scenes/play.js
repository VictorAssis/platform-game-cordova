import bombImg from '../assets/bomb.png'
import dudeImg from '../assets/dude.png'
import platformImg from '../assets/platform.png'
import skyImg from '../assets/sky.png'
import starImg from '../assets/star.png'
import Phaser from 'Phaser'

class Play extends Phaser.Scene {
  constructor () {
    super({ key: 'Play', active: false })

    this.score = 0
    this.gameOver = false
  }

  preload () {
    this.load.image('bomb', bombImg)
    this.load.image('sky', skyImg)
    this.load.image('ground', platformImg)
    this.load.spritesheet('dude', dudeImg, {
      frameWidth: 32,
      frameHeight: 48
    })
    this.load.image('star', starImg)
  }

  create () {
    // Render the background
    this.add.image(400, 300, 'sky')

    this.createPlatforms()
    this.createPlayer()
    this.createStars()
    this.createBomb()
    this.setColiders()

    this.cursors = this.input.keyboard.createCursorKeys()

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
  }

  update () {
    if (this.gameOver) return
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn')
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }

  createPlatforms () {
    this.platforms = this.physics.add.staticGroup()
    this.platforms.create(320, 353, 'ground').setScale(1.6).refreshBody()
    this.platforms.create(575, 250, 'ground')
    this.platforms.create(50, 175, 'ground')
    this.platforms.create(690, 120, 'ground')
  }

  createPlayer () {
    this.player = this.physics.add.sprite(50, 250, 'dude')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  }

  createStars () {
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 55 }
    })
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
  }

  createBomb () {
    this.bombs = this.physics.add.group()
  }

  setColiders () {
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this)
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.collider(this.bombs, this.platforms)
  }

  collectStar (player, star) {
    star.disableBody(true, true)
    this.score += 10
    this.scoreText.setText('Score:' + this.score)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true)
      })

      var x = (this.player.x < 320) ? Phaser.Math.Between(320, 800) : Phaser.Math.Between(0, 320)

      var bomb = this.bombs.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }

  hitBomb (player, bomb) {
    this.physics.pause()
    this.player.setTint(0xff0000)
    this.player.anims.play('turn')
    this.gameOver = true
  }
}

export default Play
