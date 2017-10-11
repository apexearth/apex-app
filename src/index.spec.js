const expect        = require('chai').expect
const {
          App,
          AppObject
      }             = require('./')

describe('apex-app', () => {

    let app

    beforeEach(() => app = new App())

    it('run', () => {
        app.add(new AppObject({app, parent: app}))
        for (let i = 0; i < 20; i++) {
            app.update(.01)
        }
    })
    it('.select()', () => {
        app.position.x = 0
        app.position.y = 0
        let object1    = app.add(new AppObject({app, parent: app, position: {x: 0, y: 0}}))
        let object2    = app.add(new AppObject({app, parent: app, position: {x: 10, y: 10}}))
        let object3    = app.add(new AppObject({app, parent: app, position: {x: -10, y: -10}}))
        app.select(0, 0, 10, 11)
        expect(object1.selected).to.equal(true)
        expect(object2.selected).to.equal(true)
        expect(object3.selected).to.equal(false)
        expect(app.selectedObjects.indexOf(object1)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object2)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object3)).to.equal(-1)
        app.position.x = 5
        app.position.y = 5
        app.scale.x    = .5
        app.scale.y    = .5
        app.select(0, 0, 10, 10)
        expect(object1.selected).to.equal(true)
        expect(object2.selected).to.equal(true)
        expect(object3.selected).to.equal(true)
        expect(app.selectedObjects.indexOf(object1)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object2)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object3)).to.be.gte(0)

        app.position.x -= 5
        app.position.y -= 5
        app.scale.x = 1
        app.scale.y = 1
        app.select(0, 0, 1, 1)
        expect(object1.selected).to.equal(true)
        expect(object2.selected).to.equal(false)
        expect(object3.selected).to.equal(false)
        expect(app.selectedObjects.indexOf(object1)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object2)).to.equal(-1)
        expect(app.selectedObjects.indexOf(object3)).to.equal(-1)

        app.select(10, 10, 11, 11, true)
        expect(object1.selected).to.equal(true)
        expect(object2.selected).to.equal(true)
        expect(object3.selected).to.equal(false)
        expect(app.selectedObjects.indexOf(object1)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object2)).to.be.gte(0)
        expect(app.selectedObjects.indexOf(object3)).to.equal(-1)
    })

    it('.zoom', () => {
        const view       = app.view
        let initialScale = app.targetScale.x
        app.zoom += .1
        let postScale    = app.targetScale.x
        expect(initialScale).to.be.lt(postScale)
        expect(postScale).to.equal(initialScale + .1)
        app.zoom -= .1

        expect(app.position.x).to.equal(250)
        expect(app.position.y).to.equal(250)
        app.zoom += .1
        app.update(.1)
        expect(app.position.x).to.equal(250)
        expect(app.position.y).to.equal(250)
        app.zoom -= .1
        app.update(.1)
        expect(app.position.x).to.equal(250)
        expect(app.position.y).to.equal(250)

        app.position.x = 0
        app.position.y = 0
        app.zoom -= .1
        app.update(.1)
        app.zoom -= .1
        app.update(.1)
        expect(app.position.x).to.equal(49.999999999999986)
        expect(app.position.y).to.equal(49.999999999999986)
        app.zoom += .1
        app.update(.1)
        app.zoom += .1
        app.update(.1)
        expect(app.position.x).to.equal(-3.552713678800501e-15)
        expect(app.position.y).to.equal(-3.552713678800501e-15)
    })

    it('.add()', () => {
        app.add(new AppObject({app, parent: app, position: {x: 1, y: 2}}))
        let object1 = app.objects[0]
        expect(object1.position).to.deep.equal({x: 1, y: 2})
    })
    it('.remove()', () => {
        app.add(new AppObject({app, parent: app, position: {x: 1, y: 2}}))
        app.remove(app.objects[0])
        expect(app.objects.length).to.equal(0)
    })

    it('.previewObject()', () => {
        let hit                = false
        app.container.addChild = object => {
            hit = true
            expect(object).to.an('object')
        }

        app.previewObject(new AppObject({app, parent: app}))
        expect(hit).to.equal(true)
    })
    it('.cancelPreview()', () => {
        let hit                   = false
        app.container.removeChild = object => {
            hit = true
            expect(object).to.an('object')
        }

        let object = app.previewObject(new AppObject({app, parent: app}))
        app.cancelPreview(object)
        expect(hit).to.equal(true)
    })
})
