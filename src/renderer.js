if (typeof window !== 'undefined') {
    const PIXI     = require('pixi.js')
    const renderer = new PIXI.WebGLRenderer(screenWidth(), screenHeight(), {antialias: true})
    document.body.appendChild(renderer.view)

    function screenWidth() {
        return typeof window !== 'undefined' ? window.innerWidth : 500
    }

    function screenHeight() {
        return typeof window !== 'undefined' ? window.innerHeight : 500
    }

    module.exports = {
        view: renderer.view,
        initialize (app) {
            let last = Date.now()

            let {root} = app

            animate()
            function animate() {
                requestAnimationFrame(animate)
                let current = Date.now()
                let time    = Math.min((current - last) / 1000, 30 / 1000)
                app.update(time)
                last = current
                if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
                    renderer.resize(window.innerWidth, window.innerHeight)
                }

                renderer.render(root)

            }
        }
    }
}