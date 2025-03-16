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