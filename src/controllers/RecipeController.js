
import { sequelize } from '../config/db.js'; 


const Recipe = sequelize.models.Recipe;

if (!Recipe) {
 
  throw new Error("El modelo 'Recipe' no ha sido encontrado. Verifique el flujo de inicialización en index.js.");
}


export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json({ 
      success: true, 
      count: recipes.length, 
      data: recipes 
    });
  } catch (error) {
    console.error('Error en getRecipes:', error);
    res.status(500).json({ success: false, error: 'Server Error al obtener recetas' });
  }
};


export const addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: recipe 
    });
  } catch (error) {
    console.error('Error en addRecipe:', error);
    if (error.name.startsWith('Sequelize')) {
      const messages = error.errors ? error.errors.map(err => err.message) : ['Error de validación o restricción de la base de datos.'];
      return res.status(400).json({ success: false, error: messages });
    } else {
      res.status(500).json({ success: false, error: 'Server Error al crear receta' });
    }
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const affectedRows = await Recipe.destroy({
      where: { id: req.params.id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Receta no encontrada' });
    }
    
    res.status(200).json({ success: true, data: {} });

  } catch (error) {
    console.error('Error en deleteRecipe:', error);
    res.status(500).json({ success: false, error: 'Server Error al eliminar receta' });
  }
};