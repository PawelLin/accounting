class EventBus {
    constructor () {
        this.events = {}
    }
    on (type, listener) {
        this.events[type] = this.events[type] || []
        this.events[type].push(listener)
    }
    off (type, listener) {
        this.events[type] = this.events[type] || []
        this.events[type] = this.events[type].filter(item => item !== listener)
    }
    once (type, listener) {
        const callback = (...args) => {
            this.off(type, callback)
            listener(...args)
        }
        this.on(type, callback)
    }
    emit (type, ...args) {
        const listeners = this.events[type] || []
        for (const listener of listeners) {
            listener(...args)
        }
    }
}
module.exports = new EventBus()