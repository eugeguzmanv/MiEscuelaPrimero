const express = require('express');
const aliadoRouter = express.Router();
const AliadoModel = require('../models/mAliado.js'); //Importar el modelo de aliado

//Endpoint de registro de aliado
aliadoRouter.post('/registro', async (req, res) => {
    try{
        const {correo_electronico, nombre, contraseña, CURP, institucion, sector, calle, colonia, municipio, numero, descripcion} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !nombre || !contraseña || !CURP || !institucion || !sector || !calle || !colonia || !municipio || !numero || !descripcion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }


        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(existingMail){
            return res.status(400).json({ error: 'El correo ya está registrado'});
        }

        //Validar que el CURP no exista
        const existingCURP = await AliadoModel.getAliadoByCURP(CURP);
        if(existingCURP){
            return res.status(400).json({ error: 'El CURP ya está registrado'});
        }

        //Creamos el Aliado
        await AliadoModel.createAliado({ correo_electronico, nombre, contraseña, CURP, institucion, sector, calle, colonia, municipio, numero, descripcion });

        return res.status(200).json({ message: 'Aliado registrado exitosamente' });
    }catch(error){
        console.error('Error al registrar aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de aliado
aliadoRouter.post('/login', async (req, res) => {
    try{
        const {correo_electronico, contraseña} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(!existingMail){
            return res.status(400).json({ error: 'El correo no está registrado'});
        }

        //Validar que la contraseña sea correcta
        if(existingMail.contraseña !== contraseña){
            return res.status(400).json({ error: 'La contraseña es incorrecta'});
        }

        return res.status(200).json({ message: 'Inicio de sesión exitoso'});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para ver el catálogo de aliados por institución (UTILIZAMOS QUERY-STRING)
aliadoRouter.get('/Institucion/:institucion', async (req, res) => {
    try{
        const aliadoInstitucion = req.params.institucion.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!aliadoInstitucion){
            return res.status(400).json({ error: 'El campo institución es obligatorio' });
        }

        //Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoByInstitucion(aliadoInstitucion);
        if(!existingAliado){
            return res.status(404).json({ error: 'La institucion del aliado no esta registrada o no cuenta con institucion'});
        }

        //Si el aliado existe, regresamos los datos del aliado
        return res.status(200).json(existingAliado);
    }catch(error){
        console.error('Error al obtener aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para ver el catálogo de aliados por municipio (UTILIZAMOS QUERY-STRING)
aliadoRouter.get('/municipio/:municipio', async (req, res) => {
    try{
        const aliadoMunicipio = req.params.municipio.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!aliadoMunicipio){
            return res.status(400).json({ error: 'El campo Municipio es obligatorio' });
        }

        //Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoByMunicipio(aliadoMunicipio);
        if(!existingAliado){
            return res.status(404).json({ error: 'El municipio del aliado no esta registrado'});
        }

        //Si el aliado existe, regresamos los datos del aliado
        return res.status(200).json(existingAliado);
    }catch(error){
        console.error('Error al obtener aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } 
});

//Endpoint para ver el catálogo de aliados por su correo (UTILIZAMOS QUERY-STRING)
aliadoRouter.get('/correo/:correo_electronico', async (req, res) => {
    try{
        const aliadoMail = req.params.correo_electronico;

        //Validar que no sea un campo vacío
        if(!aliadoMail){
            return res.status(400).json({ error: 'El campo Correo es obligatorio' });
        }

        //Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoByMail(aliadoMail);
        if(!existingAliado){
            return res.status(404).json({ error: 'El aliado no esta registrado'});
        }

        //Si el aliado existe, regresamos los datos del aliado
        return res.status(200).json(existingAliado);
    }catch(error){
        console.error('Error al obtener aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para ver el catálogo de aliados por su CURP (UTILIZAMOS QUERY-STRING)
aliadoRouter.get('/CURP/:CURP', async (req, res) => {
    try{
        const aliadoCURP = req.params.CURP;

        //Validar que no sea un campo vacío
        if(!aliadoCURP){
            return res.status(400).json({ error: 'El campo CURP es obligatorio' });
        }

        //Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoByCURP(aliadoCURP);
        if(!existingAliado){
            return res.status(404).json({ error: 'El aliado no esta registrado o el aliado es una Institucion'});
        }

        //Si el aliado existe, regresamos los datos del aliado
        return res.status(200).json(existingAliado);
    }catch(error){
        console.error('Error al obtener aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para actualizar datos del aliado
aliadoRouter.put('/actualizar', async (req, res) => {
    try{
        const {idAliado, nuevoNombre, nuevoCorreo, nuevoNumero, nuevaDescripcion, nuevaContrasena, nuevoMunicipio, nuevoSector, nuevaInstitucion, nuevaCalle, nuevoCURP, nuevaColonia} = req.body;
        //Validar que existe el representante
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(400).json({ error: 'El aliado no existe'});
        }

        //Validar que el correo del representante exista
        const existingMail = await AliadoModel.getAliadoByMail(nuevoCorreo);
        if(existingMail){
            return res.status(400).json({ error: 'El correo está registrado'});
        }

        if(nuevoCorreo){
            const newEmail = await AliadoModel.getAliadoByMail(nuevoCorreo);
            if(newEmail?.idAliado !== undefined && newEmail.idAliado !== idAliado){
                return res.status(400).json({ error: 'El correo ya está registrado'});
            }
            await AliadoModel.updateAliadoMail(idAliado, nuevoCorreo); // Actualiza "correo_electronico"
        }

        if(nuevoNumero){
            await AliadoModel.updateAliadoNumero(idAliado, nuevoNumero); // Actualiza "numero"
        }

        if(nuevaDescripcion){
            await AliadoModel.updateAliadoDescripcion(idAliado, nuevaDescripcion); // Actualiza "descripcion"
        }
        
        if(nuevaCalle){
            await AliadoModel.updateAliadoCalle(idAliado, nuevaCalle); // Actualiza "calle"
        }

        if(nuevaColonia){
            await AliadoModel.updateAliadoColonia(idAliado, nuevaColonia); // Actualiza "colonia"
        }

        if(nuevoCURP){
            await AliadoModel.updateAliadoCURP(idAliado, nuevoCURP); // Actualiza "CURP"
        }

        if(nuevoNombre){
            await AliadoModel.updateAliadoName(idAliado, nuevoNombre) // Actualiza "nombre"
        }

        if(nuevaContrasena){
            await AliadoModel.updateAliadoPass(idAliado, nuevaContrasena); // Actualiza "contrasena"
        }

        if(nuevoMunicipio){
            await AliadoModel.updateAliadoMunicipio(idAliado, nuevoMunicipio); // Actualiza "municipio"
        }

        if(nuevoSector){
            await AliadoModel.updateAliadoSector(idAliado, nuevoSector); // Actualiza "sector"
        }

        if(nuevaInstitucion){
            await AliadoModel.updateAliadoInstitucion(idAliado, nuevaInstitucion); // Actualiza "institucion"
        }

        return res.status(200).json({ message: 'Representante actualizado exitosamente' });
    }catch(error){
        console.error('Error al actualizar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para restablecer la contraseña del aliado
aliadoRouter.post('/restablecerContrasena', async (req, res) => { 
    try{
        const {correo_electronico} = req.body;

        //Validar que no sea un campo vacío
        if(!correo_electronico){
            return res.status(400).json({error: 'El campo correo es obligatorio'});
        }

        //Validar que el correo exista en la base de datos
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(!existingMail){
            return res.status(400).json({ error: 'El correo no está registrado'});
        }

        //Enviar un email para restablecer la contraseña
        return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});






// Ruta para obtener todos los aliados
app.get('/todos', async (req, res) => {
    try {
        const aliados = await AliadoModel.getAllAliados();
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron aliados registrados' });
        }
        const formattedAliados = aliados.map((aliado) => ({
            idAliado: aliado.idAliado,
            nombre: aliado.nombre,
            tipo: aliado.tipo,
            correo: aliado.correo_electronico,
            categoria_apoyo: aliado.categoria_apoyo,
            descripcion: aliado.descripcion,
            direccion: {
                calle: aliado.calle,
                numero: aliado.numero,
                colonia: aliado.colonia,
                municipio: aliado.municipio
            },
            institucion: aliado.institucion,
            sector: aliado.sector
        }));
        return res.status(200).json({ message: "Aliados obtenidos exitosamente", aliados: formattedAliados });
    } catch (error) {
        console.error('Error al obtener aliados:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = aliadoRouter;