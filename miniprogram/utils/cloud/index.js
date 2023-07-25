const MOCK = true
const result = {}
if (MOCK) {
    Object.assign(result, require('./mock/index'))
}
module.exports = {
    callFunction (params) {
        if (MOCK) {
            return new Promise((resolve, reject) => {
                try {
                    const res = result[params.name](params.data)
                    console.log(`[mock:${params.name}]: `, res)
                    const timeout = setTimeout(() => {
                        clearTimeout(timeout)
                        resolve(res)
                    }, 500)
                } catch (err) {
                    reject(err)
                }
            })
        } else {
            return wx.cloud.callFunction(params)
        }
    }
}