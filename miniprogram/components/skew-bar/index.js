// components/skew-bar/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        list: []
    },
    observers: {
        data () {
            const { data, data: { length } } = this.data
            const list = data.map((item, index) => {
                return { ...item, flexStart: index, flexEnd: length - 1 - index }
            }).reverse()
            this.setData({ list })
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
})
