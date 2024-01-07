const app = getApp()
Component({
    properties: {
        title: {
            type: String
        }
    },
    data: {
        statusBarHeight: 0,
        barHeight: 0,
        // capsuleHeight: 0,
        // radiusSize: 0,
        theme: ''
    },
    attached () {
        const sysInfo = wx.getSystemInfoSync()
        const menuInfo = wx.getMenuButtonBoundingClientRect()
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight,
            barHeight: menuInfo.height + (menuInfo.top - sysInfo.statusBarHeight) * 2,
            // capsuleHeight: menuInfo.height,
            paddingRight: menuInfo.width + (sysInfo.windowWidth - menuInfo.right),
            // radiusSize: menuInfo.height / 2,
        })
    },
    pageLifetimes: {
        show () {
            this.setData({
                theme: app.globalData.theme === 'page-var-dark' ? 'dark' : 'light'
            })
        }
    },
    methods: {
        onThemeChange () {
            const theme = this.data.theme === 'dark' ? 'light' : 'dark'
            app.globalData.theme = `page-var-${theme}`
            app.globalData.bus.emit('change-theme', app.globalData.theme)
            this.setData({
                theme
            })
        },
        onYear () {
            wx.navigateTo({
                url: '/pages/annual/annual',
            })
        }
    }
})