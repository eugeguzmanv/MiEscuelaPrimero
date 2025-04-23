//Model de Aliado, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

const AliadoModel = {
    //Apartado de registro de Aliado
    //Este apartado es para crear un nuevo aliado, se le asigna un idAliado automaticamente
    createAliado: (aliadoData) => db('Aliado').insert({
        correo_electronico: aliadoData.correo_electronico,
        nombre: aliadoData.nombre,
        contraseña: aliadoData.contraseña,
        CURP: aliadoData.CURP,
        institucion: aliadoData.institucion,
        sector: aliadoData.sector,
        calle: aliadoData.calle,
        colonia: aliadoData.colonia,
        municipio: aliadoData.municipio,
        numero: aliadoData.numero,
        descripcion: aliadoData.descripcion
    }), 


    //Apartado de actualización de datos
    updateAliadoName: (idAliado, nuevoNombre) => db('Aliado').where({ idAliado }).update({ nombre: nuevoNombre }),
    updateAliadoMail: (idAliado, nuevoCorreo) => db('Aliado').where({ idAliado }).update({ correo_electronico: nuevoCorreo }),
    updateAliadoMunicipio: (idAliado, nuevoMunicipio) => db('Aliado').where({ idAliado }).update({ municipio: nuevoMunicipio }),
    updateAliadoSector: (idAliado, nuevoSector) => db('Aliado').where({ idAliado }).update({ sector: nuevoSector }),
    updateAliadoInstitucion: (idAliado, nuevaInstitucion) => db('Aliado').where({ idAliado }).update({ institucion: nuevaInstitucion }),
    updateAliadoCalle: (idAliado, nuevaCalle) => db('Aliado').where({ idAliado }).update({ calle: nuevaCalle }),
    updateAliadoCURP: (idAliado, nuevoCURP) => db('Aliado').where({ idAliado }).update({ CURP: nuevoCURP }),
    updateAliadoColonia: (idAliado, nuevaColonia) => db('Aliado').where({ idAliado }).update({ colonia: nuevaColonia }),
    updateAliadoNumero: (idAliado, nuevoNumero) => db('Aliado').where({ idAliado }).update({ numero: nuevoNumero }),
    updateAliadoDescripcion: (idAliado, nuevaDescripcion) => db('Aliado').where({ idAliado }).update({ descripcion: nuevaDescripcion }),
    updateAliadoPass: (idAliado, nuevaContrasena) => db('Aliado').where({ idAliado }).update({ contraseña: nuevaContrasena }), 
    
    //Apartado para obetener datos del administrador/es
    getAliadoById: (idAliado) => db('Aliado').where({ idAliado }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMail: (correo_electronico) => db('Aliado').where({ correo_electronico }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMunicipio: (municipio) => db('Aliado').where({ municipio }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByCURP: (CURP) => db('Aliado').where({ CURP }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByInstitucion: (institucion) => db('Aliado').where({ institucion }).first(), //Regresa UN solo objeto gracias al .first()
    getAllAliados: () => db('Aliado').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
};

module.exports = AliadoModel; //Exportamos el modelo para usarlo en otros archivos