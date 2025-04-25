const express = require('express');
const escrituraPublicaRouter = express.Router();
const EscrituraPublicaModel = require('../models/mEscritura_Publica.js'); //Importar el modelo de la escritura pública
const AliadoModel = require('../models/mAliado.js'); //Importar el modelo del aliado
const PersonaMoralModel = require('../models/mPersona_Moral.js'); //Importar el modelo de la persona moral

//Endpoint para registrar la escritura pública
escrituraPublicaRouter.post('/registro', async (req, res) => {
    try{
        const {idAliado, idPersonaMoral, fecha_escritura, notario, numero_escritura, ciudad} = req.body;

        //Validar que no sean campos vacíos
        if(!idAliado || !idPersonaMoral || !fecha_escritura || !notario || !numero_escritura || !ciudad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el idAliado exista
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(404).json({ error: 'El idAliado no está registrado'});
        }

        //Validar que el idPersonaMoral exista
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralById(idPersonaMoral);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'El idPersonaMoral no está registrado'});
        }

        //Registrar la escritura pública
        await EscrituraPublicaModel.createEscrituraPublica({ idAliado, idPersonaMoral, fecha_escritura, notario, numero_escritura, ciudad });

        return res.status(201).json({ message: 'Escritura pública registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar escritura pública:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la escritura pública por su notario (UTILIZAMOS QUERY-STRING)
escrituraPublicaRouter.get('/notario/:notario', async (req, res) => {
    try{
        const escrituraPublicaNotario = req.params.notario.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!escrituraPublicaNotario){
            return res.status(400).json({ error: 'El campo notario es obligatorio' });
        }

        //Validar que exista la escritura pública en la base de datos
        const existingEscrituraPublica = await EscrituraPublicaModel.getEscrituraPublicaByNotario(escrituraPublicaNotario);
        if(!existingEscrituraPublica){
            return res.status(404).json({ error: 'La escritura pública no esta registrada'});
        }

        return res.status(200).json(existingEscrituraPublica);
    }catch(error){
        console.error('Error al obtener escritura pública:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la escritura pública por su ciudad (UTILIZAMOS QUERY-STRING)
escrituraPublicaRouter.get('/ciudad/:ciudad', async (req, res) => {
    try{
        const escrituraPublicaCiudad = req.params.ciudad.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!escrituraPublicaCiudad){
            return res.status(400).json({ error: 'El campo ciudad es obligatorio' });
        }

        //Validar que exista la escritura pública en la base de datos
        const existingEscrituraPublica = await EscrituraPublicaModel.getEscrituraPublicaByCiudad(escrituraPublicaCiudad);
        if(!existingEscrituraPublica){
            return res.status(404).json({ error: 'La escritura pública no esta registrada'});
        }

        return res.status(200).json(existingEscrituraPublica);
    }catch(error){
        console.error('Error al obtener escritura pública:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = escrituraPublicaRouter;