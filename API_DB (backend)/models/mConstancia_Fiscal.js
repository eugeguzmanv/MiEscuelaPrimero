//Model de Constancia_Fiscal, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const ConstanciaFiscalModel = {
    //Crear la constancia fiscal
    createConstanciaFiscal: (constanciaFiscalData) => db('Constancia_Fiscal').insert({
        idPersonaMoral: constanciaFiscalData.idPersonaMoral, //idPersonaMoral de la persona moral que brinda el apoyo
        RFC: constanciaFiscalData.RFC,
        razon_social: constanciaFiscalData.razon_social,
        regimen: constanciaFiscalData.regimen,
        domicilio: constanciaFiscalData.domicilio,
    }),

    //Actualizar la constancia fiscal
    updateConstanciaFiscalRFC: (idConstanciaFiscal, nuevoRFC) => db('Constancia_Fiscal').where({ idConstanciaFiscal }).update({ RFC: nuevoRFC }),
    updateConstanciaFiscalRazonSocial: (idConstanciaFiscal, nuevaRazonSocial) => db('Constancia_Fiscal').where({ idConstanciaFiscal }).update({ razon_social: nuevaRazonSocial }),
    updateConstanciaFiscalDomicilio: (idConstanciaFiscal, nuevoDomicilio) => db('Constancia_Fiscal').where({ idConstanciaFiscal }).update({ domicilio: nuevoDomicilio }),
    
    // New method to update all constancia fiscal fields at once
    updateConstanciaFiscalFull: (idConstanciaFiscal, constanciaFiscalData) => {
        // Create update object with only the fields that are present in constanciaFiscalData
        const updateData = {};
        
        if (constanciaFiscalData.RFC !== undefined) updateData.RFC = constanciaFiscalData.RFC;
        if (constanciaFiscalData.razon_social !== undefined) updateData.razon_social = constanciaFiscalData.razon_social;
        if (constanciaFiscalData.regimen !== undefined) updateData.regimen = constanciaFiscalData.regimen;
        if (constanciaFiscalData.domicilio !== undefined) updateData.domicilio = constanciaFiscalData.domicilio;
        
        // Only update if there are fields to update
        if (Object.keys(updateData).length > 0) {
            return db('Constancia_Fiscal').where({ idConstanciaFiscal }).update(updateData);
        }
        return Promise.resolve(0); // Return 0 if no fields to update
    },

    //Obtener datos de las constancias fiscales
    getConstanciaFiscalById: (idConstanciaFiscal) => db('Constancia_Fiscal').where({ idConstanciaFiscal }).first(), //Regresa UN solo objeto gracias al .first()
    getConstanciaFiscalByRFC: (RFC) => db('Constancia_Fiscal').where({ RFC }).select('*'), //Regresa todos los objetos que tengan el mismo RFC
    getConstanciaFiscalByDomicilio: (domicilio) => db('Constancia_Fiscal').where({ domicilio }).select('*'), //Regresa todos los objetos que tengan el mismo domicilio
    getConstanciaFiscalByRazonSocial: (razon_social) => db('Constancia_Fiscal').where({ razon_social }).select('*'), //Regresa todos los objetos que tengan la misma razon social
    getConstanciaFiscalByIdPersonaMoral: (idPersonaMoral) => db('Constancia_Fiscal').where({ idPersonaMoral }).first(), //Regresa la constancia fiscal asociada a una persona moral específica
};

module.exports = ConstanciaFiscalModel;