const express = require('express');
const { sql, poolPromise } = require('./dbconfig');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get products
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
