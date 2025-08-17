const translations = {
  en: {
    work: "Work Experience",
    articles: "Scientific Articles",
    gallery: "Photos & Videos",
    contact: "Contact",
    cta: "Interested in CFD modeling? Contact me to discuss your project!",
    "cta-btn": "Request Meeting"
  },
  ru: {
    work: "Опыт работы",
    articles: "Научные статьи",
    gallery: "Фото и видео",
    contact: "Контакты",
    cta: "Интересует CFD-моделирование? Свяжитесь со мной для обсуждения проекта!",
    "cta-btn": "Запросить встречу"
  }
};

function setLang(lang) {
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    el.textContent = translations[lang][key];
  });
}
