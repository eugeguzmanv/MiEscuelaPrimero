//Model de Administrador, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

//Funciones para AdminModel
const AdminModel = {
    //Apartado de registro de Admin
    //Este apartado es para crear un nuevo administrador, se le asigna un id_admin automaticamente
    createAdminName: (nombre_admin) => db('mpj_db').insert({ nombre_admin }),
    //-----------Recuerden que el mail debe terminar en @mpj.com-----------
    createAdminMail: (correo_admin) => db('mpj_db').insert({ correo_admin }),
    createAdminPass: (contrasena_admin) => db('mpj_db').insert({ contrasena_admin }),
    
    //Apartado de actualización de datos
    updateAdminName: (nombre_admin) => db('mpj_db').where({ nombre_admin }).update({ nombre_admin }),
    updateAdminMail: (correo_admin) => db('mpj_db').where({ correo_admin }).update({ correo_admin }),
    updateAdminPass: (contrasena_admin) => db('mpj_db').where({ contrasena_admin }).update({ contrasena_admin }), 
    
    //Probablemente no usemos este pero es para darles un ejemplo de como se haría
    getAdminById: (id_admin) => db('mpj_db').where({ id_admin }).first(), //Regresa UN solo objeto gracias al .first()
    getAdminByMail: (correo_admin) => db('mpj_db').where({ correo_admin }).first(), //Regresa UN solo objeto gracias al .first()
    getAdminPass: (contrasena_admin) => db('mpj_db').where({ contrasena_admin }).first(), //Regresa UN solo objeto gracias al .first()
    getAllAdmins: () => db('mpj_db').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
};

module.exports = AdminModel; //Exportamos el modelo para usarlo en otros archivos