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
    updateEstadoValidacion: (CCT, nuevoEstado) => db('Escuela').where({ CCT }).update({ estado_validacion: nuevoEstado }), //Actualiza el estado de validación de la escuela


    //Obtener datos de las escuelas
    getEscuelaById: (CCT) => db('Escuela').where({ CCT }).first(), //Regresa UN solo objeto gracias al .first()
    getEscuelaByNombre: (nombre) => db('Escuela').where({ nombre }).select('*'), //Regresa todos los objetos que tengan el mismo nombre
    getEscuelaByMunicipio: (municipio) => db('Escuela').where({ municipio }).select('*'), //Regresa todos los objetos que tengan el mismo municipio
    getEscuelaByZona_escolar: (zona_escolar) => db('Escuela').where({ zona_escolar }).select('*'), //Regresa todos los objetos que tengan la misma zona escolar
    getEscuelaByNivel_educativo: (nivel_educativo) => db('Escuela').where({ nivel_educativo }).select('*'), //Regresa todos los objetos que tengan el mismo nivel educativo
    getEscuelaBySector_escolar: (sector_escolar) => db('Escuela').where({ sector_escolar }).select('*'), //Regresa todos los objetos que tengan el mismo sector escolar
    getAllEscuelas: async () => {
        const query = `
            SELECT 
                e."CCT", 
                e."nombre",
                e."modalidad", 
                e."nivel_educativo",
                e."sector_escolar",
                e."sostenimiento",
                e."zona_escolar",
                e."calle", 
                e."numero",
                e."colonia",
                e."municipio",
                e."control_administrativo",
                e."numero_estudiantes",
                e."estado_validacion",
                e."comentario_admin",
                r."nombre" AS representante_nombre,
                r."correo_electronico" AS representante_correo
            FROM "Escuela" e
            LEFT JOIN "Representante" r ON e."CCT" = r."CCT"
        `;
        return db.raw(query).then((result) => result.rows); // Regresa todas las filas de la tabla 
    }
}
       

module.exports = EscuelaModel; //Exportamos el modelo para usarlo en otros archivos