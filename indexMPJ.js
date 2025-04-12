//Documento para configurar el servidor y los métodos HTTP
const express = require('express');
const db = require('./db');
const app = express();
const port = 1000;
//Requeriremos TODOS los modelos que definimos en la carpeta models
const AdminModel = require('./models/mAdministrador.js');

app.use(express.static('public')); //Para poder servir archivos estáticos como HTML, CSS, JS, etc.
app.use(express.json()); //Para poder recibir datos en formato JSON en el body de las peticiones



//============ENPOINTS DE ADMINISTRADOR============//

//Endpoint de registro de administrador
app.post('/api/registroAdmin', async (req, res) => {
    try{
        const {nombre_admin, correo_admin, contrasena_admin} = req.body;

        //Validar que no sean campos vacíos
        if(!nombre_admin || !correo_admin || !contrasena_admin) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mpj\.com$/; //Expresión regular para validar el correo
        
        //Validar que el correo tenga el formato correcto (debe terminar en @mpj.com)
        if(!emailRegex.test(correo_admin)) {
            return res.status(400).json({ error: 'Datos no válidos' });
        }

        //Validar que el correo no exista en la base de datos
        const existingAdmin = await AdminModel.getAdminByMail(correo_admin);
        if(existingAdmin){
            return res.status(400).json({ error: 'El correo ya está registrado'});
        }

        //Registrar el nuevo administrador en la base de datos
        await AdminModel.createAdminName(nombre_admin);
        await AdminModel.createAdminMail(correo_admin);
        await AdminModel.createAdminPass(contrasena_admin);

        return res.status(201).json({ message: 'Administrador registrado exitosamente' });
    }catch(error) {
        console.error('Error al registrar administrador:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//============ENPOINTS DE REPRESENTANTE============//

//============ENPOINTS DE ESCUELA============//

//============ENPOINTS DE ALIADO============//

//============ENPOINTS DE NECESIDAD============//

//============ENPOINTS DE DIAGNOSTICO============//

//============ENPOINTS DE ALIADO============//

//============ENPOINTS DE APOYO============//

//============ENPOINTS DE ESCUELA_RECIBE_APOYO============//

//============ENPOINTS DE ALIADO_BRINDA_APOYO============//

//============ENPOINTS DE CRONOGRAMA============//

//============ENPOINTS DE ACTIVIDAD============//

//============ENPOINTS DE CHAT============//

//============ENPOINTS DE MENSAJES============//

//============ENPOINTS DE NOTIFICACION============//

//============ENPOINTS DE ALIADO_APOYA_ESCUELA============//

//============ENPOINTS DE PERSONA_MORAL============//

//============ENPOINTS DE ESCRITURA_PUBLICA============//

//============ENPOINTS DE CONSTANCIA_FISCAL============//

//============ENPOINTS DE APOYO_TIENE_EVIDENCIA============//

//============ENPOINTS DE NECESIDAD_TIENE_EVIDENCIA============//