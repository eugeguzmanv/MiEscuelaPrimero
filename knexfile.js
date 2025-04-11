module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            database: 'mpj_db',
            user: 'diegompj',
            password: 'diego',
        },
        migrations: {
            directory: './migrations',
        },
    }
}