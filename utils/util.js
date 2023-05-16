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

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

module.exports = {
    formatDate
}
