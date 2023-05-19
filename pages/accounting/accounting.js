// index.js
const util = require('../../utils/util.js')
Page({
    data: {
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
    },
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
    },
    initData () {
        const date = util.formatDate(new Date(), 'yyyy-MM-dd')
        this.setData({
            date,
            today: date,
            labelList: this.data.payLabelList
        })
        Promise.all([util.getStorage('payLabelList'), util.getStorage('incomeLabelList')]).then(res => {
            const payLabelList = res[0].data || []
            const incomeLabelList = res[1].data || []
            const labelList = this.data.type === '0' ? payLabelList : incomeLabelList
            this.setData({
                payLabelList,
                incomeLabelList,
                labelList
            })
        })
    },
    typeChange (e) {
        const data = e.currentTarget.dataset
        if (data.key !== this.data.type) {
            const labelList = data.key === '0' ? this.data.payLabelList : this.data.incomeLabelList
            this.setData({
                type: data.key,
                labelList,
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
            let { type, label, labelTitle, labelCustom, amount, remark, date } = this.data
            const dateKey = date.replace(/-\d+$/, '')
            const { data } = await util.getStorage(dateKey)
            const dateData = data || {}
            const dayData = dateData[date] = dateData[date] || { pay: 0, income: 0, list: [] }
            labelTitle = label === 'custom' ? labelCustom : labelTitle
            label = label === 'custom' ? await this.handleLabel() : label
            const typeKey = type === '0' ? 'pay' : 'income'
            dayData[typeKey] = util.numberAddition(dayData[typeKey], amount)
            amount = type === '0' ? -amount : +amount
            dayData.list.push({ type, label, labelTitle, amount, remark, date, time: Date.now() })
            await util.setStorage(dateKey, dateData)
            this.setData({
                amount: '0',
                amountFormat: '0',
                remark: ''
            })
            util.reInit()
        } catch(error) {
            console.log(error)
        }
    },
    handleLabel () {
        const { type, labelCustom, payLabelList, incomeLabelList } = this.data
        const isPay = type === '0'
        const key = isPay ? 'payLabelList' : 'incomeLabelList'
        const exist = this.data[key].filter(item => item.title === labelCustom)[0]
        if (exist) return exist.key
        const labelItem = { title: labelCustom, key: Date.now().toString() }
        const labelList = [labelItem, ...(isPay ? payLabelList : incomeLabelList)]
        return util.setStorage(key, labelList).then(res => {
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
