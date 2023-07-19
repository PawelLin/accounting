const payLabels = [
    { label: 'yxcz', labelTitle: '游戏充值' },
    { label: 'mtcs', labelTitle: '美团超市' },
    { label: 'pdd', labelTitle: '拼多多' },
    { label: 'wuc', labelTitle: '午餐' },
    { label: 'wanc', labelTitle: '晚餐' },
    { label: 'meyx', labelTitle: '美团优选' },
    { label: 'kd', labelTitle: '宽带' },
    { label: 'fz', labelTitle: '房租' },
]
const incomeLabels = [
    { label: 'dqck', labelTitle: '定期存款' },
    { label: 'hbjj', labelTitle: '货币基金' },
    { label: 'zqjj', labelTitle: '债券基金' },
    { label: 'gpjj', labelTitle: '股票基金' },
]

export const res = {
    "result": {
        "data": [
            ...Array.from(Array(100)).map((item, index) => {
                const labelIndex = Math.floor(Math.random() * payLabels.length) + 1
                const { label, labelTitle } = payLabels[labelIndex - 1]
                const day = Math.ceil(Math.random() * 31).toString().padStart(2, 0)
                return {
                    amount: -Number((Math.random() * labelIndex ** 5).toFixed(2)),
                    date: `2023-07-${day}`,
                    label,
                    labelTitle,
                    type: '0'
                }
            }),
            ...Array.from(Array(100)).map((item, index) => {
                const labelIndex = Math.floor(Math.random() * incomeLabels.length) + 1
                const { label, labelTitle } = incomeLabels[labelIndex - 1]
                const day = Math.ceil(Math.random() * 31).toString().padStart(2, 0)
                return {
                    amount: Number((Math.random() * labelIndex ** 5).toFixed(2)),
                    date: `2023-07-${day}`,
                    label,
                    labelTitle,
                    type: '1'
                }
            })
        ],
    },
}