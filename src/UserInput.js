const userInput = require('user-input')
const Mapping = require('user-input-mapping')

class UserInput {
    constructor({app}) {
        if (!app) throw new Error('No parent recieved.')
        this.app = app

        this.inputs = userInput()
        this.mapping = new Mapping(
            this.inputs,
            {
                keyboard: {
                    'up': ['<up>', 'W'],
                    'down': ['<down>', 'S'],
                    'left': ['<left>', 'A'],
                    'right': ['<right>', 'D'],
                    'zoomIn': ['=', '<num-+>'],
                    'zoomOut': ['-', '<num-->'],
                    'shift': ['<shift>'],
                    'control': ['<control>'],
                },
                mouse: {
                    'mouse0': 'mouse0',
                    'mouse1': 'mouse1',
                    'mouse2': 'mouse2',
                    'mouseX': 'x',
                    'mouseY': 'y',
                }
            }, false)

        let documentBody = typeof document !== 'undefined' ? document.body : undefined
        this.inputs
            .withMouse(documentBody)
            .withTouch(documentBody)
            .withKeyboard(documentBody)

        this.state = {}
        this.touchState = this.processTouchState(this.inputs)

        if (typeof document !== 'undefined') {
            document.addEventListener('wheel', event => (event.deltaY < 0 ? app.zoom *= 1.1 : app.zoom /= 1.1))
        }

        this.lastMouseX = this.mapping.value('mouseX')
        this.lastMouseY = this.mapping.value('mouseY')
    }

    update(seconds) {
        const delta = 1 + seconds
        const {app} = this
        const {container} = app

        const touchState = this.state.touchState = this.processTouchState(this.inputs, this.state.touchState)

        // Scrolling
        if (touchState.previous.count === 2 && touchState.current.count === 2) {
            container.position.x -= touchState.difference.midpointX
            container.position.y -= touchState.difference.midpointY
            app.zoom *= (1 - (touchState.difference.distance / ((app.screenWidth + app.screenHeight) / 2) * 3))
        }

        if (this.mapping.value('mouse2')) {
            container.position.x += this.mapping.value('mouseX') - this.lastMouseX
            container.position.y += this.mapping.value('mouseY') - this.lastMouseY
        }


        if (!this.mapping.value('control') && !this.mapping.value('shift')) {
            let scrollSpeed = 6 * delta
            let zoomSpeed = 1.01 * delta
            if (this.mapping.value('up')) {
                container.position.y += scrollSpeed
            }
            if (this.mapping.value('down')) {
                container.position.y -= scrollSpeed
            }
            if (this.mapping.value('left')) {
                container.position.x += scrollSpeed
            }
            if (this.mapping.value('right')) {
                container.position.x -= scrollSpeed
            }
            if (this.mapping.value('zoomOut')) {
                app.zoom /= zoomSpeed
            }
            if (this.mapping.value('zoomIn')) {
                app.zoom *= zoomSpeed
            }
        }

        this.lastMouseX = this.mapping.value('mouseX')
        this.lastMouseY = this.mapping.value('mouseY')
    }

    processTouchState({touches, changedTouches}, previousState = {}) {
        let state = {
            current: {
                count: touches.length,
                midpointX: 0,
                midpointY: 0,
                minX: Number.MAX_VALUE,
                maxX: Number.MIN_VALUE,
                minY: Number.MAX_VALUE,
                maxY: Number.MIN_VALUE,
                distanceX: 0,
                distanceY: 0,
                distance: 0,
            },
            previous: previousState.current || null,
            difference: {
                count: 0,
                midpointX: 0,
                midpointY: 0,
                minX: 0,
                maxX: 0,
                minY: 0,
                maxY: 0,
                distanceX: 0,
                distanceY: 0,
                distance: 0,
            }
        }
        if (state.current.count) {
            for (let i = 0; i < state.current.count; i++) {
                state.current.midpointX += touches[i].pageX
                state.current.midpointY += touches[i].pageY
                state.current.minX = Math.min(state.current.minX, touches[i].pageX)
                state.current.minY = Math.min(state.current.minY, touches[i].pageY)
                state.current.maxX = Math.max(state.current.maxX, touches[i].pageX)
                state.current.maxY = Math.max(state.current.maxY, touches[i].pageY)
            }
            state.current.midpointX /= state.current.count
            state.current.midpointY /= state.current.count
            state.current.distanceX = state.current.maxX - state.current.minX
            state.current.distanceY = state.current.maxY - state.current.minY
            state.current.distance = Math.sqrt(state.current.distanceX * state.current.distanceX + state.current.distanceY * state.current.distanceY)

            state.previous = state.previous || state.current
            // Fill state.difference
            for (let key in state.current) {
                if (state.current.hasOwnProperty(key))
                    state.difference[key] = state.previous[key] - state.current[key]
            }
        } else {
            state.current = state.difference
            state.previous = state.previous || state.current
        }

        return state
    }
}

module.exports = UserInput