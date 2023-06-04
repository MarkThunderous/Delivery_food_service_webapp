function fetchCoupons() {
  fetch('http://localhost:3000/api/coupons')
    .then(response => response.json())
    .then(coupons => {
      const couponListDiv = document.getElementById('coupon-list');
      coupons.forEach(coupon => {
        const couponDiv = document.createElement('div');
        couponDiv.classList.add('coupon');

        const codeElement = document.createElement('h2');
        codeElement.textContent = coupon.code;
        couponDiv.appendChild(codeElement);

        const discountElement = document.createElement('p');
        discountElement.textContent = `Discount: ${coupon.discount}%`;
        couponDiv.appendChild(discountElement);

        const expirationElement = document.createElement('p');
        const expirationDate = new Date(coupon.expirationDate);
        expirationElement.textContent = `Expires on: ${expirationDate.toLocaleDateString()}`;
        couponDiv.appendChild(expirationElement);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Code';
        copyButton.classList.add('copy-button');
        copyButton.addEventListener('click', () => {
          const textarea = document.createElement('textarea');
          textarea.textContent = coupon.code;
          textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textarea);
          textarea.select();
          try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
          } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false;
          } finally {
            document.body.removeChild(textarea);
          }
        });
        couponDiv.appendChild(copyButton);

        couponListDiv.appendChild(couponDiv);
      });
    })
    .catch(error => console.error(error));
}

// Call the fetchCoupons function when the page loads
fetchCoupons();
