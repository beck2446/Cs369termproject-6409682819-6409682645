document.getElementById('add-product-button').onclick = function () {
    window.location.href = 'add-product.html';
};

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
        productImage.src = 'https://via.placeholder.com/150'; 
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
