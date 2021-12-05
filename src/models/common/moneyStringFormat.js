export function moneyFormat(value) {
    var length = value.toString().length
    var temp = value.toString().split("").reverse().join("")
    var money = ''
    for(var i = 0; i < length; i++) {
        money += temp[i]
        if (i % 3 == 2 && i != length - 1 && i != 0) {
            money += '.'
        }
    }
    return money.split("").reverse().join("");
}