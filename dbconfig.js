const sql = require('mssql');

const config = {
    user: 'username', 
    password: 'password',
    server: 'ALLUN33D\\SQLEXPRESS',
    database: 'onlineShop',
    options: {
        encrypt: false,
        enableArithAbort: true
    }
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
