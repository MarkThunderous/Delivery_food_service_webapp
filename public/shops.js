let currentShopId = null;

fetch('http://localhost:3000/api/shops')
    .then(response => response.json())
    .then(shops => {
        const shopList = document.getElementById('shop-list');
        shops.forEach(shop => {
            const shopContainer = document.createElement('div');
            shopContainer.classList.add("shop-container");

            const shopImage = document.createElement('img');
            shopImage.src = shop.imageUrl;
            shopImage.classList.add("shop-image");
            shopContainer.appendChild(shopImage);

            const shopName = document.createElement('h2');
            shopName.textContent = shop.name;
            shopContainer.appendChild(shopName);

            const shopAddress = document.createElement('p');
            shopAddress.textContent = shop.address;
            shopContainer.appendChild(shopAddress);

            shopContainer.addEventListener('click', () => {
                currentShopId = shop._id;
                showProducts(shop);
                // Close the sidebar
                const sidebar = document.getElementById('sidebar');
                const main = document.getElementById('main');
                sidebar.style.width = '0';
                main.style.marginLeft = '0';
                // Hide the "Show Restaurants" button
                const showSidebarButton = document.getElementById('show-sidebar-button');
                showSidebarButton.style.display = 'none';
            });

            shopList.appendChild(shopContainer);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function addToCart(product, shopId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length > 0 && cartItems[0].product.shop !== shopId) {
        // If the product is from a different shop, clear the cart
        clearCart();
        cartItems = [];
    }

    // Create new item
    const newItem = {
        product: {
            name: product.name,
            price: product.price,
            shop: shopId // store the shop id in the product data
        },
        count: 1
    };

    // Add to cart
    cartItems.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    console.log('Success:', newItem);
    // Update cart count
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem('cartItems');
    console.log('Success: Cart cleared');
}

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const count = cartItems.reduce((total, item) => total + item.count, 0);
  document.getElementById('cart-count').textContent = count;
}

function showProducts(shop) {
    const productList = document.getElementById('product-list');
    const placeholder = document.getElementById('placeholder');
    const showSidebarButton = document.getElementById('show-sidebar-button');
    showSidebarButton.style.display = 'none';

    // clear out the previous content
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }

    // Hide the placeholder
    placeholder.style.display = 'none';

    shop.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = "product-item";

        const productImage = document.createElement('img');
        productImage.src = product.imageUrl;
        productDiv.appendChild(productImage);

        const productName = document.createElement('p');
        productName.textContent = product.name;
        productDiv.appendChild(productName);

        const productDescription = document.createElement('p');
        productDescription.textContent = product.description;
        productDiv.appendChild(productDescription);

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;
        productDiv.appendChild(productPrice);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to cart';
        addToCartButton.addEventListener('click', () => {
            addToCart(product, shop._id);
        });
        productDiv.appendChild(addToCartButton);

        productList.appendChild(productDiv);
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    updateCartCount();

    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('main');
        const showSidebarButton = document.getElementById('show-sidebar-button');

        if (sidebar.style.width === '0px') {
            sidebar.style.width = '250px';
            main.style.marginLeft = '250px';
            showSidebarButton.style.display = 'none'; // Hide the button when sidebar is opened
        } else {
            sidebar.style.width = '0';
            main.style.marginLeft = '0';
        }
    });

    document.getElementById('show-sidebar-button').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('main');
        const placeholderWrapper = document.getElementById('placeholder-wrapper');

        sidebar.style.width = '250px';
        main.style.marginLeft = '250px';
        placeholderWrapper.style.display = 'none';
    });
});

window.addEventListener('DOMContentLoaded', (event) => {
    updateCartCount();
});

