// pages/summary/summary.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {
                title: '早餐', 
                expand: true,
                pay: '',
                income: '',
                data: Array(31).fill(0).map((item, index) => ({
                    day: index + 1,
                    pay: Math.random() > 0.5 ? (Math.random()* 5).toFixed(2) : 0,
                    income: Math.random() > 0.5 ? (Math.random()* 5).toFixed(2) : 0
                })),
            },
            {
                title: '美团优选', 
                expand: false,
                pay: '',
                income: '',
                data: Array(31).fill(0).map((item, index) => ({
                    day: index + 1,
                    pay: Math.random() > 0.5 ? (Math.random()* 20).toFixed(2) : 0,
                    income: Math.random() > 0.5 ? (Math.random()* 20).toFixed(2) : 0
                })),
                pay: '',
                income: ''
            }
        ],
        week: ['日', '一', '二', '三', '四', '五', '六']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
    onExpandChange (e) {
        const { index } = e.currentTarget.dataset
        const expand = this.data.list[index].expand
        this.setData({
            [`list[${index}].expand`]: !expand
        })
    }
})