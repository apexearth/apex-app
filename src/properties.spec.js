require('should')
const properties = require('./properties')

describe('properties', function () {
    it('turns an array of instructions into an object with properties', function () {
        const obj = properties({
            test : {
                value: 1,
                min  : -10,
                max  : 10,
            },
            test2: [5, -21, 21],
        })
        obj.test.should.equal(1)
        obj.test = 11
        obj.test.should.equal(10)
        obj.test = -11
        obj.test.should.equal(-10)

        obj.test2.should.equal(5)
        obj.test2 = 25
        obj.test2.should.equal(21)
        obj.test2 = -25
        obj.test2.should.equal(-21)

        const obj2 = properties({
            test : {
                value: () => 1,
                min  : () => -10,
                max  : () => 10,
            },
            test2: [() => 5, () => -21, () => 21],
        })
        obj2.test.should.equal(1)
        obj2.test = 11
        obj2.test.should.equal(10)
        obj2.test = -11
        obj2.test.should.equal(-10)

        obj2.test2.should.equal(5)
        obj2.test2 = 25
        obj2.test2.should.equal(21)
        obj2.test2 = -25
        obj2.test2.should.equal(-21)
    })
})