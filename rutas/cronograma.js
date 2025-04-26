const express = require('express');
const cronogramaRouter = express.Router();
const CronogramaModel = require('../models/mCronograma.js');

// Ruta para crear cronogramas mensuales
cronogramaRouter.post('/mensuales', async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.body;
    try {
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'Las fechas de inicio y fin son obligatorias' });
        }
        const cronogramas = await CronogramaModel.createCronograma(fecha_inicio, fecha_fin);
        return res.status(201).json({ message: 'Cronogramas mensuales creados exitosamente', cronogramas });
    } catch (error) {
        console.error('Error al crear cronogramas mensuales:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = cronogramaRouter;