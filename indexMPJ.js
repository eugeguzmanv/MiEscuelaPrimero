//Documento para configurar el servidor y los métodos HTTP
const express = require('express');
const db = require('./db');
const app = express();
const bcrypt = require('bcrypt'); // Librería para encriptar contraseñas
const nodemailer = require('nodemailer');
const port = 1000;
//Requeriremos TODOS los modelos que definimos en la carpeta models
const AdminModel = require('./models/mAdministrador.js');
const RepresentanteModel = require('./models/mRepresentante.js');
const EscuelaModel = require('./models/mEscuela.js');
const AliadoModel = require('./models/mAliado.js');
const PersonaMoralModel = require('./models/mPersona_Moral.js');
const EscrituraPublicaModel = require('./models/mEscritura_Publica.js');
const ConstanciaFiscalModel = require('./models/mConstancia_Fiscal.js');
const AliadoApoyaEscuelaModel = require('./models/mAliado_Apoya_Escuela.js')
const CronogramaModel = require('./models/mCronograma.js')
const NecesidadModel = require('./models/mNecesidad.js')
const ApoyoModel = require('./models/mApoyo.js');
const Aliado_Brinda_ApoyoModel = require('./models/mAliado_Brinda_Apoyo.js');

app.use(express.static('public')); //Para poder servir archivos estáticos como HTML, CSS, JS, etc.
app.use(express.json()); //Para poder recibir datos en formato JSON en el body de las peticiones

