export const payLabels = [
    { label: 'yxcz', labelTitle: '游戏充值' },
    { label: 'mtcs', labelTitle: '美团超市' },
    { label: 'pdd', labelTitle: '拼多多' },
    { label: 'wuc', labelTitle: '午餐' },
    { label: 'wanc', labelTitle: '晚餐' },
    { label: 'zaoc', labelTitle: '早餐' },
    { label: 'meyx', labelTitle: '美团优选' },
    { label: 'kd', labelTitle: '宽带' },
    { label: 'fz', labelTitle: '房租' },
]
export const incomeLabels = [
    { label: 'dqck', labelTitle: '定期存款' },
    { label: 'jgxck', labelTitle: '结构性存款' },
    { label: 'hbjj', labelTitle: '货币基金' },
    { label: 'zqjj', labelTitle: '债券基金' },
    { label: 'gpjj', labelTitle: '股票基金' },
]
export default params => {
    return {
        result: {
            data: [
                ...payLabels.map(item => ({
                    _id: item.label,
                    title: item.labelTitle,
                    type: '0'
                })),
                ...incomeLabels.map(item => ({
                    _id: item.label,
                    title: item.labelTitle,
                    type: '1'
                }))
            ],
            errMsg: 'ok'
        },
        requestID: 'requestID'
    }
}