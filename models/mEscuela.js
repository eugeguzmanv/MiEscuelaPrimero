//Model de representante para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

//Funciones para AdminModel
const EscuelaModel = {
    //Apartado de registro de Admin
    //Este apartado es para crear un nuevo administrador, se le asigna un id_admin automaticamente
    createEscuelaName: (nombre_escuela) => db('mpj_db').insert({ nombre_escuela }),
    createEscuelaMail: (correo_escuela) => db('mpj_db').insert({ correo_escuela }),
    createEscuelaPass: (contrasena_escuela) => db('mpj_db').insert({ contrasena_escuela }),
    
    //Apartado de actualización de datos
    updateEscuelaName: (nombre_escuela) => db('mpj_db').where({ nombre_escuela }).update({ nombre_escuela }),
    updateEscuelaMail: (correo_escuela) => db('mpj_db').where({ correo_escuela}).update({ correo_escuela }),
    updateEscuelaPass: (contrasena_escuela) => db('mpj_db').where({ contrasena_escuela }).update({ contrasena_escuela }), 
    
    //Probablemente no usemos este pero es para darles un ejemplo de como se haría
    getEscuelaById: (id_escuela) => db('mpj_db').where({ id_escuela }).first(), //Regresa UN solo objeto gracias al .first()
    getEscuelaByMail: (correo_escuela) => db('mpj_db').where({ correo_escuela }).first(), //Regresa UN solo objeto gracias al .first()
    getEscuelaPass: (contrasena_escuela) => db('mpj_db').where({ contrasena_escuela }).first(), //Regresa UN solo objeto gracias al .first()
    getAllEscuelas: () => db('mpj_db').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
};