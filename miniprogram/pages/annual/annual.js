const cloud = require('../../utils/cloud/index')
const util = require('../../utils/util')
Page({
    data: {
        earliest: { label: '', value: 0, date: '' },
        latest: { label: '', value: 0, date: '' },
        most: { label: '', value: 0 },
        total: { label: '', value: 0 },
        list: Array.from(Array(12)).map((item, index) => ({
            title: `${index + 1}月`,
            value: 0,
            percent: 0
        }))
    },
    onLoad(options) {
        cloud.callFunction({
            name: 'getBillYear',
            data: { date: '2023' }
        }).then(res => {
            const earliest = { label: '', value: 0, time: '', second: Date.now() }
            const latest = { label: '', value: 0, time: '', second: 0 }
            const most = { label: '', value: 0 }
            const total = { label: '合计', value: 0 }
            let maxMonthAmount = 0
            const list = []
            res.result.data.forEach(item => {
                if (item.type === '0') {
                    const date = new Date(item.time)
                    const month = date.getMonth()
                    const [ hour, minute, second ] = [date.getHours(), date.getMinutes(), date.getSeconds()]
                    item.second = hour * 60 * 60 + minute * 60 + second
                    if (item.second < earliest.second) {
                        this.setItem(earliest, item)
                    }
                    if (item.second > latest.second) {
                        this.setItem(latest, item)
                    }
                    if (item.amount > most.value) {
                        this.setItem(most, item)
                    }
                    total.value = util.numberAddition(total.value, item.amount)
                    const listItem = list[month] = list[month] || { value: 0, percent: 0 }
                    listItem.value = util.numberAddition(listItem.value, item.amount)
                    maxMonthAmount = Math.max(maxMonthAmount, listItem.value)
                }
            })
            list.forEach(item => {
                item.percent = parseFloat(Number(item.value / maxMonthAmount * 100).toFixed(3))
            })
            const listData = {}
            list.forEach((item, index) => {
                listData[`list[${index}].value`] = item.value
                listData[`list[${index}].percent`] = item.percent
            })
            this.setData({
                'earliest.label': earliest.label,
                'earliest.value': util.formatAmount(earliest.value),
                'earliest.date': util.formatDate(earliest.time, 'MM-dd hh:mm:ss'),
                'latest.label': latest.label,
                'latest.value': util.formatAmount(latest.value),
                'latest.date': util.formatDate(latest.time, 'MM-dd hh:mm:ss'),
                'most.label': most.label,
                'most.value': util.formatAmount(most.value),
                'total.label': total.label,
                'total.value': util.formatAmount(total.value),
                ...listData
            })
        })
    },
    setItem (data, item) {
        data.second = item.second
        data.time = item.time
        data.label = item.labelTitle
        data.value = item.amount
    }
})