/* Keep the reader on the same section when switching Korean and Arabic. */
(() => {
  const syncLanguageLinks = () => {
    const hash = window.location.hash;
    const targetId = hash.startsWith("#") ? hash.slice(1) : "";
    const validHash = targetId && document.getElementById(targetId) ? hash : "";

    document.querySelectorAll("[data-language-link]").forEach((link) => {
      const destination = link.dataset.languageTarget;
      if (destination) link.setAttribute("href", `${destination}${validHash}`);
    });
  };

  syncLanguageLinks();
  window.addEventListener("hashchange", syncLanguageLinks);

  const progress = document.querySelector(".scroll-progress");
  const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
  };

  let frame;
  const requestProgressUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      updateProgress();
      frame = undefined;
    });
  };

  updateProgress();
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);

  if ("IntersectionObserver" in window && sections.length) {
    const setCurrentLink = (id) => {
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${id}`;
        link.toggleAttribute("aria-current", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrentLink(visible.target.id);
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.2, 0.5] });

    sections.forEach((section) => observer.observe(section));
  }
})();
