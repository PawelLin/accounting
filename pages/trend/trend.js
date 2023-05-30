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
            canvas.width = 100 * dpr
            canvas.height = 100 * dpr
            this.drawRoundRect(ctx, 0, 0, 100 * dpr, 100 * dpr, 10 * dpr, dpr)
        })
    },
    drawRoundRect (ctx, x, y, width, height, radius, ratio) {
        x += 1
        y += 1
        width -= 2
        height -= 2
        const lineWidth = radius
        ctx.save()
        ctx.beginPath()
        const path = new Path2D()
        path.moveTo(x + radius, y);
        path.arcTo(x + width, y, x + width, y + radius, radius)
        path.lineTo(x + width, y + height - radius)
        path.arcTo(x + width, y + height, x + width - radius, y + height, radius)
        path.lineTo(x + radius, y + height)
        path.arcTo(x, y + height, x, y + height - radius, radius)
        path.lineTo(x, y + radius)
        path.arcTo(x, y, x + radius, y, radius)
        ctx.closePath()
        ctx.clip(path)
        x -= 1
        y -= 1
        width += 2
        height += 2
        x = x - lineWidth / 2
        y = y - lineWidth / 2
        width = width + lineWidth
        height = height + lineWidth
        radius = radius + lineWidth / 2
        ctx.moveTo(x + radius, y)
        ctx.arcTo(x + width, y, x + width, y + radius, radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
        ctx.lineTo(x + radius, y + height)
        ctx.arcTo(x, y + height, x, y + height - radius, radius)
        ctx.lineTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.shadowColor = '#d3e0ec'
        ctx.shadowBlur = 2 * ratio
        ctx.shadowOffsetX = 1 * ratio
        ctx.shadowOffsetY = 1 * ratio
        ctx.lineWidth = lineWidth
        ctx.stroke()
        ctx.shadowColor = '#fff'
        ctx.shadowBlur = 2 * ratio
        ctx.shadowOffsetX = -1 * ratio
        ctx.shadowOffsetY = -1 * ratio
        ctx.lineWidth = lineWidth
        ctx.stroke()
        ctx.restore()
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
