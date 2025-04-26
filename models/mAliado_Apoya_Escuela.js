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
            .leftJoin('Necesidad', 'Escuela.CCT', 'Necesidad.CCT') // Relación con las necesidades
            .select(
                'Aliado.institucion as aliado_institucion',
                'Aliado.nombre as nombre_aliado',
                'Aliado.categoria_apoyo as categoria_apoyo',
                'Escuela.CCT as escuela_clave',
                'Escuela.nombre as escuela_nombre',
                'Necesidad.idNecesidad',
                'Necesidad.categoria as necesidad_categoria',
                'Necesidad.descripcion as necesidad_descripcion',
                'Necesidad.ponderacion as necesidad_ponderacion',
                'Necesidad.estatus as necesidad_estatus'
            )
            .orderBy('Match.idMatch'); // Ordenar por el ID del match
    }

}
module.exports = AliadoApoyaEscuelaModel; //Exportamos el modelo para usarlo en otros archivos