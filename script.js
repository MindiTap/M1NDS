/* =============================================
   M1NDS Portfolio — script.js
   ============================================= */

// ── EmailJS init ──────────────────────────────
emailjs.init("Ztq_bxVBSf1VU3sbQ");

// ── Хедер при скролле ────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('header')
    .classList.toggle('scrolled', window.scrollY > 100);
});

// ── Анимация при скролле ─────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');

        // Запуск прогресс-баров внутри #skills
        if (entry.target.closest('#skills')) {
          const bar = entry.target.querySelector('.progress-inner');
          if (bar && bar.dataset.width) {
            bar.style.width = bar.dataset.width + '%';
          }
        }
      }, idx * 120);
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -120px 0px' });

document.querySelectorAll('.section-title, .project-card, .skill-item')
  .forEach(el => observer.observe(el));

// ── Модальное окно для проектов ───────────────
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-content">
    <button class="modal-close">&times;</button>
    <div class="modal-image">
      <img id="modalImg" src="" alt="project preview">
    </div>
    <div class="modal-body">
      <h3 id="modalTitle"></h3>
      <p  id="modalDesc"></p>
      <a  id="modalLink" href="#" target="_blank"
          class="btn btn-primary"
          style="display:inline-block; text-align:center;">
        Открыть проект
      </a>
    </div>
  </div>
`;
document.body.appendChild(modal);

const closeModalBtn = modal.querySelector('.modal-close');
const modalImg      = document.getElementById('modalImg');
const modalTitle    = document.getElementById('modalTitle');
const modalDesc     = document.getElementById('modalDesc');
const modalLink     = document.getElementById('modalLink');

// Открытие модалки по кнопке «Открыть» на карточке
document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.project-card');
    if (!card) return;

    const title  = card.getAttribute('data-title') || 'Проект';
    const desc   = card.getAttribute('data-desc')  || 'Описание проекта';
    const link   = card.getAttribute('data-link')  || '#';
    const imgSrc = card.getAttribute('data-img')   || '';

    modalTitle.textContent = title;
    modalDesc.textContent  = desc;
    modalImg.src           = imgSrc;
    modalLink.href         = link;

    // Прячем кнопку если ссылки нет
    modalLink.style.display = (link === '#' || !link) ? 'none' : 'inline-block';

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 20);
    document.body.style.overflow = 'hidden';
  });
});

// Закрытие модалки
function closeModal() {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 400);
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// ── Форма обратной связи ─────────────────────
const formEl   = document.getElementById('contactForm');
const popupEl  = document.getElementById('popup');
let lastSubmitTime = 0;

formEl.addEventListener('submit', function (e) {
  e.preventDefault();

  const name     = document.getElementById('name');
  const email    = document.getElementById('email');
  const telegram = document.getElementById('telegram');
  const message  = document.getElementById('message');

  // Валидация обязательных полей
  let isValid = true;
  [name, email, message].forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  if (!isValid) return;

  // Простая проверка email
  const emailVal = email.value.trim();
  if (!emailVal.includes('@') || !emailVal.includes('.')) {
    email.classList.add('error');
    return;
  } else {
    email.classList.remove('error');
  }

  // Защита от частой отправки (5 сек)
  if (Date.now() - lastSubmitTime < 5000) {
    alert('Пожалуйста, подождите несколько секунд перед повторной отправкой.');
    return;
  }
  lastSubmitTime = Date.now();

  // Параметры для EmailJS
  const templateParams = {
    name:     name.value.trim(),
    email:    email.value.trim(),
    telegram: telegram.value.trim(),
    message:  message.value.trim(),
    to_email: 'MindiTap@gmail.com'
  };

  // Основное письмо
  emailjs.send('service_9dhwprz', 'template_wdysslj', templateParams)
    .then(() => {
      // Автоответ пользователю
      const autoReplyParams = {
        name:    name.value.trim(),
        email:   email.value.trim(),
        message: 'Спасибо за обращение! Я свяжусь с тобой в ближайшее время.'
      };
      emailjs.send('service_9dhwprz', 'template_magnjkg', autoReplyParams)
        .catch(err => console.log('auto-reply error:', err));

      // Попап успеха
      popupEl.classList.add('show');
      setTimeout(() => popupEl.classList.remove('show'), 3000);

      // Очистка формы
      formEl.reset();
    })
    .catch((error) => {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке. Попробуй написать в Telegram напрямую.');
    });
});
