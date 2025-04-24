//Model de Diagnostico, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const DiagnosticoModel = {
    createDiagnostico: (diagnosticoData) => db('Diagnostico').insert({
        CCT: diagnosticoData.CCT,
        fecha: diagnosticoData.fecha,
        estado: diagnosticoData.estado,
    }, ['idDiagnostico']), // Regresa el idDiagnostico generado para usarlo en el index


}

module.exports = DiagnosticoModel; //Exportamos el modelo para usarlo en otros archivos