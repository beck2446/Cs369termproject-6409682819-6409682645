document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="https://via.placeholder.com/200" alt="${product.ProductName}">
                <h2>${product.ProductName}</h2>
                <p class="price">$${product.UnitPrice}</p>
            `;

            productCard.addEventListener('click', () => {
                alert(`You clicked on ${product.ProductName}`);
            });

            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
