/**
 * EDUQUEST - Client JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Password match validation helper
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
        const passwordInput = document.querySelector('#password');
        const confirmInput = document.querySelector('#confirm_password');
        const matchError = document.querySelector('#password-match-error');

        const validatePasswords = () => {
            if (confirmInput.value && passwordInput.value !== confirmInput.value) {
                if (matchError) matchError.style.display = 'block';
                confirmInput.setCustomValidity('Password tidak cocok');
            } else {
                if (matchError) matchError.style.display = 'none';
                confirmInput.setCustomValidity('');
            }
        };

        passwordInput?.addEventListener('input', validatePasswords);
        confirmInput?.addEventListener('input', validatePasswords);
    }

    // Auto dismiss alert notices after 5 seconds
    const alerts = document.querySelectorAll('.alert-auto-dismiss');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});
