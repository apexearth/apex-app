const property = require('./property')

module.exports = options => {
    let object = {}
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            const option = options[key]
            if (typeof option === 'object' && option.length) {
                property(object, key, option[0], option[1], option[2])
            } else {
                property(object, key, option.value, option.min, option.max)
            }
        }
    }
    return object
}