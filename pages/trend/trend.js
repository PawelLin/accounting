const app = getApp()
Page({
    data: {
    },
    onLoad () {
        const query = wx.createSelectorQuery()
        query.select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width
            canvas.height = res[0].height
            // ctx.scale(dpr, dpr)
            ctx.fillStyle = '#19be6b'
            ctx.shadowBlur = 2
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetX = 1
            ctx.shadowColor = '#d3e0ec'
            ctx.beginPath()
            ctx.arc(100, 80, 50, 0, Math.PI * 2, true);
            ctx.fill()
            ctx.closePath()
            
        })
    },
    onReady () {
    },
    onShow () {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
    }
})
