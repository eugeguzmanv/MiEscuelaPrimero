//Documento para configurar el servidor y los métodos HTTP
const express = require('express');
const db = require('./db');
const app = express();
const bcrypt = require('bcrypt'); // Librería para encriptar contraseñas
const nodemailer = require('nodemailer');
const port = 1000;

// Add CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

//Requeriremos TODOS los modelos que definimos en la carpeta models
const AdminModel = require('./models/mAdministrador.js');
const RepresentanteModel = require('./models/mRepresentante.js');
const EscuelaModel = require('./models/mEscuela.js');
const AliadoModel = require('./models/mAliado.js');
const PersonaMoralModel = require('./models/mPersona_Moral.js');
const EscrituraPublicaModel = require('./models/mEscritura_Publica.js');
const ConstanciaFiscalModel = require('./models/mConstancia_Fiscal.js');
const NecesidadModel = require('./models/mNecesidad.js');
const ApoyoModel = require('./models/mApoyo.js');
const Convenio = require('./models/Convenio');

app.use(express.static('public')); //Para poder servir archivos estáticos como HTML, CSS, JS, etc.
app.use(express.json()); //Para poder recibir datos en formato JSON en el body de las peticiones



//============ENPOINTS DE ADMINISTRADOR============//
//Endpoint de registro de administrador
app.post('/api/registroAdmin', async (req, res) => {
    try{
        const {nombre, correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!nombre || !correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.org.mx)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.org\.mx$/; //Expresión regular para validar el correo
        
        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.org.mx)
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
app.post('/api/loginAdmin', async (req, res) => { 
    try{
        const {correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.org.mx)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.org\.mx$/; //Expresión regular para validar el correo

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
app.put('/api/actualizarAdmin/:id', async (req, res) => { 
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
            const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.org\.mx$/; //Expresión regular para validar el correo
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
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10); // Hashear nueva contraseña
            await AdminModel.updateAdminPass(idAdmin, hashedPassword); // Actualiza "contrasena"
        }

        return res.status(200).json({ message: 'Administrador actualizado exitosamente' });
    }catch(error){
        console.error('Error al actualizar administrador:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//Endpoint para enviar un email para restablecer la contraseña del Administrador
app.post('/api/restablecerAdminContrasena', async (req, res) => {
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

//Endpoint para obtener el representante por su correo electrónico
app.get('/api/representante/mail/:correo_electronico', async (req, res) => {
    try{
        const repreEmail = req.params.correo_electronico;

        //validar que no sea un campo vacío
        if(!repreEmail){
            return res.status(400).json({ error: 'El campo correo electrónico es obligatorio' });
        }

        //Validar que el representante exista en la base de datos
        const existingRepre = await RepresentanteModel.getRepresentanteByMail(repreEmail);
        if(!existingRepre){
            return res.status(404).json({ error: 'El representante no está registrado con este correo'});
        }

        //Si el representante existe, regresamos los datos del representante
        return res.status(200).json(existingRepre);
    }catch(error){
        console.error('Error al obtener el representante por su correo electrónico: ', error);
        return res.status(500).json({error: 'Error al obtener el representante'});
    }
});

//Endpoint para obtener todos los representantes de una escuela por CCT
app.get('/api/representantes/escuela/:CCT', async (req, res) => {
    try{
        const escuelaCCT = req.params.CCT;

        //validar que no sea un campo vacío
        if(!escuelaCCT){
            return res.status(400).json({ error: 'El campo CCT es obligatorio' });
        }

        //Validar que la escuela exista en la base de datos
        const existingEscuela = await EscuelaModel.getEscuelaById(escuelaCCT);
        if(!existingEscuela){
            return res.status(404).json({ error: 'La escuela no está registrada'});
        }

        //Buscar todos los representantes asociados con esta escuela
        const representantes = await RepresentanteModel.getRepresentantesByCCT(escuelaCCT);
        
        if(!representantes || representantes.length === 0){
            return res.status(404).json({ error: 'No se encontraron representantes para esta escuela'});
        }

        //Retornar lista de representantes
        return res.status(200).json(representantes);
    }catch(error){
        console.error('Error al obtener representantes de la escuela:', error);
        return res.status(500).json({error: 'Error al obtener los representantes'});
    }
});

//Endpoint para eliminar un representante de una escuela
app.delete('/api/escuela/:CCT/representante/:idRepresentante', async (req, res) => {
    try {
        const CCT = req.params.CCT;
        const idRepresentante = req.params.idRepresentante;
        
        // Validar que la escuela existe
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }
        
        // Validar que el representante existe y pertenece a esta escuela
        const representante = await RepresentanteModel.getRepresentanteById(idRepresentante);
        if (!representante) {
            return res.status(404).json({ error: 'Representante no encontrado' });
        }
        
        if (representante.CCT !== CCT) {
            return res.status(403).json({ error: 'El representante no pertenece a esta escuela' });
        }
        
        // Eliminar el representante usando el método del modelo
        await RepresentanteModel.deleteRepresentante(idRepresentante);
        
        return res.status(200).json({ 
            message: 'Representante eliminado exitosamente',
            idRepresentante,
            CCT
        });
    } catch (error) {
        console.error('Error al eliminar representante:', error);
        return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

//Endpoint para actualizar múltiples representantes de una escuela a la vez
app.put('/api/escuela/:CCT/representantes/batch', async (req, res) => {
    try {
        const CCT = req.params.CCT;
        const { representantes } = req.body;
        
        if (!representantes || !Array.isArray(representantes) || representantes.length === 0) {
            return res.status(400).json({ error: 'Se debe proporcionar un array de representantes a actualizar' });
        }
        
        // Validar que la escuela existe
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }
        
        // Mapa para validación de correos y teléfonos en proceso
        const emailMap = new Map();
        const phoneMap = new Map();
        
        // Recopilar IDs de representantes existentes
        const existingRepresentantes = await RepresentanteModel.getRepresentantesByCCT(CCT);
        const existingIds = existingRepresentantes.map(rep => rep.idRepresentante);
        
        // Verificar que cada representante pertenece a esta escuela
        const representantesIds = representantes.map(rep => rep.idRepresentante);
        
        // Validar que todos los IDs existen y pertenecen a la escuela
        for (const id of representantesIds) {
            if (!id) {
                return res.status(400).json({ error: 'Todos los representantes deben tener un idRepresentante' });
            }
            
            const representante = await RepresentanteModel.getRepresentanteById(id);
            if (!representante) {
                return res.status(404).json({ error: `El representante con ID ${id} no existe` });
            }
            
            if (representante.CCT !== CCT) {
                return res.status(403).json({ error: `El representante con ID ${id} no pertenece a esta escuela` });
            }
            
            // Añadir el correo y teléfono actual al mapa para validación
            emailMap.set(id, representante.correo_electronico);
            phoneMap.set(id, representante.numero_telefonico);
        }
        
        // Validar unicidad de correos y teléfonos entre todos los representantes
        for (const rep of representantes) {
            // Si el correo cambió, verificar que no esté en uso por otro representante
            if (rep.correo_electronico && rep.correo_electronico !== emailMap.get(rep.idRepresentante)) {
                const existingEmail = await RepresentanteModel.getRepresentanteByMail(rep.correo_electronico);
                
                if (existingEmail && existingEmail.idRepresentante !== parseInt(rep.idRepresentante)) {
                    return res.status(409).json({ 
                        error: `El correo ${rep.correo_electronico} ya está registrado por otro representante` 
                    });
                }
            }
            
            // Si el teléfono cambió, verificar que no esté en uso por otro representante
            if (rep.numero_telefonico && rep.numero_telefonico !== phoneMap.get(rep.idRepresentante)) {
                const existingPhone = await RepresentanteModel.getRepresentanteByPhone(rep.numero_telefonico);
                
                if (existingPhone && existingPhone.idRepresentante !== parseInt(rep.idRepresentante)) {
                    return res.status(409).json({ 
                        error: `El teléfono ${rep.numero_telefonico} ya está registrado por otro representante` 
                    });
                }
            }
        }
        
        // Realizar todas las actualizaciones
        const updates = representantes.map(rep => 
            RepresentanteModel.updateRepresentanteFull(rep.idRepresentante, rep)
        );
        
        await Promise.all(updates);
        
        return res.status(200).json({ 
            message: `${representantes.length} representantes actualizados exitosamente`,
            CCT,
            representantesActualizados: representantesIds
        });
    } catch (error) {
        console.error('Error al actualizar lote de representantes:', error);
        return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

//============ENPOINTS DE ESCUELA============//
//Endpoint de registro de escuela
app.post('/api/registroEscuela', async (req, res) => { 
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

//Endpoint para obtener todas las escuelas
app.get('/api/escuelas/', async (req, res) => {
    try{
        // Llamar a la función del modelo para obtener las escuelas
        const escuelas = await EscuelaModel.getAllEscuelas();

        // Validar si no hay resultados
        if (!escuelas || escuelas.length === 0) {
            return res.status(404).json({ error: "No se encontraron escuelas" });
        }

        // Agrupar escuelas por CCT y acumular representantes
        const escuelasMap = new Map();

        try {
            escuelas.forEach(escuela => {
                const cct = escuela.CCT;
                
                if (!escuelasMap.has(cct)) {
                    // Primera vez que vemos esta escuela
                    const escuelaData = {
                        CCT: cct,
                        nombre: escuela.nombre,
                        descripcion: escuela.descripcion || null,
                        direccion: {
                            calle: escuela.calle,
                            numero: escuela.numero,
                            colonia: escuela.colonia,
                            municipio: escuela.municipio
                        },
                        nivel_educativo: escuela.nivel_educativo,
                        numero_alumnos: escuela.numero_estudiantes,
                        representantes: []
                    };
                    
                    // Añadir representante si existe
                    if (escuela.representante_nombre) {
                        escuelaData.representantes.push({
                            nombre: escuela.representante_nombre,
                            correo_electronico: escuela.representante_correo
                        });
                    }
                    
                    escuelasMap.set(cct, escuelaData);
                } else {
                    // Si ya existe la escuela y hay un representante nuevo, lo añadimos
                    const escuelaExistente = escuelasMap.get(cct);
                    
                    if (escuela.representante_nombre && 
                        !escuelaExistente.representantes.some(r => 
                            r.correo_electronico === escuela.representante_correo)) {
                        
                        escuelaExistente.representantes.push({
                            nombre: escuela.representante_nombre,
                            correo_electronico: escuela.representante_correo
                        });
                    }
                }
            });

            // Convertir el Map a un array
            const formattedEscuelas = Array.from(escuelasMap.values());

            return res.status(200).json({ escuelas: formattedEscuelas });
        } catch (processingError) {
            return res.status(500).json({ error: "Error procesando datos de escuelas", details: processingError.message });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});

//Endpoint para actualizar la escuela y sus representantes por su CCT 
app.put('/api/escuela/actualizarCompleto/:CCT', async (req, res) => {
    try {
        const CCT = req.params.CCT;
        const { 
            escuelaData, 
            representantesData 
        } = req.body;

        // Validar que el CCT existe
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }

        // Actualizar todos los campos de la escuela usando el nuevo método
        if (escuelaData) {
            // Validar que el CCT en el body coincide con el CCT en la URL
            if (escuelaData.CCT && escuelaData.CCT !== CCT) {
                return res.status(400).json({ error: 'No se puede modificar el CCT de la escuela' });
            }

            // Actualizar todos los campos a la vez
            await EscuelaModel.updateEscuelaFull(CCT, escuelaData);
        }

        // Actualizar los representantes usando el nuevo método
        if (representantesData && Array.isArray(representantesData)) {
            const actualizacionesRepresentantes = representantesData.map(async (representante) => {
                // Cada representante debe tener un idRepresentante
                if (!representante.idRepresentante) {
                    throw new Error('Todos los representantes deben tener un idRepresentante');
                }

                // Verificar que el representante existe y pertenece a esta escuela
                const representanteExistente = await RepresentanteModel.getRepresentanteById(representante.idRepresentante);
                if (!representanteExistente) {
                    throw new Error(`El representante con ID ${representante.idRepresentante} no existe`);
                }
                
                // Verificar que el representante pertenece a esta escuela
                if (representanteExistente.CCT !== CCT) {
                    throw new Error(`El representante con ID ${representante.idRepresentante} no pertenece a esta escuela`);
                }

                // Verificar correo único
                if (representante.correo_electronico && 
                    representante.correo_electronico !== representanteExistente.correo_electronico) {
                    const existingEmail = await RepresentanteModel.getRepresentanteByMail(representante.correo_electronico);
                    if (existingEmail && existingEmail.idRepresentante !== parseInt(representante.idRepresentante)) {
                        throw new Error(`El correo ${representante.correo_electronico} ya está registrado por otro representante`);
                    }
                }
                
                // Verificar teléfono único
                if (representante.numero_telefonico && 
                    representante.numero_telefonico !== representanteExistente.numero_telefonico) {
                    const existingPhone = await RepresentanteModel.getRepresentanteByPhone(representante.numero_telefonico);
                    if (existingPhone && existingPhone.idRepresentante !== parseInt(representante.idRepresentante)) {
                        throw new Error(`El teléfono ${representante.numero_telefonico} ya está registrado por otro representante`);
                    }
                }

                // Actualizar todos los campos del representante a la vez
                await RepresentanteModel.updateRepresentanteFull(representante.idRepresentante, representante);

                return representante.idRepresentante;
            });

            // Esperar a que todas las actualizaciones de representantes terminen
            await Promise.all(actualizacionesRepresentantes);
        }

        return res.status(200).json({ 
            message: 'Información de la escuela y sus representantes actualizada exitosamente',
            CCT
        });
    } catch (error) {
        console.error('Error al actualizar la escuela y sus representantes:', error);
        return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
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
        const result = await AliadoModel.createAliado({ correo_electronico, nombre, contraseña, CURP, institucion, sector, calle, colonia, municipio, numero, descripcion });
        
        // Handle different return formats from Knex (depends on database used)
        let newAliadoId;
        if (Array.isArray(result)) {
            newAliadoId = result[0];
        } else if (typeof result === 'object') {
            newAliadoId = result;
        } else {
            newAliadoId = result;
        }

        return res.status(200).json({ message: 'Aliado registrado exitosamente', id: newAliadoId });
    }catch(error){
        console.error('Error al registrar aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de aliado
app.post('/api/loginAliado', async (req, res) => {
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

//Endpoint para obtener todos los aliados
app.get('/api/aliados', async (req, res) => {
    try{
        //Obtener todos los aliados de la tabla
        const aliados = await AliadoModel.getAllAliados();
        
        //Validar si no hay resultados
        if(!aliados || aliados.length === 0){
            return res.status(404).json({error: 'No se encontraron aliados registrados'});
        }

        //Formatear los resultados adaptándose a la estructura real de la base de datos
        const formattedAliados = aliados.map((aliado) => {
            // Create a base object with fields that are likely to exist
            const formattedAliado = {
                idAliado: aliado.idAliado,
                nombre: aliado.nombre || 'Aliado sin nombre',
                correo: aliado.correo_electronico,
                descripcion: aliado.descripcion,
                direccion: {
                    calle: aliado.calle || '',
                    numero: aliado.numero || '',
                    colonia: aliado.colonia || '',
                    municipio: aliado.municipio || ''
                },
                institucion: aliado.institucion || '',
                sector: aliado.sector || ''
            };
            
            return formattedAliado;
        });

        return res.status(200).json({message: "Aliados obtenidos exitosamente", aliados: formattedAliados});

    } catch(error){
        return res.status(500).json({error: 'Error interno del servidor', details: error.message});
    }
})


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

//Nuevo endpoint para actualizar toda la información de un aliado
app.put('/api/aliado/actualizarCompleto/:id', async (req, res) => {
  try {
    const aliadoId = req.params.id;
    const { 
      aliadoData, 
      personaMoralData, 
      escrituraPublicaData, 
      constanciaFiscalData 
    } = req.body;

    // Actualizar datos del aliado
    if (aliadoData) {
      await AliadoModel.updateAliadoFull(aliadoId, aliadoData);
    }

    // Actualizar datos de persona moral
    if (personaMoralData && personaMoralData.idPersonaMoral) {
      await PersonaMoralModel.updatePersonaMoralFull(personaMoralData.idPersonaMoral, personaMoralData);
    }

    // Actualizar datos de escritura pública
    if (escrituraPublicaData && escrituraPublicaData.idEscrituraPublica) {
      await EscrituraPublicaModel.updateEscrituraPublicaFull(escrituraPublicaData.idEscrituraPublica, escrituraPublicaData);
    }

    // Actualizar datos de constancia fiscal
    if (constanciaFiscalData && constanciaFiscalData.idConstanciaFiscal) {
      await ConstanciaFiscalModel.updateConstanciaFiscalFull(constanciaFiscalData.idConstanciaFiscal, constanciaFiscalData);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Información del aliado actualizada correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar información del aliado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la información del aliado', 
      error: error.message 
    });
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

//Endpoint para obtener los datos de la persona moral por su idAliado
app.get('/api/personaMoral/idAliado/:idAliado', async (req, res) => {
    try{
        const idAliado = req.params.idAliado;

        //Validar que no sea un campo vacío
        if(!idAliado){
            return res.status(400).json({ error: 'El campo idAliado es obligatorio' });
        }

        //Validar que exista la persona moral en la base de datos
        const existingPersonaMoral = await PersonaMoralModel.getPersonaMoralByIdAliado(idAliado);
        if(!existingPersonaMoral){
            return res.status(404).json({ error: 'No se encontró persona moral para este aliado'});
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

//Endpoint para obtener los datos de la escritura pública por idPersonaMoral
app.get('/api/escrituraPublica/idPersonaMoral/:idPersonaMoral', async (req, res) => {
    try{
        const idPersonaMoral = req.params.idPersonaMoral;

        //Validar que no sea un campo vacío
        if(!idPersonaMoral){
            return res.status(400).json({ error: 'El campo idPersonaMoral es obligatorio' });
        }

        //Validar que exista la escritura pública en la base de datos
        const existingEscrituraPublica = await EscrituraPublicaModel.getAllEscriturapublicasByIdPersonaMoral(idPersonaMoral);
        if(!existingEscrituraPublica || existingEscrituraPublica.length === 0){
            return res.status(404).json({ error: 'No se encontró escritura pública para esta persona moral'});
        }

        // Si solo hay una escritura, devolver el primer elemento, sino devolver el array
        const result = existingEscrituraPublica.length === 1 ? existingEscrituraPublica[0] : existingEscrituraPublica;
        return res.status(200).json(result);
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

//Endpoint para obtener los datos de la constancia fiscal por idPersonaMoral
app.get('/api/constanciaFiscal/idPersonaMoral/:idPersonaMoral', async (req, res) => {
    try{
        const idPersonaMoral = req.params.idPersonaMoral;

        //Validar que no sea un campo vacío
        if(!idPersonaMoral){
            return res.status(400).json({ error: 'El campo idPersonaMoral es obligatorio' });
        }

        //Validar que exista la constancia fiscal en la base de datos
        const existingConstanciaFiscal = await ConstanciaFiscalModel.getConstanciaFiscalByIdPersonaMoral(idPersonaMoral);
        if(!existingConstanciaFiscal){
            return res.status(404).json({ error: 'No se encontró constancia fiscal para esta persona moral'});
        }

        return res.status(200).json(existingConstanciaFiscal);
    }catch(error){
        console.error('Error al obtener constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//============NECESIDAD============//

//============NECESIDAD============//

//Endpoint para obtener datos del perfil de administrador
app.get('/api/admin/perfil', async (req, res) => {
    try {
        const { email } = req.query;
        console.log('Admin profile request received for email:', email);
        
        if (!email) {
            console.log('Email parameter missing');
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }
        
        const admin = await AdminModel.getAdminByMail(email);
        console.log('Admin data from database:', admin);
        
        if (!admin) {
            console.log('Admin not found in database');
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        
        // Return admin data (excluding sensitive information like password)
        const response = {
            nombre: admin.nombre,
            correo_electronico: admin.correo_electronico
        };
        console.log('Sending response:', response);
        return res.status(200).json(response);
        
    } catch (error) {
        console.error('Error al obtener datos del administrador:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//============ENPOINTS DE NECESIDAD============//
// Endpoint para registrar una nueva necesidad
app.post('/api/registroNecesidad', async (req, res) => {
    try {
        const { Categoria, Sub_categoria, Fecha, Descripcion, Estado_validacion, CCT } = req.body;

        // Validar que los campos requeridos no estén vacíos
        if (!Categoria || !Sub_categoria || !Fecha || !Descripcion || !CCT) {
            return res.status(400).json({ error: 'Los campos Categoria, Sub_categoria, Fecha, Descripcion y CCT son obligatorios' });
        }

        // Verificar que la escuela exista
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'La escuela con el CCT proporcionado no existe' });
        }

        // Crear la necesidad
        const necesidadData = {
            Categoria,
            Sub_categoria,
            Fecha,
            Descripcion,
            Estado_validacion: Estado_validacion || false,
            CCT
        };
        
        const result = await NecesidadModel.createNecesidad(necesidadData);
        
        return res.status(201).json({ 
            message: 'Necesidad registrada exitosamente',
            id: result.id
        });
    } catch (error) {
        console.error('Error al registrar necesidad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todas las necesidades de una escuela por CCT
app.get('/api/necesidades/escuela/:CCT', async (req, res) => {
    try {
        const CCT = req.params.CCT;

        // Validar que el CCT no esté vacío
        if (!CCT) {
            return res.status(400).json({ error: 'El CCT es obligatorio' });
        }

        // Verificar que la escuela exista
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'La escuela con el CCT proporcionado no existe' });
        }

        // Obtener las necesidades
        const necesidades = await NecesidadModel.getNecesidadesByCCT(CCT);
        
        return res.status(200).json(necesidades);
    } catch (error) {
        console.error('Error al obtener necesidades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar el estado de validación de una necesidad
app.put('/api/necesidades/validar/:idNecesidad', async (req, res) => {
    try {
        const { idNecesidad } = req.params;
        const { Estado_validacion } = req.body;

        // Validar que el idNecesidad no esté vacío
        if (!idNecesidad) {
            return res.status(400).json({ error: 'El ID de la necesidad es obligatorio' });
        }

        // Validar que el estado de validación esté presente
        if (Estado_validacion === undefined) {
            return res.status(400).json({ error: 'El estado de validación es obligatorio' });
        }

        // Verificar que la necesidad exista
        const necesidad = await NecesidadModel.getNecesidadById(idNecesidad);
        if (!necesidad) {
            return res.status(404).json({ error: 'La necesidad no existe' });
        }

        // Actualizar el estado de validación
        await NecesidadModel.updateValidacionEstado(idNecesidad, Estado_validacion);
        
        return res.status(200).json({ 
            message: 'Estado de validación actualizado exitosamente',
            idNecesidad,
            Estado_validacion
        });
    } catch (error) {
        console.error('Error al actualizar estado de validación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//============ENPOINTS DE APOYO============//
// Endpoint para registrar un nuevo apoyo
app.post('/api/registroApoyo', async (req, res) => {
    try {
        const { Categoria, Sub_categoria, Fecha, Descripcion, Estado_validacion, idAliado } = req.body;

        // Validar que los campos requeridos no estén vacíos
        if (!Categoria || !Sub_categoria || !Fecha || !Descripcion || !idAliado) {
            return res.status(400).json({ error: 'Los campos Categoria, Sub_categoria, Fecha, Descripcion e idAliado son obligatorios' });
        }

        // Verificar que el aliado exista
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            return res.status(404).json({ error: 'El aliado con el ID proporcionado no existe' });
        }

        // Crear el apoyo
        const apoyoData = {
            Categoria,
            Sub_categoria,
            Fecha,
            Descripcion,
            Estado_validacion: Estado_validacion || false,
            idAliado
        };
        
        const result = await ApoyoModel.createApoyo(apoyoData);
        
        return res.status(201).json({ 
            message: 'Apoyo registrado exitosamente',
            id: result.id
        });
    } catch (error) {
        console.error('Error al registrar apoyo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los apoyos de un aliado por idAliado
app.get('/api/apoyos/aliado/:idAliado', async (req, res) => {
    try {
        const idAliado = req.params.idAliado;

        // Validar que el idAliado no esté vacío
        if (!idAliado) {
            return res.status(400).json({ error: 'El ID del aliado es obligatorio' });
        }

        // Verificar que el aliado exista
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            return res.status(404).json({ error: 'El aliado con el ID proporcionado no existe' });
        }

        // Obtener los apoyos
        const apoyos = await ApoyoModel.getApoyosByAliadoId(idAliado);
        
        return res.status(200).json(apoyos);
    } catch (error) {
        console.error('Error al obtener apoyos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Endpoint para validar un apoyo
app.put('/api/apoyos/validar/:idApoyo', async (req, res) => {
    try {
        const { idApoyo } = req.params;
        const result = await ApoyoModel.updateValidacionEstado(idApoyo);
        
        if (result) {
            res.json({ success: true, message: 'Apoyo validado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Apoyo no encontrado' });
        }
    } catch (error) {
        console.error('Error al validar apoyo:', error);
        res.status(500).json({ success: false, message: 'Error al validar el apoyo', error: error.message });
    }
});


// Enpoints de convenio 

//Registro de nuevo convenio
app.post('/api/convenioRegistrar', async (req, res) => {
    try {
        const { CCT, idAliado, categoria, firma_escuela, firma_aliado } = req.body;
        console.log('Received convenio registration request:', { CCT, idAliado, categoria, firma_escuela, firma_aliado });
        
        if (!CCT || !idAliado || !categoria) {
            console.log('Missing required fields:', { CCT, idAliado, categoria });
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        // Verify that the escuela exists
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            console.log('Escuela not found:', CCT);
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }

        // Verify that the aliado exists
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            console.log('Aliado not found:', idAliado);
            return res.status(404).json({ error: 'Aliado no encontrado' });
        }

        const idConvenio = await Convenio.create(
            CCT,
            idAliado,
            categoria,
            escuela.nombre,
            aliado.institucion,
            firma_escuela || false,
            firma_aliado || false
        );
        console.log('Convenio created successfully:', idConvenio);
        
        res.status(201).json({ idConvenio });
    } catch (error) {
        console.error('Error al crear convenio:', error);
        res.status(500).json({ error: 'Error al crear convenio', details: error.message });
    }
});

//Actualizar firma del aliado

app.put('/api/convenios/firma-aliado', async (req, res) => {
    try {
        const { CCT, idAliado, idConvenio } = req.body;
        console.log('Received firma aliado request:', { CCT, idAliado, idConvenio });
        
        if (!CCT || !idAliado || !idConvenio) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const success = await Convenio.updateFirmaAliado(CCT, idAliado, idConvenio);
        if (!success) {
            return res.status(404).json({ error: 'Convenio no encontrado' });
        }
        res.json({ message: 'Firma del aliado actualizada' });
    } catch (error) {
        console.error('Error al actualizar firma del aliado:', error);
        res.status(500).json({ error: 'Error al actualizar firma del aliado', details: error.message });
    }
});

//Actualizar firma de la escuela
app.put('/api/convenios/firma-escuela', async (req, res) => {
    try {
        const { CCT, idAliado, idConvenio } = req.body;
        console.log('Received firma escuela request:', { CCT, idAliado, idConvenio });
        
        if (!CCT || !idAliado || !idConvenio) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const success = await Convenio.updateFirmaEscuela(CCT, idAliado, idConvenio);
        if (!success) {
            return res.status(404).json({ error: 'Convenio no encontrado' });
        }
        res.json({ message: 'Firma de la escuela actualizada' });
    } catch (error) {
        console.error('Error al actualizar firma de la escuela:', error);
        res.status(500).json({ error: 'Error al actualizar firma de la escuela', details: error.message });
    }
});

//Actualizar validacion de admin
app.put('/api/convenios/validacion-admin', async (req, res) => {
    try {
        const { CCT, idAliado, idConvenio } = req.body;
        console.log('Received validacion admin request:', { CCT, idAliado, idConvenio });
        
        if (!CCT || !idAliado || !idConvenio) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const success = await Convenio.updateValidacionAdmin(CCT, idAliado, idConvenio);
        if (!success) {
            return res.status(404).json({ error: 'Convenio no encontrado' });
        }
        res.json({ message: 'Validación del administrador actualizada' });
    } catch (error) {
        console.error('Error al actualizar validación del administrador:', error);
        res.status(500).json({ error: 'Error al actualizar validación del administrador', details: error.message });
    }
});


// Endpoint para obtener todos los convenios
app.get('/api/convenioGetAll', async (req, res) => {
    try {
        const convenios = await Convenio.getAll();
        res.json(convenios);
    } catch (error) {
        console.error('Error al obtener todos los convenios:', error);
        res.status(500).json({ error: 'Error al obtener todos los convenios' });
    }
});

//obtener convenios por idAliado
app.get('/api/convenio/aliado/:idAliado', async (req, res) => {
    try {
        const { idAliado } = req.params;
        console.log('Fetching convenios for aliado:', idAliado);
        
        if (!idAliado) {
            console.log('Missing idAliado parameter');
            return res.status(400).json({ error: 'ID del aliado es requerido' });
        }

        // Verify aliado exists first
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            console.log('Aliado not found:', idAliado);
            return res.status(404).json({ error: 'Aliado no encontrado' });
        }

        console.log('Found aliado:', aliado.nombre);

        const convenios = await Convenio.getByAliado(idAliado);
        console.log('Raw convenios result:', convenios);
        
        if (!convenios || convenios.length === 0) {
            console.log('No convenios found for aliado:', idAliado);
            return res.status(404).json({ error: 'No se encontraron convenios para este aliado' });
        }

        console.log(`Found ${convenios.length} convenios for aliado:`, idAliado);
        res.json(convenios);
    } catch (error) {
        console.error('Error al obtener convenios del aliado:', error);
        res.status(500).json({ error: 'Error al obtener convenios del aliado', details: error.message });
    }
});

// Obtener convenios por CCT (escuela)
app.get('/api/convenio/escuela/:CCT', async (req, res) => {
    try {
        const { CCT } = req.params;
        if (!CCT) {
            return res.status(400).json({ error: 'CCT es requerido' });
        }

        // Verificar que la escuela existe
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }

        const convenios = await Convenio.getByCCT(CCT);
        if (!convenios || convenios.length === 0) {
            return res.status(404).json({ error: 'No se encontraron convenios para esta escuela' });
        }

        res.json(convenios);
    } catch (error) {
        console.error('Error al obtener convenios por escuela:', error);
        res.status(500).json({ error: 'Error al obtener convenios por escuela', details: error.message });
    }
});

// Obtener convenios no validados por admin
app.get('/api/convenios/no-validados', async (req, res) => {
    try {
        const convenios = await Convenio.getNoValidados();
        res.json(convenios);
    } catch (error) {
        console.error('Error al obtener convenios no validados:', error);
        res.status(500).json({ error: 'Error al obtener convenios no validados' });
    }
});

// Endpoint to get all schools with at least one necesidad in a given categoria
app.get('/api/escuela/categoria-necesidad/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        if (!categoria) {
            return res.status(400).json({ error: 'El campo categoria es obligatorio' });
        }
        // Get CCTs with at least one necesidad in this categoria
        const ccts = await NecesidadModel.getEscuelasByCategoriaNecesidad(categoria);
        if (!ccts.length) {
            return res.status(404).json({ error: 'No se encontraron escuelas con necesidades en esta categoría' });
        }
        // Get full school info for each CCT
        const escuelas = await Promise.all(ccts.map(cct => EscuelaModel.getEscuelaById(cct)));
        res.status(200).json(escuelas.filter(e => !!e));
    } catch (error) {
        console.error('Error al buscar escuelas por categoria de necesidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Puerto de escucha
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`);
})

// Nuevos endpoints de búsqueda de aliados
// Búsqueda por institución
app.get('/api/aliado/institucion/:institucion', async (req, res) => {
    try {
        const aliados = await AliadoModel.getByInstitucion(req.params.institucion);
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron aliados con esa institución' });
        }
        res.json(aliados);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Búsqueda por sector
app.get('/api/aliado/sector/:sector', async (req, res) => {
    try {
        const aliados = await AliadoModel.getBySector(req.params.sector);
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron aliados en ese sector' });
        }
        res.json(aliados);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Búsqueda por municipio
app.get('/api/aliado/municipio/:municipio', async (req, res) => {
    try {
        const aliados = await AliadoModel.getByMunicipio(req.params.municipio);
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron aliados en ese municipio' });
        }
        res.json(aliados);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Búsqueda por categoría de apoyo
app.get('/api/aliado/categoria-apoyo/:categoria', async (req, res) => {
    try {
        const aliados = await AliadoModel.getByCategoriaApoyo(req.params.categoria);
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron aliados con apoyos en esa categoría' });
        }
        res.json(aliados);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Endpoint to get schools with necesidades matching aliado's apoyos
app.get('/api/escuelas/matching-necesidades/:idAliado', async (req, res) => {
    try {
        const { idAliado } = req.params;
        
        if (!idAliado) {
            return res.status(400).json({ error: 'El ID del aliado es obligatorio' });
        }

        // Verify aliado exists
        const aliado = await AliadoModel.getAliadoById(idAliado);
        if (!aliado) {
            return res.status(404).json({ error: 'El aliado no existe' });
        }

        // Get matching schools
        const escuelas = await EscuelaModel.getEscuelasByMatchingNecesidades(idAliado);
        
        if (!escuelas || escuelas.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron escuelas con necesidades que coincidan con tus apoyos' 
            });
        }

        res.status(200).json({ 
            message: 'Escuelas encontradas exitosamente',
            escuelas: escuelas 
        });
    } catch (error) {
        console.error('Error al buscar escuelas con necesidades coincidentes:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            details: error.message 
        });
    }
});

// Endpoint to get aliados with apoyos matching escuela's necesidades
app.get('/api/aliados/matching-apoyos/:CCT', async (req, res) => {
    try {
        const { CCT } = req.params;
        
        if (!CCT) {
            return res.status(400).json({ error: 'El CCT de la escuela es obligatorio' });
        }

        // Verify escuela exists
        const escuela = await EscuelaModel.getEscuelaById(CCT);
        if (!escuela) {
            return res.status(404).json({ error: 'La escuela no existe' });
        }

        // Get matching aliados
        const aliados = await AliadoModel.getAliadosByMatchingApoyos(CCT);
        
        if (!aliados || aliados.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron aliados con apoyos que coincidan con tus necesidades' 
            });
        }

        res.status(200).json({ 
            message: 'Aliados encontrados exitosamente',
            aliados: aliados 
        });
    } catch (error) {
        console.error('Error al buscar aliados con apoyos coincidentes:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            details: error.message 
        });
    }
});

