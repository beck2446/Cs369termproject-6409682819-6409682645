const express = require('express');
const session = require('express-session');

const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { sql, poolPromise } = require('./dbconfig');

const app = express();
const port = 3000;

//Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    successRedirect: '/index.html',
    failureRedirect: '/index.html',
    failureFlash: true // Optional: use connect-flash for flash messages
}));

// Middleware to check authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/index.html');
}

// Check if the user is authenticated
app.get('/api/isAuthenticated', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
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
