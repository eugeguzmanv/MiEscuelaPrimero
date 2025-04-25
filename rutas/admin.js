const express = require('express');
const adminRouter = express.Router();
const AdminModel = require('../models/mAdministrador.js');


//Endpoint de registro de administrador
adminRouter.post('/registro', async (req, res) => {
    try{
        const {nombre, correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!nombre || !correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.com$/; //Expresión regular para validar el correo
        
        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.com)
        if(!emailRegex.test(correo_electronico)) {
            return res.status(400).json({ error: 'Correo electrónico no válido' });
        }

        //Validar que el correo no exista en la base de datos
        const existingAdmin = await AdminModel.getAdminByMail(correo_electronico);
        if(existingAdmin){
            return res.status(409).json({ error: 'El correo ya está registrado'});
        }
    
        //Registrar el nuevo administrador en la base de datos
        await AdminModel.createAdmin({ nombre, correo_electronico, contrasena});

        return res.status(201).json({ message: 'Administrador registrado exitosamente',
            data: {
                nombre: nombre,
                correo: correo_electronico,
                contrasena: contrasena
              }});
    }catch(error) {
        console.error('Error al registrar administrador:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de administrador
adminRouter.post('/login', async (req, res) => { 
    try{
        const {correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.com$/; //Expresión regular para validar el correo

        //Validar que la información exista en la base de datos
        const existingAdmin = await AdminModel.getAdminByMail(correo_electronico);
        if(!existingAdmin){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        //Validar que la contraseña sea correcta
        if(existingAdmin.contrasena !== contrasena){
            return res.status(400).json({ error: 'La contraseña es incorrecta'});
        }

        //Si todo es correcto, iniciar sesión
        return res.status(200).json({ message: 'Inicio de sesión exitoso', rol: 'admin'});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para actualizar datos del administrador
adminRouter.put('/:idAdmin/perfil', async (req, res) => { 
    try{
        const idAdmin = req.params.idAdmin;
        const {nuevoCorreo, nuevaContrasena, nuevoNombre} = req.body;

        //Validar que el admin existe
        const adminActual = await AdminModel.getAdminById(idAdmin);
        if(!adminActual){
            return res.status(404).json({ error: 'Administrador no encontrado'});
        }

        //Validar el formato del correo (si se llega a enviar)
        if(nuevoCorreo){
            const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.com$/; //Expresión regular para validar el correo
            if(!emailRegex.test(nuevoCorreo)) {
                return res.status(400).json({ error: 'El correo no es válido' });
            }

            //Validar que si el correo ya existe (solo si es diferente al actual)
            if(nuevoCorreo !== adminActual.correo_electronico){
                const existeCorreo = await AdminModel.getAdminByMail(nuevoCorreo);
                if(existeCorreo){
                    return res.status(409).json({ error: 'El correo ya está registrado'});
                }
            }
        }

        //Actualizar campos
        if (nuevoNombre) {
            await AdminModel.updateAdminName(idAdmin, nuevoNombre); // Actualiza "nombre"
        }
        if (nuevoCorreo) {
            const newEmail = await AdminModel.getAdminByMail(nuevoCorreo);
            if(newEmail?.idAdmin !== undefined && newEmail.idAdmin !== idAdmin){
                return res.status(409).json({ error: 'El correo ya está registrado'});
            }
            await AdminModel.updateAdminMail(idAdmin, nuevoCorreo); // Actualiza "correo_electronico"
        }
        if (nuevaContrasena) {
            await AdminModel.updateAdminPass(idAdmin, nuevaContrasena); // Actualiza "contrasena"
        }

        return res.status(200).json({ message: 'Administrador actualizado exitosamente' });
    }catch(error){
        console.error('Error al actualizar administrador:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//Endpoint para enviar un email para restablecer la contraseña del Administrador
adminRouter.post('/recuperar-contrasena', async (req, res) => {
    try{
        const {correo_electronico} = req.body;

        //Validar que no sea un campo vacío
        if(!correo_electronico){
            return res.status(400).json({error: 'El campo correo es obligatorio'});
        }

        //Validar que el correo exista en la base de datos
        const existingAdmin = await AdminModel.getAdminByMail(correo_electronico);
        if(!existingAdmin){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        const contrasenaRecuperada = admin.contrasena;

        return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});


//Endpoint para validar/rechazar necesidades
adminRouter.put('/necesidades/:idNecesidad/validar', async (req, res) =>{
    try{
        const idNecesidad = req.params.idNecesidad;
        const {estatus} = req.body;

        //Validar que no sea un campo vacío
        if(!estatus){
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }

        //Validar que la necesidad exista
        const existingNecesidad = await NecesidadModel.getNecesidadesByDiagnosticoId(idNecesidad);
        if(!existingNecesidad){
            return res.status(404).json({ error: 'La necesidad no existe'});
        }

        //Actualizar el estatus de la necesidad
        await NecesidadModel.updateEstatus(idNecesidad, estatus);

        return res.status(200).json({ message: 'Estatus actualizado exitosamente'});
    }catch(error){
        console.error('Error al validar necesidad:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
})

//Endpoint para validar/rechazar escuelas
adminRouter.put('/escuelas/:CCT/validar', async (req, res) => {
    try{
        const CCT = req.params.CCT;
        const {estado_validacion} = req.body;

        //Validar que no sea un campo vacío
        if(!estado_validacion){
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }

        //Validar que la escuela exista
        const existingEscuela = await EscuelaModel.getEscuelaById(CCT);
        if(!existingEscuela){
            return res.status(404).json({ error: 'La escuela no existe'});
        }

        //Actualizar el estatus de la escuela
        await EscuelaModel.updateEstadoValidacion(CCT, estado_validacion);

        return res.status(200).json({ message: 'Estatus actualizado exitosamente'});
    }catch(error){
        console.error('Error al validar escuela:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
})

// Endpoint para validar/rechazar aliados
adminRouter.put('/aliados/:idAliado/validar', async (req, res) => {
    try{
        const idAliado = req.params.idAliado;
        const {estado_validacion} = req.body;

        //Validar que no sea un campo vacío
        if(!estado_validacion){
            return res.status(400).json({ error: 'El campo estatus es obligatorio',
             });
        }

        //Validar que el aliado exista
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(404).json({ error: 'El aliado no existe'});
        }

        //Actualizar el estatus del aliado
        await AliadoModel.updateEstadoValidacion(idAliado, estado_validacion);

        return res.status(200).json({ message: 'Estatus actualizado exitosamente'});
    }catch(error){
        console.error('Error al validar aliado:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
})

//Endpoint mostrar lista de administradores
adminRouter.get('/catalogo/administradores', async (req, res) =>{
    try{
        const admins = await AdminModel.getAllAdmins();
        return res.status(200).json({ message: 'Lista de administradores', admins});
    }catch(error){
        console.error('Error al obtener lista de administradores:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
})

module.exports = adminRouter;