//Model de Constancia_Fiscal, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const ConstanciaFiscalModel = {
    createConstanciaFiscal: (constanciaFiscalData, trx = db) => trx('Constancia_Fiscal').insert({
            idPersonaMoral: constanciaFiscalData.idPersonaMoral,
            RFC: constanciaFiscalData.RFC,
            regimen: constanciaFiscalData.regimen,
            domicilio: constanciaFiscalData.domicilio,
            razon_social: constanciaFiscalData.razon_social
        }, ['idConstanciaFiscal']), // Regresa el idConstanciaFiscal generado para usarlo en el index
    // Obtener datos por idAliado
    getByAliadoId: (idAliado) =>
      db('Constancia_Fiscal').where({ idAliado }).first(),
    getByPersonaMoralId: (idPersonaMoral) =>
      db('Constancia_Fiscal').where({ idPersonaMoral }).first(),
    // Actualizar datos generales de Constancia Fiscal
    updateDatosGenerales: (idPersonaMoral, datos) =>
      db('Constancia_Fiscal').where({ idPersonaMoral }).update({
        RFC: datos.RFC,
        regimen: datos.regimen,
        domicilio_fiscal: datos.domicilio,
        razon_social: datos.razon_social
      })
  };
module.exports = ConstanciaFiscalModel; //Exportamos el modelo para usarlo en otros archivos