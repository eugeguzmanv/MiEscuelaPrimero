//Model de Persona_Moral, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const PersonaMoralModel = {
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
  
    // Actualizar Constancia Fiscal
    updateConstanciaFiscal: (idPersonaMoral, datos) =>
      db('Constancia_Fiscal').where({ idPersonaMoral }).update({
        rfc: datos.rfc,
        regimen: datos.regimen,
        domicilio_fiscal: datos.domicilio_fiscal,
        razon_social: datos.razon_social
      }),
  
    // Actualizar Escritura Pública
    updateEscrituraPublica: (idPersonaMoral, datos) =>
      db('Escritura_Publica').where({ idPersonaMoral }).update({
        numero: datos.numero,
        notario: datos.notario,
        ciudad: datos.ciudad,
        fecha: datos.fecha
      })
  };
  
  module.exports = PersonaMoralModel;