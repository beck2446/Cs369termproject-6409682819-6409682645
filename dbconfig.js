const sql = require('mssql');

const config = {
    //user: 'cs369',
    //password: 'cs369@tu',
    //server: 'ALLUN33D\\SQLEXPRESS',
    //port: 1433, // Replace with your port number
    //database: 'onlineShop',

    user: 'cs369',
    password: '12345678',
    server: 'database1.c924oamkeplt.us-east-1.rds.amazonaws.com',
    port: 1433, // Replace with your port number
    database: 'onlineShop',

    //user: 'cs369',
    //password: '123456',
    //server: 'LAPTOP-P9NN5OHO\\SQLEXPRESS',
    //port: 1433, // Replace with your port number
    //database: 'onlineShop',

    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 600000
    },
    connectionTimeout: 600000,
    requestTimeout: 600000
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

module.exports = {
    sql, poolPromise
};
