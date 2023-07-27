// app.js
const bus = require('./utils/eventBus')
const cloud = require('./utils/cloud/index')
App({
    onLaunch() {
        wx.cloud.init({
            traceUser: true
        })
    },
    openidReady () {
        return new Promise (resolve => {
            const openid = this.globalData.openid
            if (openid) {
                resolve()
            } else {
                cloud.callFunction({
                    name: 'getInfo'
                }).then(res => {
                    this.globalData.openid = res.result.openid
                    resolve()
                })
            }
        })
    },
    globalData: {
        openid: '',
        reDetail: false,
        reSummary: false,
        theme: Math.abs(new Date().getHours() - 12) > 6 ? 'page-var-dark' : '',
        bus,
    }
})
