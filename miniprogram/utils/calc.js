class Calc {
    getData (nums) {
        let number1 = Number(nums[0] || 0)
        let number2 = Number(nums[1] || 0)
        if (isNaN(number1) || isNaN(number2)) {
            throw new Error('value is not a number')
        }
        number1 = number1.toString().match(/(\d+)\.*(\d*)/)
        number2 = number2.toString().match(/(\d+)\.*(\d*)/)
        const decimalMaxlength = Math.max(number1[2].length, number2[2].length)
        const multiple = decimalMaxlength ? Math.pow(10, decimalMaxlength) : 1
        number1 = Number(`${number1[1]}${number1[2].padEnd(decimalMaxlength, 0)}`)
        number2 = Number(`${number2[1]}${number2[2].padEnd(decimalMaxlength, 0)}`)
        return [number1, number2, multiple, decimalMaxlength]
    }
    add (...nums) {
        const [number1, number2, multiple] = this.getData(nums)
        return (number1 + number2) / multiple
    }
    sub (...nums) {
        const [number1, number2, multiple] = this.getData(nums)
        return (number1 - number2) / multiple
    }
    mul (...nums) {
        const [number1, number2, multiple] = this.getData(nums)
        return (number1 * number2) / multiple / multiple
    }
    div (...nums) {
        const [number1, number2] = this.getData(nums)
        return number1 / number2
    }
}
export default new Calc()