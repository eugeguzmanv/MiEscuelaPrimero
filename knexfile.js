module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            database: 'mpj_db',
            user: 'postgres',
            password: 'pasSQL07',
        },
        migrations: {
            directory: './migrations',
        },
    }
}