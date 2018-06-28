if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')
}
const {EventEmitter} = require('events')
const _window        = require('./window')
const setting        = require('./setting')
const UserInput      = require('./UserInput')

/**
 * The core app containing the update loop.
 */
class App extends EventEmitter {
    /**
     *
     * @param options - The options to use in the App.
     */
    constructor(options = {}) {
        super()
        this.options = Object.assign(App.defaultOptions, options)
        if (!this.options.view) throw new Error('View options are missing! Default: ' + JSON.stringify(App.defaultOptions.view))

        /**
         * The object type. ("app")
         * @type {string}
         */
        this.type            = 'app'

        /**
         * The AppObjects added to the App.
         * @type {Array.<AppObject>}
         */
        this.objects         = []
        this.selectedObjects = []

        if (typeof window !== 'undefined') {
            this.root      = new PIXI.Container()
            this.uiroot    = new PIXI.Container()
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

        this.zoomSpeed = 10

        this._paused = false

        this.userInput = new UserInput({app: this})
    }

    /**
     * The default options which are used in an App.
     * @returns {{view: {zoomMin: {value, min, max, type}, zoomMax: {value, min, max, type}}}}
     */
    static get defaultOptions() {
        return {
            view: {
                zoomMin: setting(.1, .0001, 1),
                zoomMax: setting(2, 1, 100),
            }
        }
    }

    /**
     * View options.
     */
    get view() {
        return this.options.view
    }

    /**
     * This position {x, y} of the App view.
     * @returns {App.container.position|{x, y}}
     */
    get position() {
        return this.container.position
    }

    /**
     * The scale {x, y} of the App view.
     * @returns {App.container.scale|{x, y}}
     */
    get scale() {
        return this.container.scale
    }

    /**
     * The target scale {x, y} of the App view. (zoom target)
     * @returns {{x, y}}
     */
    get targetScale() {
        return this._targetScale || (this._targetScale = {x: this.scale.x, y: this.scale.y})
    }

    /**
     * The width of the window.
     * @returns {Number}
     */
    get screenWidth() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    /**
     * The height of the window.
     * @returns {Number}
     */
    get screenHeight() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }

    /**
     * Center on an object in the App.
     * @param object
     */
    centerOn(object) {
        this.position.x = this.screenWidth / 2 - object.position.x * this.scale.x
        this.position.y = this.screenHeight / 2 - object.position.y * this.scale.y
    }

    /**
     * Get the app paused value.
     * @returns {boolean}
     */
    get paused() {
        return this._paused
    }

    /**
     * Set the app paused value.
     * @param val {boolean}
     */
    set paused(val) {
        this._paused = val
        if (this._paused) this.emit('pause', this)
        else if (!this._paused) this.emit('play', this)
    }

    /**
     * Toggle app paused value.
     */
    togglePause() {
        this.paused = !this.paused
    }

    /**
     * Pause rendering of the app.
     */
    pauseRendering() {
        this.renderer.pause()
    }

    /**
     * Resume rendering of the app.
     */
    resumeRendering() {
        this.renderer.resume()
    }

    /**
     * Kill the app renderer.
     */
    kill() {
        this.renderer.kill()
    }

    /**
     * Translate a position from the window into the app.
     * @param position
     * @returns {{x: number, y: number}}
     */
    translatePosition(position) {
        return {
            x: (position.x - this.position.x) / this.scale.x,
            y: (position.y - this.position.y) / this.scale.y
        }
    }

    /**
     * The main update loop of the app, which is triggered by the renderer.
     * @param seconds {Number}
     */
    update(seconds) {
        this.userInput.update(seconds)
        this.updateZoom(seconds)
        if (this.paused) return

        this.objects.forEach(object => object.beforeUpdate(seconds))
        this.objects.forEach(object => object.update(seconds))
        this.objects.forEach(object => object.afterUpdate(seconds))

        this._bringFxToFront()
    }

    /**
     * Add an AppObject to the view, but not the game loop.
     * @param object {AppObject}
     * @returns {AppObject} - (object)
     */
    previewObject(object) {
        this.container.addChild(object.container)
        return object
    }

