let prices = [];

module.exports = {
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
  },
  countPrice(a, b, options) {
    const result = (+a * +b);
    prices.push(result);
    return '' + result.toFixed(2);
  },
  isError(a, b, options) {
    if (a.find(errorObj => errorObj.param === b)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  isNotEqual(a, b, options) {
    if (a !== b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  isUndefined(a, options) {
    if (a === undefined) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  reduceDescription(a, options) {
    return a.slice(0, 100) + '...';
  }
}
