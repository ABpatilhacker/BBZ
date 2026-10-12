/* MGS site-wide interactions: navigation, reveal effects and contact email draft. */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  /* The header reflects the local demo session: signed-out visitors get a
     Sign in link; only a signed-in local demo profile sees My account. */
  const refreshAccountLink = () => {
    const accountLink = document.querySelector("[data-header-account]");
    if (!accountLink) return;
    let session = null;
    try { session = JSON.parse(localStorage.getItem("mgs-demo-session-v1") || "null"); } catch (_) { session = null; }
    accountLink.textContent = session && session.email ? "My account" : "Sign in";
    accountLink.href = session && session.email ? "account.html" : "login.html";
    accountLink.setAttribute("aria-label", session && session.email ? "My account" : "Sign in to your account");
  };
  refreshAccountLink();
  document.addEventListener("mgs:session-changed", refreshAccountLink);
  window.addEventListener("storage", refreshAccountLink);

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  };

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 16);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    document.body.classList.toggle("menu-open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
    link.addEventListener("click", closeMenu);
  });

  /* Reveal sections as they enter the viewport. */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal-section, .card, .solution-card, .sector-card, .metric-card").forEach((element) => {
      element.classList.add("reveal-item");
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll(".reveal-section, .card, .solution-card, .sector-card, .metric-card").forEach((element) => element.classList.add("is-visible"));
  }

  /* Fall back to the supplied product photograph until the owner uploads MGS-Brand.jpeg. */
  document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
    const applyFallback = () => {
      const fallback = image.dataset.fallbackSrc;
      if (!fallback || image.dataset.fallbackApplied === '1') return;
      image.dataset.fallbackApplied = '1';
      image.src = fallback;
    };
    image.addEventListener('error', applyFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) applyFallback();
  });

  /* Send the contact form to the PHP mail endpoint; never claim success until it confirms. */
  const form = document.querySelector('#contact-form');
  const formStatus = form?.querySelector('.form-status');
  const submitButton = form?.querySelector('button[type="submit"]');
  form?.querySelectorAll('input, textarea, select').forEach((field) => {
    if (field.name === 'website') return; // spam honeypot
    field.addEventListener('blur', () => field.classList.toggle('invalid', !field.checkValidity()));
    field.addEventListener('input', () => { if (field.checkValidity()) field.classList.remove('invalid'); });
  });
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!formStatus) return;
    const fields = [...form.querySelectorAll('input:not([name="website"]), textarea, select')];
    const valid = fields.every((field) => {
      field.classList.toggle('invalid', !field.checkValidity());
      return field.checkValidity();
    });
    if (!valid) {
      formStatus.textContent = 'Please review the highlighted fields.';
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    if (submitButton) { submitButton.disabled = true; submitButton.dataset.originalText = submitButton.textContent.trim(); submitButton.textContent = 'Sending inquiry…'; }
    formStatus.textContent = 'Sending your inquiry securely…';
    try {
      const bootResponse = await fetch('api/index.php?action=bootstrap', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      const boot = await bootResponse.json();
      if (!boot?.csrfToken) throw new Error('Could not establish a secure contact session. Please email info@mercuryglobalsystems.com directly.');
      const response = await fetch('api/contact.php', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-Token': boot.csrfToken },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'Your inquiry could not be sent. Please email info@mercuryglobalsystems.com directly.');
      formStatus.textContent = 'Thank you. Your inquiry has been sent to BULK BY ZONE.';
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Your inquiry could not be sent.';
      formStatus.textContent = `${message} `;
      const fallbackLink = document.createElement('a');
      fallbackLink.href = 'mailto:info@mercuryglobalsystems.com?subject=Website%20enquiry%20for%20BULK%20BY%20ZONE';
      fallbackLink.textContent = 'Open email';
      formStatus.appendChild(fallbackLink);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit inquiry <span aria-hidden="true">↗</span>';
      }
    }
  });
});
