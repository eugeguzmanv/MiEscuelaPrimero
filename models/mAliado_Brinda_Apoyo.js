//Model de Aliado_Brinda_Apoyo, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');
const { up } = require('../migrations/07_Apoyo.js');

const Aliado_Brinda_ApoyoModel = {
    //Apartado de registro de Aliado_Brinda_Apoyo
    //Este apartado es para crear un nuevo aliado, se le asigna un idAliado automaticamente
    createAliadoBrindaApoyo: async (aliado_brinda_apoyoData) => {
        const [result] = await db('Aliado_Brinda_Apoyo').insert({
            idAliado: aliado_brinda_apoyoData.idAliado,
            idApoyo: aliado_brinda_apoyoData.idApoyo,
        }, ['idAliado', 'idApoyo']); // Regresa el idAliado y idApoyo generado para usarlo en el index
        return result; // Regresa el idAliado y idApoyo generado para usarlo en el index
    }, 

    getAllAliados_Brinda_Apoyos: () => db('Aliado_Brinda_Apoyo').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
    
}
module.exports = Aliado_Brinda_ApoyoModel; //Exportamos el modelo para usarlo en otros archivos