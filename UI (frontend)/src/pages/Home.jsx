import React from 'react';
import Header from '../components/Header';
import '../styles/Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <div className="container">
      </div>
      <div className="content" id="description">
        <h2>¡Bienvenido, hagamos conexiones!</h2>
        <p>En Mexicanos Primero Jalisco trabajamos para que todos los niños y jóvenes de Jalisco tengan una educación de calidad.</p>
        <p>Mi Escuela Primero es una iniciativa que surgió en 2022 y comenzó a implementarse en el ciclo escolar 2023-2024, 
          con el fin de contribuir a la mejora de la educación en Jalisco. Su objetivo es mejorar el aprendizaje
          y la permanencia escolar de las y los estudiantes de escuelas públicas, atendiendo sus necesidades y creando vínculos de apoyo
          con diferentes aliados.
        </p>
        <p>El proyecto ha demostrado mejorar la calidad educativa y el bienestar de los estudiantes mediante la formación de docentes,
          familias, niñas y niños, así como a través de la provisión de material y recursos educativos. 
          Los resultados de Mi Escuela Primero han mostrado avances en el aprendizaje y una alta satisfacción entre directores y docentes.
          Este proyecto ha fortalecido el compromiso social con la educación y ha fomentado la inversión en la niñez como base para el futuro.
        </p>
        <section className="images">
          <div className="photo_MP">
            <img src="/images/mi_escuela.png" alt="Mi Escuela Primero" width="700px" />
            <img src="/images/mi_escuela2.png" alt="Mi Escuela Primero_2" width="530px" height="350px" />
          </div>
        </section>
      </div>
      <div id="sobre-nosotros">
        <h2>Sobre nosotros</h2>
        <p>En Mexicanos Primero Jalisco trabajamos para que todos los niños y jóvenes de Jalisco tengan una educación de calidad.</p>
        <img id="sobre_ellos" src="/images/secondary_image.jpg" alt="Imagen secundaria" />
        <p>Nuestro objetivo es brindar un espacio para que más escuelas de Jalisco logren hacer conexiones con aliados que estén dispuestos a contribuir a mejorar la educación, de manera que mantengan comunicación
          para la mejora y atención de sus necesidades y así cumplir la meta como organización de tener un alcance a 3 mil escuelas públicas del estado.</p>
        <h2 className="subheading_SN">¡Comencemos a crear conexiones!</h2>
      </div>
      <footer className="footer" id="contacto">
        <h3>Contacto</h3>
        <div className="footer-content">
          <img className="logotipo" src="/images/logo.png" alt="Logo" width="100px" />
          <table>
            <tbody>
              <tr>
                <td><b>Rosalba Gascón</b></td>
                <td><b>Ricardo Lamas</b></td>
                <td className="social_media">
                  <img className="icons" src="/images/web.png" alt="Web" />
                  <a href="https://mexicanosprimerojalisco.org/">https://mexicanosprimerojalisco.org/</a>
                </td>
              </tr>
              <tr>
                <td>Mi Escuela Primero</td>
                <td>Mi Escuela Primero</td>
                <td className="social_media">
                  <img className="icons" src="/images/facebook.png" alt="Facebook" />
                  <a href="#">@MexPrimJal</a>
                </td>
              </tr>
              <tr>
                <td>rgascon@mpj.org.mx</td>
                <td>ricardol@mpj.org.mx</td>
                <td className="social_media">
                  <img className="icons" src="/images/instagram.png" alt="Instagram" />
                  <a href="#">@mexicanosprimjal</a>
                </td>
              </tr>
              <tr>
                <td>33 1177 8783</td>
                <td>33 1177 2832</td>
                <td className="social_media">
                  <img className="icons" src="/images/x.png" alt="X" />
                  <a href="#">@Mexicanos1oJal</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="location">
          <img className="icons" src="/images/ubicacion.png" alt="Ubicación" />
          <p>C. Prado de los Cedros 1500, Cd del Sol, 45050 Zapopan, Jal.</p>
        </div>
      </footer>
    </>
  );
};

export default Home; 