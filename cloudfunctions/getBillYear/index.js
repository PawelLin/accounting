// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    const { date, type } = event
    const { OPENID } = cloud.getWXContext()
    const result = await db.collection('bill').aggregate().limit(1000).match({
        date: db.RegExp({ regexp: date }),
        type,
        openid: OPENID
    }).addFields({
        month: $.substr(['$date', 0, 7])
    }).group({
        _id: {
            label: '$label',
            labelTitle: '$labelTitle',
            type: '$type',
            month: '$month'
        },
        amount: $.sum('$amount')
    }).project({
        _id: 0,
        label: '$_id.label',
        labelTitle: '$_id.labelTitle',
        type: '$_id.type',
        date: '$_id.month',
        amount: 1
    }).end().then(res => ({ data: res.list, errMsg: res.errMsg }))
    return result
}