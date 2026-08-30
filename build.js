// Build crawlable HTML in both languages; run with `bun run build.js`.
import { mkdir } from 'node:fs/promises';
const source = await Bun.file('templates/home.html').text();
const origin = new URL(process.env.SITE_URL || 'http://localhost:3000').origin;
const translations = {
  '.hero-content h1': 'خدمات إضاءة الواجهات بتقنية LED في المملكة العربية السعودية',
  '.hero-content > p': 'حلول متخصصة لإضاءة الواجهات بتقنية LED من ترينيتي ستار لحلول الطاقة البيئية',
  '.hero-btns a': ['احصل على استشارة', 'استعرض مشاريعنا'],
  '#about h2': 'خبراتنا',
  '.about-content p': [
    'تُعد ستار لإضاءة الواجهات من الشركات الرائدة في تقديم حلول متخصصة لإضاءة الواجهات بتقنية LED، ونعمل على إبراز جمال المباني وحضورها المعماري في أنحاء الشرق الأوسط، بما في ذلك دولة الإمارات العربية المتحدة والمملكة العربية السعودية.',
    'نقدم خدماتنا حصرياً من خلال <strong>ترينيتي ستار لحلول الطاقة البيئية</strong>، ونجمع بين التصميم المبتكر وتقنيات LED الموفرة للطاقة. من أفق دبي النابض بالحياة إلى المشهد المعماري المتنامي في الرياض، نطور حلولاً مخصصة لإضاءة الواجهات تمنح المباني حضوراً بصرياً مميزاً.'
  ],
  '#services h2': 'خدماتنا',
  '.service-card h3': ['التصميم', 'التوريد', 'التركيب', 'عقود الصيانة السنوية'],
  '.service-card p': [
    'تصميم متكامل للإضاءة يشمل التصور ثلاثي الأبعاد، والتحليل الضوئي، وإعداد المخططات الفنية لتحويل الأفكار إلى واقع.',
    'توريد مباشر لوحدات إضاءة LED عالية الجودة، بتصنيفات حماية IP مناسبة، وأنظمة تحكم تضمن الجودة والعمر التشغيلي الطويل لكل مشروع.',
    'تنفيذ احترافي في الموقع على أيدي فرق معتمدة، مع الالتزام بالسلامة والدقة والتكامل السلس مع العناصر المعمارية.',
    'عقود صيانة سنوية للحفاظ على كفاءة أنظمة الإضاءة، تشمل الفحص الدوري والتنظيف وتحديث البرمجيات.'
  ],
  '#projects h2': 'مشاريعنا المميزة',
  '.project-info h3': ['فندق كمبينسكي', 'فندق شيراتون مول الإمارات', 'فندق جي دبليو ماريوت ماركيز'],
  '.project-info .location': 'دبي، الإمارات العربية المتحدة',
  '.project-info .desc': [
    'إضاءة معمارية راقية تُبرز التفاصيل الكلاسيكية للواجهة.',
    'إضاءة رأسية ديناميكية تُبرز حضور البرج وتفرده المعماري.',
    'إضاءة مميزة للبرجين التوأمين تمنحهما حضوراً بارزاً في أفق دبي.'
  ],
  '#why-us h2': 'لماذا تختار ستار لإضاءة الواجهات؟',
  '.feature-item h3': ['خبرة متخصصة', 'تصميم مبتكر', 'خدمات متكاملة'],
  '.feature-item p': [
    'بدعم من ترينيتي ستار لحلول الطاقة البيئية، نقدم حلولاً هندسية عالية الجودة تراعي الاستدامة.',
    'نبتكر مشاهد إضاءة ليلية تحول المباني إلى معالم فنية بارزة في أفق المدينة.',
    'نرافق مشروعك من التصميم المبدئي إلى التوريد والتركيب والصيانة المستمرة.'
  ],
  '.seo-content h2': ['شركة رائدة في إضاءة الواجهات<br>في المملكة العربية السعودية', 'الإضاءة الخارجية والمعمارية<br>في المملكة العربية السعودية'],
  '.seo-content p': [
    'تؤدي إضاءة الواجهات في المملكة العربية السعودية دوراً أساسياً في إبراز العمارة الحديثة والهوية الحضرية. ومع التطور المتسارع في الرياض وجدة والدمام ونيوم، تسهم الإضاءة المعمارية عالية الجودة في تعزيز جمال المباني والمعالم والمساحات العامة، وتمنحها حضوراً بصرياً مؤثراً.',
    'نقدم <a href="/ar/services">حلولاً احترافية لإضاءة الواجهات في المملكة العربية السعودية</a> تجمع بين الإبداع والتقنية ومراعاة الهوية الثقافية. تُبرز تصاميمنا التفاصيل المعمارية، وتعزز وضوح المباني ليلاً، وتسهم في تشكيل معالم مميزة تستقطب الأنظار وتثري التجربة السياحية.',
    'تراعي <a href="/ar/services">حلول الإضاءة الخارجية التي نقدمها في المملكة العربية السعودية</a> الطابع المعماري العربي والإسلامي، مع إضفاء لمسة عصرية أنيقة. نصمم إضاءة تنسجم مع الثقافة المحلية وتُبرز جمال المباني التجارية والفنادق والمساجد والمعالم البارزة.'
  ],
  '#clients h2': 'أبرز عملائنا',
  '.contact-info h2': 'تواصل معنا',
  '.contact-info > p': 'هل أنت مستعد لإضاءة مشروعك؟ تواصل مع ستار لإضاءة الواجهات اليوم.',
  '.info-item': [
    '<strong>البريد الإلكتروني:</strong> <bdi dir="ltr">info@starfacadelighting.com</bdi>',
    '<strong>الهاتف:</strong> <bdi dir="ltr">+971 4 330 6778</bdi>، <i class="fab fa-whatsapp" style="color: #25D366;"></i> <bdi dir="ltr">+971 56 997 3500</bdi>',
    '<strong>نتواجد في:</strong> دبي | عُمان | قطر | المملكة العربية السعودية'
  ],
  '.footer-services h3': 'خدماتنا',
  '.service-list li': ['التصميم', 'التوريد', 'التركيب', 'عقود الصيانة السنوية'].map(s => '<i class="fas fa-check-circle"></i> ' + s),
  'button[type="submit"]': 'إرسال الطلب',
  'footer p': '&copy; 2026 ستار لإضاءة الواجهات. جميع الحقوق محفوظة.'
};
const imageAlt = {
  'Star Facade Lighting': 'ستار لإضاءة الواجهات',
  'Facade lighting services Saudi Arabia': 'خدمات إضاءة الواجهات في المملكة العربية السعودية',
  'Trinity Star Eco Energy Solutions': 'ترينيتي ستار لحلول الطاقة البيئية',
  'Kempinski Hotel & Residences': 'فندق ومساكن كمبينسكي',
  'Sheraton Grand Hotel': 'فندق شيراتون',
  'JW Marriott Marquis': 'جي دبليو ماريوت ماركيز',
  'Majid Al Futtaim': 'ماجد الفطيم', 'Emaar': 'إعمار', 'DAMAC': 'داماك',
  'Kempinski Hotels & Resorts': 'فنادق ومنتجعات كمبينسكي', 'Al Ansari Exchange': 'الأنصاري للصرافة',
  'JW Marriott Marquis Dubai': 'جي دبليو ماريوت ماركيز دبي', 'Nesto': 'نستو', 'Union Coop': 'تعاونية الاتحاد',
  'Mall of the Emirates': 'مول الإمارات', 'Fairmont The Palm Dubai': 'فيرمونت النخلة دبي',
  'Atlantis The Palm Dubai': 'أتلانتس النخلة دبي', 'Xtreme Zone': 'إكستريم زون', 'Fabyland': 'فابي لاند', 'Khaleej Times': 'خليج تايمز'
};
const fields = { name: ['Your Name', 'الاسم'], email: ['Your Email', 'البريد الإلكتروني'], project_type: ['Project Type', 'نوع المشروع'], message: ['Message / Project Requirements', 'الرسالة / متطلبات المشروع'] };
const pages = {
  '': { sections: null },
  about: { sections: ['about', 'why-us', 'clients', 'contact'], en: 'About us', ar: 'من نحن', desc: ['Discover Star Facade Lighting and our architectural LED lighting expertise across Saudi Arabia and the Middle East.', 'تعرف على ستار لإضاءة الواجهات وخبراتنا في حلول الإضاءة المعمارية بتقنية LED في السعودية والشرق الأوسط.'] },
  services: { sections: ['services', 'saudi-focus', 'contact'], en: 'Our Services', ar: 'خدماتنا', desc: ['Facade lighting design, supply, installation and annual maintenance services for architectural projects in Saudi Arabia.', 'خدمات تصميم وتوريد وتركيب إضاءة الواجهات وعقود الصيانة السنوية للمشاريع المعمارية في المملكة العربية السعودية.'] },
  projects: { sections: ['projects', 'contact'], en: 'Our Projects', ar: 'مشاريعنا', desc: ['Explore architectural facade lighting projects by Star Facade Lighting, including Kempinski, Sheraton and JW Marriott hotels in Dubai.', 'استعرض مشاريع ستار لإضاءة الواجهات، بما فيها الإضاءة المعمارية لفنادق كمبينسكي وشيراتون وجي دبليو ماريوت في دبي.'] },
  contact: { sections: ['contact'], en: 'Contact us', ar: 'تواصل معنا', desc: ['Contact Star Facade Lighting to discuss your Saudi Arabia architectural lighting project, request a consultation or get a quote.', 'تواصل مع ستار لإضاءة الواجهات لمناقشة مشروع الإضاءة المعمارية في السعودية، أو للحصول على استشارة وطلب عرض سعر.'] }
};
const url = (lang, page) => (lang === 'ar' ? '/ar' : '') + (page ? '/' + page : lang === 'ar' ? '' : '/');
for (const lang of ['en', 'ar']) {
  const ar = lang === 'ar';
  for (const [page, config] of Object.entries(pages)) {
    let rewriter = new HTMLRewriter();
    rewriter.on('html', { element(e) { e.setAttribute('lang', lang); if (ar) e.setAttribute('dir', 'rtl'); } });
    rewriter.on('head', { element(e) {
      e.append('<link rel="icon" href="/assets/logo.png">', { html: true });
      e.append(`<link rel="canonical" href="${origin}${url(lang, page)}"><link rel="alternate" hreflang="en-SA" href="${origin}${url('en', page)}"><link rel="alternate" hreflang="ar-SA" href="${origin}${url('ar', page)}"><link rel="alternate" hreflang="x-default" href="${origin}${url('en', page)}">`, { html: true });
      if (ar) e.append('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">', { html: true });
    } });
    if (ar || page) {
      rewriter.on('title', { element(e) { e.setInnerContent(page ? `${config[lang]} | ${ar ? 'ستار لإضاءة الواجهات السعودية' : 'Facade Lighting Saudi Arabia'}` : 'إضاءة الواجهات في السعودية | حلول الإضاءة المعمارية بتقنية LED'); } });
      rewriter.on('meta[name="description"]', { element(e) { e.setAttribute('content', page ? config.desc[ar ? 1 : 0] : 'حلول احترافية لإضاءة الواجهات والإضاءة المعمارية والخارجية بتقنية LED في الرياض وجدة والدمام ونيوم، من ترينيتي ستار لحلول الطاقة البيئية.'); } });
    }
    if (ar) {
      rewriter.on('meta[name="keywords"]', { element(e) { e.setAttribute('content', 'إضاءة الواجهات السعودية، الإضاءة المعمارية الرياض، الإضاءة الخارجية، حلول الإضاءة بتقنية LED، إضاءة المباني'); } });
      for (const [selector, value] of Object.entries(translations)) {
        let index = 0;
        rewriter.on(selector, { element(e) { e.setInnerContent(Array.isArray(value) ? value[index++] : value, { html: true }); } });
      }
      rewriter.on('img', { element(e) { const alt = e.getAttribute('alt'); if (!imageAlt[alt]) throw new Error('Missing image translation: ' + alt); e.setAttribute('alt', imageAlt[alt]); } });
    }
    rewriter.on('link[href="style.css"], script[src], img[src]', { element(e) {
      const attr = e.tagName === 'link' ? 'href' : 'src';
      const value = e.getAttribute(attr); if (!value.startsWith('/')) e.setAttribute(attr, '/' + value);
    } });
    const links = [['', 'Home', 'الرئيسية'], [null, 'Products', 'المنتجات'], ['services', 'Our Services', 'خدماتنا'], ['projects', 'Projects', 'مشاريعنا'], ['about', 'About us', 'من نحن'], ['contact', 'Contact us', 'تواصل معنا']];
    rewriter.on('header nav', { element(e) {
      e.setAttribute('aria-label', ar ? 'القائمة الرئيسية' : 'Main navigation');
      e.setInnerContent('<ul class="nav-links" id="main-navigation">' + links.map(([path, en, arabic]) => `<li><a href="${path === null ? 'https://starfacadelighting.com/facade-lighting-fixtures-products/' : url(lang, path)}"${path === 'contact' ? ' class="btn-sm"' : ''}${path === page ? ' aria-current="page"' : ''}>${ar ? arabic : en}</a></li>`).join('') + '</ul>', { html: true });
    } });
    rewriter.on('.nav-container', { element(e) {
      e.append(`<div class="language-switcher" dir="ltr" role="navigation" aria-label="${ar ? 'اختيار اللغة' : 'Choose language'}"><a href="${url('en', page)}" lang="en" hreflang="en-SA"${!ar ? ' aria-current="page"' : ''}>English</a><span aria-hidden="true">|</span><a href="${url('ar', page)}" lang="ar" hreflang="ar-SA"${ar ? ' aria-current="page"' : ''}>العربية</a></div><button class="menu-toggle" aria-controls="main-navigation" aria-expanded="false" aria-label="${ar ? 'فتح القائمة' : 'Open menu'}"><i class="fas fa-bars" aria-hidden="true"></i></button>`, { html: true });
    } });
    rewriter.on('.header-contact span', { element(e) { e.setAttribute('dir', 'ltr'); } });
    rewriter.on('.hero-btns a', { element(e) { e.setAttribute('href', url(lang, e.getAttribute('class').includes('btn-outline') ? 'projects' : 'contact')); } });
    for (const [name, labels] of Object.entries(fields)) rewriter.on(`[name="${name}"]`, { element(e) {
      e.setAttribute('aria-label', labels[ar ? 1 : 0]); e.setAttribute('placeholder', labels[ar ? 1 : 0]);
      e.setAttribute('dir', name === 'email' ? 'ltr' : 'auto');
      if (name === 'email' || name === 'name') e.setAttribute('autocomplete', name);
    } });
    rewriter.on('#contactForm', { element(e) { e.append(`<input type="hidden" name="lang" value="${lang}">`, { html: true }); } });
    rewriter.on('#formMessage', { element(e) { e.setAttribute('role', 'status'); e.setAttribute('aria-live', 'polite'); } });
    rewriter.on('.whatsapp-float', { element(e) { e.setAttribute('aria-label', ar ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'); } });
    rewriter.on('.social-icons a', { element(e) { const href = e.getAttribute('href'); const names = ar ? ['فيسبوك', 'إنستغرام', 'إكس', 'لينكد إن', 'يوتيوب'] : ['Facebook', 'Instagram', 'X', 'LinkedIn', 'YouTube']; const index = ['facebook', 'instagram', 'x.com', 'linkedin', 'youtube'].findIndex(s => href.includes(s)); e.setAttribute('aria-label', names[index]); e.setAttribute('rel', 'noopener noreferrer'); } });
    if (page) {
      rewriter.on('body', { element(e) { e.setAttribute('class', 'inner-page'); } });
      rewriter.on('section', { element(e) { if (!config.sections.includes(e.getAttribute('id'))) e.remove(); } });
    }
    let html = (await rewriter.transform(new Response(source)).text()).replace(/[\t ]+\r?$/gm, '');
    if (page) html = html.replace(/<h2>(.*?)<\/h2>/s, '<h1 class="page-title">$1</h1>');
    const dir = [ar ? 'ar' : '', page].filter(Boolean).join('/');
    if (dir) await mkdir(dir, { recursive: true });
    await Bun.write((dir ? dir + '/' : '') + 'index.html', html);
  }
}
console.log('Built 10 English and Arabic pages. Set SITE_URL to the production origin for absolute SEO URLs.');
