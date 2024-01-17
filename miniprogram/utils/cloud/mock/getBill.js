import { payLabels, incomeLabels } from './getLabel'

export default params => {
    const dateStr = params.date
    const date = new Date(dateStr)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
    const days = date.getDate()
    return {
        result: {
            data: [
                ...Array.from(Array(100)).map((item, index) => {
                    const labelIndex = Math.floor(Math.random() * payLabels.length) + 1
                    const { label, labelTitle } = payLabels[labelIndex - 1]
                    const day = Math.ceil(Math.random() * days).toString().padStart(2, 0)
                    return {
                        amount: Number((Math.random() * labelIndex ** 3).toFixed(2)),
                        date: `${dateStr}-${day}`,
                        label,
                        labelTitle,
                        type: '0',
                        time: Math.random(),
                        _id: `pay${index}`
                    }
                }),
                ...incomeLabels.length ? Array.from(Array(100)).map((item, index) => {
                    const labelIndex = Math.floor(Math.random() * incomeLabels.length) + 1
                    const { label, labelTitle } = incomeLabels[labelIndex - 1]
                    const day = Math.ceil(Math.random() * days).toString().padStart(2, 0)
                    return {
                        amount: Number((Math.random() * labelIndex ** 3).toFixed(2)),
                        date: `${dateStr}-${day}`,
                        label,
                        labelTitle,
                        type: '1',
                        time: Math.random(),
                        _id: `income${index}`
                    }
                }) : []
            ],
        },
        requestID: 'requestID'
    }
}