//Model de Necesidad, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const NecesidadModel = {
    createNecesidad: async ({CCT, categoria, descripcion, ponderacion, estatus}) => {
        // Es una desestructuración 
        const [necesidad] = await db('Necesidad').insert({CCT, categoria, descripcion, ponderacion, estatus}).returning(['idNecesidad', 'categoria', 'descripcion', 'ponderacion', 'estatus']);
        return necesidad;
      
    }, 
   getNecesidadesByEscuela: async (CCT) => {
    return db('Necesidad').where({CCT}).select('idNecesidad', 'categoria', 'descripcion', 'ponderacion', 'estatus');
   },
    updateEstatus: (idNecesidad, estatus) =>
        db('Necesidad').where({ idNecesidad }).update({
            estatus: estatus
        }), // Actualizar el estatus de una necesidad por idNecesidad
}
module.exports = NecesidadModel;