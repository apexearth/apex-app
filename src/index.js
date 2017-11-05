/**
 * For creating interactive apps using *pixi.js*.
 *
 * ### Basic Usage
 *
 * 1. Create an App.
 * 2. Add AppObjects to it.
 * 3. Create a renderer for the App.
 * 4. The renderer starts the update & draw loop, rendering the App.
 *
 * ```javascript
 * const {
 *    App,
 *    AppObject,
 *    createRenderer,
 *    PIXI,
 *    setting,
 *    properties,
 *    property
 * } = require('apex-app')
 *
 * // Extend App
 * // Initialize with a single AppObject drawn as a white square.
 * class Game extends App {
 *    constructor() {
 *        super()
 *        let obj = new AppObject({parent: this})
 *        obj.graphics.beginFill(0xffffff, 1)
 *        obj.graphics.drawRect(0, 0, 10, 10)
 *        obj.graphics.endFill()
 *        this.add(obj)
 *    }
 * }
 *
 * // Create renderer and attach canvas to `document.body`.
 * createRenderer(new Game(), {
 *    rendererOptions: {
 *        backgroundColor: 0x333333
 *    }
 * })
 * ```
 *
 * @module apex-app
 */
module.exports = {
    App           : require('./App'),
    AppObject     : require('./AppObject'),
    createRenderer: require('./createRenderer'),
    PIXI          : typeof window !== 'undefined' ? require('pixi.js') : null,
    setting       : require('./setting'),
    properties    : require('./properties'),
    property      : require('./property'),
}