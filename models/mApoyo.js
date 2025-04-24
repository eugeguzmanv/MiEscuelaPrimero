//Model de Apoyo para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const ApoyoModel = {
    createApoyo: async(apoyo) => {
        const [result] = await db('Apoyo').insert({
            tipo: apoyo.tipo,
            categoria: apoyo.categoria,
            estatus: apoyo.estatus,
            descripcion: apoyo.descripcion
        }, ['idApoyo']); // Regresa el idApoyo generado para usarlo en el index
        return result; // Regresa el idApoyo generado para usarlo en el index
    },

    updateApoyoTipo: (idApoyo, nuevoTipo) => db('Apoyo').where({ idApoyo }).update({ tipo: nuevoTipo }),
    updateApoyoEstatus: (idApoyo, nuevoEstatus) => db('Apoyo').where({ idApoyo }).update({ estatus: nuevoEstatus }),
    updateApoyoCategoria: (idApoyo, nuevaCategoria) => db('Apoyo').where({ idApoyo }).update({ categoria: nuevaCategoria }),
    updateApoyoDescripcion: (idApoyo, nuevaDescripcion) => db('Apoyo').where({ idApoyo }).update({ descripcion: nuevaDescripcion }),

    getApoyoById: (idApoyo) => db('Apoyo').where({ idApoyo }).first(), //Regresa UN solo objeto gracias al .first()

    }
module.exports = ApoyoModel;