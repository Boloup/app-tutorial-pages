(function () {
  const config = window.ACTIVITY_CONFIG;
  const app = document.getElementById("app");
  const modal = document.getElementById("image-modal");

  function requestedLocale() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query && config.supportedLocales.includes(query)) return query;
    return config.defaultLocale;
  }

  async function loadCopy(locale) {
    const response = await fetch(config.localeFiles[locale]);
    if (!response.ok) throw new Error(`Unable to load locale: ${locale}`);
    return response.json();
  }

  function icon(name, className = "") {
    return `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;
  }

  function pathSteps(steps, icons) {
    return steps.map((step, index) => `
      <li class="path-step">
        <span class="step-number">${index + 1}</span>
        <span class="step-icon">${icon(icons[index])}</span>
        <span class="step-copy">${step}</span>
      </li>`).join("");
  }

  function faqRows(items) {
    return items.map((item) => `
      <div class="faq-row">
        <span class="faq-q">Q</span>
        <strong>${item.question}</strong>
        <span>${item.answer}</span>
        ${icon("chevron-right")}
      </div>`).join("");
  }

  function taskButton(task, index) {
    const taskIcon = task.icon === "coin"
      ? `<img src="${config.assets.coin}" alt="" />`
      : icon(task.icon);
    return `
      <button class="task-tab${index === 0 ? " is-active" : ""}" type="button" data-task="${index}" aria-selected="${index === 0}">
        <span class="task-tab__icon">${taskIcon}</span>
        <span><strong>${task.title}</strong><small>${task.description}</small></span>
      </button>`;
  }

  function render(copy, locale) {
    document.documentElement.lang = locale;
    document.title = copy.subtitle;
    app.innerHTML = `
      <nav class="top-safe-nav" aria-label="${copy.backLabel}">
        <button class="back-button" type="button" aria-label="${copy.backLabel}">${icon("arrow-left")}</button>
      </nav>

      <header class="hero">
        <div class="hero__copy">
          <h1>${copy.title}</h1>
          <p>${copy.subtitle}</p>
        </div>
        <div class="hero__art" aria-hidden="true">
          <i data-lucide="sparkles" class="hero__spark hero__spark--one"></i>
          <i data-lucide="sparkles" class="hero__spark hero__spark--two"></i>
          <img class="hero__diamond" src="${config.assets.diamond}" alt="" />
          <img class="hero__coin" src="${config.assets.coin}" alt="" />
        </div>
      </header>

      <main class="main-card">
        <section class="paths-section">
          <h2 class="section-ribbon">${copy.pathsTitle}</h2>
          <div class="paths-grid">
            <article class="path-card path-card--invite">
              <h3><span>${icon("link")}</span>${copy.invite.label}</h3>
              <ol>${pathSteps(copy.invite.steps, ["mouse-pointer-click", "share-2", "smartphone", "download"])}</ol>
            </article>
            <article class="path-card path-card--recruit">
              <h3><span><img src="${config.assets.recruitIcon}" alt="" /></span>${copy.recruit.label}</h3>
              <ol>${pathSteps(copy.recruit.steps, ["message-circle", "message-square", "send", "users"])}</ol>
            </article>
          </div>
          <div class="convergence-card">
            <img src="${config.assets.coin}" alt="" />
            <p>${copy.bothBonuses}</p>
          </div>
        </section>

        <section class="walkthrough-grid">
          <article class="walkthrough-card referral-card">
            <div class="walkthrough-heading">
              <span>${icon("link")}</span>
              <div><h2>${copy.referral.title}</h2><p>${copy.referral.description}</p></div>
            </div>
            <label>${copy.referral.fieldLabel}</label>
            <div class="referral-field">${config.maskedReferralLink}</div>
            <div class="share-options">
              <div class="share-option"><span>${icon("copy")}</span><small>${copy.referral.copy}</small></div>
              <div class="share-option"><span class="brand-icon brand-icon--whatsapp"><img src="./assets/icons/whatsapp.svg" alt="" /></span><small>WhatsApp</small></div>
              <div class="share-option"><span class="brand-icon brand-icon--facebook"><img src="./assets/icons/facebook.svg" alt="" /></span><small>Facebook</small></div>
            </div>
          </article>

          <article class="walkthrough-card recruit-card">
            <div class="walkthrough-heading">
              <span class="recruit-heading-icon"><img src="${config.assets.recruitIcon}" alt="" /></span>
              <div><h2>${copy.recruitPanel.title}</h2><p>${copy.recruitPanel.description}</p></div>
            </div>
            <button class="recruit-visual" type="button" aria-label="${copy.recruitPanel.enlargeLabel}">
              <img src="${config.assets.recruitTutorial}" alt="" />
              <span class="recruit-caption">${copy.recruitPanel.caption}</span>
            </button>
          </article>
        </section>

        <aside class="verification-notice">
          <img src="${config.assets.coin}" alt="" />
          <strong>${copy.verification}</strong>
          <img src="${config.assets.diamond}" alt="" />
        </aside>

        <section class="tasks-section">
          <h2>${copy.tasksTitle}</h2>
          <div class="task-tabs" role="tablist">
            ${copy.tasks.map(taskButton).join("")}
          </div>
        </section>

        <section class="faq-section">
          <h2>${copy.quickTips}</h2>
          <div class="faq-list">${faqRows(copy.faqs)}</div>
        </section>
      </main>`;

    wireInteractions();
    if (window.lucide) window.lucide.createIcons();
  }

  function wireInteractions() {
    document.querySelector(".back-button").addEventListener("click", () => {
      if (window.history.length > 1) window.history.back();
    });

    document.querySelectorAll(".task-tab").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".task-tab").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });
      });
    });

    document.querySelector(".recruit-visual").addEventListener("click", () => {
      modal.hidden = false;
      document.body.classList.add("modal-open");
    });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  modal.querySelector(".image-modal__close").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  loadCopy(requestedLocale())
    .then((copy) => render(copy, requestedLocale()))
    .catch((error) => {
      console.error(error);
      app.innerHTML = '<p class="load-error">Unable to load the tutorial.</p>';
    });
})();
