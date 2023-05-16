// logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad() {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return {
                    date: util.formatDate(new Date(log), 'yyyy-MM-dd hh:mm:ss'),
                    timeStamp: log
                }
            })
        })
    }
})
