//Model de Persona_Moral, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const PersonaMoralModel = {
  //Crear a la persona moral
  createPersonaMoral: (personaMoralData) => db('Persona_Moral').insert({
    giro: personaMoralData.giro,
    proposito: personaMoralData.proposito,
    nombre_organizacion: personaMoralData.nombre_organizacion,
    pagina_web: personaMoralData.pagina_web,
    idAliado: personaMoralData.idAliado, //idAliado del aliado que brinda el apoyo
  }),

  //Apartado de actualización de datos
  updatePersonaMoralGiro: (idPersonaMoral, nuevoGiro) => db('Persona_Moral').where({ idPersonaMoral }).update({ giro: nuevoGiro }),
  updatePersonaMoralProposito: (idPersonaMoral, nuevoProposito) => db('Persona_Moral').where({ idPersonaMoral }).update({ proposito: nuevoProposito }),
  updatePersonaMoralNombre_organizacion: (idPersonaMoral, nuevoNombreOrganizacion) => db('Persona_Moral').where({ idPersonaMoral }).update({ nombre_organizacion: nuevoNombreOrganizacion }),
  updatePersonaMoralPagina_web: (idPersonaMoral, nuevaPaginaWeb) => db('Persona_Moral').where({ idPersonaMoral }).update({ pagina_web: nuevaPaginaWeb }),

  // New method to update all persona moral fields at once
  updatePersonaMoralFull: (idPersonaMoral, personaMoralData) => {
    // Create update object with only the fields that are present in personaMoralData
    const updateData = {};
    
    if (personaMoralData.giro !== undefined) updateData.giro = personaMoralData.giro;
    if (personaMoralData.proposito !== undefined) updateData.proposito = personaMoralData.proposito;
    if (personaMoralData.nombre_organizacion !== undefined) updateData.nombre_organizacion = personaMoralData.nombre_organizacion;
    if (personaMoralData.pagina_web !== undefined) updateData.pagina_web = personaMoralData.pagina_web;
    
    // Only update if there are fields to update
    if (Object.keys(updateData).length > 0) {
      return db('Persona_Moral').where({ idPersonaMoral }).update(updateData);
    }
    return Promise.resolve(0); // Return 0 if no fields to update
  },

  //Obtener datos de las personas morales
  getPersonaMoralById: (idPersonaMoral) => db('Persona_Moral').where({ idPersonaMoral }).first(), //Regresa UN solo objeto gracias al .first()
  getPersonaMoralByGiro: (giro) => db('Persona_Moral').where({ giro }).select('*'), //Regresa todos los objetos que tengan el mismo giro
  getPersonaMoralByNombre_organizacion: (nombre_organizacion) => db('Persona_Moral').where({ nombre_organizacion }).select('*'), //Regresa todos los objetos que tengan el mismo nombre de organizacion
  getPersonaMoralByPagina_web: (pagina_web) => db('Persona_Moral').where({ pagina_web }).select('*'), //Regresa todos los objetos que tengan la misma pagina web
  getPersonaMoralByIdAliado: (idAliado) => db('Persona_Moral').where({ idAliado }).first(), //Regresa la persona moral asociada a un aliado específico
};

module.exports = PersonaMoralModel;