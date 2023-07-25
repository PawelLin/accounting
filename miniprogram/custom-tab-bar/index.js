Component({
    options: {
        addGlobalClass: true
    },
    data: {
        selected: 0,
        color: "#7A7E83",
        selectedColor: "#19be6b",
        list: [{
            pagePath: "/pages/detail/detail",
            iconPath: "/image/icon_component.png",
            selectedIconPath: "/image/icon_component_HL.png",
            text: "明细",
        }, {
            pagePath: "/pages/accounting/accounting",
            iconPath: "/image/icon_component.png",
            selectedIconPath: "/image/icon_component_HL.png",
            text: "记账"
        }, {
            pagePath: "/pages/summary/summary",
            iconPath: "/image/icon_API.png",
            selectedIconPath: "/image/icon_API_HL.png",
            text: "汇总"
        }]
    },
    attached() {
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({ url })
            this.setData({
                selected: data.index
            })
        }
    }
})