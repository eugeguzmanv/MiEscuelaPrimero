const express = require('express');
const apoyoRouter = express.Router();
const ApoyoModel = require('../models/mApoyo.js');

// Ruta para mostrar los apoyos pendientes de validar
apoyoRouter.get('/pendientes', async (req, res) => {
    try {
        const apoyosPendientes = await ApoyoModel.getApoyosPendientes();
        if (!apoyosPendientes || apoyosPendientes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron apoyos pendientes de validar' });
        }
        return res.status(200).json({
            message: 'Apoyos pendientes obtenidos exitosamente',
            apoyos: apoyosPendientes
        });
    } catch (error) {
        console.error('Error al obtener apoyos pendientes:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = apoyoRouter;