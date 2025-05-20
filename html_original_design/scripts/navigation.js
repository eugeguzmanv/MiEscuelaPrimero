// Función para guardar el perfil seleccionado en localStorage
function seleccionarPerfil(perfil) {
    // Sobrescribir el perfil seleccionado en localStorage
    localStorage.setItem('perfilSeleccionado', perfil);
    // Redirigir al usuario a la página de registro de usuario
    window.location.href = "registroUsuario.html";
}

// Función para redirigir según el perfil seleccionado
function redirigirSegunPerfil() {
    // Obtener el perfil seleccionado desde localStorage
    const perfilSeleccionado = localStorage.getItem('perfilSeleccionado');
    if (perfilSeleccionado) {
        // Redirigir a la página correspondiente
        window.location.href = `${perfilSeleccionado}.html`;
    } else {
        alert("No se seleccionó un perfil. Por favor, regresa a elegir perfil.");
        window.location.href = "elegir_perfil.html";
    }
}

// Función para guardar el tipo de aliado seleccionado
function seleccionarTipoAliado(tipo) {
    // Guardar el tipo de aliado en localStorage
    localStorage.setItem('tipoAliado', tipo);
    // Redirigir a la página de registroAliado
    window.location.href = "registroAliado.html";
}

// Función para finalizar el registro del aliado
function finalizarRegistroAliado() {
    // Obtener el tipo de aliado desde localStorage
    const tipoAliado = localStorage.getItem('tipoAliado');

    if (tipoAliado === 'fisica') {
        // Si es Persona Física, redirigir directamente a mainAliado.html
        window.location.href = "mainAliado.html";
    } else if (tipoAliado === 'moral') {
        // Si es Persona Moral, redirigir primero a registroAliadoPM.html y luego a mainAliado.html
        window.location.href = "registroAliadoPM.html";
    } else {
        // Si no se seleccionó un tipo, mostrar un mensaje de error
        alert("Por favor, selecciona un tipo de aliado.");
        window.location.href = "opcionesRegistroAliado.html";
    }
}

// Función para redirigir a la página de inicio de sesión
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector("button[type='submit']");

    if (loginButton) {
        loginButton.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que el formulario se envíe automáticamente

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Validar las credenciales y redireccionar según corresponda
            if (email === "escuela@gmail.com" && password === "escuela") {
                window.location.href = "ESCUELA/mainEscuela.html";
            } else if (email === "aliado@gmail.com" && password === "aliado") {
                window.location.href = "ALIADO/mainAliado.html";
            } else if (email === "admin@mpj.org.mx" && password === "admin") {
                window.location.href = "ADMIN/mainAdmin.html";
            } else {
                alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            }
        });
    }
});