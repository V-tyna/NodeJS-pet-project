let prices = [];

module.exports = {
  countPrice(a, b, options) {
    const result = (+a * +b);
    prices.push(result);
    return '' + result.toFixed(2);
  },
  getDateAndTime(str) {
    const date = new Date(str).toLocaleDateString();
    const hours = new Date(str).getHours();
    const minutes = new Date(str).getHours();
    return `${date}, ${hours}:${minutes}`;
  },
  getTotalPrice() {
    const totalPrice = prices.reduce((a, b) => a += b).toFixed(2);
    prices = [];
    return totalPrice;
  }
}
