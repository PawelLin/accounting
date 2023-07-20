// pages/summary/summary.js
const app = getApp()
const util = require('../../utils/util')
const cloud = require('../../utils/cloud/index')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pickDate: {
            date: '',
            year: '',
            month: ''
        },
        selectType: '1',
        isPay: true,
        payKey: '1',
        incomeKey: '2',
        count: {
            pay: 0,
            payRatio: 0,
            income: 0,
            incomeRatio: 0
        },
        payList: [],
        incomeList: [],
        list: [
            { key: '1', list: [] },
            { key: '2', list: [] },
        ],
        week: ['日', '一', '二', '三', '四', '五', '六']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.openidReady().then(() => {
            this.getSummaryData(new Date())
        })
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
                selected: 2
            })
        }
        if (app.globalData.reSummary) {
            this.getSummaryData(this.data.pickDate.date)
            app.globalData.reSummary = false
        }
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

    },
    getMonthData (date) {
        date.setDate(1)
        const beforeLength = date.getDay()
        date.setMonth(date.getMonth() + 1)
        date.setDate(0)
        const days = date.getDate()
        return { beforeLength, days }
    },
    getSortList (datas, countDatas, type = 'pay') {
        return Object.keys(datas).map(key => {
            const data = datas[key]
            data.payRatio = ((data.pay / (countDatas.pay || 1)) * 100).toFixed(2)
            data.incomeRatio = ((data.income / (countDatas.income || 1)) * 100).toFixed(2)
            data.pay = data.pay ? data.pay.toFixed(2) : data.pay
            data.income = data.income ? data.income.toFixed(2) : data.income
            data.list.forEach(item => {
                if (typeof item.pay === 'number' && item.pay > 0) {
                    item.pay = item.pay.toFixed(2)
                }
                if (typeof item.income === 'number' && item.income > 0) {
                    item.income = item.income.toFixed(2)
                }
            })
            return data
        }).sort((a, b) => b[type] - a[type])
    },
    getSummaryData (date) {
        date = typeof date === 'string' ? new Date(date) : date
        const dateStr = util.formatDate(date, 'yyyy-MM')
        const [year, month] = dateStr.split('-')
        this.setData({
            pickDate: { date: dateStr, year, month },
        })
        const { beforeLength, days } = this.getMonthData(date)
        cloud.callFunction({
            name: 'getBill',
            data: { date: dateStr, openid: app.globalData.openid }
        }).then(res => {
            const payDatas = {}
            const incomeDatas = {}
            const countDatas = { pay: 0, payRatio: 0, income: 0, incomeRatio: 0, count: 0 }
            res.result.data.forEach(item => {
                const isPay = item.type === '0'
                const typeDatas = isPay ? payDatas : incomeDatas
                const typeData = typeDatas[item.label] = typeDatas[item.label] || {
                    title: item.labelTitle,
                    label: item.label,
                    expand: false,
                    pay: 0,
                    payRatio: 0,
                    income: 0,
                    incomeRatio: 0,
                    maxLine: Math.ceil((beforeLength + days) / 7),
                    list: [
                        ...Array.from(Array(beforeLength)).map((item, index) => ({ key: index + 1 })),
                        ...Array.from(Array(days)).map((item, index) => ({
                            day: index + 1,
                            pay: 0,
                            income: 0,
                            key: beforeLength + index + 1
                        }))
                    ]
                }
                const index = item.date.split('-')[2] - 1 + beforeLength
                const trade = isPay ? 'pay' : 'income'
                const amount = Math.abs(item.amount)
                countDatas[trade] = util.numberAddition(countDatas[trade], amount)
                typeData[trade] = util.numberAddition(typeData[trade], amount)
                typeData.list[index][trade]  = util.numberAddition(typeData.list[index][trade], amount)
            })
            const count = countDatas.pay + countDatas.income
            countDatas.payRatio = countDatas.pay / count * 100
            countDatas.incomeRatio = countDatas.income / count * 100
            countDatas.count = util.numberSubtract(countDatas.income, countDatas.pay)
            countDatas.pay = util.formatAmount(countDatas.pay)
            countDatas.income = util.formatAmount(countDatas.income)
            this.setData({
                count: countDatas,
                'list[0].list': this.getSortList(payDatas, countDatas),
                'list[1].list': this.getSortList(incomeDatas, countDatas, 'income')
            })
        })
    },
    bindPickDateChange (e) {
        this.getSummaryData(e.detail.value)
    },
    onSelectChange (e) {
        const { value } = e.currentTarget.dataset
        if (this.data.selectType !== value) {
            this.setData({
                selectType: value,
                isPay: value === this.data.payKey
            })
        }
    },
    onExpandChange (e) {
        const { index, expand } = e.currentTarget.dataset
        const typeIndex = this.data.isPay ? 0 : 1
        this.setData({
            [`list[${typeIndex}].list[${index}].expand`]: !expand
        })
    }
})