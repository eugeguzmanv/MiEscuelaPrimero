//Documento para configurar el servidor y los métodos HTTP
const express = require('express');
const db = require('./db');
const app = express();
const { Client } = require('pg'); // Librería para conectarse a PostgreSQL
const port = 1000;
//Requeriremos TODOS los modelos que definimos en la carpeta models
const EscuelaModel = require('./models/mEscuela.js');
const AliadoModel = require('./models/mAliado.js');
const PersonaMoralModel = require('./models/mPersona_Moral.js');
const ConstanciaFiscalModel = require('./models/mConstancia_Fiscal.js');
const EscrituraPublicaModel = require('./models/mEscritura_Publica.js');
const NecesidadModel = require('./models/mNecesidad.js');
const DiagnosticoModel = require('./models/mDiagnostico.js');
const ApoyoModel = require('./models/mApoyo.js');
const AliadoBrindaApoyoModel = require('./models/mAliado_Brinda_Apoyo.js');
const AliadoApoyaEscuelaModel = require('./models/mAliado_Apoya_Escuela.js');
const ConvenioModel = require('./models/mConvenio.js');
const FirmarConvenioModel = require('./models/mFirmarConvenio.js');
const ActividadModel = require('./models/mActividad.js')

// Configuración de variables de entorno para mostrar los usuarios
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

//Rutas
const adminRouter = require('./rutas/admin.js');
const representanteRouter = require('./rutas/repre.js');
const escuelaRouter = require('./rutas/escuela.js');
const aliadoRouter = require('./rutas/aliado.js');
const CronogramaModel = require('./models/mCronograma.js');
app.use('/api/admin', adminRouter);
app.use('/api/representantes', representanteRouter);
app.use('/api/escuelas', escuelaRouter);
app.use('/api/aliados', aliadoRouter);



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

