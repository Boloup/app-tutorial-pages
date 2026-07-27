(function () {
  "use strict";

  const config = window.YAGO_REWARDS_CONFIG;
  const numberFormat = new Intl.NumberFormat("en-US");
  const list = document.querySelector("[data-winner-list]");
  const action = document.querySelector("[data-list-action]");
  const loadMore = document.querySelector("[data-load-more]");
  const status = document.querySelector("[data-list-status]");

  const winners = [...config.winners].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return Number(a.uid) - Number(b.uid);
  });

  let visibleCount = Math.min(config.initialVisibleCount, winners.length);
  let loading = false;

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function winnerMarkup(winner, index) {
    const rank = index + 1;
    const tierClass = rank === 1 ? " is-first" : rank <= 3 ? " is-top-three" : "";
    return `
      <li class="winner-card${tierClass}">
        <span class="rank" aria-label="Rank ${rank}">${rank}</span>
        <span class="winner-identity">
          <strong class="nickname" title="${escapeHtml(winner.nickname)}">${escapeHtml(winner.nickname)}</strong>
          <span class="uid">${escapeHtml(winner.uid)}</span>
        </span>
        <span class="reward">
          <img src="./assets/points-heart.webp" alt="" />
          <span class="reward-copy">
            <strong>${numberFormat.format(winner.points)}</strong>
            <span>Points</span>
          </span>
        </span>
      </li>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderList() {
    list.innerHTML = winners.slice(0, visibleCount).map(winnerMarkup).join("");
    const hasMore = visibleCount < winners.length;
    action.hidden = !hasMore;
    loadMore.hidden = !hasMore;
    status.hidden = true;
  }

  function renderSummary() {
    const total = winners.reduce((sum, winner) => sum + winner.points, 0);
    const highest = winners.reduce((max, winner) => Math.max(max, winner.points), 0);
    setText("[data-total-points]", numberFormat.format(total));
    setText("[data-summary-points]", numberFormat.format(total));
    setText("[data-winner-count]", String(winners.length));
    setText("[data-highest-reward]", numberFormat.format(highest));
    setText("[data-period]", config.period);
    setText("[data-footer-copy]", config.footerCopy);
  }

  loadMore.addEventListener("click", function () {
    if (loading) return;
    loading = true;
    loadMore.hidden = true;
    status.textContent = "Loading...";
    status.hidden = false;

    window.setTimeout(function () {
      visibleCount = winners.length;
      loading = false;
      renderList();
    }, config.loadingDelayMs);
  });

  document.querySelector("[data-refresh-button]").addEventListener("click", function () {
    window.location.reload();
  });

  document.querySelector("[data-back-button]").addEventListener("click", function () {
    if (window.history.length > 1) window.history.back();
  });

  renderSummary();
  renderList();
})();
