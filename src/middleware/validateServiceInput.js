export const validateServiceInput = (req, res, next) => {
  const { tipo, fecha, costo, taller, descripcion } = req.body;

  if (!tipo || !fecha || !costo || !taller)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  if (isNaN(Date.parse(fecha)))
    return res.status(400).json({ error: 'Formato de fecha inválido' });

  next();
};
