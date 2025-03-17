document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }

        try {
            // Aqui você pode implementar a integração com seu serviço de newsletter
            // Por exemplo, usando Formspree, Mailchimp, etc.
            const response = await fetch('https://formspree.io/f/xvgkgbew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    subject: 'Nova inscrição na Newsletter',
                    message: `Novo inscrito na newsletter: ${email}`
                })
            });

            if (response.ok) {
                showMessage('Inscrição realizada com sucesso! Obrigado por se inscrever.', 'success');
                emailInput.value = '';
            } else {
                throw new Error('Erro ao processar inscrição');
            }
        } catch (error) {
            console.error('Erro na inscrição:', error);
            showMessage('Desculpe, ocorreu um erro ao processar sua inscrição. Tente novamente mais tarde.', 'error');
        }
    });
});

function showMessage(message, type) {
    const existingMessage = document.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}-message`;
    messageDiv.textContent = message;

    const form = document.getElementById('newsletter-form');
    form.parentNode.insertBefore(messageDiv, form);

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
} 