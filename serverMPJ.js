//Documento del servidor, de forma más simplificada
const express = require('express');
const db = require('./db');
const app = express();
const port = 2000;

app.use(express.static('public')); //Para poder servir archivos estáticos como HTML, CSS, JS, etc.
app.use(express.json()); //Para poder recibir datos en formato JSON en el body de las peticiones

//Rutas
const adminRouter = require('./rutas/admin.js'); //Importar las rutas del administrador
const repreRouter = require('./rutas/repre.js'); //Importar las rutas del representante
const escuelaRouter = require('./rutas/escuela.js'); //Importar las rutas de la escuela
const aliadoRouter = require('./rutas/aliado.js'); //Importar las rutas del aliado
const personaMoralRouter = require('./rutas/personaMoral.js'); //Importar las rutas de la persona moral
const escrituraPublicaRouter = require('./rutas/escrituraPublica.js'); //Importar las rutas de la escritura pública
const constanciaFiscalRouter = require('./rutas/constanciaFiscal.js'); //Importar las rutas de la constancia fiscal


app.use('/api/admin', adminRouter); //Usar las rutas del administrador en la ruta /admin
app.use('/api/representante', repreRouter ); //Usar las rutas del representante en la ruta /repre
app.use('/api/escuela', escuelaRouter ); //Usar las rutas de la escuela en la ruta /escuela
app.use('/api/aliado', aliadoRouter ); //Usar las rutas del aliado en la ruta /aliado
app.use('/api/personaMoral', personaMoralRouter ); //Usar las rutas de la persona moral en la ruta /personaMoral
app.use('/api/escrituraPublica', escrituraPublicaRouter ); //Usar las rutas de la escritura pública en la ruta /escrituraPublica
app.use('/api/constanciaFiscal', constanciaFiscalRouter ); //Usar las rutas de la constancia fiscal en la ruta /constanciaFiscal


//Puerto de escucha
app.listen(port, () =>{
    console.log(`Servidor en http://localhost:${port}`);
})