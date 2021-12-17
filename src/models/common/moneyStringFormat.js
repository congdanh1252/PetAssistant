export function moneyFormat(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}