//...........................ENDPOINT TODO EN UNO PARA MOSTRAR ESCUELAS.........................
app.get('/api/escuelas/', async (req, res) => {
    try{
        // Llamar a la función del modelo para obtener las escuelas
        const escuelas = await EscuelaModel.getAllEscuelas();

        // Validar si no hay resultados
        if (escuelas.length === 0) {
            return res.status(404).json({ error: "No se encontraron escuelas" });
        }

        //Transforma los resultados de la BD a un formato más estructurado (sólo sirvió para verfiicar que sí se funcionaba en postman)
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

        const cambios = []; // Array para guardar y mostrar los cambios en el JSON para probar su funcionamiento en POSTMAN

    // Verifica si se ha proporcionado un nuevo nombre && verifica si el nuevo nombre es diferente al actual
    if (nuevoNombre && nuevoNombre !== escuelaActual.nombre) {
      await EscuelaModel.updateEscuelaName(CCT, nuevoNombre);
      cambios.push('nombre'); // Se añade el nuevo cambio de nombre al array
    }

    if (nuevaCalle && nuevaCalle !== escuelaActual.calle) {
      await EscuelaModel.updateEscuelaCalle(CCT, nuevaCalle);
      cambios.push('calle');
    }

    if (nuevaColonia && nuevaColonia !== escuelaActual.colonia) {
      await EscuelaModel.updateEscuelaColonia(CCT, nuevaColonia);
      cambios.push('colonia');
    }

    if (nuevoMunicipio && nuevoMunicipio !== escuelaActual.municipio) {
      await EscuelaModel.updateEscuelaMunicipio(CCT, nuevoMunicipio);
      cambios.push('municipio');
    }

    if (nuevoNumero && nuevoNumero !== escuelaActual.numero) {
        await EscuelaModel.updateEscuelaNumero(CCT, nuevoNumero);
        cambios.push('numero');
    }

    if ( 
      typeof nuevoNumeroAlumnos === 'number' && // Verifica que el tipo de que actualice sea un número
      nuevoNumeroAlumnos !== escuelaActual.numero_estudiantes
    ) {
      await EscuelaModel.updateEscuelaNumero_estudiantes(CCT, nuevoNumeroAlumnos);
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

    if (cambios.length === 0) { // Verifica si el array está vacío
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
    try{
        const {tipo, correo_electronico, nombre, contraseña, categoria_apoyo, CURP, institucion, calle, colonia, municipio, numero, descripcion} = req.body;

        //Validar que no sean campos vacíos
        if(!tipo || !correo_electronico || !nombre || !contraseña || !categoria_apoyo || !CURP || !institucion || !calle || !colonia || !municipio || !numero || !descripcion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }


        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(existingMail){
            return res.status(409).json({ error: 'El correo ya está registrado'});
        }

        //Validar que el CURP no exista
        const existingCURP = await AliadoModel.getAliadoByCURP(CURP);
        if(existingCURP){
            return res.status(409).json({ error: 'El CURP ya está registrado'});
        }

        //Creamos el Aliado
        await AliadoModel.createAliado({ tipo, correo_electronico, nombre, contraseña, categoria_apoyo, CURP, institucion, calle, colonia, municipio, numero, descripcion });

        return res.status(200).json({ message: 'Aliado registrado exitosamente. Pendiente de validación', nextStep: 'validar'});
    }catch(error){
        console.error('Error al registrar aliado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint de inicio de sesión de aliado
app.post('/api/login/aliados', async (req, res) => {
    try{
        const {correo_electronico, contraseña} = req.body;

        //Validar que no sean campos vacíos
        if(!correo_electronico || !contraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo no exista
        const existingMail = await AliadoModel.getAliadoByMail(correo_electronico);
        if(!existingMail){
            return res.status(404).json({ error: 'El correo no está registrado'});
        }

        // Verificar estado de validación
    if (existingMail.estado_validacion !== 'validado') {
        return res.status(403).json({ error: 'Tu cuenta aún no ha sido validada' });
      }

        //Validar que la contraseña sea correcta
        if(existingMail.contraseña !== contraseña){
            return res.status(400).json({ error: 'La contraseña es incorrecta'});
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
        const existingAliado = await AliadoModel.getAliadoByMuncipio(aliadoMunicipio);
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
    const trx = await knex.transaction(); // Se hace una transacción para que el perfil sólo se pueda actualizar en una misma página del front
    try {
        const {idAliado} = req.params;
        const {
            nuevoNombre, nuevoCorreo, nuevaContrasena, nuevaDescripcion, 
            nuevaInstitucion, nuevaDireccion,
            // Persona moral
            nuevaOrganizacion, nuevoProposito, nuevoGiro, nuevaWeb,
            // Constancia fiscal
            nuevoRFC, nuevoRegimen, nuevoDomicilioFiscal, nuevoRazonSocial,
            // Escritura pública
            nuevoNumeroEscritura, nuevoNotario, nuevoCiudad, nuevoFechaEscritura
        } = req.body;

        // Validar aliado existente
        const existingAliado = await AliadoModel.getAliadoById(idAliado);
        if(!existingAliado) {
            await trx.rollback(); // Si no existe el aliado, se revierte la transacción y no se hace ninguna actualización en otros campos
            return res.status(404).json({ error: 'Aliado no encontrado' });
        }

        const cambios = [];

        if(nuevoNombre && nuevoNombre !== existingAliado.nombre) {
            await AliadoModel.updateNombre(idAliado, nuevoNombre).transacting(trx);
            cambios.push('nombre');
        }

        if(nuevoCorreo && nuevoCorreo !== existingAliado.correo_electronico) {
            const correoExiste = await AliadoModel.getAliadoByMail(nuevoCorreo);
            if(correoExiste && correoExiste.idAliado !== idAliado) {
                await trx.rollback();
                return res.status(409).json({ error: 'Correo ya registrado' });
            }
            await AliadoModel.updateCorreo(idAliado, nuevoCorreo).transacting(trx);
            cambios.push('correo');
        }

        if(nuevoCorreo && nuevoCorreo !== existingAliado.correo_electronico) {
            const correoExiste = await AliadoModel.getAliadoByMail(nuevoCorreo);
            if(correoExiste && correoExiste.idAliado !== idAliado) {
                await trx.rollback();
                return res.status(409).json({ error: 'Correo ya registrado' });
            }
            await AliadoModel.updateCorreo(idAliado, nuevoCorreo).transacting(trx);
            cambios.push('correo');
        }

        if(nuevaContrasena && nuevaContrasena !== existingAliado.contraseña) {
            await AliadoModel.updateContrasena(idAliado, nuevaContrasena).transacting(trx);
            cambios.push('contrasena');
        }

        if(nuevaDescripcion && nuevaDescripcion !== existingAliado.descripcion) {
            await AliadoModel.updateDescripcion(idAliado, nuevaDescripcion).transacting(trx);   
            cambios.push('descripcion');
        }
        if(nuevaInstitucion && nuevaInstitucion !== existingAliado.institucion) {
            await AliadoModel.updateInstitucion(idAliado, nuevaInstitucion).transacting(trx);
            cambios.push('institucion');
        }
        if(nuevaDireccion && nuevaDireccion !== existingAliado.direccion) {
            await AliadoModel.updateDireccion(idAliado, nuevaDireccion).transacting(trx);
            cambios.push('direccion');
        }

        if(existingAliado.tipo === 'moral') {
            const personaMoral = await PersonaMoralModel.getByAliadoId(idAliado).transacting(trx);
            if(!personaMoral) {
                await trx.rollback();
                return res.status(404).json({ error: 'Registro de persona moral no encontrado' });
            }

            // Actualizar datos de Persona Moral
            if(nuevaOrganizacion || nuevoProposito || nuevoGiro || nuevaWeb) {
                await PersonaMoralModel.updateDatosGenerales(
                    personaMoral.idPersonaMoral, 
                    {
                        nombre_organizacion: nuevaOrganizacion || personaMoral.nombre_organizacion,
                        proposito: nuevoProposito || personaMoral.proposito,
                        giro: nuevoGiro || personaMoral.giro,
                        pagina_web: nuevaWeb || personaMoral.pagina_web
                    }
                ).transacting(trx);
                cambios.push('datos_organizacion');
            }

            // Actualizar Constancia Fiscal
            if(nuevoRFC || nuevoRegimen || nuevoDomicilioFiscal || nuevoRazonSocial) {
                const constancia = await ConstanciaFiscalModel.getByPersonaMoralId(personaMoral.idPersonaMoral).transacting(trx);
                if(constancia) {
                    await ConstanciaFiscalModel.updateDatosGenerales(
                        personaMoral.idPersonaMoral, // Cambiado para usar idPersonaMoral como filtro
                        {
                            RFC: nuevoRFC || constancia.RFC,
                            regimen: nuevoRegimen || constancia.regimen,
                            domicilio_fiscal: nuevoDomicilioFiscal || constancia.domicilio,
                            razon_social: nuevoRazonSocial || constancia.razon_social
                        }
                    ).transacting(trx);
                    cambios.push('constancia_fiscal');
                }
            }

            // Actualizar Escritura Pública
            if(nuevoNumeroEscritura || nuevoNotario || nuevoCiudad || nuevoFechaEscritura) {
                const escritura = await EscrituraPublicaModel.getByPersonaMoralId(personaMoral.idPersonaMoral).transacting(trx);
                if(escritura) {
                    await EscrituraPublicaModel.updateDatosGenerales(
                        personaMoral.idPersonaMoral, // Cambiado para usar idPersonaMoral como filtro
                        {
                            numero_escritura: nuevoNumeroEscritura || escritura.numero_escritura,
                            notario: nuevoNotario || escritura.notario,
                            ciudad: nuevoCiudad || escritura.ciudad,
                            fecha_escritura: nuevoFechaEscritura || escritura.fecha_escritura
                        }
                    ).transacting(trx);
                    cambios.push('escritura_publica');
                }
            }
        }

        if(cambios.length === 0) {
            await trx.rollback();
            return res.status(400).json({ error: 'No se realizaron cambios' });
        }

        await trx.commit(); // Confirmar la transacción si todo fue exitoso
        return res.status(200).json({ 
            message: 'Perfil actualizado exitosamente',
            cambios
        });

    } catch(error) {
        await trx.rollback(); // Revertir la transacción en caso de error y no se hace ninguna actualización
        console.error('Error al actualizar aliado:', error);
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
    
    try {
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
        console.error('Error en mostrar aliados:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await client.end();
    }
});

// Endpoint para mostrar todos los aliados
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
})

//============ENPOINTS DE NECESIDAD============//
// Endpoint para registrar necesidad en el diagnóstico
app.post('/api/escuelas/:CCT/diagnosticos/:idDiagnostico/necesidades', async (req, res) => {
    const { CCT, idDiagnostico } = req.params;
    const { categoria, descripcion, ponderacion, estatus } = req.body;

    try {
        if(!categoria || !descripcion || ponderacion === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar rango de ponderación de la necesidad
        if(typeof ponderacion !== 'number' || ponderacion < 1 || ponderacion > 10){
            return res.status(400).json({ error: 'La ponderación debe ser un número entre 1 y 10' });
        }
        // Verificar que la escuela exista
        const escuela = await db('Escuela').where({ CCT }).first();
        if (!escuela) {
            return res.status(404).json({ error: 'Escuela no encontrada' });
        }

        // Verificar que el diagnóstico exista
        const diagnostico = await db('Diagnostico').where({ idDiagnostico, CCT, estado: 'activo' }).first();
        if (!diagnostico) {
            return res.status(404).json({ error: 'Diagnóstico no encontrado' });
        }

        // Registrar la necesidad en la base de datos
        const [necesidad] = await NecesidadModel.createNecesidad({ idDiagnostico, ponderacion, descripcion,  estatus, categoria});

        return res.status(201).json({ message: 'Necesidad registrada exitosamente', 
            necesidad: {
                idNecesidad: necesidad.idNecesidad,
                categoria,
                descripcion,
                ponderacion
            }
         });
    } catch (error) {
        console.error('Error al registrar necesidad:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }


});

//Endpoint para mostrar necesidades de un diagnóstico
app.get('/api/admin/diagnosticos/:idDiagnostico/necesidades', async (req, res) => {
    const { idDiagnostico } = req.params;
    try {
        // Verificar que el diagnóstico exista
        const diagnostico = await db('Diagnostico').where({ idDiagnostico }).first();
        if (!diagnostico) {
            return res.status(404).json({ error: 'Diagnóstico no encontrado' });
        }

        // Obtener las necesidades del diagnóstico
        const necesidades = await NecesidadModel.getNecesidadesByDiagnosticoId(idDiagnostico);

        return res.status(200).json({ necesidades });
    }
    catch (error) {
        console.error('Error al obtener necesidades:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

//============ENPOINTS DE DIAGNOSTICO============//
//Endpoint para generar diagnóstico en la base de datos
app.get('/api/escuelas/:CCT/diagnostico/activo', async(req, res) => {
    const {CCT} = req.params; // Obtener el CCT de la escuela desde los parámetros de la consulta

    try{
        // Verificar que la escuela exista
        const escuela = await db('Escuela').where({CCT}).first();
        if(!escuela){
            return res.status(404).json({ error: 'Escuela no encontrada' });

        }
        // Verificar que el diagnóstico esté activo
        let diagnostico = await db('Diagnostico').where({CCT, estado: 'activo'}).first();

        // Si no existe un diagnóstico activo, crear uno nuevo
        if(!diagnostico){
            const [diagnostico] = await DiagnosticoModel.createDiagnostico({CCT});
            return res.status(201).json({ message: 'Diagnóstico creado exitosamente', diagnostico });
        }

    }catch(error){
        console.error('Error al obtener diagnóstico:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
        
    }

});

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
        await AliadoBrindaApoyoModel.createAliadoBrindaApoyo({ idAliado, idApoyo: apoyo.idApoyo });

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

})
// Endpoint para crear el convenio
app.post('/api/convenios', async (req, res) => {

    try {
        const [convenio] = await ConvenioModel.createConvenio();
        return res.status(201).json({ message: 'Convenio creado exitosamente', convenio });
    } catch (error) {
        console.error('Error al registrar convenio:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

})
// Endpoint para la firma de convenios

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

        // Validar que ya no exista una firma para esta combinacion
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
})

//============ENPOINTS DE ESCUELA_RECIBE_APOYO============//


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
// Endpoint para mostrar información del cronograma

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

})

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

        // Formatear las actividades para la respuesta en JSON
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


//============ENPOINTS DE CHAT============//

//============ENPOINTS DE CHAT_ALIADO_ESCUELA============//

//============ENPOINTS DE MENSAJES============//

//============ENPOINTS DE NOTIFICACION============//

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
        const formattedMatches = matches.map((match) => ({

            idMatch: match.idMatch,
            aliado: {
            idAliado: match.idAliado,
            nombre: match.nombre_aliado,
            correo: match.correo_aliado,
            institucion: match.aliado_institucion,
            categoria_apoyo: match.categoria_apoyo
        },
        escuela: {
            CCT: match.CCT,
            nombre: match.nombre_escuela,
            municipio: match.municipio,
            nivel_educativo: match.nivel_educativo
        }
        }));
        return res.status(200).json({message: 'Matches obtenidos exitosamente', matches: formattedMatches});

    }catch(error){
        console.error('Error al obtener la lista de matches:', error);
        return res.status(500).json({error: 'Error interno del servidor'});

    }
});

//============ENPOINTS DE PERSONA_MORAL============//

app.post('/api/aliado/:idAliado/registro/PersonaMoral', async (req, res) => {
    try{
        const {idAliado} = req.params;
        const {nombre_organizacion, proposito, giro, pagina_web} = req.body;

        //Validar que no sean campos vacíos
        if(!nombre_organizacion || !proposito || !giro || !pagina_web) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
         // Validar que el idAliado exista en la base de datos
         const existingAliado = await AliadoModel.getAliadoById(idAliado);
         if (!existingAliado) {
             return res.status(404).json({ error: 'El aliado no existe' });
         }

        //Registrar la nueva persona moral en la base de datos
        await PersonaMoralModel.createPersonaMoral({ idAliado, nombre_organizacion, proposito, giro, pagina_web });

        return res.status(201).json({ message: 'Persona moral registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar persona moral:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

//Endpoint para registrar la constancia fiscal de la persona moral
app.post('/api/PersonaMoral/:idPersonaMoral/registro/ConstanciaFiscal', async (req, res) => {
    try{
        const {idPersonaMoral} = req.params;
        const {RFC, regimen, domicilio, razon_social} = req.body;
        
        //Validar que no sean campos vacíos
        if(!RFC || !regimen || !domicilio || !razon_social) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Registrar la nueva constancia fiscal en la base de datos
        await ConstanciaFiscalModel.createConstanciaFiscal({ idPersonaMoral, RFC, regimen, domicilio, razon_social });

        return res.status(201).json({ message: 'Constancia fiscal registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar constancia fiscal:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Endpoint para registrar la escritura pública de la persona moral
app.post('/api/PersonaMoral/:idPersonaMoral/registro/EscrituraPublica', async (req, res) => {
    try{
        const {idPersonaMoral} = req.params;
        const {numero_escritura, notario, ciudad, fecha_escritura} = req.body;

        //Validar que no sean campos vacíos
        if(!numero_escritura || !notario || !ciudad || !fecha_escritura) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const existingEscritura = await EscrituraPublicaModel.getEscrituraPublicaByNumero(numero_escritura);
        if(existingEscritura){
            return res.status(409).json({ error: 'La escritura pública ya está registrada'});
        }

        //Registrar la nueva escritura pública en la base de datos
        await EscrituraPublicaModel.createEscrituraPublica({ idPersonaMoral, numero_escritura, notario, ciudad, fecha_escritura });

        return res.status(201).json({ message: 'Escritura pública registrada exitosamente' });
    }catch(error){
        console.error('Error al registrar escritura pública:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//Puerto de escucha
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`);
})

