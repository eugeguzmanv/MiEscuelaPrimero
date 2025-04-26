const express = require('express');
const personaMoralRouter = express.Router();
const PersonaMoralModel = require('../models/mPersona_Moral.js'); //Importar el modelo de la persona moral
const AliadoModel = require('../models/mAliado.js'); //Importar el modelo del aliado

//Endpoint para registrar al aliado como persona moral
personaMoralRouter.post('/registro', async (req, res) => { 
    try{
        const {giro, proposito, nombre_organizacion, pagina_web, idAliado} = req.body;

        //Validar que no sean campos vacíos
        if(!giro || !proposito || !nombre_organizacion || !pagina_web || !idAliado){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el idAliado exista
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(404).json({ error: 'El idAliado no está registrado'});
        }

        //Crear a la persona moral
        await PersonaMoralModel.createPersonaMoral({ giro, proposito, nombre_organizacion, pagina_web, idAliado });
        return res.status(201).json({ message: 'Persona moral registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para actualizar los datos de un aliado como persona moral
personaMoralRouter.put('/actualizar', async (req, res) => {
    try{
        const {idPersonaMoral, nuevoGiro, nuevoProposito, nuevoNombreOrganizacion, nuevaPaginaWeb} = req.body;

        //Validar que existe la persona moral
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralById(idPersonaMoral);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'Persona moral no encontrada'});
        }

        //Actualizar los campos de la persona moral
        if(nuevoGiro){
            await PersonaMoralModel.updatePersonaMoralGiro(idPersonaMoral, nuevoGiro); // Actualiza "giro"
        }

        if(nuevoProposito){
            await PersonaMoralModel.updatePersonaMoralProposito(idPersonaMoral, nuevoProposito); // Actualiza "proposito"
        }

        if(nuevoNombreOrganizacion){
            await PersonaMoralModel.updatePersonaMoralNombre_organizacion(idPersonaMoral, nuevoNombreOrganizacion); // Actualiza "nombre_organizacion"
        }
        
        if(nuevaPaginaWeb){
            await PersonaMoralModel.updatePersonaMoralPagina_web(idPersonaMoral, nuevaPaginaWeb); // Actualiza "pagina_web"
        }

        return res.status(200).json({ message: 'Persona moral actualizada exitosamente' });
    }catch(error){
        console.error('Error al actualizar persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la persona moral por su pagina web (UTILIZAMOS QUERY-STRING)
personaMoralRouter.get('/pagina_web/:pagina_web', async (req, res) => {
    try{
        const personaMoralPaginaWeb = req.params.pagina_web.trim(); // Eliminar espacios en blanco al inicio y al final
    
        //Validar que no sea un campo vacío
        if(!personaMoralPaginaWeb){
            return res.status(400).json({ error: 'El campo pagina web es obligatorio' });
        }

        //Validar que exista la pagina web en la base de datos
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralByPagina_web(personaMoralPaginaWeb);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'La pagina web no esta registrada'});
        }

        return res.status(200).json(existingPersonaMoral);
    }catch(error){
        console.error('Error al obtener persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la persona moral por su nombre de organización (UTILIZAMOS QUERY-STRING)
personaMoralRouter.get('/nombre_organizacion/:nombre_organizacion', async (req, res) => {
    try{
        const personaMoralNombreOrganizacion = req.params.nombre_organizacion.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!personaMoralNombreOrganizacion){
            return res.status(400).json({ error: 'El campo nombre organizacion es obligatorio' });
        }

        //Validar que exista la pagina web en la base de datos
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralByNombre_organizacion(personaMoralNombreOrganizacion);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'La pagina web no esta registrada'});
        }

        return res.status(200).json(existingPersonaMoral);
    }catch(error){
        console.error('Error al obtener persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = personaMoralRouter;