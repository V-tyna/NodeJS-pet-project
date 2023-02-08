const stripe = Stripe('pk_test_51MYpSAIYMQ1jo6BOkp0XbecAeQoTt683wKpYwjDkdsx0LuEzbQKGK7XrCvrEY6aY0nB32fkJjpTnb9m2kEuOMuQh00KtF3GyQ2');
const orderBtn = document.getElementById('order-button');
const sessionId = document.getElementById('sessionId').value;
orderBtn.addEventListener('click', () => {
  stripe.redirectToCheckout({
    sessionId
  });
});
