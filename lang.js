const dict={
  en:{
    "hero.title":"Computational Fluid Dynamics",
    "hero.subtitle":"Heat & Mass Transfer · Simulation",
    "hero.cta":"Request Simulation Meeting",
    "edu.title":"Education",
    "work.title":"Work Experience",
    "awards.title":"Honors & Awards",
    "events.title":"Events & Conferences",
    "gallery.title":"Gallery",
    "contact.title":"Contact"
  },
  ru:{
    "hero.title":"Вычислительная гидродинамика",
    "hero.subtitle":"Тепломассообмен · Симуляция",
    "hero.cta":"Запросить встречу",
    "edu.title":"Образование",
    "work.title":"Опыт работы",
    "awards.title":"Почетные грамоты",
    "events.title":"Участие в мероприятиях",
    "gallery.title":"Галерея",
    "contact.title":"Контакты"
  }
};

function switchLang(lang){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.getAttribute("data-i18n");
    if(dict[lang][key]) el.textContent=dict[lang][key];
  });
}
