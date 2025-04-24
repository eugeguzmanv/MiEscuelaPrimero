const db = require('../db.js');

const ConvenioModel = {
    createConvenio: (convenioData) => db('Convenio').insert({
        firmado: false
    }, ['idConvenio', 'firmado']), // Regresa el idConvenio generado para usarlo en el index

    getConvenioById: (idConvenio) => db('Convenio').where({ idConvenio }).first(), //Regresa UN solo objeto gracias al .first()
     
    // Actualizar el estado del convenio a firmado
    markConvenioAsFirmado: (idConvenio) => {
        return db('Convenio')
            .where({ idConvenio })
            .update({ firmado: true });
    }

}
module.exports = ConvenioModel;