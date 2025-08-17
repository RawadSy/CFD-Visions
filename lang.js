// Simple language toggle (English/Русский)
const translations = {
  en: {
    work: "Work Experience",
    articles: "Scientific Articles",
    gallery: "Gallery",
    contact: "Contact"
  },
  ru: {
    work: "Опыт работы",
    articles: "Научные статьи",
    gallery: "Галерея",
    contact: "Контакты"
  }
};

function setLanguage(lang) {
  document.querySelector('#work h2').textContent = translations[lang].work;
  document.querySelector('#articles h2').textContent = translations[lang].articles;
  document.querySelector('#gallery h2').textContent = translations[lang].gallery;
  document.querySelector('#contact h2').textContent = translations[lang].contact;
}

// Default to English
setLanguage('en');