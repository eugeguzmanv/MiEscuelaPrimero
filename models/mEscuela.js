//Model de representante para tener las funciones que haran las consultas a la base de datos
const db = require('../db.js');

//Funciones para AdminModel
const EscuelaModel = {
    //Apartado de registro de Admin
    //Este apartado es para crear un nuevo administrador, se le asigna un id_admin automaticamente
    createEscuela: (escuelData) => db('Escuela').insert({
        CCT: escuelData.CCT,
        nombre: escuelData.nombre,
        modalidad: escuelData.modalidad,
        nivel_educativo: escuelData.nivel_educativo,
        sector_escolar: escuelData.sector_escolar,
        sostenimiento: escuelData.sostenimiento,
        zona_escolar: escuelData.zona_escolar,
        calle: escuelData.calle,
        colonia: escuelData.colonia,
        municipio: escuelData.municipio,
        numero: escuelData.numero,
        control_administrativo: escuelData.control_administrativo,
        numero_estudiantes: escuelData.numero_estudiantes,
        descripcion: escuelData.descripcion,
    }),
    
    //Apartado de actualización de datos
    updateEscuelaName: (CCT, nuevoNombre) => db('Escuela').where({ CCT }).update({ nombre: nuevoNombre }),
    updateEscuelaModalidad: (CCT, nuevaModalidad) => db('Escuela').where({ CCT }).update({ modalidad: nuevaModalidad }),
    updateEscuelaNivel_educativo: (CCT, nuevoNivel) => db('Escuela').where({ CCT }).update({ nivel_educativo: nuevoNivel }),
    //updateEscuelaMunicipio: (CCT, nuevoMunicipio) => db('Escuela').where({ CCT }).update({ municipio: nuevoMunicipio }),
    updateEscuelaCalle: (CCT, nuevaCalle) => db('Escuela').where({ CCT }).update({ calle: nuevaCalle }),
    updateEscuelaColonia: (CCT, nuevaColonia) => db('Escuela').where({ CCT }).update({ colonia: nuevaColonia }),
    updateEscuelaNumero: (CCT, nuevoNumero) => db('Escuela').where({ CCT }).update({ numero: nuevoNumero }),
    updateEscuelaNumero_estudiantes: (CCT, nuevoNumeroAlumnos) => db('Escuela').where({ CCT }).update({ numero_estudiantes: nuevoNumeroAlumnos }),


    //Obtener datos de las escuelas
    getEscuelaById: (CCT) => db('Escuela').where({ CCT }).first(), //Regresa UN solo objeto gracias al .first()
    getEscuelaByNombre: (nombre) => db('Escuela').where({ nombre }).select('*'), //Regresa todos los objetos que tengan el mismo nombre
    getEscuelaByMunicipio: (municipio) => db('Escuela').where({ municipio }).select('*'), //Regresa todos los objetos que tengan el mismo municipio
    getEscuelaByZona_escolar: (zona_escolar) => db('Escuela').where({ zona_escolar }).select('*'), //Regresa todos los objetos que tengan la misma zona escolar
    getEscuelaByNivel_educativo: (nivel_educativo) => db('Escuela').where({ nivel_educativo }).select('*'), //Regresa todos los objetos que tengan el mismo nivel educativo
    getEscuelaBySector_escolar: (sector_escolar) => db('Escuela').where({ sector_escolar }).select('*'), //Regresa todos los objetos que tengan el mismo sector escolar
    getAllEscuelas: () => db('Escuela').select('*'), //Regresa todos los objetos de la tabla en un array gracias al .select('*')
};

module.exports = EscuelaModel; //Exportamos el modelo para usarlo en otros archivos