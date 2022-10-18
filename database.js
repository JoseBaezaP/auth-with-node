var path = './.env';
require('dotenv').config({ path: path });


module.exports = {
    ['development']: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'postgres',
        storage: process.env.DB_DIALECT === 'sqlite' ? './db.sqlite' : null,
        dialectOptions: {
            useUTC: false,
            ssl: false
        },
        ssl: true,

    }
}

