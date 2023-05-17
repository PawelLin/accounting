// index.js
const util = require('../../utils/util.js')
Page({
    data: {
        type: '0',
        typeList: [
            { title: '支出', key: '0' },
            { title: '收入', key: '1' },
        ],
        customLabel: '',
        label: '',
        labelList: [],
        payLabelList: Array.from(Array(60)).map((item, index) => ({ title: '双飞人', key: `${index}` })),
        incomeLabelList: Array.from(Array(60)).map((item, index) => ({ title: '收入', key: `${index}` })),
        amount: '0',
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
    },
    typeChange (e) {
        const data = e.currentTarget.dataset
        if (data.key !== this.data.type) {
            this.setData({
                type: data.key,
                labelList: data.key === '0' ? this.data.payLabelList : this.data.incomeLabelList
            })
        }
    },
    labelChange (e) {
        const data = e.currentTarget.dataset
        if (data.key !== this.data.label) {
            this.setData({
                label: data.key
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
        this.setData({
            amount: `${amount === '0' ? '' : amount}${data.key}` 
        })
    },
    bindDeleteTap () {
        const amount = this.data.amount
        const length = amount.length
        if (length === 1) {
            this.setData({
                amount: '0'
            })
        } else {
            this.setData({
                amount: amount.substring(0, length - 1)
            })
        }
    },
    bindPointTap (e) {
        const amount = this.data.amount
        const data = e.currentTarget.dataset
        const lastNumber = (amount.match(/[.\d]+$/) || [])[0]
        if (!(lastNumber && lastNumber.includes('.'))) {
            this.setData({
                amount: `${amount}${data.key}` 
            })
        }
    },
    bindCalcTap (e) {
        let amount = this.data.amount
        const key = e.currentTarget.dataset.key
        const calc = ['+', '-']
        if (calc.includes(amount[amount.length - 1])) {
            this.setData({
                amount: amount.substring(0, amount.length - 1) + key
            })
            return
        }
        if (amount.includes('+') || amount.includes('-')) {
            amount = this.calcAmount()
        }
        this.setData({
            amount: amount + key,
            isEqual: true
        })
    },
    bindCompleteTap () {
        if (this.data.isEqual) {
            this.setData({
                amount: this.calcAmount(),
                isEqual: false
            })
        } else {

        }
    },
    calcAmount () {
        let amount = this.data.amount
        const calcs = amount.match(/([-\d.]+)([^\d])([\d.]+)?/).splice(1, 3)
        const toFixedLength = calcs.reduce((length, str = '') => {
            const index = str.indexOf('.') + 1
            return Math.max(length, index <= 0 ? 0 : str.length - index)
        }, 0)
        const number1 = parseFloat(calcs[0])
        const isAdd = calcs[1] === '+'
        const number2 = parseFloat(calcs[2] || 0) || 0
        if (isAdd) {
            amount = Number(number1 + number2).toFixed(toFixedLength)
        } else {
            amount = Number(number1 - number2).toFixed(toFixedLength)
        }
        return `${parseFloat(amount)}`
    }
})
