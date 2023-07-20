import { payLabels, incomeLabels } from './getLabel'

export default params => {
    return {
        result: {
            data: [
                ...Array.from(Array(100)).map((item, index) => {
                    const labelIndex = Math.floor(Math.random() * payLabels.length) + 1
                    const { label, labelTitle } = payLabels[labelIndex - 1]
                    const day = Math.ceil(Math.random() * 31).toString().padStart(2, 0)
                    return {
                        amount: Number((Math.random() * labelIndex ** 3).toFixed(2)),
                        date: `2023-07-${day}`,
                        label,
                        labelTitle,
                        type: '0'
                    }
                }),
                ...incomeLabels.length ? Array.from(Array(100)).map((item, index) => {
                    const labelIndex = Math.floor(Math.random() * incomeLabels.length) + 1
                    const { label, labelTitle } = incomeLabels[labelIndex - 1]
                    const day = Math.ceil(Math.random() * 31).toString().padStart(2, 0)
                    return {
                        amount: Number((Math.random() * labelIndex ** 3).toFixed(2)),
                        date: `2023-07-${day}`,
                        label,
                        labelTitle,
                        type: '1'
                    }
                }) : []
            ],
        },
        requestID: 'requestID'
    }
}