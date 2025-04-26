const express = require('express');
const necesidadRouter = express.Router();
const NecesidadModel = require('../models/mNecesidad.js');

// Ruta para validar/rechazar una necesidad
necesidadRouter.put('/validar/:idNecesidad', async (req, res) => {
    try {
        const idNecesidad = req.params.idNecesidad;
        const { estatus } = req.body;
        if (!estatus) {
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }
        const existingNecesidad = await NecesidadModel.getNecesidadesById(idNecesidad);
        if (!existingNecesidad) {
            return res.status(404).json({ error: 'La necesidad no existe' });
        }
        await NecesidadModel.updateEstatus(idNecesidad, estatus);
        return res.status(200).json({ message: 'Estatus actualizado exitosamente' });
    } catch (error) {
        console.error('Error al validar necesidad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener todas las necesidades
necesidadRouter.get('/todas', async (req, res) => {
    try {
        const necesidades = await NecesidadModel.getAllNecesidades();
        if (!necesidades || necesidades.length === 0) {
            return res.status(404).json({ error: 'No se encontraron necesidades registradas' });
        }
        return res.status(200).json({
            message: 'Necesidades obtenidas exitosamente',
            necesidades
        });
    } catch (error) {
        console.error('Error al obtener todas las necesidades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = necesidadRouter