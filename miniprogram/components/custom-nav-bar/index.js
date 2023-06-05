Component({
    properties: {
        title: {
            type: String
        }
    },
    data: {
        statusBarHeight: 0,
        barHeight: 0,
        capsuleHeight: 0,
        radiusSize: 0
    },
    created () {
    },
    attached () {
        const sysInfo = wx.getSystemInfoSync()
        const menuInfo = wx.getMenuButtonBoundingClientRect()
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight,
            barHeight: menuInfo.height + (menuInfo.top - sysInfo.statusBarHeight) * 2,
            capsuleHeight: menuInfo.height,
            radiusSize: menuInfo.height / 2
        })
    }
})