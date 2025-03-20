// Rastreamento do formulário de contato
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': 'Contact Form'
    });
});

// Rastreamento do formulário de newsletter
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    gtag('event', 'newsletter_signup', {
        'event_category': 'Newsletter',
        'event_label': 'Newsletter Subscription'
    });
});

// Rastreamento de cliques em links sociais
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const network = link.getAttribute('href').includes('linkedin') ? 'LinkedIn' :
                       link.getAttribute('href').includes('github') ? 'GitHub' :
                       link.getAttribute('href').includes('twitter') ? 'Twitter' : 'Other';
        
        gtag('event', 'social_click', {
            'event_category': 'Social',
            'event_label': network
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Limpa o formulário
                    this.reset();
                    
                    // Mostra mensagem de sucesso
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    this.appendChild(successMessage);
                    
                    // Remove a mensagem após 5 segundos
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    throw new Error('Erro ao enviar mensagem');
                }
            } catch (error) {
                console.error('Erro:', error);
                
                // Mostra mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente.';
                this.appendChild(errorMessage);
                
                // Remove a mensagem após 5 segundos
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Simula o envio (você pode implementar a lógica real de newsletter aqui)
            setTimeout(() => {
                this.reset();
                submitButton.textContent = 'Inscrito!';
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                }, 2000);
                submitButton.disabled = false;
            }, 1000);
        });
    }
}); 