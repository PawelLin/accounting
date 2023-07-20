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
            'w': ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
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
    if (!value && value !== 0) return value
    const number = Number(value)
    if (isNaN(number) || (number < 1000 && number > -1000)) return value
    const numberStr = decimalPlaces || decimalPlaces === 0 ? number.toFixed(decimalPlaces) : number.toString()
    const [integer, decimal = ''] = numberStr.split('.')
    const lastCharIsPoint = value.toString().match(/\.$/)
    return integer.replace(/\B(?=((?:\d{3})+(?!\d)))/g, ',') + (lastCharIsPoint ? '.' : (decimal && `.${decimal}`))
}
const padEndAmount = (value, decimalPlaces = 2) => {
    if (!value && value !== 0) return value
    const [int, decimal] = value.toString().split('.')
    return int + '.' + (decimal || '').padEnd(decimalPlaces, 0)
}
const formatAmountPadEnd = (value, decimalPlaces) => padEndAmount(formatAmount(value, decimalPlaces), decimalPlaces)
const calcPrepare = args => {
    const toFixedMaxlength = args.reduce((length, str = '') => {
        str = str === 0 ? '0' : `${str || ''}`
        const index = str.indexOf('.') + 1
        return Math.max(length, index <= 0 ? 0 : str.length - index)
    }, 0)
    const number1 = parseFloat(args[0] || 0) || 0
    const number2 = parseFloat(args[1] || 0) || 0
    return [number1, number2, toFixedMaxlength]
} 
const numberAddition = (...args) => {
    const [number1, number2, toFixedMaxlength] = calcPrepare(args)
    const result = Number(number1  + number2).toFixed(toFixedMaxlength)
    return parseFloat(result)
}
const numberSubtract = (...args) => {
    const [number1, number2, toFixedMaxlength] = calcPrepare(args)
    const result = Number(number1 - number2).toFixed(toFixedMaxlength)
    return parseFloat(result)
}
const getStorage = key => {
    return new Promise(resolve => {
        wx.getStorage({
            key,
            success: (res) => {
                console.log('get', key, res)
                resolve(res)
            },
            fail (error) {
                console.log('get', key, error)
                resolve(error)
            }
        })
    })
}
const setStorage = (key, data) => {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key,
            data,
            success: (res) => {
                console.log('set', key, res)
                resolve(res)
            },
            fail (error) {
                console.log('set', key, error)
                reject(error)
            }
        })
    })
}
const debounce = function (fn, delay = 200) {
    let timeout = null
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, arguments)
        }, delay)
    }
}

module.exports = {
    formatDate,
    formatAmount,
    padEndAmount,
    formatAmountPadEnd,
    numberAddition,
    numberSubtract,
    getStorage,
    setStorage,
    debounce
}
