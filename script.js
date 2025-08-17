const translations = {
  en: {
    work: "Work",
    work-text: "Experience in advanced CFD modeling, focusing on heat exchangers, multiphase flows, and thermal systems.",
    articles: "Articles",
    gallery: "Gallery",
    contact: "Contact",
    contact-text: "Interested in collaboration or requesting a simulation?",
    contact-cta: "Get in Touch",
    hero-title: "Heat & Mass Transfer CFD Simulations",
    hero-text: "Professional portfolio in computational fluid dynamics.",
    hero-cta: "Request a Simulation Meeting"
  },
  ru: {
    work: "Работы",
    work-text: "Опыт в области CFD моделирования: теплообменники, многофазные потоки и тепловые системы.",
    articles: "Статьи",
    gallery: "Галерея",
    contact: "Контакты",
    contact-text: "Интересует сотрудничество или заказ симуляции?",
    contact-cta: "Связаться",
    hero-title: "CFD моделирование тепло- и массообмена",
    hero-text: "Профессиональное портфолио по вычислительной гидродинамике.",
    hero-cta: "Запросить встречу по симуляции"
  }
};

function setLang(lang) {
  document.querySelectorAll("[data-key]").forEach(el=>{
    const key = el.getAttribute("data-key");
    el.innerText = translations[lang][key];
  });
}
