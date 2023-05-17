const formatDate = (date, format = 'yyyy-MM-dd') => {
    if (date) {
        date = date instanceof Date ? date : new Date(date)
        const data = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds(),
        }
        Object.keys(data).forEach((key) => {
            format = format.replace(new RegExp(key), match => {
                const str = `0${data[key]}`
                return str.substring(str.length - match.length)
            })
        })
        return format
    }
    return ''
}
const formatAmount = (value, decimalPlaces) => {
    if (!value && value !== 0) return ''
    const number = Number(value)
    if (isNaN(number)) return ''
    const numberStr = decimalPlaces || decimalPlaces === 0 ? number.toFixed(decimalPlaces) : number.toString()
    const [integer, decimal = ''] = numberStr.split('.')
    return integer.replace(/\B(?=((?:\d{3})+(?!\d)))/g, ',') + (decimal && `.${decimal}`)
}

module.exports = {
    formatDate,
    formatAmount
}
