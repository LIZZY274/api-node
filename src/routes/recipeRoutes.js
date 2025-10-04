import express from 'express';
import { sequelize } from '../config/db.js';

const router = express.Router();

const getRecipeModel = (req, res, next) => {
    const Recipe = sequelize.models.Recipe;
    if (!Recipe) {
        return res.status(500).json({ error: "Recipe model not initialized" });
    }
    req.Recipe = Recipe;
    next();
};

router.use(getRecipeModel);

router.get('/', async (req, res) => {
    try {
        const recipes = await req.Recipe.findAll({
            attributes: ['id', 'title', 'ingredients', 'instructions', 'prepTime', 'createdAt', 'updatedAt'],
            raw: true
        });
        
        const formattedRecipes = recipes.map(recipe => ({
            id: parseInt(recipe.id),
            title: recipe.title,
            ingredients: typeof recipe.ingredients === 'string' 
                ? JSON.parse(recipe.ingredients) 
                : recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: parseInt(recipe.prepTime),
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        }));
        
        res.json({ data: formattedRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las recetas.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newRecipe = await req.Recipe.create(req.body);
        
        const formattedRecipe = {
            id: parseInt(newRecipe.id),
            title: newRecipe.title,
            ingredients: newRecipe.ingredients,
            instructions: newRecipe.instructions,
            prepTime: parseInt(newRecipe.prepTime),
            createdAt: newRecipe.createdAt,
            updatedAt: newRecipe.updatedAt
        };
        
        res.status(201).json(formattedRecipe);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await req.Recipe.destroy({
            where: { id: req.params.id }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Receta no encontrada.' });
        }
        res.status(200).json({ success: true, message: 'Receta eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la receta.' });
    }
});

export default router;
