export function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})/
    return regex.test(String(phone).toLowerCase());
}

export function checkDateAfterToday(date) {
    var d = new Date(Date.parse(date))

    if (d > new Date()) 
        return false
    else 
        return true
}