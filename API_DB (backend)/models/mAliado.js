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
    }).returning('idAliado'), 


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
    
    // New method to update all aliado fields at once
    updateAliadoFull: (idAliado, aliadoData) => {
        // Create update object with only the fields that are present in aliadoData
        const updateData = {};
        
        if (aliadoData.nombre !== undefined) updateData.nombre = aliadoData.nombre;
        if (aliadoData.correo_electronico !== undefined) updateData.correo_electronico = aliadoData.correo_electronico;
        if (aliadoData.contraseña !== undefined) updateData.contraseña = aliadoData.contraseña;
        if (aliadoData.CURP !== undefined) updateData.CURP = aliadoData.CURP;
        if (aliadoData.institucion !== undefined) updateData.institucion = aliadoData.institucion;
        if (aliadoData.sector !== undefined) updateData.sector = aliadoData.sector;
        if (aliadoData.calle !== undefined) updateData.calle = aliadoData.calle;
        if (aliadoData.colonia !== undefined) updateData.colonia = aliadoData.colonia;
        if (aliadoData.municipio !== undefined) updateData.municipio = aliadoData.municipio;
        if (aliadoData.numero !== undefined) updateData.numero = aliadoData.numero;
        if (aliadoData.descripcion !== undefined) updateData.descripcion = aliadoData.descripcion;
        
        // Only update if there are fields to update
        if (Object.keys(updateData).length > 0) {
            return db('Aliado').where({ idAliado }).update(updateData);
        }
        return Promise.resolve(0); // Return 0 if no fields to update
    },
    
    //Apartado para obetener datos del administrador/es
    getAliadoById: (idAliado) => db('Aliado').where({ idAliado }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMail: (correo_electronico) => db('Aliado').where({ correo_electronico }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByMunicipio: (municipio) => db('Aliado').where({ municipio }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByCURP: (CURP) => db('Aliado').where({ CURP }).first(), //Regresa UN solo objeto gracias al .first()
    getAliadoByInstitucion: (institucion) => db('Aliado').where({ institucion }).first(), //Regresa UN solo objeto gracias al .first()
    getAllAliados: async () => { //obtener todos los aliados
        try {
            const result = await db('Aliado').select('*');
            return result;
        } catch (error) {
            throw error;
        }
    },
    getByInstitucion: async (institucion) => {
        try {
            return await db('Aliado')
                .where('institucion', 'like', `%${institucion}%`);
        } catch (error) {
            throw error;
        }
    },
    getBySector: async (sector) => {
        try {
            return await db('Aliado')
                .where('sector', 'like', `%${sector}%`);
        } catch (error) {
            throw error;
        }
    },
    getByMunicipio: async (municipio) => {
        try {
            return await db('Aliado')
                .where('municipio', 'like', `%${municipio}%`);
        } catch (error) {
            throw error;
        }
    },
    getByCategoriaApoyo: async (categoria) => {
        try {
            return await db('Aliado')
                .join('Apoyo', 'Aliado.idAliado', '=', 'Apoyo.idAliado')
                .where('Apoyo.Categoria', 'like', `%${categoria}%`)
                .orWhere('Apoyo.Sub_categoria', 'like', `%${categoria}%`)
                .distinct('Aliado.*');
        } catch (error) {
            throw error;
        }
    },
    // Get aliados with apoyos matching escuela's necesidades subcategorias
    getAliadosByMatchingApoyos: async function(CCT) {
        try {
            // First, get all necesidades subcategorias for the escuela
            const necesidadesSubcategorias = await db('Necesidad')
                .where('CCT', CCT)
                .select('Sub_categoria');

            // Extract subcategorias into an array
            const subcategorias = necesidadesSubcategorias.map(necesidad => necesidad.Sub_categoria);

            // Get aliados that have apoyos matching any of these subcategorias
            const aliados = await db('Aliado')
                .distinct('Aliado.*')
                .join('Apoyo', 'Aliado.idAliado', '=', 'Apoyo.idAliado')
                .whereIn('Apoyo.Sub_categoria', subcategorias);

            return aliados;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AliadoModel; //Exportamos el modelo para usarlo en otros archivos