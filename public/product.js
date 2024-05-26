document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetail = document.getElementById('product-detail');

    if (productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            productDetail.innerHTML = `
                <img src="https://via.placeholder.com/400" alt="${product.ProductName}">
                <h2>${product.ProductName}</h2>
                <p><strong>Price:</strong> $${product.UnitPrice}</p>
                <p><strong>Quantity Per Unit:</strong> ${product.QuantityPerUnit}</p>
                <p><strong>Units In Stock:</strong> ${product.UnitsInStock}</p>
                <p><strong>Units On Order:</strong> ${product.UnitsOnOrder}</p>
                <p><strong>Reorder Level:</strong> ${product.ReorderLevel}</p>
                <p><strong>Discontinued:</strong> ${product.Discontinued ? 'Yes' : 'No'}</p>
            `;
        } catch (error) {
            console.error('Error fetching product details:', error);
            productDetail.innerHTML = `<p>Could not fetch product details. Please try again later.</p>`;
        }
    } else {
        productDetail.innerHTML = `<p>Product ID is missing.</p>`;
    }
});
