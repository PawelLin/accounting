// pages/summary/summary.js
const app = getApp()
const util = require('../../utils/util')
const cloud = require('../../utils/cloud/index')
const payKey = '0'
const incomeKey = '1'
Page({
    data: {
        theme: app.globalData.theme,
        loading: true,
        pickDate: {
            date: '',
            year: '',
            month: ''
        },
        selectType: payKey,
        isPay: true,
        payKey,
        incomeKey,
        count: {
            pay: 0,
            payRatio: 0,
            payFormat: 0,
            income: 0,
            incomeRatio: 0,
            incomeFormat: 0
        },
        payList: [],
        incomeList: [],
        list: [
            { key: payKey, list: [] },
            { key: incomeKey, list: [] },
        ],
        week: ['日', '一', '二', '三', '四', '五', '六']
    },
    onLoad(options) {
        this.getSummaryData(new Date())
        app.globalData.bus.on('change-theme', theme => {
            this.setData({ theme })
        })
    },
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
        if (app.globalData.reSummary && this.data.pickDate.date) {
            this.getSummaryData(this.data.pickDate.date)
            app.globalData.reSummary = false
        }
        this.setData({ theme: app.globalData.theme })
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
        this.maxLine = Math.ceil((beforeLength + days) / 7)
        cloud.callFunction({
            name: 'getBill',
            data: { date: dateStr }
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
                    showList: false,
                    pay: 0,
                    payRatio: 0,
                    income: 0,
                    incomeRatio: 0,
                    animationData: {},
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
            countDatas.payFormat = util.formatAmount(countDatas.pay)
            countDatas.incomeFormat = util.formatAmount(countDatas.income)
            this.setData({
                count: countDatas,
                'list[0].list': this.getSortList(payDatas, countDatas),
                'list[1].list': this.getSortList(incomeDatas, countDatas, 'income'),
                loading: false
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
        const duration = 300
        const animation = this.animation || wx.createAnimation({
            duration,
            timingFunction: 'ease-in-out',
        })
        const height = expand ? 0 : `calc(${this.maxLine} * 12vw + ${this.maxLine} * var(--margin-gap))`
        animation.height(height).step()
        if (expand) {
            this.setData({
                [`list[${typeIndex}].list[${index}].expand`]: !expand,
                [`list[${typeIndex}].list[${index}].animationData`]: animation.export()
            })
            setTimeout(() => {
                this.setData({
                    [`list[${typeIndex}].list[${index}].showList`]: !expand
                })
            }, duration)
        } else {
            this.setData({
                [`list[${typeIndex}].list[${index}].expand`]: !expand,
                [`list[${typeIndex}].list[${index}].showList`]: !expand,
                [`list[${typeIndex}].list[${index}].animationData`]: animation.export()
            })
        }
    }
})