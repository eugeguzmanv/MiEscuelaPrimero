//Model de Necesidad, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const NecesidadModel = {
    createNecesidad: (necesidadData) => db('Necesidad').insert({
        idDiagnostico: necesidadData.idDiagnostico,
        ponderacion: necesidadData.ponderacion,
        descripcion: necesidadData.descripcion,
        estatus: necesidadData.estatus,
        categoria: necesidadData.categoria
    }, ['idNecesidad']), // Regresa el idNecesidad generado para usarlo en el index
    getNecesidadesByDiagnosticoId: (idDiagnostico, columna = 'ponderacion') =>
        db('Necesidad').where({ idDiagnostico }).orderBy(columna, 'desc'), // Obtener todas las necesidades por idDiagnostico y en orden de prioridad

    updateEstatus: (idNecesidad, estatus) =>
        db('Necesidad').where({ idNecesidad }).update({
            estatus: estatus
        }), // Actualizar el estatus de una necesidad por idNecesidad
}



module.exports = NecesidadModel;