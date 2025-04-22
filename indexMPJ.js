//Documento para configurar el servidor y los métodos HTTP
const express = require('express');
const db = require('./db');
const app = express();
const bcrypt = require('bcrypt'); // Librería para encriptar contraseñas
const nodemailer = require('nodemailer');
const { Client } = require('pg'); // Librería para conectarse a PostgreSQL
const port = 1000;
//Requeriremos TODOS los modelos que definimos en la carpeta models
const AdminModel = require('./models/mAdministrador.js');
const RepresentanteModel = require('./models/mRepresentante.js');
const EscuelaModel = require('./models/mEscuela.js');
const AliadoModel = require('./models/mAliado.js');
const PersonaMoralModel = require('./models/mPersona_Moral.js');
const knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '230504',
      database: 'mpj_db',
      port: 5432
    }
  });

app.use(express.static('public')); //Para poder servir archivos estáticos como HTML, CSS, JS, etc.
app.use(express.json()); //Para poder recibir datos en formato JSON en el body de las peticiones



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

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        //Registrar el nuevo administrador en la base de datos
        await AdminModel.createAdmin({ nombre, correo_electronico, contrasena: hashedPassword });

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
        if(!existingAdmin){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        //Validar que la contraseña sea correcta
        const passwordMatch = await bcrypt.compare(contrasena, existingAdmin.contrasena);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

        //Si todo es correcto, iniciar sesión
        return res.status(200).json({ message: 'Inicio de sesión exitoso', rol: 'admin'});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para actualizar datos del administrador
app.put('/api/admin/:idAdmin/perfil', async (req, res) => { 
    try{
        const idAdmin = req.params.id;
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
app.post('/api/admin/recuperar-contrasena', async (req, res) => {
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

    // Configuración del correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Mi Escuela Primero" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: 'Recuperación de contraseña - Mi Escuela Primero',
      html: `
        <h3>Hola ${admin.nombre},</h3>
        <p>Recibiste este correo porque solicitaste recuperar tus credenciales de acceso como administrador.</p>
        <p><strong>Correo registrado:</strong> ${admin.correo_electronico}</p>
        <p><strong>Contraseña registrada:</strong> ${contrasenaRecuperada}</p>
        <br>
        <p>Te recomendamos cambiar tu contraseña al iniciar sesión.</p>
      `
    });

        //Enviar un email para restablecer la contraseña
        return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});
//Endpoint para ver lista de necesidades
app.get('/api/admin/diagnosticos/necesidades', async (req, res) => {
    try{
        const {idDiagnostico, status, ponderacion, categoria} = req.query; //Recibimos los filtros por query string

        //Validación simple
        if(ponderacion && isNaN(Number(ponderacion))){
            return res.status(400).json({error: 'Parámetro "ponderacion" inválido'});
        }

        //Construir la consulta principal
        let query = db('Necesidad')
      .join('Diagnostico', 'Necesidad.idDiagnostico', 'Diagnostico.idDiagnostico')
      .select(
        'Necesidad.idNecesidad as id',
        'Necesidad.descripcion as descripcion_necesidad',
        'Necesidad.categoria',
        'Necesidad.ponderacion',
        'Necesidad.estado as estatus',
        'Escuela.CCT',
        'Escuela.nombre as nombre_escuela',
        'Escuela.calle',
        'Escuela.numero',
        'Escuela.colonia',
        'Escuela.municipio'
      );

      //Aplicar filtros si están presentes
      if(idDiagnostico) query.where('Necesidad.idDiagnostico', idDiagnostico);
      if(status) query.where('Necesidad.status', status);
      if(ponderacion) query.where('Necesidad.ponderacion', Number(ponderacion));
      if(categoria) query.where('Necesidad.categoria', categoria);


      const necesidades = await query;

      if(!necesidades.length){
        return res.status(404).json({error: 'No hay necesidades registradas'});
      }

      //Obtener evidencias por cada necesidad
        const necesidadesConEvidencias = await Promise.all(necesidades.map(async (necesidad) => {
            const evidencias = await db('Evidencia')
            .where({
                idNecesidad: necesidad.id,
                tipoReferencia: 'Necesidad'
            })
            .select('ruta', 'tipo_evidencia', 'nombre');
            return {
                id: necesidad.id,
                escuela:{
                    CCT: necesidad.CCT,
                    nombre: necesidad.nombre_escuela,
                    direccion:{
                        calle: necesidad.calle,
                        numero: necesidad.numero,
                        colonia: necesidad.colonia,
                        municipio: necesidad.municipio
                    }
                },
                descripcion_necesidad: necesidad.descripcion_necesidad,
                categoria: necesidad.categoria,
                ponderacion: necesidad.ponderacion,
                estatus: necesidad.estatus,
                evidencias: evidencias.map(e => ({ruta: e.ruta}))
            };
            
        })
    );

            res.status(200).json({necesidades: necesidadesConEvidencias});
            
        } catch(error){
            console.error('Error al obtener necesidades:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

//Endpoint para validar/rechazar necesidades
app.put('/api/admin/necesidades/:idNecesidad/validar', async (req, res) =>{
    const {id} = req.params;
    const {validado} = req.body; //validado: true o false

    // Validar que el campo validado esté presente y sea un booleano
    if(typeof validado !== 'boolean'){
        return res.status(400).json({error: 'Campo "status" inválido'});
    }

    try{
        // Buscar necesidad
        const necesidad = await knex('Necesidad').where({idNecesidad:id}).first();

        if(!necesidad){
            return res.status(404).json({error: 'Necesidad no encontrada'});
        }
        if(necesidad.status !== 'Pendiente'){
            return res.status(409).json({error: 'La necesidad ya fue validada/rechazada'});
        }

        //Determinar nuevo estado
        const nuevoEstado = validado ? 'Validada' : 'Rechazada';
        // Actualizar necesidad
        await knex('Necesidad').where({idNecesidad:id}).update({status: nuevoEstado});

        //Simulación de notificación al representante
        await knex('Notificacion').insert({
            tipo: 'necesidad_validada',
            contenido: `Tu necesidad ha sido ${nuevoEstado}`,
            idEntidad: id, // id de la necesidad
            entidad: 'Necesidad' // Tipo de entidad 

        });

        return res.status(200).json({
            message: `Necesidad ${nuevoEstado}`,
            necesidad: {
                id: parseInt(id),
                status: nuevoEstado
            }, 
            notificacionEnviada: true

        });
    } catch(error){
    console.error('Error al validar necesidad:', error);
    return res.status(500).json({ error: 'Error interno al procesar la validación' });

    }
})



//Endpoints para Validar escuelas y aliados






//============ENPOINTS DE REPRESENTANTE============//
//Endpoint de registro de representante
app.post('/api/registro/representante_escuela', async (req, res) => { 
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

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        //Registrar al Representante
        await RepresentanteModel.createRepresentante({ nombre, correo_electronico, contrasena: hashedPassword, numero_telefonico, CCT, rol, anios_experiencia, proximo_a_jubilarse, cambio_zona });

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
app.post('/api/login/representante_escuela', async (req, res) => {
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
        const passwordMatch = await bcrypt.compare(contrasena, existingMail.contrasena);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
    
        return res.status(200).json({ message: 'Inicio de sesión exitoso'});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de actualizar datos del Representante
app.put('/api/representantes/:idRepresentante', async (req, res) => {
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

        if(nuevoCorreo){
            const newEmail = await RepresentanteModel.getRepresentanteByMail(nuevoCorreo);
            if(newEmail?.idRepresentante !== undefined && newEmail.idRepresentante !== idRepresentante){
                return res.status(400).json({ error: 'El correo ya está registrado'});
            }
            await RepresentanteModel.updateRepresentanteMail(idRepresentante, nuevoCorreo); // Actualiza "correo_electronico"
        }

        if (nuevaContrasena) {
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
            await RepresentanteModel.updateRepresentantePass(idRepresentante, hashedPassword);
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
                id: parseInt(id),
                nombre: nuevoNombre,
                correo: nuevoCorreo,
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
app.post('/api/representantes/recuperar-contrasena', async (req, res) => { 
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

        const contrasenaOriginal = representante.contrasena;

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Enviar el correo
    await transporter.sendMail({
      from: `"Mi Escuela Primero" <${process.env.EMAIL_USER}>`,
      to: repr_correo,
      subject: 'Recuperación de contraseña - Mi Escuela Primero',
      html: `
        <h3>Hola ${representante.nombre},</h3>
        <p>Recibiste este correo porque solicitaste recuperar tu contraseña como representante escolar.</p>
        <p><strong>Correo registrado:</strong> ${repr_correo}</p>
        <p><strong>Contraseña registrada:</strong> ${contrasenaOriginal}</p>
        <br>
        <p>Te recomendamos actualizar tu contraseña desde tu perfil una vez que inicies sesión.</p>
      `
    });

        //Enviar un email para restablecer la contraseña
        return res.status(200).json({ message: 'Correo de recuperación enviado (revisa tu bandeja)'});
    }catch(error){
        console.error('Error al enviar correo para restablecer contraseña:', error);
        return res.status(500).json({error: 'Error al enviar el correo'});
    }
});

//============ENPOINTS DE ESCUELA============//
//Endpoint de registro de escuela
app.post('/api/escuela/registro', async (req, res) => { 
    try{
        const {CCT, nombre, modalidad, nivel_educativo, sector_escolar, sostenimiento, zona_escolar, calle, colonia, municipio, numero, control_administrativo, numero_estudiantes} = req.body;

        //Validar que no sean campos vacíos
        if(!CCT || !nombre || !modalidad || !nivel_educativo || !sector_escolar || !sostenimiento || !zona_escolar || !calle || !colonia || !municipio || !numero || !control_administrativo || !numero_estudiantes) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el CCT no exista en la base de datos
        const existingCCT = await EscuelaModel.getEscuelaById(CCT);
        if(existingCCT){
            return res.status(409).json({ error: 'El CCT ya está registrado'});
        }
        
        //Registrar la nueva escuela en la base de datos
        await EscuelaModel.createEscuela({ CCT, nombre, modalidad, nivel_educativo, sector_escolar, sostenimiento, zona_escolar, calle, colonia, municipio, numero, control_administrativo, numero_estudiantes });

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
        return res.status(200).json({ sector_escolar: existingEscuela.sector_escolar });
    }catch(error){
        console.error('Error al obtener escuela:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//...........................ENDPOINT TODO EN UNO PARA MOSTRAR ESCUELAS CON QUERY STRING Y USANDO FILTROS.........................
app.get('/api/escuelas/', async (req, res) => {
    //Validar que al menos un filtro esté presente
    const { nombre, municipio, nivel_educativo, sector_escolar, zona_escolar } = req.query;
    // Es parte de una configuración de conexión para conectarse a la base de datos de PostgreSQL
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'mpj_db',
        password: '230504',
        port: 5432,
    });
    try {
        await client.connect();
        //Construir query dinámica
        let query = `
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
                e."control_administrativo",
                e."numero_estudiantes",
                e."estado_validacion",
                e."comentario_admin",
                r."nombre" AS representante_nombre,
                r."correo_electronico" AS representante_correo
            FROM "Escuela" e
            LEFT JOIN "Representante" r ON e."CCT" = r."CCT"
            WHERE 1=1
        `;
        
        const params = []; //Crear un array para los parámetros de la query
        let index = 1; //Contador para los parámetros de la consulta
        // Añadir filtros dinámicos
        if (nombre) {
            query += ` AND e.nombre ILIKE $${index++}`;
            params.push(`%${nombre}%`);//Búsqueda parcial o coincidencias parciales
        }
        if (municipio) {
            query += ` AND e.municipio = $${index++}`;
            params.push(municipio);
        }
        if (nivel_educativo) {
            query += ` AND e.nivel_educativo = $${index++}`;
            params.push(nivel_educativo);
        }
        if (sector_escolar) {
            query += ` AND e.sector_escolar = $${index++}`;
            params.push(sector_escolar);
        }
        if (zona_escolar) {
            query += ` AND e.zona_escolar = $${index++}`;
            params.push(zona_escolar);
        }
        

        //Ejecutar consulta
        const result = await client.query(query, params);

        //Formatear respuesta (dar formato a los resultados)
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron escuelas" });
        }

        //Transforma los resultados de la BD a un formato más estructurado
        const formattedEscuelas = result.rows.map(escuela => ({
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
    }finally {
        await client.end(); // Asegura cerrar la conexión
    }
});


//Endpoint para actualizar datos de la escuela
app.put('/api/escuelas/:CCT/perfil', async (req, res) => {
    const {CCT} = req.params;
    const {nuevoNombre, nuevaCalle, nuevoNumero, nuevaColonia, nuevoMunicipio,  nuevoNumeroAlumnos, nuevoNivel, nuevaModalidad } = req.body;

    try {
        // Verificar que la escuela exista
        const escuelaActual = await knex('Escuela').where({ CCT }).first();
        if (!escuelaActual) {
          return res.status(409).json({ error: 'La clave no está registrada' });
        }

        const cambios = [];


    if (nuevoNombre && nuevoNombre !== escuelaActual.nombre) {
      await EscuelaModel.updateEscuelaName(CCT, nuevoNombre);
      cambios.push('nombre');
    }

    if (nuevaCalle && nuevaCalle !== escuelaActual.calle) {
      await EscuelaModel.updateEscuelaCalle(CCT, nuevaCalle);
      cambios.push('calle');
    }

    if (nuevaColonia && colonia !== escuelaActual.colonia) {
      await EscuelaModel.updateEscuelaColonia(CCT, colonia);
      cambios.push('colonia');
    }

    if (nuevoMunicipio && nuevoMunicipio !== escuelaActual.municipio) {
      await EscuelaModel.updateEscuelaMunicipio(CCT, municipio);
      cambios.push('municipio');
    }

    if (nuevoNumero && nuevoNumero !== escuelaActual.numero) {
      await db('Escuela').where({ CCT }).updateEscuelaNumero({ numero });
      cambios.push('numero');
    }

    if (
      typeof nuevoNumeroAlumnos === 'number' &&
      nuevoNumeroAlumnos !== escuelaActual.numero_estudiantes
    ) {
      await EscuelaModel.updateEscuelaNumero_estudiantes(CCT, numero_estudiantes);
      cambios.push('numero_estudiantes');
    }

    if (nuevoNivel && nuevoNivel !== escuelaActual.nivel_educativo) {
        await EscuelaModel.updateEscuelaNivel_educativo(CCT, nuevoNivel);
        cambios.push('nivel_educativo');
      }
  
      if (nuevaModalidad && nuevaModalidad !== escuelaActual.modalidad) {
        await EscuelaModel.updateEscuelaModalidad(CCT, nuevaModalidad);
        cambios.push('modalidad');
      }

    if (cambios.length === 0) {
      return res.status(400).json({ error: 'Datos de actualización inválidos o sin cambios' });
    }

    return res.status(200).json({
      message: 'Información actualizada exitosamente',
      cambios
    });

  } catch (error) {
    console.error('Error al actualizar datos de la escuela:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
})


//============ENPOINTS DE ALIADO============//
//Endpoint de registro de aliado
app.post('/api/aliados/registro', async (req, res) => {
    const trx = await knex.transaction();
    try {
        const {
            tipo,
            nombre,
            correo_electronico,
            contraseña,
            categoria_apoyo,
            descripcion,
            calle,
            numero,
            colonia,
            municipio,
            CURP,
            institucion,
            // Información de persona moral
            nombre_organizacion,
            proposito,
            giro,
            pagina_web,
            constancia_fiscal,
            escrituraPublica
          } = req.body;

        // Validación de campos obligatorios
        if (!tipo || !nombre || !correo_electronico || !contraseña || !categoria_apoyo || !descripcion ||
            !curp || !institucion || !calle || !colonia || !municipio || numero === undefined) {
            await trx.rollback();
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validación del tipo
        if (tipo !== 'física' && tipo !== 'moral') {
            await trx.rollback();
            return res.status(400).json({ error: 'Tipo de aliado inválido' });
        }

        // Validar CURP única
        const existingCURP = await trx('Aliado').where({ CURP }).first();
        if (existingCURP) {
            await trx.rollback();
            return res.status(409).json({ error: 'La CURP ya está registrada' });
        }

        // Validar correo único
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if (existingMail) {
            await trx.rollback();
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        // Hashear contraseña
        const hashedPass = await bcrypt.hash(contraseña, 10);

        // Insertar en Aliado
        const [aliado] = await trx('Aliado').insert({
            tipo,
            nombre,
            correo_electronico,
            contraseña: hashedPass,
            categoria_apoyo,
            descripcion,
            CURP,
            institucion,
            calle,
            numero,
            colonia,
            municipio,
            estado_validacion: 'pendiente'
        }, ['idAliado']);

        // Insertar los datos adicionales si es persona moral
    if (tipo === 'moral') {
        if (!nombre_organizacion || !proposito || !giro || !pagina_web ||
            !constancia_fiscal || !escrituraPublica ||
            !constancia_fiscal.RFC || !constancia_fiscal.regimen || !constancia_fiscal.domicilio || !constancia_fiscal.razon_social ||
            !escrituraPublica.numero_escritura || !escrituraPublica.notario || !escrituraPublica.ciudad || !escrituraPublica.fecha_escritura) {
            await trx.rollback();
            return res.status(400).json({ error: 'Faltan datos requeridos para persona moral' });
        }
        // Insertar datos en la tabla Persona_Moral
        const [personaMoral] = await trx('Persona_Moral').insert({
          idAliado: aliado.idAliado,
          nombre_organizacion,
          proposito,
          giro,
          pagina_web
        }, ['idPersonaMoral']);
        

        const idPersonaMoral = personaMoral.idPersonaMoral;

        // Insertar datos en la tabla Constancia_Fiscal
        await trx('Constancia_Fiscal').insert({
          idPersonaMoral: idPersonaMoral,
          RFC: constancia_fiscal.RFC,
          regimen: constancia_fiscal.regimen,
          domicilio: constancia_fiscal.domicilio,
          razon_social: constancia_fiscal.razon_social
        });
   
        // Insertar datos en la tabla Escritura_Publica
        await trx('Escritura_Publica').insert({
          idPersonaMoral: idPersonaMoral,
          numero_escritura: escrituraPublica.numero_escritura,
          notario: escrituraPublica.notario,
          ciudad: escrituraPublica.ciudad,
          fecha_escritura: escrituraPublica.fecha_escritura
        });
      }  

        await trx.commit();
        return res.status(201).json({
            message: 'Aliado registrado exitosamente. Pendiente de validación',
            nextStep: 'validacion_documentos',
            idAliado: aliado.idAliado
        });

    } catch (error) {
        await trx.rollback();
        console.error('Error al registrar aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//Endpoint de inicio de sesión de aliado
app.post('/api/login/aliados', async (req, res) => {
    try{
        const {correo_electronico, contrasena} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(!existingMail){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        // Verificar estado de validación
    if (aliado.estado_validacion !== 'validado') {
        return res.status(403).json({ error: 'Tu cuenta aún no ha sido validada' });
      }

        //Validar que la contraseña sea correcta
        const contrasenaValida = await bcrypt.compare(contrasena, aliado.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

        return res.status(200).json({ message: 'Inicio de sesión exitoso',
             rol: 'aliado'
        });
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para ver el catálogo de aliados por institución (UTILIZAMOS QUERY-STRING)
app.get('/api/aliado/:institucion', async (req, res) => {
    try{
        const aliadoInstitucion = req.params.institucion.trim();

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
app.get('/api/aliado/:municipio', async (req, res) => {
    try{
        const aliadoMunicipio = req.params.municipio.trim();

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
app.get('/api/aliado/:correo_electronico', async (req, res) => {
    try{
        const aliadoMail = req.params.correo_electronico.trim();

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
app.get('/api/aliado/:CURP', async (req, res) => {
    try{
        const aliadoCURP = req.params.CURP.trim();

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
app.put('/api/aliados/:idAliado/perfil', async (req, res) => {
    try{
        const {idAliado} = req.params;
        const {
            nuevoNombre,
            nuevoCorreo,
            nuevaContrasena,
            nuevaDescripcion,
            nuevaInstitucion,
            nuevaCurp,
            nuevaDireccion,
            // Datos de persona moral (si aplica)
            nuevaOrganizacion,
            nuevoProposito,
            nuevoGiro,
            nuevaWeb
          } = req.body;
        
        //Validar que existe el representante
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado){
            return res.status(404).json({ error: 'Aliado no encontrado'});
        }

        const cambios = [];

        if(nuevoCorreo && nuevoCorreo !== existingAliado.correo_electronico){
            const correoExiste = await AliadoModel.getAliadoByMail(nuevoCorreo);
            if(correoExiste && correoExiste.idAliado !== existingAliado.idAliado){
                return res.status(409).json({ error: 'El correo ya está registrado'});
            }
            await AliadoModel.updateAliadoMail(idAliado, nuevoCorreo); // Actualiza "correo_electronico"
            cambios.push('correo_electronico');
        }

        //Actualizaremos nombre
        if(nuevoNombre && nuevoNombre !== existingAliado.nombre){
            await AliadoModel.updateAliadoName(idAliado, nuevoNombre) // Actualiza "nombre"
            cambios.push('nombre');
        }

        if(nuevaContrasena){
            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
            await AliadoModel.updateAliadoPass(idAliado, hashedPassword); // Actualiza "contrasena"
            cambios.push('contrasena');
        }

        if(nuevaDescripcion && nuevaDescripcion !== existingAliado.descripcion){
            await AliadoModel.updateDescripcion(idAliado, nuevaDescripcion); // Actualiza "descripcion"
            cambios.push('descripcion');
        }

        if(nuevaDireccion){
            await AliadoModel.updateDireccion(idAliado, nuevaDireccion); // Actualiza "direccion"
            cambios.push('direccion');
        }

        // Persona física
        if(existingAliado.tipo === 'física'){
            if(nuevaInstitucion && nuevaInstitucion !== existingAliado.institucion){
                await AliadoModel.updateInstitucion(idAliado, nuevaInstitucion); // Actualiza "institucion"
                cambios.push('institucion');
            }

            if(nuevaCurp && nuevaCurp !== existingAliado.curp){
                const curpExiste = await AliadoModel.getAliadoByCURP(nuevaCurp);
                if(curpExiste && curpExiste.idAliado !== existingAliado.idAliado){
                    return res.status(400).json({ error: 'La CURP ya está registrada'});
                }
                await AliadoModel.updateAliadoCURP(idAliado, nuevaCurp); // Actualiza "curp"
                cambios.push('curp');
            }
        }

        // Persona moral
    if (existingAliado.tipo === 'moral') {

        const personaMoral = await PersonaMoralModel.getByAliadoId(idAliado);
      if (!personaMoral) {
        return res.status(404).json({ error: 'Registro de Persona Moral no encontrado' });
      }
        const idPersonaMoral = personaMoral.idPersonaMoral;
        if (nuevaOrganizacion || nuevoProposito || nuevoGiro || nuevaWeb) {
          await PersonaMoralModel.updatePersonaMoral(idPersonaMoral, {
            nombre_organizacion: nuevaOrganizacion,
            proposito: nuevoProposito,
            giro: nuevoGiro,
            pagina_web: nuevaWeb
          });
          cambios.push('persona_moral');
        }
    }

        return res.status(200).json({ message: 'Perfil actualizado exitosamente' });
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

//...........................ENDPOINT TODO EN UNO PARA MOSTRAR ALIADOS CON QUERY STRING Y USANDO FILTROS.........................
app.get('/api/catalogo/aliados', async (req, res) => {
    const { categoria_apoyo, municipio, tipo_persona } = req.query;

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'mpj_db',
        password: '230504',
        port: 5432,
    });

    try {
        await client.connect();

        let query = `
            SELECT 
                a."idAliado",
                a."nombre",
                a.tipo AS tipo_persona,
                a.correo_electronico AS correo,
                a.contraseña,
                a.categoria_apoyo,
                a.descripcion,
                a."CURP",
                a.institucion,
                a.calle,
                a.numero,
                a.colonia,
                a.municipio,
                -- Persona moral
                pm.nombre_organizacion,
                pm.proposito,
                pm.giro,
                pm.pagina_web,
                cf."RFC",
                cf.regimen,
                cf.domicilio AS domicilio_fiscal,
                cf.razon_social,
                ep.numero_escritura,
                ep.notario,
                ep.ciudad,
                ep.fecha_escritura
            FROM "Aliado" a
LEFT JOIN "Persona_Moral" pm ON a."idAliado" = pm."idAliado"
LEFT JOIN "Constancia_Fiscal" cf ON pm."idPersonaMoral" = cf."idPersonaMoral"
LEFT JOIN "Escritura_Publica" ep ON pm."idPersonaMoral" = ep."idPersonaMoral"
WHERE 1=1
        `;

        const params = [];
        let index = 1;

        if (categoria_apoyo) {
            query += ` AND a.categoria_apoyo = $${index++}`;
            params.push(categoria_apoyo);
        }

        if (municipio) {
            query += ` AND a.municipio = $${index++}`;
            params.push(municipio);
        }

        if (tipo_persona) {
            query += ` AND a.tipo = $${index++}`;
            params.push(tipo_persona);
        }

        const result = await client.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron aliados" });
        }

        const aliados = result.rows.map(a => ({
            id: a.idAliado,
            nombre: a.nombre,
            tipo: a.tipo,
            correo: a.correo_electronico,
            contrasena: a.contraseña,
            categoria_apoyo: a.categoria_apoyo,
            descripcion: a.descripcion,
            direccion: {
                calle: a.calle,
                numero: a.numero,
                colonia: a.colonia,
                municipio: a.municipio
            },
            curp: a.CURP,
            institucion: a.institucion,
            ...(a.tipo === 'moral' && {
                nombre_organización: pm.nombre_organizacion,
                proposito: pm.proposito,
                giro: pm.giro,
                pagina_web: pm.pagina_web,
                constancia_fiscal: {
                    rfc: cf.RFC,
                    regimen: cf.regimen,
                    domicilio_fiscal: cf.domicilio,
                    razon_social: cf.razon_social
                },
                escrituraPublica: {
                    numero: ep.numero_escritura,
                    notario: ep.notario,
                    ciudad: ep.ciudad,
                    fecha: ep.fecha_escritura
                }
            })
        }));

        res.status(200).json({ aliados });

    } catch (error) {
        console.error('Error en /api/catalogo/aliados:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await client.end();
    }
});


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

//============ENPOINTS DE ESCRITURA_PUBLICA============//

//============ENPOINTS DE CONSTANCIA_FISCAL============//

//============NECESIDAD============//

//Puerto de escucha
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`);
})
//============NECESIDAD============//
