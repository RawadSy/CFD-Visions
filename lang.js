// Simple bilingual switcher EN/RU
const dict = {
  en: {
    "hero.title": "Computational Fluid Dynamics",
    "hero.subtitle": "Heat & Mass Transfer · Simulation",
    "hero.cta": "Request Simulation Meeting",
    "work.title": "Work Experience",
    "articles.title": "Scientific Articles",
    "articles.text": "List of publications by year.",
    "gallery.title": "Gallery",
    "contact.title": "Contact"
  },
  ru: {
    "hero.title": "Вычислительная гидродинамика",
    "hero.subtitle": "Тепломассообмен · Симуляция",
    "hero.cta": "Запросить встречу по моделированию",
    "work.title": "Опыт работы",
    "articles.title": "Научные статьи",
    "articles.text": "Список публикаций по годам.",
    "gallery.title": "Галерея",
    "contact.title": "Контакты"
  }
};

let currentLang = "en";

function switchLang(lang) {
  currentLang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(dict[lang][key]) el.textContent = dict[lang][key];
  });
}
