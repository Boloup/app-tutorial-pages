(() => {
  const config = window.TUTORIAL_CONFIG;
  const list = document.querySelector("#faq-list");

  document.querySelectorAll(".step-card").forEach((card, index) => {
    const header = card.querySelector(".step-header");
    const details = document.createElement("div");
    details.className = "step-details";
    details.id = `step-details-${index + 1}`;
    details.hidden = true;

    [...card.children].filter((child) => child !== header).forEach((child) => details.appendChild(child));

    const toggle = document.createElement("button");
    toggle.className = "step-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", details.id);
    toggle.innerHTML = `${header.innerHTML}<svg class="step-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`;
    header.replaceWith(toggle);
    card.appendChild(details);

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      details.hidden = open;
      card.classList.toggle("is-open", !open);
    });
  });

  const check = document.querySelector(".collapsible-check");
  const checkToggle = check.querySelector(".check-toggle");
  const checkDetails = check.querySelector(".check-details");
  checkToggle.addEventListener("click", () => {
    const open = checkToggle.getAttribute("aria-expanded") === "true";
    checkToggle.setAttribute("aria-expanded", String(!open));
    checkDetails.hidden = open;
    check.classList.toggle("is-open", !open);
  });

  config.faq.forEach((item, index) => {
    const entry = document.createElement("article");
    entry.className = "faq-item";
    entry.innerHTML = `<button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}"><span>${item.q}</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button><div class="faq-answer" id="faq-answer-${index}" hidden><p>${item.a}</p></div>`;
    const button = entry.querySelector("button");
    const answer = entry.querySelector(".faq-answer");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      answer.hidden = open;
      entry.classList.toggle("is-open", !open);
    });
    list.appendChild(entry);
  });

  document.querySelector("[data-back]").addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
  });
})();
