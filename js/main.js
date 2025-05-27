// Funcionalidad común para todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Activar el enlace de la página actual en el menú de navegación
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Inicializar controles de accesibilidad
    initAccessibilityControls();
});

// Función para inicializar los controles de accesibilidad
function initAccessibilityControls() {
    // Cargar preferencias guardadas
    //loadAccessibilityPreferences();
}