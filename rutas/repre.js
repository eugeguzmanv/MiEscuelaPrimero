const express = require('express');
const representanteRouter = express.Router();
const RepresentanteModel = require('../models/mRepresentante.js');

//Endpoint de registro de representante
representanteRouter.post('/api/representantes/registro', async (req, res) => { 
    try{
        const {nombre, correo_electronico, contrasena, numero_telefonico, CCT, rol, anios_experiencia, proximo_a_jubilarse, cambio_zona} = req.body;
    
        //Validar que no sean campos vacíos
        if(!nombre || !correo_electronico || !contrasena || !numero_telefonico ||  !CCT || !rol || !anios_experiencia) {//No consideramos proximo_a_jubilarse y cambio_zona como obligatorios ya que están en false por default
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar que la escuela exista
        const escuela = await knex('Escuela').where({ CCT }).first();
        if (!escuela) {
        return res.status(404).json({ error: 'CCT de escuela no válido' });
        }

        //Validar que el correo no exista
        const existingMail = await RepresentanteModel.getRepresentanteByMail(correo_electronico);
        if(existingMail){
            return res.status(409).json({ error: 'El correo ya está registrado'});
        }

        //Validar que el teléfono no exista
        const existingPhone = await RepresentanteModel.getRepresentanteByPhone(numero_telefonico);
        if(existingPhone){
            return res.status(409).json({ error: 'El número de teléfono ya está registrado'});
        }

        //Registrar al Representante
        await RepresentanteModel.createRepresentante({ nombre, correo_electronico, contrasena, numero_telefonico, CCT, rol, anios_experiencia, proximo_a_jubilarse, cambio_zona });

        return res.status(201).json({ message: 'Representante registrado exitosamente', 
            credenciales: {
                correo_electronico,
                contrasena // ⚠️ Solo para propósitos de desarrollo (evita retornarla en producción)
              }

         });
    }catch(error){
        console.error('Error al registrar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de
representanteRouter.post('/api/representantes/login', async (req, res) => {
    try{
        const {correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo exista en la BD
        const existingMail = await RepresentanteModel.getRepresentanteByMail(correo_electronico);
        if(!existingMail){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        //Validar que la contraseña sea correcta
        
        if(existingMail.contrasena !== contrasena){
            return res.status(400).json({ error: 'La contraseña es incorrecta'});
        }
    
        return res.status(200).json({ message: 'Inicio de sesión exitoso'});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de actualizar datos del Representante
representanteRouter.put('/api/representantes/:idRepresentante', async (req, res) => {
    try{
        const idRepresentante = req.params.idRepresentante;
        const {nuevoNombre, nuevoCorreo, nuevaContrasena, nuevoTelefono, nuevoRol, nuevoAnios, nuevoProximo, nuevoCambio} = req.body;
        //Validar que existe el representante
        const existingRepre = await RepresentanteModel.getRepresentanteById(idRepresentante);
        if(!existingRepre){
            return res.status(404).json({ error: 'Representante no encontrado'});
        }


        //Actualizaremos nombre
        if(nuevoNombre){
            await RepresentanteModel.updateRepresentanteName(idRepresentante, nuevoNombre); // Actualiza "nombre"
        }

        if(nuevoCorreo){
            const newEmail = await RepresentanteModel.getRepresentanteByMail(nuevoCorreo);
            if(newEmail?.idRepresentante !== undefined && newEmail.idRepresentante !== idRepresentante){
                return res.status(400).json({ error: 'El correo ya está registrado'});
            }
            await RepresentanteModel.updateRepresentanteMail(idRepresentante, nuevoCorreo); // Actualiza "correo_electronico"
        }

        if (nuevaContrasena) {
            await RepresentanteModel.updateRepresentantePass(idRepresentante, nuevaContrasena);
          }

        if(nuevoTelefono){
            await RepresentanteModel.updateRepresentantePhone(idRepresentante, nuevoTelefono); // Actualiza "numero_telefonico"
        }

        if(nuevoRol){
            await RepresentanteModel.updateRepresentanteRol(idRepresentante, nuevoRol); // Actualiza "rol"
        }

        if(nuevoAnios){
            await RepresentanteModel.updateRepresentanteanios_experiencia(idRepresentante, nuevoAnios); // Actualiza "anios_experiencia"
        }

        if(nuevoProximo === 'boolean'){
            await RepresentanteModel.updateRepresentanteproximo_a_jubilarse(idRepresentante, nuevoProximo); // Actualiza "proximo_a_jubilarse"
        }

        if(nuevoCambio === 'boolean'){
            await RepresentanteModel.updateRepresentanteCambio_zona(idRepresentante, nuevoCambio); // Actualiza "cambio_zona"
        }

        return res.status(200).json({ message: 'Representante actualizado exitosamente',
            representante: {
                id: parseInt(idRepresentante),
                nombre: nuevoNombre,
                correo: nuevoCorreo,
                contrasena: nuevaContrasena,
                telefono: nuevoTelefono,
                años_servicio: nuevoAnios,
                proximo_a_jubilarse: nuevoProximo,
                cambio_zona: nuevoCambio,
                rol: nuevoRol
              }

         });
    }catch(error){
        console.error('Error al actualizar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Enpoint para enviar un email para restablecer la constraseña del Representante
representanteRouter.post('/api/representantes/recuperar-contrasena', async (req, res) => { 
    try{
        const {correo_electronico} = req.body;

        //Validar que no sea un campo vacío
        if(!correo_electronico){
            return res.status(400).json({error: 'El campo correo es obligatorio'});
        }

        //Validar que el correo exista en la base de datos
        const existingMail = await RepresentanteModel.getRepresentanteByMail(correo_electronico);
        if(!existingMail){
            return res.status(404).json({ error: 'Correo no registrado'});
        }


        //Enviar un email para restablecer la contraseña
        return res.status(200).json({ message: 'Correo de recuperación enviado (revisa tu bandeja)'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error al enviar el correo'});
    }
});


module.exports = representanteRouter;