    /**
     * Remove an AppObject from the view which was added with .previewObject()
     * @param object {AppObject}
     * @returns {AppObject} - (object)
     */
    cancelPreview(object) {
        this.container.removeChild(object.container)
        return object
    }

    /**
     * Remove an array of AppObjects.
     * @param objects {Array.<AppObject>} - An array of AppObjects to remove from the App.
     */
    removeObjects(objects) {
        let i = objects.length
        while (i--) {
            this.remove(objects[i])
        }
    }

    /**
     * Check if the App contains an AppObject.
     * @param object {AppObject} - The AppObject to check.
     * @returns {boolean}
     */
    contains(object) {
        return this.objects.indexOf(object) !== -1
    }

    /**
     * Add an AppObject to the App.
     * @param object {AppObject} - The AppObject to add.
     * @returns {AppObject}
     */
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

    /**
     * Remove an AppObject from the App.
     * @param object {AppObject} - The AppObject to remove.
     * @returns {AppObject}
     */
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
        return object
    }

    // FX Methods
    /**
     * Bring the fx container to the top.
     * @private
     */
    _bringFxToFront() {
        // Keep the fx container on top.
        if (typeof window !== 'undefined') {
            this.container.addChild(this.fxcontainer)
        }
    }

    /**
     * Add an AppObject to the FX layer.
     * @param object {AppObject} - The FX object to add.
     */
    addFx(object) {
        object.removed = false
        if (typeof window !== 'undefined') {
            this.fxcontainer.addChild(object.container)
        }
    }

    /**
     * Remove an AppObject from the FX layer.
     * @param object {AppObject} - The FX object to remove.
     */
    removeFx(object) {
        object.removed = true
        if (typeof window !== 'undefined') {
            this.fxcontainer.removeChild(object.container)
        }
    }

    // Zoom Methods
    /**
     * Get the zoom value.
     */
    get zoom() {
        return this.targetScale.x
    }

    /**
     * Set the zoom value.
     * @param val
     */
    set zoom(val) {
        const view         = this.options.view
        this.targetScale.x = this.targetScale.y = Math.max(view.zoomMin.value, Math.min(view.zoomMax.value, val))
    }

    /**
     * Update the App scale and position based on the targetScale (zoom).
     * @param seconds {Number} - The amount of time passed since the last update.
     */
    updateZoom(seconds) {
        let amount   = (this.targetScale.x - this.scale.x) * seconds * this.zoomSpeed
        this.scale.x = this.scale.y += amount
        this.position.x += (this.position.x - _window.innerWidth / 2) * amount / (this.scale.x - amount)
        this.position.y += (this.position.y - _window.innerHeight / 2) * amount / (this.scale.y - amount)
        this.emit('zoom')
    }

    // Selection Methods
    /**
     * Select an AppObject.
     * @param object {AppObject} - The object to select.
     * @param additive {boolean} - Whether to add to the current selections, instead of replacing them.
     */
    selectObject(object, additive = false) {
        if (!additive) {
            this.deselectAll()
        }
        if (!object.selected) {
            object.select()
            this.selectedObjects.push(object)
        }
    }

    /**
     * Select all objects within the given coordinates.
     * @param left {number} - The left coordinate. (x1)
     * @param top {number} - The top coordinate. (y1)
     * @param right {number} - The right coordinate. (x2)
     * @param bottom {number} - The bottom coordinate. (y2)
     * @param additive {boolean} - Whether to add to the current selections, instead of replacing them.
     */
    select(left, top, right, bottom, additive = false) {
        let minX = Math.min(left, right)
        let minY = Math.min(top, bottom)
        let maxX = Math.max(left, right)
        let maxY = Math.max(top, bottom)
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

    /**
     * Select all objects within the app.
     */
    selectAll() {
        if (this.objects.length === this.selectedObjects.length) return
        let i = this.objects.length
        while (i--) {
            this.selectObject(this.objects[i], true)
        }
    }

    /**
     * Deselect all selected objects.
     */
    deselectAll() {
        while (this.selectedObjects.length >= 1) {
            this.selectedObjects.pop().deselect()
        }
    }

    /**
     * Remove all selected objects.
     */
    removeSelected() {
        this.removeObjects(this.selectedObjects)
    }
}

module.exports = App
