// app.js
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
                wx.cloud.callFunction({
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
    }
})
