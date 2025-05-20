//Model de Administrador, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

//Funciones para AdminModel
const AdminModel = {
    //Apartado de registro de Admin
    //Este apartado es para crear un nuevo administrador, se le asigna un idAdmin automaticamente
    createAdmin: (adminData) => db('Administrador').insert({
        nombre: adminData.nombre,
        correo_electronico: adminData.correo_electronico,
        contrasena: adminData.contrasena
    }), 

    //Apartado de actualización de datos
    updateAdminName: (idAdmin, nuevoNombre) => db('Administrador').where({ idAdmin }).update({ nombre: nuevoNombre }),
    updateAdminMail: (idAdmin, nuevoCorreo) => db('Administrador').where({ idAdmin }).update({ correo_electronico: nuevoCorreo }),
    updateAdminPass: (idAdmin, hashedPassword) => db('Administrador').where({ idAdmin }).update({ contrasena: hashedPassword}), 
    
    //Apartado para obetener datos del administrador/es
    getAdminById: (idAdmin) => db('Administrador').where({ idAdmin }).first(), //Regresa UN solo objeto gracias al .first()
    getAdminByMail: (correo_electronico) => db('Administrador').where({ correo_electronico }).first(), //Regresa UN solo objeto gracias al .first()
    getAdminPass: (contrasena) => db('Administrador').where({ contrasena }).first(), //Regresa UN solo objeto gracias al .first()
    getAllAdmins: () => db('Administrador').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
};

module.exports = AdminModel; //Exportamos el modelo para usarlo en otros archivos