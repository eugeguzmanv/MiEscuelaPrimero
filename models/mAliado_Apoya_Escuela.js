//Model de Aliado_Apoya_Escuela, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const AliadoApoyaEscuelaModel = {
    createMatch: (data) => db('Aliado_Apoya_Escuela').insert({
        idAliado: data.idAliado,
        CCT: data.CCT,
        fecha_inicio: data.fecha_inicio
    }),
    getMatchById: (idAliado, CCT) => db('Aliado_Apoya_Escuela').where({ idAliado, CCT }).first(), //Regresa UN solo objeto gracias al .first()
    getAllMatches: () => {
        return db('Aliado_Apoya_Escuela as Match')
        .join('Aliado', 'Match.idAliado', 'Aliado.idAliado')
        .join('Escuela', 'Match.CCT', 'Escuela.CCT')
        .select('Match.idMatch', 'Match.idAliado', 'Match.CCT', 'Aliado.nombre as nombre_aliado', 'Aliado.correo_electronico as correo_aliado', 'Aliado.categoria_apoyo as categoria_apoyo', 
            'Aliado.institucion as aliado_institucion', 'Escuela.nombre as escuela_nombre', 'Escuela.municipio as municipio_escuela', 'Escuela.nivel_educativo'

        )
    }

}
module.exports = AliadoApoyaEscuelaModel; //Exportamos el modelo para usarlo en otros archivos