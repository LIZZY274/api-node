import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a MySQL exitosa');
});

export default connection;
