if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const {EventEmitter} = require('events')
const _window        = require('./window')


class App extends EventEmitter {
    constructor(options = {}) {
        super()
        this.options = Object.assign(App.defaultOptions, options)
        if (!this.options.view) throw new Error('View options are missing! Default: ' + JSON.stringify(App.defaultOptions.view))

        this.objects         = []
        this.selectedObjects = []

        if (typeof window !== 'undefined') {
            this.root      = new PIXI.Container()
            this.container = new PIXI.Container()
            this.root.addChild(this.container)
            this.fxcontainer = new PIXI.Container()
            this.container.addChild(this.fxcontainer)
        } else {
            this.container = {
                position: {x: 0, y: 0},
                scale   : {x: 1, y: 1},
                addChild: () => undefined
            }
        }
        this.container.position.x = this.screenWidth / 2
        this.container.position.y = this.screenHeight / 2

        this._paused = false
    }

    static get defaultOptions() {
        return {
            view: {
                zoomMin: .1,
                zoomMax: 2,
            }
        }
    }

    get view() {
        return this.options.view
    }

    get position() {
        return this.container.position
    }

    get scale() {
        return this.container.scale
    }

    get targetScale() {
        return this._targetScale || (this._targetScale = {x: this.scale.x, y: this.scale.y})
    }

    get screenWidth() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    get screenHeight() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }

    // Pause
    get paused() {
        return this._paused
    }

    set paused(val) {
        this._paused = val
        if (this._paused) this.emit('pause', this)
        else if (!this._paused) this.emit('play', this)
    }

    togglePause() {
        this.paused = !this.paused
    }

    translatePosition(position) {
        return {
            x: (position.x - this.position.x) / this.scale.x,
            y: (position.y - this.position.y) / this.scale.y
        }
    }

    update(seconds) {
        this.updateZoom(seconds)
        if (this.paused) return

        this.objects.forEach(object => object.update(seconds))

        this.bringFxToFront()
    }

    // Preview Methods
    previewObject(object) {
        this.container.addChild(object.container)
        return object
    }

    cancelPreview(object) {
        this.container.removeChild(object.container)
    }

    // AppObject Methods
    removeObjects(objects) {
        let i = objects.length
        while (i--) {
            this.remove(objects[i])
        }
    }

    add(object) {
        object.removed = false
        this.objects.push(object)
        if (typeof window !== 'undefined') {
            this.container.addChild(object.container)
        } else {
            object.container.parent = this
        }
        return object
    }

    remove(object) {
        object.removed = true
        if (object.selected) {
            object.deselect()
            let index = this.selectedObjects.indexOf(object)
            if (index >= 0) {
                this.selectedObjects.splice(index, 1)
            }
        }
        let index = this.objects.indexOf(object)
        if (index >= 0) {
            this.objects.splice(index, 1)
        }
        if (typeof window !== 'undefined') {
            this.container.removeChild(object.container)
        }
    }

    // FX Methods
    bringFxToFront() {
        // Keep the fx container on top.
        if (typeof window !== 'undefined') {
            this.container.addChild(this.fxcontainer)
        }
    }

    addFx(object) {
        object.removed = false
        if (typeof window !== 'undefined') {
            this.fxcontainer.addChild(object.container)
        }
    }

    removeFx(object) {
        object.removed = true
        if (typeof window !== 'undefined') {
            this.fxcontainer.removeChild(object.container)
        }
    }

    // Zoom Methods
    get zoom() {
        return this.targetScale.x
    }

    set zoom(val) {
        const view         = this.options.view
        this.targetScale.x = this.targetScale.y = Math.max(view.zoomMin, Math.min(view.zoomMax, val))
    }

    updateZoom(seconds) {
        if (Math.abs(this.scale.x - this.targetScale.x) > .000001) {
            let amount   = (this.targetScale.x - this.scale.x) * seconds * 10
            this.scale.x = this.scale.y += amount
            this.position.x += (this.position.x - _window.innerWidth / 2) * amount / (this.scale.x - amount)
            this.position.y += (this.position.y - _window.innerHeight / 2) * amount / (this.scale.y - amount)
            this.emit('zoom')
        }
    }

    // Selection Methods
    selectObject(object, additive = false) {
        if (!additive) {
            this.deselectAll()
        }
        if (!object.selected) {
            object.select()
            this.selectedObjects.push(object)
        }
    }

    select(x1, y1, x2, y2, additive = false) {
        let minX = Math.min(x1, x2)
        let minY = Math.min(y1, y2)
        let maxX = Math.max(x1, x2)
        let maxY = Math.max(y1, y2)
        minX     = (minX - this.position.x) / this.scale.x
        minY     = (minY - this.position.y) / this.scale.y
        maxX     = (maxX - this.position.x) / this.scale.x
        maxY     = (maxY - this.position.y) / this.scale.y
        if (!additive) {
            this.selectedObjects.splice(0)
        }
        this.objects.forEach(object => {
            if (object.selectionHitTest(minX, minY, maxX, maxY)) {
                object.select()
                this.selectedObjects.push(object)
            } else if (!additive) {
                if (object.selected) {
                    object.deselect()
                    let index = this.selectedObjects.indexOf(object)
                    if (index >= 0) {
                        this.selectedObjects.splice(index, 1)
                    }
                }
            }
        })
    }

    selectAll() {
        if (this.objects.length === this.selectedObjects.length) return
        let i = this.objects.length
        while (i--) {
            this.selectObject(this.objects[i], true)
        }
    }

    deselectAll() {
        while (this.selectedObjects.length >= 1) {
            this.selectedObjects.pop().deselect()
        }
    }

    removeSelected() {
        this.removeObjects(this.selectedObjects)
    }
}

module.exports = App
