document.getElementById('add-product-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const product = {
        ProductName: document.getElementById('productName').value,
        Category: document.getElementById('category').value,
        Quantity: document.getElementById('quantity').value,
        Price: document.getElementById('price').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Product added successfully!');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert('Error adding product: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product: ' + error.message);
    }
});
