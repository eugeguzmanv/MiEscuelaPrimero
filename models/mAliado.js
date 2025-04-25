//Model de Aliado, para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');
const { updateEstadoValidacion } = require('./mEscuela.js');

const AliadoModel = {
    //Apartado de registro de Aliado
    //Este apartado es para crear un nuevo aliado, se le asigna un idAliado automaticamente
    createAliado: (aliadoData) => db('Aliado').insert({
        tipo: aliadoData.tipo,
        correo_electronico: aliadoData.correo_electronico,
        nombre: aliadoData.nombre,
        contraseña: aliadoData.contraseña,
        categoria_apoyo: aliadoData.categoria_apoyo,
        CURP: aliadoData.CURP,
        institucion: aliadoData.institucion,
        calle: aliadoData.calle,
        colonia: aliadoData.colonia,
        municipio: aliadoData.municipio,
        numero: aliadoData.numero,
        descripcion: aliadoData.descripcion
    }), 

    //Apartado de actualización de datos
    //ACTUALIZACIONES GENERALES
  updateNombre: (idAliado, nuevoNombre) =>
    db('Aliado').where({ idAliado }).update({ nombre: nuevoNombre }),

  updateCorreo: (idAliado, nuevoCorreo) =>
    db('Aliado').where({ idAliado }).update({ correo_electronico: nuevoCorreo }),

  updateDescripcion: (idAliado, nuevaDescripcion) =>
    db('Aliado').where({ idAliado }).update({ descripcion: nuevaDescripcion }),

  updateContrasena: (idAliado, nuevaContrasena) =>
    db('Aliado').where({ idAliado }).update({ contraseña: nuevaContrasena }),

  updateDireccion: (idAliado, direccion) =>
    db('Aliado').where({ idAliado }).update({
      calle: direccion.calle,
      numero: direccion.numero,
      colonia: direccion.colonia,
      municipio: direccion.municipio
    }),

  updateInstitucion: (idAliado, institucion) =>
    db('Aliado').where({ idAliado }).update({ institucion }),

  updateCURP: (idAliado, curp) =>
    db('Aliado').where({ idAliado }).update({ curp }),

  updateEstadoValidacion: (idAliado, nuevoEstado) =>
    db('Aliado').where({ idAliado }).update({ estado_validacion: nuevoEstado }), //Actualiza el estado de validación del aliado

    //Apartado para obetener datos del administrador/es
    getAliadoById: (idAliado) => db('Aliado').where({ idAliado }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMail: (correo_electronico) => db('Aliado').where({ correo_electronico }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMuncipio: (municipio) => db('Aliado').where({ municipio }).select('*'), //Regresa UN solo objeto gracias al .first()
    getAliadoByCURP: (CURP) => db('Aliado').where({ CURP }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByInstitucion: (institucion) => db('Aliado').where({ institucion }).first(), //Regresa UN solo objeto gracias al .first()
    getAllAliados: async () => {
      return db('Aliado').select(
        'nombre',
        'tipo',
        'correo_electronico',
        'categoria_apoyo',
        'calle',
        'numero',
        'colonia',
        'municipio',
        'institucion',
        'sector'
      );
    }
  };
module.exports = AliadoModel; //Exportamos el modelo para usarlo en otros archivos