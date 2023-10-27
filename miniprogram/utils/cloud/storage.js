class Storage {
    callFunction (params) {
        return this[params.name](params.data)
    }
    setStorage () {
        return wx.setStorage({
            key,
            data
        }).then(res => {
            console.log(res)
        })
    }
    getStorage ({ key, data }) {
        return wx.getStorage({ key }).then(res => {
            console.log(res)
        })
    }
    getBill (data) {
        return this.getStorage({ key: 'bill', data })
    }
    addBill (params) {
        
    }
    updateBill (params) {
        
    }
    getLabel (data) {
        return this.getStorage({ key: 'label', data })
    }
    addLabel (params) {
        
    }
}

module.exports = new Storage()