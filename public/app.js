document.getElementById('add-product-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/isAuthenticated');
        const data = await response.json();

        if (data.authenticated) {
            window.location.href = 'add-product.html';
        } else {
            alert('You must be logged in to add a product.');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
});

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('img');
        productImage.src = `http://localhost:3000/product-image/${product.ProductID}`; // Dynamic image path
        productImage.alt = product.ProductName;

        const productName = document.createElement('h2');
        productName.textContent = product.ProductName;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.Price}`;

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);

        productCard.onclick = () => {
            window.location.href = `product.html?id=${product.ProductID}`;
        };

        productsContainer.appendChild(productCard);
    });
}

fetchProducts();
