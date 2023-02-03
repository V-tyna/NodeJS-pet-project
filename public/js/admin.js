const deleteProduct = async (btn) => {
	const productId = btn.parentNode.querySelector('[name="productId"]').value;
	const csrfToken = btn.parentNode.querySelector('[name="csrfToken"]').value;
  const productElement = btn.closest('.product-item');

  try {
    const response = await fetch('/admin/product/' + productId, {
    	method: 'DELETE',
      body: JSON.stringify({
        csrfToken
      }),
    	headers: {
    		'Content-Type': 'application/json',
    	},
    });
    await response.json();
    productElement.parentNode.removeChild(productElement);
  } catch (e) {
    console.log('Delete fetch request error: ', e);
  }
};
