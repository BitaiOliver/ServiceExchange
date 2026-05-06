import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'oliver',
    password: '12345678',
    database: 'serviceexchange'
}).promise()

export default pool;