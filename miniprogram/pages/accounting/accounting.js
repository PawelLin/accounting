const app = getApp()
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud/index')
Page({
    data: {
        theme: app.globalData.theme,
        loading: true,
        type: '0',
        typeList: [
            { title: '支出', key: '0' },
            { title: '收入', key: '1' },
        ],
        labelCustom: '',
        label: '',
        labelTitle: '',
        labelList: [],
        payLabelList: [],
        incomeLabelList: [],
        amount: '0',
        amountFormat: '0',
        remark: '',
        date: '',
        today: '',
        isEqual: false
    },
    onLoad() {
        this.initData()
        app.globalData.bus.on('change-theme', theme => {
            this.setData({ theme })
        })
    },
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
        this.setData({ theme: app.globalData.theme })
    },
    initData () {
        cloud.callFunction({
            name: 'getLabel'
        }).then(res => {
            const data = res.result.data
            const payLabelList = data.filter(item => item.type === '0').reverse().map(item => ({ ...item, key: item._id }))
            const incomeLabelList = data.filter(item => item.type === '1').reverse().map(item => ({ ...item, key: item._id }))
            const date = util.formatDate(new Date(), 'yyyy-MM-dd')
            this.setData({
                date,
                today: date,
                payLabelList,
                incomeLabelList,
                labelList: this.data.type === '0' ? payLabelList : incomeLabelList,
                loading: false
            })
        }).catch(() => {})
    },
    typeChange (e) {
        const data = e.currentTarget.dataset
        if (data.key !== this.data.type) {
            const labelCustom = this.data.labelCustom
            const labelList = data.key === '0' ? this.data.payLabelList : this.data.incomeLabelList
            this.setData({
                type: data.key,
                labelList: labelCustom ? labelList.filter(item => item.title === labelCustom) : labelList,
                label: '',
                labelTitle: ''
            })
        }
    },
    labelChange (e) {
        const { key: label, title: labelTitle } = e.currentTarget.dataset
        if (label !== this.data.label) {
            this.setData({
                label,
                labelTitle
            })
        }
    },
    bindInput (e) {
        const key = e.currentTarget.dataset.key
        this.setData({
            [key]: e.detail.value
        })
    },
    bindLabelCustomInput: util.debounce(function (e) {
        const key = e.currentTarget.dataset.key
        const labelCustom = e.detail.value
        const labelList = this.data.type === '0' ? this.data.payLabelList : this.data.incomeLabelList
        this.setData({
            [key]: labelCustom,
            labelList: labelCustom ? labelList.filter(item => item.title === labelCustom) : labelList
        })
    }),
    bindDataChange (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindNumberTap (e) {
        const amount = this.data.amount
        const data = e.currentTarget.dataset
        this.setAmount(`${amount === '0' ? '' : amount}${data.key}`)
    },
    bindDeleteTap () {
        let amount = this.data.amount
        const length = amount.length
        this.setAmount(length === 1 ? '0' : amount.substring(0, length - 1))
    },
    bindPointTap (e) {
        const amount = this.data.amount
        const data = e.currentTarget.dataset
        const lastNumber = (amount.match(/[.\d]+$/) || [])[0]
        if (!(lastNumber && lastNumber.includes('.'))) {
            this.setAmount(`${amount}${data.key}`)
        }
    },
    bindCalcTap (e) {
        let amount = this.data.amount
        const key = e.currentTarget.dataset.key
        const calc = ['+', '-']
        if (calc.includes(amount[amount.length - 1])) {
            amount = amount.substring(0, amount.length - 1)
        } else {
            if (amount.includes('+') || amount.includes('-')) {
                amount = this.calcAmount()
            }
        }
        this.setAmount(amount + key, { isEqual: true })
    },
    bindCompleteTap () {
        if (this.data.isEqual) {
            this.setAmount(this.calcAmount(), { isEqual: false })
        } else {
            this.handleSubmit()
        }
    },
    async handleSubmit () {
        try {
            const valid = this.validate()
            if (!valid) return
            let { type, label, labelTitle, labelCustom, amount, remark, date } = this.data
            labelTitle = label === 'custom' ? labelCustom : labelTitle
            label = label === 'custom' ? await this.handleLabel() : label
            const params = { type, label, labelTitle, amount: +amount, remark, date, time: Date.now() }
            await cloud.callFunction({
                name: 'addBill',
                data: { data: params }
            })
            this.setData({
                amount: '0',
                amountFormat: '0',
                remark: ''
            })
            app.globalData.reDetail = true
            app.globalData.reSummary = true
        } catch(error) {
            console.log(error)
        }
    },
    validate () {
        const { label, labelCustom, amount } = this.data
        if (!label || (label === 'custom' && !labelCustom)) {
            wx.showToast({
              title: '请选择或填写标签',
              icon: 'none'
            })
            return false
        }
        if (amount === '0') {
            wx.showToast({
              title: '请填写金额',
              icon: 'none'
            })
            return false
        }
        return true
    },
    handleLabel () {
        const { type, labelCustom, payLabelList, incomeLabelList } = this.data
        const isPay = type === '0'
        const key = isPay ? 'payLabelList' : 'incomeLabelList'
        const exist = this.data[key].filter(item => item.title === labelCustom)[0]
        if (exist) return exist.key
        const labelItem = { title: labelCustom, type }
        return cloud.callFunction({
            name: 'addLabel',
            data: { data: labelItem }
        }).then(res => {
            labelItem.key = res.result._id
            const labelList = [labelItem, ...(isPay ? payLabelList : incomeLabelList)]
            this.setData({
                labelList,
                [key]: labelList,
                labelCustom: ''
            })
            return labelItem.key
        }).catch(() => {})
    },
    calcAmount () {
        let amount = this.data.amount
        const calcs = amount.split(/([+-.\d]+)([+-]+)/).filter(item => item)
        const isAdd = calcs[1] === '+'
        amount = util[isAdd ? 'numberAddition' : 'numberSubtract'](calcs[0], calcs[2])
        return `${amount}`
    },
    setAmount (amount, extra = {}) {
        this.setData({
            amount,
            amountFormat: amount.split(/([+-]+)/).map(value => util.formatAmount(value)).join(''),
            ...extra
        })
    }
})
