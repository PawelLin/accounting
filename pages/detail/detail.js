const util = require('../../utils/util.js')
Page({
    data: {
        pickData: {
            date: '',
            year: '',
            month: ''
        }
    },
    bindPickDataChange (e) {
        this.setPickData(e.detail.value)
    },
    setPickData (date) {
        const [ year, month ] = date.split('-')
        this.setData({
            pickData: { date, year, month }
        })
    },
    getData (key) {
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const date = util.formatDate(new Date(), 'yyyy-MM')
        this.setPickData(date)
        this.getData(date)
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
                selected: 0
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
    }
})