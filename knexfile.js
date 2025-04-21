module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: 'localhost',
            database: 'mpj_db',
            user: 'postgres',
            password: '230504',
        },
        migrations: {
            directory: './migrations',
        },
    }
}