import express from 'express';
import bodyParser from 'body-parser';
import { authenticateDB, sequelize } from './config/db.js'; 
import { DataTypes } from 'sequelize';
import recipeModel from './models/Recipe.js'; 
import recipeRoutes from './routes/recipeRoutes.js'; 

const app = express();
app.use(bodyParser.json());

const startServer = async () => {
    await authenticateDB(); 

    const Recipe = recipeModel(sequelize, DataTypes);

    await Recipe.sync({ alter: true }); 
    console.log("Todos los modelos fueron sincronizados exitosamente.");
    
    app.use('/api/recipes', recipeRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
        console.log(`API lista en: http://localhost:${PORT}/api/recipes`);
    });
};

startServer();
