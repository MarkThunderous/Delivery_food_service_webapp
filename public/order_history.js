document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  function displayOrders(orders) {
    const orderListDiv = document.getElementById('order-list');
    orderListDiv.innerHTML = ''; // Clear any existing content

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const orderNumberElement = document.createElement('h2');
        orderNumberElement.textContent = `Order ID: ${order.orderNumber}`;
        orderDiv.appendChild(orderNumberElement);

        order.items.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = `${item.product.name} - $${item.product.price} x ${item.count}`;
            orderDiv.appendChild(itemElement);
        });

        const totalPriceElement = document.createElement('p');
        totalPriceElement.textContent = `Total: $${order.total.toFixed(2)}`;
        totalPriceElement.classList.add('order-total');
        orderDiv.appendChild(totalPriceElement);

        orderListDiv.appendChild(orderDiv);
    });
}

  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const orderNumber = document.getElementById('order-id').value;

  fetch('/api/order-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, phoneNumber, orderNumber })
  })
  .then(response => response.json())
  .then(orders => {
    if (orders.length > 0) {
      displayOrders(orders);
    } else {
      alert('No orders found');
    }
  })
  .catch(error => console.error(error));
});
