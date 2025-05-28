// security.js - Validación y sanitización del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const errorMessages = document.getElementById('error-messages');
    let currentCaptcha = '';
    // Generar CAPTCHA inicial
    generateCaptcha();

    // Botón para refrescar CAPTCHA
    const refreshCaptchaBtn = document.getElementById('refresh-captcha');
    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    }
    function generateCaptcha() {
        // Caracteres permitidos (excluyendo caracteres ambiguos como 0, O, 1, l, etc.)
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
        let captcha = '';
        
        // Generar cadena de 6 caracteres aleatorios
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        currentCaptcha = captcha;
        document.getElementById('captcha-text').textContent = captcha;
        
        // Aplicar transformación visual para dificultar lectura por bots
        const captchaElement = document.getElementById('captcha-text');
        captchaElement.style.letterSpacing = '2px';
        captchaElement.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
        captchaElement.style.fontSize = `${20 + Math.random() * 5}px`;
        captchaElement.style.color = `rgb(${Math.floor(Math.random() * 100)}, 
                                     ${Math.floor(Math.random() * 100)}, 
                                     ${Math.floor(Math.random() * 100)})`;
    }
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            errorMessages.innerHTML = '';
            errorMessages.style.display = 'none';

            // Validar campos
            const errors = validateForm();

            if (errors.length === 0) {
                // Sanitizar los datos antes de enviar
                const sanitizedData = sanitizeFormData();
                
                // Mostrar mensaje de "Enviando..."
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                // Crear un formulario temporal para enviar
                const formData = new FormData(this);
                // Agregar el destinatario fijo
                formData.append('_replyto', formData.get('email')); // Para que puedan responder
                formData.append('_subject', 'Nuevo mensaje del formulario de contacto');
                // Enviar los datos
                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Mostrar mensaje de éxito
                        alert('Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.');
                        this.reset();
                        } else {
                        throw new Error('Error en el envío');
                    }
                })
                
                // Regenerar CAPTCHA después de enviar
                generateCaptcha();
            } else {
                errorMessages.style.display = 'block';
                errors.forEach(error => {
                    const errorElement = document.createElement('p');
                    errorElement.textContent = error;
                    errorMessages.appendChild(errorElement);
                });
                // Regenerar CAPTCHA si hubo error
                generateCaptcha();
            }
        });
    }

    function validateForm() {
        const errors = [];
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const captchaInput = document.getElementById('captcha').value.trim();

        // Validar nombre
        if (!name) {
            errors.push('El nombre completo es obligatorio.');
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(name)) {
            errors.push('El nombre solo puede contener letras y espacios.');
        }

        // Validar email
        if (!email) {
            errors.push('El correo electrónico es obligatorio.');
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.push('Por favor, ingrese un correo electrónico válido.');
        }

        // Validar teléfono (opcional)
        if (phone && !/^[\d\s+-]+$/.test(phone)) {
            errors.push('El teléfono solo puede contener números, espacios y los caracteres + -');
        }

        // Validar asunto
        if (!subject) {
            errors.push('Por favor, seleccione un asunto.');
        }

        // Validar mensaje
        if (!message) {
            errors.push('El mensaje es obligatorio.');
        } else if (message.length > 1000) {
            errors.push('El mensaje no puede exceder los 1000 caracteres.');
        }
        // Validar CAPTCHA
        if (!captchaInput) {
            errors.push('Por favor, completa la verificación anti-spam.');
        } else if (captchaInput.toLowerCase() !== currentCaptcha.toLowerCase()) {
            errors.push('El texto de verificación no coincide. Por favor, inténtalo de nuevo.');
        }

        return errors;
    }

    function sanitizeFormData() {
        return {
            name: sanitizeInput(document.getElementById('name').value),
            email: sanitizeInput(document.getElementById('email').value),
            phone: sanitizeInput(document.getElementById('phone').value),
            subject: sanitizeInput(document.getElementById('subject').value),
            message: sanitizeInput(document.getElementById('message').value),
            newsletter: document.getElementById('newsletter').checked
        };
    }

    function sanitizeInput(input) {
        // Eliminar espacios en blanco al inicio y final
        let sanitized = input.trim();
        
        // Convertir caracteres especiales a entidades HTML
        sanitized = sanitized.replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;');
        
        // Eliminar scripts y etiquetas potencialmente peligrosas
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        return sanitized;
    }

    // Validación en tiempo real para campos sensibles
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
        });
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.value)) {
                this.setCustomValidity('Por favor, ingrese un correo electrónico válido.');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d\s+-]/g, '');
        });
    }
});