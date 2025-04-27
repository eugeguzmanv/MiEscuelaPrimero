//Model de Escritura_Publica, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const EscrituraPublicaModel = {
    //Crear la escritura publica
    createEscrituraPublica: (escrituraPublicaData) => db('Escritura_Publica').insert({
        idEscrituraPublica: escrituraPublicaData.idEscrituraPublica,
        idAliado: escrituraPublicaData.idAliado, //idAliado del aliado que brinda el apoyo
        idPersonaMoral: escrituraPublicaData.idPersonaMoral, //idPersonaMoral de la persona moral que brinda el apoyo
        fecha_escritura: escrituraPublicaData.fecha_escritura,
        notario: escrituraPublicaData.notario,
        numero_escritura: escrituraPublicaData.numero_escritura,
        ciudad: escrituraPublicaData.ciudad,
    }),
    
    //Apartado de actualización de datos
    updateEscrituraPublicaFecha: (idEscrituraPublica, nuevaFecha) => db('Escritura_Publica').where({ idEscrituraPublica }).update({ fecha_escritura: nuevaFecha }),
    updateEscrituraPublicaNotario: (idEscrituraPublica, nuevoNotario) => db('Escritura_Publica').where({ idEscrituraPublica }).update({ notario: nuevoNotario }),
    updateEscrituraPublicaCiudad: (idEscrituraPublica, nuevaCiudad) => db('Escritura_Publica').where({ idEscrituraPublica }).update({ ciudad: nuevaCiudad }),
    updateEscrituraPublicaNumero: (idEscrituraPublica, nuevoNumero) => db('Escritura_Publica').where({ idEscrituraPublica }).update({ numero_escritura: nuevoNumero }),
    
    // New method to update all escritura publica fields at once
    updateEscrituraPublicaFull: (idEscrituraPublica, escrituraPublicaData) => {
        // Create update object with only the fields that are present in escrituraPublicaData
        const updateData = {};
        
        if (escrituraPublicaData.fecha_escritura !== undefined) updateData.fecha_escritura = escrituraPublicaData.fecha_escritura;
        if (escrituraPublicaData.notario !== undefined) updateData.notario = escrituraPublicaData.notario;
        if (escrituraPublicaData.numero_escritura !== undefined) updateData.numero_escritura = escrituraPublicaData.numero_escritura;
        if (escrituraPublicaData.ciudad !== undefined) updateData.ciudad = escrituraPublicaData.ciudad;
        
        // Only update if there are fields to update
        if (Object.keys(updateData).length > 0) {
            return db('Escritura_Publica').where({ idEscrituraPublica }).update(updateData);
        }
        return Promise.resolve(0); // Return 0 if no fields to update
    },
    
    //Obtener datos de las escrituras publicas
    getEscrituraPublicaById: (idEscrituraPublica) => db('Escritura_Publica').where({ idEscrituraPublica }).first(), //Regresa UN solo objeto gracias al .first()
    getEscrituraPublicaBynumero_escritura: (numero_escritura) => db('Escritura_Publica').where({ numero_escritura }).select('*'), //Regresa todos los objetos que tengan el mismo numero de escritura
    getEscrituraPublicaByCiudad: (ciudad) => db('Escritura_Publica').where({ ciudad }).select('*'), //Regresa todos los objetos que tengan la misma ciudad
    getEscrituraPublicaByNotario: (notario) => db('Escritura_Publica').where({ notario }).select('*'), //Regresa todos los objetos que tengan el mismo notario
    getAllEscriturapublicasByIdPersonaMoral: (idPersonaMoral) => db('Escritura_Publica').where({ idPersonaMoral }).select('*'), //Regresa todos los objetos que tengan el mismo idPersonaMoral
};

module.exports = EscrituraPublicaModel;