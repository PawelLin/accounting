// app.js
const bus = require('./utils/eventBus')
App({
    onLaunch() {
        wx.cloud.init({
            traceUser: true
        })
    },
    globalData: {
        reDetail: false,
        reSummary: false,
        theme: Math.abs(new Date().getHours() - 12) > 6 ? 'page-var-dark' : '',
        bus,
    }
})
