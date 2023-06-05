// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        return await db.collection('label').add({
            data: event.data
        })
    } catch (e) {
        console.error(e)
    }
}