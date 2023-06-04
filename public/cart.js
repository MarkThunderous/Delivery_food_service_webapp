let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function populateCart() {
    const cartDiv = document.getElementById('cart-items');
    // Clear existing cart items in UI
    cartDiv.innerHTML = '';

    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.product.name} - $${item.product.price} x `;

        // Add input for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.count;
        quantityInput.addEventListener('change', () => {
            updateCartItem(index, quantityInput.value);
            populateCart();
            updateTotalPrice();
        });

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeCartItem(index);
            populateCart();
            updateTotalPrice();
        });

        // Add elements to itemDiv
        itemDiv.appendChild(quantityInput);
        itemDiv.appendChild(removeButton);
        cartDiv.appendChild(itemDiv);
    });
}
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const count = cartItems.reduce((total, item) => total + item.count, 0);
  document.getElementById('cart-count').textContent = count;
}

function updateCartItem(index, count) {
    // Check if the item exists in the cart
    if (cartItems[index]) {
        cartItems[index].count = Number(count);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Success:', cartItems[index]);

        // Update cart count and total price
        updateCartCount();
        updateTotalPrice();
    } else {
        console.error(`Item at index ${index} not found in cart.`);
    }
}


function removeCartItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Success: Item removed');

    // Update cart count and total price
    updateCartCount();
    updateTotalPrice();
}

function updateTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.count, 0);
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

    // Store the updated total price in localStorage
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
}

document.getElementById('checkout-button').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const phoneNumber = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;

  if (!name || !phoneNumber || !address || !email) {
    alert('Please fill out all fields before submitting your order.');
    return;
  }

  const customerInfo = {
    name,
    phoneNumber,
    address,
    email
  };

  fetch('http://localhost:3000/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerInfo,
      items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
      total: JSON.parse(localStorage.getItem('totalPrice') || '0'),
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Clear the cart, total price and customer info in local storage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('customerInfo');
    updateCartItem();
    updateTotalPrice();
    updateCartCount();
    alert(`Order has been successfully made! Your order number is: ${data.orderNumber}`); // here we access the orderNumber from the data object
    window.location.reload();
  })
  .catch(error => console.error(error));
});

let couponApplied = false; // Track whether a coupon has been applied

function calculateTotalPrice() {
  if (!Array.isArray(cartItems)) {
    console.error('cartItems is not an array');
    return;
  }

  let totalPrice = 0;
  cartItems.forEach(item => {
    if (typeof item.product.price !== 'number' || typeof item.count !== 'number') {
      console.error('Invalid item in cartItems:', item);
      return;
    }

    console.log("Item price:", item.product.price);
    console.log("Item quantity:", item.count);
    totalPrice += item.product.price * item.count;
  });

  console.log("Total price:", totalPrice);
  return totalPrice;
}



document.getElementById('apply-coupon-button').addEventListener('click', () => {
    // If a coupon has already been applied, do nothing
    if (couponApplied) {
        return;
    }

    const code = document.getElementById('coupon-input').value;

    fetch('http://localhost:3000/api/validate-coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code})
    })
        .then(response => response.json())
        .then(coupon => {
            const discountElement = document.getElementById('discount-amount');
            const totalPriceElement = document.getElementById('total-price');

            let totalPrice = calculateTotalPrice();
            const discountAmount = totalPrice * (coupon.discount / 100);
            totalPrice -= discountAmount;

            // Update total price in the local storage
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));

            discountElement.textContent = `Discount: $${discountAmount.toFixed(2)}`;
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

            // Mark that a coupon has been applied
            couponApplied = true;

            // Disable the coupon input and button
            document.getElementById('coupon-input').disabled = true;
            document.getElementById('apply-coupon-button').disabled = true;
        })
        .catch(error => {
            console.error(error);
            alert('Failed to apply coupon');
        });
})

window.addEventListener('DOMContentLoaded', (event) => {
    populateCart();
    updateTotalPrice();
    updateCartCount();
});


