const app = getApp()
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud/index')
Page({
    data: {
        theme: app.globalData.theme,
        loading: true,
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
    onLoad() {
        this.init()
        app.globalData.bus.on('change-theme', theme => {
            this.setData({ theme })
        })
    },
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        if (app.globalData.reDetail) {
            this.init(true)
            app.globalData.reDetail = false
        }
        this.setData({ theme: app.globalData.theme })
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
            await cloud.callFunction({
                name: 'getLabel'
            }).then(res => {
                const data = res.result.data
                payLabelList = data.filter(item => item.type === '0').reverse().map(item => ({ ...item, key: item._id }))
                incomeLabelList = data.filter(item => item.type === '1').reverse().map(item => ({ ...item, key: item._id }))
                this.setData({
                    payLabelList,
                    incomeLabelList
                })
            }).catch(() => {})
        } else {
            payLabelList = this.data.payLabelList
            incomeLabelList = this.data.incomeLabelList
        }
        cloud.callFunction({
            name: 'getBill',
            data: { date: month }
        }).then(res => {
            const data = {}
            res.result.data.forEach(item => {
                data[item.date] = data[item.date] || { pay: 0, income: 0, list: [] }
                const calcKey = item.type === '0' ? 'pay' : 'income'
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
                const amount = util.numberSubtract(income, pay)
                result.push({ key, date, amount, list: list.reverse().map(item => {
                    const labelList = item.type === '0' ? payLabelList : incomeLabelList
                    return {
                        ...item,
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
                list: result,
                loading: false
            })
        })
    },
    async bindLabelChange (e) {
        const { pindex, index } = e.currentTarget.dataset
        const value = e.detail.value
        const item = this.data.list[pindex].list[index]
        const newLabel = item.labelList[value]
        const isChange = newLabel.key !== item.label
        if (isChange) {
            const { key: label, title: labelTitle } = newLabel
            cloud.callFunction({
                name: 'updateBill',
                data: {
                    id: item._id,
                    data: { label, labelTitle }
                }
            }).then(() => {
                this.setData({
                    [`list[${pindex}].list[${index}].label`]: label,
                    [`list[${pindex}].list[${index}].labelTitle`]: labelTitle
                })
            })
        }
    },
    init (reInit) {
        const date = util.formatDate(new Date(), 'yyyy-MM')
        this.setPickData(date, reInit)
    },
})