//.............................. NUEVOS ENDPOINTS .....................................
//...........................ENDPOINT PARA MOSTRAR TODAS LAS ESCUELAS.........................
app.get('/api/escuelas/', async (req, res) => {
    try{
        // Llamar a la función del modelo para obtener las escuelas
        const escuelas = await EscuelaModel.getAllEscuelas();

        // Validar si no hay resultados
        if (escuelas.length === 0) {
            return res.status(404).json({ error: "No se encontraron escuelas" });
        }

        //Transforma los resultados de la BD a un formato más estructurado (sólo sirvió para verfiicar que sí funcionaba en postman)
        const formattedEscuelas = escuelas.map(escuela => ({
            CCT: escuela.CCT,
            nombre: escuela.nombre,
            direccion: {
                calle: escuela.calle,
                numero: escuela.numero,
                colonia: escuela.colonia,
                municipio: escuela.municipio
            },
            nivel_educativo: escuela.nivel_educativo,
            numero_alumnos: escuela.numero_estudiantes,
            representante: {
                nombre: escuela.representante_nombre || null,
                correo_electronico: escuela.representante_correo || null
            }
        }));

        res.status(200).json({ escuelas: formattedEscuelas });

    } catch (error) {
        console.error('Error en /api/escuelas:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.put('/necesidades/:idNecesidad/validar', async (req, res) =>{
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
});

// ..................... ENDPOINT PARA MOSTRAR TODOS LOS ALIADOS ................................
app.get('/api/aliados', async (req, res) => {
    try{
        //Obtener todos los aliados de la tabla
        const aliados = await AliadoModel.getAllAliados();
        //Validar si no hay resultados
        if(!aliados || aliados.length === 0){
            return res.status(404).json({error: 'No se encontraron aliados registrados'});
        }

        //Formatear los resultados (para hacer la prueba en postman de que sí se muestran)
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
            sector: sector
        }));

        return res.status(200).json({message: "Aliados obtenidos exitosamente", aliados: formattedAliados});

    }catch(error){
        console.error('Error al obtener aliados:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//============ENPOINTS DE NECESIDAD============//
// Endpoint para registrar necesidad 
app.post('/api/escuelas/:CCT/necesidades', async (req, res) => {
    const { CCT} = req.params;
    const { categoria, descripcion, ponderacion, estatus } = req.body;

    try {
        if(!categoria || !descripcion || ponderacion === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar que la escuela exista
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if(!escuela){
            return res.status(404).json({error: 'Escuela no encontrada'});  
        }

        //Registrar la necesidad
        const necesidad = await NecesidadModel.createNecesidad({CCT, categoria, descripcion, ponderacion, estatus});
        
        
        return res.status(201).json({ message: 'Necesidad registrada exitosamente', 
            necesidad: {
                idNecesidad: necesidad.idNecesidad,
                categoria,
                descripcion,
                ponderacion,
                estatus
            }
         });
    } catch (error) {
        console.error('Error al registrar necesidad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }


});

//Endpoint para mostrar necesidades por escuela
app.get('/api/escuelas/:CCT/necesidades', async (req, res) => {
    const { CCT } = req.params;
    try {

        //Verificar que la escuela exista
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if(!escuela){
            return res.status(404).json({error: 'La escuela no existe'});
        }
        // Obtener las necesidades asociadas a la escuela
        const necesidades = await NecesidadModel.getNecesidadesByEscuela(CCT);

        //Validar si no hay necesidades registradas
        if(!necesidades || necesidades.length === 0){
            return res.status(404).json({error: 'No se encontraron necesidades para esta escuela'});
        }
        return res.status(200).json({
            message: 'Necesidad obtenidas exitosamente', necesidades});
    }
    catch (error) {
        console.error('Error al obtener necesidades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

//Endpoint para validar/rechazar necesidades

//============ENPOINTS DE APOYO============//
//Endpoint para cargar apoyo
app.post('/api/aliados/:idAliado/apoyos', async (req, res) => {
    const { idAliado } = req.params;
    const { tipo, estatus, categoria, descripcion} = req.body;

    try {
        // Validar que no sean campos vacíos
        if (!tipo || !categoria || !descripcion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if (!existingAliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Registrar el apoyo en la base de datos
        const apoyo = await ApoyoModel.createApoyo({ idAliado, tipo, estatus, categoria, descripcion });

        // Registrar la relación con la tabla Aliado_Brinda_Apoyo
        await Aliado_Brinda_ApoyoModel.createAliadoBrindaApoyo({ idAliado, idApoyo: apoyo.idApoyo });

        return res.status(201).json({ message: 'Apoyo registrado exitosamente',
            apoyo: {
                idAliado,
                tipo,
                estatus,
                categoria,
                descripcion
            }
         });
    } catch (error) {
        console.error('Error al registrar apoyo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para mostrar todas las necesidades y en orden de ponderacion
app.get('/api/necesidades', async (req, res) => {
    try {
        // Obtener todas las necesidades de la base de datos
        const necesidades = await NecesidadModel.getAllNecesidades();

        // Validar si no hay necesidades registradas
        if (!necesidades || necesidades.length === 0) {
            return res.status(404).json({ error: 'No se encontraron necesidades registradas' });
        }

        return res.status(200).json({
            message: 'Necesidades obtenidas exitosamente',
            necesidades
        });
    } catch (error) {
        console.error('Error al obtener todas las necesidades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para editar el apoyo para próximos ciclos escolares
app.put('/api/aliados/:idAliado/apoyos/:idApoyo', async (req, res) =>{
    const {idAliado, idApoyo} = req.params;
    const {tipo, estatus, categoria, descripcion} = req.body;

    try{

        // Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if (!existingAliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Validar que el apoyo exista en la base de datos
        const existingApoyo = await ApoyoModel.getApoyoById(idApoyo);
        if (!existingApoyo) {
            return res.status(404).json({ error: 'El apoyo no existe' });
        }

       // Actualizar los campos enviados en la solicitud
       if (tipo) await ApoyoModel.updateApoyoTipo(idApoyo, tipo);
       if (estatus) await ApoyoModel.updateApoyoEstatus(idApoyo, estatus);
       if (categoria) await ApoyoModel.updateApoyoCategoria(idApoyo, categoria);
       if (descripcion) await ApoyoModel.updateApoyoDescripcion(idApoyo, descripcion);

        return res.status(200).json({
            message: 'Información actualizada exitosamente'
          });
    }catch(error){
        console.error('Error al editar apoyo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

//Mostrar los apoyos por aliado
app.get('/api/aliados/:idAliado/apoyos', async (req, res) => {
    const { idAliado } = req.params;

    try {
        // Validar que el aliado exista
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Obtener los apoyos brindados por el aliado
        const apoyos = await Aliado_Brinda_ApoyoModel.getApoyosByAliado(idAliado);

        if (!apoyos || apoyos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron apoyos brindados por este aliado' });
        }

        return res.status(200).json({
            message: 'Apoyos obtenidos exitosamente',
            apoyos
        });
    } catch (error) {
        console.error('Error al obtener los apoyos del aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
//Mostrar los apoyos pendientes de validar
app.get('/api/apoyos/pendientes', async (req, res) => {
    try {
        // Obtener los apoyos con estatus "Pendiente"
        const apoyosPendientes = await ApoyoModel.getApoyosPendientes();

        // Validar si no hay apoyos pendientes
        if (!apoyosPendientes || apoyosPendientes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron apoyos pendientes de validar' });
        }

        return res.status(200).json({
            message: 'Apoyos pendientes obtenidos exitosamente',
            apoyos: apoyosPendientes
        });
    } catch (error) {
        console.error('Error al obtener apoyos pendientes:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para registrar en la tabla Aliado_Brinda_Apoyo
app.post('/api/aliados/:idAliado/brindaApoyo/:idApoyo', async (req, res) => {
    const { idAliado, idApoyo } = req.params;

    try {
        // Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if (!existingAliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Validar que el apoyo exista en la base de datos
        const existingApoyo = await ApoyoModel.getApoyoById(idApoyo);
        if (!existingApoyo) {
            return res.status(404).json({ error: 'El apoyo no existe' });
        }

        // Validar que no exista una relación duplicada
        const existingRelation = await Aliado_Brinda_ApoyoModel.getRelationByAliadoAndApoyo(idAliado, idApoyo);
        if (existingRelation) {
            return res.status(409).json({ error: 'La relación ya existe' });
        }

        // Registrar la relación en la tabla Aliado_Brinda_Apoyo
        await Aliado_Brinda_ApoyoModel.createAliadoBrindaApoyo({ idAliado, idApoyo });

        return res.status(201).json({ message: 'Relación registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar la relación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para validar/rechazar un apoyo
app.put('/apoyos/:idApoyo/validar', async (req, res) => {
    try {
        const idApoyo = req.params.idApoyo;
        const { estatus } = req.body;

        // Validar que el campo estatus no esté vacío
        if (!estatus) {
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }

        // Validar que el estatus sea válido (Pendiente, Validado, Rechazado)
        const estatusValido = ['Pendiente', 'Validado', 'Rechazado'];
        if (!estatusValido.includes(estatus)) {
            return res.status(400).json({ error: 'El estatus proporcionado no es válido' });
        }

        // Validar que el apoyo exista
        const existingApoyo = await ApoyoModel.getApoyoById(idApoyo);
        if (!existingApoyo) {
            return res.status(404).json({ error: 'El apoyo no existe' });
        }

        // Actualizar el estatus del apoyo
        await ApoyoModel.updateApoyoEstatus(idApoyo, estatus);

        return res.status(200).json({ message: 'Estatus del apoyo actualizado exitosamente' });
    } catch (error) {
        console.error('Error al validar apoyo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
//.............................. ENDPOINTS PARA EL CONVENIO.............................
//Endpoint para crear el convenio

app.post('/api/convenios', async (req, res) => {
    try {
        const [convenio] = await ConvenioModel.createConvenio();
        return res.status(201).json({ message: 'Convenio creado exitosamente', convenio });
    } catch (error) {
        console.error('Error al registrar convenio:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para firmar convenio
app.put('/api/convenios/:idConvenio/firmar', async (req, res) => {
    const { idConvenio } = req.params;
    const { idAliado, CCT } = req.body; // Obtener el idAliado y CCT del cuerpo de la solicitud

    try {
        // Validar que el convenio exista
        const existingConvenio = await ConvenioModel.getConvenioById(idConvenio);
        if (!existingConvenio) {
            return res.status(404).json({ error: 'El convenio no existe' });
        }

         // Validar que la escuela exista
         const existingEscuela = await EscuelaModel.getEscuelaById(CCT);
         if (!existingEscuela) {
             return res.status(404).json({ error: 'La escuela no existe' });
         }

        // Validar que el aliado exista
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if (!existingAliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Validar que ya no exista una firma para este match
        const existingFirma = await FirmarConvenioModel.getFirmasByConvenio(idConvenio, idAliado, CCT);
if (existingFirma && existingFirma.length > 0) { 
    return res.status(400).json({ error: 'La firma ya existe para este convenio' });
}

        // Registrar la firma del convenio 
        const fecha_firma = new Date();
        await FirmarConvenioModel.createFirma({ idConvenio, idAliado, CCT, fecha_firma: fecha_firma });

        // Marcar el convenio como firmado
        await ConvenioModel.markConvenioAsFirmado(idConvenio);
        
        return res.status(200).json({ message: 'Convenio firmado exitosamente' });
    } catch (error) {
        console.error('Error al firmar convenio:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para que el administrador revise valide las necesidades
app.put('/necesidades/:idNecesidad/validar', async (req, res) =>{
    try{
        const idNecesidad = req.params.idNecesidad;
        const {estatus} = req.body;

        //Validar que no sea un campo vacío
        if(!estatus){
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }

        //Validar que la necesidad exista
        const existingNecesidad = await NecesidadModel.getNecesidadesById(idNecesidad);
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
});

//Endpoint para validar/rechazar escuelas
app.put('/escuelas/:CCT/validar', async (req, res) => {
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
app.put('/aliados/:idAliado/validar', async (req, res) => {
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

//============ENPOINTS DE CRONOGRAMA============//
//Endpoint para crear el cronograma
app.post('/api/cronogramas/mensuales', async (req, res) => {
    // Crear los cronogramas mensuales 
    const { fecha_inicio, fecha_fin } = req.body;
    try{
        // Validar que las fechas sean proporcionadas
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'Las fechas de inicio y fin son obligatorias' });
        }

        //Crear los cronogramas para los siguientes meses
        const cronogramas = await CronogramaModel.createCronograma(fecha_inicio, fecha_fin);
    return res.status(201).json({ message: 'Cronogramas mensuales creados exitosamente', cronogramas });

    }catch(error){
        console.error('Error al crear cronogramas mensuales:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
});

//============ENPOINTS DE ACTIVIDAD============//
//Endpoint para crear la actividad
app.post('/api/cronogramas/:idCronograma/actividades', async (req, res) => {
    const { idCronograma } = req.params;
    const { nombre, fecha_inicio, tipo, fecha_fin, estatus, descripcion } = req.body;

    try {
        // Validar que no sean campos vacíos
        if (!nombre || !fecha_inicio || !tipo || !fecha_fin || !descripcion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar que el cronograma exista en la base de datos
        const existingCronograma = await CronogramaModel.getCronogramaById(idCronograma);
        if (!existingCronograma) {
            return res.status(404).json({ error: 'El cronograma no existe' });
        }

        // Registrar la actividad en la base de datos
        const actividad = await ActividadModel.createActividad({ idCronograma, nombre, fecha_inicio, tipo, fecha_fin, estatus });

        return res.status(201).json({ message: 'Actividad registrada exitosamente',
            actividad: {
                idActividad: actividad.idActividad,
                nombre,
                fecha_inicio,
                fecha_fin,
                estatus
            }
         });
    } catch (error) {
        console.error('Error al registrar actividad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

//Endpoint para editar estatus de la actividad (pendiente, en proceso y finalizada)
app.put('/api/actividades/:idActividad', async(req, res) => {
    const {idActividad} = req.params;
    const {estatus} = req.body;

    try{
        // Validar que el estatus sea proporcionado
        if (!estatus) {
            return res.status(400).json({ error: 'El campo estatus es obligatorio' });
        }

        // Validar que la actividad exista en la base de datos
        const existingActividad = await ActividadModel.getActividadById(idActividad);
        if (!existingActividad) {
            return res.status(404).json({ error: 'La actividad no existe' });
        }

        // Actualizar el estatus de la actividad
        await ActividadModel.updateActividad(idActividad, { estatus });
        
        return res.status(200).json({
            message: 'Estatus de la actividad actualizado exitosamente',
            actividad: { idActividad, estatus }
        });

    }catch(error){
        console.error('Error al actualizar el estatus de la actividad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });

    }
})
//Endpoint para mostrar actividades por cronograma
app.get('/api/cronogramas/:idCronograma/actividades', async (req, res) => {
    const {idCronograma} = req.params;

    try{
         // Validar que el cronograma exista en la base de datos
         const existingCronograma = await CronogramaModel.getCronogramaById(idCronograma);
         if (!existingCronograma) {
             return res.status(404).json({ error: 'El cronograma no existe' });
         }

         // Obtener todas las actividades asociadas al cronograma
        const actividades = await ActividadModel.getActividadesByCronogramaId(idCronograma);

        // Validar si no hay actividades registradas
        if (actividades.length === 0) {
            return res.status(404).json({ error: 'No se encontraron actividades para este cronograma' });
        }

        // Formatear las actividades para la respuesta en JSON para ver si funcionaba en postman
        const formattedActividades = actividades.map((actividad) => ({
            idActividad: actividad.idActividad,
            nombre: actividad.nombre,
            tipo: actividad.tipo,
            estatus: actividad.estatus,
            fecha_inicio: actividad.fecha_inicio,
            fecha_fin: actividad.fecha_fin,
            descripcion: actividad.descripcion
        }));

        return res.status(200).json({
            message: 'Actividades obtenidas exitosamente',
            cronograma: {
                idCronograma: existingCronograma.idCronograma,
                fecha_inicio: existingCronograma.fecha_inicio,
                fecha_fin: existingCronograma.fecha_fin
            },
            actividades: formattedActividades
        }); 

    }catch(error){
        console.error('Error al obtener actividades por cronograma:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });

    }
    
});

//============ENPOINTS DE ALIADO_APOYA_ESCUELA============//
//Endpoint para crear el match entre el aliado y la escuela
app.post('/api/aliado/:idAliado/apoyaEscuela/:CCT', async (req, res) => {

    const {idAliado, CCT} = req.params;

    try{
        // Validar que el aliado exista en la base de datos
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaById(CCT);
        if(!existingEscuela){
            return res.status(404).json({ error: 'La escuela no existe' });
        }

        // Validar que no exista un match duplicado
        const existingMatch = await AliadoApoyaEscuelaModel.getMatchById(idAliado, CCT);
        if(existingMatch){
            return res.status(409).json({ error: 'El match ya existe' });
        }

        // Crear el match entre el aliado y la escuela
        await AliadoApoyaEscuelaModel.createMatch({ idAliado, CCT });

        return res.status(201).json({ message: 'Match creado exitosamente' });
    } catch(error){
        console.error('Error al crear el match:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para mostrar la lista de matches
app.get('/api/matches/', async (req, res) =>{
    try{
        // Obtener los matches con información de las escuelas y aliados
        const matches = await AliadoApoyaEscuelaModel.getAllMatches();

        if(!matches || matches.length === 0){
            return res.status(404).json({error: 'No se encontraron matches registrados'});
        }

        // Mostrar los matches en el json de forma estructurada
        const formattedMatches = matches.reduce((acc, match) => {
            const key = `${match.escuela_clave}-${match.escuela_nombre}`;
            if (!acc[key]) {
                acc[key] = {
                    escuela: {
                        clave: match.escuela_clave,
                        nombre: match.escuela_nombre
                    },
                    aliado: {
                        institucion: match.aliado_institucion,
                        nombre: match.nombre_aliado,
                        categoria_apoyo: match.categoria_apoyo
                    },
                    necesidades: []
                };
            }
            if (match.idNecesidad) {
                acc[key].necesidades.push({
                    idNecesidad: match.idNecesidad,
                    categoria: match.necesidad_categoria,
                    descripcion: match.necesidad_descripcion,
                    ponderacion: match.necesidad_ponderacion,
                    estatus: match.necesidad_estatus
                });
            }
            return acc;
        }, {});
        // Convertir el objeto en un arreglo
        const response = Object.values(formattedMatches);
        return res.status(200).json({message: 'Matches obtenidos exitosamente', matches: formattedMatches});

    }catch(error){
        console.error('Error al obtener la lista de matches:', error);
        return res.status(500).json({error: 'Error interno del servidor'});

    }
});

//.....................................................................................................................







//============ENPOINTS DE ADMINISTRADOR============//
//Endpoint de registro de administrador
app.post('/api/admin/registro', async (req, res) => {
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
        await AdminModel.createAdmin({ nombre, correo_electronico, contrasena});
        return res.status(201).json({ message: 'Administrador registrado exitosamente'});
    }catch(error) {
        console.error('Error al registrar administrador:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de administrador
app.post('/api/admin/login', async (req, res) => { 
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
        console.log("Hola desde el if de la validación del correo de loginAdmin", existingAdmin);
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
app.put('/api/admin/actualizar/:id', async (req, res) => { 
    try{
        console.log("Hola desde dentro del try de actualizarAdmin");
        const idAdmin = req.params.id;
        const {nuevoCorreo, nuevaContrasena, nuevoNombre} = req.body;

        //Validar que el admin existe
        console.log("Hola antes de la validación del idAdmin de actualizarAdmin");
        const adminActual = await AdminModel.getAdminById(idAdmin);
        console.log("Hola después de la validación del idAdmin de actualizarAdmin");
        if(!adminActual){
            console.log("Hola desde dentro del if de actualizarAdmin");
            return res.status(404).json({ error: 'Administrador no encontrado'});
        }

        //Validar el formato del correo (si se llega a enviar)
        if(nuevoCorreo){
            console.log("Hola desde dentro del if de nuevoCorreo de actualizarAdmin");
            const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.com$/; //Expresión regular para validar el correo
            if(!emailRegex.test(nuevoCorreo)) {
                return res.status(400).json({ error: 'El correo no es válido' });
            }

            //Validar que si el correo ya existe (solo si es diferente al actual)
            if(nuevoCorreo !== adminActual.correo_electronico){
                console.log("Hola desde dentro del if de nuevoCorreo !== adminActual.correo_electronico de actualizarAdmin");
                const existeCorreo = await AdminModel.getAdminByMail(nuevoCorreo);
                if(existeCorreo){
                    return res.status(409).json({ error: 'El correo ya está registrado'});
                }
            }
        }

        //Actualizar campos
        if (nuevoNombre) {
            console.log("Hola desde dentro del if de nuevoNombre de actualizarAdmin");
            await AdminModel.updateAdminName(idAdmin, nuevoNombre); // Actualiza "nombre"
        }
        if (nuevoCorreo) {
            console.log("Hola desde dentro del if de nuevoCorreo de actualizarAdmin");
            const newEmail = await AdminModel.getAdminByMail(nuevoCorreo);
            if(newEmail?.idAdmin !== undefined && newEmail.idAdmin !== idAdmin){
                return res.status(400).json({ error: 'El correo ya está registrado'});
            }
            await AdminModel.updateAdminMail(idAdmin, nuevoCorreo); // Actualiza "correo_electronico"
        }
        if (nuevaContrasena) {
            console.log("Hola desde dentro del if de nuevaContrasena de actualizarAdmin");
            await AdminModel.updateAdminPass(idAdmin); // Actualiza "contrasena"
        }

        return res.status(200).json({ message: 'Administrador actualizado exitosamente' });
    }catch(error){
        console.error('Error al actualizar administrador:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//Endpoint para enviar un email para restablecer la contraseña del Administrador
app.post('/api/admin/restablecerContrasena', async (req, res) => {
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

        const contrasenaRecuperada = existingAdmin.contrasena;
        //Enviar un email para restablecer la contraseña
        return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});


//============ENPOINTS DE REPRESENTANTE============//
//Endpoint de registro de representante
app.post('/api/registroRepre', async (req, res) => { 
    try{
        const {nombre, correo_electronico, contrasena, numero_telefonico, rol, anios_experiencia, proximo_a_jubilarse, cambio_zona, CCT} = req.body;
    
        //Validar que no sean campos vacíos
        if(!nombre || !correo_electronico || !contrasena || !numero_telefonico || !rol || !anios_experiencia || !CCT) {//No consideramos proximo_a_jubilarse y cambio_zona como obligatorios ya que están en false por default
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar que la escuela exista
        const escuela = await EscuelaModel.getEscuelaById(CCT);
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
        await RepresentanteModel.createRepresentante({ nombre, correo_electronico, contrasena, numero_telefonico, rol, anios_experiencia, proximo_a_jubilarse, cambio_zona, CCT });

        return res.status(201).json({ message: 'Representante registrado exitosamente'});
    }catch(error){
        console.error('Error al registrar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de
app.post('/api/loginRepre', async (req, res) => {
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
app.put('/api/actualizarRepre', async (req, res) => {
    try{
        const {idRepresentante, nuevoNombre, nuevoCorreo, nuevaContrasena, nuevoTelefono, nuevoRol, nuevoAnios, nuevoProximo, nuevoCambio} = req.body;
        //Validar que existe el representante
        const existingRepre = await RepresentanteModel.getRepresentanteById(idRepresentante);
        if(!existingRepre){
            return res.status(404).json({ error: 'Representante no encontrado'});
        }

        //Actualizaremos nombre
        if(nuevoNombre){
            await RepresentanteModel.updateRepresentanteName(idRepresentante, nuevoNombre); // Actualiza "nombre"
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
        if(nuevaContrasena){
            await RepresentanteModel.updateRepresentantePass(idRepresentante, nuevaContrasena); // Actualiza "contrasena"
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
        if(nuevoProximo !== undefined){
            await RepresentanteModel.updateRepresentanteproximo_a_jubilarse(idRepresentante, nuevoProximo); // Actualiza "proximo_a_jubilarse"
        }

        if(nuevoCambio){
            await RepresentanteModel.updateRepresentanteCambio_zona(idRepresentante, nuevoCambio); // Actualiza "cambio_zona"
        }

        return res.status(200).json({ message: 'Representante actualizado exitosamente' });
    }catch(error){
        console.error('Error al actualizar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Enpoint para enviar un email para restablecer la constraseña del Representante
app.post('/api/restablecerRepreContrasena', async (req, res) => { 
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

//Endpoint para obtener el representante por su id
app.get('/api/representanteId/:id', async (req, res) => {
    try{
        const repreId = req.params.id;

        //validar que no sea un campo vacío
        if(!repreId){
            return res.status(400).json({ error: 'El campo id es obligatorio' });
        }

        //Validar que el representante exista en la base de datos
        const existingRepre = await RepresentanteModel.getRepresentanteById(repreId);
        if(!existingRepre){
            return res.status(404).json({ error: 'El representante no esta registrado'});
        }

        //Si el representante existe, regresamos los datos del representante
        return res.status(200).json(existingRepre);
    }catch(error){
        console.error('Error al obtener el representante por su id: ', error);
        return res.status(500).json({error: 'Error al obtener el representante'});
    }
});

//Endpoint para obtener el representante por su numero de telefono
app.get('/api/representanteTel/:numero_telefonico', async (req, res) => {
    try{
        const numTelRepre = req.params.numero_telefonico;

        //validar que no sea un campo vacío
        if(!numTelRepre){
            return res.status(400).json({ error: 'El campo numero de telefono es obligatorio' });
        }

        //Validar que el representante exista en la base de datos
        const existingRepre = await RepresentanteModel.getRepresentanteByPhone(numTelRepre);
        if(!existingRepre){
            return res.status(404).json({ error: 'El representante no esta registrado'});
        }

        //Si el representante existe, regresamos los datos del representante
        return res.status(200).json(existingRepre);
    }catch(error){
        console.error('Error al obtener el representante por su numero de telefono: ', error);
        return res.status(500).json({error: 'Error al obtener el representante'});
    }
});

//============ENPOINTS DE ESCUELA============//
//Endpoint de registro de escuela
app.post('/api/escuela/registroEscuela', async (req, res) => { 
    try{
        const {CCT, nombre, modalidad, nivel_educativo, sector_escolar, sostenimiento, zona_escolar, calle, colonia, municipio, numero, descripcion,  control_administrativo, numero_estudiantes} = req.body;

        //Validar que no sean campos vacíos
        if(!CCT || !nombre || !modalidad || !nivel_educativo || !sector_escolar || !sostenimiento || !zona_escolar || !calle || !colonia || !municipio || !numero || !descripcion || !control_administrativo || !numero_estudiantes) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el CCT no exista en la base de datos
        const existingCCT = await EscuelaModel.getEscuelaById(CCT);
        if(existingCCT){
            return res.status(409).json({ error: 'El CCT ya está registrado'});
        }
        
        //Registrar la nueva escuela en la base de datos
        await EscuelaModel.createEscuela({ CCT, nombre, modalidad, nivel_educativo, sector_escolar, sostenimiento, zona_escolar, calle, colonia, municipio, numero, descripcion, control_administrativo, numero_estudiantes });

        return res.status(201).json({ message: 'Escuela registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener la escuela por su CCT (UTILIZAMOS LA QUERY-STRING)
app.get('/api/escuela/:CCT', async (req, res) => {
    try{
        const escuelaCCT = req.params.CCT;

        //Validar que no sea un campo vacío
        if(!escuelaCCT){
            return res.status(400).json({ error: 'El campo CCT es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaById(escuelaCCT);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener la escuela por su nombre (UTILIZAMOS QUERY-STRING)
app.get('/api/escuela/nombre/:nombre', async (req, res) => { 
    try{
        const nombreEscuela = req.params.nombre;

        //Validar que no sea un campo vacío
        if(!nombreEscuela){
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaByNombre(nombreEscuela);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener la escuela por su municipio (UTILIZAMOS QUERY-STRING)
app.get('/api/escuela/municipio/:municipio', async (req, res) => { 
    try{
        const municipioEscuela = req.params.municipio;

        //Validar que no sea un campo vacío
        if(!municipioEscuela){
            return res.status(400).json({ error: 'El campo municipio es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaByMunicipio(municipioEscuela);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela (Retornamos el Municipio almacenado en la variable existingEscuela)
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener la escuela por su zona escolar (UTILIZAMOS QUERY-STRING)
app.get('/api/escuela/zona_escolar/:zona_escolar', async (req, res) => {
    try{
        const zonaEscuela = req.params.zona_escolar;

        //Validar que no sea un campo vacío
        if(!zonaEscuela){
            return res.status(400).json({ error: 'El campo zona escolar es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaByZona_escolar(zonaEscuela);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela (Retornamos el Zona Escolar almacenado en la variable existingEscuela)
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//Endpoint para obtener la escuela por su nivel educativo (UTILIZAMOS QUERY-STRING)
app.get('/api/escuela/nivel_educativo/:nivel_educativo', async (req, res) => {
    try{
        const nivelEducativo = req.params.nivel_educativo;

        //Validar que no sea un campo vacío
        if(!nivelEducativo){
            return res.status(400).json({ error: 'El campo nivel educativo es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaByNivel_educativo(nivelEducativo);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela (Retornamos el Nivel Educativo almacenado en la variable existingEscuela)
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener la escuela por su sector escolar (UTILIZAMOS QUERY-STRING)
app.get('/api/escuela/sector_escolar/:sector_escolar', async (req, res) => { 
    try{
        const sectorEscuela = req.params.sector_escolar;

        //Validar que no sea un campo vacío
        if(!sectorEscuela){
            return res.status(400).json({ error: 'El campo sector escolar es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaBySector_escolar(sectorEscuela);
        if(!existingEscuela){
            return res.status(400).json({ error: 'La escuela no esta registrada'});
        }

        //Si la escuela existe, regresamos los datos de la escuela (Retornamos el Sector Escolar almacenado en la variable existingEscuela)
        return res.status(200).json(existingEscuela);
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//============ENPOINTS DE ALIADO============//
//Endpoint de registro de aliado
app.post('/api/registroAliado', async (req, res) => {
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
app.post('/api/loginAliado', async (req, res) => {
    try{
        const {correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(!existingMail){
            return res.status(400).json({ error: 'El correo no está registrado'});
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

//Endpoint para ver el catálogo de aliados por institución (UTILIZAMOS QUERY-STRING)
app.get('/api/aliadoInst/:institucion', async (req, res) => {
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
app.get('/api/aliadoMun/:municipio', async (req, res) => {
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
app.get('/api/aliadoCor/:correo_electronico', async (req, res) => {
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
app.get('/api/aliadoCURP/:CURP', async (req, res) => {
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
app.put('/api/actualizarAliado', async (req, res) => {
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
app.post('/api/restablecerAliadoContrasena', async (req, res) => { 
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


//============ENPOINTS DE FIRMA DE DOCUMENTOS============//

//============ENPOINTS DE NECESIDAD============//

//============ENPOINTS DE DIAGNOSTICO============//

//============ENPOINTS DE ALIADO============//

//============ENPOINTS DE APOYO============//

//============ENPOINTS DE ESCUELA_RECIBE_APOYO============//

//============ENPOINTS DE ALIADO_BRINDA_APOYO============//

//============ENPOINTS DE CRONOGRAMA============//

//============ENPOINTS DE ACTIVIDAD============//

//============ENPOINTS DE CHAT============//

//============ENPOINTS DE CHAT_ALIADO_ESCUELA============//

//============ENPOINTS DE MENSAJES============//

//============ENPOINTS DE NOTIFICACION============//

//============ENPOINTS DE ALIADO_APOYA_ESCUELA============//

//============ENPOINTS DE PERSONA_MORAL============//
//Endpoint para registrar al aliado como persona moral
app.post('/api/registroPersonaMoral', async (req, res) => { 
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
app.put('/api/actualizarPersonaMoral', async (req, res) => {
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
app.get('/api/personaMoral/pagina_web/:pagina_web', async (req, res) => {
    try{
        const personaMoralPaginaWeb = req.params.pagina_web.trim(); // Eliminar espacios en blanco al inicio y al final
    
        //Validar que no sea un campo vacío
        if(!personaMoralPaginaWeb){
            return res.status(400).json({ error: 'El campo pagina web es obligatorio' });
        }

        //Validar que exista la pagina web en la base de datos
        if(!personaMoralPaginaWeb){
            return res.status(404).json({ error: 'La pagina web no esta registrada'});
        }

        return res.status(200).json(personaMoralPaginaWeb);
    }catch(error){
        console.error('Error al obtener persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para obtener los datos de la persona moral por su nombre de organización (UTILIZAMOS QUERY-STRING)
app.get('/api/personaMoral/nombre_organizacion/:nombre_organizacion', async (req, res) => {
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


//============ENPOINTS DE ESCRITURA_PUBLICA============//
//Endpoint para registrar la escritura pública
app.post('/api/registroEscrituraPublica', async (req, res) => {
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
app.get('/api/escrituraPublica/notario/:notario', async (req, res) => {
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
app.get('/api/escrituraPublica/ciudad/:ciudad', async (req, res) => {
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


//============ENPOINTS DE CONSTANCIA_FISCAL============//
//Endpoint para registrar la constancia fiscal
app.post('/api/registroConstanciaFiscal', async (req, res) => {
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
app.put('/api/actualizarConstanciaFiscal', async (req, res) => {
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
app.get('/api/constanciaFiscal/RFC/:RFC', async (req, res) => {
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
app.get('/api/constanciaFiscal/domicilio/:domicilio', async (req, res) => {
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

//============NECESIDAD============//

//============NECESIDAD============//

//Puerto de escucha
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`);
})