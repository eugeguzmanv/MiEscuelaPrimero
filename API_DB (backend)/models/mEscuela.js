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
    updateEscuelaDescripcion: (CCT, nuevaDescripcion) => db('Escuela').where({ CCT }).update({ descripcion: nuevaDescripcion }),
    
    // New method to update all school fields at once
    updateEscuelaFull: (CCT, escuelaData) => {
        // Create update object with only the fields that are present in escuelaData
        const updateData = {};
        
        if (escuelaData.nombre !== undefined) updateData.nombre = escuelaData.nombre;
        if (escuelaData.modalidad !== undefined) updateData.modalidad = escuelaData.modalidad;
        if (escuelaData.nivel_educativo !== undefined) updateData.nivel_educativo = escuelaData.nivel_educativo;
        if (escuelaData.sector_escolar !== undefined) updateData.sector_escolar = escuelaData.sector_escolar;
        if (escuelaData.sostenimiento !== undefined) updateData.sostenimiento = escuelaData.sostenimiento;
        if (escuelaData.zona_escolar !== undefined) updateData.zona_escolar = escuelaData.zona_escolar;
        if (escuelaData.calle !== undefined) updateData.calle = escuelaData.calle;
        if (escuelaData.colonia !== undefined) updateData.colonia = escuelaData.colonia;
        if (escuelaData.municipio !== undefined) updateData.municipio = escuelaData.municipio;
        if (escuelaData.numero !== undefined) updateData.numero = escuelaData.numero;
        if (escuelaData.descripcion !== undefined) updateData.descripcion = escuelaData.descripcion;
        if (escuelaData.control_administrativo !== undefined) updateData.control_administrativo = escuelaData.control_administrativo;
        if (escuelaData.numero_estudiantes !== undefined) updateData.numero_estudiantes = escuelaData.numero_estudiantes;
        
        // Only update if there are fields to update
        if (Object.keys(updateData).length > 0) {
            return db('Escuela').where({ CCT }).update(updateData);
        }
        return Promise.resolve(0); // Return 0 if no fields to update
    },

    //Obtener datos de las escuelas
    getEscuelaById: (CCT) => db('Escuela').where({ CCT }).first(), //Regresa UN solo objeto gracias al .first()
    getEscuelaByNombre: (nombre) => db('Escuela').where({ nombre }).select('*'), //Regresa todos los objetos que tengan el mismo nombre
    getEscuelaByMunicipio: (municipio) => db('Escuela').where({ municipio }).select('*'), //Regresa todos los objetos que tengan el mismo municipio
    getEscuelaByZona_escolar: (zona_escolar) => db('Escuela').where({ zona_escolar }).select('*'), //Regresa todos los objetos que tengan la misma zona escolar
    getEscuelaByNivel_educativo: (nivel_educativo) => db('Escuela').where({ nivel_educativo }).select('*'), //Regresa todos los objetos que tengan el mismo nivel educativo
    getEscuelaBySector_escolar: (sector_escolar) => db('Escuela').where({ sector_escolar }).select('*'), //Regresa todos los objetos que tengan el mismo sector escolar
    getAllEscuelas: async () => {
        try {
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
                    e."descripcion",
                    e."control_administrativo",
                    e."numero_estudiantes",
                    r."nombre" AS representante_nombre,
                    r."correo_electronico" AS representante_correo
                FROM "Escuela" e
                LEFT JOIN "Representante" r ON e."CCT" = r."CCT"
            `;
            const result = await db.raw(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    // Get schools with necesidades matching aliado's apoyos subcategorias
    getEscuelasByMatchingNecesidades: async function getEscuelasByMatchingNecesidades(idAliado) {
        try {
            // First, get all apoyos subcategorias for the aliado
            const apoyosSubcategorias = await db('Apoyo')
                .where('idAliado', idAliado)
                .select('Sub_categoria');

            // Extract subcategorias into an array
            const subcategorias = apoyosSubcategorias.map(apoyo => apoyo.Sub_categoria);

            // Get schools that have necesidades matching any of these subcategorias
            const escuelas = await db('Escuela')
                .distinct('Escuela.*')
                .join('Necesidad', 'Escuela.CCT', '=', 'Necesidad.CCT')
                .whereIn('Necesidad.Sub_categoria', subcategorias);

            return escuelas;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = EscuelaModel; //Exportamos el modelo para usarlo en otros archivos