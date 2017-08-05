require('should')
const property = require('./property')

describe('property', function () {

    let obj

    beforeEach(function () {
        obj = {}
    })

    it('value, min, and max', function () {
        property(obj, 'test', 1, -10, 10)
        obj.test.should.equal(1)
        obj.test = 11
        obj.test.should.equal(10)
        obj.test = -11
        obj.test.should.equal(-10)

        property(obj, 'test2', 2, -21, 21)
        obj.test2.should.equal(2)
        obj.test2 = 25
        obj.test2.should.equal(21)
        obj.test2 = -25
        obj.test2.should.equal(-21)
    })

    it('value(), min(), and max()', function () {
        property(obj, 'test', () => 1, () => -10, () => 10)
        obj.test.should.equal(1)
        obj.test = 11
        obj.test.should.equal(10)
        obj.test = -11
        obj.test.should.equal(-10)

        property(obj, 'test2', () => 2, () => -21, () => 21)
        obj.test2.should.equal(2)
        obj.test2 = 25
        obj.test2.should.equal(21)
        obj.test2 = -25
        obj.test2.should.equal(-21)
    })

})