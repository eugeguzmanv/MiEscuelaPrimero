//Model de Aliado_Apoya_Escuela, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const AliadoApoyaEscuelaModel = {
    createMatch: (data) => db('Aliado_Apoya_Escuela').insert({
        idAliado: data.idAliado,
        CCT: data.CCT,
        fecha_inicio: data.fecha_inicio
    }),
    getMatchById: (idAliado, CCT) => db('Aliado_Apoya_Escuela').where({ idAliado, CCT }).first(), //Regresa UN solo objeto gracias al .first()

}
module.exports = AliadoApoyaEscuelaModel; //Exportamos el modelo para usarlo en otros archivos