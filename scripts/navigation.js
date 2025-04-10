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