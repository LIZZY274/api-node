import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const connection = mysql.createConnection({
  host: '44.194.97.177',
  user: 'lizy',
  password: '1980',
  database: 'docker',
});


connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a MySQL exitosa');
});

export default connection;
