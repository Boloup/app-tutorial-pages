(function(){
  const cfg=window.ACTIVITY_CONFIG;
  const root=document.documentElement;
  const locale=document.body.dataset.locale||new URLSearchParams(location.search).get("lang")||cfg.defaultLocale;
  const active=cfg.locales[locale]||cfg.locales[cfg.defaultLocale];
  root.lang=locale;root.dir=active.dir;document.title=active.title;
  const icon=(name,cls="")=>`<i data-lucide="${name}"${cls?` class="${cls}"`:""}></i>`;
  const faqs=active.faq.map((item,index)=>`<article class="faq-item"><button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-${index}">${icon("circle-help")}<span>${item.q}</span>${icon("chevron-down","chevron")}</button><div class="faq-answer" id="faq-${index}"><p>${item.a}</p></div></article>`).join("");
  document.getElementById("app").innerHTML=`<div class="page ${active.dir==="rtl"?"rtl":""}">
    <nav class="top-safe-nav" aria-label="Back"><button class="icon-button" type="button" data-action="back" aria-label="Back">${icon("chevron-left")}</button></nav>
    <header class="hero"><img class="hero-art" src="${cfg.heroAsset}" alt=""><div class="hero-copy"><h1 class="hero-title">${active.heroPrefix} <strong>${active.heroAmount}</strong> ${active.heroSuffix}</h1><p class="hero-sub">${active.heroSub}</p><p class="hero-note">${active.heroNote}</p></div></header>
    <div class="content">
      <section class="notice"><span class="badge">${icon("megaphone")}</span><div><h2>${active.noticeTitle}</h2><p>${active.noticeText}</p></div></section>
      <section class="decision-title"><h2>${active.decisionTitle}</h2></section>
      <div class="question"><span class="badge">${icon("user-round")}</span><span>${active.question}</span></div>
      <div class="connector"><div class="branch-labels"><span class="branch-label yes">${active.yes}</span><span class="branch-label no">${active.no}</span></div></div>
      <section class="branches">
        <article class="scenario new"><span class="badge">${icon("user-round-plus")}</span><h3>${active.newTitle}</h3><span class="pill">${active.newPill}</span><p>${active.newText}</p><p class="scenario-extra"><strong>${active.newExtra}</strong></p></article>
        <article class="scenario existing"><span class="badge">${icon("user-round-x")}</span><h3>${active.existingTitle}</h3><span class="pill">${active.existingPill}</span><p>${active.existingText}</p><p class="scenario-extra">${icon("triangle-alert")}<strong>${active.existingExtra}</strong></p></article>
      </section>
      <section class="difference"><div class="difference-head"><span class="badge">${icon("circle-help")}</span><div><h2>${active.whyTitle}</h2><p>${active.whyText}</p></div></div><div class="comparison"><div class="compare-card">${icon("clock-3")}<div><strong>${active.before}</strong>${active.beforeText}</div></div><div class="compare-arrow">${icon("arrow-right")}</div><div class="compare-card">${icon("sparkles")}<div><strong>${active.now}</strong>${active.nowText}</div></div></div></section>
      <section class="warning"><span class="badge">${icon("shield-alert")}</span><div><h2>${active.warningTitle}</h2><p>${active.warningText}</p></div></section>
      <section class="faq">${faqs}</section>
      <a class="cta" href="${cfg.privateChatGuideUrl}" data-action="guide">${icon("messages-square")}<span>${active.cta}</span>${icon("chevron-right","end")}</a>
    </div><div class="bottom-safe"></div></div>`;
  if(window.lucide)window.lucide.createIcons();
  document.querySelector('[data-action="back"]').addEventListener("click",()=>{if(history.length>1)history.back();else window.dispatchEvent(new CustomEvent("activity:back"));});
  document.querySelectorAll(".faq-question").forEach(btn=>btn.addEventListener("click",()=>{const item=btn.closest(".faq-item");const open=item.classList.toggle("open");btn.setAttribute("aria-expanded",String(open));}));
  document.querySelector('[data-action="guide"]').addEventListener("click",event=>{if(cfg.privateChatGuideUrl.startsWith("#")){event.preventDefault();window.dispatchEvent(new CustomEvent("activity:open-private-chat-guide",{detail:{locale}}));}});
})();
