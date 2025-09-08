// RU/EN section titles & small UI strings.
// Content itself остаётся на русском как в резюме.
const I18N = {
  ru: {
    "nav.about": "Обо мне",
    "nav.education": "Образование",
    "nav.experience": "Опыт",
    "nav.interests": "Интересы/проекты",
    "nav.awards": "Грамоты",
    "nav.events": "Мероприятия",
    "nav.courses": "Курсы",
    "nav.publications": "Публикации",
    "nav.contact": "Контакты",

    "hero.cta": "Запросить встречу",
    "about.title": "Обо мне",
    "about.contacts": "Контактные данные",
    "about.languages": "Языки",
    "education.title": "Образование",
    "work.title": "Опыт работы",
    "interests.title": "Интересы и проекты",
    "awards.title": "Почётные грамоты и награды",
    "events.title": "Участие в научных и культурных мероприятиях",
    "courses.title": "Курсы повышения квалификации",
    "publications.title": "Публикации",
    "contact.title": "Контакты",
    "contact.text": "Напишите мне, чтобы обсудить сотрудничество, консультации или проекты CFD."
  },
  en: {
    "nav.about": "About",
    "nav.education": "Education",
    "nav.experience": "Experience",
    "nav.interests": "Interests/Projects",
    "nav.awards": "Awards",
    "nav.events": "Activities",
    "nav.courses": "Courses",
    "nav.publications": "Publications",
    "nav.contact": "Contact",

    "hero.cta": "Request a meeting",
    "about.title": "About",
    "about.contacts": "Contacts",
    "about.languages": "Languages",
    "education.title": "Education",
    "work.title": "Work Experience",
    "interests.title": "Interests & Projects",
    "awards.title": "Awards",
    "events.title": "Academic & Cultural Activities",
    "courses.title": "Professional Development",
    "publications.title": "Publications",
    "contact.title": "Contact",
    "contact.text": "Email me to discuss collaborations, consultations, or CFD projects."
  }
};

function switchLang(lang) {
  const dict = I18N[lang] || I18N.ru;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
}
