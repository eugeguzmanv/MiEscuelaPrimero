//Model de Apoyo para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

// Create a new apoyo
async function createApoyo(apoyoData) {
    try {
        const { Categoria, Sub_categoria, Fecha, Descripcion, Estado_validacion, idAliado } = apoyoData;
        
        // Ensure Estado_validacion is boolean
        const validationStatus = Estado_validacion === undefined ? false : Boolean(Estado_validacion);
        
        // Use the correct Knex syntax for insertion
        const result = await db('Apoyo').insert({
            Categoria,
            Sub_categoria,
            Fecha,
            Descripcion,
            Estado_validacion: validationStatus,
            idAliado
        });
        
        // Return the ID of the inserted apoyo
        return { id: result[0] };
    } catch (error) {
        throw error;
    }
}

// Get all apoyos by idAliado
async function getApoyosByAliadoId(idAliado) {
    try {
        // Use Knex style query
        const rows = await db('Apoyo').where({ idAliado });
        
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get apoyo by ID
async function getApoyoById(idApoyo) {
    try {
        // Use Knex style query
        const row = await db('Apoyo').where({ idApoyo }).first();
        
        return row;
    } catch (error) {
        throw error;
    }
}

// Update validation status
async function updateValidacionEstado(idApoyo) {
    try {
        const result = await db('Apoyo')
            .where({ idApoyo })
            .update({ Estado_validacion: true });
        return result > 0;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createApoyo,
    getApoyosByAliadoId,
    getApoyoById,
    updateValidacionEstado
};