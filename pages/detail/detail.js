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
        }
    },
    bindPickDataChange (e) {
        this.setPickData(e.detail.value)
    },
    setPickData (date) {
        const [ year, month ] = date.split('-')
        this.setData({
            pickData: { date, year, month }
        })
        this.getData(date)
    },
    getData (month) {
        util.getStorage(month).then(res => {
            let payNumber = 0
            let incomeNumber = 0
            const result = []
            const data = res.data || {}
            const today = util.formatDate(new Date())
            const dayValues = ['今天', '昨天']
            Object.keys(data).sort((a, b) => new Date(b) - new Date(a)).forEach(key => {
                const { pay, income, list } = data[key]
                const dayText = dayValues[key.replace(month, '') - today.replace(month, '')]
                const date = util.formatDate(key, `MM月dd日 ${dayText || '星期w'}`)
                const amount = util.formatAmount(util.numberSubtract(income - pay))
                result.push({ key, date, amount, list: list.map(item => ({ ...item, amount: util.formatAmount(item.amount) })) })
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
    init () {
        const date = util.formatDate(new Date(), 'yyyy-MM')
        this.setPickData(date)
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
        util.reInit(this.init)
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