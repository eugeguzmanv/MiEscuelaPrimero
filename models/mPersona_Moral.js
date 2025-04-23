//Model de Persona_Moral, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const PersonaMoralModel = {
  createPersonaMoral: (personaMoralData) => db('Persona_Moral').insert({
        idAliado: personaMoralData.idAliado,
        nombre_organizacion: personaMoralData.nombre_organizacion,
        proposito: personaMoralData.proposito,
        giro: personaMoralData.giro,
        pagina_web: personaMoralData.pagina_web
    }),

    // Obtener datos por idAliado
    getByAliadoId: (idAliado) =>
      db('Persona_Moral').where({ idAliado }).first(),
  
    // Actualizar datos generales de Persona Moral
    updateDatosGenerales: (idPersonaMoral, datos) =>
      db('Persona_Moral').where({ idPersonaMoral }).update({
        nombre_organizacion: datos.nombre_organizacion,
        proposito: datos.proposito,
        giro: datos.giro,
        pagina_web: datos.pagina_web
      }),
  };
  
  module.exports = PersonaMoralModel;