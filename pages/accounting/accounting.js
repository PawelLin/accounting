// index.js
// 获取应用实例
const app = getApp()

Page({
    data: {
        type: '0',
        typeList: [
            { title: '支出', key: '0' },
            { title: '收入', key: '1' },
        ],
        label: '',
        labelList: [
            { title: '吃喝', key: '1' },
            { title: '交通', key: '2' },
            { title: '买菜', key: '3' },
            { title: '服饰鞋包', key: '4' },
            { title: '化妆护肤', key: '5' },
            { title: '日用品', key: '6' },
            { title: '话费', key: '7' },
            { title: '娱乐', key: '8' },
            { title: '房租', key: '9' },
            { title: '水电', key: '10' },
            { title: '超市', key: '11' },
        ]
    },
    onLoad() {
    },
    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
    },
    typeChange (e) {
        const data = e.currentTarget.dataset
        if (data.key !== this.data.type) {
            this.setData({
                type: data.key
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
    }
})
