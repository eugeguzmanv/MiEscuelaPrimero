// Function to handle section visibility and menu active states
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').style.display = 'block';
    
    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if(item.textContent.toLowerCase() === sectionName) {
            item.classList.add('active');
        }
    });
}

// Initialize the page with Perfil section visible
document.addEventListener('DOMContentLoaded', function() {
    showSection('perfil');
}); 