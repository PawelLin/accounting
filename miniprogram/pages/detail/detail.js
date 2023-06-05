const util = require('../../utils/util.js')
Page({
    data: {
        list: [],
        payNumber: '0',
        incomeNumber: '0',
        pickData: {
            date: '',
            year: '',
            month: ''
        },
        labelList: [],
        payLabelList: null,
        incomeLabelList: null,
    },
    bindPickDataChange (e) {
        this.setPickData(e.detail.value)
    },
    setPickData (date, reInit) {
        const [ year, month ] = date.split('-')
        this.setData({
            pickData: { date, year, month }
        })
        this.getData(date, reInit)
    },
    async getData (month, reInit) {
        let payLabelList = []
        let incomeLabelList = []
        if (reInit || !this.data.payLabelList || !this.data.incomeLabelList) {
            await wx.cloud.callFunction({
                name: 'getLabel'
            }).then(res => {
                const data = res.result.data
                const payLabelList = data.filter(item => item.type === '0').reverse().map(item => ({ ...item, key: item._id }))
                const incomeLabelList = data.filter(item => item.type === '1').reverse().map(item => ({ ...item, key: item._id }))
                this.setData({
                    payLabelList,
                    incomeLabelList
                })
            }).catch(() => {})
        } else {
            payLabelList = this.data.payLabelList
            incomeLabelList = this.data.incomeLabelList
        }
        wx.cloud.callFunction({
            name: 'getBill',
            data: { date: month }
        }).then(res => {
            const data = {}
            res.result.data.forEach(item => {
                data[item.date] = data[item.date] || { pay: 0, income: 0, list: [] }
                const calcKey = item.type === '0' ? 'pay' : 'income'
                item.amount = item.type === '0' ? -item.amount : item.amount
                data[item.date][calcKey] = util.numberAddition(data[item.date][calcKey], item.amount)
                data[item.date].list.push(item)
            })
            let payNumber = 0
            let incomeNumber = 0
            const result = []
            const today = util.formatDate(new Date())
            const dayValues = ['今天', '昨天']
            Object.keys(data).sort((a, b) => new Date(b) - new Date(a)).forEach(key => {
                const { pay, income, list } = data[key]
                const dayIndex = key.replace(month, '') - today.replace(month, '')
                const dayText = dayValues[dayIndex]
                const date = util.formatDate(key, `MM月dd日 ${dayText || '星期w'}`)
                const amount = util.formatAmount(util.numberSubtract(income, pay))
                result.push({ key, date, amount, list: list.reverse().map(item => {
                    const labelList = item.type === '0' ? payLabelList : incomeLabelList
                    return {
                        ...item,
                        amount: util.formatAmount(item.amount),
                        labelIndex: labelList.findIndex(({ key }) => key === item.label),
                        labelList
                    }
                })})
                payNumber = util.numberAddition(payNumber, pay)
                incomeNumber = util.numberAddition(incomeNumber, income)
            })
            this.setData({
                payNumber: util.formatAmount(payNumber),
                incomeNumber: util.formatAmount(incomeNumber),
                list: result
            })
        })
    },
    async bindLabelChange (e) {
        const { date, index } = e.currentTarget.dataset
        const value = e.detail.value
        const month = date.replace(/-\d+$/, '')
        console.log(date, month)
        const item = this.data.list.filter(({ key }) => key === date)[0].list[index]
        const newLabel = item.labelList[value]
        const isChange = newLabel.key !== item.label
        if (isChange) {
            const { data } = await util.getStorage(month)
            const target = data[date].list[index]
            target.label = newLabel.key
            target.labelTitle = newLabel.title
            await util.setStorage(month, data)
            this.setPickData(month)
        }
    },
    init (reInit) {
        const date = util.formatDate(new Date(), 'yyyy-MM')
        this.setPickData(date, reInit)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        util.reInit(() => this.init(true))
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
    }
})