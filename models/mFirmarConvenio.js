const db = require('../db.js');

const FirmarConvenioModel = {
     // Registrar una nueva firma
     createFirma: ({ idConvenio, CCT, idAliado, fecha_firma }) => {
        return db('Firmar_Convenio').insert({
            idConvenio,
            CCT: String(CCT),
            idAliado,
            fecha_firma: fecha_firma || new Date() // Si no se proporciona, usa la fecha actual
        });
    },
    
    // Obtener todas las firmas relacionadas por una combinacion de idConvenio, CCT y idAliado
    getFirmasByConvenio: (idConvenio, CCT, idAliado) => {
        return db('Firmar_Convenio')
            .where({ idConvenio, CCT, idAliado })
            .first();
    },
    // Obtener todas las firmas relacionadas con un convenio
    getFirmasByConvenio: (idConvenio) => {
        return db('Firmar_Convenio')
            .where({ idConvenio })
            .select('*');
    }

}
module.exports = FirmarConvenioModel; //Exportamos el modelo para usarlo en otros archivos