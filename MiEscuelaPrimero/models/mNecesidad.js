//Model de Necesidad, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

// Create a new necesidad
async function createNecesidad(necesidadData) {
    try {
        const { Categoria, Sub_categoria, Fecha, Descripcion, Estado_validacion, CCT } = necesidadData;
        
        // Validate data formats
        if (!CCT || typeof CCT !== 'string') {
            throw new Error('CCT must be a valid string');
        }
        
        // Ensure Estado_validacion is boolean
        const validationStatus = Estado_validacion === undefined ? false : Boolean(Estado_validacion);
        
        // Use the correct Knex syntax for insertion
        const result = await db('Necesidad').insert({
            Categoria,
            Sub_categoria,
            Fecha,
            Descripcion,
            Estado_validacion: validationStatus,
            CCT
        });
        
        // Return the ID of the inserted necesidad
        return { id: result[0] };
    } catch (error) {
        throw error;
    }
}

// Get all necesidades by CCT
async function getNecesidadesByCCT(CCT) {
    try {
        // Use Knex style query
        const rows = await db('Necesidad').where({ CCT });
        
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get necesidad by ID
async function getNecesidadById(idNecesidad) {
    try {
        // Use Knex style query
        const rows = await db('Necesidad').where({ idNecesidad }).first();
        
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNecesidad,
    getNecesidadesByCCT,
    getNecesidadById
};