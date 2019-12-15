export default class Button {
  constructor (ctx, x, y, key, callback, text) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.key = key
    this.callback = callback
    this.text = text

    this.frames = {
      out: 0,
      down: 1
    }

    this.origin = this.initOrigin()
    this.obj = this.initObjects()
  }

  initOrigin (origin) {
    if (typeof origin === 'number') {
      return {
        x: origin,
        y: origin
      }
    } else if (typeof origin === 'object') return origin
    else {
      return {
        x: 0.5,
        y: 0.5
      }
    }
  }

  initObjects () {
    const btn = this.createSprite()
    this.width = btn.displayWidth
    this.height = btn.displayHeight

    let lbl = false
    if (typeof this.text === 'string') {
      lbl = new Text (this.ctx, btn.getCenter().x, btn.getCenter().y, this.text, 'standard')
    }

    return {
      btn: btn,
      lbl: lbl
    }
  }

  destroy () {
    if (this.obj.btn) this.obj.btn.destroy()
    if (this.obj.lbl) this.obj.lbl.destroy()

    this.obj = {}
  }

  createSprite () {
    let spr = this.ctx.add.sprite(this.x, this.y, this.key)
    spr.setOrigin(this.origin.x, this.origin.y)
    spr.setInteractive()
    spr.on('pointerdown', this.handleDown, this)
    spr.on('pointerup', this.handleUp, this)
    return spr
  }

  handleDown () {
    this.obj.btn.setFrame(this.frames.down)
  }

  handleUp () {
    this.obj.btn.setFrame(this.frames.out)
    this.callback.call(this.ctx)
  }
}
