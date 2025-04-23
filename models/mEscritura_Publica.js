//Model de Escritura_Publica, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const EscrituraPublicaModel = {
    createEscrituraPublica: (escrituraPublicaData) => db('Escritura_Publica').insert({
            idPersonaMoral: escrituraPublicaData.idPersonaMoral,
            numero_escritura: escrituraPublicaData.numero_escritura,
            notario: escrituraPublicaData.notario,
            ciudad: escrituraPublicaData.ciudad,
            fecha_escritura: escrituraPublicaData.fecha_escritura
        }), 
    // Obtener datos por idAliado
    getByAliadoId: (idAliado) =>
      db('Escritura_Publica').where({ idAliado }).first(),
    
     getByPersonaMoralId: (idPersonaMoral) =>
      db('Escritura_Publica').where({ idPersonaMoral }).first(),
    // Actualizar datos generales de Escritura Pública
    updateDatosGenerales: (idPersonaMoral, datos) =>
      db('Escritura_Publica').where({ idPersonaMoral }).update({
        numero_escritura: datos.numero_escritura,
        notario: datos.notario,
        ciudad: datos.ciudad,
        fecha_escritura: datos.fecha_escritura
      })
  };
  module.exports = EscrituraPublicaModel; //Exportamos el modelo para usarlo en otros archivos
