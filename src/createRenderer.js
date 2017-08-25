if (typeof window !== 'undefined') {
    const PIXI = require('pixi.js')

    function screenWidth() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    function screenHeight() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }

    module.exports = (app, options = {
        destroyAccessibilityPlugins: true,
        rendererOptions            : {},
        uirendererOptions          : {}
    }) => {
        options.rendererOptions   = options.rendererOptions || {}
        options.uirendererOptions = options.uirendererOptions || {}

        // Main Renderer
        const renderer = new PIXI.autoDetectRenderer(Object.assign({
            width    : screenWidth(),
            height   : screenHeight(),
            antialias: true
        }, options.rendererOptions))
        document.body.appendChild(renderer.view)

        renderer.pause = () => renderer.paused = true
        renderer.resume = () => {
            renderer.paused = false
            last            = Date.now()
            animate()
        }

        renderer.kill = () => {
            renderer.killed = true
            document.body.removeChild(renderer.view)
        }

        // UI Renderer
        const uirenderer = new PIXI.autoDetectRenderer(Object.assign({
            width      : screenWidth(),
            height     : screenHeight(),
            antialias  : true,
            transparent: true
        }, options.uirendererOptions))
        document.body.appendChild(uirenderer.view)

        let {root, uiroot} = app
        let last           = Date.now()
        let rafing         = false
        animate()

        function queueAnimation() {
            // prevent double rafing.
            if (!rafing) {
                rafing = true
                requestAnimationFrame(() => {
                    rafing = false
                    animate()
                })
            }
        }

        function animate() {
            if (renderer.paused) return
            if (renderer.killed) return

            queueAnimation()
            let current = Date.now()
            let time    = Math.min((current - last) / 1000, 30 / 1000)
            app.update(time)
            last = current
            if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
                renderer.resize(window.innerWidth, window.innerHeight)
                uirenderer.resize(window.innerWidth, window.innerHeight)
                renderer.clear()
            }

            renderer.render(root)
            uirenderer.render(uiroot)
        }

        if (options.destroyAccessibilityPlugins) {
            // Fix a bug where PIXI.js would place a <div> on top of everything after using inputs.
            renderer.plugins.accessibility.destroy()
            uirenderer.plugins.accessibility.destroy()
        }

        return {
            renderer,
            uirenderer
        }
    }
}