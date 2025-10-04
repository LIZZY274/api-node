import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida exitosamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

export { authenticateDB, sequelize };