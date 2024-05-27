document.getElementById('add-product-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
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
