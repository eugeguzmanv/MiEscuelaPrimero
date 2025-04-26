//Model de Cronograma, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const CronogramaModel = {

    createCronograma: async (fecha_inicio, fecha_fin) => {
        const cronogramas = [];

        let fecha_actual = new Date(fecha_inicio);

        // Calcular la fecha en base a la fecha de inicio y de fin que ingrese el usuario
        while (fecha_actual <= new Date(fecha_fin)) {
          const inicioMes = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), 1);
          const finMes = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth() + 1, 0);

          cronogramas.push({
            fecha_inicio: inicioMes.toISOString().split('T')[0], // Convierte la fecha a formato YYYY-MM-DD y se extrae sólo la fecha (por eso el 0 para sólo obtener la fecha y la T es para separar la fecha y la hora)
            fecha_fin: finMes.toISOString().split('T')[0],
          });
          // Avanzar al siguiente mes
          fecha_actual = new Date(fecha_actual.getFullYear(), fecha_actual.getMonth() + 1, 1);
          return db('Cronograma').insert(cronogramas, ['idCronograma', 'fecha_inicio', 'fecha_fin']); // Regresa el idCronograma generado para usarlo en el index
        }
        //Insertar los cronogramas en la base de datos
        return db('Cronograma').insert(cronogramas, ['idCronograma', 'fecha_inicio', 'fecha_fin']); // Regresa el idCronograma generado para usarlo en el index 

    },
    getCronogramaById: async (idCronograma) => {
        return db('Cronograma').where({idCronograma}).first();
    }

    
};
module.exports = CronogramaModel; //Exportamos el modelo para usarlo en otros archivos