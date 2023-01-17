const prices = [];
let totalPrice = 0;

module.exports = {
  countPrice(a, b, options) {
    const result = (+a * +b);
    prices.push(result);
    return '' + result.toFixed(2);
  },
  getTotalPrice() {
    if (totalPrice === 0) {
      totalPrice = prices.reduce((a, b) => a += b).toFixed(2);
    }
    return totalPrice;
  }
}
