module.exports = {
    App      : require('./App'),
    AppObject: require('./AppObject'),
    renderer : require('./renderer'),
    PIXI     : typeof window !== 'undefined' ? require('pixi.js') : null
}