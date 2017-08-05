module.exports = (obj, name, value, min, max) => {
    obj[`_${name}`] = typeof value === 'function' ? value() : value
    Object.defineProperty(obj, name, {
        get: () => obj[`_${name}`],
        set: value => {
            obj[`_${name}`] = Math.min(
                typeof max === 'function' ? max() : max,
                Math.max(
                    typeof min === 'function' ? min() : min,
                    value
                )
            )
        }
    })
}