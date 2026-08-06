// ---------- Navigation (SPA-style tabs) ----------
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('[data-page]');
const mobileMenu = document.getElementById('mobileMenu');
const burgerBtn = document.getElementById('burgerBtn');

function goToPage(pageId){
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + pageId));
  navButtons.forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
  mobileMenu.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  history.replaceState(null, '', '#' + pageId);
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => goToPage(btn.dataset.page));
});

burgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// load page from hash on first load
const initial = window.location.hash.replace('#', '') || 'home';
if (document.getElementById('page-' + initial)) {
  goToPage(initial);
}

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Projects filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.g-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.filter === filter;
      item.hidden = !show;
    });
  });
});

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTag = document.getElementById('lightboxTag');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const tag = item.querySelector('.g-caption span');
    const title = item.querySelector('.g-caption p');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTag.textContent = tag ? tag.textContent : '';
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ---------- Contact form (Formspree) ----------
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const action = contactForm.getAttribute('action');
  if (!action || action.includes('YOUR_FORM_ID')) {
    formMsg.textContent = 'Formulário ainda não está ligado a um serviço de envio de email. Veja as instruções para configurar o Formspree.';
    formMsg.className = 'form-msg err show';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'A enviar...';
  formMsg.className = 'form-msg';

  try {
    const res = await fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    });

    if (res.ok) {
      formMsg.textContent = 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.';
      formMsg.className = 'form-msg ok show';
      contactForm.reset();
    } else {
      formMsg.textContent = 'Não foi possível enviar a mensagem. Tente novamente ou envie um email diretamente para info@blupower.energy.';
      formMsg.className = 'form-msg err show';
    }
  } catch (err) {
    formMsg.textContent = 'Erro de ligação. Tente novamente ou envie um email diretamente para info@blupower.energy.';
    formMsg.className = 'form-msg err show';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enviar Mensagem <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});
