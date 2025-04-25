//Model de Actividad, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const ActividadModel = {
    createActividad: ({nombre, fecha_inicio, tipo, fecha_fin, idCronograma}) => {
        return db('Actividad').insert({
            nombre: nombre,
            fecha_inicio: fecha_inicio,
            tipo: tipo,
            fecha_fin: fecha_fin,
            idCronograma: idCronograma
        }, ['idActividad']); // Regresa el idActividad generado para usarlo en el index
    },
    getActividadById: (idActividad) => db('Actividad').where({ idActividad }).first(), //Regresa UN solo objeto gracias al .first()
    getActividadesByCronogramaId: (idCronograma) => db('Actividad').where({ idCronograma }), // Obtener todas las actividades por idCronograma
    updateActividad: (idActividad, data) => {
        return db('Actividad').where({idActividad}).update(data);
    }
}
module.exports = ActividadModel;
