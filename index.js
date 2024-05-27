const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { sql, poolPromise } = require('./dbconfig');

const app = express();
const port = 3000;

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Session setup
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM Users WHERE Username = @username');
            const user = result.recordset[0];
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const match = await bcrypt.compare(password, user.PasswordHash);
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            console.error('Error in LocalStrategy:', err);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.UserID);
});

passport.deserializeUser(async (id, done) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, id)
            .query('SELECT * FROM Users WHERE UserID = @UserID');
        done(null, result.recordset[0]);
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err);
    }
});

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/add-product.html',
    failureRedirect: '/index.html',
    failureFlash: true // Optional: use connect-flash for flash messages
}));

// Check if user is authenticated
app.get('/api/isAuthenticated', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});


// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    const { ProductName, Category, Price, Quantity } = req.body;
    const imagePath = req.file.path; // Path to the uploaded file

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ProductName', sql.NVarChar, ProductName)
            .input('Category', sql.NVarChar, Category)
            .input('Price', sql.Int, Price)
            .input('Quantity', sql.Int, Quantity)
            .input('ImagePath', sql.NVarChar, imagePath)
            .query(`
                INSERT INTO Products (ProductName, Category, Price, Quantity, ImagePath)
                VALUES (@ProductName, @Category, @Price, @Quantity, @ImagePath);
            `);
        res.status(201).send('Product created successfully with image');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: 'Error creating product' });
    }
});

// Route to serve product images
app.get('/product-image/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProductID', sql.Int, productId)
            .query('SELECT ImagePath FROM Products WHERE ProductID = @ProductID');
        
        const imagePath = result.recordset[0]?.ImagePath;
        if (imagePath) {
            res.sendFile(path.resolve(imagePath));
        } else {
            res.status(404).send('Image not found');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: 'Error retrieving image' });
    }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

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
