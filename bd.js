const Pool = require('pg').Pool
const pool =  new Pool({
    user: "admin",
    password: "KursachAdmin",
    host: "localhost",
    port: 5432,
    database: "kursach"
})

module.exports = pool