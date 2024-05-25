const sql = require('mssql');

const config = {
    user: 'cs369',
    password: 'cs369@tu',
    server: 'ALLUN33D\\SQLEXPRESS',
    database: 'northwind',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
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
