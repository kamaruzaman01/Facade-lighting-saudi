document.addEventListener('DOMContentLoaded', () => {
    console.log('Lumina Facade website loaded.');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formMessage = document.getElementById('formMessage');
            const submitBtn = this.querySelector('button[type="submit"]');

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.style.display = 'none';

            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    formMessage.style.display = 'block';
                    formMessage.textContent = data.message;

                    if (data.status === 'success') {
                        formMessage.style.color = '#25D366'; // Success green
                        contactForm.reset();
                    } else {
                        formMessage.style.color = '#ff4444'; // Error red
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    formMessage.style.display = 'block';
                    formMessage.textContent = 'An error occurred. Please try again.';
                    formMessage.style.color = '#ff4444';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Request';
                });
        });
    }
});
