export const testRegex = (req, res) => {
    const { pattern, word } = req.body;

    if (!pattern || !word) {
        return res.status(400).json({ message: "Faltan parámetros: pattern y word" });
    }

    const regex = new RegExp(pattern);
    const isMatch = regex.test(word);

    res.json({ word, pattern, isMatch });
};
