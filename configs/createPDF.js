const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

module.exports = (order, res) => {
  const invoiceName = 'invoice-' + order._id + '.pdf';
	const invoicePath = path.join('data', 'invoices', invoiceName);
  const pdfDoc = new pdfDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  pdfDoc.fontSize(20).text('Invoice', { underline: true });
  pdfDoc.fontSize(14).text(`Order number: ${order._id}`);
  pdfDoc.fontSize(12).text(`Data: ${new Date(order.createdAt).toUTCString()}`);
  pdfDoc.text('______________________________________________________________');
  order.orderData.forEach(prod => {
    pdfDoc.text(`Title: ${prod.title}`);
    pdfDoc.text(`Price: ${prod.price}$`);
    pdfDoc.text(`Quantity: ${prod.quantity}`);
    pdfDoc.text('---');
  });
  pdfDoc.text('______________________________________________________________');
  pdfDoc.text(`Delivery address: ${order.address}`);
  pdfDoc.fontSize(14).text(`Total order price: ${order.totalPrice}`);
  pdfDoc.end();
};
