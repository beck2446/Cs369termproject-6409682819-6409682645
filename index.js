const express = require('express');
const { sql, poolPromise } = require('./dbconfig');

const app = express();
const port = 3000;

//Parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get all products
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// API endpoint to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('productId', sql.Int, productId)
            .query('SELECT * FROM Products WHERE ProductID = @productId');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Create a new product
app.post('/api/products', async (req, res) => {
    const { ProductName, Category, Price, Quantity } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProductName', sql.NVarChar, ProductName)
            .input('Category', sql.NVarChar, Category)
            .input('Price', sql.Int, Price)
            .input('Quantity', sql.Int, Quantity)
            .query(`INSERT INTO Products (ProductName, Category, Price, Quantity)
                    VALUES (@ProductName, @Category, @Price, @Quantity);
                    SELECT SCOPE_IDENTITY() AS ProductID;`);
        res.status(201).json({ message: 'Product created successfully', productId: result.recordset[0].ProductID });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ProductID', sql.Int, productId)
            .query('DELETE FROM Products WHERE ProductID = @ProductID');
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
