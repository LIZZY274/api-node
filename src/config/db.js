import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'lizy',
  password: process.env.DB_PASS || '1980',
  database: process.env.DB_NAME || 'docker',
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a MySQL exitosa');
});

export default connection;
