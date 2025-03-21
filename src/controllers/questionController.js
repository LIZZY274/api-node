import { getQuestionsByLevel } from '../models/questionModel.js';

export const getQuestions = (req, res) => {
    const { level, word } = req.query;

    if (!level) {
        return res.status(400).json({ message: "Falta el parámetro 'level'" });
    }

    const filteredQuestions = getQuestionsByLevel(level);

    if (filteredQuestions.length === 0) {
        return res.status(404).json({ message: "No hay preguntas para este nivel" });
    }

    // Si el usuario ingresa una palabra, la validamos con la expresión regular
    if (word) {
        const matches = filteredQuestions.map(q => {
            const regex = new RegExp(q.pattern); 
            const isMatch = regex.test(word); 

            return {
                id: q.id,
                level: q.level,
                pattern: q.pattern,
                word,
                isMatch,  // 🔥 Muestra si la palabra cumple con la expresión
                inWordsList: q.words.includes(word) // 🔥 Verifica si está en la lista
            };
        });

        return res.json(matches);
    }

    res.json(filteredQuestions);
};
