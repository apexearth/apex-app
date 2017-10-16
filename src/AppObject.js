const PIXI = typeof window !== 'undefined' ? require('pixi.js') : null

let id = 0

class AppObject {

    constructor({
                    app,
                    parent,
                    player,
                    position = {x: 0, y: 0},
                    scale = {x: 1, y: 1},
                    pivot = {x: 0, y: 0},
                    rotation = 0,
                    momentum = {x: 0, y: 0, rotation: 0},
                    dampening = {x: 0, y: 0, rotation: 0}
                }) {
        if (!app) throw new Error('No app recieved.')
        if (!parent) throw new Error('No parent recieved.')
        this.id     = id++
        this.app    = app
        this.parent = parent
        this.player = player
        this.type   = 'object'

        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
        } else {
            this.container = {
                position: {x: 0, y: 0}, scale: {x: 1, y: 1},
                pivot   : {x: 0, y: 0}, width: 1, height: 1
            }
        }

        this.position.x    = position.x
        this.position.y    = position.y
        this.scale.x       = scale.x
        this.scale.y       = scale.y
        this.pivot.x       = pivot.x
        this.pivot.y       = pivot.y
        this.rotation      = rotation
        this.momentum      = {
            x       : momentum.x,
            y       : momentum.y,
            rotation: momentum.rotation
        }
        this.dampening     = {
            x       : dampening.x,
            y       : dampening.y,
            rotation: dampening.rotation
        }
        this.position_prev = {}
        this.momentum_prev = {}
        this.updatePrevious()
        this._selected = false
        this.removed   = false
    }

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
    }

    get rotation() {
        return this.container.rotation
    }

    get pivot() {
        return this.container.pivot
    }

    set rotation(r) {
        this.container.rotation = r
    }

    get selected() {
        return this._selected
    }

    select() {
        if (!this._selected) {
            this._selected = true
            this.draw()
        }
    }

    deselect() {
        if (this._selected) {
            this._selected = false
            this.draw()
        }
    }

    selectionHitTest(minX, minY, maxX, maxY) {
        return !(
            this.position.x + this.container.width / 2 < minX ||
            this.position.x - this.container.height / 2 > maxX ||
            this.position.y + this.container.width / 2 < minY ||
            this.position.y - this.container.height / 2 > maxY
        )
    }

    beforeUpdate(seconds) {
        /* to be overridden */
    }

    update(seconds) {
        this.updatePrevious()
        this.updateMovement(seconds)
        this.updateDampening(seconds)
    }

    afterUpdate(seconds) {
        /* to be overridden */
    }

    updateMovement(seconds) {
        this.position.x += this.momentum.x * seconds
        this.position.y += this.momentum.y * seconds
        this.rotation += this.momentum.rotation * seconds
    }

    updateDampening(seconds) {
        if (this.dampening.x) {
            if (this.momentum.x > 0) {
                this.momentum.x = Math.max(0, this.momentum.x - Math.abs(this.dampening.x * this.momentum.x * .05))
            } else {
                this.momentum.x = Math.min(0, this.momentum.x + Math.abs(this.dampening.x * this.momentum.x * .05))
            }
        }
        if (this.dampening.y) {
            if (this.momentum.y > 0) {
                this.momentum.y = Math.max(0, this.momentum.y - Math.abs(this.dampening.y * this.momentum.y * .05))
            } else {
                this.momentum.y = Math.min(0, this.momentum.y + Math.abs(this.dampening.y * this.momentum.y * .05))
            }
        }
        if (this.dampening.rotation) {
            if (this.momentum.rotation > 0) {
                this.momentum.rotation = Math.max(0, this.momentum.rotation - Math.abs(this.dampening.rotation * this.momentum.rotation * .05))
            } else {
                this.momentum.rotation = Math.min(0, this.momentum.rotation + Math.abs(this.dampening.rotation * this.momentum.rotation * .05))
            }
        }
    }

    updatePrevious() {
        this.position_prev.x        = this.position.x
        this.position_prev.y        = this.position.y
        this.momentum_prev.x        = this.momentum.x
        this.momentum_prev.y        = this.momentum.y
        this.momentum_prev.rotation = this.momentum.rotation
    }

    draw() {
        if (typeof window !== 'undefined') {
            this.graphics.clear()
            this.graphics.beginFill(this._selected ? 0xff0000 : 0xff66666)
            this.graphics.drawCircle(0, 0, 1)
            this.graphics.endFill()
            this.scale.x = this.scale.y = 10
        }
    }
}

module.exports = AppObject
