const express = require('express');
const { sql, poolPromise } = require('./dbconfig');

const app = express();
const port = 3000;

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
