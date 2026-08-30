document.addEventListener('DOMContentLoaded', () => {
    const ar = document.documentElement.lang === 'ar';
    const messages = ar ? {
        sending: 'جارٍ الإرسال...', success: 'شكراً لك! تم إرسال رسالتك.',
        error: 'تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا عبر الهاتف أو البريد الإلكتروني.',
        preview: 'إرسال النموذج غير متاح في المعاينة المحلية. يرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني.',
        open: 'فتح القائمة', close: 'إغلاق القائمة'
    } : {
        sending: 'Sending...', success: 'Thank you! Your message has been sent.',
        error: 'An error occurred. Please try again.',
        preview: 'Form delivery is unavailable in the local preview. Please contact us by phone or email.',
        open: 'Open menu', close: 'Close menu'
    };
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const setMenu = open => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? messages.close : messages.open);
        nav.classList.toggle('is-open', open);
    };
    toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.getElementById(anchor.hash.slice(1));
            if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
    if (location.hash) document.querySelectorAll('.language-switcher a').forEach(a => { a.hash = location.hash; });
    const contactForm = document.getElementById('contactForm');
    if (ar) contactForm?.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('invalid', () => {
            field.setCustomValidity(field.validity.valueMissing ? 'يرجى تعبئة هذا الحقل.' : field.validity.typeMismatch ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.' : 'يرجى التحقق من البيانات المدخلة.');
        });
        field.addEventListener('input', () => field.setCustomValidity(''));
    });
    contactForm?.addEventListener('submit', async event => {
        event.preventDefault();
        const formMessage = document.getElementById('formMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = messages.sending;
        formMessage.style.display = 'none';
        try {
            const response = await fetch('/send_email.php', { method: 'POST', body: new FormData(contactForm) });
            const data = await response.json();
            const success = response.ok && data.status === 'success';
            formMessage.textContent = success ? messages.success : data.code === 'preview_unavailable' ? messages.preview : (ar ? messages.error : data.message || messages.error);
            formMessage.style.color = success ? '#25D366' : '#ff4444';
            if (success) contactForm.reset();
        } catch {
            formMessage.textContent = messages.error;
            formMessage.style.color = '#ff4444';
        } finally {
            formMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    });
});
