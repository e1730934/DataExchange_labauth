module.exports = {
    servers: [
        {
            host: 'localhost',
            port: 3000,
            routes: {
                cors: {
                    origin: ['*']
                }
            }
        }
    ],
}
