import Phaser from 'Phaser'
import bombImg from './assets/bomb.png'
import dudeImg from './assets/dude.png'
import platformImg from './assets/platform.png'
import skyImg from './assets/sky.png'
import starImg from './assets/star.png'

const initGame = () => {
  var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    }
  }

  const game = new Phaser.Game(config)

  let cursors
  let player
  let platforms
  let stars
  let score = 0
  let scoreText
  let bombs
  let gameOver = false

  function preload () {
    this.load.image('bomb', bombImg)
    this.load.image('sky', skyImg)
    this.load.image('ground', platformImg)
    this.load.spritesheet('dude', dudeImg, {
      frameWidth: 32,
      frameHeight: 48
    })
    this.load.image('star', starImg)
  }

  function create () {
    window.addEventListener('resize', resize)
    resize()

    this.add.image(400, 300, 'sky')
    platforms = this.physics.add.staticGroup()

    platforms.create(320, 353, 'ground').setScale(1.6).refreshBody()

    platforms.create(600, 250, 'ground')
    platforms.create(50, 150, 'ground')
    platforms.create(700, 120, 'ground')

    player = this.physics.add.sprite(50, 250, 'dude')

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

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

    this.physics.add.collider(player, platforms)

    cursors = this.input.keyboard.createCursorKeys()

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 55 }
    })
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    this.physics.add.collider(stars, platforms)

    this.physics.add.overlap(player, stars, collectStar, null, this)

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })

    bombs = this.physics.add.group()

    this.physics.add.collider(bombs, platforms)

    this.physics.add.collider(player, bombs, hitBomb, null, this)
  }

  function update () {
    if (gameOver) return
    if (cursors.left.isDown) {
      player.setVelocityX(-160)
      player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      player.setVelocityX(160)
      player.anims.play('right', true)
    } else {
      player.setVelocityX(0)
      player.anims.play('turn')
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330)
    }
  }

  function resize () {
    let canvas = game.canvas
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

  function collectStar (player, star) {
    star.disableBody(true, true)
    score += 10
    scoreText.setText('Score:' + score)

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true)
      })

      var x = (player.x < 320) ? Phaser.Math.Between(320, 800) : Phaser.Math.Between(0, 320)

      var bomb = bombs.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }

  function hitBomb (player, bomb) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')
    gameOver = true
  }
}
initGame()
document.addEventListener('deviceready', initGame)
