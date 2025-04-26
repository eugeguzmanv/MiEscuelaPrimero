//Model de Aliado_Brinda_Apoyo, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');
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
    getApoyosByAliado: async (idAliado) => {
        return db('Aliado_Brinda_Apoyo as ABA')
            .join('Apoyo', 'ABA.idApoyo', 'Apoyo.idApoyo')
            .where({ 'ABA.idAliado': idAliado })
            .select(
                'Apoyo.idApoyo',
                'Apoyo.categoria',
                'Apoyo.descripcion',
            );
    },
    getRelationByAliadoAndApoyo: async (idAliado, idApoyo) => {
        return db('Aliado_Brinda_Apoyo')
            .where({ idAliado, idApoyo })
            .first(); // Devuelve un solo registro si existe
    }
}
module.exports = Aliado_Brinda_ApoyoModel; //Exportamos el modelo para usarlo en otros archivos