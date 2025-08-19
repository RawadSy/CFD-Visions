let currentLang = "ru";

const translations = {
  ru: {
    "hero.title": "Вычислительная гидродинамика",
    "hero.subtitle": "Тепломассообмен · Симуляция",
    "hero.cta": "Запросить встречу",
    "education.title": "Образование",
    "education.text": "Здесь информация об образовании...",
    "work.title": "Опыт работы",
    "work.text": "Опыт работы и проекты...",
    "awards.title": "Почетные грамоты",
    "awards.text": "Дипломы, награды...",
    "events.title": "Мероприятия",
    "events.text": "Конференции, публикации...",
    "gallery.title": "Галерея",
    "gallery.text": "Фотографии и CFD-визуализации...",
    "contact.title": "Контакты",
    "contact.text": "Email: example@mail.com"
  },
  en: {
    "hero.title": "Computational Fluid Dynamics",
    "hero.subtitle": "Heat & Mass Transfer · Simulation",
    "hero.cta": "Request a meeting",
    "education.title": "Education",
    "education.text": "Here is information about education...",
    "work.title": "Work Experience",
    "work.text": "Work experience and projects...",
    "awards.title": "Awards",
    "awards.text": "Diplomas, certificates...",
    "events.title": "Events",
    "events.text": "Conferences, publications...",
    "gallery.title": "Gallery",
    "gallery.text": "Photos and CFD visualizations...",
    "contact.title": "Contact",
    "contact.text": "Email: example@mail.com"
  }
};

function switchLang(lang){
  currentLang = lang;
  applyTranslations();
}

function applyTranslations(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(translations[currentLang] && translations[currentLang][key]){
      el.textContent = translations[currentLang][key];
    }
  });
}
