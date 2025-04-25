const express = require('express');
const constanciaFiscalRouter = express.Router();
const ConstanciaFiscalModel = require('../models/mConstancia_Fiscal.js'); //Importar el modelo de la constancia fiscal
const PersonaMoralModel = require('../models/mPersona_Moral.js'); //Importar el modelo de la persona moral

//Endpoint para registrar la constancia fiscal
constanciaFiscalRouter.post('/registro', async (req, res) => {
    try{
        const {idPersonaMoral, RFC, razon_social, domicilio, regimen} = req.body;

        //Validar que no sean campos vacíos
        if(!idPersonaMoral || !RFC || !razon_social || !domicilio || !regimen) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que la persona moral exista
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralById(idPersonaMoral);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'La persona moral no está registrado'});
        }

        //Registrar la constancia fiscal
        await ConstanciaFiscalModel.createConstanciaFiscal({ idPersonaMoral, RFC, razon_social, domicilio, regimen });
        return res.status(201).json({ message: 'Constancia fiscal registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para actualizar datos de la constancia fiscal
constanciaFiscalRouter.put('/actualizar', async (req, res) => {
    try{
        const {idConstanciaFiscal, nuevoRFC, nuevoDomicilio, nuevaRazonSocial} = req.body;

        //Validar que exista la constancia fiscal
        const existingConstanciaFiscal = await ConstanciaFiscalModel.getConstanciaFiscalById(idConstanciaFiscal);
        if(!existingConstanciaFiscal){
            return res.status(404).json({ error: 'Constancia fiscal no encontrada'});
        }

        //Actualizar los datos
        if(nuevoRFC){
            await ConstanciaFiscalModel.updateConstanciaFiscalRFC(idConstanciaFiscal, nuevoRFC); // Actualiza "RFC"
        }

        if(nuevoDomicilio){
            await ConstanciaFiscalModel.updateConstanciaFiscalDomicilio(idConstanciaFiscal, nuevoDomicilio); // Actualiza "domicilio"
        }

        if(nuevaRazonSocial){
            await ConstanciaFiscalModel.updateConstanciaFiscalRazonSocial(idConstanciaFiscal, nuevaRazonSocial); // Actualiza "razon_social"
        }

        return res.status(200).json({ message: 'Constancia fiscal actualizada exitosamente' });
    }catch(error){
        console.error('Error al actualizar constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la constancia fiscal por su RFC (UTILIZAMOS QUERY-STRING)
constanciaFiscalRouter.get('/RFC/:RFC', async (req, res) => {
    try{
        const constanciaFiscalRFC = req.params.RFC.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!constanciaFiscalRFC){
            return res.status(400).json({ error: 'El campo RFC es obligatorio' });
        }

        //Validar que exista la constancia fiscal en la base de datos
        const existingConstanciaFiscal = await ConstanciaFiscalModel.getConstanciaFiscalByRFC(constanciaFiscalRFC);
        if(!existingConstanciaFiscal){
            return res.status(404).json({ error: 'La constancia fiscal no esta registrada'});
        }

        return res.status(200).json(existingConstanciaFiscal);
    }catch(error){
        console.error('Error al obtener constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la constancia fiscal por su domicilio (UTILIZAMOS QUERY-STRING)
constanciaFiscalRouter.get('/domicilio/:domicilio', async (req, res) => {
    try{
        const constanciaFiscalDomicilio = req.params.domicilio.trim(); // Eliminar espacios en blanco al inicio y al final

        //Validar que no sea un campo vacío
        if(!constanciaFiscalDomicilio){
            return res.status(400).json({ error: 'El campo domicilio es obligatorio' });
        }

        //Validar que exista la constancia fiscal en la base de datos
        const existingConstanciaFiscal = await ConstanciaFiscalModel.getConstanciaFiscalByDomicilio(constanciaFiscalDomicilio);
        if(!existingConstanciaFiscal){
            return res.status(404).json({ error: 'La constancia fiscal no esta registrada'});
        }

        return res.status(200).json(existingConstanciaFiscal);
    }catch(error){
        console.error('Error al obtener constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = constanciaFiscalRouter;