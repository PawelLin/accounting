// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

async function getMonthAll (event, openid) {
    const { date, type } = event
    const MAX_LIMIT = 100
    const bill = db.collection('bill').where({
        date: db.RegExp({ regexp: date }),
        type,
        openid
    }).field({ openid: false })
    const { total } = await bill.count()
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = bill.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => ({
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        })
    )
}

// 云函数入口函数
exports.main = async (event, context) => {
    const { date, type, pageNum = 0, pageSize } = event
    const { OPENID } = cloud.getWXContext()
    if (pageSize) {
        return await db.collection('bill').where({
            date: db.RegExp({ regexp: date }),
            type,
            openid: OPENID
        }).orderBy('date', 'desc').skip(pageNum).limit(pageSize).field({
            openid: false
        }).get()
    }
    return await getMonthAll(event, OPENID)
}